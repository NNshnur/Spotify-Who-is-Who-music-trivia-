import { Component, Input, OnInit } from '@angular/core';
import { Song } from '../model';


@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.css']
})
export class SongComponent implements OnInit {

  @Input() song: Song = { title: '', artist: '' };


  constructor() { }

  ngOnInit(): void {
  }
}