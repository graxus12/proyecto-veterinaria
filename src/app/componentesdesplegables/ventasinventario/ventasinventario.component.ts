import { Component, OnInit } from '@angular/core';
import { VentasService } from '../../services/ventas.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Definir la interfaz Producto
interface Producto {
  codigo: number;
  codigo_barras: string;
  nombre: string;
  stock: number;
  descripcion: string;
  precio: number;
  estado: string;
  categoria: string;
}

@Component({
  selector: 'app-ventasinventario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ventasinventario.component.html',
  styleUrls: ['./ventasinventario.component.css']
})
export class VentasinventarioComponent implements OnInit {
  productos: Producto[] = [];
  filteredProducts: Producto[] = [];
  searchQuery: string = '';
  selectedStatus: string = '';
  selectedProduct: Producto | null = null;
  mostrarFormulario: boolean = false;  // Controla si el formulario está visible
  nuevoProducto: Producto = {  // Inicializa un nuevo producto vacío
    codigo: 0,
    codigo_barras: '',
    nombre: '',
    stock: 0,
    descripcion: '',
    precio: 0,
    estado: 'activo',
    categoria: ''
  };

  constructor(private ventasService: VentasService) { }

  ngOnInit(): void {
    this.ventasService.obtenerProductos().subscribe(
      (data) => {
        this.productos = data;
        this.filteredProducts = data;
      },
      (error) => {
        console.error('Error al obtener productos', error);
      }
    );
  }

  filterProducts() {
    this.filteredProducts = this.productos.filter(product =>
      (product.nombre.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        product.codigo_barras.includes(this.searchQuery)) &&
      (this.selectedStatus ? product.estado === this.selectedStatus : true)
    );
  }

  editarProducto(product: Producto) {
    this.selectedProduct = { ...product };
  }

  guardarCambios() {
    if (this.selectedProduct) {
      const updatedProduct: Producto = { 
        nombre: this.selectedProduct.nombre,
        stock: this.selectedProduct.stock,
        descripcion: this.selectedProduct.descripcion,
        precio: this.selectedProduct.precio,
        estado: this.selectedProduct.estado,
        categoria: this.selectedProduct.categoria,
        codigo: this.selectedProduct.codigo,
        codigo_barras: this.selectedProduct.codigo_barras
      };

      if (this.productos.find(p => p.codigo === updatedProduct.codigo && JSON.stringify(p) !== JSON.stringify(updatedProduct))) {
        this.ventasService.actualizarProducto(updatedProduct).subscribe(
          (response) => {
            alert(response.message);
            this.cancelarEdicion();
            this.ngOnInit();
          },
          (error) => {
            console.error('Error al actualizar el producto', error);
            alert('Hubo un error al actualizar el producto');
          }
        );
      } else {
        alert('No se realizaron cambios en el producto.');
        this.cancelarEdicion();
      }
    }
  }

  cancelarEdicion() {
    this.selectedProduct = null;
  }

  // Mostrar el formulario para registrar un producto
  mostrarFormularioRegistro() {
    this.mostrarFormulario = true;
  }

  // Cancelar el registro y ocultar el formulario
  cancelarRegistro() {
    this.mostrarFormulario = false;
    this.nuevoProducto = {
      codigo: 0,
      codigo_barras: '',
      nombre: '',
      stock: 0,
      descripcion: '',
      precio: 0,
      estado: 'activo',
      categoria: ''
    };
  }

  // Registrar el nuevo producto
  registrarProducto() {
    this.ventasService.registrarProducto(this.nuevoProducto).subscribe(
      (response) => {
        alert(response.message);  // Muestra mensaje de éxito
        this.cancelarRegistro();  // Oculta el formulario
        this.ngOnInit();  // Recarga la lista de productos
      },
      (error) => {
        console.error('Error al registrar el producto', error);
        alert('Hubo un error al registrar el producto');
      }
    );
  }
}
