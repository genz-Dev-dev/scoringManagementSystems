import { Injectable } from '@angular/core';
import { environments } from 'src/environments/environments.dev';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthServiceService } from '../auth/auth.service.service';
import { Auth } from '@angular/fire/auth';
import { ApiResponse, Department, ClassResponse } from 'src/app/models/Department.models';
import { PageResponse } from 'src/app/models/PageResponse.model';
const api_extension = '/classes';
const api_extension1 = '/departments';
const api_extension2 = '/subjects';
@Injectable( {
  providedIn: 'root',
} )
export class DepartmentClassServiceService
{

  constructor( private httpClient: HttpClient, private authService: AuthServiceService )
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
  public getAllDepartment (): Observable<ApiResponse<Department[]>>
  {
    return this.httpClient.get<ApiResponse<Department[]>>(
      this.API1,
      this.getHttpOption( true )
    );
  }
  public getAllClass (): Observable<ApiResponse<ClassResponse[]>>
  {
    return this.httpClient.get<ApiResponse<ClassResponse[]>>(
      this.API + '/allClass'
      , this.getHttpOption( true ) );
  }

  public getAllClassPagegination ( page: number, size: number ): Observable<PageResponse<ClassResponse[]>>
  {
    return this.httpClient.get<PageResponse<ClassResponse[]>>(
      `${ this.API }?page=${ page }&size=${ size }&sortBy=name&ascending=true`,
      this.getHttpOption( true )
    );
  }

  public getAllSemster (): Observable<any>
  {
    return this.httpClient.get<any>(
      environments.api_url + '/semesters',
      this.getHttpOption( true ) );
  }
  // get all course
  public getAllCourse (): Observable<any>
  {
    return this.httpClient.get<any>(
      environments.api_url + '/courses'
      , this.getHttpOption( true ) );
  }
  // get all subject
  public getAllSubject (): Observable<any>
  {
    return this.httpClient.get<any>(
      this.API2
      , this.getHttpOption( true ) );
  }
}
