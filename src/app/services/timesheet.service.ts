import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { environment } from 'src/environments/environment';
import { TokenService } from './token.service';
import { Timesheet } from '../models/timesheet.model';

@Injectable({
  providedIn: 'root'
})
export class TimesheetService {

  constructor(
    private http: HttpClient, 
    private afAuth: AngularFireAuth, 
    private db: AngularFirestore, 
    private tokenService: TokenService
  ) { }

  async addTimesheet(timesheet: Timesheet) {

    const currentUser = await this.afAuth.currentUser;
    const newDocID = this.db.createId();
    await this.db.collection('timesheets').doc(newDocID).set({
      ...timesheet,
      uid: newDocID,
      employeeUID: currentUser!.uid,
      employeeName: currentUser!.displayName,
      createdAt: this.getDateToday()
    });

    this.http.post<any>(`${environment.API_URL}/notifications/newtimesheet`, {event: 'new timesheet created'}).subscribe(data => {
      console.log(data, 'req');
    });
  }

  async updateTimesheet(uid: string, timesheet: Timesheet) {
    return this.db.collection('timesheets').doc(uid).update({
      ...timesheet,
      createdAt: this.getDateToday(),
    })
  }

  async getTimesheets() {
    return this.db.collection<Timesheet>('timesheets', ref => ref.orderBy('date', 'desc')).valueChanges(); // fetch all timesheets
  }

  getUserTimesheets(uid: string) {
    return this.db.collection<Timesheet>('timesheets', ref => ref.where('employeeUID', '==', uid).orderBy('date', 'desc')).valueChanges();
  }

  getDateToday(): string {
    var today: any = new Date();

    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = dd + '/' + mm + '/' + yyyy;
    return today;
  }

  async rejecttTimesheet(uid: string, userUID: string) {
    const token = await this.tokenService.getTokenByUserUid(userUID);

    console.log('token in rejectTimesheet', token);

    this.http.post<any>(`${environment.API_URL}/notifications/statusupdate/reject/${token}`, {event: 'timesheet rejected'}).subscribe(data => {
      console.log(data, 'req');
    });
    return this.db.collection('timesheets').doc(uid).update({
      status: 'rejected'
    })
  }

  async approveTimesheet(uid: string, userUID: string) {
    console.log('approveTimesheet()...', uid);

    const token = await this.tokenService.getTokenByUserUid(userUID);

    console.log('token in approveTimesheet', token);

    if (token) {
      this.http.post<any>(`${environment.API_URL}/notifications/statusupdate/approve/${token}`, {event: 'timesheet approved'}).subscribe(data => {
        console.log(data, 'req');
      });
    }

    return this.db.collection('timesheets').doc(uid).update({
      status: 'approved'
    })
  }

}
