import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-screen1',
  templateUrl: './screen1.component.html',
  styleUrls: ['./screen1.component.less']
})
export class Screen1Component implements OnInit {

  constructor( private router: Router) { }

  ngOnInit() {
  }

  nextGame(){
    this.router.navigateByUrl('/screen2');
  }

}
