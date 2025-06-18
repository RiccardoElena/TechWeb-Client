import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { ToastrService } from 'ngx-toastr';
import { RestBackendService } from '../_services/rest-backend/rest-backend.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of, throwError } from 'rxjs';
import { AuthService } from '../_services/auth/local-auth.service';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;
  let restBackendSpy: jasmine.SpyObj<RestBackendService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  authServiceSpy = jasmine.createSpyObj('AuthService', ["updateToken"]);
  authServiceSpy.updateToken.and.returnValue();

  beforeEach(async () => {
    toastrSpy = jasmine.createSpyObj('ToastrSpy', ['success', 'error']);
    await TestBed.configureTestingModule({
      imports: [LoginComponent, RouterTestingModule],
      providers: [{
        provide: RestBackendService, useValue: restBackendSpy
      }, {
        provide: ToastrService, useValue: toastrSpy
      }, {
        provide: AuthService, useValue: authServiceSpy
      }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should login correctly when credentials are correct', () => {
    restBackendSpy = jasmine.createSpyObj('RestBackendService', ['login']);
    restBackendSpy.login.and.returnValue(of("token")); //configure the spy to return an Observable of a string token
    component.restService = restBackendSpy; //use the spy in place of the service

    component.loginForm.setValue({
      user: "test", pass: "test"
    });

    component.handleLogin();

    expect(restBackendSpy.login).toHaveBeenCalledOnceWith({ usr: "test", pwd: "test" });
    expect(component.toastr.success).toHaveBeenCalledTimes(1);
    expect(component.authService.updateToken).toHaveBeenCalledOnceWith("token");
  });

  it('should not login correctly when credentials are invalid', () => {
    restBackendSpy = jasmine.createSpyObj('RestBackendService', ['login']);
    restBackendSpy.login.and.returnValue(throwError(() => new Error())); //configure the spy to throw error
    component.restService = restBackendSpy; //use the spy in place of the service

    component.loginForm.setValue({
      user: "test", pass: "test"
    });

    component.handleLogin();

    expect(restBackendSpy.login).toHaveBeenCalledOnceWith({ usr: "test", pwd: "test" });
    expect(component.toastr.success).toHaveBeenCalledTimes(0);
    expect(component.toastr.error).toHaveBeenCalledTimes(1);
  });


  it('should show empty fields error correctly', () => {
    restBackendSpy = jasmine.createSpyObj('RestBackendService', ['login']);
    restBackendSpy.login.and.returnValue(throwError(() => new Error())); //configure the spy to throw error
    component.restService = restBackendSpy; //use the spy in place of the service

    component.loginForm.setValue({
      user: "", pass: ""
    });

    component.handleLogin();

    fixture.detectChanges(); //trigger change detection

    const element: DebugElement = fixture.debugElement; //get root elem of component
    //check that the appropriate error message was added after user field
    const userNameErrorMessage = element.query(By.css('#user~p.form-error'));
    const userNameErrorMessageContent = userNameErrorMessage.nativeElement.textContent;
    expect(userNameErrorMessageContent).toContain('Username is required.');
    //check that the appropriate error message was added after password field
    const passwordErrorMessage = element.query(By.css('#pass~p.form-error'));
    const passwordErrorMessageContent = passwordErrorMessage.nativeElement.textContent;
    expect(passwordErrorMessageContent).toContain('Password is required.');

    //It should have never called restBackend, and it should have called toastr.error
    expect(restBackendSpy.login).toHaveBeenCalledTimes(0);
    expect(component.toastr.success).toHaveBeenCalledTimes(0);
    expect(component.toastr.error).toHaveBeenCalledTimes(1);

  });

});
