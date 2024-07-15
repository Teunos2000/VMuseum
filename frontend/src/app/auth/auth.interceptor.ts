import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()  // Marks this class as injectable so it can be used as a service in Angular
export class AuthInterceptor implements HttpInterceptor {

  // Method to intercept outgoing HTTP requests
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // Retrieve the token from local storage
    const token = localStorage.getItem('token');

    // If a token is found, clone the request and add the Authorization header
    if (token) {
      const cloned = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${token}`)
      });

      // Pass the cloned request to the next handler in the chain
      return next.handle(cloned);
    }

    // If no token is found, pass the original request to the next handler in the chain
    return next.handle(request);
  }
}
