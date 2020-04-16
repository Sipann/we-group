import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgForm, FormBuilder, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';

import { Group } from 'src/app/models/group.model';
import { NewProductModalComponent } from './new-product-modal/new-product-modal.component';

@Component({
  selector: 'app-group-products',
  templateUrl: './group-products.component.html',
  styleUrls: ['./group-products.component.scss'],
})
export class GroupProductsComponent implements OnInit {

  @Input() group: Group;
  @Output() cancelled = new EventEmitter();
  @ViewChild('f', { static: true }) newProductform: NgForm;
  // @ViewChild('timeform', { static: true }) deadlineForm: NgForm;

  products: { name: string, description: string, price: number, currency: string, initial_qty: number }[] = [
    { name: 'baguette', description: 'baguette traditionnelle', price: 450, currency: 'rup', initial_qty: 50 },
    { name: 'banette', description: 'banette 250g', price: 500, currency: 'rup', initial_qty: 50 },
    { name: 'pain au chocolat', description: 'ou chocolatine', price: 700, currency: 'rup', initial_qty: 40 },

  ];
  productsForm: FormGroup;

  productName: string;
  productPrice: number;
  productAmount: number;


  constructor(private fb: FormBuilder, private modalCtrl: ModalController) { }

  ngOnInit() {
    const itemsGroup = {};
    this.products.forEach(product => {
      const groupName = product.name;
      itemsGroup[groupName] = this.fb.group({
        'selected': [false],
        'amount': [product.initial_qty],
        'name': [product.name],
        'price': [product.price],
        'currency': [product.currency]
      });
      console.log('itemsGroup', itemsGroup);

      itemsGroup['deadline'] = this.fb.group({
        'deadlineDate': []
      });
      this.productsForm = new FormGroup(itemsGroup);
      console.log('this.productsForm', this.productsForm);
    });

  }

  onCancel() { this.cancelled.emit(); }

  onSaveChanges() {
    console.log('save changes with values');
    this.cancelled.emit();
  }

  onSaveChangesAndInform() {
    console.log('save changes with values and inform other users');
    this.onSaveChanges();
    // + inform other users
  }

  onCreateNewProduct() {
    this.modalCtrl
      .create({
        component: NewProductModalComponent,
        componentProps: {},
      })
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then(result => {
        console.log('result', result);
        // add new product to list of products
      });
  }

}
