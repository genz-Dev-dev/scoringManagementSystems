import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environments } from 'src/environments/environments.dev';
import { AuthServiceService } from '../auth/auth.service.service';
import { HttpParams } from '@angular/common/http';
const url_extension = '/students';
const url_extension1 = '/classes';
@Injectable({
  providedIn: 'root',
})
export class StudentsServiceService {
  private API = environments.api_url + url_extension;
  private API1 = environments.api_url + url_extension1;
  constructor(private httpClient: HttpClient, private authService: AuthServiceService) { }

  private getHttpOption(withToken: boolean = false) {
    let headers = new HttpHeaders();

    if (withToken) {
      const token = this.authService.getToken();
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
    }

    return {
      headers: headers
    };
  }

  public getAllStudents() {
    return this.httpClient.get<any>(`${this.API}`, this.getHttpOption(true));
  }
  // get all for show to select classes
  public getAllClass(status: boolean) {
    const params = new HttpParams().set('status', status);

    return this.httpClient.get<any>(this.API1, {
      ...this.getHttpOption(true),
      params: params
    });
  }
  // create student
  public createStudent(data: any) {
    return this.httpClient.post<any>(`${this.API}`, data, this.getHttpOption(true));
  }
}
