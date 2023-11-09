import { Component, OnInit } from '@angular/core';
import {DataService} from '../../shared/services/data.service';
import {ActivatedRoute} from '@angular/router';
@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent  implements OnInit {

  constructor(private route: ActivatedRoute, private dataService: DataService) {

  this.eventObservable = this.route.snapshot.data['resolvedEventInfo'];
  }
  eventinfo = { teamList: []};
  eventObservable;

  ngOnInit(): void {
    this.eventObservable.subscribe( resp => {
      this.eventinfo = resp.data
    });

}

}
