import { Component, Inject, Injectable } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Observable } from 'rxjs';

// Cuadro de confirmacion de Material (reemplaza al window.confirm del navegador)
@Component({
  selector: 'app-confirmdialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Confirmar eliminación</h2>
    <mat-dialog-content>{{ data.mensaje }}</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="false">Cancelar</button>
      <button mat-flat-button color="warn" [mat-dialog-close]="true">Eliminar</button>
    </mat-dialog-actions>
  `,
})
export class Confirmdialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { mensaje: string }) {}
}

// Servicio para abrir el cuadro desde cualquier lista
@Injectable({ providedIn: 'root' })
export class Confirmservice {
  constructor(private dialog: MatDialog) {}

  preguntar(mensaje: string): Observable<boolean> {
    return this.dialog.open(Confirmdialog, { data: { mensaje }, width: '380px' }).afterClosed();
  }
}
