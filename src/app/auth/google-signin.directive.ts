import { Directive, HostListener } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { AuthService } from './auth.service';

@Directive({
  selector: '[appGoogleSignin]'
})
export class GoogleSigninDirective {

  constructor(private afAuth: AngularFireAuth, private service: AuthService) { }

  @HostListener('click')
  onclick() {
     this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then((afUser) => {
       console.log(afUser.user);
       this.service.createUser({name: afUser!.user!.displayName || 'NA', isAdmin: false, uid: afUser!.user!.uid})
     })
  }

}
