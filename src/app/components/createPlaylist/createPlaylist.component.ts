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
    this.snackBar.dismiss();

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
          e => {
            console.log(e.status);
            if (e.status === 404) {
              this.showSnackbar('Unable to find any matching artists');
            } else {
              this.showSnackbar(
                'An error occurred while creating a playlist',
                'Retry',
                () => {
                  this.createPlaylist();
                }
              );
            }
          }
        );
    } else {
      this.showSnackbar('You must provide at least one artist and at most 5');
    }
  }

  removeSong(song: Song) {
    this.playlistService
      .deleteSong(song)
      .subscribe(playlist => (this.playlist.data = playlist));
  }

  showSnackbar(message, action?, actionHandler?) {
    const snackBar = this.snackBar.open(message, action);

    if (actionHandler) {
      snackBar.onAction().subscribe(actionHandler);
    }
  }
}
