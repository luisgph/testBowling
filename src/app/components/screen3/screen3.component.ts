import { Component, OnInit } from '@angular/core';
import { GlobalVariablesService } from '../../services/global-variables.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-screen3',
  templateUrl: './screen3.component.html',
  styleUrls: ['./screen3.component.less']
})
export class Screen3Component implements OnInit {

  public player: any;
  public currentRoll: number = 0;
  public numberPlayers: number = 0;
  public playerAct: number = 0;
  public frameIndex: number = 0;
  public rollIndex = 0;
  public endGame: boolean = false;
  public frameCount : number = 1;
  public rolls:number[] = [];
  public strike : boolean = false;
  public hiddenStrike : string = "false";
  public name: string;
  public winner : boolean = false;

  constructor(public globalVariables: GlobalVariablesService, public router:Router) {
    let { players } = globalVariables.players;
    this.numberPlayers = +globalVariables.players.numberOfPlayers
    this.player = players;
  }

  ngOnInit() {
  }

  play() {
    this.hiddenStrike = "false";

    this.strike = false;

    if (this.playerAct === this.numberPlayers) {
      this.playerAct = 0;
      this.rollIndex += 2;
      this.frameIndex++;
      this.frameCount++;
      for (let i = 0; i < this.numberPlayers; i++) {
        if (this.player[i].flag) {
          this.player[i].rollIndex++;
        }else{
        this.player[i].rollIndex += 2 ;
        }
      }
      if (this.frameIndex === 10) {
        this.endGame = true;
      }
    }

    if (!this.endGame) {
      if (this.playerAct < this.numberPlayers) {
        let pinsDown1 = this.getRandom(0, 10);
        let pinsDown2 = this.getRandom(0, 10 - pinsDown1);

        this.player[this.playerAct].rolls[ this.rollIndex ] = pinsDown1;
        this.player[this.playerAct].rolls[ this.rollIndex + 1 ] = pinsDown2;

        if (pinsDown1 === 10) {
          this.hiddenStrike = "true";
          this.strike = true;
            this.player[this.playerAct].rollsAlt[ this.player[this.playerAct].rollIndex ] = pinsDown1;
            this.player[this.playerAct].flag = true;
        } else {
          if (this.player[this.playerAct].flag) {
            this.player[this.playerAct].rollsAlt[ this.player[this.playerAct].rollIndex ] = pinsDown1;
            this.player[this.playerAct].rollsAlt[ this.player[this.playerAct].rollIndex + 1 ] = pinsDown2;
            this.player[this.playerAct].flag = false;
          }
          else{
            this.player[this.playerAct].rollsAlt[ this.player[this.playerAct].rollIndex ] = pinsDown1;
            this.player[this.playerAct].rollsAlt[ this.player[this.playerAct].rollIndex + 1 ] = pinsDown2;
          }
        }

        if (this.frameCount === 10) {
          let lastPinsDown1 = this.getRandom(0, 10);
          let lastPinsDown2 = this.getRandom(0, 10 - lastPinsDown1);
          if (pinsDown1 === 10) {
            this.hiddenStrike = "true";
            this.player[this.playerAct].rolls[ this.rollIndex + 1] = lastPinsDown1;
            this.player[this.playerAct].rolls[ this.rollIndex + 2] = lastPinsDown2;

            this.player[this.playerAct].rollsAlt[ this.player[this.playerAct].rollIndex + 1] = lastPinsDown1;
            this.player[this.playerAct].rollsAlt[ this.player[this.playerAct].rollIndex + 2] = lastPinsDown2;
          }else{
            let lasPins = pinsDown1 + pinsDown2;
            if (lasPins === 10) {
              let lastPinsSpare= this.getRandom(0, 10);
              this.player[this.playerAct].rolls[ this.rollIndex + 2] = lastPinsSpare;
              this.player[this.playerAct].rollsAlt[ this.player[this.playerAct].rollIndex + 2] = lastPinsSpare;

            }
          }

        }

        let score = 0;
        let scoreByFrames = [];

        let i = 0;
        do {

          let frameScore = 0;
          let roll1 = this.player[this.playerAct].rollsAlt[ i ];

          if (roll1 == 10) {
            frameScore = 10 + this.player[this.playerAct].rollsAlt[ i + 1] + this.player[this.playerAct].rollsAlt[ i + 2]
          } else {
            let roll2 = this.player[this.playerAct].rollsAlt[ ++i ];

            if ((roll1 + roll2) == 10) {
              frameScore = 10 + this.player[this.playerAct].rollsAlt[ i + 1];
            } else {
              frameScore =  roll1 + roll2;
            }

          }

          score += frameScore;
          if ( scoreByFrames.length < 10) {
            scoreByFrames.push(score);
            this.player[this.playerAct].totalScore = score;
          }
          i++;

        } while (i < this.player[this.playerAct].rollsAlt.length -1)

        for (let i = 0; i < scoreByFrames.length; i++) {
          this.player[this.playerAct].scoreFrame[i] =   this.frameCount > i ? scoreByFrames[i] : 0;
        }

        this.playerAct++;

      }
    }else{
      let max=0;
      let act=0;

      for (let i = 0; i < this.player.length; i++) {
          act = Math.max(...this.player[i].scoreFrame);
          if (act > max) {
            max = act;
            this.name = this.player[i].name;
          }
      }
      this.winner = true;
    }
    }

  isStrike(rollIndex: number) {
    return this.player[this.playerAct].rolls[rollIndex] === 10;
  }


  isSpare(rollIndex: number) {
    return this.player[this.playerAct].rolls[rollIndex] + this.player[this.playerAct].rolls[rollIndex + 1] === 10;
  }

  getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  exit(){
    this.router.navigateByUrl('/screen1');
  }

  restart(){
    this.winner = false;
    this.playerAct  = 0;
    this.frameIndex  = 0;
    this.rollIndex = 0;
    this.endGame  = false;
    this.frameCount   = 1;
    this.rolls= [];
    this.strike  = false;
    this.hiddenStrike  = "false";
    this.name = "" ;
    this.winner = false;

    for (let i = 0; i < this.player.length; i++) {
      this.player[i].rolls = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
      this.player[i].rollsAlt = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
      this.player[i].scoreFrame = [0,0,0,0,0,0,0,0,0,0];
      this.player[i].totalScore = 0;
      this.player[i].flag = false;
      this.player[i].rollIndex = 0;
    }


    console.log(this.player);

  }

}
