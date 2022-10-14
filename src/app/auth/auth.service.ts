import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../models/user.model';

import firebase from 'firebase/compat/app';
import { BehaviorSubject, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // private userDoc: AngularFirestoreDocument<any>;
  // user: Observable<any>;

  isAdmin;
  isAdmin$;

  constructor(private afAuth: AngularFireAuth, private db: AngularFirestore) {
    // this.userDoc = db.doc('users/');
    // this.user = this.userDoc.valueChanges();
    this.isAdmin = new BehaviorSubject<boolean>(false);
    this.isAdmin$ = this.isAdmin.asObservable();
   }

  async createUser(user: User) {
    const currentUser = await this.afAuth.currentUser;
    console.log('createUser', user);
    return this.db.collection('users').doc(currentUser!.uid).set({
      ...user,
      uid: currentUser!.uid,
      createdAt: (String)(new Date())
    })
  }

  async deleteUser(userId: string) {
    return this.db.collection('users').doc(userId).delete();
  }

  async updateUser(userId: string, user: User) {
    return this.db.collection('users').doc(userId).update(user);
  }

  async removeBio(userId: string) {
    return this.db.collection('users').doc(userId).update({
      bio: firebase.firestore.FieldValue.delete()
    });
  }

  async getUserById() {
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          try {
            const userRef = this.db.collection('admins').doc<User>(user.uid);
            return [];
          }
          catch {
            return [];
          }
        } else {
          return [];
        }
      })
    )
  }

  async getUser() {
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.db.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return [];
        }
      })
    )
  }
}
