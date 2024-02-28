import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs-interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  public gifList: Gif[] = [];

  private _tagHistory: string[] = [];
  private apiKey: string = '3OxQBt29fg9molHbTsPMGxVWq46zm4xX';
  private serviceUrl: string = 'https://api.giphy.com/v1/gifs';

  constructor( private http: HttpClient ) {
    this.loadLocalStorage();
   }

  get tagsHistory(){
    return [...this._tagHistory]
  }

  private organizeHistory(tag: string) {
    tag = tag.toLowerCase();

    if (this.tagsHistory.includes(tag)){
      this._tagHistory = this.tagsHistory.filter( (oldTag) => oldTag !== tag)
    }

    this._tagHistory.unshift(tag);
    this._tagHistory = this.tagsHistory.splice(0,10);
    this.saveLocalStorage();
  }

  private saveLocalStorage():void{
    localStorage.setItem('history', JSON.stringify(this._tagHistory));
  }

  private loadLocalStorage():void{
    if ( !localStorage.getItem('history')) return;
    this._tagHistory = JSON.parse(localStorage.getItem('history')!);
    this.searchTag(this._tagHistory[0])
  }

  searchTag (tag: string):void{
    if (tag.length === 0 ) return;
    this.organizeHistory(tag);
    console.log(this.tagsHistory);

    const params = new HttpParams()
    .set('api_key', this.apiKey)
    .set('limit', '10')
    .set('q', tag )

    this.http.get<SearchResponse>(`${this.serviceUrl}/search`, {params})
      .subscribe( resp=> {
        this.gifList = resp.data;
        // console.log({gifs: this.gifList})
      })
    // fetch('https://api.giphy.com/v1/gifs/search?api_key=3OxQBt29fg9molHbTsPMGxVWq46zm4xX&q=jojos&limit=10')
  
  
  }

}
