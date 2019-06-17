import { BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconRegistry, MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  MatSnackBarModule,
  MAT_SNACK_BAR_DEFAULT_OPTIONS
} from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
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
  providers: [
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 5000 } }
  ],
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
