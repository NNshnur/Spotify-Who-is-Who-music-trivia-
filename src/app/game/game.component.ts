import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
//import { Song } from '../model';


@Component({ 
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})

export class GameComponent implements OnInit {

  numberOfArtists: number = 2; 
  numberOfSongs: number = 1;
  selectedGenre: string = '';

  constructor(private route: ActivatedRoute) {}

  
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.numberOfArtists = params['artists'] || 2;
      this.numberOfSongs = params['songs'] || 1;
      this.selectedGenre = params['genre'] || '';

      this.setupGameLayout();
    });
  }

  setupGameLayout() {
    this.generateSongButtons(this.numberOfSongs);

    this.generateArtistButtons(this.numberOfArtists);
  }

  generateSongButtons(numberOfSongs: number) {
    const songContainer = document.getElementById('songContainer');
    if (songContainer) {
      songContainer.innerHTML = ''; 
      for (let i = 1; i <= numberOfSongs; i++) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'btn btn-secondary me-2';
        button.innerHTML = `<i class="bi bi-play-circle-fill"></i> Song ${i}`;
        button.addEventListener('click', () => this.playSong());
        songContainer.appendChild(button);
      }
    }
  }

  generateArtistButtons(numberOfArtists: number) {
    const artistContainer = document.getElementById('artistContainer');
    if (artistContainer) {
      artistContainer.innerHTML = '';
      for (let i = 1; i <= numberOfArtists; i++) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'btn btn-success me-2';
        button.textContent = `Artist ${i}`;
        button.addEventListener('click', () => this.selectBtnOption());
        artistContainer.appendChild(button);
      }
    }
  }

  selectBtnOption() : void {}

  playSong() : void {}


}
