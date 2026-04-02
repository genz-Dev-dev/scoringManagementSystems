import { Injectable } from '@angular/core';
import { environments } from 'src/environments/environments.dev';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthServiceService } from '../auth/auth.service.service';
import { Auth } from '@angular/fire/auth';


const api_extension = '/classes';
const api_extension1 = '/departments';
@Injectable({
  providedIn: 'root',
})
export class DepartmentClassServiceService {

  constructor(private httpClient: HttpClient, private authService: AuthServiceService) {

  }

  private API = environments.api_url + api_extension;

  private API1 = environments.api_url + api_extension1;

  private getHttpOption(withToken: boolean = false) {

    let headers = new HttpHeaders();
    if (withToken) {
      const token = this.authService.getToken();
      if (token) headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return { headers: headers };
  }

  public createDepartment(data: any): Observable<any> {
    return this.httpClient.post<any>(
      this.API,
      data,
      this.getHttpOption()
    );
  }

  public getAllDepartment() {
    return this.httpClient.get<any>(
      this.API1,
      this.getHttpOption(true)
    );
  }
  // create class service
  public createClass(data: any): Observable<any> {
    return this.httpClient.post<any>(
      this.API,
      data,
      this.getHttpOption(true)
    );
  }

  // get AllClass 
  public getAllClass(): Observable<any> {
    return this.httpClient.get<any>(this.API, this.getHttpOption(true));
  }

  public createSemester(data: any): Observable<any> {
    return this.httpClient.post<any>(
      environments.api_url + '/semesters',
      data,
      this.getHttpOption(true)
    );
  }
  public getAllSemster(): Observable<any> {
    return this.httpClient.get<any>(environments.api_url + '/semesters', this.getHttpOption(true));
  }
}
