import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Para [(ngModel)]
import { HttpClient } from '@angular/common/http'; // Para realizar solicitudes HTTP
import { AuthService } from '../../services/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  onSubmit() {
    const loginData = { email: this.email, password: this.password };
  
    this.http.post('http://localhost/api/login.php', loginData).subscribe(
      (response: any) => {
        console.log('Login exitoso:', response); // Verifica que el response contiene el token
  
        // Guardar el token en el localStorage
        localStorage.setItem('token', response.token);
  
        // Guardar los datos del usuario en el servicio de autenticación
        this.authService.setUserData(response.username, response.role_id, response.id, response.token);
  
        // Redirigir según el rol del usuario
        this.redirectBasedOnRole(response.role_id);
      },
      (error) => {
        console.error('Error en el login:', error);
        alert('Correo o contraseña incorrectos');
      }
    );
  }
  

  private redirectBasedOnRole(role_id: string) {
    if (role_id === '1') {
      // Redirigir al administrador
      this.router.navigate(['/admin']);
    } else if (role_id === '2') {
      // Redirigir al trabajador
      this.router.navigate(['/worker']);
    } else if (role_id === '3') {
      // Redirigir al cliente
      this.router.navigate(['/client']);
    }
  }
}
