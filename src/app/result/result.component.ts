import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ScoreService } from "src/services/score-service";
import { GameService } from "src/services/game-service";

@Component({
  selector: "app-result",
  templateUrl: "./result.component.html",
  styleUrls: ["./result.component.css"],
})
export class ResultComponent implements OnInit {
  score: number = 0;

  constructor(private router: Router, private scoreService: ScoreService) {}

  ngOnInit(): void {
    this.getScore();
  }

  getScore(): void {
    this.score = this.scoreService.getScore();
  }

  goToHomePage(): void {
    this.router.navigate(["/"]);
  }

  playAgain(): void {
    this.score = 0;
    this.scoreService.setScore(this.score);
    this.router.navigate(["/game"]);
  }
}
