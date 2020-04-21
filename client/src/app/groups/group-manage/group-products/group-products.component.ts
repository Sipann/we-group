import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgForm, FormBuilder, FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';

import { ApiClientService } from 'src/app/services/api-client.service';
import { Group } from 'src/app/models/group.model';
import { Item } from '../../../models/item.model';
import { NewProductModalComponent } from './new-product-modal/new-product-modal.component';

@Component({
  selector: 'app-group-products',
  templateUrl: './group-products.component.html',
  styleUrls: ['./group-products.component.scss'],
})
export class GroupProductsComponent implements OnInit {

  @Input() items: Item[];
  @Input() group: Group;

  @Output() cancelled = new EventEmitter();
  @Output() done = new EventEmitter<Group>();
  @Output() updated = new EventEmitter();

  @ViewChild('f', { static: true }) newProductform: NgForm;

  itemAmount: number;
  itemsForm: FormGroup;
  itemName: string;
  itemPrice: number;

  constructor(
    private apiClientService: ApiClientService,
    private fb: FormBuilder,
    private modalCtrl: ModalController) { }

  ngOnInit() {
    this.createDynamicItemsList();
  }

  ngOnChanges() { this.createDynamicItemsList(); }

  createDynamicItemsList() {
    const itemsGroup = {};
    this.items.forEach(item => {
      const groupName = item.name;
      itemsGroup[groupName] = this.fb.group({
        'selected': [false],
        'amount': [item.remaining_qty],
        'name': [item.name],
        'price': [item.price],
        'currency': [item.currency]
      });
    });
    itemsGroup['deadline'] = this.fb.group({
      'deadlineDate': []
    });
    this.itemsForm = new FormGroup(itemsGroup);
    console.log('this.itemsForm', this.itemsForm);
  }

  onCancel() { this.cancelled.emit(); }

  onCreateNewProduct() {
    this.modalCtrl
      .create({
        component: NewProductModalComponent,
        componentProps: { group: this.group },
      })
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      })
      .then(_ => {
        this.updated.emit(true);
        this.createDynamicItemsList();
      });
  }

  onDeleteItem(itemid: number) {
    this.apiClientService.deleteItem(itemid)
      .subscribe(_ => {
        this.updated.emit(true);
        this.createDynamicItemsList();
      });
  }

  onSaveChanges() {
    this.apiClientService.updateGroupDeadline(this.itemsForm.value['deadline'], this.group.id)
      .subscribe(data => {
        this.done.emit(data);
      })
  }


}
