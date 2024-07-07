import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { RegisterComponent } from './register.component';
import { UserService } from '../../auth/user.service';
import { AuthService } from '../../auth/auth.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['checkUsernameAvailability', 'createUser']);
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [ RegisterComponent ],
      imports: [ FormsModule, RouterTestingModule ],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show error for empty fields', () => {
    component.onSubmit();
    expect(component.error).toBe('All fields are required.');
    expect(component.isLoading).toBeFalse();
  });

  it('should show error for invalid email', () => {
    component.username = 'testuser';
    component.email = 'invalidemail';
    component.password = 'Valid1Password';
    component.repeatPassword = 'Valid1Password';
    component.onSubmit();
    expect(component.error).toBe('Please enter a valid email address.');
    expect(component.isLoading).toBeFalse();
  });

  it('should show error for invalid password', () => {
    component.username = 'testuser';
    component.email = 'valid@email.com';
    component.password = 'weak';
    component.repeatPassword = 'weak';
    component.onSubmit();
    expect(component.error).toBe('Password must be at least 4 characters long.');
    expect(component.isLoading).toBeFalse();
  });

  it('should show error for mismatched passwords', () => {
    component.username = 'testuser';
    component.email = 'valid@email.com';
    component.password = 'Valid1Password';
    component.repeatPassword = 'DifferentPassword';
    component.onSubmit();
    expect(component.error).toBe('Passwords do not match.');
    expect(component.isLoading).toBeFalse();
  });

  it('should show error for taken username', fakeAsync(() => {
    component.username = 'takenuser';
    component.email = 'valid@email.com';
    component.password = 'Valid1Password';
    component.repeatPassword = 'Valid1Password';
    userServiceSpy.checkUsernameAvailability.and.returnValue(of({available: false}));

    component.onSubmit();
    tick();

    expect(component.error).toBe('This username is already taken. Please choose a different one.');
    expect(component.isLoading).toBeFalse();
  }));

  it('should create user and login on successful registration', fakeAsync(() => {
    component.username = 'newuser';
    component.email = 'valid@email.com';
    component.password = 'Valid1Password';
    component.repeatPassword = 'Valid1Password';
    userServiceSpy.checkUsernameAvailability.and.returnValue(of({available: true}));
    userServiceSpy.createUser.and.returnValue(of({id: 1, username: 'newuser'}));
    authServiceSpy.login.and.returnValue(of({access_token: 'fake-token'}));

    component.onSubmit();
    tick();

    expect(userServiceSpy.createUser).toHaveBeenCalled();
    expect(authServiceSpy.login).toHaveBeenCalled();
    expect(localStorage.getItem('token')).toBe('fake-token');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
    expect(component.isLoading).toBeFalse();
  }));

  it('should handle error during user creation', fakeAsync(() => {
    component.username = 'newuser';
    component.email = 'valid@email.com';
    component.password = 'Valid1Password';
    component.repeatPassword = 'Valid1Password';
    userServiceSpy.checkUsernameAvailability.and.returnValue(of({available: true}));
    userServiceSpy.createUser.and.returnValue(throwError(() => new Error('User creation failed')));

    component.onSubmit();
    tick();

    expect(component.error).toBe('Something went wrong creating your account');
    expect(component.isLoading).toBeFalse();
  }));

  it('should handle error during auto-login', fakeAsync(() => {
    component.username = 'newuser';
    component.email = 'valid@email.com';
    component.password = 'Valid1Password';
    component.repeatPassword = 'Valid1Password';
    userServiceSpy.checkUsernameAvailability.and.returnValue(of({available: true}));
    userServiceSpy.createUser.and.returnValue(of({id: 1, username: 'newuser'}));
    authServiceSpy.login.and.returnValue(throwError(() => new Error('Login failed')));

    component.onSubmit();
    tick();

    expect(component.error).toBe('Account created, but auto-login failed. Please log in manually.');
    expect(component.isLoading).toBeFalse();
  }));
});
