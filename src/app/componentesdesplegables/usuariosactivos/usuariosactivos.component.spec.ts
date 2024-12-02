import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuariosactivosComponent } from './usuariosactivos.component';

describe('UsuariosactivosComponent', () => {
  let component: UsuariosactivosComponent;
  let fixture: ComponentFixture<UsuariosactivosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsuariosactivosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsuariosactivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
