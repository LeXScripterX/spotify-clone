import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import {
  Album,
  Artist,
  ArtistIndex,
  Song,
  StructuredLyrics,
  SubsonicResponse,
} from '../models/subsonic.models';

@Injectable({
  providedIn: 'root',
})
export class NavidromeService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly baseUrl = environment.navidromeApi;

  private buildUrl(endpoint: string, params?: Record<string, string>): string {
    const allParams: Record<string, string> = {
      ...this.authService.getAuthParams(),
      ...(params ?? {}),
    };

    const query = new URLSearchParams(allParams).toString();
    return `${this.baseUrl}/${endpoint}.view?${query}`;
  }

  private request<T>(endpoint: string, params?: Record<string, string>): Observable<SubsonicResponse<T>> {
    return this.http.get<SubsonicResponse<T>>(this.buildUrl(endpoint, params));
  }

  getAlbums(size = 20, offset = 0, type = 'newest'): Observable<Album[]> {
    return this.request('getAlbumList2', {
      type,
      size: size.toString(),
      offset: offset.toString(),
    }).pipe(
      map(response => (response['subsonic-response'] as any).albumList2?.album ?? [])
    );
  }

  getAlbum(id: string): Observable<Album> {
    return this.request('getAlbum', { id }).pipe(
      map(response => (response['subsonic-response'] as any).album)
    );
  }

  getRandomSongs(size = 20): Observable<Song[]> {
    return this.request('getRandomSongs', {
      size: size.toString(),
    }).pipe(
      map(response => (response['subsonic-response'] as any).randomSongs?.song ?? [])
    );
  }

  search(query: string): Observable<{ artists: Artist[]; albums: Album[]; songs: Song[] }> {
    return this.request('search3', { query }).pipe(
      map(response => {
        const r = (response['subsonic-response'] as any).searchResult3;
        return {
          artists: r?.artist ?? [],
          albums: r?.album ?? [],
          songs: r?.song ?? [],
        };
      })
    );
  }

  getArtists(): Observable<ArtistIndex[]> {
    return this.request('getArtists').pipe(
      map(response => (response['subsonic-response'] as any).artists?.index ?? [])
    );
  }

  getStreamUrl(id: string): string {
    return this.buildUrl('stream', { id });
  }

  getCoverArtUrl(id: string, size = 300): string {
    return this.buildUrl('getCoverArt', { id, size: size.toString() });
  }

  getLyrics(songId: string): Observable<StructuredLyrics | null> {
    return this.request('getLyricsBySongId', { id: songId }).pipe(
      map(
        response =>
          (response['subsonic-response'] as any).lyricsList?.structuredLyrics?.[0] ?? null
      )
    );
  }
}
