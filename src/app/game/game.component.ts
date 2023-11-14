import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SongComponent } from '../song/song.component';
import { getArtist, getSongs } from 'src/services/spotify-service';
import { Howl } from 'howler'


@Component({ 
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})

export class GameComponent implements OnInit {

  numberOfArtists: number = 2; 
  numberOfSongs: number = 1;
  selectedGenre: string = '';
  spotifyToken ='BQBwwVwoum6MJ-EdKjIwtkjk-19WRD2OKtSRgxI-GaH_KBt3DbNL3tp65jPoUGW_uBIyQyh0AOvkdV3C5AWGX0Sz3RjHh4G5oYWH3_vMJiZKZzmi6NE';

 // @ViewChild(SongComponent) songComponent!: SongComponent;
  songs: any[] = [];
  selectedArtistId: any;
  sounds: any[] = [];

  constructor(private route: ActivatedRoute) {}

  
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.numberOfArtists = params['artists'] || 2;
      this.numberOfSongs = params['songs'] || 1;
      this.selectedGenre = params['genre'] || '';

      this.setupGameLayout();
    });
  }

  async setupGameLayout() {
    await this.fetchSongs();
    this.generateSongButtons(this.numberOfSongs);
    this.generateArtistButtons(this.numberOfArtists);
  }

  async fetchSongs(): Promise<void> {
    try {
      // get the artist details and get the songs based on the artist 
      const artist = await getArtist(this.spotifyToken, this.selectedGenre, 'US');
      this.selectedArtistId = artist.id; 

      const songs = await getSongs(this.spotifyToken, this.selectedArtistId, 'US');
      this.songs = songs.tracks; 
    } catch (error) {
      console.error('Error fetching songs:', error);
      // will hanle later, just want to make sure first tha it works
    }
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
        button.addEventListener('click', () => this.onSongButtonClick(i));
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


  playSong(songURL: string, index: number): void {
    if (this.sounds[index] && this.sounds[index].playing()) {
      this.sounds[index].pause();

    } else {
      this.sounds[index] = new Howl({
        src: [songURL],
        format: ['mp3']
          
      });
      this.sounds[index].play();
    }
  }

  async onSongButtonClick(index: number): Promise<void> {
  
    if (this.songs.length === 0) {
      await this.fetchSongs();
    }

    
    if (this.songs.length > index) {
      const songURL = this.songs[index].preview_url; 
      this.playSong(songURL, index);
    }
  }

  selectBtnOption() : void {}

}

 
  





