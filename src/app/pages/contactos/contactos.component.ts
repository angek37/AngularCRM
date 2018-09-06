import { Component, OnInit } from '@angular/core';
import {LocalDataSource} from 'ng2-smart-table';
import {CrmService} from '../../services/crm.service';

@Component({
  selector: 'ngx-smart-table',
  templateUrl: './contactos.component.html'
})
export class ContactosComponent implements OnInit {
  settings = {
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      fullname: {
        title: 'Nombre',
        type: 'string',
      },
      address1_city: {
        title: 'Ciudad',
        type: 'string',
      },
      address1_country: {
        title: 'País',
        type: 'string',
      },
      emailaddress1: {
        title: 'Email',
        type: 'string',
      },
      telephone1: {
        title: 'Phone',
        type: 'string',
      },
      primaryAccount: {
        title: 'Cuenta',
        type: 'string',
        filter: false,
        valuePrepareFunction: (cell, row) => {
          if (row.parentcustomerid_account != null) {
            return row.parentcustomerid_account.name;
          }
        }
      }
    },
  };

  source: LocalDataSource = new LocalDataSource();
  query = '$select=address1_city,address1_country,address1_stateorprovince,emailaddress1,fullname,telephone1' +
    '&$expand=parentcustomerid_account($select=name)';


  constructor(private crm: CrmService) { }

  ngOnInit() {
    this.crm.getEntities('contacts', this.query)
      .subscribe(
        (resp: any) => {
          this.source.load(resp.value);
          // console.log(resp);
        }
      );
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

}
