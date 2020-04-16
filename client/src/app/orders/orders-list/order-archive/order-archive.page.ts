import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-order-archive',
  templateUrl: './order-archive.page.html',
  styleUrls: ['./order-archive.page.scss'],
})
export class OrderArchivePage implements OnInit, OnDestroy {

  order: {
    id: number,
    items: { name: string, quantity: number, 'price/u': number }[],
    date: string,
    total: number
  } = {
      id: 2,
      items: [{ name: 'baguette', quantity: 3, 'price/u': 400 }, { name: 'croissant', quantity: 5, 'price/u': 410 }],
      date: '2020-1-22',
      total: 1200
    };
  private orderSub: Subscription;

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('orderid')) {
        this.navCtrl.navigateBack('/groups');
        return;
      }
      // this.orderSub = ...
      // this.order = order
    })
  }

  ngOnDestroy() {
    if (this.orderSub) this.orderSub.unsubscribe();
  }

}
