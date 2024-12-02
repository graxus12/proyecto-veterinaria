import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { of } from 'rxjs';
import { ConsultarMascotaComponent } from './consultar-mascota.component';

describe('ConsultarMascotaComponent', () => {
  let component: ConsultarMascotaComponent;
  let fixture: ComponentFixture<ConsultarMascotaComponent>;
  let httpMock: HttpTestingController;
  let activatedRoute: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterModule],
      declarations: [ConsultarMascotaComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '1' } } }  // Simulamos el id '1' en la URL
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultarMascotaComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    activatedRoute = TestBed.inject(ActivatedRoute);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch mascota details on init', () => {
    // Simulamos una respuesta HTTP exitosa
    const mockMascota = {
      nombre: 'Rex',
      fecha_nacimiento: '2020-01-01',
      edad: 4,
      raza: 'Labrador',
      especie: 'Perro',
      sexo: 'Macho',
      peso: 30,
      estado: 'Saludable',
      foto: 'http://example.com/rex.jpg'
    };

    component.ngOnInit();

    const req = httpMock.expectOne('http://localhost/api/consultar_mascota.php?id=1');
    expect(req.request.method).toBe('GET');
    req.flush(mockMascota);

    fixture.detectChanges();  // Disparamos los cambios en el componente

    // Verificamos que los detalles de la mascota se hayan asignado correctamente
    expect(component.mascota.nombre).toBe('Rex');
    expect(component.mascota.raza).toBe('Labrador');
    expect(component.mascota.edad).toBe(4);
  });

  it('should handle errors when fetching mascota details', () => {
    component.ngOnInit();

    const req = httpMock.expectOne('http://localhost/api/consultar_mascota.php?id=1');
    req.flush('Error', { status: 500, statusText: 'Server Error' });

    fixture.detectChanges();  // Disparamos los cambios en el componente

    expect(component.error).toBe('Error al obtener los datos de la mascota');
  });

  afterEach(() => {
    httpMock.verify();  // Verificamos que no haya solicitudes pendientes
  });
});
