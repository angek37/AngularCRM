import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {MsAdalAngular6Service} from 'microsoft-adal-angular6';

@Component({
  selector: 'ngx-logout',
  template: '<p>Saliendo...</p>',
})
export class LogoutComponent implements OnInit {

  constructor(private route: Router, private adalSvc: MsAdalAngular6Service) { }

  ngOnInit() {
    this.adalSvc.logout();
  }

}
