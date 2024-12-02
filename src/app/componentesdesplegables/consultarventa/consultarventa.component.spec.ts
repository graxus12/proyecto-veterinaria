import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarventaComponent } from './consultarventa.component';

describe('ConsultarventaComponent', () => {
  let component: ConsultarventaComponent;
  let fixture: ComponentFixture<ConsultarventaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultarventaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultarventaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
