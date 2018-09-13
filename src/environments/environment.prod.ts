/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
export const environment = {
  production: true,
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
