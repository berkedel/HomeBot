# HomeBot

This is a simple client for [Matrix](https://matrix.org/) which supports plugins.

## Setup

You have to edit the `config.js` to setup a configuration.

Run:
```
$ npm init
$ npm app
```

## Plugins

Put your plugin at `plugins` folder. And don't forget to include at your `app.js`. For example,

```
// TODO: include your plugin here
var DummyPlugin = require('./plugins/dummy');
var addPlugins = function() {
    // TODO: add your plugin
    plugins[DummyPlugin.name.toLowerCase()] = new DummyPlugin();
}
```