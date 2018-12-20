import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Player } from '../models/player.model';

@Injectable({
  providedIn: 'root'
})
export class PlayersService {
  players: Player[] = [];

  constructor() {}

  getPlayers(): Observable<Player[]> {
    return of(this.players);
  }

  clearPlayers() {
    this.players = [];
    return of(this.players);
  }

  addPlayer(toAdd: Player): Observable<Player[]> {
    this.players.push(toAdd);
    return of(this.players);
  }

  deletePlayer(toDelete: Player): Observable<Player[]> {
    this.players = this.players.filter(player => player !== toDelete);
    return of(this.players);
  }

  increasePlayerScore(toIncrease: Player): Observable<Player[]> {
    this.players.forEach(player => {
      if (player === toIncrease) {
        player.score++;
      }
    });

    return of(this.players);
  }

  decreasePlayerScore(toDecrease: Player): Observable<Player[]> {
    this.players.forEach(player => {
      if (player === toDecrease) {
        player.score--;
      }
    });

    return of(this.players);
  }
}
