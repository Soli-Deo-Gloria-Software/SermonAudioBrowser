# Sermon Audio Client
This is a simple front end client app to assist in querying the sermon audio api and displaying them in a native website for a church.

## Usage
Since this client is a front end angular app, it does not handle Sermon Audio API authentication. This is to prevent the exposure of your token to potential attackers on the internet. The developer is also creating a proxy API for WordPress that can be used in conjunction with this client app that will handle injecting the authentication in the final request to Sermon Audio. The repo will be linked here when made public.

If you are not using the Word Press plugin, users of this client will be responsible for providing secure access to Sermon Audio on their own.

### Linking the client app to your proxy server
If you are using this client app in conjunction with the word press proxy plugin, no further setup should be necessary. If you are using the client app with a custom proxy, you should override the proxy api settings in a dedicated environment file before bundeling the application. If you are able to develop your environment in such a way as to be accessible by local server path, you may check in the environment to this repo. Pull requests containing environments with hard coded server urls will not be accepted to this repository.

## Building the app
This is an angular app, so you will need node js and the angular cli to build the client app. Once installed, navigate to the root directory for this repo and run `npm i` to install all dependencies. After that process finishes, run `ng build --configuration [environment]`. The output will be placed in the dist folder. Copy these files to your site and reference the files as needed.

### Supported Environments Are:
* Wordpress - for use with the wordpress plugin providing proxy apis at /wp-json

# Supported Scripture Translations
By preference, the developer has created this application based on the esv api. It is recommended that different scripture translations be handled by the proxy apis to keep this application as simple as possible. This would involve creating or using some form of standardized api response which proxies would then implement regardless of back-end translation selections. In the event that a user selectable scripture translation is desired, we should still leverage most of the logic on the proxy side to keep the client as simple as possible; however, we would also need to add an api to allow users to know which translations are available as the individual users of the plugin may not have api keys for different scripture versions. Doing it this way will allow for new scripture versions to be added simply by changing the server side code instead of needing to navigate dependencies between the 2+ code repositories.
