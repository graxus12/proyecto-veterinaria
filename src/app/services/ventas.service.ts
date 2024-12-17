import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VentasService {

  private apiUrl = 'http://localhost/api/ventas/';  // URL base de la API

  constructor(private http: HttpClient) { }

  // Método para obtener todos los productos del inventario
  obtenerProductos(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}consultar_inventario.php`);
  }

  // Método para obtener un producto por su código de barras
  obtenerProductoPorCodigo(codigoBarras: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}consultar_producto.php?codigo_barras=${codigoBarras}`);
  }

  // Método para registrar una venta
  registrarVenta(ventaData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}registrar_venta.php`, ventaData);
  }

  // Método para consultar una venta por ID
  consultarVenta(idVenta: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}consultar_venta.php?id_venta=${idVenta}`);
  }

  // Método para obtener ventas filtradas por fecha
  filtrarVentas(fecha_inicio: string, fecha_fin: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}filtrar_ventas.php?fecha_inicio=${fecha_inicio}&fecha_fin=${fecha_fin}`);
  }

  // Método para actualizar un producto en el inventario
  actualizarProducto(product: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}actualizar_producto.php?codigo=${product.codigo}`, product);
  }

  // Método para registrar un nuevo producto en el inventario
  registrarProducto(product: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}registrar_producto_inventario.php`, product);
  }

  // Método para actualizar un servicio, si fuera necesario (puede ser opcional dependiendo de la estructura de tu backend)
  actualizarServicio(servicio: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}actualizar_servicio.php?id=${servicio.id}`, servicio);
  }

  // Método para generar el reporte de ventas
generarReporteVentas(fecha_inicio: string, fecha_fin: string): Observable<any> {
  return this.http.post<any>(`${this.apiUrl}generar_reportes_ventas.php`, { fecha_inicio, fecha_fin });
}

}
