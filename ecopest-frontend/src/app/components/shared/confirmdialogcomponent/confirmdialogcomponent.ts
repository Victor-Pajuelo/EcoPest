import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '../../../i18n/translatepipe';

@Component({
  selector: 'app-confirmdialog',
  imports: [MatDialogModule, MatButtonModule, TranslatePipe],
  template: `
    <h2 mat-dialog-title>{{ 'common.confirmTitle' | t }}</h2>
    <mat-dialog-content>{{ data.message }}</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button type="button" [mat-dialog-close]="false">{{ 'common.cancel' | t }}</button>
      <button mat-flat-button type="button" [mat-dialog-close]="true" cdkFocusInitial>{{ 'common.delete' | t }}</button>
    </mat-dialog-actions>
  `,
})
export class Confirmdialogcomponent {
  data: { message: string } = inject(MAT_DIALOG_DATA);
}
