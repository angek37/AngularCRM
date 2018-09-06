import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'nb-home',
    link: '/pages/dashboard',
    home: true,
  },
  {
    title: 'Módulos',
    group: true,
  },
  {
    title: 'Ventas',
    icon: 'nb-bar-chart',
    expanded: true,
    children: [
      {
        title: 'Cuentas',
        link: '/pages/cuentas',
      },
      {
        title: 'Contactos',
        link: '/pages/contactos',
      },
    ],
  }
];
