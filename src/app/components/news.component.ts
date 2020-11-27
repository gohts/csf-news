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
  retrievedArticle
  articles: NewsArticle[]
  
  constructor(private newsDB: NewsDatabase, private activatedRoute: ActivatedRoute, private newsHttp: NewsHttpService, private router: Router) { }

  async ngOnInit() {
    this.isoCode = this.activatedRoute.snapshot.params['country'].toUpperCase()

    // get country iso code
    await this.newsDB.getCountry(this.isoCode)
      .then(res => {
        this.country = res[0]['countryName']
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

          if (res[0].retrieveTime < Date.now() - 300000 ) {
            console.log('From http clear cache');
            await this.clearDbCache()
            await this.getNewsFromHttp();
          } else {
            console.log('From db');
            this.articles = res;
          }
          
        } else {
          console.log('From http no cache');
          await this.getNewsFromHttp();
        }
      })
  }

  async getNewsFromHttp() {
    await this.newsHttp.getNews(this.isoCode, this.apiKey)
      .then(res => {
        this.retrievedArticle = res.articles;
        this.articles = this.retrievedArticle.map(
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
        );
      })
      await this.newsDB.addNewsArticle(this.articles);
    }

  async clearDbCache() {
    await this.newsDB.clearOldNewsArticle(this.isoCode);
  }

  async saveArticle(url, $event) {
    await this.newsDB.saveNewsArticle(url, this.isoCode,$event.target.checked)
  }
}