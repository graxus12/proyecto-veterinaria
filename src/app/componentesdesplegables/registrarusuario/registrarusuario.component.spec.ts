import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarusuarioComponent } from './registrarusuario.component';

describe('RegistrarusuarioComponent', () => {
  let component: RegistrarusuarioComponent;
  let fixture: ComponentFixture<RegistrarusuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarusuarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarusuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
