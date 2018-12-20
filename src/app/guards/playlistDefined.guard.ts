import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PlaylistService } from '../services/playlist.service';

@Injectable({
  providedIn: 'root'
})
export class PlaylistDefinedGuard implements CanActivate {
  constructor(
    private playlistService: PlaylistService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.playlistService.getPlaylist().pipe(
      map(playlist => {
        if (playlist.length > 0) {
          return true;
        } else {
          this.router.navigate(['/create-playlist']);
          return false;
        }
      })
    );
  }
}
