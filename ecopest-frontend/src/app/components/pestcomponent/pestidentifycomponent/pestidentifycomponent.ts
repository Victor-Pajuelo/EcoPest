import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PestIdentifyRequestDTO } from '../../../models/PestIdentifyRequestDTO';
import { Pestservice } from '../../../services/pestservice';

@Component({
  selector: 'app-pestidentifycomponent',
  imports: [ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatIconModule],
  templateUrl: './pestidentifycomponent.html',
  styleUrl: './pestidentifycomponent.css',
})
export class Pestidentifycomponent {

  form: any
  mensaje: string = ''
  resultado: string = ''
  nombreImagen: string = ''
  imagenBase64: string = ''
  tipoImagen: string = ''

  constructor(
    private s: Pestservice,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      text: ['']
    })
  }

  // Cuando el usuario elige una foto, la convertimos a base64 (texto) para enviarla en el JSON
  elegirImagen(event: any): void {
    const archivo = event.target.files[0]
    if (!archivo) {
      return
    }
    const lector = new FileReader()
    lector.onload = () => {
      const url = String(lector.result)
      this.imagenBase64 = url.split(',')[1]
      this.tipoImagen = archivo.type
      this.nombreImagen = archivo.name
      this.cdr.detectChanges()
    }
    lector.readAsDataURL(archivo)
  }

  identificar(): void {
    this.mensaje = ''
    this.resultado = ''

    if (this.form.value.text == '' && this.imagenBase64 == '') {
      this.mensaje = 'Escriba una descripción o elija una imagen de la plaga'
      return
    }

    const dto: PestIdentifyRequestDTO = {
      text: this.form.value.text,
      imageBase64: this.imagenBase64,
      mimeType: this.tipoImagen
    }

    this.mensaje = 'Consultando a la IA...'
    this.s.identifyPest(dto).subscribe({
      next: data => {
        this.mensaje = ''
        this.resultado = data.answer
        this.cdr.detectChanges()
      }, error: err => {
        this.mensaje = 'No se pudo identificar la plaga, intente nuevamente'
        this.cdr.detectChanges()
      }
    })
  }
}
