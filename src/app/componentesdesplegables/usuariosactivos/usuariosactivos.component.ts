import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-usuariosactivos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usuariosactivos.component.html',
  styleUrls: ['./usuariosactivos.component.css']
})
export class UsuariosactivosComponent implements OnInit {
  usuariosActivos: any[] = [];  // Lista de usuarios activos
  loading: boolean = true;  // Indicador de carga
  errorMessage: string = '';  // Mensaje de error

  // Mapeo de IDs de roles a nombres
  roles: { [key: number]: string } = {
    1: 'Administrador',
    2: 'Trabajador',
    3: 'Cliente'
  };

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.obtenerUsuariosActivos();
  }

  obtenerUsuariosActivos(): void {
    this.http.get<any[]>('http://localhost/api/consultar_usuarios_activos.php')
      .subscribe(
        (data) => {
          this.usuariosActivos = data;  // Cargar usuarios activos
          this.loading = false;
        },
        (error) => {
          console.error('Error al obtener los usuarios activos:', error);
          this.errorMessage = 'Hubo un error al cargar los usuarios activos.';
          this.loading = false;
        }
      );
  }

  // Método para obtener el nombre del rol a partir del ID
  getNombreRol(roleId: number): string {
    return this.roles[roleId] || 'Desconocido'; // Si el rol no existe, muestra 'Desconocido'
  }

  consultarUsuario(id: number): void {
    this.router.navigate(['/consultar-usuario', id]);  // Redirige al componente de detalles del usuario
  }
}
