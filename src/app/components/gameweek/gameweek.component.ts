import { AfterViewInit, Component, OnInit } from '@angular/core';
import {DataService} from '../../shared/services/data.service';
import {ResourceService} from '../../shared/services/resource.service';
import {ActivatedRoute} from '@angular/router';
import { NgxSpinnerService  } from 'ngx-spinner';
import * as $ from 'jquery';

@Component({
  selector: 'app-gameweek',
  templateUrl: './gameweek.component.html',
  styleUrls: ['./gameweek.component.css']
})
export class GameweekComponent implements OnInit {

  constructor(private spinner: NgxSpinnerService, private route: ActivatedRoute,
              private resourceService: ResourceService, private dataService: DataService) {
    this.eventObservable = this.route.snapshot.data['resolvedEventInfo'];
    this.gameweekObservable = this.route.snapshot.data['resolvedGameweek'];

  }
  currentRound = {matches: [], round: ''};
  eventinfo = {nextDeadline: '', currentWeek: '', startWeek: '', showLiveScores: false, showForm: false};
  gameweekObservable;
  eventObservable;
  teams;
  deadline;
  retryCount = 0;

  ngOnInit(): void {
    this.spinner.show();
    this.eventObservable.subscribe( resp => {
      this.eventinfo = resp.data;
      this.loadGameweekData();
    });
  }


  loadGameweekData(): void {
    this.gameweekObservable.subscribe( resp => {
      if (!resp || !resp.game){
        this.retryFetchGameweek();
      }else{
       this.setGameweekVariables(resp);
      }
    });
  }

  setGameweekVariables(resp): any {
    this.spinner.hide();
    try{
      this.currentRound = resp['game']['rounds'][parseInt(this.eventinfo.currentWeek, 0) - 1];
      this.teams = resp['game']['contestants'];
      this.deadline = this.getDateTime(this.currentRound['submissionDeadline']);
    }catch (e){
      console.log(e);
    }
  }

  retryFetchGameweek(): any{
    console.log('Retrying Fetch Gameweek');
    this.dataService.getGameweekData().subscribe( resp => {
      this.spinner.hide();
      this.setGameweekVariables(resp);
    });
  }

  getTeamName(teamRef): string{
    const team = this.teams.filter(item => item.contestantReference === teamRef)[0];
    if (team){
      return team.name;
    }
    return '';
  }

  getCurrentRound(): any{
    // -1 when catch up weeks caused misalignment
    return parseInt(this.eventinfo.currentWeek, 0) - parseInt(this.eventinfo.startWeek, 0) + 1 ;
  }

  getTeamLogo(team): any {
    return this.resourceService.getTeamLogo(team);
  }

  getDateTime(timeString): string{
    return new Date(timeString).toLocaleString();
  }



}
