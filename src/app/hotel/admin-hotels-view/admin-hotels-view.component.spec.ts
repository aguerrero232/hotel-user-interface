import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminHotelsViewComponent } from './admin-hotels-view.component';

describe('AdminHotelsViewComponent', () => {
  let component: AdminHotelsViewComponent;
  let fixture: ComponentFixture<AdminHotelsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminHotelsViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminHotelsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
