import { Component, OnInit } from '@angular/core';
import { NewsHttpService } from '../newshttp.service';
import { Country } from '../models'
import { NewsDatabase } from '../news.database';

@Component({
  selector: 'app-country-list',
  templateUrl: './country-list.component.html',
  styleUrls: ['./country-list.component.css']
})
export class CountryListComponent implements OnInit {

  countryList: Country[]
  
  constructor(private newshttp: NewsHttpService, private newsDB: NewsDatabase) { }

  async ngOnInit() {

    const list = await this.newsDB.getCountryList()

    if (list.length>0) {

      console.log('>> CountryListComponent: country list found');
      this.countryList = list

    } else {

      console.log('>> CountryListComponent: no country list found');
      const res  = await this.newshttp.getCountryList()
      this.countryList = res.map(r => {
        return {
          isoCode: r.alpha2Code,
          countryName: r.name,
          flagUrl: r.flag,
        } as Country
      })
      console.log('>> CountryListComponent: country list retrieved from http');
      await this.newsDB.addCountryList(this.countryList)
      console.log('>> CountryListComponent: country list added to db');
      
    }

  }

}
