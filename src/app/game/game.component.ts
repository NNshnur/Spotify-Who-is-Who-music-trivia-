import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { getArtist, getSongs, getArtists } from "src/services/spotify-service";
import { Howl } from "howler";
import { Router } from "@angular/router";
import { ScoreService } from "src/services/score-service";
import { GameService } from "src/services/game-service";

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.css"],
})
export class GameComponent implements OnInit {
  numberOfArtists: number = 2;
  numberOfSongs: number = 1;

  selectedGenre: string = "";
  spotifyToken = "";

  songs: any[] = [];
  selectedArtistId: any;
  sounds: any[] = [];

  score: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private scoreService: ScoreService,
    private gameService: GameService
  ) {}

  ngOnInit(): void {
    this.numberOfArtists = this.gameService.getNumberOfArtists();
    this.numberOfSongs = this.gameService.getNumberOfSongs();
    this.selectedGenre = this.gameService.getSelectedGenre();
    this.spotifyToken = this.gameService.getToken();
    this.setupGameLayout();
  }

  async setupGameLayout() {
    await this.fetchSongs();
    this.generateSongButtons(this.numberOfSongs);
    this.generateArtistButtons(this.numberOfArtists);
  }

  async fetchSongs(): Promise<void> {
    try {
      const artist = await getArtist(
        this.spotifyToken,
        this.selectedGenre,
        "US"
      );
      this.selectedArtistId = artist.id;

      const songs = await getSongs(
        this.spotifyToken,
        this.selectedArtistId,
        "US"
      );
      this.songs = songs.tracks;
    } catch (error) {
      console.error("Error fetching songs:", error);
    }
  }

  generateSongButtons(numberOfSongs: number) {
    const songContainer = document.getElementById("songContainer");
    if (songContainer) {
      songContainer.innerHTML = "";
      for (let i = 1; i <= numberOfSongs; i++) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "btn btn-secondary me-2";
        button.innerHTML = `<i class="bi bi-play-circle-fill"></i> Song ${i}`;
        button.addEventListener("click", () => this.onSongButtonClick(i));
        songContainer.appendChild(button);
      }
    }
  }

  async generateArtistButtons(numberOfArtists: number) {
    const artistContainer = document.getElementById("artistContainer");
    if (artistContainer && this.songs.length > 0) {
      artistContainer.innerHTML = "";
      const artists: string[] = [];

      for (let i = 1; i <= numberOfArtists; i++) {
        if (i === 1 && this.songs.length > 0) {
          artists.push(this.songs[0].artists[0].name);
        } else {
          const artistName = await this.getArtistName(
            this.spotifyToken,
            this.selectedGenre,
            "US"
          );
          artists.push(artistName);
        }
      }

      const shuffledArtists = this.shuffleArray(artists);

      shuffledArtists.forEach((artistName) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "btn btn-success me-2";
        button.textContent = artistName;
        button.addEventListener("click", () => this.checkArtist(artistName));
        artistContainer.appendChild(button);
      });
    }
  }

  shuffleArray(array: any[]) {
    let currentIndex = array.length,
      temporaryValue,
      randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  getArtistName = async (token: string, genre: string, market: string) => {
    try {
      const response = await getArtists(token, genre, 1, market);
      if (response && response.length > 0) {
        return response[0].name;
      } else {
        throw new Error("No artist found");
      }
    } catch (error) {
      console.error("Error fetching artist name:", error);
      throw error;
    }
  };

  checkArtist(artistName: string): void {
    let lost: boolean = false;
    const currentlyPlayingIndex = this.sounds.findIndex(
      (sound) => sound && sound.playing && sound.play()
    );

    console.log("Currently playing index:", currentlyPlayingIndex);
    console.log("Selected artist name:", artistName);

    if (currentlyPlayingIndex !== -1) {
      const currentlyPlayingSong = this.songs[currentlyPlayingIndex];
      if (
        currentlyPlayingSong &&
        currentlyPlayingSong.artists[0].name === artistName
      ) {
        this.score += 1;
      } else {
        lost = true;
      }
    } else {
      this.score = 0;
    }

    console.log("Score:", this.score);
    this.scoreService.setScore(this.score);

    this.sounds.forEach((sound) => {
      if (sound && sound.playing()) {
        sound.pause();
      }
    });
    if (lost) {
      this.router.navigate(["/result"]);
    } else {
      this.setupGameLayout();
    }
  }

  playSong(songURL: string, index: number): void {
    if (this.sounds[index] && this.sounds[index].playing()) {
      this.sounds[index].pause();
    } else {
      this.sounds.forEach((sound) => {
        if (sound && sound.playing()) {
          sound.pause();
        }
      });

      this.sounds[index] = new Howl({
        src: [songURL],
        format: ["mp3"],
      });

      this.sounds[index].on("play", () => {
        const currentSong = this.songs[index]; // Get the currently playing song
        console.log(
          `Now playing: ${currentSong.name} by ${currentSong.artists[0].name}`
        );
      });

      this.sounds[index].play();
    }
  }

  async onSongButtonClick(index: number): Promise<void> {
    if (this.songs.length === 0) {
      await this.fetchSongs();
    }

    if (this.songs.length > index) {
      const songURL = this.songs[index];
      if (songURL.preview_url) {
        this.playSong(songURL.preview_url, index);
      } else {
        let nextSongIndex = index + 1;

        while (nextSongIndex < this.songs.length) {
          const nextSong = this.songs[nextSongIndex];
          if (nextSong.preview_url) {
            this.playSong(nextSong.preview_url, nextSongIndex);
            return;
          }
          nextSongIndex++;
        }
        index = nextSongIndex;
        console.log("No songs with preview URL available.");
        alert(
          "There are no songs with preview URL available, make a new selection with another genre."
        );
        const songURL = this.songs[index].preview_url;
        this.playSong(songURL, index);
      }
    }
  }

  selectBtnOption(): void {
    this.router.navigate(["/result"]);
  }
}
