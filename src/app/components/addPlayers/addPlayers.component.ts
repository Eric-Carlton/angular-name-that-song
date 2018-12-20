import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { PlayersService } from '../../services/players.service';
import { Player } from '../../models/player.model';

@Component({
  selector: 'app-add-players',
  templateUrl: './addPlayers.component.html',
  styleUrls: ['./addPlayers.component.scss']
})
export class AddPlayersComponent implements OnInit {
  newPlayer: Player;
  players: MatTableDataSource<Player> = new MatTableDataSource<Player>();

  constructor(private playersService: PlayersService) {}

  ngOnInit() {
    this.createNewPlayer();
    this.clearPlayers();
  }

  clearPlayers() {
    this.playersService
      .clearPlayers()
      .subscribe(players => (this.players.data = players));
  }

  addPlayer() {
    this.newPlayer.name = this.newPlayer.name.trim();

    if (this.newPlayer.name) {
      this.playersService.addPlayer(this.newPlayer).subscribe(players => {
        this.createNewPlayer();

        this.players.data = players;
      });
    }
  }

  removePlayer(toDelete: Player) {
    this.playersService
      .deletePlayer(toDelete)
      .subscribe(players => (this.players.data = players));
  }

  createNewPlayer() {
    this.newPlayer = new Player();
    this.newPlayer.name = '';
    this.newPlayer.score = 0;
  }
}
