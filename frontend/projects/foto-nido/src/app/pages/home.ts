import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Contact } from '../sections/contact';
import { Day } from '../sections/day';
import { Due } from '../sections/due';
import { Hero } from '../sections/hero';
import { Ines } from '../sections/ines';
import { Letters } from '../sections/letters';
import { Rates } from '../sections/rates';
import { Sessions } from '../sections/sessions';

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Hero, Sessions, Due, Day, Ines, Rates, Letters, Contact],
  template: `
    <app-hero />
    <app-sessions />
    <app-due />
    <app-day />
    <app-ines />
    <app-rates />
    <app-letters />
    <app-contact />
  `,
})
export default class Home {
  constructor() {
    inject(Title).setTitle('Nido · Fotografía newborn y familia en Aguascalientes');
    inject(Meta).updateTag({
      name: 'description',
      content: 'Nido es el estudio de Inés Calvo: fotografía de recién nacidos, maternidad, familia y primer año en Aguascalientes. Sesiones sin prisa, en un estudio tibio y seguro.',
    });
  }
}
