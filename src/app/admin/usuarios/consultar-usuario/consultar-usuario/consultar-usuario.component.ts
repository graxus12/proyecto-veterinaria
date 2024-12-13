import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-consultar-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './consultar-usuario.component.html',
  styleUrls: ['./consultar-usuario.component.css']
})
export class ConsultarUsuarioComponent implements OnInit {
  usuario: any = null;
  loading: boolean = true;
  errorMessage: string = '';
  id: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.obtenerUsuario(this.id);
    }
  }

  obtenerUsuario(id: string): void {
    this.http.get<any>(`http://localhost/api/detalles_usuario.php?id=${id}`).subscribe(
      (data) => {
        this.usuario = data;
        this.loading = false;
      },
      (error) => {
        console.error('Error al obtener los detalles del usuario:', error);
        this.errorMessage = 'No se pudieron cargar los detalles del usuario.';
        this.loading = false;
      }
    );
  }

  actualizarUsuario(): void {
    // Validación básica
    if (!this.usuario.first_name || !this.usuario.last_name || !this.usuario.phone || !this.usuario.email) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }
  
    const formData = new FormData();
    formData.append('id', this.id as string);
    formData.append('first_name', this.usuario.first_name);
    formData.append('last_name', this.usuario.last_name);
    formData.append('phone', this.usuario.phone);
    formData.append('email', this.usuario.email);
    formData.append('estado', this.usuario.estado);
    formData.append('password', this.usuario.password); // Incluyendo la contraseña
  
    // Verifica los valores de formData usando forEach
    formData.forEach((value, key) => {
      console.log(key, value);
    });
  
    this.http.post(`http://localhost/api/actualizar_usuario.php`, formData).subscribe(
      () => {
        alert('Usuario actualizado correctamente.');
        this.router.navigate(['/usuarios']);
      },
      (error) => {
        console.error('Error al actualizar el usuario:', error);
        alert('Hubo un error al actualizar el usuario.');
      }
    );
  }

  volver(): void {
    this.router.navigate(['/usuarios']);
  }
}
