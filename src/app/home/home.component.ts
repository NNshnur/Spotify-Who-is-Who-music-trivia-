import { Component, OnInit } from "@angular/core";
import fetchFromSpotify, { request } from "../../services/api";
import { Router } from "@angular/router";

const AUTH_ENDPOINT =
  "https://nuod0t2zoe.execute-api.us-east-2.amazonaws.com/FT-Classroom/spotify-auth-token";
const TOKEN_KEY = "whos-who-access-token";

const PRIVATE_TOKEN = 'BQAepT55HganzO5lIBdaMSFRF-1jDLD8Gjv4HIQ7kmt27HH3cZmbbPhkepCilEvHXcSuiCQN3gHX4WpcZXVoanQxxjXIj8bBn2XKwhKVNFRQOh6n30E'

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  constructor(private router: Router) {}

  genres: String[] = ["House", "Alternative", "J-Rock", "R&B"];
  selectedGenre: string = "";
  numberOfSongs: number = 1;
  numberOfArtists: number = 2;
  authLoading: boolean = false;
  configLoading: boolean = false;
  token: String = "";

  ngOnInit(): void {
    this.authLoading = true;
    this.retrieveSettingsFromLocalStorage();
    const storedTokenString = localStorage.getItem(TOKEN_KEY);
    if (storedTokenString) {
      const storedToken = JSON.parse(storedTokenString);
      if (storedToken.expiration > Date.now()) {
        console.log("Token found in localstorage");
        this.authLoading = false;
        // this.token = storedToken.value;
        this.token = PRIVATE_TOKEN
        this.loadGenres(PRIVATE_TOKEN);
        return;
      }
    }
    console.log("Sending request to AWS endpoint");
    request(AUTH_ENDPOINT).then(({ access_token, expires_in }) => {
      const newToken = {
        value: access_token,
        expiration: Date.now() + (expires_in - 20) * 1000,
      };
      localStorage.setItem(TOKEN_KEY, JSON.stringify(newToken));
      this.authLoading = false;
      this.token = PRIVATE_TOKEN;
      this.loadGenres(PRIVATE_TOKEN);
    });
  }

  loadGenres = async (t: any) => {
    this.configLoading = true;
    const response = await fetchFromSpotify({
      token: t,
      endpoint: "recommendations/available-genre-seeds",
    });
    console.log(response);
    this.genres = response.genres;
    this.configLoading = false;
  };

  setGenre(selectedGenre: any) {
    this.selectedGenre = selectedGenre;
  }

  setNumberOfArtists(numberOfArtists: any) {
    this.numberOfArtists = numberOfArtists;
  }

  setNumberOfSongs(numberOfSongs: any) {
    this.numberOfSongs = numberOfSongs;
  }

  submitAndStartGame() {
    this.submitSettings();
    this.startGame();
  }

  submitSettings() {
    localStorage.setItem("numberOfArtists", this.numberOfArtists.toString());
    localStorage.setItem("numberOfSongs", this.numberOfSongs.toString());
    localStorage.setItem("selectedGenre", this.selectedGenre.toString());
  }

  startGame() {
    // TODO: replace this with an actual url
    // this.router.navigateByUrl("");
    this.router.navigate(['/game'], {
      queryParams: {
        artists: this.numberOfArtists,
        songs: this.numberOfSongs,
        genre: this.selectedGenre
      }
    })
  }

  retrieveSettingsFromLocalStorage() {
    let savedArtists = localStorage.getItem("numberOfArtists");
    let savedSongs = localStorage.getItem("numberOfSongs");
    let savedGenre = localStorage.getItem("selectedGenre");
    this.numberOfArtists = savedArtists
      ? parseInt(savedArtists)
      : this.numberOfArtists;
    this.numberOfSongs = savedSongs ? parseInt(savedSongs) : this.numberOfSongs;
    this.selectedGenre = savedGenre ? savedGenre : this.selectedGenre;
  }
}

