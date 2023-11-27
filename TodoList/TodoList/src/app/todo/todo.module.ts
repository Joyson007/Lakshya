import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';

import {TodoPageRoutingModule} from './todo-routing.module';
import {TodoPage} from './todo.page';
import {TodoInfoComponent} from '../shared/components';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    TodoPageRoutingModule
  ],
  declarations: [TodoPage, TodoInfoComponent]
})
export class TodoPageModule {
}
