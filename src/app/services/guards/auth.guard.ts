import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const userData = this.authService.getUserData();

    // Verificar si el usuario está autenticado
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    // Verificar si el rol no es null
    const userRole = userData.role;
    if (!userRole) {
      this.router.navigate(['/login']);
      return false;
    }

    // Verificar el rol del usuario
    const requiredRoles = route.data['roles'] as string[];
    if (requiredRoles && !requiredRoles.includes(userRole)) {
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}
