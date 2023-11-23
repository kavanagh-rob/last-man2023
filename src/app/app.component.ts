import { Component, OnInit } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'Last Man Standing ';
  club = environment.club;
  navLinks: any[];
  activeLinkIndex = -1;
  constructor(private router: Router) {
    this.navLinks = [
        {
            label: 'info',
            link: './info',
            index: 0
        }, {
            label: 'players',
            link: './players',
            index: 1
        }, {
            label: 'stats',
            link: './stats',
            index: 2
        }, {
          label: 'gameweek',
          link: './gameweek',
          index: 3
      }, {
        label: 'form',
        link: './form',
        index: 4
    }

    ];
}



ngOnInit(): void {
  this.router.events.subscribe((res) => {
      this.activeLinkIndex = this.navLinks.indexOf(this.navLinks.find(tab => tab.link === '.' + this.router.url));
  });
}
}
