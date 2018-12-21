import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import {
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatCardModule,
  MatTableModule,
  MatToolbarModule,
  MatProgressSpinnerModule,
  MatDialogModule,
  MatSnackBarModule,
  MatIconRegistry,
  MatIconModule
} from '@angular/material';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddPlayersComponent } from './components/addPlayers/addPlayers.component';
import { CreatePlaylistComponent } from './components/createPlaylist/createPlaylist.component';
import { PlayGameComponent } from './components/playGame/playGame.component';
import { OutOfSongsDialogComponent } from './components/outOfSongsDialog/outOfSongsDialog.component';
import { WinnerDialogComponent } from './components/winnerDialog/winnerDialog.component';

@NgModule({
  declarations: [
    AppComponent,
    AddPlayersComponent,
    CreatePlaylistComponent,
    PlayGameComponent,
    OutOfSongsDialogComponent,
    WinnerDialogComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    AppRoutingModule,
    MatTableModule,
    MatDialogModule,
    BrowserAnimationsModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatSnackBarModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [OutOfSongsDialogComponent, WinnerDialogComponent]
})
export class AppModule {
  constructor(matIconRegistry: MatIconRegistry, domSanitizer: DomSanitizer) {
    matIconRegistry.addSvgIconSet(
      domSanitizer.bypassSecurityTrustResourceUrl('./assets/mdi.svg')
    );
  }
}
