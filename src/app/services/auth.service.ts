import { Injectable, signal } from '@angular/core';
import CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  username = signal<string>('');
  password = signal<string>('');

  constructor() {
    const savedUsername = localStorage.getItem('nd_username');
    const savedPassword = localStorage.getItem('nd_password');

    if (savedUsername) {
      this.username.set(savedUsername);
    }
    if (savedPassword) {
      this.password.set(savedPassword);
    }
  }

  login(username: string, password: string): void {
    localStorage.setItem('nd_username', username);
    localStorage.setItem('nd_password', password);
    this.username.set(username);
    this.password.set(password);
  }

  logout(): void {
    localStorage.removeItem('nd_username');
    localStorage.removeItem('nd_password');
    this.username.set('');
    this.password.set('');
  }

  isLoggedIn(): boolean {
    return Boolean(this.username() && this.password());
  }

  getAuthParams(): Record<string, string> {
    const salt = CryptoJS.lib.WordArray.random(8).toString();
    const token = CryptoJS.MD5(this.password() + salt).toString();

    return {
      u: this.username(),
      t: token,
      s: salt,
      v: '1.16.1',
      c: 'SpotifyClone',
      f: 'json',
    };
  }
}
