import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NewsDatabase } from '../news.database';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(private router: Router, private newsDB: NewsDatabase) { }

  ngOnInit(): void {
    this.newsDB.getApiKey()
      .then(res => {
        if (res.length == 0){   
          console.log('>> MainComponent: no APIKEY found');
          this.router.navigate(['/settings'])
        } else {
          console.log('>> MainComponent: APIKEY found');
          this.router.navigate(['/country'])
        }
      })

  }

}
