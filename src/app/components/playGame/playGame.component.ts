import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

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

  constructor(
    private playersService: PlayersService,
    private playlistService: PlaylistService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getPlayers();
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
      secondPlace: number = sortedPlayers[1].score,
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

  openOutOfSongsDialog() {
    this.audioPlayer.pause();

    const dialogRef = this.dialog.open(
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

    this.audioPlayer.src = '../../../assets/winner.mp3';
    this.audioPlayer.load();
    this.audioPlayer.play();

    this.dialog.open(
      WinnerDialogComponent,
      Object.assign(this.dialogConfig, { data: { winners: winners } })
    );
  }
}
