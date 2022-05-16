// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase:{
    apiKey: "AIzaSyDNQUmbjLe0AhWUIa7rFrLkJ0wd70hUmmg",
    authDomain: "ng6-fire-shop.firebaseapp.com",
    databaseURL: "https://ng6-fire-shop.firebaseio.com",
    projectId: "ng6-fire-shop",
    storageBucket: "ng6-fire-shop.appspot.com",
    messagingSenderId: "764340205876",
    appId: "1:764340205876:web:eb5cac13271f47a1018d61"
  },
  stripe: {
    key: 'pk_test_t3TlEiLNNPUtGTVSHydYphVl'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
