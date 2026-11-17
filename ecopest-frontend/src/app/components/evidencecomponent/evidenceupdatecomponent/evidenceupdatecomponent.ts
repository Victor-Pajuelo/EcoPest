import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { EvidenceDTO } from '../../../models/EvidenceDTO';
import { Evidenceservice } from '../../../services/evidenceservice';
import { Incidentservice } from '../../../services/incidentservice';

@Component({
  selector: 'app-evidenceupdatecomponent',
  imports: [ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatSelectModule],
  templateUrl: './evidenceupdatecomponent.html',
  styleUrl: './evidenceupdatecomponent.css',
})
export class Evidenceupdatecomponent implements OnInit {

  id: any = null
  item: any
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
    private router: Router,
    private route: ActivatedRoute,
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
    // Recuperar el id desde la URL
    this.id = Number(this.route.snapshot.paramMap.get('id'))

    if (!this.id || isNaN(this.id)) {
      this.mensaje = 'ID inválido'
      return
    }
    this.incidentS.getIncidents().subscribe({
      next: data => {
        this.incidentes = data
        this.cdr.detectChanges()
      }, error: err => {
        console.log(err)
      }
    })

    this.buscarPorId()
  }

  buscarPorId(): void {
    this.s.getEvidenceById(this.id).subscribe({
      next: (data: EvidenceDTO) => {
        this.item = data
        this.form.patchValue({
          fileUrl: data.fileUrl,
          fileType: data.fileType,
          incidentId: data.incidentId
        })
        this.cdr.detectChanges()
      },
      error: (error) => {
        console.log(error)
        this.mensaje = 'No se encontró el registro!!'
        this.cdr.detectChanges()
      }
    })
  }

  actualizarEvidencia(): void {
    if (this.form.invalid) {
      this.mensaje = 'Por favor, complete todos los campos correctamente!!'
      return
    }
    const dto: EvidenceDTO = {
      idEvidence: this.id,
      fileUrl: this.form.value.fileUrl,
      fileType: this.form.value.fileType,
      incidentId: this.form.value.incidentId,
      uploadDate: this.item.uploadDate,
    }

    this.s.updateEvidence(dto).subscribe({
      next: () => {
        this.mensaje = 'Actualizado correctamente!!'
        this.cdr.detectChanges()
        this.router.navigate(['/evidencias/listar'])
      },
      error: (error) => {
        console.log(error)
        this.mensaje = 'Error al actualizar!!'
        this.cdr.detectChanges()
      }
    })
  }
}
