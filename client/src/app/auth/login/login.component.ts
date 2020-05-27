import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  @Output() switch = new EventEmitter();
  @Output() login = new EventEmitter<{ email: string, password: string }>();

  @ViewChild('f', { static: true }) form: NgForm;

  constructor() { }

  ngOnInit() { }

  onLogin() {
    const email = this.form.value['email'];
    const password = this.form.value['password'];
    this.login.emit({ email, password });
  }

  onSwitchToSignup() { this.switch.emit(); }

}
