import { Component, Input, OnInit } from '@angular/core';
import { Song } from '../model';
import { Howl } from 'howler';


@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.css']
})
export class SongComponent implements OnInit {

  @Input() song: Song = { id: 1, title: '', artist: '', url : '' };

  sound: Howl | undefined;


  constructor() { }

  ngOnInit(): void {
    this.sound = new Howl({
      src: [this.song.url],
      format: ['mp3']
    });
  }

  playSong() : void {
    if(this.sound) {
      this.sound.play();
    }
  }



}