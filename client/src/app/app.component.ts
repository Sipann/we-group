import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { MenuMainLink } from './models/menu-main-link.model';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  private menuLinks: MenuMainLink[] = [
    { title: 'My Groups', icon: 'people-outline', rLink: '/groups' },
    { title: 'My Orders', icon: 'people-outline', rLink: '/orders' },
    { title: 'Search', icon: 'search-outline', rLink: '/groups/search' },
    { title: 'Profile', icon: 'person-outline', rLink: '/auth/profile' },
  ];

  constructor(
    private authService: AuthService,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  logout() {
    console.log('logout');
    this.authService.logout();
  }
}
