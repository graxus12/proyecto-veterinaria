import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-consultar-mascota',
  standalone: true,
  imports: [CommonModule, FormsModule], // Importa FormsModule para ngModel
  templateUrl: './consultar-mascota.component.html',
  styleUrls: ['./consultar-mascota.component.css']
})
export class ConsultarMascotaComponent implements OnInit {
  mascota: any = {};
  id: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id) {
      this.getDetallesMascota(this.id);
    }
  }

  getDetallesMascota(id: number): void {
    this.http
      .get<any>(`http://localhost/api/consultar_mascota.php?id=${id}`)
      .subscribe(
        (data) => {
          this.mascota = data;
        },
        (error) => {
          console.error('Error al obtener los detalles de la mascota:', error);
        }
      );
  }

  actualizarMascota(): void {
    if (!this.id) {
      alert('ID de la mascota no válido.');
      return;
    }

    this.http
      .post(`http://localhost/api/actualizar_mascota.php`, this.mascota)
      .subscribe(
        (response) => {
          alert('Mascota actualizada correctamente.');
          this.router.navigate(['/mascotas']); // Redirige a la lista de mascotas
        },
        (error) => {
          console.error('Error al actualizar la mascota:', error);
          alert('Hubo un error al actualizar la mascota.');
        }
      );
  }

  calcularEdad(): void {
    if (this.mascota.fecha_nacimiento) {
      const hoy = new Date();
      const nacimiento = new Date(this.mascota.fecha_nacimiento);
      let edad = hoy.getFullYear() - nacimiento.getFullYear();
      const mes = hoy.getMonth() - nacimiento.getMonth();

      // Si el mes actual es menor al mes de nacimiento o el día actual es menor, restar 1 a la edad
      if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
      }

      this.mascota.edad = edad > 0 ? edad : 0; // Mostrar 0 si la fecha es futura
    }
  }

  volver(): void {
    this.router.navigate(['/mascotas']); // Redirige a la página de mascotas
  }
}
