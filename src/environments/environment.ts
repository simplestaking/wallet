// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyBuVlOS05MaREe3cK0eycmd68nYr448Th4",
    authDomain: "wallet-dd9dc.firebaseapp.com",
    databaseURL: "https://wallet-dd9dc.firebaseio.com",
    projectId: "wallet-dd9dc",
    storageBucket: "wallet-dd9dc.appspot.com",
    disableNetwork: true
  },
  trezor: {
    transportReconnect: true // true
  },
  nodes: 'main'
};

// export const environment  = {
//   production: false,
//   firebase: {
//     apiKey: "AIzaSyAzA_HaF5PiNGji3qcqfoQFPosPvK9R3Ls",
//     authDomain: "simplestakingcom-58d45.firebaseapp.com",
//     databaseURL: "https://simplestakingcom-58d45.firebaseio.com",
//     projectId: "simplestakingcom-58d45",
//     storageBucket: "simplestakingcom-58d45.appspot.com",
//     disableNetwork: false
//   },
//   trezor: {
//     transportReconnect: false // true
//   },
//   nodes: 'zero'
// };