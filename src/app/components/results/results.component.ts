import { Component, OnInit } from '@angular/core';
import {DataService} from '../../shared/services/data.service';
import {ActivatedRoute} from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { NgxSpinnerService  } from 'ngx-spinner';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent  implements OnInit {

  constructor(private route: ActivatedRoute, private dataService: DataService, private spinner: NgxSpinnerService) {

  this.eventObservable = this.route.snapshot.data['resolvedEventInfo'];
  }
  eventInfo = {nextDeadline: '', currentWeek: '', startWeek: '', showLiveScores: false, showForm: false, teamList: []};
  eventObservable;
  fb : FormBuilder;
  resultsForm: FormGroup =  new FormGroup({});
  gameweekResults: any;
  gameweekResultObject;
  gameweekId;
  showError: boolean = false;
  showSuccess: boolean = false;


  getClass(team){
    return this.resultsForm.controls[team].value;
  }

  ngOnInit(): void {
    this.spinner.show();
    this.eventObservable.subscribe( resp => {
      this.eventInfo = resp.data
      this.gameweekId = this.eventInfo.currentWeek.toString();;

      for(const teamName of this.eventInfo.teamList) {
        this.resultsForm.addControl(teamName, new FormControl(null));
      }

      this.dataService.getGameweekResults().then(resp => {
        this.gameweekResults = resp.Items;
        this.setExitingResult();
      });
  
    });
   
  }

  setExitingResult(){
    var resultsForGameweek = this.gameweekResults.filter(result => result['gameweek-id'] === this.gameweekId);
    if(resultsForGameweek && resultsForGameweek.length === 1){
      var existingResult = resultsForGameweek[0];
      for (const field in this.resultsForm.controls) { 
       this.resultsForm.controls[field].setValue(existingResult[field]);
        
      }
      resultsForGameweek[0];
    }
    this.spinner.hide();
  }

  submit(): void{
    this.spinner.show();
    this.showSuccess = false;
    this.showError = false;
    this.gameweekResultObject = {};
    this.gameweekResultObject['gameweek-id'] = this.gameweekId;
    for (const field in this.resultsForm.controls) { 
      this.gameweekResultObject[field] = this.resultsForm.controls[field].value;
    }
    this.dataService.putGameweekResult(this.gameweekResultObject).then(resp => {
      this.showSuccess = true;
      this.spinner.hide();
    }).catch(error => {
      this.showError = true;
      this.spinner.hide();
    
    })

    }
   
}
