import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { ApiKey, Country, NewsArticle } from './models';

@Injectable()
export class NewsDatabase extends Dexie {

    private apiKeySettings: Dexie.Table<ApiKey,number>;

    private countryList: Dexie.Table<Country, string>;

    private newsArticles: Dexie.Table<NewsArticle, string>;

    constructor () {
        super ('newsDB')
        this.version(1).stores({
            apiKeySettings: '++id, apiKey',
            countryList: 'isoCode',
            newsArticles: 'url, country, retrieveTime'
        })
        this.apiKeySettings = this.table('apiKeySettings');
        this.countryList = this.table('countryList');
        this.newsArticles = this.table('newsArticles');
    }

    // API KEY COLLECTION
    // get ApiKey
    getApiKey(): Promise<ApiKey[]> {        
        return this.apiKeySettings.toArray()
    }

    // add ApiKey
    addApiKey(k: ApiKey): Promise<any> {
        return this.apiKeySettings.put(k)
    }

    // delete ApiKey
    deleteApiKey(k: ApiKey): Promise<any> {        
        return this.apiKeySettings
            .where('apiKey').equals(k.apiKey)
            .delete()
    }

    // COUNTRY LIST COLLECTION
    // get CountryList
    getCountryList(): Promise<Country[]> {
        return this.countryList
            .toArray()
    }

    // get Country
    getCountry(c: string): Promise<Country> {
        return this.countryList
            .where('isoCode').equalsIgnoreCase(c)
            .toArray()
            .then(result => {
                if (result.length > 0)
                    return result[0]
                return null
            })
    }

    // add CountryList
    addCountryList(c: Country[]): Promise<any> {
        return this.countryList.bulkPut(c)
    }

    // NEWS ARTICLE COLLECTION
    // get news article
    getNewsArticle(c: string): Promise<NewsArticle[]> {
        return this.newsArticles
            .where('country').equalsIgnoreCase(c)
            .toArray()
    }

    // add news articles
    addNewsArticle(n: NewsArticle[]): Promise<any> {
        return this.newsArticles.bulkPut(n)
    }

    // delete articles greater than 5 minutes and not makred as save
    clearOldNewsArticle(country: string):Promise<any> {
        return this.newsArticles
            .where('retrieveTime').below(Date.now()-300000)
                .and(function(item) { return (item.save != true && item.country == country)})
                    .delete()
    }

    // save articles
    saveNewsArticle(url: string, country: string, value:boolean):Promise<any> {
        return this.newsArticles
            .where({
                'url':url,
                'country':country
            })
            .modify({'save': value})
    }

}