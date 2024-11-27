import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { RouterModule } from '@angular/router'; // Importa RouterModule
import { AuthService } from '../../services/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule], // Asegúrate de incluir RouterModule aquí
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  username: string | null = null;
  private userSubscription: Subscription;

  constructor(private authService: AuthService, private router: Router) {
    this.userSubscription = new Subscription();
  }

  ngOnInit(): void {
    // Nos suscribimos al observable para obtener los datos del usuario
    this.userSubscription = this.authService.userData$.subscribe((userData) => {
      this.username = userData.username;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']); // Redirigir a la página de inicio
  }

  ngOnDestroy(): void {
    // Cancelamos la suscripción al observable para evitar fugas de memoria
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
