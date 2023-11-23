import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../../environments/environment';
import { map, publishReplay, refCount } from 'rxjs/operators';
import * as crypto from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) {}

  gameweekData: Observable<object>;
  playersData: any;

  extractBody(res: any): any {
    const body = res.data;
    return JSON.parse(res.body) || {};
  }

  extractData(res: any): any {
    const body = res.data;
    return res.data || {};
  }

  extractLambdaData(res: any): any {
    return res || {};
  }

  extractSecureLambdaData(res: any): any {
    var data = crypto.AES.decrypt(res['secureData'], atob('b3Jhbk1vcmUyMw==')).toString(crypto.enc.Utf8);
    return data || {};
  }

  handleErrorPromise(error: Response | any): void {
    console.error(error.message || error);
  }

  async getGameweekDataAsync(): Promise<any> {
    // Cache it once if configs value is false
    let gameweekObserv;
    gameweekObserv = this.http.get(`${environment.liveUrl}/gameweek`).pipe(
      map(data => {
        if (data && data['body']) {
          return JSON.parse(data['body']);
        } else {
          console.log('error found');
          return null;
        }
      }),
      publishReplay(1), // this tells Rx to cache the latest emitted
      refCount()
    );
    return gameweekObserv;
  }

  getGameweekData(): Observable<object> {
    // Cache it once if configs value is false
    return this.http.get(`${environment.liveUrl}/gameweek`).pipe(
      map(data => {
        if (data && data['body']) {
          return JSON.parse(data['body']);
        } else {
          console.log('error found');
          return null;
        }
      }),
      );
  }

  

  getLiveScoresData(): any {
    return this.http.get(`${environment.liveUrl}/livescores`)
      .toPromise()
      .then(this.extractLambdaData)
      .catch(this.handleErrorPromise);
  }

  getAccDetails(): any {
    return this.http.get(`${environment.liveUrl}/acinfo`)
      .toPromise()
      .then(this.extractSecureLambdaData)
      .catch(this.handleErrorPromise);
  }


 async getEventInfoAsync(): Promise<any> {
    return this.http.get(`${environment.liveUrl}${environment.eventInfoPath}`);
  }

  getEventinfo(): any {
    return this.http.get(`${environment.liveUrl}${environment.eventInfoPath}`)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleErrorPromise);
  }

  getGameweekResults(): any {
    return this.http.get(`${environment.liveUrl}/gameweek-results`)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleErrorPromise);
  }
  
  getPlayers(): any {
    const playersResquestData: any = {};
    playersResquestData.table_name = environment.playersTable;
    return this.http.post(`${environment.dataUrl}/tableinfo`, playersResquestData)
      .toPromise()
      .then(this.extractData)
      .catch(this.handleErrorPromise);
  }

  // getPlayers(): any {
  //   if(!this.playersData){
  //     const playersResquestData: any = {};
  //     playersResquestData.table_name = environment.playersTable;
  //     this.playersData = this.http.post(`${environment.dataUrl}/tableinfo`, playersResquestData).toPromise().then(this.extractData)
  //     .catch(this.handleErrorPromise);;
  
  //   }
  //   return this.playersData;
     
  // }

  putGameweekResult(gameweekResultInfo): any {
    const data: any = {};
    data.item = gameweekResultInfo;
    data.table_name = 'last-man-gameweek';
    return this.http.put(`${environment.liveUrl}/gameweek-results`, data)
    .toPromise()
    .then(this.extractData)
    .catch(this.handleErrorPromise);
  }

  postUserForm(userInfo): any {
    return this.http.post(`${environment.liveUrl}/userinfo`, userInfo)
    .toPromise()
    .then(this.extractData)
    .catch(this.handleErrorPromise);
  }

}
