import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {} // inject auth service

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const noAuthNeeded = ['/api/auth/login', '/api/auth/register']; // endpoints without token

    if (noAuthNeeded.some(url => req.url.includes(url))) {
      return next.handle(req); // skip token attachment
    }

    const token = this.auth.getToken(); // get stored token

    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}` // attach token header
        }
      });
    }

    return next.handle(req); // forward request
  }
}
