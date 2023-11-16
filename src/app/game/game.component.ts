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

  artists: any[] = [];

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
    await this.setUpArtists();
    await this.fetchSongs();
    this.generateSongButtons(this.numberOfSongs);
    this.generateArtistButtons(this.numberOfArtists);
  }

  setUpArtists = async () => {
    this.artists = await getArtists(
      this.spotifyToken,
      this.selectedGenre,
      this.numberOfArtists,
      "US"
    );
    console.log(this.artists);
  };

  async fetchSongs(): Promise<void> {
    try {
      this.selectedArtistId = this.artists[0].id;

      const songs = await getSongs(
        this.spotifyToken,
        this.selectedArtistId,
        "US"
      );
      this.songs = songs.tracks;
      console.log(this.songs);
    } catch (error) {
      console.error("Error fetching songs:", error);
    }
    if (!this.validateSongUrls()) {
      this.setupGameLayout();
    }
    this.removeSongsWithoutUrl();
  }

  validateSongUrls = () => {
    let totalUrls = 0;
    this.songs.forEach((song) => {
      if (song.preview_url) {
        totalUrls++;
      }
    });
    if (totalUrls < this.numberOfSongs) {
      return false;
    }
    return true;
  };

  removeSongsWithoutUrl = () => {
    this.songs = this.songs.filter((song) => song.preview_url);
  };

  generateSongButtons(numberOfSongs: number): void {
    const songContainer = document.getElementById("songContainer");
    if (songContainer) {
      songContainer.innerHTML = "";
      const iconSize = 60;
      const marginBetweenIcons = 15;

      for (let i = 0; i < numberOfSongs; i++) {
        const svg = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "svg"
        );
        svg.setAttribute("width", `${iconSize}px`);
        svg.setAttribute("height", `${iconSize}px`);
        svg.style.cursor = "pointer";
        svg.style.margin = `${marginBetweenIcons}px`;

        svg.classList.add("icon");

        const circle = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "circle"
        );
        circle.setAttribute("cx", `${iconSize / 2}`);
        circle.setAttribute("cy", `${iconSize / 2}`);
        circle.setAttribute("r", `${iconSize / 2}`);
        circle.setAttribute("fill", "url(#gradient)");

        // Define the gradient
        const gradient = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "radialGradient"
        );
        gradient.setAttribute("id", "gradient");
        gradient.innerHTML = `
          <stop offset="0%" stop-color="#1DB954"/>
          <stop offset="100%" stop-color="#40407e"/>
        `;

        // Create the image element for the play icon
        const image = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "image"
        );
        image.setAttribute("href", "/assets/play-circle.svg");
        image.setAttribute("width", `${iconSize * 0.6}`);
        image.setAttribute("height", `${iconSize * 0.6}`);
        image.setAttribute("x", `${iconSize * 0.2}`);
        image.setAttribute("y", `${iconSize * 0.2}`);

        // Add click event listener
        svg.addEventListener("click", () => this.onSongButtonClick(i));

        // Append elements to the SVG
        svg.appendChild(circle);
        svg.appendChild(gradient);
        svg.appendChild(image);

        // Append the SVG to the container
        songContainer.appendChild(svg);
      }
    }
  }

  async generateArtistButtons(numberOfArtists: number) {
    const artistContainer = document.getElementById("artistContainer");
    if (artistContainer && this.songs.length > 0) {
      artistContainer.innerHTML = "";
      const shuffledArtists = this.shuffleArray(this.artists);
      shuffledArtists.forEach((artist) => {
        const artistName = artist.name;
        const button = document.createElement("button");
        button.type = "button";
        button.style.backgroundColor = "#1DB954";
        button.style.borderColor = "#1DB954";
        button.style.color = "white";
        button.style.borderRadius = "25px";
        // this is for hover effect
        button.addEventListener("mouseover", function () {
          button.style.backgroundColor = "#40407e";
        });

        button.addEventListener("mouseout", function () {
          button.style.backgroundColor = "#1DB954";
        });

        button.className = "btn btn-success me-2 green-custom-btn";
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
      let correct: boolean = false;
      for (let artist of currentlyPlayingSong.artists) {
        if (artist.name === artistName) {
          correct = true;
        }
      }
      if (currentlyPlayingSong && correct) {
        this.score += 10;
      } else {
        lost = true;
      }
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
        if (this.sounds[index] && this.sounds[index].playing()) {
          this.sounds[index].pause();
          this.updatePlayButton(index);
        } else {
          this.playSong(songURL.preview_url, index);
          this.updateStopButton(index);
        }
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

  updatePlayButton(index: number): void {
    const songContainer = document.getElementById("songContainer");
    if (songContainer) {
      const svgElement = songContainer.childNodes[index] as SVGSVGElement;
      if (svgElement) {
        const imageElement = svgElement.getElementsByTagName("image")[0];
        imageElement.setAttribute("href", "/assets/play-circle.svg");
      }
    }
  }

  updateStopButton(index: number): void {
    const songContainer = document.getElementById("songContainer");
    if (songContainer) {
      const svgElement = songContainer.childNodes[index] as SVGSVGElement;
      if (svgElement) {
        const imageElement = svgElement.getElementsByTagName("image")[0];
        imageElement.setAttribute("href", "/assets/stop.svg");
      }
    }
  }

  selectBtnOption(): void {
    this.router.navigate(["/result"]);
  }
}
