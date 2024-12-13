import { Component } from '@angular/core';
import { VentasService } from '../../services/ventas.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent {
  codigoBarras: string = '';
  productosVenta: any[] = []; // Array de productos y servicios en la venta
  totalVenta: number = 0;
  montoPago: number = 0;  // Monto con el que paga el usuario
  cambio: number = 0;  // El cambio que se le dará al usuario

  // Variables para el formulario de servicio
  mostrarFormularioServicio: boolean = false;
  nombreServicio: string = '';
  precioServicio: number = 0;

  constructor(private ventasService: VentasService) { }

  // Método para buscar el producto al escanear el código de barras
  buscarProducto() {
    if (this.codigoBarras.trim()) {
      this.ventasService.obtenerProductoPorCodigo(this.codigoBarras).subscribe(
        (producto) => {
          if (producto) {
            this.agregarProductoVenta(producto);
            this.codigoBarras = '';  // Limpiar el campo de código de barras después de agregar el producto
          } else {
            alert('Producto no encontrado');
          }
        },
        (error) => {
          console.error('Error al buscar producto', error);
          alert('Error al buscar producto');
        }
      );
    }
  }

  // Método para agregar el producto a la lista de venta
  agregarProductoVenta(producto: any) {
    const productoExistente = this.productosVenta.find(p => p.codigo_barras === producto.codigo_barras);
    if (productoExistente) {
      productoExistente.cantidad += 1;  // Aumentar la cantidad si ya existe
    } else {
      this.productosVenta.push({ ...producto, cantidad: 1, total: producto.precio });
    }
    this.calcularTotalVenta();
  }

  // Método para agregar el servicio manualmente a la venta
  agregarServicio() {
    if (this.nombreServicio.trim() && this.precioServicio > 0) {
      const servicio = {
        nombre: this.nombreServicio,
        codigo_barras: 'N/A', // Los servicios no tienen código de barras
        cantidad: 1,
        precio: this.precioServicio,
        total: this.precioServicio
      };
      this.productosVenta.push(servicio);
      this.calcularTotalVenta();
      this.nombreServicio = '';
      this.precioServicio = 0;
      this.mostrarFormularioServicio = false;  // Cerrar el formulario de servicio
    } else {
      alert('Debe ingresar un nombre y un precio para el servicio');
    }
  }

  // Método para recalcular el total de la venta
  calcularTotalVenta() {
    this.totalVenta = this.productosVenta.reduce((total, item) => {
      item.total = item.precio * item.cantidad;  // Calcular total por producto o servicio
      return total + item.total;  // Sumar al total general
    }, 0);
  }

  // Método para eliminar un producto o servicio de la lista de venta
  eliminarProducto(item: any) {
    const index = this.productosVenta.indexOf(item);
    if (index > -1) {
      this.productosVenta.splice(index, 1);  // Eliminar el producto o servicio
      this.calcularTotalVenta();  // Recalcular el total
    }
  }

  // Método para calcular el cambio en tiempo real
  calcularCambio() {
    if (this.montoPago >= this.totalVenta) {
      this.cambio = this.montoPago - this.totalVenta;
    } else {
      this.cambio = 0; // Si el monto es insuficiente, el cambio es 0
    }
  }

  // Método para confirmar el pago y registrar la venta
  confirmarPago() {
    if (this.montoPago >= this.totalVenta) {
      this.registrarVenta();
    } else {
      alert('El monto pagado es insuficiente.');
    }
  }

  // Método para registrar la venta
  registrarVenta() {
    if (this.productosVenta.length > 0) {
      const ventaData = {
        productos: this.productosVenta.map(p => ({
          codigo_barras: p.codigo_barras,
          nombre: p.nombre,
          cantidad: p.cantidad,
          precio: p.precio,
          total: p.total
        })),
        total: this.totalVenta
      };

      this.ventasService.registrarVenta(ventaData).subscribe(
        (response) => {
          alert('Venta registrada exitosamente');
          this.productosVenta = [];
          this.totalVenta = 0;
          this.montoPago = 0;
          this.cambio = 0;
        },
        (error) => {
          console.error('Error al registrar la venta', error);
          alert('Error al registrar la venta');
        }
      );
    } else {
      alert('Debe agregar productos o servicios para registrar la venta');
    }
  }
}
