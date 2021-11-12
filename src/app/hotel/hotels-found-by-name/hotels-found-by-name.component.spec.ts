import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelsFoundByNameComponent } from './hotels-found-by-name.component';

describe('HotelsFoundByNameComponent', () => {
  let component: HotelsFoundByNameComponent;
  let fixture: ComponentFixture<HotelsFoundByNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HotelsFoundByNameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelsFoundByNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
