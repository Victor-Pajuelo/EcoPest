import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { EvidenceDTO } from '../../../models/EvidenceDTO';
import { Evidenceservice } from '../../../services/evidenceservice';
import { Incidentservice } from '../../../services/incidentservice';

@Component({
  selector: 'app-evidenceinsertcomponent',
  imports: [ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatSelectModule],
  templateUrl: './evidenceinsertcomponent.html',
  styleUrl: './evidenceinsertcomponent.css',
})
export class Evidenceinsertcomponent implements OnInit {

  form: any
  mensaje: string = ''
  tipos: any[] = [
    { value: 'IMAGEN', viewValue: 'Imagen' },
    { value: 'VIDEO', viewValue: 'Video' },
    { value: 'PDF', viewValue: 'PDF' },
  ];

  incidentes: any[] = []

  constructor(
    private s: Evidenceservice,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private incidentS: Incidentservice
  ) {
    this.form = this.fb.group({
      fileUrl: ['', [Validators.required]],
      fileType: ['', [Validators.required]],
      incidentId: [null, [Validators.required]]
    })
  }

  ngOnInit(): void {
    this.incidentS.getIncidents().subscribe({
      next: data => {
        this.incidentes = data
        this.cdr.detectChanges()
      }, error: err => {
        console.log(err)
      }
    })
  }

  insertarEvidencia(): void {
    if (this.form.invalid) {
      this.mensaje = 'Por favor, complete todos los campos correctamente!!'
      return
    }
    const dto: EvidenceDTO = {
      idEvidence: null,
      fileUrl: this.form.value.fileUrl,
      fileType: this.form.value.fileType,
      incidentId: this.form.value.incidentId,
      uploadDate: null,
    }

    this.s.insertEvidence(dto).subscribe({
      next: () => {
        this.mensaje = 'Registro guardado correctamente!!'
        this.form.reset()
        this.cdr.detectChanges()
      },
      error: (error) => {
        this.mensaje = 'Error al registrar!!'
        console.log(error)
        this.cdr.detectChanges()
      }
    })
  }
}
