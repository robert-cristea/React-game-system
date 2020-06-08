Update: July 3, 2018

[Change Log](CHANGELOG.md)

# TurboPlay Frontend

TurboPlay ElectronJS, React based Frontend

The TurboPlay frontend is provided as part of our OpenSource initiative at TurboPlay Corporation. This source code is
released under the Apache2 license. We will update this source code when we see fit.

# Disclaimer

## Alpha

TurboPlay and all of its systems are under heavy active development and we strongly advise against using these systems
in production at this time.

# App

The App ("app") consists of the following core components:

* Home
* Store
* Messaging
* Live Events
* Profile
* Wallet

## Alpha Interface

`![TurboPlay Interface](screens/screen1.PNG)`

# Limited Online Demo

[TurboPlay Demo](http://demo.turboplay.com)

# Desktop dApp Demo

Our e3 demo closes the 'ecommerce' loop essentially the basic ability to register, login, shop, communicate, buy,
download, install, and play games was completed as part of our e3 demo in 2018.

# Technology Stack

The technology stack includes the following:

Client App

* Node.js
* ElectronJS (App Rendering/Logic Threading)
* React (App Rendering)
* Phoenix Framework (Messaging)
* Bitraider Framework (Distribution, Downloading, Streaming)

Developer App

* Bitraider (Uploading, Distribution, Versoning, Streaming)
* Elixir Web App (Developer Administrator)

Server

* eWallet Backend API (Account/Ledger/Transactions/Tracking)
* Gamer API Backend (Store, Games, Stats)
* EVM Backend (Payment processing via EVM. DEX, Fiat)

Decentralized

* Peer Swarm (DHT based Game Related Data)
* IPFS Filesystem (Store Images, Avatars, Game Packages)

Databases

* Apache Cassandra (Players, Achievements, Stats)
* Postgresql (Accounts, Transactions, Ledger)

Third party web APIs

* Twitch API (Streaming)
* YouTube API (Streaming)
* ESL API (eSports)

# Development

* Install node modules `yarn install`
* If required, copy and rename `etc/env.dev.sample.js` to `etc/env.dev.js` and modify accordingly (read below for custom
	configurations and mock API). If you want to use the default code in this file, you will want to copy and rename
	`src/js/mock/mockData.sample.js` to `mockData.js`.
* Run `yarn web`
* Visit [localhost:3000](http://localhost:3000)

## Custom configurations

The app has a list of configurations in `src/js/config.js`. This file is committed so you must not modify it with values
specific to your environment. But you can overwrite any of those configurations in an env file: copy (do not simply
rename, copy and rename) `etc/env.dev.sample.js` to `etc/env.dev.js` (remove .sample) and you can overwrite any
configuration of `config.js` in the `config` attribute of the env file. This (renamed) file is already in the
`.gitignore` and must not be committed.

In the future, the environment configuration file (the "env file") to use will be passed directly to the NPM (Yarn)
command line instead of being defined in the webpack configuration. See the related task in the "General TODO" below.

## Services

The code uses the Inverse of Control pattern with a service container. For example, the class responsible to communicate
with the API, `js/app/Server/ApiServer` is a service that is requested by classes that need it. The services are defined
in the config, in the `services` attribute. Since the services are defined in the config, they can be replaced with mock
classes in a development environment. Some mock classes are already created:

### Mock server

A MockServer class is included in the code allowing you to bypass the real API. You can replace the regular ApiServer
instance in the 'server' service with the MockServer. The default `etc/env.dev.sample.js` contains code showing how to
use the MockServer. In you custom `etc/env.dev.js` file, use the commented code in the sample file.

This MockServer receives an object describing the data it contains. A file with sample data is provided in
`src/js/mock/mockData.sample.js`. If you use the default code in `etc/env.dev.sample.js`, it loads a `mockData.js` file.
Simply copy and rename `src/js/mock/mockData.sample.js` to `mockData.js` (remove .sample). This (renamed) file is
already in `.gitignore` so you can modify it as you wish.

### Mock conversation socket

When in a conversation, a web socket is used to have real time exchange. Just like the Mock server comment above, this
socket is a service that can be overwritten in the env file. The sample env file has code for a mock socket.

This mock socket can be used to trigger events. When using the mock socket, go in any conversation and send the "help"
message. You will receive a list of messages you can send to trigger some events. For example, if you send the
"typingStarted 0" message, it will simulate the user with index 0 (in the conversation) starting typing.

## Live update (web socket)

The main functionnality not yet developed is a web socket that will listen to the server for any live update of data.
When new data will be received from the server (new message, new friend request, new game available, etc.) a specific
class (not yet created) will update instances and attributes. See the comment about Mobx below.

The messaging part of the application is an example of how the web socket and Mobx (see below) can be used.

## Mobx and React state

The Mobx library (and Mobx React) is used to propagate updates to objects. Full documentation here: http://mobx.js.org/
(and https://github.com/mobxjs/mobx-react).

But in a few words, Mobx is used mainly in this app to make some objects' (instances)attributes 'observable', so that
'observer' React components update automatically when those attributes change. For example, the list of friend requests
in `ReceivedFriendRequestRepository` is observable and the component listing the number of friend requests observes it.
When the "live update" feature will be developed (see above), it will be responsible to add friend requests in this
array when they are added on the server. Components observing this list will be updated automatically.

Also, in React components, Mobx (specifically `mobx-react`) is used instead of the default React state concept. So
instead of using a state object and calling `setState()` to update the state, 'observable' instance attributes are
defined in 'observer' React components. Any update to those attributes will automatically trigger an update of the
component (works just like updating the state). It is as efficient as using the regular state concept. Example:

```jsx harmony
import { observable } from 'mobx';
import { observer } from 'mobx-react';

@observer
class MyComponent extends React.Component {
    @observable
    loading = false;

    handleLoading = () => {
        this.loading = true;
    };

    render() {
        return (
            <div>
                <div>{this.loading ? 'Loading' : 'Not loading'}</div>
                <button onClick={this.handleLoading}>Start loading</button>
            </div>
        );
    }
}
```

### `inject()`

Mobx React can also be used as a global state manager for components (a little bit like Redux). In the the
`initStores()` of the `UI` class are defined 'stores' that can be injected in React Component with the `@inject()`
decorator. The injected object will be available in the `props` object. The services (see the 'Services' section) are
available to inject (new ones must be added manually to the `initStores()` method). For example:

```jsx harmony
import { inject } from 'mobx-react';

@inject('auth')
class MyComponent extends React.Component {
    someMethod() {
        const authService = this.props.auth;
    }
}
```

## Accessing the current user in a React container

You can inject the `auth` service to retrieve the current user with `this.props.auth.getUser()`. But be careful, if the
user is logged out, this call returns null. Since when the user is logged out (the user clicks "Log out" for example),
she/he will be redirected to the login, which may trigger a re-render of your component. So in this re-render,
`this.props.auth.getUser()` will return null, which may cause errors if you try to access properties of the connected
user. One way to prevent errors is to keep a reference to the connected user (when mounting the component, for example)
instead of requesting it at each render.

Example:

```jsx harmony
@inject('auth')
@observer
class MyContainer extends React.Component {
    componentWillMount() {
        this.user = this.props.auth.getUser();
    }

    render() {
        return <OtherComponent user={this.user} />;
    }
}
```

## API, Requested attributes and lazy loading

API requests retrieving objects (games, users, friends, etc.) pass a list of required attributes. Objects returned by
the API will have only the requested attributes. This is to relieve the API from calculating some attributes when they
are not required and to limit data transfered (for example, the application needs the game description only in the
store, so why pass it every time we need a game object).

Since you should expect a unique instance to every object (for example, the same user returned by different requests
will be the same User instance in the app), you may sometimes need to 'fill' missing attributes to an object you already
have. Instances thus generally have a `fill()` method to which you pass the required attributes.

You should not assume that an instance has an attribute, you should always fill it before using it (`fill()` methods
return a Promise instance).

## Uniqueness of instances and cached data

Every object on the server is represented by a unique instance. So if you request data about a specific user, and later
on want to retrieve the same user, the same instance should be expected. Repository classes already take care of this
concept (so if you retrieve a list of user and then retrieve a list of friends and both results contain the same user,
you can expect it will be the same instance).

This is possible because of an internal cache system. But, it is also possible to tell the repository classes to NOT
cache results received from the API (for example, pass `false` as the third parameter to the `load()` method of
`ReceivedFriendRequestRepository`). This can be useful when, for any reason (to save memory, for example), the returned
data should not be cached. For example, a request to get the store front page may return dozens of games, but since this
data is used only on this screen, we can save memory by not caching this data (another request to the front page would
re-load again from the server). But since the returned objects are not cached, it may not respect the uniqueness of
instances: if you request a list of games without caching them and then do the same request, the same games will be
represented by different instances. So you should treat those instances as immutable instances: updates to them will not
be reflected on other instances.

NOTE: until the "live update" feature is developed, it may be required to not cache data, because it is the only way to
"reload" data. Once "live update" is implemented, data caching should be reinstated.

## Difference between `load...()` and `retrieve...()` methods

Some repository classes have both a `load()` and `retrieve()` method.

* `load()` will return a cached instance if already has all the requested attributes. Else it will query the API. This
	method returns a promise that resolves once the instance is loaded. This instance will be cached.
* `retrieve()` returns an already cached object. If the object is not already loaded, `null` is returned.

## `src/js/mock` folder

When the first prototype was developed, false data were created and stored in JS objects in the `src/js/mock` folder.
Those mock objects were instances of `src/js/mock/MockObject`. As different sections of the app are updated to use data
from the API, the now useless mock data files are removed from this folder.

Once the transition to the API is finished, this folder will not contain any more mock data and the `MockObject` class
will be removed.

Mock classes will also be eventually removed, except the following that can be used to mock some services (see above for
description of those classes):

* `MockConversationSocketConnector`
* `MockServer`

## React source folder structure

The code follows the "React components and containers" pattern. The React classes are in the `src/js/containers/` and
`src/js/components/` folders. As much as possible a container will have the same name and same relative path as the main
component it includes. It is possible to have a component without a container, a container including multiple
components, a component including a container.

The React elements rendering the different screens are found in `js/containers/screens/`, so this folder is a good place
to look to dig deeper in the components hierarchy of a screen. The `groups/` folder contains containers rendering a list
of sub screens (example: the Home container rendering the 'Home' section menu and all the sub-pages). The `routes/`
folder contains containers rendering specific screens (ex: the user's friends list).

## Token values and BigNumber class

Token values (game prices, user balances, etc.) are represented in "Wei" units which is 1x10^-18 Ether. JavaScript does
not support this precision so all token values are represented by BigNumber classes. Also, token values are sent and
received as strings when communicating with the API.

## ES6 and Lodash

ES6 is used. Lodash is a library containing multiple useful utilities. But if a Lodash utility can be easily recreated
with the new ES6 syntax, ES6 should be used. If the ES6 syntax would be more complicated that the Lodash equivalent,
Lodash should be used.

See here for ES6 equivalents of some Lodash functions: https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore

## `android/` and , `ios` folders

The project was started as a React Native project, but it was changed to a web only application. This is why those two
folders are still present. I guess they should be removed...

## General TODO

## Passing Configuration to Scripts

You can pass env configurations to `web`, `build-web` and `build-electron` scripts by combining the `:pre` and `:post`
parts of the original script and passing the `--env.config=env-file.js` to the first one. For example you can run
`build-web` with staging env configuration like this:

```
$ yarn build-web:pre --env.config=etc/env.staging.js && yarn build-web:post
```

# WEB BUILD

* `yarn build-web`
* The generated files will be in `web/dist/`.

# ELECTRON TEST

To test (_not_ to build) how the application looks in Electron.

* `yarn web` (wait until "webpack: Compiled successfully.") and keep it running
* In parallel, run `export ELECTRON_START_URL=http://localhost:3000 && yarn electron`
* You can show the developer tools with in the "View" menu.

# ELECTRON BUILD

The following instructions differentiate between the "building machine" (the computer that will build the code) and the
"running machine" (the computer that will run the application in Electron). Of course, they can be the same machine.

1. On the _building machine_, install all node modules required to build the application. `yarn install`
2. Build the files necessary for the Electron app with `yarn build-electron`.
3. The generated files will be created in `electron/build/`
4. There are two ways to create the package, via `yarn dist` and `yarn package-win`. These are scripts that uses
	`electron-builder` and `electron-packager` respectively.
5. On the _running machine_, you can copy the `dist/win-unpacked/` or `release-builds/tokenplay-win32-x64/`.
6. Run the Electron executable in [electron-folder] (ex, on Windows, double click `[electron-folder]/TokenPlay.exe`).
7. You can create a shortcut to `[electron-folder]/TokenPlay.exe`, put it on the desktop, rename it (like "TokenPlay")
	and even change its icon to give it a more "official" look.
8. Or you can use the installer `dist/TokenPlay Setup 0.1.0.exe` which will create the shortcut link for you
	automatically.

# #TABLET PROTOTYPE

Suggestion for running the prototype on an Android tablet

* After building the app (`yarn build-web`), take the files in `dist/` and upload them to the tablet.
* Install, on the Android tablet, a "full screen browser" (I tried "Fully Kiosk Browser" and it worked well). If using
	Fully Kiosk Browser, update your device's Chrome application to the latest version.
* Open, from the browser, the local file. Fully Kiosk Browser has a convenient "select file" when specifying the URL to
	load.
* If using Fully Kiosk Browser settings, go to Web Content Settings and toggle off "Autoplay Videos". Toggle on "Enable
	Fullscreen Videos".
