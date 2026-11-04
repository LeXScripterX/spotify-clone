import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonPopover,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  home,
  search,
  library,
  downloadOutline,
  notificationsOutline,
  chevronBack,
  chevronForward,
} from 'ionicons/icons';

import { MiniPlayerComponent } from '../components/mini-player/mini-player.component';
import { UserMenuComponent } from '../components/user-menu/user-menu.component';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: true,
  imports: [
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonLabel,
    IonPopover,
    RouterLink,
    RouterLinkActive,
    MiniPlayerComponent,
    UserMenuComponent,
  ],
})
export class TabsPage {
  readonly isCollapsed = signal(false);

  constructor() {
    addIcons({
      home,
      search,
      library,
      downloadOutline,
      notificationsOutline,
      chevronBack,
      chevronForward,
    });
  }

  toggleSidebar(): void {
    this.isCollapsed.update((val) => !val);
  }
}