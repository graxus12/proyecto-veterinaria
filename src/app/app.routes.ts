import { Routes } from '@angular/router';
import { MainContentComponent } from './nolog/main-content/main-content.component';
import { MascotasComponent } from './usuariosmiran/mascotas/mascotas.component';
import { ConsultarMascotaComponent } from './usuariosmiran/mascotas/consultar-mascota/consultar-mascota.component';
import { CitasComponent } from './usuariosmiran/citas/citas.component';
import { LoginComponent } from './usuariosmiran/login/login.component';
import { RegistroComponent } from './usuariosmiran/registro/registro.component';
import { VentasComponent } from './admin/ventas/ventas.component';
import { UsuariosComponent } from './admin/usuarios/usuarios.component';
import { RegistrarmascotaComponent } from './componentesdesplegables/registrarmascota/registrarmascota.component';
import { ConsultarventaComponent } from './componentesdesplegables/consultarventa/consultarventa.component';
import { VentasinventarioComponent } from './componentesdesplegables/ventasinventario/ventasinventario.component';
import { RegistrarusuarioComponent } from './componentesdesplegables/registrarusuario/registrarusuario.component';
import { UsuariosactivosComponent } from './componentesdesplegables/usuariosactivos/usuariosactivos.component';
import { ConsultarCitasComponent } from './usuariosmiran/citas/consultar-citas/consultar-citas/consultar-citas.component';
import { ConsultarUsuarioComponent } from './admin/usuarios/consultar-usuario/consultar-usuario/consultar-usuario.component';

// Importar la guardia de autenticación
import { AuthGuard } from './services/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: MainContentComponent }, // Página principal
  { path: 'login', component: LoginComponent }, // Página de login (sin guardia)
  { path: 'registro', component: RegistroComponent }, // Página de registro (sin guardia)

  // Rutas para los usuarios con rol "Cliente" (rol 3)
  { path: 'mascotas', component: MascotasComponent, canActivate: [AuthGuard], data: { roles: ['3', '2', '1'] } }, // Página de mascotas
  { path: 'consultar-mascota/:id', component: ConsultarMascotaComponent, canActivate: [AuthGuard], data: { roles: ['3', '2', '1'] } }, // Ruta para consultar detalles de la mascota
  { path: 'registrar-mascota', component: RegistrarmascotaComponent, canActivate: [AuthGuard], data: { roles: ['3', '2', '1'] } }, // Ruta para registrar mascota
  { path: 'citas', component: CitasComponent, canActivate: [AuthGuard], data: { roles: ['3', '2', '1'] } }, // Página de citas
  { path: 'consultar-cita/:id', component: ConsultarCitasComponent, canActivate: [AuthGuard], data: { roles: ['3', '2', '1'] } }, // Ruta para consultar citas

  // Rutas para los usuarios con otros roles (como Admin y Worker)
  { path: 'ventas', component: VentasComponent, canActivate: [AuthGuard], data: { roles: ['1', '2'] } },
  { path: 'usuarios', component: UsuariosComponent, canActivate: [AuthGuard], data: { roles: ['1', '2'] } },
  { path: 'consultar-usuario/:id', component: ConsultarUsuarioComponent, canActivate: [AuthGuard], data: { roles: ['1', '2'] } },

  // Nuevas rutas para los componentes desplegables
  { path: 'consultar-venta', component: ConsultarventaComponent, canActivate: [AuthGuard], data: { roles: ['1', '2'] } },
  { path: 'ventas-inventario', component: VentasinventarioComponent, canActivate: [AuthGuard], data: { roles: ['1', '2'] } },
  { path: 'registrar-usuario', component: RegistrarusuarioComponent, canActivate: [AuthGuard], data: { roles: ['1', '2'] } },
  { path: 'usuarios-activos', component: UsuariosactivosComponent, canActivate: [AuthGuard], data: { roles: ['1', '2'] } },

  // Ruta wildcard para manejar rutas no existentes
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
