import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import {CrmService} from '../../services/crm.service';
import {NbThemeService} from '@nebular/theme';
import {Subscription} from 'rxjs/Rx';
import {NgForm} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'ngx-smart-table',
  templateUrl: './cuentas.component.html',
  styleUrls: ['./cuentas.component.scss']
})
export class CuentasComponent implements OnInit, OnDestroy {
  @ViewChild('f') form: NgForm;
  contact = {
    contactid: null
  };
  accountidEditing: string;
  editing = false;
  contactsSubscription: Subscription;
  accountsSubscription: Subscription;
  contactsLength = 0;
  contacts = [];
  contactsBuffer = [];
  loadingSelect = false;
  row: any;
  flipped = false;
  loading = true;
  account = {
    name: '',
    address1_city: '',
    address1_country: '',
    address1_stateorprovince: ''
  };
  accountEdit = {
    name: '',
    address1_city: '',
    address1_country: ''
  };
  settings = {
    mode: 'external',
    actions: {
      edit: true,
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
    this.fetchAccounts();
    this.contactsSubscription = this.crm.getEntities('contacts', this.queryContacts + '50')
      .subscribe(
        (resp: any) => {
          this.loadingSelect = true;
          this.contactsLength = +resp['@odata.count'];
          this.contacts = resp.value;
          this.contactsBuffer = this.contacts;
        },
        null,
        () => { this.loadingSelect = false; }
      );
  }

  fetchAccounts() {
    this.accountsSubscription = this.crm.getEntities('accounts', this.query)
      .subscribe(
        (resp: any) => {
          this.source.load(resp.value);
          this.loading = false;
        }
      );
  }

  onDeleteConfirm(): void {
    this.loading = true;
    this.crm.deleteEntity('accounts', this.row.data.accountid)
      .subscribe(
        null,
        (error1 => this.toastr.error('Ha ocurrido un error al eliminar la cuenta', '¡Error!')),
        () => {
          this.fetchAccounts();
          this.toastr.success('La cuenta se eliminó de forma exitosa', '¡Éxito!');
          this.loading = false;
        }
      );
  }

  onSubmit(form: NgForm) {
    this.loading = true;
    if (!this.editing) {
      this.account.name = form.form.value.name;
      this.account.address1_city = form.form.value.city;
      this.account.address1_stateorprovince = form.form.value.state;
      this.account.address1_country = form.form.value.country;
      if (form.form.value.contactid !== '') {
        this.account['primarycontactid@odata.bind'] = '/contacts(' + form.form.value.contactid + ')';
      }
      this.crm.postEntity('accounts', this.account)
        .subscribe(
          null,
          (error: any) => {
            this.toastr.error('Se ha producido un error al crear la cuenta', '¡Error!');
          },
          () => {
            this.fetchAccounts();
            form.reset();
            this.flipped = false;
            this.toastr.success('Se ha creado la cuenta', '¡Éxito!');
            this.loading = false;
          }
        );
    } else {
      this.accountEdit.name = form.form.value.name;
      this.accountEdit.address1_city = form.form.value.city;
      this.accountEdit.address1_country = form.form.value.country;
      this.crm.updateEntity('accounts', this.accountEdit, this.accountidEditing)
        .subscribe(
          null,
          (error: any) => {
            this.toastr.error('Se ha producido un error al actualizar la cuenta', '¡Error!');
          },
          () => {
            this.fetchAccounts();
            this.editing = false;
            form.reset();
            this.flipped = false;
            this.toastr.success('Se ha actualizado la cuenta', '¡Éxito!');
            this.loading = false;
          }
        );
    }
  }

  fetchMore() {
    const len = this.contactsBuffer.length;
    if (len !== this.contactsLength) {
      this.loadingSelect = true;
      this.contactsSubscription = this.crm.getEntities('contacts', this.queryContacts + (50 + len))
        .subscribe(
          (resp: any) => {
            this.contacts = resp.value;
            this.contactsBuffer = this.contacts.slice(0, this.contacts.length);
          },
          null,
          () => { this.loadingSelect = false; }
        );
    }
  }

  ngOnDestroy(): void {
    this.contactsSubscription.unsubscribe();
    this.accountsSubscription.unsubscribe();
  }

  onEdit(row: any) {
    this.flipped = true;
    this.editing = true;
    this.form.form.patchValue({
      name: row.data.name,
      country: row.data.address1_country,
      city: row.data.address1_city
    });
    this.accountidEditing = row.data.accountid;
  }

}
