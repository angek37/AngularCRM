import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import {CrmService} from '../../services/crm.service';
import {NbThemeService} from '@nebular/theme';
import {Subscription} from 'rxjs/index';

@Component({
  selector: 'ngx-smart-table',
  templateUrl: './cuentas.component.html',
  styleUrls: ['./cuentas.component.scss']
})
export class CuentasComponent implements OnInit {
  flipped = false;
  settings = {
    mode: 'external',
    actions: {
      edit: false
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
  settingsBtn: Array<any>;
  themeSubscription: Subscription;


  constructor(private crm: CrmService, private themeService: NbThemeService) {
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
