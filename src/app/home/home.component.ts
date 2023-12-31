import { Component, OnInit } from "@angular/core";
import fetchFromSpotify, { request } from "../../services/api";
import { GameService } from "src/services/game-service";
import { Router } from "@angular/router";
import { client_id, client_secret } from "src/app/config";

const AUTH_ENDPOINT = "https://accounts.spotify.com/api/token";
const TOKEN_KEY = "whos-who-access-token";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  constructor(private router: Router, private gameService: GameService) {}

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
        this.token = storedToken.value;
        this.loadGenres(storedToken.value);
        return;
      }
    }
    console.log("Sending request to AWS endpoint");
    request(AUTH_ENDPOINT, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      method: "POST",
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: client_id,
        client_secret: client_secret,
      }),
    }).then(({ access_token, expires_in }) => {
      const newToken = {
        value: access_token,
        expiration: Date.now() + (expires_in - 20) * 1000,
      };
      localStorage.setItem(TOKEN_KEY, JSON.stringify(newToken));
      this.authLoading = false;
      this.token = newToken.value;
      this.loadGenres(newToken.value);
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
    this.gameService.setNumberOfArtists(this.numberOfArtists);
    this.gameService.setNumberOfSongs(this.numberOfSongs);
    this.gameService.setSelectedGenre(this.selectedGenre);
    this.gameService.setToken(this.token.toString());
  }

  startGame() {
    this.router.navigate(["/game"]);
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
