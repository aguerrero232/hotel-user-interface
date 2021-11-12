import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationCompleteFormComponent } from './reservation-complete-form.component';

describe('ReservationCompleteFormComponent', () => {
  let component: ReservationCompleteFormComponent;
  let fixture: ComponentFixture<ReservationCompleteFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReservationCompleteFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservationCompleteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
