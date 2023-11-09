import { Component, OnInit, OnDestroy } from '@angular/core';
import {DataService} from '../../shared/services/data.service';
import {ResourceService} from '../../shared/services/resource.service';

@Component({
  selector: 'app-livescores',
  templateUrl: './livescores.component.html',
  styleUrls: ['./livescores.component.css']
})
export class LivescoresComponent implements OnInit, OnDestroy {

  constructor(private dataService: DataService, private resourceService: ResourceService) { }

  liveGamesList = [];
  interval;

  ngOnInit(): void {
    this.fetchData();
    this.interval = setInterval(() => {
      this.fetchData();
    }, 20000);
  }

  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  fetchData(): void{
    this.dataService.getLiveScoresData().then( resp => {
      this.liveGamesList = resp.scoreData;
    });
  }
  getLiveTeamLogo(team): any {
    return this.resourceService.getLiveTeamLogo(team);
  }

  isNotLiveMatch(match): any {
    return !match.inProgress;
  }

}
