import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppearDirective } from '../animated-squares/appear';



@NgModule({
  declarations: [AppearDirective],
 exports:[AppearDirective],
  imports: [
    CommonModule
  ]
})
export class AppearModule { }
