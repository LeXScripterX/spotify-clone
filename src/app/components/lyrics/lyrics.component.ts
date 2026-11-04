import type {
  ElementRef} from '@angular/core';
import {
  Component,
  effect,
  inject,
  viewChild,
} from '@angular/core';

import { LyricsService } from '../../services/lyrics.service';
import { PlayerService } from '../../services/player.service';
import { LyricLine } from '../../models/subsonic.models';

@Component({
  selector: 'app-lyrics',
  templateUrl: './lyrics.component.html',
  styleUrls: ['./lyrics.component.scss'],
})
export class LyricsComponent {
  readonly lyricsService = inject(LyricsService);
  private readonly playerService = inject(PlayerService);

  scrollContainer = viewChild<ElementRef<HTMLElement>>('lyricsScroll');

  constructor() {
    effect(() => {
      const index = this.lyricsService.activeLineIndex();
      const container = this.scrollContainer();
      if (index >= 0 && container?.nativeElement) {
        const el = container.nativeElement.querySelector(`[data-index="${index}"]`) as HTMLElement | null;
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
  }

  onLineTap(index: number, line: LyricLine): void {
    if (line.start !== undefined && this.lyricsService.lyrics()?.synced) {
      this.playerService.seekTo(line.start / 1000);
    }
  }
}
