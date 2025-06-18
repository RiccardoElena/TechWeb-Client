import { TestBed } from '@angular/core/testing';

import { AuthService } from './local-auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    //TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not be authenticated on startup', () => {
    expect(service.isUserAuthenticated()).toBe(false);
    expect(service.getUser()).toBe(null);
    expect(service.user()).toBe(null);
    expect(service.getToken()).toBe(null);
    expect(service.token()).toBe(null);
  });

  it('should detect malformed tokens', () => {
    let malformed = "malformed";
    expect(service.verifyToken(malformed)).toBe(false);
  });

  it('should detect invalid tokens', () => {
    let invalid = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5";
    expect(service.verifyToken(invalid)).toBe(false);
  });

  it('should detect expired tokens', () => {
    //token below expired on 2000/01/01 at 00.00.00
    let expired = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZXhwIjo5NDY2ODEyMDAsImlhdCI6MTUxNjIzOTAyMn0.KJ0uivpwBeNLDdGuaLZLb3n7DgzaNdjvXPn9n7c9-p0";
    expect(service.verifyToken(expired)).toBe(false);
  });

  it('should detect valid tokens', () => {
    //token below expires on 3000/01/01 at 00.00.00
    let valid = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZXhwIjozMjUwMzY3NjQwMCwiaWF0IjoxNTE2MjM5MDIyfQ.0UFmgkpnSz2EzljUU6fXVd32DRsb6QdTTZXx8v0AsVs";
    expect(service.verifyToken(valid)).toBe(true);
  });

  it('should properly update state when a valid token is provided', () => {
    //token below expires on 3000/01/01 at 00.00.00 and contains claim "user=John"
    let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNlciI6IkpvaG4iLCJleHAiOjMyNTAzNjc2NDAwLCJpYXQiOjE1MTYyMzkwMjJ9.j17gfZAV0g_wPUj1x7MEwZTg_OwpnUbKsy3NsLGiVU0";
    service.updateToken(token);
    expect(service.user()).toEqual("John");
    expect(service.token()).toEqual(token);
    expect(service.isAuthenticated()).toBe(true);
  });

  it('should reset state on logout', () => {
    //token below expires on 3000/01/01 at 00.00.00 and contains claim "user=John"
    let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwidXNlciI6IkpvaG4iLCJleHAiOjMyNTAzNjc2NDAwLCJpYXQiOjE1MTYyMzkwMjJ9.j17gfZAV0g_wPUj1x7MEwZTg_OwpnUbKsy3NsLGiVU0";
    service.updateToken(token);
    service.logout();
    expect(service.isUserAuthenticated()).toBe(false);
    expect(service.getUser()).toBe(null);
    expect(service.user()).toBe(null);
    expect(service.getToken()).toBe(null);
    expect(service.token()).toBe(null);
  });

});
