import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Router } from '@angular/router';

import { AlertController } from '@ionic/angular';
import { AngularFireStore } from '@angular/fire/firestore';
import { UserService } from '../user.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  username: string = ""
  password: string = ""
  cpassword: string = ""

  constructor(
    public afAuth: AngularFireAuth,
    public alert: AlertController,
    public router: Router,
    public afstore: AngularFireStore,
    public user: UserService
    ) { }

  ngOnInit() {
  }

  async register() {
    const { username, password, cpassword} = this
    if(password !== cpassword) {
      this.showAlert("Error!", "Password don't match")
      return console.log("Password dont match")
    }
    try {
      const res = await this.afAuth.auth.createUserWithEmailAndPassword(username + '@gmail.com', password)
    
      this.afstore.doc(`users/${res.user.uid}`).ser({
        username
      })

      this.user.setUser({
        username,
        uid: res.user.uid
      })

      this.showAlert("Succees","You are registered")
      this.router.navigate(['/tabs'])

    } catch(err){
      console.dir(err)
      this.showAlert("Error!", err.message)
    }

  }

  async showAlert(header: string, message: string) {
    const alert = await this.alert.create({
      header,
      message,
      buttons: ["OK"]
    })

    await alert.present()
  }
}
