// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  ad: {
    tenant: 'f8566acf-0bd7-4308-b436-ffd36e862087',
    clientId: 'dd7365f6-cb2a-4cc2-8297-f9860ebb8879',
    redirectUri: window.location.origin,
    crm: 'https://valyrian.api.crm.dynamics.com/api/data/v9.0/',
    endpoints: {
      'crm' : 'https://valyrian.api.crm.dynamics.com'
    },
    navigateToLoginRequestUrl: false,
    cacheLocation: 'localStorage',
    resource: 'https://valyrian.api.crm.dynamics.com'
  }
};

/*
 * In development mode, for easier debugging, you can ignore zone related error
 * stack frames such as `zone.run`/`zoneDelegate.invokeTask` by importing the
 * below file. Don't forget to comment it out in production mode
 * because it will have a performance impact when errors are thrown
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
