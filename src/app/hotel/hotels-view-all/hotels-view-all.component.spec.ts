import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelsViewAllComponent } from './hotels-view-all.component';

describe('HotelsViewAllComponent', () => {
  let component: HotelsViewAllComponent;
  let fixture: ComponentFixture<HotelsViewAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HotelsViewAllComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelsViewAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
