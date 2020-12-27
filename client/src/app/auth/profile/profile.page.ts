import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  AlertController,
  IonItemSliding,
  LoadingController,
  ToastController,
} from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { SegmentChangeEventDetail } from '@ionic/core';

import { AuthService } from 'src/app/services/auth.service';

import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import * as fromUserActions from 'src/app/store/actions/user.actions';
import { selectProfileData } from 'src/app/store/reducers/index';

import { setUpLoader, setUpToast } from 'src/app/groups/groups-utils';

import { Group } from 'src/app/models/group.model';
import { UserType } from 'src/app/models/refactor/user.model';
import { GroupType } from 'src/app/models/refactor/group.model';


enum ProfileScreen {
  USER_DATA = 'userdata',
  USER_GROUPS = 'usergroups',
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {

  @ViewChild('f', { static: false }) form: NgForm;
  public user$: UserType;
  public groups$: GroupType[];

  public get ProfileScreen() {
    return ProfileScreen;
  }

  // public display: string = 'userdata';
  private display: string = ProfileScreen.USER_DATA;
  private loadingCtrl: HTMLIonLoadingElement;
  private loadingCtrlUpdate: HTMLIonLoadingElement;

  private profileDataSub: Subscription;
  private userUpdateCompleteSub: Subscription;

  constructor(
    private alertCtrl: AlertController,
    private authService: AuthService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private store: Store<AppState>,
  ) {
    // TODO
    // this.userUpdateCompleteSub = this.store.select('user')
    //   .pipe(map(u => u.updateIsComplete))
    //   .subscribe(v => {
    //     if (v) {
    //       if (this.loadingCtrlUpdate) this.loadingCtrlUpdate.dismiss();
    //       setUpToast(this.toastController, 'Your profile has been updated!');
    //       this.store.dispatch(new fromUserActions.ResetUpdateStatus());
    //     }
    //   })
  }

  ngOnInit() { this.initialize(); }

  ngOnDestroy() {
    if (this.profileDataSub) this.profileDataSub.unsubscribe();
    if (this.userUpdateCompleteSub) this.userUpdateCompleteSub.unsubscribe();
  }

  async initialize() {
    this.loadingCtrl = await setUpLoader(this.loadingController);
    this.loadingCtrl.present();

    this.profileDataSub = this.store.select(selectProfileData)
      .subscribe((v) => {
        // console.log('profileDataSub v =>', v)
        const { currentUser, groups } = v;
        this.user$ = currentUser;
        this.groups$ = groups;
        if (this.loadingCtrl) this.loadingCtrl.dismiss();
      });
  }

  async onSubmitChanges() {
    if (this.form.value['user-preferred-mode'] === 'phone' && !this.form.value['user-phone']) {
      const header = 'Inconsistent Information';
      const message = 'You must include a phone number when you select \'phone\' as a contact mode';
      this.showAlert(header, message);
    }
    if (this.form.valid) {
      const updatedUser = {
        ...this.user$,
        username: this.form.value['user-name'],
        useremail: this.form.value['user-email'],
        userphone: this.form.value['user-phone'],
        userpreferredcontactmode: this.form.value['user-preferred-mode']
      };

      this.loadingCtrlUpdate = await setUpLoader(this.loadingController);
      this.loadingCtrlUpdate.present();

      this.store.dispatch(new fromUserActions.UpdateUserProfile(updatedUser))
    }
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

  onLeaveGroup(group: GroupType, slidingEl: IonItemSliding) {
    // if (group.manager_id === this.user.id) {
    // if (group.manager_id === this.user$.userid) {
    if (group.groupmanagerid === this.user$.userid) {
      const header = 'Oops';
      const message = 'You are the manager of the group. To delete it, please go to the "Manage Group" panel.';
      this.showAlert(header, message);
    }
    else {
      //TODO
      console.log('leaving group with id', group.groupid);
    }
    slidingEl.close();
  }

  unRegister() {
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
