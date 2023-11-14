import { Component, Input, OnInit } from '@angular/core';
import { Song } from '../model';


@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.css']
})
export class SongComponent implements OnInit {

  @Input() song: Song = { id: 1, title: '', artist: '', url : '' };


  constructor() { }

  ngOnInit(): void {
  }

  playSong() : void {}

  loadSong() : void {}


}