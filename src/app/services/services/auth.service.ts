import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root', // Asegúrate de que el servicio esté disponible globalmente
})
export class AuthService {
  private userData = new BehaviorSubject<{ username: string | null; role: string | null }>({
    username: null,
    role: null,
  });

  userData$ = this.userData.asObservable();

  constructor() {
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role_id');
    if (username && role) {
      this.userData.next({ username, role });
    }
  }

  setUserData(username: string, role: string) {
    this.userData.next({ username, role });
    localStorage.setItem('username', username);
    localStorage.setItem('role_id', role);
  }

  logout() {
    localStorage.clear();
    this.userData.next({ username: null, role: null });
  }
}