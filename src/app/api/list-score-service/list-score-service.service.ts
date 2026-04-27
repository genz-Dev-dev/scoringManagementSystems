import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environments } from 'src/environments/environments.dev';
import { AuthServiceService } from '../auth/auth.service.service';
import { StudentScoreResponse } from 'src/app/models/StudentScoreReport.model';
import { ApiResponse } from 'src/app/models/Department.models';
const api_extension = '/students'
@Injectable( {
  providedIn: 'root',
} )
export class ListScoreServiceService
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
  // get all score report
  public getAllScoreReport (): Observable<ApiResponse<StudentScoreResponse[]>>
  {
    return this.httpClient.get<ApiResponse<StudentScoreResponse[]>>(
      this.API + '/student-scores',
      this.getHttpOption( true ) );
  }
}
