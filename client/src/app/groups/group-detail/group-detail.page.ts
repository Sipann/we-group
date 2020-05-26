import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Group } from '../../models/group.model';

import { map } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../store/reducers/index';


@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.page.html',
  styleUrls: ['./group-detail.page.scss'],
})
export class GroupDetailPage implements OnInit, OnDestroy {

  private currentUserIsManager = false;
  private group: Group;
  public loadingPage = true;
  private loadingCtrl: HTMLIonLoadingElement;
  public orderIsAllowed = false;

  private authSub: Subscription;
  private groupSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private loadingController: LoadingController,
    private navCtrl: NavController,
    private router: Router,
    private store: Store<AppState>) { }

  ngOnInit() {
    this.initialize()
  }

  async initialize() {
    await this.presentLoading();

    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('groupid')) {
        this.loadingCtrl.dismiss();
        this.navCtrl.navigateBack('/groups');
        return;
      }

      this.groupSub = this.store.select('groups')
        .pipe(map(g => g.selectedGroup))
        .subscribe(selectedGroupData => {
          this.group = selectedGroupData;
          this.loadingPage = false;
          this.orderIsAllowed = this.group.deadline && new Date(this.group.deadline) >= new Date();
          this.authSub = this.store.select('user')
            .pipe(map(u => u.currentUser))
            .subscribe(currentUserData => {
              this.currentUserIsManager = currentUserData && currentUserData.id === selectedGroupData.manager_id;
            });

          this.loadingCtrl.dismiss();
        });
    });
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

  onNavigateToManageGroup() {
    if (this.currentUserIsManager) {
      this.router.navigate(['/', 'groups', 'manage', this.group.id], {
        state: { ...this.group }
      });
    }
  }

  onNavigateToPlaceOrder() {
    this.router.navigate(['/', 'orders', 'new', this.group.id], {
      state: { ...this.group }
    });
  }

  onNavigateToOrdersArchives() {
    // this.router.navigate(['/', 'orders', 'all', this.group.id], this.navigationExtras);
    this.router.navigate(['/', 'orders', 'all', this.group.id], {
      state: { ...this.group }
    });
  }

  ngOnDestroy() {
    if (this.authSub) this.authSub.unsubscribe();
    if (this.groupSub) this.groupSub.unsubscribe();
  }

}
