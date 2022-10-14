import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { User } from '../models/user.model';

@Injectable({
    providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {
    constructor(
        private afAuth: AngularFireAuth,
        private db: AngularFirestore,
        private router: Router
    ) { }

    async canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Promise<boolean> {

        const afUser = await this.afAuth.currentUser;
        const isLoggedIn = !!afUser;

        if (!isLoggedIn) {
            console.log('user not logged in');
            return isLoggedIn;
        }

        const userRef = (await this.db.collection('admins').doc<User>(afUser.uid).ref.get()).exists;

        return new Promise((resolve, reject) => {
            if (userRef) {
                resolve(true);
            }
            else {
                this.router.navigate(['auth'], { queryParams: {error: 403}});
                resolve(false);
            }
        });
    }

}
