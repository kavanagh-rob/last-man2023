import { Component, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import {DataService} from '../../shared/services/data.service';
import {ResourceService} from '../../shared/services/resource.service';
import { NgxSpinnerService  } from 'ngx-spinner';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit, AfterViewChecked {
  @ViewChild('tableScroll') tableScroll: ElementRef;

  constructor(private spinner: NgxSpinnerService, private dataService: DataService, private resourceService: ResourceService) { }
  eventinfo = {weeks: [], startWeek: null, currentWeek: '', results: {}, drawTeams: {} };
  gameweekResults =[];
  playerList = [];
  term: string;
  remainingPlayers = [];
  havechecked = false;

  ngOnInit(): void {
    this.spinner.show();
    this.dataService.getPlayers().then(resp => {
      this.spinner.hide();
      this.playerList = resp.Items;
      this.getRemainingPlayers();
      this.checkPlayerSelections();
     });
    this.dataService.getEventinfo().then(resp => {
      this.eventinfo = resp;
    });
    this.dataService.getGameweekResults().then(resp => {
      this.gameweekResults = resp.Items;
    });
  }

  ngAfterViewChecked(): void {
    this.updateScroll();
  }

  getRoundNumber(weekIndex): number {
    return parseInt(weekIndex, 0) - parseInt(this.eventinfo.startWeek|| '', 0) + 1;
  }

  updateScroll(): void{
    const tableScroll = this.tableScroll.nativeElement as HTMLElement;
    tableScroll.scrollLeft = tableScroll.scrollWidth;
  }

  getPlayerPick(playerInfo, weekIndex): any {
    const weekPick = playerInfo['week' + weekIndex];
    return weekPick ? weekPick : null;
  }

  getResultClass(playerInfo, weekIndex): any {
    const team = this.getPlayerPick(playerInfo, weekIndex);
    if(!this.gameweekResults){
      return;
    }
    const resultsForGameweek = this.gameweekResults.filter(result => result["gameweek-id"] === weekIndex.toString());
    if (resultsForGameweek.length === 1 && playerInfo['week' + weekIndex]){
        if(resultsForGameweek[0][team] === 'win'){
          return 'winningPick';
        }
        if(resultsForGameweek[0][team] === 'draw'){
          return 'drawingLosePick';
        }
        if(resultsForGameweek[0][team] === 'lose'){
          return 'losingPick';
        } 
      }
    }


  // getResultClass(playerInfo, weekIndex): any {
  //   const team = this.getPlayerPick(playerInfo, weekIndex);
  //   if (this.eventinfo.results[weekIndex] && playerInfo['week' + weekIndex]){
  //     if ( this.isWinningPick(team, weekIndex)){
  //       return 'winningPick';
  //     }
  //   }
  //   if (this.eventinfo.drawTeams[weekIndex] && playerInfo['week' + weekIndex]){
  //     if ( this.isDrawingPick(team, weekIndex)){
  //     return 'drawingLosePick';
  //     }
  //   }
  // }

  // isWinningPick(team, weekIndex): any {
  //   if (team){
  //     return (this.eventinfo.results[weekIndex].filter(result => result.toLowerCase() === team.toLowerCase()).length === 1);
  //   }
  // }
  // isDrawingPick(team, weekIndex): any {
  //   if (team){
  //     return (this.eventinfo.drawTeams[weekIndex].filter(result => result.toLowerCase() === team.toLowerCase()).length === 1);
  //   }
  // }


  getTeamLogo(playerInfo, weekIndex): any{
    const logo = this.resourceService.getTeamLogoFromName(this.getPlayerPick(playerInfo, weekIndex));
    return logo ? logo : 'assets/unknown.png';
  }

  isWeekLogoVisible(playerInfo, weekIndex){
    return playerInfo['exit-week'] && !this.getPlayerPick(playerInfo, weekIndex);
  }

  getRemainingPlayers(): any{
    this.remainingPlayers = this.playerList.filter(
      player => !player['exit-week'] || player['exit-week'] === '-');
  }

  async checkPlayerSelections(): Promise<any> {
    const duplicates = this.remainingPlayers.filter(
      player => this.checkDuplicateSelections(player));
    console.log(duplicates);
  }

  checkDuplicateSelections(player): any {
    return (new Set(Object.values(player))).size !== Object.values(player).length;
  }

  sortPlayerByName(prop: any): any{
    if (! this.playerList){
      return;
    }
    const sortByName = this.playerList.sort((a, b) =>
      a['name'] > b['name'] ? 1 : a['name'] === b['name'] ? 0 : -1);

    return sortByName.sort((a, b) =>
    this.getExitWeek(b['exit-week']) >  this.getExitWeek(a['exit-week']) ? 1 :  this.getExitWeek(a['exit-week']) ===  this.getExitWeek(b['exit-week']) ? 0 : -1);
  }

  getExitWeek(exitWeek): number{
   if (!exitWeek || exitWeek === '-'){
    return 100;
   }else{
     return parseInt(exitWeek, 0);
   }
  }

  getActiveColor(player): string{
    return player['exit-week'] ? 'crimson' : '';
  }

}
