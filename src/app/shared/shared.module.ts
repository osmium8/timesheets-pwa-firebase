import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ShellComponent } from './shell/shell.component';
import {MenuModule} from 'primeng/menu';
import {MenubarModule} from 'primeng/menubar';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {InputTextModule} from 'primeng/inputtext';
import {TableModule} from 'primeng/table';
import {ToastModule} from 'primeng/toast';
import {ToolbarModule} from 'primeng/toolbar';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {DialogModule} from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { TagModule } from 'primeng/tag';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {ToggleButtonModule} from 'primeng/togglebutton';
import {CalendarModule} from 'primeng/calendar';
import { HttpClientModule } from '@angular/common/http';
import {ProgressBarModule} from 'primeng/progressbar';

const modules = [
  CommonModule,
  RouterModule,
  MenuModule,
  MenubarModule,
  ButtonModule,
  CardModule,
  InputTextModule,
  TableModule,
  ToastModule,
  ToolbarModule,
  ConfirmDialogModule,
  DialogModule,
  FormsModule,
  TagModule,
  MessageModule,
  MessagesModule,
  ToggleButtonModule,
  CalendarModule,
  ProgressBarModule,
  HttpClientModule
];

@NgModule({
  declarations: [
    ShellComponent
  ],
  imports: [
    CommonModule,
    ...modules
  ],
  exports: [
    ...modules,
    ShellComponent
  ]
})
export class SharedModule { }
