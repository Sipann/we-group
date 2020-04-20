import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';

import { ApiClientService } from 'src/app/services/api-client.service';
import { Group } from 'src/app/models/group.model';


@Component({
  selector: 'app-new-product-modal',
  templateUrl: './new-product-modal.component.html',
  styleUrls: ['./new-product-modal.component.scss'],
})
export class NewProductModalComponent implements OnInit {

  @Input() group: Group;
  @ViewChild('f', { static: true }) form: NgForm;

  productAmount: number;
  productCurrency: string;
  productDescription: string;
  productName: string;
  productPrice: number;

  constructor(
    private apiClientService: ApiClientService,
    private modalCtrl: ModalController) { }

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

    this.apiClientService.addItemToGroup(item, this.group.id)
      .subscribe(() => {
        this.form.reset();
        this.modalCtrl.dismiss(item, 'confirm');
      });
  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  onResetNewProductForm() {
    this.form.reset();
  }
}
