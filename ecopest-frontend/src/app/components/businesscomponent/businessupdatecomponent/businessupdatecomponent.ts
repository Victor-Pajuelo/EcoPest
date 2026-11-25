import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BusinessDTO } from '../../../models/BusinessDTO';
import { UBICACIONES } from '../../../models/ubicaciones';
import { Businessservice } from '../../../services/businessservice';

@Component({
  selector: 'app-businessupdatecomponent',
  imports: [ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatSelectModule, MatCheckboxModule],
  templateUrl: './businessupdatecomponent.html',
  styleUrl: './businessupdatecomponent.css',
})
export class Businessupdatecomponent implements OnInit {

  id: any = null
  item: any
  form: any
  mensaje: string = ''
  ubicaciones = UBICACIONES
  empresas: any[] = []

  constructor(
    private s: Businessservice,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      type: ['', [Validators.required]],
      parentBusinessEntityId: [null, []],
      latitude: [null, [Validators.min(-90), Validators.max(90)]],
      longitude: [null, [Validators.min(-180), Validators.max(180)]],
      active: [true, []]
    })
  }

  ngOnInit(): void {
    // Recuperar el id desde la URL
    this.id = Number(this.route.snapshot.paramMap.get('id'))

    if (!this.id || isNaN(this.id)) {
      this.mensaje = 'ID inválido'
      return
    }
    this.s.getBusinesses().subscribe({
      next: data => {
        this.empresas = data
        this.cdr.detectChanges()
      }, error: err => {
      }
    })

    this.buscarPorId()
  }

  buscarPorId(): void {
    this.s.getBusinessById(this.id).subscribe({
      next: (data: BusinessDTO) => {
        this.item = data
        this.form.patchValue({
          name: data.name,
          type: data.type,
          parentBusinessEntityId: data.parentBusinessEntityId,
          active: data.active,
          latitude: data.latitude,
          longitude: data.longitude
        })
        this.cdr.detectChanges()
      },
      error: (error) => {
        this.mensaje = 'No se encontró el registro!!'
        this.cdr.detectChanges()
      }
    })
  }

  actualizarEmpresa(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      this.mensaje = 'Por favor, complete todos los campos correctamente!!'
      return
    }
    const dto: BusinessDTO = {
      idBusinessEntity: this.id,
      name: this.form.value.name,
      type: this.form.value.type,
      parentBusinessEntityId: this.form.value.parentBusinessEntityId,
      active: this.form.value.active,
      latitude: this.form.value.latitude === '' ? null : this.form.value.latitude,
      longitude: this.form.value.longitude === '' ? null : this.form.value.longitude,
      companyName: this.item.companyName,
    }

    this.s.updateBusiness(dto).subscribe({
      next: () => {
        this.mensaje = 'Actualizado correctamente!!'
        this.cdr.detectChanges()
        this.router.navigate(['/empresas/listar'])
      },
      error: (error) => {
        this.mensaje = 'Error al actualizar!!'
        this.cdr.detectChanges()
      }
    })
  }

  // Al elegir una ciudad se llenan la latitud y la longitud
  elegirUbicacion(u: { latitude: number; longitude: number } | null): void {
    if (u) this.form.patchValue({ latitude: u.latitude, longitude: u.longitude })
  }
}
