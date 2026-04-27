import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenStoragesService {
  constructor() { }
  private _tokenStorageName: string = 'login-token';

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  public storeToken(token: string): void {
    if (this.isBrowser()) {
      localStorage.setItem(this._tokenStorageName, token);
    }
  }

  public getToken(): string | null {
    if (this.isBrowser()) {
      return localStorage.getItem(this._tokenStorageName);
    }
    return null;
  }

  public removeToken(): void {
    if (this.isBrowser()) {
      localStorage.removeItem(this._tokenStorageName);
    }
  }

  saveUserRole(role: string): void {
    if (this.isBrowser()) {
      localStorage.setItem('user-role', role);
    }
  }

  getUserRole(): string | null {
    if (this.isBrowser()) {
      return localStorage.getItem('user-role');
    }
    return null;
  }
}
