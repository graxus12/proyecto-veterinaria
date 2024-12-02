import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mascotas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mascotas.component.html',
  styleUrls: ['./mascotas.component.css'],
})
export class MascotasComponent implements OnInit {
  role: number | null = null;
  username: string | null = null;
  userId: string | null = null;
  mascotas: any[] = [];
  mascotasFiltradas: any[] = [];
  mensajeUsuario: string = '';
  cantidadAMostrar: number = 10;
  busqueda: string = '';

  constructor(private authService: AuthService, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.authService.userData$.subscribe(userData => {
      this.username = userData.username;
      this.role = Number(userData.role);
      this.userId = userData.id;

      if (this.role === 3) {
        this.getMascotasUsuario();
      } else if (this.role === 1 || this.role === 2) {
        this.getMascotasAdmin();
      }
    });
  }

  getMascotasUsuario(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No se ha encontrado el token');
      return;
    }

    this.http.get<any[]>('http://localhost/api/consultar_mascotas_usuario.php', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).subscribe(
      data => {
        this.mascotas = data;
        this.mascotasFiltradas = this.mascotas;
        if (this.mascotas.length === 0) {
          this.mensajeUsuario = 'No tienes mascotas registradas.';
        }
      },
      error => {
        console.error('Error al obtener las mascotas:', error);
        alert('Error al obtener las mascotas');
      }
    );
  }

  getMascotasAdmin(): void {
    this.http.get<any[]>('http://localhost/api/consultar_mascotas_admin.php').subscribe(
      data => {
        this.mascotas = data;
        this.mascotasFiltradas = this.mascotas;
      },
      error => {
        console.error('Error al obtener las mascotas:', error);
      }
    );
  }

  filtrarMascotas(): void {
    const busquedaLower = this.busqueda.toLowerCase();
    this.mascotasFiltradas = this.mascotas.filter(mascota =>
      mascota.nombre.toLowerCase().includes(busquedaLower) ||
      mascota.raza.toLowerCase().includes(busquedaLower) ||
      mascota.especie.toLowerCase().includes(busquedaLower)
    );
  }

  verDetalles(mascota: any): void {
    this.router.navigate(['/consultar-mascota', mascota.id]);
  }
}
