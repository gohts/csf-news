import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Country, NewsArticle } from '../models';
import { NewsDatabase } from '../news.database';
import { NewsHttpService } from '../newshttp.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {

  country
  apiKey
  retrievedArticle
  articles: NewsArticle[]
  

  constructor(private newsDB: NewsDatabase, private activatedRoute: ActivatedRoute, private newsHttp: NewsHttpService, private router: Router) { }

  async ngOnInit() {
    const isoCode = this.activatedRoute.snapshot.params['country']

    // get country iso code
    await this.newsDB.getCountry(isoCode)
      .then(res => {
        this.country = res[0]['countryName']
      })

    // get saved api key from database
    await this.newsDB.getApiKey()
      .then(res => {
          this.apiKey = res[0].apiKey
      })

    // check database for news
    await this.newsDB.getNewsArticle(isoCode)
      .then(res => {
        console.log(res);
        
        if (res.length < 0){
          this.articles = res
          console.log('>>>Retrieved from database',this.articles);
        } else {
          // get news from api
          this.newsHttp.getNews(isoCode, this.apiKey)
            .then(res => {
              this.retrievedArticle = res.articles;
              this.articles = this.retrievedArticle.map(
                r => {
                  return {
                    country: isoCode,
                    retrieveTime: Date(),
                    save: false,
                    sourceName: r.source.name,
                    author: r.author,
                    title: r.title,
                    description: r.description,
                    url: r.url,
                    urlToImage: r.urlToImage,
                    publishedAt: r.publishedAt,
                    content: r.content
                  } as NewsArticle
                }
              );
              console.log('>>>Retrieved from http',this.articles);
              
              this.newsDB.addNewsArticle(this.articles);        
            })
        }

      })


    
  }


  // res.articles.map(r => {
  //   return {
  //     sourceName: r.articles.source.name,
  //     author: r.articles.author,
  //     title: r.articles.title,
  //     description: r.articles.description,
  //     url: r.articles.url,
  //     urlToImage: r.articles.urlToImage,
  //     publishedAt: r.articles.publishedAt,
  //     content: r.articles.content,
  //   }
  // })


  // this.countryList = res.map(r => {
  //   return {
  //     isoCode: r.alpha2Code,
  //     countryName: r.name,
  //     flagUrl: r.flag,
  //   } as Country
  // })

}
