import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import {DataService} from '../services/data.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataResolver implements  Resolve<any>{

  constructor(private dataService: DataService) {}

  resolve(route: ActivatedRouteSnapshot): any {
    return this.dataService.getGameweekDataAsync();
  }
}
