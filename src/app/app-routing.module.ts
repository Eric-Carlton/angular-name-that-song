import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddPlayersComponent } from './components/addPlayers/addPlayers.component';
import { CreatePlaylistComponent } from './components/createPlaylist/createPlaylist.component';
import { PlayersDefinedGuard } from './guards/playersDefined.guard';
import { PlaylistDefinedGuard } from './guards/playlistDefined.guard';
import { PlayGameComponent } from './components/playGame/playGame.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/add-players',
    pathMatch: 'full'
  },
  {
    path: 'add-players',
    component: AddPlayersComponent
  },
  {
    canActivate: [PlayersDefinedGuard],
    path: 'create-playlist',
    component: CreatePlaylistComponent
  },
  {
    canActivate: [PlayersDefinedGuard, PlaylistDefinedGuard],
    path: 'play-game',
    component: PlayGameComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
