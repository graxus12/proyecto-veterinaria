import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { AuthService } from '../../services/services/auth.service';
import { of } from 'rxjs';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    // Crear un espía (mock) de AuthService
    const spy = jasmine.createSpyObj('AuthService', ['userData$', 'logout']);

    // Simular la respuesta del observable userData$
    spy.userData$ = of({ username: 'testUser', role: 'Admin' });

    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      providers: [
        { provide: AuthService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set username and role on init', () => {
    // Verificar si el nombre de usuario y el rol se asignan correctamente
    expect(component.username).toBe('testUser');
    expect(component.role).toBe('Admin');
  });

  it('should call logout method when logout is triggered', () => {
    // Llamar al método logout
    component.logout();
    expect(authService.logout).toHaveBeenCalled();
  });

  it('should toggle dropdown visibility on hover', () => {
    // Inicialmente, el dropdown debería estar oculto
    expect(component['showDropdown']).toBe(false);

    // Simula el paso del mouse sobre el elemento
    component.toggleDropdown(true)
    expect(component['showDropdown']).toBe(true);

    // Simula el quitar el mouse
    component.toggleDropdown(false);
    expect(component['showDropdown']).toBe(false);
  });
});
