// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  ad: {
    tenant: '5b2186b8-0f12-4122-90d9-d1517454250b',
    clientId: '6d57b947-47cd-4eda-9e5a-e7afae515349',
    redirectUri: window.location.origin,
    crm: 'https://etherium0.api.crm.dynamics.com/api/data/v9.0/',
    endpoints: {
      'crm' : 'https://etherium0.api.crm.dynamics.com'
    },
    navigateToLoginRequestUrl: false,
    cacheLocation: 'localStorage',
    resource: 'https://etherium0.api.crm.dynamics.com'
  }
};

/*
 * In development mode, for easier debugging, you can ignore zone related error
 * stack frames such as `zone.run`/`zoneDelegate.invokeTask` by importing the
 * below file. Don't forget to comment it out in production mode
 * because it will have a performance impact when errors are thrown
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
