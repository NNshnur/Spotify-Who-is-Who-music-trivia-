import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class GameService {
  private token: string = "";
  private numberOfArtists: number = 2;
  private numberOfSongs: number = 1;
  private selectedGenre: string = "";

  getToken(): string {
    return this.token;
  }

  setToken(token: string): void {
    this.token = token;
  }

  getNumberOfArtists(): number {
    return this.numberOfArtists;
  }

  setNumberOfArtists(number: number): void {
    this.numberOfArtists = number;
  }

  getNumberOfSongs(): number {
    return this.numberOfSongs;
  }

  setNumberOfSongs(number: number): void {
    this.numberOfSongs = number;
  }

  getSelectedGenre(): string {
    return this.selectedGenre;
  }

  setSelectedGenre(genre: string): void {
    this.selectedGenre = genre;
  }
}
