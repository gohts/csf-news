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
            newsArticles: 'url, country'
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
        return this.apiKeySettings.add(k)
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
        return this.countryList.toArray()
    }

    // get Country
    getCountry(c: string): Promise<Country[]> {
        return this.countryList
            .where('isoCode').equals(c)
            .toArray()
    }

    // add CountryList
    addCountryList(c: Country[]): Promise<any> {
        return this.countryList.bulkAdd(c)
    }

    // NEWS ARTICLE COLLECTION
    // get news article
    getNewsArticle(c: string): Promise<NewsArticle[]> {
        return this.newsArticles
            .where('country').equals(c)
            .toArray()
    }

    // save news articles
    addNewsArticle(n: NewsArticle[]): Promise<any> {
        return this.newsArticles.bulkAdd(n)
    }

}