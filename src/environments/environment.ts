// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

// export const environment = {
//   production: false,
//   type: 'web',
//   firebase: {
//     apiKey: "AIzaSyBuVlOS05MaREe3cK0eycmd68nYr448Th4",
//     authDomain: "wallet-dd9dc.firebaseapp.com",
//     databaseURL: "https://wallet-dd9dc.firebaseio.com",
//     projectId: "wallet-dd9dc",
//     storageBucket: "wallet-dd9dc.appspot.com",
//     disableNetwork: true
//   },
//   trezor: {
//     connectSrc: 'https://connect.trezor.io/6/',
//     frame_src: 'https://connect.trezor.io/6/iframe.html',
//     popup_src: 'https://connect.trezor.io/6/popup.html',
//     popup: true,
//     trustedHost: true,
//     webusb: false,
//     debug: true,
//     transportReconnect: true // true
//   },
//  testing: true,
//   nodes: 'main'
// }

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyBO4RcR63Kqnxpm41uFDJ6mxU4MZnbPEKw",
    authDomain: "wallet-test-2690a.firebaseapp.com",
    databaseURL: "https://wallet-dd9dc.firebaseio.com",
    projectId: "wallet-test-2690a",
    storageBucket: "wallet-dd9dc.appspot.com",
    disableNetwork: true
  },
    trezor: {
    connectSrc: 'https://connect.trezor.io/6/',
    frame_src: 'https://connect.trezor.io/6/iframe.html',
    popup_src: 'https://connect.trezor.io/6/popup.html',
    popup: true,
    trustedHost: true,
    webusb: false,
    debug: true,
    transportReconnect: false // true
  },
  nodes: 'zero',
  testing: true
};