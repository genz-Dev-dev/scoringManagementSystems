import { Injectable } from '@angular/core';
import { environments } from 'src/environments/environments.dev';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthServiceService } from '../auth/auth.service.service';
const url_extension = '/auth/signin';
@Injectable( {
  providedIn: 'root',
} )
export class SigninAdminPageService
{
  private API = environments.api_url + url_extension;
  constructor( private httpClient: HttpClient, private authService: AuthServiceService ) { }

  private getHttpOption ()
  {
    return {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  }

  public signinAdminPage ( data: any ): Observable<any>
  {
    const payload = {
      email: data.email,
      password: data.password
    }
    return this.httpClient.post<any>(
      `${ this.API }`,
      payload,
      this.getHttpOption()
    );
  }
  /**
   * Send OTP to user email
   * @param email user email
   */
  public sendOtp ( email: string ): Observable<any>
  {
    return this.httpClient.post(
      `${ environments.api_url }/users/send-otp`,
      { email },
      {
        headers: {
          Authorization: `Bearer ${ this.authService.getToken() }`
        }
      }
    );
  }
  /**
   * Verify OTP
   * @param email user email
   * @param otp code sent to email
   */
  public verifyOtp ( email: string, otp: string ): Observable<any>
  {
    return this.httpClient.post( `${ environments.api_url }/users/verify-otp`, { email, otp }, {
      headers: {
        Authorization: `Bearer ${ this.authService.getToken() }`
      }
    } );
  }

  /**
   * Change password after OTP verification
   * @param email user email
   * @param otp code sent to email
   * @param newPassword new password
   */
  public changePassword ( token: string, newPassword: string ): Observable<any>
  {
    return this.httpClient.post(
      `${ environments.api_url }/users/reset-password`,
      {
        token,
        password: newPassword
      },
      {
        headers: {
          Authorization: `Bearer ${ this.authService.getToken() }`
        }
      }
    );
  }
}
