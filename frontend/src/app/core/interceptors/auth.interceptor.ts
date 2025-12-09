import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // Do NOT attach token for auth endpoints
    const noAuthNeeded = ['/api/auth/login', '/api/auth/register'];

    if (noAuthNeeded.some(url => req.url.includes(url))) {
      return next.handle(req); // send request as-is
    }

    // For all other routes, attach token if available
    const token = this.auth.getToken();

    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(req);
  }
}
