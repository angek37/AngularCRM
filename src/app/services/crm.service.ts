import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {MsAdalAngular6Service} from 'microsoft-adal-angular6';

@Injectable({
  providedIn: 'root'
})
export class CrmService {
  private token: string;
  private headers;

  constructor(private http: HttpClient, private adalSvc: MsAdalAngular6Service) {
    this.adalSvc.acquireToken(environment.ad.resource)
      .subscribe(
        (resToken: string) => {
          this.token = resToken;
        }
      );
    this.headers = new HttpHeaders()
      .set('Authorization', 'Bearer ' + this.token)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json; charset=utf-8')
      .set('OData-MaxVersion', '4.0')
      .set('OData-Version', '4.0');
  }

  getEntities(entity: string, conditions?: string) {
    return this.http.get(environment.ad.crm + entity
      + (conditions ? '?' + conditions : '')
      , {headers: this.headers});
  }
}
