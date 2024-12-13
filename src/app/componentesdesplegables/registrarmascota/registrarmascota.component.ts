import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-registrarmascota',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registrarmascota.component.html',
  styleUrls: ['./registrarmascota.component.css'],
})
export class RegistrarmascotaComponent implements OnInit {
  role: number | null = null; // Rol del usuario logueado
  userId: string | null = null; // ID del usuario logueado
  usuarios: any[] = []; // Lista de usuarios (solo para roles admin)
  mascota = {
    nombre: '',
    fechaNacimiento: '',
    raza: '',
    especie: '',
    sexo: '',
    peso: null,
    ownerId: '', // Asignación del propietario
    foto: null, // Agregar campo para foto
    edad: 0 // Agregar el campo de edad
  };
  mensaje: string = '';

  constructor(private authService: AuthService, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.authService.userData$.subscribe((userData) => {
      this.role = Number(userData.role);
      this.userId = userData.id;

      // Si es admin, cargar lista de usuarios clientes
      if (this.role === 1) {
        this.cargarUsuarios();
      } else if (this.role === 3) {
        // Si es cliente, asignar automáticamente el ownerId
        this.mascota.ownerId = this.userId!;
      }
    });
  }

  cargarUsuarios(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token no encontrado');
      return;
    }

    this.http.get<any[]>('http://localhost/api/consultar_usuarios_activoseinactivos.php', {
      headers: { Authorization: `Bearer ${token}` },
    }).subscribe(
      (data) => {
        this.usuarios = data; // Solo los usuarios con role_id = 3 (clientes)
      },
      (error) => {
        console.error('Error al cargar usuarios:', error);
      }
    );
  }

  calcularEdad(): void {
    if (this.mascota.fechaNacimiento) {
      const birthDate = new Date(this.mascota.fechaNacimiento);
      const ageDifMs = Date.now() - birthDate.getTime();
      const ageDate = new Date(ageDifMs); // milisegundos a fecha
      this.mascota.edad = Math.abs(ageDate.getUTCFullYear() - 1970); // edad en años
    }
  }

  registrarMascota(): void {
    // Validación de campos obligatorios
    if (!this.mascota.nombre || !this.mascota.ownerId) {
      this.mensaje = 'Los campos Nombre y Propietario son obligatorios.';
      return;
    }

    this.calcularEdad(); // Calcular la edad antes de registrar

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token no encontrado');
      return;
    }

    const formData = new FormData();
    formData.append('nombre', this.mascota.nombre);
    formData.append('fechaNacimiento', this.mascota.fechaNacimiento);
    formData.append('raza', this.mascota.raza);
    formData.append('especie', this.mascota.especie);
    formData.append('sexo', this.mascota.sexo);
    formData.append('peso', String(this.mascota.peso));
    formData.append('ownerId', this.mascota.ownerId);
    formData.append('edad', String(this.mascota.edad)); // Añadir edad al formData
    
    if (this.mascota.foto) {
      formData.append('foto', this.mascota.foto);
    }

    this.http.post('http://localhost/api/registrar_mascota.php', formData, {
      headers: { Authorization: `Bearer ${token}` },
    }).subscribe(
      () => {
        alert('Mascota registrada con éxito');
        this.router.navigate(['/mascotas']);
      },
      (error) => {
        console.error('Error al registrar la mascota:', error);
        alert('Ocurrió un error al registrar la mascota');
      }
    );
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.mascota.foto = file;
    }
  }
}
