import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarmascotaComponent } from './registrarmascota.component';

describe('RegistrarmascotaComponent', () => {
  let component: RegistrarmascotaComponent;
  let fixture: ComponentFixture<RegistrarmascotaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarmascotaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarmascotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
