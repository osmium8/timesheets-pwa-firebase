import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  /** components can observe this to push message toast */
  message: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private auth: AngularFireAuth, private db: AngularFirestore) { }

  async addToken(token: string) {
    console.log(token, 'addToken');
    const userId = (await this.auth.currentUser)?.uid;
    this.db.collection('users').doc(userId).update({
      token: token
    });
  }

  async getTokenByUserUid(userUID: string) {
    const doc = await this.db.collection('users').doc<User>(userUID).ref.get();
    return doc.data()!.token;
  }
}
