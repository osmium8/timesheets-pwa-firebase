import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import firebase from 'firebase/compat/app';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-phone-login',
  templateUrl: './phone-login.component.html',
  styleUrls: ['./phone-login.component.css']
})
export class PhoneLoginComponent implements OnInit {

  form: FormGroup;

  loading = false;

  serverMessage: string;

  constructor(private service: AuthService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      phone: ['', [Validators.required, Validators.minLength(13)]],
    });
  }

  get phone() {
    return this.form.get('phone');
  }

  async onSubmit() {
    console.log('submit', this.phone!.value);
    // 'recaptcha-container' is the ID of an element in the DOM.
    console.log('submit', this.phone!.value);
    var applicationVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    firebase.auth().signInWithPhoneNumber(this.phone!.value, applicationVerifier).then(
        function(confirmationResult) {
          var verificationCode = window.prompt('Please enter the verification ' + 'code that was sent to your mobile device.');
          return confirmationResult.confirm(verificationCode!);
      }).then((afUserCred) => {
        console.log(afUserCred.user);
       this.service.createUser({name: afUserCred!.user!.displayName || 'NA', isAdmin: false, uid: afUserCred!.user!.uid})
       afUserCred.user?.updateProfile({displayName: 'NA [Phone Login]', photoURL: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png'})
      })
      .catch((error) => {
        this.serverMessage = error;
      });
  }

}
