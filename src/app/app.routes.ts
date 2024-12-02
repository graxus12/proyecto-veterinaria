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

export const routes: Routes = [
  { path: '', component: MainContentComponent },  // Página principal
  { path: 'mascotas', component: MascotasComponent },  // Página de mascotas
  { path: 'consultar-mascota/:id', component: ConsultarMascotaComponent },  // Ruta para consultar detalles de la mascota
  { path: 'citas', component: CitasComponent },  // Página de citas
  { path: 'login', component: LoginComponent },  // Página de login
  { path: 'registro', component: RegistroComponent },  // Página de registro
  { path: 'ventas', component: VentasComponent },
  { path: 'usuarios', component: UsuariosComponent },

  // Nuevas rutas para los componentes desplegables
  { path: 'registrar-mascota', component: RegistrarmascotaComponent },
  { path: 'consultar-venta', component: ConsultarventaComponent },
  { path: 'ventas-inventario', component: VentasinventarioComponent },
  { path: 'registrar-usuario', component: RegistrarusuarioComponent },
  { path: 'usuarios-activos', component: UsuariosactivosComponent },

  // Ruta wildcard para manejar rutas no existentes
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
