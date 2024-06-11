// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

const settings = {
  'clientId': 'a2a133fe-7b78-4ecd-a620-17c99013fba1',
  'clientSecret': 'YOUR_CLIENT_SECRET_HERE_IF_USING_APP_ONLY',
  'tenantId': 'YOUR_TENANT_ID_HERE_IF_USING_APP_ONLY',
  'authTenant': 'common',
  'graphUserScopes': [
    'user.read',
    'mail.read',
    'mail.send'
  ]
};

module.exports = settings;
