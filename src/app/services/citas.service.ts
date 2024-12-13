import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CitasService {
  private apiUrl = 'http://localhost/api/citas/obtener_horas_disponibles.php'; // La URL de tu API

  constructor(private http: HttpClient) {}

  obtenerHorasDisponibles(fecha: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?fecha=${fecha}`);
  }
}
