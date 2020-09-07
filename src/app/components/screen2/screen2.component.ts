import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { GlobalVariablesService } from '../../services/global-variables.service';

@Component({
  selector: 'app-screen2',
  templateUrl: './screen2.component.html',
  styleUrls: ['./screen2.component.less']
})
export class Screen2Component implements OnInit {

  public firstName: string;
  public secondName: string;
  public countPlayers: number = 0;
  public arrPlayers: string[] = [];
  public arrPlayerName: string[] = new Array(8);
  public isVisible :boolean = false;

  public dynamicForm: FormGroup;
  public submitted = false;


  constructor(private router: Router, private formBuilder: FormBuilder, public globalVariables:GlobalVariablesService) {
   }

  ngOnInit() {
    this.dynamicForm = this.formBuilder.group({
      numberOfPlayers: ['', Validators.required],
      players: new FormArray([])
    });
  }

  get f() { return this.dynamicForm.controls; }
  get t() { return this.f.players as FormArray; }


  onChangePlayers() {

    const numberOfPlayers = this.dynamicForm.value.numberOfPlayers || 0;
    this.isVisible = (numberOfPlayers >= 2)? true : false;

    if (this.t.length < numberOfPlayers) {
      for (let i = this.t.length; i < numberOfPlayers; i++) {
        this.t.push(this.formBuilder.group({
          name: ['', Validators.required],
          palete: ['', Validators.required],
          rolls:   [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]],
          rollsAlt:[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]],
          scoreFrame:[[0,0,0,0,0,0,0,0,0,0]],
          totalScore : [0],
          flag:[false],
          rollIndex:[0]
        }));
      }
    } else {
      for (let i = this.t.length; i >= numberOfPlayers; i--) {
        this.t.removeAt(i);
      }
    }
  }

  onSubmit() {
    this.submitted = true;

    if (this.dynamicForm.invalid) {
      return;
    }

    this.globalVariables.players = this.dynamicForm.value;
    this.router.navigateByUrl('/screen3');
 }

  back() {
    this.router.navigateByUrl('/screen1');
  }

  onlyNumber(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
}
