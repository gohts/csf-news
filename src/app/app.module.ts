import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { Routes, RouterModule } from '@angular/router'
import { HttpClientModule } from '@angular/common/http'

import { AppComponent } from './app.component';
import { ApiSettingsComponent } from './components/api-settings.component';
import { CountryListComponent } from './components/country-list.component';
import { NewsComponent } from './components/news.component';
import { MainComponent } from './components/main.component';
import { NewsDatabase } from './news.database';
import { NewsHttpService } from './newshttp.service';

// Configure Routes
const ROUTES: Routes = [
  { path: '', component: MainComponent },
  { path: 'home', component: MainComponent },
  { path: 'settings', component: ApiSettingsComponent },
  { path: 'country', component: CountryListComponent },
  { path: 'news/:country', component: NewsComponent },
  { path: '**', redirectTo:'/', pathMatch:'full' }
]

@NgModule({
  declarations: [
    AppComponent,
    ApiSettingsComponent,
    CountryListComponent,
    NewsComponent,
    MainComponent
  ],
  imports: [
    BrowserModule,
    FormsModule, 
    ReactiveFormsModule,
    RouterModule.forRoot(ROUTES),
    HttpClientModule
  ],
  providers: [NewsDatabase, NewsHttpService],
  bootstrap: [AppComponent]
})
export class AppModule { }
