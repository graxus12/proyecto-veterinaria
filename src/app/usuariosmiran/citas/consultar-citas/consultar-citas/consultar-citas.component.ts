import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Asegúrate de que FormsModule está importado
import { CitasService } from '../../../../services/citas.service';
import { AuthService } from '../../../../services/services/auth.service';
import { Subscription } from 'rxjs'; // Necesario para gestionar la suscripción

interface UserData {
  username: string | null;
  role: string | null;
  id: string | null;    // Agregar id al tipo
  token: string | null; // Agregar token al tipo
}

@Component({
  selector: 'app-consultar-citas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './consultar-citas.component.html',
  styleUrls: ['./consultar-citas.component.css']
})
export class ConsultarCitasComponent implements OnInit, OnDestroy {
  cita: any; // Detalles de la cita
  editMode: boolean = false; // Modo edición
  horasDisponibles: string[] = []; // Array para almacenar las horas disponibles
  fechaSeleccionada: string = ''; // Fecha seleccionada para obtener las horas disponibles
  horaSeleccionada: string = ''; // Hora seleccionada de la cita (agregada)
  minDate: string = ''; // Fecha mínima disponible (puedes ajustarlo a tus necesidades)
  role: string | null = ''; // Rol del usuario, puede ser string o null
  userSubscription: Subscription = new Subscription(); // Inicialización explícita de la suscripción

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private citasService: CitasService, // Inyectamos el servicio de citas
    private authService: AuthService // Inyectamos el servicio de autenticación
    
  ) {}

  ngOnInit(): void {
    // Suscripción para obtener los datos del usuario
    this.userSubscription = this.authService.userData$.subscribe((userData: UserData) => {
      this.role = '';
      switch (userData.role) {
        case '1':
          this.role = 'Admin';
          break;
        case '2':
          this.role = 'Worker';
          break;
        case '3':
          this.role = 'Client';
          break;
        default:
          this.role = null;
      }
    });

    const citaId = this.route.snapshot.paramMap.get('id');
    if (citaId) {
      this.http.get<any>(`http://localhost/api/citas/consultar_detalles_cita.php?cita_id=${citaId}`)
        .subscribe(
          data => {
            this.cita = data;
            this.fechaSeleccionada = this.cita.fecha_visita; // Asigna la fecha de la cita
            this.horaSeleccionada = this.cita.hora_cita; // Asigna la hora de la cita (ahora ya funciona)

            // Establece la fecha mínima
            this.minDate = new Date().toISOString().split('T')[0]; 
            
            this.obtenerHorasDisponibles(); // Actualiza las horas disponibles al iniciar
          },
          error => {
            console.error('Error al obtener los detalles de la cita', error);
          }
        );
    }
  }

  ngOnDestroy(): void {
    // Es importante desuscribirse cuando el componente se destruye
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  enableEditMode() {
    this.editMode = true;
  }

  saveChanges() {
    this.http.post('http://localhost/api/citas/actualizar_cita.php', this.cita)
      .subscribe(
        response => {
          console.log('Cita actualizada exitosamente', response);
          this.editMode = false; // Salir del modo edición
        },
        error => {
          console.error('Error al actualizar la cita', error);
        }
      );
  }

  cancelEditMode() {
    this.editMode = false; // Salir del modo edición sin guardar cambios
  }

  // Método para obtener las horas disponibles según la fecha seleccionada
  obtenerHorasDisponibles() {
    if (this.fechaSeleccionada) {
      this.citasService.obtenerHorasDisponibles(this.fechaSeleccionada).subscribe(
        data => {
          this.horasDisponibles = data.available_hours; // Asignamos las horas disponibles al array
        },
        error => {
          console.error('Error al obtener las horas disponibles', error);
        }
      );
    }
  }

  // Método para actualizar las horas disponibles cuando se cambia la fecha
  updateAvailableHours() {
    if (!this.fechaSeleccionada) return; // Verifica si la fecha está seleccionada
    this.http.get<any>(`http://localhost/api/citas/obtener_horas_disponibles.php?fecha=${this.fechaSeleccionada}`).subscribe({
      next: (data) => {
        this.horasDisponibles = data.available_hours;
      },
      error: (err) => {
        console.error('Error al obtener las horas disponibles:', err);
      }
    });
  }




  // Método para verificar si el usuario es cliente y no permitir editar el historial de consultas
  isClient(): boolean {
    return this.role === 'Client';
  }
}
