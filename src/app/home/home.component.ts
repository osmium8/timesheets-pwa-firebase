import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TimesheetService } from '../services/timesheet.service';
import { Table } from 'primeng/table';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize, Observable, Observer } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Timesheet } from '../models/timesheet.model';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class HomeComponent implements OnInit {

  file: File;

  timesheetDialog: boolean;

  timesheets: Timesheet[];

  timesheet: Timesheet;

  selectedTimesheets: Timesheet[] | null;

  submitted: boolean;

  statuses: any[];

  constructor(public service: TimesheetService, private messageService: MessageService, private storage: AngularFireStorage, private auth: AngularFireAuth, private tokenService: TokenService) { }

  ngOnInit() {
    this.auth.currentUser.then(user => {
      this.service.getUserTimesheets(user!.uid).subscribe((queriedItems: Timesheet[]) => {
        this.timesheets = queriedItems;
      })
    });
    this.tokenService.message.subscribe((message: { notification: any; }) => {
      if (message) {
        this.messageService.add({ severity: 'success', summary: message.notification.title, detail: '', life: 3000 });
      }
    })
  }


  openNew() {
    this.timesheet = {};
    this.submitted = false;
    this.timesheetDialog = true;
  }

  hideDialog() {
    this.timesheetDialog = false;
    this.submitted = false;
  }

  saveTimesheet() {
    this.submitted = true;

    this.timesheet.date = this.formatDate(this.timesheet.date);
    this.timesheet.startTime = this.formatTime(this.timesheet.startTime);
    this.timesheet.endTime = this.formatTime(this.timesheet.endTime);
    this.timesheet.docUrl = this.downloadURL || '';

    console.log('saveTimesheet()...', this.timesheet);
    if (this.timesheet) {
      if (this.timesheet.uid) {
        this.service.updateTimesheet(this.timesheet!.uid, this.timesheet!)
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Timesheet Updated', life: 3000 });
      }
      else {
        this.service.addTimesheet({...this.timesheet, status: 'sent'});
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Timesheet Created', life: 3000 });
      }
    }

    this.timesheetDialog = false;
    this.timesheet = {};
  }

  padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
  }
  
  formatDate(date: any) {
    const temp = new Date();
    console.log(this.formatTime(temp));
    return [
      this.padTo2Digits(date.getDate()),
      this.padTo2Digits(date.getMonth() + 1),
      date.getFullYear(),
    ].join('-');
  }

  formatTime(date: any) {
    return [
      this.padTo2Digits(date.getHours()),
      this.padTo2Digits(date.getMinutes())
    ].join(':');
  }

  @ViewChild('dt') dt: Table;

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  uploadPercent: number;
  uploadPercent$: Observable<number | undefined>;
  downloadURL$: any;

  uploadTask: boolean = false;
  downloadURL: any;
  uploadedFileName: string;

  @ViewChild('fileInput')
  fileInputVariable: ElementRef;

  async reset() {
    const temp = this.downloadURL;
    this.downloadURL = '';
    await this.deleteUploadedFile(temp);
    this.fileInputVariable.nativeElement.value = "";
    this.uploadTask = false;
  }

  deleteUploadedFile(downloadUrl: string) {
    return this.storage.storage.refFromURL(downloadUrl).delete();
  }

  async uploadFile(event: any) {
    this.uploadTask = true;
    const user = await this.auth.currentUser;
    const employeeName = user!.displayName;
    const today = new Date();
    const file = event.target.files[0];
    console.log(file.name);
    this.uploadedFileName = file.name;
    const filePath = employeeName+'/'+this.formatDate(today)+'/'+this.uploadedFileName;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    console.log('uploadFile...');
    // observe percentage changes
    this.uploadPercent$ = task.percentageChanges();
    this.uploadPercent$.subscribe(uploadPercent => this.uploadPercent = uploadPercent || 0);
    // get notified when the download URL is available
    task.snapshotChanges().pipe(
        finalize(() => {
          this.downloadURL$ = fileRef.getDownloadURL();
          this.downloadURL$.subscribe((url: any) => {
            this.downloadURL = url;
            console.log(this.downloadURL);
          });
        })
     ).subscribe()
  }

  downloadDoc(docUrl: string) {
    console.log(docUrl);
    window.open(docUrl, "_blank");
  }

}
