import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-consultar-mascota',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './consultar-mascota.component.html',
  styleUrls: ['./consultar-mascota.component.css']
})
export class ConsultarMascotaComponent implements OnInit {
  mascota: any = {};
  citasCompletadas: any[] = [];
  detallesCita: any = null;  // Para almacenar los detalles de la cita seleccionada
  historialConsultas: any[] = [];  // Para almacenar el historial de consultas
  id: number | null = null;
  selectedFile: File | null = null;

  // Propiedades que faltan
  searchQuery: string = '';  // Para el buscador de citas
  citasFiltradas: any[] = [];  // Para almacenar las citas filtradas

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id) {
      this.getDetallesMascota(this.id);
      this.getCitasCompletadas();
    }
  }

  getDetallesMascota(id: number): void {
    this.http.get<any>(`http://localhost/api/consultar_mascota.php?id=${id}`).subscribe(
      data => {
        this.mascota = data;
        if (this.mascota.foto && !this.mascota.foto.startsWith('http://localhost/api/')) {
          this.mascota.foto = 'http://localhost/api/' + this.mascota.foto;
        }
      },
      error => {
        console.error('Error al obtener los detalles de la mascota:', error);
      }
    );
  }

  getCitasCompletadas(): void {
    if (this.id) {
      this.http.get<any[]>(`http://localhost/api/citas/obtener_citas_completadas.php?id_mascota=${this.id}`).subscribe(
        data => {
          console.log('Datos de citas:', data);
          this.citasCompletadas = data;
          this.citasFiltradas = data;  // Al principio, todas las citas están filtradas
        },
        error => {
          console.error('Error al obtener las citas completadas:', error);
          this.citasCompletadas = [];
          this.citasFiltradas = [];
        }
      );
    }
  }

  verDetallesCita(idCita: number): void {
    this.http.get<any>(`http://localhost/api/citas/obtener_detalles_cita.php?id_cita=${idCita}`).subscribe(
      citaData => {
        this.detallesCita = citaData;
        this.obtenerHistorialConsultas(idCita); // Obtener historial de consultas
      },
      error => {
        console.error('Error al obtener los detalles de la cita:', error);
      }
    );
  }

  obtenerHistorialConsultas(idCita: number): void {
    this.http.get<any[]>(`http://localhost/api/citas/obtener_historial_consultas.php?id_cita=${idCita}`).subscribe(
      historialData => {
        this.historialConsultas = historialData;
      },
      error => {
        console.error('Error al obtener el historial de consultas:', error);
        this.historialConsultas = [];
      }
    );
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido.');
        return;
      }

      const maxSize = 2 * 1024 * 1024; // 2 MB
      if (file.size > maxSize) {
        alert('La imagen no debe superar los 2 MB.');
        return;
      }

      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.mascota.foto = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  actualizarMascota(): void {
    if (!this.mascota.nombre || !this.mascota.fecha_nacimiento || !this.mascota.raza || !this.id) {
      alert('Por favor completa todos los campos obligatorios.');
      return;
    }

    const formData = new FormData();
    formData.append('id', this.id.toString());
    formData.append('nombre', this.mascota.nombre);
    formData.append('fecha_nacimiento', this.mascota.fecha_nacimiento);
    formData.append('raza', this.mascota.raza);
    formData.append('especie', this.mascota.especie);
    formData.append('sexo', this.mascota.sexo);
    formData.append('peso', this.mascota.peso);
    formData.append('estado', this.mascota.estado);

    if (this.selectedFile) {
      formData.append('foto', this.selectedFile);
    }

    this.http.post('http://localhost/api/actualizar_mascota.php', formData).subscribe(
      response => {
        alert('Mascota actualizada exitosamente');
        this.router.navigate(['/mascotas']);
      },
      error => {
        console.error('Error al actualizar la mascota:', error);
        alert('Hubo un problema al actualizar la mascota. Inténtalo de nuevo.');
      }
    );
  }

  calcularEdad(): void {
    if (this.mascota.fecha_nacimiento) {
      const birthDate = new Date(this.mascota.fecha_nacimiento);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        this.mascota.edad = age - 1;
      } else {
        this.mascota.edad = age;
      }
    }
  }

  buscarCitas(): void {
    if (this.searchQuery.trim()) {
      this.citasFiltradas = this.citasCompletadas.filter(cita =>
        cita.fecha_visita.includes(this.searchQuery) ||
        cita.hora_cita.includes(this.searchQuery) ||
        cita.motivo.includes(this.searchQuery) ||
        (cita.mascota_nombre && cita.mascota_nombre.includes(this.searchQuery))
      );
    } else {
      this.citasFiltradas = this.citasCompletadas;
    }
  }

  volver(): void {
    this.router.navigate(['/mascotas']);
  }
}
