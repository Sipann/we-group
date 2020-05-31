import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  isLoading = false;
  isLogin = true;

  constructor(
    private alertCtrl: AlertController,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
  ) { }

  ngOnInit() { }

  async onAuthenticate(data: { email: string, name: string, password: string }) {
    const { email, name, password } = data;
    this.isLoading = true;
    this.loadingCtrl
      .create({
        keyboardClose: true,
        message: 'Hold on...'
      })
      .then(loadingEl => {
        loadingEl.present();
        if (this.isLogin) {
          this.authService.login(email, password)
            .then(data => {
              if (!data) throw new Error('login failed');
              this.isLoading = false;
              loadingEl.dismiss();
            })
            .catch(error => {
              loadingEl.dismiss();
              const message = 'Could not authenticate you, please try again';
              this.showAlert(message);
            });
        }
        else {
          this.authService.signup(email, name, password)
            .then(data => {
              if (!data) throw new Error('signup failed');
              this.isLoading = false;
              loadingEl.dismiss();
            })
            .catch(error => {
              loadingEl.dismiss();
              const message = 'Could not sign you up, please try again';
              this.showAlert(message);
            });
        }
      });
  }

  onSwitchToLogin(mode: boolean) { this.isLogin = mode; }

  showAlert(message: string) {
    this.alertCtrl
      .create({
        header: 'Authentication failed',
        message: message,
        buttons: ['OK']
      })
      .then(alertEl => alertEl.present());
  }

}
