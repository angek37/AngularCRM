import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import {CrmService} from '../../services/crm.service';

@Component({
  selector: 'ngx-smart-table',
  templateUrl: './cuentas.component.html',
  styles: [`
    nb-card {
      transform: translate3d(0, 0, 0);
    }
  `],
})
export class CuentasComponent implements OnInit {
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
      name: {
        title: 'Nombre de Cuenta',
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
      contactName: {
        title: 'Contacto Principal',
        type: 'string',
        filter: false,
        valuePrepareFunction: (cell, row) => {
          if (row.primarycontactid != null) {
            return row.primarycontactid.fullname;
          }
        },
      },
      contactEmail: {
        title: 'Correo Electrónico',
        type: 'string',
        filter: false,
        valuePrepareFunction: (cell, row) => {
          if (row.primarycontactid != null) {
            return row.primarycontactid.emailaddress1;
          }
        }
      }
    },
  };

  source: LocalDataSource = new LocalDataSource();
  query = '$select=address1_city,address1_country,name&$expand=primarycontactid($select=emailaddress1,fullname)';


  constructor(private crm: CrmService) { }

  ngOnInit() {
    this.crm.getEntities('accounts', this.query)
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
