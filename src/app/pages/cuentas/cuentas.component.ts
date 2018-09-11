import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import {CrmService} from '../../services/crm.service';
import {NbThemeService} from '@nebular/theme';
import {Subscription} from 'rxjs/index';
import {NgForm} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'ngx-smart-table',
  templateUrl: './cuentas.component.html',
  styleUrls: ['./cuentas.component.scss']
})
export class CuentasComponent implements OnInit {
  contact = {
    contactid: null
  };
  contactsLength = 0;
  contacts = [];
  contactsBuffer = [];
  row: any;
  flipped = false;
  loading = true;
  account = {
    name: '',
    address1_city: '',
    address1_country: '',
    address1_stateorprovince: ''
  };
  settings = {
    mode: 'external',
    actions: {
      edit: false,
    },
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
  queryContacts = '$select=fullname&$count=true&$top=';
  settingsBtn: Array<any>;
  themeSubscription: Subscription;


  constructor(private crm: CrmService, private themeService: NbThemeService, private toastr: ToastrService) {
    this.themeSubscription = this.themeService.getJsTheme().subscribe(theme => {
      this.init(theme.variables);
    });
  }

  init(colors: any) {
    this.settingsBtn = [{
      class: 'btn-hero-primary',
      container: 'primary-container',
      title: 'Primary Button',
      buttonTitle: 'Primary',
      default: {
        gradientLeft: `adjust-hue(${colors.primary}, 20deg)`,
        gradientRight: colors.primary,
      },
      corporate: {
        color: colors.primary,
        glow: {
          params: '0 0 20px 0',
          color: 'rgba (115, 161, 255, 0.5)',
        },
      }
    }, {
      class: 'btn-hero-warning',
      container: 'warning-container',
      title: 'Warning Button',
      buttonTitle: 'Warning',
      default: {
        gradientLeft: `adjust-hue(${colors.warning}, 10deg)`,
        gradientRight: colors.warning,
      },
      corporate: {
        color: colors.warning,
        glow: {
          params: '0 0 20px 0',
          color: 'rgba (256, 163, 107, 0.5)',
        },
      },
    }, {
      class: 'btn-hero-success',
      container: 'success-container',
      title: 'Success Button',
      buttonTitle: 'Nuevo',
      default: {
        gradientLeft: `adjust-hue(${colors.success}, 20deg)`,
        gradientRight: colors.success,
      },
      corporate: {
        color: colors.success,
        glow: {
          params: '0 0 20px 0',
          color: 'rgba (93, 207, 227, 0.5)',
        },
      },
    }, {
      class: 'btn-hero-info',
      container: 'info-container',
      title: 'Info Button',
      buttonTitle: 'Info',
      default: {
        gradientLeft: `adjust-hue(${colors.info}, -10deg)`,
        gradientRight: colors.info,
      },
      corporate: {
        color: colors.info,
        glow: {
          params: '0 0 20px 0',
          color: 'rgba (186, 127, 236, 0.5)',
        },
      }
    }, {
      class: 'btn-hero-danger',
      container: 'danger-container',
      title: 'Danger Button',
      buttonTitle: 'Cancelar',
      default: {
        gradientLeft: `adjust-hue(${colors.danger}, -20deg)`,
        gradientRight: colors.danger,
      },
      corporate: {
        color: colors.danger,
        glow: {
          params: '0 0 20px 0',
          color: 'rgba (255, 107, 131, 0.5)',
        },
      }
    }, {
      class: 'btn-hero-secondary',
      container: 'secondary-container',
      title: 'Ghost Button',
      buttonTitle: 'Ghost',
      default: {
        border: '#dadfe6',
      },
      corporate: {
        color: '#edf2f5',
      }
    }];
  }

  ngOnInit() {
    this.crm.getEntities('accounts', this.query)
      .subscribe(
        (resp: any) => {
          this.source.load(resp.value);
          this.loading = false;
        }
      );
    this.crm.getEntities('contacts', this.queryContacts + '10')
      .subscribe(
        (resp: any) => {
          this.contactsLength = +resp['@odata.count'];
          this.contacts = resp.value;
          this.contactsBuffer = this.contacts.slice(0, 10);
        }
      );
  }

  onDeleteConfirm(): void {
    this.crm.deleteEntity('accounts', this.row.data.accountid)
      .subscribe(
        (value: any) => {
          this.toastr.success('La cuenta se eliminó de forma exitosa', '¡Éxito!');
        },
        (error1 => this.toastr.error('Ha ocurrido un error al eliminar la cuenta', '¡Error!'))
      );
  }

  onSubmit(form: NgForm) {
    this.loading = true;
    this.account.name = form.form.value.name;
    this.account.address1_city = form.form.value.city;
    this.account.address1_stateorprovince = form.form.value.state;
    this.account.address1_country = form.form.value.country;
    if (form.form.value.contact !== '') {
      this.account['primarycontactid@odata.bind'] = '/contacts(' + form.form.value.contact + ')';
    }
    this.crm.postEntity('accounts', this.account)
      .subscribe(
        (value: any) => {
          this.loading = false;
          form.reset();
          this.flipped = false;
          this.toastr.success('Se ha creado la cuenta', '¡Éxito!');
        }
        ,
        (error: any) => {
          this.toastr.error('Se ha producido un error al crear la cuenta', '¡Error!');
        }
      );
  }

  fetchMore() {
    const len = this.contactsBuffer.length;
    this.crm.getEntities('contacts', this.queryContacts + (10 + len))
      .subscribe(
        (resp: any) => {
          this.contacts = resp.value;
          this.contactsBuffer = this.contacts.slice(0, this.contacts.length);
        }
      );
  }

}
