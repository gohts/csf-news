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
  isoCode
  apiKey
  dbArticle
  articles: NewsArticle[]
  
  constructor(private newsDB: NewsDatabase, private activatedRoute: ActivatedRoute, private newsHttp: NewsHttpService, private router: Router) { }

  async ngOnInit() {
    this.isoCode = this.activatedRoute.snapshot.params['country'].toUpperCase()

    // get country iso code
    await this.newsDB.getCountry(this.isoCode)
      .then(res => {
        this.country = res['countryName']
      })

    // get saved api key from database
    await this.newsDB.getApiKey()
      .then(res => {
          this.apiKey = res[0].apiKey
      })

    // check database for news
    await this.newsDB.getNewsArticle(this.isoCode)
      .then(async res => {
        if (res.length != 0) {

          if (res[0].retrieveTime < ( Date.now() - 300000 )) {
            console.log('From http clear cache');
            await this.clearDbCache() 
            await this.getNewsFromHttp();
          } else {
            console.log('From db');
            this.articles = res.filter(e => e.retrieveTime > ( Date.now() - 300000 ));
          }
          
        } else {
          console.log('From http no cache');
          await this.getNewsFromHttp();
        }
      })
  }

  async getNewsFromHttp() {
    let retrievedList
    let savedList = await this.newsDB.getNewsArticle(this.isoCode)
      .then(result => result.map(e => e.url))
    
    await this.newsHttp.getNews(this.isoCode, this.apiKey)
      .then(res => {
        retrievedList = res.articles.map(
          r => {
            return {
              country: this.isoCode,
              retrieveTime: Date.now(),
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
        ).filter(e => !savedList.includes(e.url))
      })
      await this.newsDB.addNewsArticle(retrievedList);

      this.articles = await this.newsDB.getNewsArticle(this.isoCode)
      .then(result => {return result.filter(e => e.retrieveTime > ( Date.now() - 300000 ))})
    }

  async clearDbCache() {
    await this.newsDB.clearOldNewsArticle(this.isoCode);
  }

  async saveArticle(url, $event) {
    await this.newsDB.saveNewsArticle(url, this.isoCode,$event.target.checked)
  }

}