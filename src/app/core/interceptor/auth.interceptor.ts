import { Injectable } from '@angular/core';
import
{
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TokenServiceService } from '../services/token/token.service.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor
{
  constructor(
    private authService: TokenServiceService,
    private router: Router,
  ) { }

  intercept (
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>>
  {
    const token = this.authService.getToken();
    if ( token ) {
      req = req.clone( {
        setHeaders: {
          Authorization: `Bearer ${ token }`,
        },
      } );
    }
    return next.handle(req).pipe(
      catchError( ( error: HttpErrorResponse ) =>
      {
        if ( error.status === 401 )
        {
          this.authService.clearToken();
          this.router.navigate( [ '/signin' ] );
        }
        return throwError( () => error );
      } ),
    );
  }
}
