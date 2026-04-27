import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiResponse} from '../../../models/api-response.model';
import {environments} from '../../../../environments/environments.dev';

@Injectable({
  providedIn: 'root'
})
export class ClassService {

  ENDPOINT: string = "/students/import-student"

  constructor(private http: HttpClient) { }

  importStudentFromExcel(payload: FormData) : Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(environments.api_url+this.ENDPOINT , payload);

  }

}
