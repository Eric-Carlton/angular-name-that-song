import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

import { Song } from '../models/song.model';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {
  playlist: Song[] = [];

  constructor(private http: HttpClient) {}

  getPlaylist(): Observable<Song[]> {
    return of(this.playlist);
  }

  clearPlaylist(): Observable<Song[]> {
    this.playlist = [];
    return of(this.playlist);
  }

  createPlaylist(artist: string) {
    return this.http.get(`api/spotify/playlist/${artist}`).pipe(
      map((playlist: Object[]) => {
        this.playlist = plainToClass(Song, playlist).sort((a, b) => {
          if (a.artist > b.artist) {
            return 1;
          } else if (a.artist < b.artist) {
            return -1;
          } else {
            return 0;
          }
        });

        return this.playlist;
      })
    );
  }

  deleteSong(toRemove: Song) {
    this.playlist = this.playlist.filter(song => toRemove !== song);
    return of(this.playlist);
  }

  getRandomSong(shouldRemove: boolean): Observable<Song> {
    if (this.playlist.length > 0) {
      const randIndex = Math.floor(Math.random() * this.playlist.length),
        song = this.playlist[randIndex];

      if (shouldRemove) {
        return this.deleteSong(song).pipe(
          map(() => {
            return song;
          })
        );
      } else {
        return of(song);
      }
    }

    return of(null);
  }
}
