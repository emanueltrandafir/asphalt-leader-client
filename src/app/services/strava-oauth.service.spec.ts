import { TestBed } from '@angular/core/testing';

import { StravaOauthService } from './strava-oauth.service';

describe('StravaOauthService', () => {
  let service: StravaOauthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StravaOauthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
