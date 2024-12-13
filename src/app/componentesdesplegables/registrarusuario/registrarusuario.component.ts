import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-registrarusuario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registrarusuario.component.html',
  styleUrls: ['./registrarusuario.component.css']
})
export class RegistrarusuarioComponent {
  usuario: any = {
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    password: '',
    role_id: 2,
    estado: 'activo'
  };

  loading: boolean = false;
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  registrarUsuario(): void {
    if (!this.usuario.first_name || !this.usuario.last_name || !this.usuario.email || !this.usuario.password) {
      this.errorMessage = 'Todos los campos son obligatorios';
      return;
    }

    this.loading = true;

    const usuarioData = {
      first_name: this.usuario.first_name,
      last_name: this.usuario.last_name,
      phone: this.usuario.phone,
      email: this.usuario.email,
      password: this.usuario.password,
      role_id: this.usuario.role_id,
      estado: this.usuario.estado
    };

    this.http.post('http://localhost/api/registrar_usuario.php', usuarioData).subscribe(
      (response: any) => {
        alert('Usuario registrado exitosamente');
        this.router.navigate(['/usuarios']);
      },
      (error) => {
        this.loading = false;
        console.error('Error al registrar el usuario:', error);
        this.errorMessage = 'Hubo un error al registrar al usuario.';
      }
    );
  }
}
