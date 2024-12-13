import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/services/auth.service';
import { RouterModule } from '@angular/router';  // Asegúrate de importar RouterModule

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './citas.component.html',
  styleUrls: ['./citas.component.css']
})
export class CitasComponent implements OnInit {
  role: string | null = null;
  userId: string | null = null;
  usuarios: any[] = [];
  mascotas: any[] = [];
  citas: any[] = [];
  availableHours: string[] = [];  // Horas disponibles
  selectedUsuario: number | null = null;
  selectedMascota: number | null = null;
  selectedFecha: string = '';
  selectedHora: string = '';
  motivo: string = '';
  submitted: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  minDate: string = ''; // Fecha mínima (hoy)
  maxDate: string = ''; // Fecha máxima (dentro de 2 semanas)

  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const userData = this.authService.getUserData();
    this.role = userData.role;
    this.userId = userData.id;

    // Si el rol es admin o trabajador, cargar todos los usuarios
    if (this.role === '1' || this.role === '2') {
      this.loadUsuarios();
    }

    this.loadMascotas();
    this.loadCitas();
    this.setFechaLimite(); // Establecer el rango de fechas
  }

  setFechaLimite(): void {
    const today = new Date();
    this.minDate = this.formatDate(today);

    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 14);  // Aumentar 14 días
    this.maxDate = this.formatDate(maxDate);
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Añadir cero al mes si es un solo dígito
    const day = date.getDate().toString().padStart(2, '0'); // Añadir cero al día si es un solo dígito
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
            this.updateAvailableHours();  // Actualizar horas disponibles si ya se ha seleccionado una fecha
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
      url = `http://localhost/api/citas/citas_usuario.php?user_id=${this.userId}`;
    }

    if (url) {
      this.http.get<any[]>(url).subscribe({
        next: (data) => {
          this.citas = data;
          this.updateAvailableHours(); // Actualizar las horas disponibles
        },
        error: (err) => console.error('Error al cargar las citas:', err),
      });
    }
  }

  updateAvailableHours(): void {
    if (!this.selectedFecha) return;  // Verifica si la fecha está seleccionada
    this.http.get<any>(`http://localhost/api/citas/obtener_horas_disponibles.php?fecha=${this.selectedFecha}`).subscribe({
      next: (data) => {
        this.availableHours = data.available_hours;
      },
      error: (err) => {
        console.error('Error al obtener las horas disponibles:', err);
      }
    });
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
        this.loadCitas(); // Recargar las citas para actualizar las horas disponibles
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

    // Verificar que la hora esté dentro del rango permitido
    if (hora < 8 || hora >= 21 || !this.selectedHora.endsWith(':00')) {
      return false;
    }

    // Verificar que la hora seleccionada esté en las horas disponibles
    const horaSeleccionada = this.availableHours.includes(this.selectedHora);
    if (!horaSeleccionada) {
      return false;
    }

    return true;
  }

 // Método para eliminar una cita
  EliminarCita(idCita: number): void {
    this.http.delete(`http://localhost/api/citas/eliminar_cita.php?id_cita=${idCita}`).subscribe({
      next: (response) => {
        // Si la cita se elimina correctamente, eliminarla de la lista
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
