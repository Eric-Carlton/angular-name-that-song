import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { PlayersService } from '../services/players.service';

@Injectable({
  providedIn: 'root'
})
export class PlayersDefinedGuard implements CanActivate {
  constructor(private playersService: PlayersService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.playersService.getPlayers().pipe(
      map(players => {
        if (players.length > 0) {
          return true;
        } else {
          this.router.navigate(['/add-players']);
          return false;
        }
      })
    );
  }
}
