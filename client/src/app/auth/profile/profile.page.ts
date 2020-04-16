import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IonItemSliding } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  @ViewChild('username', { static: true }) username: HTMLInputElement;
  @ViewChild('email', { static: true }) email: HTMLInputElement;
  @ViewChild('phone', { static: true }) phone: HTMLInputElement;

  user: {
    username: string,
    email: string,
    phone: string,
    preferred_contact_mode: string,
    groups: { id: number, name: string, description: string, image: string, manager_id: string }[]
  } = {
      username: 'Lulu',
      email: 'lulu@mail.com',
      phone: '1234567',
      preferred_contact_mode: 'phone',
      groups: [
        { id: 1, name: 'Boulangerie', description: 'Boulangerie du Fournil', image: '', manager_id: 'id1' },
        { id: 2, name: 'Fruits', description: 'Cartalade', image: '', manager_id: 'id1' },
      ]
    };

  constructor() { }

  ngOnInit() {
    // fetch user profile
  }

  onLeaveGroup(groupid: number, slidingEl: IonItemSliding) {
    console.log('leave group with id', groupid);
    slidingEl.close();
  }

  onUpdate(field: string, e) {
    console.log('updating field', field, e.target.value);
  }

  enableInput(field: string, e) {
    this[field].disabled = !this[field].disabled;
    if (this[field].disabled) {
      e.target.querySelector('ion-icon').setAttribute('name', 'pencil-outline')
    }
    else {
      e.target.querySelector('ion-icon').setAttribute('name', 'save-outline');
    }
  }

}
