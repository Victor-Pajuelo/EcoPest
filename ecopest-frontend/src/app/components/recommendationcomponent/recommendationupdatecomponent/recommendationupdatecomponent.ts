import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  selector: 'app-recommendationupdatecomponent',
  imports: [ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatSelectModule],
  templateUrl: './recommendationupdatecomponent.html',
  styleUrl: './recommendationupdatecomponent.css',
})
export class Recommendationupdatecomponent implements OnInit {

  id: any = null
  item: any
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
    private router: Router,
    private route: ActivatedRoute,
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
    this.userS.getUsers().subscribe({
      next: data => {
        this.usuarios = data
        this.cdr.detectChanges()
      }, error: err => {
        console.log(err)
      }
    })

    this.buscarPorId()
  }

  buscarPorId(): void {
    this.s.getRecommendationById(this.id).subscribe({
      next: (data: RecommendationDTO) => {
        this.item = data
        this.form.patchValue({
          description: data.description,
          origin: data.origin,
          status: data.status,
          incidentId: data.incidentId,
          responsibleUserId: data.responsibleUserId
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

  actualizarRecomendacion(): void {
    if (this.form.invalid) {
      this.mensaje = 'Por favor, complete todos los campos correctamente!!'
      return
    }
    const dto: RecommendationDTO = {
      idRecommendation: this.id,
      description: this.form.value.description,
      origin: this.form.value.origin,
      status: this.form.value.status,
      incidentId: this.form.value.incidentId,
      responsibleUserId: this.form.value.responsibleUserId,
      generationDate: this.item.generationDate,
    }

    this.s.updateRecommendation(dto).subscribe({
      next: () => {
        this.mensaje = 'Actualizado correctamente!!'
        this.cdr.detectChanges()
        this.router.navigate(['/recomendaciones/listar'])
      },
      error: (error) => {
        console.log(error)
        this.mensaje = 'Error al actualizar!!'
        this.cdr.detectChanges()
      }
    })
  }
}
