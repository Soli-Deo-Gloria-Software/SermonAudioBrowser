// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --configuration` replaces `environment.ts` with `environment.[Environment].ts`.
// The list of file replacements can be found in `angular.json`.
// Current supported environments:
//     wordpress - for use with the wordpress plugin providing proxy apis at /wp-json

//TODO: remove CCOPC when moving to public repo.
export const environment = {
  production: false,
  proxySermonApi: 'https://ccopc.org/wp-json/sermon-audio/v1',
  proxyEsvApi: 'https://ccopc.org/wp-json/scripture/v1'
};