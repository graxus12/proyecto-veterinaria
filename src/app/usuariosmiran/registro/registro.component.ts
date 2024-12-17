import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  phone: string = '';
  verificationToken: string = '';
  showVerification: boolean = false; // Controla si mostrar el formulario de verificación

  private apiUrl = 'http://localhost/api/registrar_usuario.php';
  private verifyApiUrl = 'http://localhost/api/verificar_usuario.php';

  constructor(private http: HttpClient, private router: Router) {}

  // Método para registrar al usuario
  onSubmit() {
    // Validar que las contraseñas coincidan
    if (this.password !== this.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    // Validar que los campos no estén vacíos
    if (!this.firstName || !this.lastName || !this.email || !this.password || !this.phone) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    // Objeto con las claves que espera la API
    const user = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
      phone: this.phone,
    };

    this.http.post<any>(this.apiUrl, user).subscribe(
      (response) => {
        alert('Registro exitoso. Por favor, revisa tu correo para verificar tu cuenta.');
        this.showVerification = true; // Cambia al formulario de verificación
      },
      (error) => {
        alert('Error al registrar usuario');
      }
    );
  }

  // Método para verificar el token
  verifyToken() {
    this.http
      .get<any>(`${this.verifyApiUrl}?token=${this.verificationToken}`)
      .subscribe(
        (response) => {
          alert('Verificación exitosa. Ahora puedes iniciar sesión.');
          this.router.navigate(['/login']); // Redirigir a la página de login
        },
        (error) => {
          alert('Error al verificar el token. Por favor, inténtalo de nuevo.');
        }
      );
  }

  // Método para filtrar caracteres no permitidos en el nombre y apellido
  filterName(event: any): void {
    const value = event.target.value;
    // Solo permite letras y espacios
    event.target.value = value.replace(/[^a-zA-Z\s]/g, '');
  }

  // Método para filtrar caracteres no permitidos en el teléfono
  filterPhone(event: any): void {
    const value = event.target.value;
    // Solo permite números
    event.target.value = value.replace(/[^0-9]/g, '');
  }
}
