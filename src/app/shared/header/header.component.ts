import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { RouterModule } from '@angular/router'; // Importa RouterModule
import { AuthService } from '../../services/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  username: string | null = null;
  role: string | null = null;

  // Variables para manejar los dropdowns
  showDropdown: boolean = false; // Dropdown para "Mascotas"
  ventasDropdown: boolean = false; // Dropdown para "Ventas"
  usuariosDropdown: boolean = false; // Dropdown para "Usuarios"

  private userSubscription: Subscription;

  constructor(private authService: AuthService, private router: Router) {
    this.userSubscription = new Subscription();
  }

  ngOnInit(): void {
    this.userSubscription = this.authService.userData$.subscribe((userData) => {
      this.username = userData.username;
      switch (userData.role) {
        case '1':
          this.role = 'Admin';
          break;
        case '2':
          this.role = 'Worker';
          break;
        case '3':
          this.role = 'Client';
          break;
        default:
          this.role = null;
      }
    });
  }

  // Métodos para manejar los diferentes dropdowns
  toggleDropdown(show: boolean, dropdown: string): void {
    if (dropdown === 'mascotas') {
      this.showDropdown = show;
    } else if (dropdown === 'ventas') {
      this.ventasDropdown = show;
    } else if (dropdown === 'usuarios') {
      this.usuariosDropdown = show;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }
}
