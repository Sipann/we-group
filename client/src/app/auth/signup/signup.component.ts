import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {

  @Output() switch = new EventEmitter();

  constructor() { }

  ngOnInit() { }

  onSwitchToLogin() { this.switch.emit(); }

  onSignup() {
    console.log('signup');
  }



}
