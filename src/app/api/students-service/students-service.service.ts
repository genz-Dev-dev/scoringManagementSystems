import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environments } from 'src/environments/environments.dev';
import { AuthServiceService } from '../auth/auth.service.service';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { GetAllStudentResponse } from 'src/app/models/Students.models';
const url_extension = '/students';
const url_extension1 = '/classes';

@Injectable( {
  providedIn: 'root',
} )
export class StudentsServiceService
{
  private API = environments.api_url + url_extension;
  private API1 = environments.api_url + url_extension1;

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

  /**
   * Generic fetch function with cache
   * @param url API endpoint
   * @param cacheKey localStorage key
   * @param params optional query params
   * @param cacheTimeMs cache time in ms (default 1 year)
   */
  private fetchWithCache<T> (
    url: string,
    cacheKey: string,
    params?: HttpParams,
    cacheTimeMs: number = 365 * 24 * 60 * 60 * 1000
  ): Observable<T>
  {
    const now = Date.now();
    const cached = localStorage.getItem( cacheKey );
    const expiry = localStorage.getItem( cacheKey + '_expiry' );

    if ( cached && expiry && now < +expiry )
    {
      return of( JSON.parse( cached ) as T );
    }

    return this.httpClient.get<T>( url, {
      ...this.getHttpOption( true ),
      params: params
    } ).pipe(
      tap( res =>
      {
        localStorage.setItem( cacheKey, JSON.stringify( res ) );
        localStorage.setItem( cacheKey + '_expiry', ( now + cacheTimeMs ).toString() );
      } ),
      catchError( err =>
      {
        console.error( `Error fetching ${ cacheKey }:`, err );
        // fallback to cached data if available
        return cached ? of( JSON.parse( cached ) as T ) : of( {} as T );
      } )
    );
  }

  // Create student (no cache needed)
  public createStudent ( data: any )
  {
    return this.httpClient.post<any>( this.API, data, this.getHttpOption( true ) );
  }

  // Fetch all students (cached)
  public getAllStudents ( page: number = 0, size: number = 10 )
  {
    return this.httpClient.get<any>(
      `${ this.API }?page=${ page }&size=${ size }`,
      this.getHttpOption( true )
    );
  }
  // Fetch all classes (cached)
  public getAllClass ( status: boolean, forceRefresh: boolean = false ): Observable<any>
  {
    const params = new HttpParams().set( 'status', status );
    if ( forceRefresh )
    {
      localStorage.removeItem( `classesCache_${ status }` );
      localStorage.removeItem( `classesCache_${ status }_expiry` );
    }
    return this.fetchWithCache<any>( this.API1, `classesCache_${ status }`, params );
  }
  // public getAllClass(status: boolean): Observable<any> {
  //   const params = new HttpParams().set('status', status);
  //   return this.fetchWithCache<any>(this.API1, `classesCache_${status}`, params);
  // }

  public filterStudentByClassId ( id: String ): Observable<GetAllStudentResponse[]>
  {
    return this.httpClient.post<GetAllStudentResponse[]>( this.API + '/filter', id, this.getHttpOption( true ) )
  }

}
