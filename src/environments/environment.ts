// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyCCl5_LA_avkzcW4UkK9s2SwwSvjXNwpOs",
    authDomain: "meteomixx.firebaseapp.com",
    databaseURL: "https://meteomixx.firebaseio.com",
    projectId: "meteomixx",
    storageBucket: "meteomixx.appspot.com",
    messagingSenderId: "243848080073"
  }
};
