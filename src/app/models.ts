export interface ApiKey {
    apiId?: number;
    apiKey: string;
}

export interface Country {
    isoCode: string;
    countryName: string;
    flagUrl: string;
}

export interface NewsArticle {
    country: string;
    retrieveTime: number;
    save: boolean;
    sourceName: string;
    author: string;
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    content: string;
}