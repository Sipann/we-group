import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-order-input',
  templateUrl: './order-input.component.html',
  styleUrls: ['./order-input.component.scss'],
})
export class OrderInputComponent implements OnInit {

  @ViewChild('f', { static: true }) form: NgForm;
  productAmount: number = 0;

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() { }

  onCancel() {
    this.form.reset();
    this.modalCtrl.dismiss(null, 'cancel');
  }

  onAddAmount() {
    console.log('adding amount of ', this.form.value['product-amount']);
    this.modalCtrl.dismiss({
      amount: this.form.value['product-amount']
    }, 'confirm');
  }

}
