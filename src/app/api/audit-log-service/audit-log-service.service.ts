import { Injectable, provideEnvironmentInitializer } from '@angular/core';
import { Observable } from 'rxjs';
import { environments } from 'src/environments/environments.dev';
import { AuthServiceService } from '../auth/auth.service.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const api_extension = '/audit';
@Injectable( {
  providedIn: 'root',
} )
export class AuditLogServiceService
{

  private API = environments.api_url + api_extension;

  constructor( private authService: AuthServiceService, private httpClient: HttpClient )
  {

  }

  private getHeaders (): HttpHeaders
  {
    const token = this.authService.getToken();
    return new HttpHeaders( {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ token }`,
    } );
  }

  private getHttpOption ( withToken: boolean = false )
  {

    let headers = new HttpHeaders();
    if ( withToken )
    {
      const token = this.authService.getToken();
      if ( token ) headers = headers.set( 'Authorization', `Bearer ${ token }` );
    }
    return { headers: headers };
  }

  public getAllAuditLogs (): Observable<any>
  {
    return this.httpClient.get<any>( this.API, this.getHttpOption( true ) );
  }


}
