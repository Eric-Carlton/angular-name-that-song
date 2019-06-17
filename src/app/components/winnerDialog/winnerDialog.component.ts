import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Player } from 'app/models/player.model';

export interface WinnerDialogData {
  winners: Player[];
}

@Component({
  selector: 'app-winner-dialog',
  templateUrl: './winnerDialog.component.html',
  styleUrls: ['./winnerDialog.component.scss']
})
export class WinnerDialogComponent implements OnInit {
  content = '';

  constructor(
    private router: Router,
    private dialogRef: MatDialogRef<WinnerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: WinnerDialogData
  ) {}

  ngOnInit() {
    this.playWinningSound();
    this.determineContent();
  }

  playWinningSound() {
    const audioPlayer: HTMLAudioElement = new Audio();

    audioPlayer.src = '../../../assets/winner.mp3';
    audioPlayer.load();
    audioPlayer.play();
  }

  determineContent() {
    if (this.data.winners.length > 1) {
      this.content = `It was a tie between `;

      this.data.winners.forEach((winner, idx) => {
        if (idx < this.data.winners.length - 1) {
          this.content += `${winner.name}, `;
        } else {
          this.content += ` and ${winner.name} `;
        }
      });

      this.content += `all having a score of ${this.data.winners[0].score}!`;
    } else {
      const winner = this.data.winners[0];

      this.content = `The winner was <em>${winner.name}</em> with <em>${winner.score}</em> points!`;
    }
  }

  startNewGame() {
    this.dialogRef.close();
    this.router.navigate(['']);
  }
}
