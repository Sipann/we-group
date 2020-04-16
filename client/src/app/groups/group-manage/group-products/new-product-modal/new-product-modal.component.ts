import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-new-product-modal',
  templateUrl: './new-product-modal.component.html',
  styleUrls: ['./new-product-modal.component.scss'],
})
export class NewProductModalComponent implements OnInit {

  @ViewChild('f', { static: true }) form: NgForm;
  productName: string;
  productPrice: number;
  productAmount: number;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() { }

  onAddProduct() {
    console.log('add product', this.form.value['product-name'], this.form.value['product-price'], this.form.value['product-amount']);
    this.modalCtrl.dismiss({
      newProductData: {
        name: this.form.value['product-name'],
        price: this.form.value['product-price'],
        amount: this.form.value['product-amount']
      }
    }, 'confirm');
  }

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  onResetNewProductForm() {
    this.form.reset();
  }
}
