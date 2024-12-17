import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './citas.component.html',
  styleUrls: ['./citas.component.css']
})
export class CitasComponent implements OnInit {
  role: string | null = null;
  userId: string | null = null;
  usuarios: any[] = [];
  mascotas: any[] = [];
  citas: any[] = [];
  availableHours: string[] = [];
  selectedUsuario: number | null = null;
  selectedMascota: number | null = null;
  selectedFecha: string = '';
  selectedHora: string = '';
  motivo: string = '';
  submitted: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  minDate: string = '';
  maxDate: string = '';
  searchFecha: string = '';  // Variable para la búsqueda por fecha
  searchEstado: string = '';  // Variable para el filtro por estado

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const userData = this.authService.getUserData();
    this.role = userData.role;
    this.userId = userData.id;

    if (this.role === '1' || this.role === '2') {
      this.loadUsuarios();
    }

    this.loadMascotas();
    this.loadCitas();
    this.setFechaLimite();
  }

  setFechaLimite(): void {
    const today = new Date();
    this.minDate = this.formatDate(today);

    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 14);
    this.maxDate = this.formatDate(maxDate);
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  loadUsuarios(): void {
    this.http.get<any[]>('http://localhost/api/citas/usuarios.php').subscribe({
      next: (data) => (this.usuarios = data),
      error: (err) => console.error('Error al cargar los usuarios:', err),
    });
  }

  loadMascotas(): void {
    let url = '';
    if (this.role === '1' || this.role === '2') {
      if (this.selectedUsuario) {
        url = `http://localhost/api/citas/mascotas.php?user_id=${this.selectedUsuario}`;
      }
    } else {
      url = `http://localhost/api/citas/mascotas.php?user_id=${this.userId}`;
    }

    if (url) {
      this.http.get<any[]>(url).subscribe({
        next: (data) => {
          this.mascotas = data;
          if (this.selectedFecha) {
            this.updateAvailableHours();
          }
        },
        error: (err) => console.error('Error al cargar las mascotas:', err),
      });
    }
  }
  loadCitas(): void {
    let url = '';
    if (this.role === '1' || this.role === '2') {
      url = 'http://localhost/api/citas/citas_admin.php';
    } else if (this.role === '3') {
      // Agregar parámetros de filtro si están definidos
      let queryParams = `?user_id=${this.userId}`;
      if (this.searchFecha) {
        queryParams += `&fecha=${this.searchFecha}`;
      }
      if (this.searchEstado) {
        queryParams += `&estado=${this.searchEstado}`;
      }
      url = `http://localhost/api/citas/citas_usuario.php${queryParams}`;
    }
  
    if (url) {
      this.http.get<any[]>(url).subscribe({
        next: (data) => {
          this.citas = data;
          this.filterCitas();  // Aplicar filtros al cargar las citas
        },
        error: (err) => console.error('Error al cargar las citas:', err),
      });
    }
  }

  updateAvailableHours(): void {
    if (!this.selectedFecha) return;
    this.http.get<any>(`http://localhost/api/citas/obtener_horas_disponibles.php?fecha=${this.selectedFecha}`).subscribe({
      next: (data) => {
        this.availableHours = data.available_hours;
      },
      error: (err) => {
        console.error('Error al obtener las horas disponibles:', err);
      }
    });
  }

  filterCitas(): void {
    let filteredCitas = [...this.citas];  // Copiar las citas para no modificar la lista original
  
    // Filtrar por fecha
    if (this.searchFecha) {
      filteredCitas = filteredCitas.filter(cita => cita.fecha_visita === this.searchFecha);
    }
  
    // Filtrar por estado
    if (this.searchEstado) {
      filteredCitas = filteredCitas.filter(cita => cita.estado === this.searchEstado);
    }
  
    // Si el rol es 'usuario' (role 3), filtrar las citas canceladas
    if (this.role === '3') {
      filteredCitas = filteredCitas.filter(cita => cita.estado !== 'cancelada');
    }
  
    // Si el estado seleccionado es 'Todos', mostrar todas las citas activas (no canceladas)
    if (this.searchEstado === 'Todos') {
      filteredCitas = filteredCitas.filter(cita => cita.estado !== 'cancelada');
    }
  
    this.citas = filteredCitas;
  }
  createCita(): void {
    if (!this.selectedFecha || !this.selectedHora || !this.selectedMascota || !this.motivo) {
      this.errorMessage = 'Por favor, completa todos los campos antes de enviar.';
      return;
    }

    if (!this.validateHorario()) {
      alert('La hora seleccionada no es válida. Debe estar entre las 8:00 y las 21:00 y debe ser una hora completa.');
      return;
    }

    const citaData = {
      user_id: this.role === '3' ? this.userId : this.selectedUsuario,
      mascota_id: this.selectedMascota,
      fecha: this.selectedFecha,
      hora: this.selectedHora,
      motivo: this.motivo,
    };

    this.http.post('http://localhost/api/citas/registrar_cita.php', citaData).subscribe({
      next: (response) => {
        this.successMessage = '¡Cita registrada con éxito!';
        this.errorMessage = '';
        this.loadCitas();
        this.submitted = true;
      },
      error: (err) => {
        console.error('Error al crear la cita:', err);
        this.successMessage = '';
        this.errorMessage = 'Hubo un error al crear la cita. Verifica los datos e intenta de nuevo.';
      },
    });
  }

  validateHorario(): boolean {
    if (!this.selectedHora) return false;
    const hora = parseInt(this.selectedHora.split(':')[0], 10);

    if (hora < 8 || hora >= 21 || !this.selectedHora.endsWith(':00')) {
      return false;
    }

    const horaSeleccionada = this.availableHours.includes(this.selectedHora);
    if (!horaSeleccionada) {
      return false;
    }

    return true;
  }

  EliminarCita(idCita: number): void {
    this.http.delete(`http://localhost/api/citas/eliminar_cita.php?id_cita=${idCita}`).subscribe({
      next: (response) => {
        console.log('Cita eliminada:', response);
        this.citas = this.citas.filter(cita => cita.id_cita !== idCita);
      },
      error: (err) => {
        console.error('Error al eliminar la cita', err);
      }
    });
  }

  resetForm(): void {
    this.submitted = false;
    this.selectedUsuario = null;
    this.selectedMascota = null;
    this.selectedFecha = '';
    this.selectedHora = '';
    this.motivo = '';
    this.successMessage = '';
    this.errorMessage = '';
  }

  consultarCita(id_cita: number): void {
    this.router.navigate(['/consultar-cita', id_cita]);
  }
}
