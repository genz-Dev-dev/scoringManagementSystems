import { Injectable } from '@angular/core';
import { environments } from '../../../../environments/environments.dev';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
const url_extension = '/req';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  API = environments.api_url + url_extension;
  constructor(private httpClient: HttpClient) {}

  private getHttpOptions() {
    const token = environments.token;
    return {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
  }

  public getCurrentUserRole(): Observable<any> {
    return this.httpClient.get<any>(this.API + '/me', this.getHttpOptions());
  }
}
