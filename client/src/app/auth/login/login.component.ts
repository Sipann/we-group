import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  @Output() switch = new EventEmitter();

  constructor() { }

  ngOnInit() { }

  onSwitchToSignup() { this.switch.emit(); }

  onLogin() {
    console.log('signup');
  }

}
