import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Loginservice } from '../../services/loginservice';
import { LoginRequestDTO } from '../../models/LoginRequestDTO';

@Component({
  selector: 'app-logincomponent',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    RouterLink,
  ],
  templateUrl: './logincomponent.html',
  styleUrl: './logincomponent.css',
})
export class Logincomponent implements OnInit {
  form: FormGroup;
  ocultar: boolean = true;
  cargando: boolean = false;
  sesionExpirada: boolean = false;

  constructor(
    private loginS: Loginservice,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private snack: MatSnackBar
  ) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit(): void {
    // Llega con ?expirada=1 cuando el token vencio
    this.sesionExpirada = this.route.snapshot.queryParamMap.has('expirada');
    // Si ya tiene sesion, no tiene sentido mostrar el login
    if (this.loginS.verificar()) {
      this.router.navigate(['/']);
    }
  }

  ingresar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const request = new LoginRequestDTO();
    request.username = this.form.value.username;
    request.password = this.form.value.password;

    this.cargando = true;
    this.loginS.login(request).subscribe({
      next: () => {
        this.cargando = false;
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.cargando = false;
        const msg =
          err.status === 401
            ? 'Correo o contraseña incorrectos'
            : 'No se pudo conectar con el servidor';
        this.snack.open(msg, 'Cerrar', { duration: 4000 });
      },
    });
  }
}
