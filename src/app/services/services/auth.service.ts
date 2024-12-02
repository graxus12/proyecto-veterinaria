import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userData = new BehaviorSubject<{ username: string | null; role: string | null, id: string | null, token: string | null }>({
    username: null,
    role: null,
    id: null,
    token: null  // Agregamos el campo token aquí
  });

  userData$ = this.userData.asObservable();

  constructor() {
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role_id');
    const id = localStorage.getItem('id');
    const token = localStorage.getItem('token');  // Recuperar el token también

    if (username && role && id && token) {
      this.userData.next({ username, role, id, token });  // Guardamos también el token
    }
  }

  // Método para almacenar los datos del usuario y el token
  setUserData(username: string, role: string, id: string, token: string): void {
    this.userData.next({ username, role, id, token });
    localStorage.setItem('username', username);
    localStorage.setItem('role_id', role);
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);  // Guardamos el token en localStorage
  }

  // Método para eliminar los datos del usuario y el token
  logout(): void {
    localStorage.removeItem('username');
    localStorage.removeItem('role_id');
    localStorage.removeItem('id');
    localStorage.removeItem('token');  // Eliminamos también el token
    this.userData.next({ username: null, role: null, id: null, token: null });
  }

  // Método para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return token != null;
  }
}
