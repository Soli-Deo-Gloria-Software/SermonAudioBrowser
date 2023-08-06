# SermonAudioClient

This project is to hopefully provide an easily customizable way to add sermon audio sermons to any website via sermon audio api via and an angular client app.

## Currently Supported Scripture Versions:
ESV

## securing api keys
Since Sermon Audio api keys provide full read and write access to the API, best practice is to implement a proxy api to inject your api key from a securely stored source, therefore preventing your key from leaking from the client app source. If instead, you wish to host your api key directly on the client app, be warned that you will also need to overcome CORS restrictions on SermonAudio's end. If you still desire to directly implement an api key in the client app, you may modify this app, but this is left as an exercise to the implementer and no PRs for such a modification will be accepted to this repository. I am not responsible for any security implications of such modifications.

For those running WordPress, I have implemented one such api proxy for that platform that uses this application. Once I am ready to open source that project, I will link it's repository here.

## Customizing the ui
This tool is built bootstrap (ng-bootstrap, in particular) and is running version 5. Those familiar with Bootstrap can easily apply their knowledge to customize this tool extensively by overriding the bootstrap classes. For those that don't know bootstrap, we have implemented a very small subset of their tools to make customization easy. We have primarily implemented the light, primary, and secondary colors to make color overrides easy and consistent. Those simply wishing to make the colors consistent with their apps only need to override the following classes:

* btn-primary
* btn-light
* bg-secondary


