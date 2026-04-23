import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environments } from 'src/environments/environments.dev';
import { AuthServiceService } from '../auth/auth.service.service';
const api_extension = '/courses'
@Injectable( {
  providedIn: 'root',
} )
export class CourseServiceService
{

  private API = environments.api_url + api_extension;
  constructor( private httpClient: HttpClient, private authService: AuthServiceService ) { }



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

  public createCourse ( payload: any ): Observable<any>
  {
    return this.httpClient.post<any>(
      this.API,
      payload,
      this.getHttpOption( true )
    );
  }

}
