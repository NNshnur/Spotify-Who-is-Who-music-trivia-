import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ScoreService {
  private score: number = 0;

  getScore(): number {
    return this.score;
  }

  setScore(score: number): void {
    this.score = score;
  }
}