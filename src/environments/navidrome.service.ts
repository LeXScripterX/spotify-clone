import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class NavidromeService {
  private baseUrl = environment.navidromeApi;

  constructor(private http: HttpClient, private auth: AuthService) {}

  getAlbums(): Observable<any> {
    const authParams = this.auth.getAuthParams();
    return this.http.get(`${this.baseUrl}/getAlbumList2?type=recent&${authParams}`);
  }

  getLyrics(songId: string): Observable<any> {
    const authParams = this.auth.getAuthParams();
    return this.http.get(`${this.baseUrl}/getLyricsBySongId.view?id=${songId}&${authParams}`);
  }

  getStreamUrl(songId: string): string {
    const authParams = this.auth.getAuthParams();
    return `${this.baseUrl}/stream?id=${songId}&${authParams}`;
  }
}