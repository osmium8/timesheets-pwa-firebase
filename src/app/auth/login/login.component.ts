import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { ActivatedRoute } from '@angular/router';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  msgs: any[] = [];

  constructor(
    private afMessaging: AngularFireMessaging, 
    public afAuth: AngularFireAuth, 
    private activatedRoute: ActivatedRoute,
    private tokenService: TokenService) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      const error = params['error'];
      if (error === '401') {
        // login error
        this.msgs.push({severity:'error', summary:'You need to Login to access this resource.', detail:''});
      } else if (error === '403') {
        // admin privilege not found
        this.msgs.push({severity:'error', summary:'You need to Admin Rights to access this resource.', detail:''});
      }
    });
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.requestPermission();
        this.listen();
      }
    })
  }

  requestPermission() {
    this.afMessaging.requestToken
      .subscribe(
        (token) => { this.tokenService.addToken(token!); },
        (error) => { console.error(error); },  
      );
  }

  listen() {
    this.afMessaging.messages.subscribe((message) => {
      this.tokenService.message.next(message);
      console.log('foreground message received:', message);
    });
  }

}
