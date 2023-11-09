import { Component, OnInit } from '@angular/core';
import {DataService} from '../../shared/services/data.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {
  constructor(private dataService: DataService) { }
  eventinfo = {weeks: [], startWeek: null, results: [], prizeList: null};
  userInfo = {name: '', phone: '', email: '', comment: ''};

  ngOnInit(): void {
    this.dataService.getEventinfo().then(resp => {
      this.eventinfo = resp;
    });
  }

  onSubmit(): any{
    console.log(this.userInfo);
    this.dataService.postUserForm(this.userInfo).then(resp => {
      this.userInfo = {name: '', phone: '', email: '', comment: ''};
      if (confirm('Enquiry Submitted!')){
        window.location.reload();
      }
      else{
        window.location.reload();
      }
    });
  }

}
