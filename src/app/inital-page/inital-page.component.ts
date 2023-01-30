import { Component } from '@angular/core';

@Component({
  selector: 'app-inital-page',
  templateUrl: './inital-page.component.html',
  styleUrls: ['./inital-page.component.scss'],
})
export class InitalPageComponent {
  cityOptions = ['Campinas, SP', 'São Paulo, SP', 'Varginha, MG'];
  selectedCity = '';
  cityValues = {
    '': '',
    'Campinas, SP': 'campinas',
    'São Paulo, SP': 'são paulo',
    'Varginha, MG': 'varginha',
  };

  changeSelectedCity(value: string) {
    const nonNullOption = Object.keys(this.cityValues).includes(value)
      ? (value as keyof typeof this.cityValues)
      : '';

    this.selectedCity = this.cityValues[nonNullOption];
  }

  get hasSelectedCity() {
    return this.selectedCity !== '';
  }

  hasSelectedThisCity(option: string) {
    return (
      this.cityValues[option as keyof typeof this.cityValues] ==
      this.selectedCity
    );
  }
}
