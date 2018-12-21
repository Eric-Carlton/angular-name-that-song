import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router, NavigationStart } from '@angular/router';

import { PlayersService } from '../../services/players.service';
import { PlaylistService } from '../../services/playlist.service';

import { Player } from '../../models/player.model';
import { Song } from '../../models/song.model';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { OutOfSongsDialogComponent } from '../outOfSongsDialog/outOfSongsDialog.component';
import { WinnerDialogComponent } from '../winnerDialog/winnerDialog.component';

@Component({
  selector: 'app-play-game',
  templateUrl: './playGame.component.html',
  styleUrls: ['./playGame.component.scss']
})
export class PlayGameComponent implements OnInit {
  players: MatTableDataSource<Player> = new MatTableDataSource<Player>();
  currentSong: Song;
  audioPlayer: HTMLAudioElement = new Audio();
  dialogConfig: MatDialogConfig = {
    width: '40%',
    disableClose: true
  };
  togglePauseText = '';

  constructor(
    private playersService: PlayersService,
    private playlistService: PlaylistService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.getPlayers();
    this.router.events.subscribe(evt => {
      if (evt instanceof NavigationStart) {
        this.audioPlayer.pause();
      }
    });

    this.audioPlayer.onplay = () => {
      this.togglePauseText = 'Pause';
    };

    this.audioPlayer.onpause = () => {
      this.togglePauseText = 'Play';
    };

    this.audioPlayer.onended = () => {
      this.togglePauseText = 'Replay';
    };
  }

  getPlayers() {
    this.playersService
      .getPlayers()
      .subscribe(players => (this.players.data = players));
  }

  increasePlayerScore(player: Player) {
    this.playersService.increasePlayerScore(player).subscribe(players => {
      this.players.data = players;
      this.checkForWinner(false);
    });
  }

  decreasePlayerScore(player: Player) {
    this.playersService.decreasePlayerScore(player).subscribe(players => {
      this.players.data = players;
      this.checkForWinner(false);
    });
  }

  checkForWinner(outOfSongs: boolean) {
    // deep copy here because .sort will sort the underlying array as well
    const sortedPlayers: Player[] = JSON.parse(
        JSON.stringify(this.players.data)
      ).sort((a, b) => b.score - a.score),
      firstPlace: number = sortedPlayers[0].score,
      // allow for one player games because that's not limited anywhere else
      secondPlace: number = sortedPlayers[1] ? sortedPlayers[1].score : 0,
      winningPlayers: Player[] = this.players.data.filter(
        player => player.score === firstPlace
      );

    if (outOfSongs) {
      this.openWinnerDialog(winningPlayers);
    } else if (firstPlace >= 5 && firstPlace - secondPlace >= 2) {
      this.openWinnerDialog(winningPlayers);
    }
  }

  startNextSong() {
    this.audioPlayer.pause();

    this.playlistService.getRandomSong(true).subscribe(song => {
      this.currentSong = song;

      if (this.currentSong) {
        this.audioPlayer.src = this.currentSong.previewUrl;
        this.audioPlayer.load();
        this.audioPlayer.play();
      } else {
        this.openOutOfSongsDialog();
      }
    });
  }

  togglePause() {
    if (this.audioPlayer.paused) {
      this.audioPlayer.play();
    } else {
      this.audioPlayer.pause();
    }
  }

  openOutOfSongsDialog() {
    this.audioPlayer.pause();

    const dialogRef: MatDialogRef<OutOfSongsDialogComponent> = this.dialog.open(
      OutOfSongsDialogComponent,
      this.dialogConfig
    );

    dialogRef.afterClosed().subscribe(shouldDeclareWinner => {
      if (shouldDeclareWinner) {
        this.checkForWinner(true);
      }
    });
  }

  openWinnerDialog(winners: Player[]) {
    this.audioPlayer.pause();

    this.dialog.open(
      WinnerDialogComponent,
      Object.assign(this.dialogConfig, { data: { winners: winners } })
    );
  }
}
