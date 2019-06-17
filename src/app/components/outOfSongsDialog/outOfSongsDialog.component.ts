import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-out-of-songs-dialog',
  templateUrl: './outOfSongsDialog.component.html'
})
export class OutOfSongsDialogComponent {
  constructor(
    private router: Router,
    private dialogRef: MatDialogRef<OutOfSongsDialogComponent>
  ) {}

  navigateToPlaylistCreation() {
    this.dialogRef.close();
    this.router.navigate(['/create-playlist']);
  }
}
