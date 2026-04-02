import { Injectable } from '@angular/core';
import { environments } from 'src/environments/environments.dev';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthServiceService } from '../auth/auth.service.service';
import { Auth } from '@angular/fire/auth';


const api_extension = '/classes';
@Injectable({
  providedIn: 'root',
})
export class DepartmentClassServiceService {

  constructor(private httpClient: HttpClient, private authService: AuthServiceService) {

  }

  private API = environments.api_url + api_extension;

  private getHttpOption() {
    return {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  }

  public createDepartment(data: any): Observable<any> {
    return this.httpClient.post<any>(
      this.API,
      data,
      this.getHttpOption()
    );
  }
}
