import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { Injectable } from '@angular/core';
import { NewsArticle } from './models';

@Injectable()
export class NewsHttpService {


    constructor (private http: HttpClient) {}
    
    // get country list from restcountries.eu
    getCountryList():Promise<any> {
        const url = 'https://restcountries.eu/rest/v2/alpha'
        const countries = ['ae','ar','at','au','be','bg','br','ca','ch','cn','co','cu','cz','de','eg','fr','gb','gr','hk','hu','id','ie','il','in','it','jp','kr','lt','lv','ma','mx','my','ng','nl','no','nz','ph','pl','pt','ro','rs','ru','sa','se','sg','si','sk','th','tr','tw','ua','us','ve','za'];

        const reducer = (accumulator, currentValue) => accumulator + ';' + currentValue;
        let params = new HttpParams().set('codes', countries.reduce(reducer));

        return this.http.get(url, { params: params })
            .toPromise()
    }


    // get news articles from newsapi.org
    getNews(c: string, apiKey: string):Promise<any> {
        
        const url = 'https://newsapi.org/v2/top-headlines'

        let headers = new HttpHeaders({
            'X-Api-Key': apiKey
        })

        let params = new HttpParams()
            .set('country', c)
            .set('category','general')
            .set('pageSize','30')

        return this.http.get(url, {
                headers: headers,
                params: params
            })
            .toPromise()
    } 

    // HttpClient.get(url: string, options?: {
    //     headers?: HttpHeaders | {
    //         [header: string]: string | string[];
    //     };
    //     observe?: "body";
    //     params?: HttpParams | {
    //         [param: string]: string | string[];
    //     };
    //     reportProgress?: boolean;
    //     responseType?: "json";
    //     withCredentials?: boolean;
    // })


}