import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiKey } from '../models';
import { NewsDatabase } from '../news.database';

@Component({
  selector: 'app-api-settings',
  templateUrl: './api-settings.component.html',
  styleUrls: ['./api-settings.component.css']
})
export class ApiSettingsComponent implements OnInit {

  form: FormGroup

  constructor(private newsDB: NewsDatabase, private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      apiKey: this.fb.control('',[Validators.required])
    })
  }

  async deleteKey(){
    const value: ApiKey = {
      apiKey: this.form.get('apiKey').value
    }
    await this.newsDB.deleteApiKey(value)
    alert('Key deleted')
    this.router.navigate(['/'])
  }

  async addKey(){
    const value: ApiKey = {
      apiKey: this.form.get('apiKey').value
    }
    await this.newsDB.addApiKey(value)
    alert('Key added')
    this.router.navigate(['/country'])
  }

}
