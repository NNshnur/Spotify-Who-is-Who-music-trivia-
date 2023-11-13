import { Component, OnInit } from '@angular/core';
import { Song } from '../model';


@Component({ 
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

 currSongDetails: Song = {
  title:'Song Tite',
  artist:'Artist Name'
 }
 currScore: number = 0;

  constructor() { }

  ngOnInit(): void {
  }

  playSong(songNum : number) : void {
    console.log("Song is playing ${songNum}")
  }

  selectOption(optionNum : number) : void {
    console.log ("option selected - ${optionNum}")
  }

  loadSong() : void {}

}
