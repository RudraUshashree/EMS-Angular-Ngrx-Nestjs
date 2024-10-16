import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { DemoMaterialModule } from 'src/app/demo-material-module';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [
    DemoMaterialModule
  ],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.scss'
})
export class PageNotFoundComponent {
  constructor(private location: Location) { }

  onGoBackButtonClick() {
    this.location.back();
  }
}
