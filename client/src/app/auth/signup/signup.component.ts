import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {

  @Output() switch = new EventEmitter();
  @Output() signup = new EventEmitter<{ email: string, name: string, password: string }>();

  @ViewChild('f', { static: true }) form: NgForm;

  constructor() { }

  ngOnInit() { }

  onSwitchToLogin() { this.switch.emit(); }

  onSignup() {
    const email: string = this.form.value['email'];
    const name: string = this.form.value['name'];
    const password: string = this.form.value['password'];
    this.signup.emit({ name, email, password });
  }

}
