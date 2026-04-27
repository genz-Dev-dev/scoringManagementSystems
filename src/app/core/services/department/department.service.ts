import { Injectable } from '@angular/core';
import { environments } from 'src/environments/environments.dev';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenServiceService } from '../token/token.service.service';
import { Auth } from '@angular/fire/auth';
import {Class} from '../../../models/class.model';
import {Pagination} from '../../../models/pagination.model';


const api_extension = '/classes';
const api_extension1 = '/departments';
const api_extension2 = '/subjects';
@Injectable( {
  providedIn: 'root',
} )
export class DepartmentService
{

  constructor( private httpClient: HttpClient, private authService: TokenServiceService )
  {

  }

  private API = environments.api_url + api_extension;

  private API1 = environments.api_url + api_extension1;

  private API2 = environments.api_url + api_extension2;

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

  public createDepartment ( data: any ): Observable<any>
  {
    return this.httpClient.post<any>(
      this.API1,
      data,
      this.getHttpOption( true )
    );
  }
  public createSubjects ( data: any ): Observable<any>
  {
    return this.httpClient.post<any>(
      this.API2,
      data,
      this.getHttpOption( true )
    )
  }
  // create class service
  public createClass ( data: any ): Observable<any>
  {
    return this.httpClient.post<any>(
      this.API,
      data,
      this.getHttpOption( true )
    );
  }
  public createSemester ( data: any ): Observable<any>
  {
    return this.httpClient.post<any>(
      environments.api_url + '/semesters',
      data,
      this.getHttpOption( true )
    );
  }
  public getAllDepartment ()
  {
    return this.httpClient.get<any>(
      this.API1,
      this.getHttpOption( true )
    );
  }

  // get AllClass
  public getAllClass (): Observable<Pagination<Class>>
  {
    return this.httpClient.get<Pagination<Class>>(
      this.API
      , this.getHttpOption( true ) );
  }

  public getAllSemster (): Observable<any> {
    return this.httpClient.get<any>(
      environments.api_url + '/semesters',
      this.getHttpOption( true ) );
  }

  // get all course
  public getAllCourse (): Observable<any> {
    return this.httpClient.get<any>(
      environments.api_url + '/courses'
      , this.getHttpOption( true ) );
  }

  // get all subject
  public getAllSubject (): Observable<any> {
    return this.httpClient.get<any>(
      this.API2
      , this.getHttpOption( true ) );
  }
}
