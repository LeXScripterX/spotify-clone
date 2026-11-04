import { Injectable, inject, signal } from '@angular/core';
import { NavidromeService } from './navidrome.service';
import { StructuredLyrics } from '../models/subsonic.models';

@Injectable({
  providedIn: 'root',
})
export class LyricsService {
  private readonly navidromeService = inject(NavidromeService);

  lyrics = signal<StructuredLyrics | null>(null);
  activeLineIndex = signal<number>(-1);
  isLoading = signal<boolean>(false);

  loadLyrics(songId: string): void {
    this.isLoading.set(true);
    this.activeLineIndex.set(-1);

    this.navidromeService.getLyrics(songId).subscribe({
      next: (result) => {
        this.lyrics.set(result);
        this.isLoading.set(false);
      },
      error: () => {
        this.lyrics.set(null);
        this.isLoading.set(false);
      },
    });
  }

  updateTime(currentTimeMs: number): void {
    const currentLyrics = this.lyrics();
    if (!currentLyrics || !currentLyrics.synced || !currentLyrics.line?.length) {
      return;
    }

    let foundIndex = -1;
    for (let i = 0; i < currentLyrics.line.length; i++) {
      const line = currentLyrics.line[i];
      if (line.start !== undefined && line.start <= currentTimeMs) {
        foundIndex = i;
      }
    }

    this.activeLineIndex.set(foundIndex);
  }

  clear(): void {
    this.lyrics.set(null);
    this.activeLineIndex.set(-1);
  }
}
