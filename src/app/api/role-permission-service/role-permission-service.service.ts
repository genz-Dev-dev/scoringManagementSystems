import { Injectable } from '@angular/core';
import { environments } from 'src/environments/environments.dev';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthServiceService } from '../auth/auth.service.service';
const api_extension = '/permissions';
@Injectable({
  providedIn: 'root',
})
export class RolePermissionServiceService {
  private API = environments.api_url + api_extension;
  constructor(private httpClient: HttpClient, private authService: AuthServiceService) { }

  private getHttpOption() {
    const token = this.authService.getToken();

    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
  }

  public createPermission(data: any): Observable<any> {
    return this.httpClient.post<any>(this.API, data, this.getHttpOption());
  }

  public getAllPermission(): Observable<any> {
    return this.httpClient.get<any>(this.API, this.getHttpOption());
  }
}
