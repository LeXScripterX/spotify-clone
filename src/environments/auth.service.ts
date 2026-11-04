import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private clientName = 'SpotifyClone';
  private version = '1.16.1';

  getAuthParams(): string {
    const salt = Math.random().toString(36).substring(2, 12);
    const token = CryptoJS.MD5(environment.pass + salt).toString();
    return `u=${environment.user}&t=${token}&s=${salt}&v=${this.version}&c=${this.clientName}&f=json`;
  }
}