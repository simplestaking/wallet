export const environment = {
  production: false,
  type: 'web',
  firebase: {
    apiKey: "AIzaSyBuVlOS05MaREe3cK0eycmd68nYr448Th4",
    authDomain: "wallet-dd9dc.firebaseapp.com",
    databaseURL: "https://wallet-dd9dc.firebaseio.com",
    projectId: "wallet-dd9dc",
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
    transportReconnect: true // true
  },
  nodes: 'main'
};