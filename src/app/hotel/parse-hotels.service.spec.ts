import { TestBed } from '@angular/core/testing';

import { ParseHotelsService } from './parse-hotels.service';

describe('ParseHotelsService', () => {
  let service: ParseHotelsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParseHotelsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
