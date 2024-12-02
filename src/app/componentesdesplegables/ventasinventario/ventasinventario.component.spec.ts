import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasinventarioComponent } from './ventasinventario.component';

describe('VentasinventarioComponent', () => {
  let component: VentasinventarioComponent;
  let fixture: ComponentFixture<VentasinventarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VentasinventarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VentasinventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
