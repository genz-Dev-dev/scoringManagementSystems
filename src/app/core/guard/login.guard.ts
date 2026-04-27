import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router } from '@angular/router';
import { TokenStoragesService } from '../services/token-storage/token-storages.service';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  role?: string;
  exp?: number;
}

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate, CanActivateChild {

  constructor(
    private router: Router,
    private tokenStorage: TokenStoragesService
  ) { }

  private isTokenValid(token: string): boolean {
    try {
      const decoded: JwtPayload = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (!decoded.exp || decoded.exp < currentTime) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }

  canActivate(): boolean {
    const token = this.tokenStorage.getToken();

    if (!token || !this.isTokenValid(token)) {
      this.tokenStorage.removeToken();
      this.router.navigate(['/signin']);
      return false;
    }

    return true;
  }

  canActivateChild(): boolean {
    return this.canActivate();
  }
}
