import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environments } from 'src/environments/environments.dev';
import { TokenServiceService } from '../token/token.service.service';


const url_extension = 'roles';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private API = environments.api_url + url_extension;
  constructor(private httpClient: HttpClient, private authService: TokenServiceService) { }

  private getHttpOption() {
    return {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  }

  public createClassSemester(data: any): Observable<any> {
    return this.httpClient.post<any>(
      `${this.API}`,
      data,
      this.getHttpOption()
    );
  }
}
