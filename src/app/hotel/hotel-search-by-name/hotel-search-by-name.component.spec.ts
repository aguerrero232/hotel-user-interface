import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelSearchByNameComponent } from './hotel-search-by-name.component';

describe('HotelSearchByNameComponent', () => {
  let component: HotelSearchByNameComponent;
  let fixture: ComponentFixture<HotelSearchByNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HotelSearchByNameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelSearchByNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
