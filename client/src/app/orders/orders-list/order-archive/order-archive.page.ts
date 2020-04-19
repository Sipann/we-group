import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order-archive',
  templateUrl: './order-archive.page.html',
  styleUrls: ['./order-archive.page.scss'],
})
export class OrderArchivePage implements OnInit, OnDestroy {

  order: {
    groupname: string,
    orderid: number,
    deadline: string,
    items: { name: string, quantity: number }[]
  };
  orderId: number;

  private orderSub: Subscription;

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('orderid')) {
        this.navCtrl.navigateBack('/groups');
        return;
      }
      this.orderId = parseInt(paramMap.get('orderid'));

      if (this.router.getCurrentNavigation().extras.state) {
        this.order = this.router.getCurrentNavigation().extras.state.order;
      }
    })
  }

  ngOnDestroy() {
    if (this.orderSub) this.orderSub.unsubscribe();
  }

}
