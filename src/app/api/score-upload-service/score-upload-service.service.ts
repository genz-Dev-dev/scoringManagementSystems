import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environments } from 'src/environments/environments.dev';
import { AuthServiceService } from '../auth/auth.service.service';
import { Observable } from 'rxjs';
const api_extension = '/scores';
@Injectable( {
  providedIn: 'root',
} )
export class ScoreUploadServiceService
{
  private API = environments.api_url + api_extension;
  constructor( private authService: AuthServiceService, private httpClient: HttpClient ) { }

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

  public createScore ( scoreDto: any ): Observable<any>
  {
    return this.httpClient.post( this.API, scoreDto, this.getHttpOption( true ) );
  }

}
