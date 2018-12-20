import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { Song } from '../../models/song.model';
import { PlaylistService } from 'app/services/playlist.service';

@Component({
  selector: 'app-create-playlist',
  templateUrl: './createPlaylist.component.html',
  styleUrls: ['./createPlaylist.component.scss']
})
export class CreatePlaylistComponent implements OnInit {
  playlist: MatTableDataSource<Song> = new MatTableDataSource<Song>();
  artist = '';
  loading = false;

  constructor(private playlistService: PlaylistService) {}

  ngOnInit() {
    this.clearPlaylist();
  }

  clearPlaylist() {
    this.playlistService
      .clearPlaylist()
      .subscribe(playlist => (this.playlist.data = playlist));
  }

  createPlaylist() {
    this.artist = this.artist.trim();

    if (this.artist) {
      this.loading = true;
      this.playlistService.createPlaylist(this.artist).subscribe(playlist => {
        this.playlist.data = playlist;

        this.loading = false;
      });
    }
  }

  removeSong(song: Song) {
    this.playlistService
      .deleteSong(song)
      .subscribe(playlist => (this.playlist.data = playlist));
  }
}
