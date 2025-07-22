import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { AuthStatus } from '@auth/enums/auth-status.enum';
import { SessionStorageKey } from '@auth/enums/session-storage-key.enum';
import { of } from 'rxjs';

const baseUrl = environment.AUTH_API_URL;

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  // Mock data
  const mockUser = {
    id: '1',
    name: 'Test User',
    mail: 'test@example.com',
    role: 'user',
  };

  const mockToken = 'mock-jwt-token';

  const mockAuthResponse = {
    data: {
      user: mockUser,
      token: mockToken,
    },
  };

  const mockRegisterUserDto = {
    name: 'New User',
    mail: 'newuser@example.com',
    password: 'password123',
    // Removemos address del DTO si no es necesario
    // address: undefined // O simplemente no lo incluimos
  };

  const mockRegisterResponse = {
    header: { resultCode: 0, message: 'User registered successfully' },
    data: {
      user: {
        name: mockRegisterUserDto.name,
        mail: mockRegisterUserDto.mail,
        password: mockRegisterUserDto.password,
        role: 'user',
      },
      token: 'abcd123',
    },
  };

  beforeEach(() => {
    // Limpiar sessionStorage antes de cada test
    sessionStorage.clear();

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Initial state', () => {
    it('should initialize with checking status when no token in sessionStorage', () => {
      expect(service.$authStatus()).toBe(AuthStatus.Checking);
      expect(service.user()).toBeNull();
      expect(service.token()).toBeNull();
    });

    it('should initialize with token from sessionStorage if exists', () => {
      // Arrange - reinicializar con token en sessionStorage
      sessionStorage.setItem(SessionStorageKey.Token, mockToken);

      // Recrear el servicio para que tome el token del sessionStorage
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [AuthService],
      });
      service = TestBed.inject(AuthService);
      httpMock = TestBed.inject(HttpTestingController);

      expect(service.token()).toBe(mockToken);
    });
  });

  describe('login', () => {
    it('should login successfully and return true', () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'password123';

      // Act
      service.login(email, password).subscribe((result) => {
        expect(result).toBe(true);
        expect(service.user()).toEqual(mockUser);
        expect(service.token()).toBe(mockToken);
        expect(service.$authStatus()).toBe(AuthStatus.Authenticated);
        expect(sessionStorage.getItem(SessionStorageKey.User)).toBe(
          JSON.stringify(mockUser)
        );
        expect(sessionStorage.getItem(SessionStorageKey.Token)).toBe(mockToken);
      });

      // Assert
      const req = httpMock.expectOne(`${baseUrl}/user/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        mail: email,
        password: password,
      });
      req.flush(mockAuthResponse);
    });

    it('should handle login error and return false', () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'wrongpassword';
      const errorResponse = { error: { message: 'Invalid credentials' } };

      // Act
      service.login(email, password).subscribe((result) => {
        expect(result).toBe(false);
        expect(service.user()).toBeNull();
        expect(service.token()).toBeNull();
        expect(service.$authStatus()).toBe(AuthStatus.NotAuthenticated);
      });

      // Assert
      const req = httpMock.expectOne(`${baseUrl}/user/login`);
      req.flush(errorResponse, { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('register', () => {
    it('should register user successfully', () => {
      // Act
      service.register(mockRegisterUserDto).subscribe((response) => {
        expect(response).toEqual(mockRegisterResponse);
      });

      // Assert
      const req = httpMock.expectOne(`${baseUrl}/user/register`);
      expect(req.request.method).toBe('POST');
      // Verificamos que el request body tenga las propiedades esperadas
      expect(req.request.body).toEqual({
        name: mockRegisterUserDto.name,
        mail: mockRegisterUserDto.mail,
        password: mockRegisterUserDto.password,
        address: undefined, // El servicio envía address aunque no esté en el DTO
      });
      req.flush(mockRegisterResponse);
    });

    it('should handle register error with custom message', () => {
      // Arrange
      const errorResponse = {
        header: {
          error: 'Email already exists',
        },
      };

      // Act & Assert
      service.register(mockRegisterUserDto).subscribe({
        next: () => fail('Expected an error, but got a success response'),
        error: (error) => {
          expect(error).toBeTruthy();
          expect(error).toEqual(jasmine.any(Error));
          expect(error.message).toBe('Email already exists');
        },
      });

      const req = httpMock.expectOne(`${baseUrl}/user/register`);
      req.flush(errorResponse, { status: 400, statusText: 'Bad Request' });
    });

    it('should handle register error with default message', () => {
      // Arrange
      const errorResponse = { error: { message: 'Server error' } };

      // Act & Assert
      service.register(mockRegisterUserDto).subscribe({
        error: (error) => {
          expect(error.message).toBe(
            'Something went wrong while signing up. Please try again.'
          );
        },
      });

      const req = httpMock.expectOne(`${baseUrl}/user/register`);
      req.flush(errorResponse, { status: 500, statusText: 'Server Error' });
    });
  });

  describe('checkStatus', () => {
    it('should return true when token and user exist in sessionStorage', () => {
      // Arrange
      sessionStorage.setItem(SessionStorageKey.Token, mockToken);
      sessionStorage.setItem(SessionStorageKey.User, JSON.stringify(mockUser));

      // Act
      service.checkStatus().subscribe((result) => {
        expect(result).toBe(true);
        expect(service.user()).toEqual(mockUser);
        expect(service.token()).toBe(mockToken);
        expect(service.$authStatus()).toBe(AuthStatus.Authenticated);
      });
    });

    it('should return false and logout when no token in sessionStorage', () => {
      // Arrange
      sessionStorage.removeItem(SessionStorageKey.Token);
      sessionStorage.removeItem(SessionStorageKey.User);

      // Act
      service.checkStatus().subscribe((result) => {
        expect(result).toBe(false);
        expect(service.user()).toBeNull();
        expect(service.token()).toBeNull();
        expect(service.$authStatus()).toBe(AuthStatus.NotAuthenticated);
      });
    });

    it('should return false and logout when no user in sessionStorage', () => {
      // Arrange
      sessionStorage.setItem(SessionStorageKey.Token, mockToken);
      sessionStorage.removeItem(SessionStorageKey.User);

      // Act
      service.checkStatus().subscribe((result) => {
        expect(result).toBe(false);
        expect(service.user()).toBeNull();
        expect(service.token()).toBeNull();
        expect(service.$authStatus()).toBe(AuthStatus.NotAuthenticated);
      });
    });
  });

  describe('logout', () => {
    it('should clear user data and sessionStorage', () => {
      // Arrange - simular usuario logueado
      sessionStorage.setItem(SessionStorageKey.User, JSON.stringify(mockUser));
      sessionStorage.setItem(SessionStorageKey.Token, mockToken);
      service['_user'].set(mockUser);
      service['_token'].set(mockToken);

      // Act
      service.logout();

      // Assert
      expect(service.user()).toBeNull();
      expect(service.token()).toBeNull();
      expect(service.$authStatus()).toBe(AuthStatus.NotAuthenticated);
      expect(sessionStorage.getItem(SessionStorageKey.User)).toBeNull();
      expect(sessionStorage.getItem(SessionStorageKey.Token)).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('should update user and sessionStorage', () => {
      // Arrange
      const updatedUser = {
        ...mockUser,
        name: 'Updated User Name',
      };

      // Act
      service.updateUser(updatedUser);

      // Assert
      expect(service.user()).toEqual(updatedUser);
      expect(sessionStorage.getItem(SessionStorageKey.User)).toBe(
        JSON.stringify(updatedUser)
      );
    });
  });

  describe('computed properties', () => {
    it('should return Checking status initially', () => {
      expect(service.$authStatus()).toBe(AuthStatus.Checking);
    });

    it('should return Authenticated status when user exists', () => {
      // Arrange
      service['_user'].set(mockUser);
      service['_authStatus'].set(AuthStatus.Authenticated);

      // Assert
      expect(service.$authStatus()).toBe(AuthStatus.Authenticated);
    });

    it('should return NotAuthenticated status when no user and not checking', () => {
      // Arrange
      service['_user'].set(null);
      service['_authStatus'].set(AuthStatus.NotAuthenticated);

      // Assert
      expect(service.$authStatus()).toBe(AuthStatus.NotAuthenticated);
    });
  });

  describe('handleAuthSuccess (private method)', () => {
    it('should set user data correctly through login', () => {
      // Este test verifica el método privado a través del método público login
      const email = 'test@example.com';
      const password = 'password123';

      service.login(email, password).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/user/login`);
      req.flush(mockAuthResponse);

      expect(service.user()).toEqual(mockUser);
      expect(service.token()).toBe(mockToken);
      expect(service.$authStatus()).toBe(AuthStatus.Authenticated);
      expect(sessionStorage.getItem(SessionStorageKey.User)).toBe(
        JSON.stringify(mockUser)
      );
      expect(sessionStorage.getItem(SessionStorageKey.Token)).toBe(mockToken);
    });
  });

  describe('handleAuthError (private method)', () => {
    it('should call logout and log error through login error', () => {
      // Arrange
      spyOn(console, 'log');
      const email = 'test@example.com';
      const password = 'wrongpassword';
      const errorResponse = { error: { message: 'Invalid credentials' } };

      // Act
      service.login(email, password).subscribe();

      const req = httpMock.expectOne(`${baseUrl}/user/login`);
      req.flush(errorResponse, { status: 401, statusText: 'Unauthorized' });

      // Assert
      expect(console.log).toHaveBeenCalled();
      expect(service.user()).toBeNull();
      expect(service.$authStatus()).toBe(AuthStatus.NotAuthenticated);
    });
  });

  describe('checkStatusResource', () => {
    it('should be defined and use checkStatus method', () => {
      expect(service.checkStatusResource).toBeDefined();
      // Note: rxResource testing might require additional setup depending on Angular version
      // You may need to test the resource's loader function specifically
    });
  });
});
