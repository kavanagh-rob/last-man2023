import { Component, OnInit } from '@angular/core';
import {DataService} from '../../shared/services/data.service';
import {ActivatedRoute} from '@angular/router';
import { NgxSpinnerService  } from 'ngx-spinner';
import {ResourceService} from '../../shared/services/resource.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {

  constructor(private spinner: NgxSpinnerService, private route: ActivatedRoute,
              private dataService: DataService, private resourceService: ResourceService) {

  this.eventObservable = this.route.snapshot.data['resolvedEventInfo'];
  }
  eventinfo = {stats: '', currentWeek: '', startWeek: '', statsWeek: '', teamList: []};
  eventObservable;
  currentWeekStats = {startCount: '', endCount: ''};
  selectionList:any =[];
  
  stats = {};
  playersList;
  gameweekResults;
  playerCountForWeek = 0;
  eliminatedPlayerCount = 0
  

  ngOnInit(): void {
    this.spinner.show();
    this.eventObservable.subscribe( resp => {
        this.eventinfo = resp.data;
        this.dataService.getPlayers().then(resp => {
          this.playersList = resp.Items;
       
          this.dataService.getGameweekResults().then(resp => {
            this.spinner.hide();
            this.gameweekResults = resp.Items;
            this.getStats();
            this.getEliminatedPlayers();
          });

        });
       
      });

  }
  getStats(){
    var statsWeek = 'week'+this.eventinfo.statsWeek;
    for(const teamName of this.eventinfo.teamList) {   
      var selection = { 'team': teamName };  
    
      const count = this.playersList.filter(player => player[statsWeek] && player[statsWeek].trim() === teamName).length;
      this.playerCountForWeek = this.playerCountForWeek + count;
      selection['count'] = count;
      selection['color'] = this.getResultColor(teamName);
      this.selectionList.push(selection);
    } 
    
  }

  getEliminatedPlayers(): any{
    this.eliminatedPlayerCount = this.playersList.filter(player => player['exit-week'] === this.eventinfo.statsWeek.toString()).length
   }

  getResultColor(team){
   var resultsForWeek =  this.gameweekResults.filter(result => result['gameweek-id'] === this.eventinfo.statsWeek.toString());
   var color = '';
   if (resultsForWeek && resultsForWeek.length === 1){
       var teamResult = resultsForWeek[0][team];
       if (teamResult === 'win'){
        color = 'limegreen'
       }
       else if (teamResult === 'lose'){
        color = 'crimson'
       }
       else if (teamResult === 'draw'){
        color = 'orange'
       }
   }
   return color;

  }

  getCurrentRound(): number{
    return parseInt(this.eventinfo.statsWeek, 0) - parseInt(this.eventinfo.startWeek, 0) + 1;
  }

  sortTeamByCount(prop: any): any{
    if (! this.selectionList){
      return;
    }
    return this.selectionList.sort((a, b) =>
      b['count'] > a['count'] ? 1 : a['count'] === b['count'] ? 0 : -1);
  }
 

  getTeamLogo(team): any{
    return this.resourceService.getTeamLogoFromName(team);
  }

  getActiveColor(selection): string{
    if (selection['color']){
      return selection['color'];
    }
    else if (selection['status']){
      return selection['status'] === 'win' ? 'limegreen' : 'crimson' ;
    }
    return '';
  }
}
