import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  usuarios: any[] = [];  // Lista completa de usuarios
  filteredUsuarios: any[] = [];  // Lista de usuarios filtrados
  loading: boolean = true;  // Indicador de carga
  errorMessage: string = '';  // Mensaje de error
  searchQuery: string = '';  // Valor de la búsqueda

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  obtenerUsuarios(): void {
    this.http.get<any[]>('http://localhost/api/usuarios.php')
      .subscribe(
        (data) => {
          this.usuarios = data;  // Cargar usuarios en la propiedad
          this.filteredUsuarios = data;  // Inicialmente, mostrar todos los usuarios
          this.loading = false;
        },
        (error) => {
          console.error('Error al obtener los usuarios:', error);
          this.errorMessage = 'Hubo un error al cargar los usuarios.';
          this.loading = false;
        }
      );
  }

  filterUsuarios(): void {
    if (this.searchQuery) {
      this.filteredUsuarios = this.usuarios.filter(usuario => 
        usuario.first_name.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
        usuario.last_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        usuario.email.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.filteredUsuarios = this.usuarios;
    }
  }

  consultarUsuario(id: number): void {
    this.router.navigate(['/consultar-usuario', id]); // Redirige al componente de detalles
  }
}
