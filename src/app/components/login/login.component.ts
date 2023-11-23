import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(private router: Router) {

  }
  username: string;
  password: string;
  showSpinner: boolean;
  

  ngOnInit(): void {
    localStorage.removeItem('lmtoken');
  }

  login() {
    if(this.username.trim() === 'admin' && btoa(this.password.trim()) === environment.id)
      localStorage.setItem('lmtoken', Math.random().toString());
      this.router.navigate(['admin']);
  }
}