import { Injectable } from '@angular/core';
import { environments } from 'src/environments/environments.dev';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenServiceService } from '../token/token.service.service';


const api_extension = '/permissions';

const api_extension1 = '/roles';

@Injectable( {
  providedIn: 'root',
} )
export class RolePermissionService
{
  private API = environments.api_url + api_extension;

  private API1 = environments.api_url + api_extension1;

  constructor( private httpClient: HttpClient, private authService: TokenServiceService ) { }

  private getHttpOption ()
  {
    const token = this.authService.getToken();

    return {
      headers: new HttpHeaders( {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ token }`
      } )
    };
  }
  // path set permissions
  public createPermission ( data: any ): Observable<any>
  {
    return this.httpClient.post<any>( this.API, data, this.getHttpOption() );
  }

  public getAllPermission (): Observable<any>
  {
    return this.httpClient.get<any>( this.API, this.getHttpOption() );
  }
  // path set roles and controll
  public getAllRoles (): Observable<any>
  {
    return this.httpClient.get<any>( this.API1, this.getHttpOption() );
  }
}
