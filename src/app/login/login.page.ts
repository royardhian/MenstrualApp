import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  _showLockScreen: boolean;
  ACDelbuttons: boolean;
  passcodeWrong: boolean;
  touchId: boolean;

  passcodeAttempts: number = 0;
  enteredPasscode: string = '';
  passcode: string = '1111';
  passcodeLabel: string;
  onCorrect: any;
  onWrong: any;
  selected: any;

  constructor(private router: Router) {
    this._showLockScreen = true;
  }

  ngOnInit() {

  }

  digit(digit: any): void {
    this.showPassClear();
    this.selected = +digit;
    if (this.passcodeWrong) {
      return;
    }
    this.enteredPasscode += '' + digit;
    if (this.enteredPasscode.length >= 4) {
      if (this.enteredPasscode === '' + this.passcode) {
        this.enteredPasscode = '';
        this.passcodeAttempts = 0;
        this.onCorrect && this.onCorrect();
        this._showLockScreen = false;
        this.router.navigate(['/home'])
      } else {
        this.passcodeWrong = true;
        this.passcodeAttempts++;
        this.onWrong && this.onWrong(this.passcodeAttempts);
        setTimeout(() => {
          this.enteredPasscode = '';
          this.passcodeWrong = false;
        }, 800);
      }
    }
  }

  showPassClear() {
    if (this.enteredPasscode.length > 0) {
      this.ACDelbuttons = true;
    } else {
      this.ACDelbuttons = false;
    }
  }
  allClear(): void {
    this.enteredPasscode = "";
    this.showPassClear();
  }

  remove(): void {
    this.enteredPasscode = this.enteredPasscode.slice(0, -1);
    this.showPassClear();
  }
}
