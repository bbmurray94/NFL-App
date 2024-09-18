import { TestBed } from '@angular/core/testing';

import { TeamEventService } from './team-event.service';

describe('TeamEventService', () => {
  let service: TeamEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeamEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
