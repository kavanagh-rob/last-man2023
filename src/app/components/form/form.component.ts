import { Component, AfterViewInit, OnInit } from '@angular/core';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements AfterViewInit, OnInit{

  ngOnInit(){
    document.dispatchEvent(new Event("DOMContentLoaded"));
  }
  
  ngAfterViewInit() {
    // setTimeout(function(){
    //   document.dispatchEvent(new Event("DOMContentLoaded"));
    // },1000);
     
  }
}
