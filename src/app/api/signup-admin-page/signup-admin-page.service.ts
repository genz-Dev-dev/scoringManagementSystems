import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthServiceService } from '../auth/auth.service.service';
import { environments } from 'src/environments/environments.dev';
const urlExtension = '/auth/signup';
const url_extension = '/roles';
@Injectable({
  providedIn: 'root',
})
export class SignupAdminPageService {

  private API = environments.api_url + urlExtension;
  private API1 = environments.api_url + url_extension;
  constructor(
    private httpClient: HttpClient,
    private authService: AuthServiceService,
    private router: Router
  ) { }
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

  public signupAdminPage(data: any): Observable<{ token: string, data: any }> {
    return this.httpClient.post<{ token: string, data: any }>(
      this.API,
      data,
      this.getHttpOption()
    );
  }

  public getAllUsers() {
    return this.httpClient.get<any>(
      environments.api_url + '/users',
      this.getHttpOption(true)
    );
  }

  public getAllRole(): Observable<any> {
    return this.httpClient.get<any>(
      this.API1,
      this.getHttpOption(true)
    );
  }

  public createRole(data: any): Observable<any> {
    return this.httpClient.post<any>(
      this.API1,
      data,
      this.getHttpOption(true)
    );
  }

  public updateStatus(id: string, status: boolean): Observable<any> {
    return this.httpClient.put<any>(
      `${environments.api_url}/users/update-status/${id}?status=${status}`,
      null,
      this.getHttpOption(true)
    );
  }
}
