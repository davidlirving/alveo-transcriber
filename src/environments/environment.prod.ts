export const environment = {
  production: true,

  alveoPaths: {
    mainUrl: 'https://app.alveo.edu.au',
    listSuffix: 'item_lists',
    itemSuffix: 'catalog',
    apiKeySuffix: 'account_api_key',
    oAuthTokenSuffix: 'oauth/token',
    loginSuffix: 'oauth/authorize',
    userDetails: '/account/get_details'
  },

  alveoTranscriberServices: {
    paths: {
      mainUrl: 'https://segmenter.apps.alveo.edu.au/alveo',
      segmenterSuffix: '/segment',
      objectGetSuffix: '/datastore/objects/',
      objectPostSuffix: '/datastore/objects',
      listSuffix: '/datastore/list/',
      listAllSuffix: '/datastore/listall/',
      exportSuffix: '/datastore/export/',
    },
    auth: 'app.alveo.edu.au'
  },

  clientID: 'e37df76b698449298761b34c14654ba871e694f81be42cac483c1dc8b529279e',
  clientSecret: '2b83c1b2382d0f76b62729af99a4dba64aac61dcf7827a4d5df60e98c1975055',

  callbackURL: window.location.origin + '/alveo-transcriber' + '/oauth/callback',

  devTools: true,
};
