import { Injectable, computed, inject, signal } from '@angular/core';
import { NavidromeService } from './navidrome.service';
import { Song } from '../models/subsonic.models';

@Injectable({
  providedIn: 'root',
})
export class PlayerService {
  private readonly navidromeService = inject(NavidromeService);
  private readonly audio = new Audio();
  volume = signal<number>(1); // 0 a 1
private lastVolume = 1;
  

  currentSong = signal<Song | null>(null);
  isPlaying = signal<boolean>(false);
  currentTime = signal<number>(0);
  duration = signal<number>(0);
  progress = computed(() =>
    this.duration() > 0 ? this.currentTime() / this.duration() : 0
  );
  queue = signal<Song[]>([]);
  currentIndex = signal<number>(0);

  constructor() {
    this.audio.addEventListener('timeupdate', () => {
      this.currentTime.set(this.audio.currentTime);
    });

    this.audio.addEventListener('loadedmetadata', () => {
      this.duration.set(this.audio.duration || 0);
    });

    this.audio.addEventListener('ended', () => {
      this.next();
    });

    this.audio.addEventListener('play', () => {
      this.isPlaying.set(true);
    });

    this.audio.addEventListener('pause', () => {
      this.isPlaying.set(false);
    });
  }

  play(song: Song, queue?: Song[]): void {
    if (queue) {
      this.queue.set(queue);
      const index = queue.findIndex(s => s.id === song.id);
      this.currentIndex.set(index !== -1 ? index : 0);
    }

    this.currentSong.set(song);
    this.audio.src = this.navidromeService.getStreamUrl(song.id);
    this.audio.play().catch(err => {
      console.error('Error playing audio:', err);
    });
  }

  togglePlayPause(): void {
    if (this.isPlaying()) {
      this.audio.pause();
    } else {
      if (this.currentSong()) {
        this.audio.play().catch(err => {
          console.error('Error playing audio:', err);
        });
      }
    }
  }

  next(): void {
    const queue = this.queue();
    const currentIndex = this.currentIndex();
    if (currentIndex < queue.length - 1) {
      const nextIndex = currentIndex + 1;
      this.currentIndex.set(nextIndex);
      this.play(queue[nextIndex]);
    }
  }

  previous(): void {
    if (this.currentTime() > 3) {
      this.seekTo(0);
    } else {
      const currentIndex = this.currentIndex();
      if (currentIndex > 0) {
        const prevIndex = currentIndex - 1;
        this.currentIndex.set(prevIndex);
        this.play(this.queue()[prevIndex]);
      }
    }
  }

  seekTo(seconds: number): void {
    this.audio.currentTime = seconds;
  }

  seekToPercent(percent: number): void {
    this.audio.currentTime = percent * this.duration();
  }

  setVolume(value: number): void {
  const v = Math.min(1, Math.max(0, value));
  this.audio.volume = v;
  this.volume.set(v);
  if (v > 0) this.lastVolume = v;
}

toggleMute(): void {
  this.setVolume(this.volume() > 0 ? 0 : this.lastVolume || 1);
}
}
