import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  spotifyToken ='BQAyM7GaTbMG-eR1WMd6EAfclQvBj1MYhamMJcFIpjFGshZsWvFKnsC4S3Thc-zmH02w0fOFBFNkXMgEZRgtLm8ltXx1IcoyIiMih8IUeKku1BoO2-o';

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
      const artist = await getArtist(this.spotifyToken, this.selectedGenre, 'US');
      this.selectedArtistId = artist.id; 

      const songs = await getSongs(this.spotifyToken, this.selectedArtistId, 'US');
      this.songs = songs.tracks; 
    } catch (error) {
      console.error('Error fetching songs:', error);
      // will hanle later, just want to make sure first that it works
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

  async generateArtistButtons(numberOfArtists: number) {
    const artistContainer = document.getElementById('artistContainer');
    if (artistContainer) {
      artistContainer.innerHTML = '';
      const artists: string[] = [];
  
      for (let i = 1; i <= numberOfArtists; i++) {
        if (i === 1 && this.songs.length > 0) {
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'btn btn-success me-2';
          button.textContent = this.songs[0].artists[0].name;
          button.addEventListener('click', () => this.selectBtnOption());
          artistContainer.appendChild(button);
  
          artists.push(this.songs[0].artists[0].name);
        } else {
        
          const randomArtist = 'Random Artist ' + i;
          artists.push(randomArtist);
  
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'btn btn-success me-2';
          button.textContent = randomArtist;
          button.addEventListener('click', () => this.selectBtnOption());
          artistContainer.appendChild(button);
        }
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

      this.sounds[index].on('play', () => {
        const currentSong = this.songs[index]; // Get the currently playing song
        console.log(`Now playing: ${currentSong.name} by ${currentSong.artists[0].name}`);
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

 
  





