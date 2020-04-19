import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController, LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { ApiClientService } from 'src/app/services/api-client.service';
import { Group } from '../../models/group.model';

@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.page.html',
  styleUrls: ['./group-detail.page.scss'],
})
export class GroupDetailPage implements OnInit, OnDestroy {

  // currentUserIsManager = false;
  currentUserIsManager = true;
  group: Group;
  loading = true;
  navigationExtras;
  orderIsAllowed = false;

  private groupSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private apiClientService: ApiClientService,
    private loadingController: LoadingController,
    private navCtrl: NavController,
    private router: Router) { }

  ngOnInit() {
    this.initialize()
  }

  async initialize() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('groupid')) {
        this.navCtrl.navigateBack('/groups');
        this.loadingController.dismiss();
        return;
      }
      this.groupSub = this.apiClientService.getGroup(parseInt(paramMap.get('groupid')))
        .subscribe(data => {
          this.group = data;
          this.navigationExtras = {
            state: { ...this.group }
          };
          this.loading = false;
          this.orderIsAllowed = this.group.deadline && new Date(this.group.deadline) >= new Date();
          this.loadingController.dismiss();
        });
    });
  }

  ionViewWillEnter() {
    this.loadingController.dismiss();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      spinner: 'crescent',
      translucent: true,
      cssClass: 'loading-spinner',
      backdropDismiss: false,
    });
    return loading.present();
  }

  onNavigateToManageGroup() {
    this.router.navigate(['/', 'groups', 'manage', this.group.id], this.navigationExtras);
  }

  onNavigateToPlaceOrder() {
    this.router.navigate(['/', 'orders', 'new', this.group.id], this.navigationExtras);
  }

  onNavigateToOrdersArchives() {
    this.router.navigate(['/', 'orders', 'all', this.group.id], this.navigationExtras);
  }

  ngOnDestroy() {
    if (this.groupSub) this.groupSub.unsubscribe();
  }

}
