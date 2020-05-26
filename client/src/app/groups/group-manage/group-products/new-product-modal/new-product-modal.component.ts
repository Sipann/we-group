import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController, NavController, LoadingController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ApiClientService } from 'src/app/services/api-client.service';
import { Group } from 'src/app/models/group.model';
import { map } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../../store/reducers';
import * as fromGroupsActions from '../../../../store/actions/groups.actions';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-new-product-modal',
  templateUrl: './new-product-modal.component.html',
  styleUrls: ['./new-product-modal.component.scss'],
})
export class NewProductModalComponent implements OnInit {

  @Input() group: Group;
  @ViewChild('f', { static: true }) form: NgForm;

  private loadingCtrl: HTMLIonLoadingElement;

  productAmount: number;
  productCurrency: string;
  productDescription: string;
  productName: string;
  productPrice: number;

  addItemSub: Subscription;

  private routeSub: Subscription;

  constructor(
    private apiClientService: ApiClientService,
    private loadingController: LoadingController,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private store: Store<AppState>,
  ) {
    this.addItemSub = this.store.select('groups')
      .pipe(map(s => s.itemAdded))
      .subscribe(v => {
        if (v) {
          this.form.reset();
          this.modalCtrl.dismiss();
        }
      });
  }

  ngOnInit() {
    this.productCurrency = this.group.currency;
  }


  onAddProduct() {
    const item = {
      name: this.form.value['product-name'],
      description: this.form.value['product-description'],
      price: this.form.value['product-price'],
      currency: this.form.value['product-currency'],
      initial_qty: this.form.value['product-amount']
    };

    this.store.dispatch(new fromGroupsActions.AddItem({ item, groupid: +this.group.id }))
  }

  onCancel() {
    this.modalCtrl.dismiss();
  }

  onResetNewProductForm() {
    this.form.reset();
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
}
