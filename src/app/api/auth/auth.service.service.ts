import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TokenStoragesService } from '../tokens/token-storages.service';
import { jwtDecode } from 'jwt-decode';
import { HttpClient } from '@angular/common/http';
import { User } from '../../models/Users';

interface JwtPayload {
  exp?: number;
  role?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  private _authToken = new BehaviorSubject<string | null>(null);
  private _userRole = new BehaviorSubject<string | null>(null);

  // NEW: store current user info
  private _currentUser = new BehaviorSubject<User | null>(null);
  public currentUser$ = this._currentUser.asObservable();

  constructor(
    private tokenStorage: TokenStoragesService,
    private http: HttpClient
  ) {
    const token = this.tokenStorage.getToken();

    if (token && this.isTokenValid(token)) {
      this._authToken.next(token);
      this._userRole.next(this.extractRole(token));
      // Optionally load user info from localStorage if you saved it before
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        this._currentUser.next(JSON.parse(savedUser));
      }
    } else {
      this.clearToken();
    }
  }

  // --- Token management ---
  public getToken(): string | null {
    return this._authToken.value;
  }

  public setToken(token: string, user?: User): void {
    if (this.isTokenValid(token)) {
      this.tokenStorage.storeToken(token);
      this._authToken.next(token);
      this._userRole.next(this.extractRole(token));

      if (user) {
        this._currentUser.next(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
      }
    } else {
      this.clearToken();
    }
  }

  public clearToken(): void {
    this.tokenStorage.removeToken();
    this._authToken.next(null);
    this._userRole.next(null);
    this._currentUser.next(null);
    localStorage.removeItem('currentUser');
  }

  // --- Role management ---
  public getUserRole(): string | null {
    return this._userRole.value;
  }

  public getUserRole$() {
    return this._userRole.asObservable();
  }

  // --- Current user management ---
  public getCurrentUser(): User | null {
    return this._currentUser.value;
    // this._currentUser.next(this._currentUser.value);
    // localStorage.setItem('currentUser', JSON.stringify(this._currentUser.value));
    // return this._currentUser.value;
  }

  // --- Token helpers ---
  private extractRole(token: string): string | null {
    try {
      const decoded: JwtPayload = jwtDecode(token);
      return decoded.role || null;
    } catch (error) {
      console.warn('Failed to decode token for role:', error);
      return null;
    }
  }

  private isTokenValid(token: string): boolean {
    try {
      if (!token) return false;
      const decoded: JwtPayload = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return !!decoded.exp && decoded.exp > currentTime;
    } catch (error) {
      console.warn('Invalid token detected:', error);
      return false;
    }
  }
}