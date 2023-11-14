import { Component, OnInit } from '@angular/core';
import { Song } from '../model';


@Component({ 
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

 currSongDetails: Song = {
  id: 1, 
  title:'Song Tite',
  artist:'Artist Name',
  url:'someUrl'
 }
 currScore: number = 0;

  constructor() { }

  ngOnInit(): void {
  }

  selectBtnOption() : void {}

  playSong() : void {}


}
