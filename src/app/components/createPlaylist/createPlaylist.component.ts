import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { Song } from '../../models/song.model';
import { PlaylistService } from 'app/services/playlist.service';
import { finalize } from 'rxjs/operators';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material';

@Component({
  selector: 'app-create-playlist',
  templateUrl: './createPlaylist.component.html',
  styleUrls: ['./createPlaylist.component.scss']
})
export class CreatePlaylistComponent implements OnInit {
  playlist: MatTableDataSource<Song> = new MatTableDataSource<Song>();
  artist = '';
  loading = false;
  errorMessage: MatSnackBarRef<SimpleSnackBar>;
  errorOpts = {
    duration: 5000
  };

  constructor(
    private playlistService: PlaylistService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.clearPlaylist();
  }

  clearPlaylist() {
    this.playlistService
      .clearPlaylist()
      .subscribe(playlist => (this.playlist.data = playlist));
  }

  createPlaylist() {
    this.clearPlaylist();
    this.artist = this.artist.trim();
    if (this.errorMessage) {
      this.errorMessage.dismiss();
    }

    if (this.artist && this.artist.split(',').length <= 5) {
      this.loading = true;
      this.playlistService
        .createPlaylist(this.artist)
        .pipe(
          finalize(() => {
            this.loading = false;
          })
        )
        .subscribe(
          playlist => {
            this.playlist.data = playlist;
          },
          () => {
            this.showServiceError();
          }
        );
    } else {
      this.showNumberOfArtistsError();
    }
  }

  removeSong(song: Song) {
    this.playlistService
      .deleteSong(song)
      .subscribe(playlist => (this.playlist.data = playlist));
  }

  showServiceError() {
    this.errorMessage = this.snackBar.open(
      'Oops! Unable to retrieve a playlist for that artist',
      'Retry',
      this.errorOpts
    );

    this.errorMessage.onAction().subscribe(() => {
      this.createPlaylist();
    });
  }

  showNumberOfArtistsError() {
    this.errorMessage = this.snackBar.open(
      'Sorry! You must provide at least one artist and at most five',
      null,
      this.errorOpts
    );
  }
}
