import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { AlertController, LoadingController, ToastController, IonItemSliding } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { SegmentChangeEventDetail } from '@ionic/core';

import { Subscription } from 'rxjs';

import { ApiClientService } from 'src/app/services/api-client.service';
import { AuthService } from 'src/app/services/auth.service';

import { Group } from 'src/app/models/group.model';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {

  @ViewChild('f', { static: false }) form: NgForm;

  display: string = 'userdata';
  user: User;
  groups: Group[];
  loadingCtrl;
  loadingGroups = true;
  loadingInfos = true;
  toastCtrl;
  updateComplete = true;

  userEmail: string;
  userGroups: Group[];
  userName: string;
  userPhone: string;
  userPreferredMode: string;

  private authSub: Subscription;
  private groupSub: Subscription;
  private userSub: Subscription;


  constructor(
    private alertCtrl: AlertController,
    private apiClientService: ApiClientService,
    private authService: AuthService,
    private loadingController: LoadingController,
    private toastController: ToastController,
  ) { }

  ngOnInit() {
    this.userSub = this.apiClientService.getUser()
      .subscribe(data => {
        console.log('profile data userGroup', data);
        this.user = data;
        this.userName = this.user.name;
        this.userEmail = this.user.email;
        this.userPhone = this.user.phone;
        this.userPreferredMode = this.user.preferred_contact_mode;
        this.loadingInfos = false;
      });
    this.groupSub = this.apiClientService.getGroups()
      .subscribe(data => {
        console.log('profile data groupSub', data);
        this.userGroups = data;
        this.loadingGroups = false;
      });
  }

  ngOnDestroy() {
    if (this.authSub) this.authSub.unsubscribe();
    if (this.groupSub) this.groupSub.unsubscribe();
    if (this.userSub) this.userSub.unsubscribe();
  }

  async onSubmitChanges() {
    const updatedUser = {
      name: this.form.value['user-name'],
      email: this.form.value['user-email'],
      phone: this.form.value['user-phone'],
      preferred_contact_mode: this.form.value['user-preferred-mode']
    };
    if (this.form.value['user-preferred-mode'] === 'phone' && !this.form.value['user-phone']) {
      const header = 'Inconsistent Information';
      const message = 'You must include a phone number when you select \'phone\' as a contact mode';
      this.showAlert(header, message);
    }
    if (this.form.valid) {
      await this.presentLoading();
      this.apiClientService.updateUser(updatedUser)
        .subscribe(data => {
          console.log('data', data);
          this.user = data;
          this.loadingCtrl.dismiss();
          this.presentToast();
        })
    }
  }

  async presentLoading() {
    this.loadingCtrl = await this.loadingController.create({
      spinner: 'bubbles',
      translucent: true,
      cssClass: 'loading-spinner',
      backdropDismiss: false,
    });
    return this.loadingCtrl.present();
  }

  async presentToast() {
    this.toastCtrl = await this.toastController.create({
      message: 'Your settings have been saved.',
      color: 'primary',
      duration: 2000
    });
    this.toastCtrl.present();
  }

  profileDisplayChanged(e: CustomEvent<SegmentChangeEventDetail>) {
    this.display = e.detail.value;
  }

  showAlert(header: string, message: string) {
    this.alertCtrl
      .create({
        header: header,
        message: message,
        buttons: ['OK']
      })
      .then(alertEl => alertEl.present());
  }

  onLeaveGroup(group: Group, slidingEl: IonItemSliding) {
    console.log('manager_id', group.manager_id);
    console.log('current user id', this.user.id);
    if (group.manager_id === this.user.id) {
      const header = 'Oops';
      const message = 'You are the manager of the group. To delete it, please go to the "Manage Group" panel.';
      this.showAlert(header, message);
    }
    else {
      console.log('leaving group with id', group.id);
    }
    slidingEl.close();
  }

  unRegister() {
    console.log('unregister');
    this.alertCtrl.create({
      header: 'Farewell',
      message: `By clicking the \'I\'m leaving\' button, you will delete your account. If you wish to proceed, just press it.
      Also note that if you are in charge of a group, it won't be accessible anymore. You might consider transferring the responsibility to someone else before going.
      We are sorry to see you go but wish you all the best! If it is a mistake, just press the \'cancel\' one.`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'I\'m leaving!',
          role: 'confirm',
          handler: () => this.authService.unregister()
        }
      ]
    }).then(alertEl => alertEl.present());

  }

}
