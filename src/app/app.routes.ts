import { Routes } from '@angular/router';
import { MainContentComponent } from './nolog/main-content/main-content.component';
import { MascotasComponent } from './usuariosmiran/mascotas/mascotas.component';
import { CitasComponent } from './usuariosmiran/citas/citas.component';
import { LoginComponent } from './usuariosmiran/login/login.component';
import { RegistroComponent } from './usuariosmiran/registro/registro.component';

export const routes: Routes = [
  { path: '', component: MainContentComponent }, // Página principal
  { path: 'mascotas', component: MascotasComponent }, // Página de mascotas
  { path: 'citas', component: CitasComponent }, // Página de citas
  { path: 'login', component: LoginComponent }, // Página de login
  { path: 'registro', component: RegistroComponent }, // Página de registro

  // Ruta wildcard para manejar rutas no existentes
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
