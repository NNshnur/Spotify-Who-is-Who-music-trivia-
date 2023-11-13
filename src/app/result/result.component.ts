import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css']
})
export class ResultComponent implements OnInit {
  score : number = 0;

  constructor() { }

  ngOnInit(): void {
    this.getScore();
  }

  getScore() : void {

  }

  selectBtnOption(option : string) : void {
    if(option === 'Home') {
      console.log("Home btn was pressed")
    } else if (option === 'Play Again') {
      console.log("Play again was pressed")
    }
  }

}
