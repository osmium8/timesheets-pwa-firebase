import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Timesheet } from '../models/timesheet.model';
import { TimesheetService } from '../services/timesheet.service';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class AdminHomeComponent implements OnInit {

  timesheetDialog: boolean;

  timesheets: Timesheet[];

  timesheet: Timesheet;

  selectedTimesheets: Timesheet[] | null;

  submitted: boolean;

  statuses: any[];

  constructor(private auth: AngularFireAuth, public service: TimesheetService, private messageService: MessageService, private confirmationService: ConfirmationService) { }

  ngOnInit() {
    this.service.getTimesheets().then($data => $data.subscribe((data) => {
      this.timesheets = data
    }));

    this.statuses = [
      { label: 'APRROVED', value: 'approved' },
      { label: 'SENT', value: 'sent' },
      { label: 'REJECTED', value: 'rejected' }
    ];
  }

  openNew() {
    this.timesheet = {};
    this.submitted = false;
    this.timesheetDialog = true;
  }

  approveSelectedTimesheets() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to approve the selected timesheets?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.selectedTimesheets?.forEach((value) => {
          this.approveTimesheet(value);
        })
        this.selectedTimesheets = null;
        this.messageService.add({ severity: 'success', summary: 'Operation Successful', detail: 'All Selected Timesheets Approved', life: 3000 });
      }
    });
  }

  async approveTimesheet(timesheet: Timesheet) {
    this.service.approveTimesheet(timesheet.uid!, timesheet.employeeUID!);
    this.messageService.add({ severity: 'success', summary: 'Operation Successful', detail: 'Timesheet approved', life: 3000 });
  }

  rejectTimesheet(timesheet: Timesheet) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to reject the timesheet for date: ' + timesheet.date + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.service.rejecttTimesheet(timesheet.uid!, timesheet.employeeUID!);
        this.messageService.add({ severity: 'warn', summary: 'Operation Successful', detail: 'Timesheet rejected', life: 3000 });
      }
    });
  }

  hideDialog() {
    this.timesheetDialog = false;
    this.submitted = false;
  }

  @ViewChild('dt') dt: Table;

  applyFilterGlobal($event: any, stringVal: any) {
    this.dt.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  downloadDoc(docUrl: string) {
    console.log(docUrl);
    window.open(docUrl, "_blank");
  }

}
