import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VentasService } from '../../services/ventas.service';

@Component({
  selector: 'app-consultarventa',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './consultarventa.component.html',
  styleUrls: ['./consultarventa.component.css']
})
export class ConsultarventaComponent {
  ventas: any[] = []; // Lista de ventas
  filtros: any = { fecha_inicio: '', fecha_fin: '' }; // Filtros de fecha
  ventaDetalles: any = {}; // Detalles de la venta seleccionada
  ventaSeleccionada: number | null = null; // ID de la venta seleccionada
  detallesVisible: boolean = false; // Para controlar si mostrar u ocultar los detalles

  constructor(private ventasService: VentasService) {}

  // Método para aplicar los filtros de fecha y obtener las ventas
  aplicarFiltros() {
    const { fecha_inicio, fecha_fin } = this.filtros;
    if (fecha_inicio && fecha_fin) {
      this.ventasService.filtrarVentas(fecha_inicio, fecha_fin).subscribe((ventas: any) => {
        this.ventas = ventas;
      });
    } else {
      alert('Por favor, ingrese ambas fechas.');
    }
  }

  // Método para ver los detalles de una venta
  verDetalles(idVenta: number) {
    // Si ya estamos viendo los detalles de la misma venta, los ocultamos
    if (this.ventaSeleccionada === idVenta) {
      this.ocultarDetalles();
    } else {
      this.ventasService.consultarVenta(idVenta).subscribe((ventaDetalles: any) => {
        this.ventaDetalles = ventaDetalles; // Guardamos los detalles completos de la venta
        this.ventaSeleccionada = idVenta; // Actualizamos la venta seleccionada
        this.detallesVisible = true; // Mostramos los detalles
      });
    }
  }

  // Método para ocultar los detalles de la venta
  ocultarDetalles() {
    this.detallesVisible = false;
    this.ventaSeleccionada = null; // Restablecemos la venta seleccionada
  }
}
