import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.css'],
})
export class ShellComponent implements OnInit {

  showAdminNaviagation: boolean = false;

  items: MenuItem[] = [
    {
        label: 'Timesheet',
        icon: 'pi pi-calendar',
        routerLink: ['']
    },
    {
      label: 'Auth',
      icon: 'pi pi-key',
      routerLink: ['/auth']
    }
  ];

  constructor(private db: AngularFirestore, public auth: AngularFireAuth, private router: Router) { }

  ngOnInit(): void {
    this.auth.authState.subscribe((user) => {
      if (user) {
        this.db.collection('admins').doc<User>(user.uid).ref.get().then(
          doc => {
            if (doc.exists) {
              this.items = [
                {
                  label: 'Admin Panel',
                  icon: 'pi pi-fw pi-user-edit',
                  routerLink: ['/admin'],
                  visible: true
                },
                {
                  label: 'Auth',
                  icon: 'pi pi-key',
                  routerLink: ['/auth']
                }
              ];
            }
          })
      } else {
        this.items = [
          {
              label: 'Timesheet',
              icon: 'pi pi-calendar',
              routerLink: ['']
          },
          {
            label: 'Auth',
            icon: 'pi pi-key',
            routerLink: ['/auth']
          }
        ];
      }
    })
  }

  signOut() {
    this.auth.signOut();
    this.router.navigateByUrl('/auth');
  }
}
