import { Component } from '@angular/core';

@Component({
  selector: 'app-inital-page',
  templateUrl: './inital-page.component.html',
  styleUrls: ['./inital-page.component.scss'],
})
export class InitalPageComponent {
  cityOptions = ['Campinas, SP', 'São Paulo, SP'];
  selectedCity = '';

  changeSelectedCity(value: string) {
    this.selectedCity = value;
  }

  get hasSelectedCity() {
    return this.selectedCity !== '';
  }
}
