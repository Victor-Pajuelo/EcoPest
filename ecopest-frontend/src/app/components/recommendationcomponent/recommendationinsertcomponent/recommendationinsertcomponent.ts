import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { RecommendationDTO } from '../../../models/RecommendationDTO';
import { Recommendationservice } from '../../../services/recommendationservice';
import { Incidentservice } from '../../../services/incidentservice';
import { Userservice } from '../../../services/userservice';

@Component({
  selector: 'app-recommendationinsertcomponent',
  imports: [ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatSelectModule],
  templateUrl: './recommendationinsertcomponent.html',
  styleUrl: './recommendationinsertcomponent.css',
})
export class Recommendationinsertcomponent implements OnInit {

  form: any
  mensaje: string = ''
  origenes: any[] = [
    { value: 'AUTOMATICO', viewValue: 'Automático' },
    { value: 'MANUAL', viewValue: 'Manual' },
    { value: 'IA', viewValue: 'IA' },
  ];

  estados: any[] = [
    { value: 'PENDIENTE', viewValue: 'Pendiente' },
    { value: 'EN_PROCESO', viewValue: 'En proceso' },
    { value: 'APLICADA', viewValue: 'Aplicada' },
  ];

  incidentes: any[] = []
  usuarios: any[] = []

  constructor(
    private s: Recommendationservice,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private incidentS: Incidentservice,
    private userS: Userservice
  ) {
    this.form = this.fb.group({
      description: ['', [Validators.required]],
      origin: ['', [Validators.required]],
      status: ['', [Validators.required]],
      incidentId: [null, [Validators.required]],
      responsibleUserId: [null, []]
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
    this.userS.getUsers().subscribe({
      next: data => {
        this.usuarios = data
        this.cdr.detectChanges()
      }, error: err => {
        console.log(err)
      }
    })
  }

  insertarRecomendacion(): void {
    if (this.form.invalid) {
      this.mensaje = 'Por favor, complete todos los campos correctamente!!'
      return
    }
    const dto: RecommendationDTO = {
      idRecommendation: null,
      description: this.form.value.description,
      origin: this.form.value.origin,
      status: this.form.value.status,
      incidentId: this.form.value.incidentId,
      responsibleUserId: this.form.value.responsibleUserId,
      generationDate: null,
    }

    this.s.insertRecommendation(dto).subscribe({
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
