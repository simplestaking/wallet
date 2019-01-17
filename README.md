# Tezos wallet with Trezor integration - Simplestaking.com

[Simplestaking](https://simplestaking.com/) is [Tezos](http://tezos.com/) focused wallet existing as web application and desktop electron based app with support for hardware [Trezor](https://trezor.io/) device. 
Wallet is created using Angular framework and NgRx state management.

## Bugs
For bugs please create issue in the repository. Best is to attach console dump to issue description.

## Development

Clone repository locally and install dependencies

````
npm install
````

Start watch mode of Angular CLI with local server running on *localhost:5200*

````
npm start
````

Before commit run build in AOT mode to ensure that application can pass production build.

## Unit Testing
Unit tests are implemented using Angular TestBed and Karma test runner.
In order to run tests use

```
npm test
```

# Local Testing

In order to test the application you will need the [**Trezor Model T**](https://shop.trezor.io/product/trezor-model-t) hardware wallet or to run the emulator.

Please note that Trezor One is not supporting Tezos currency.

Connection between application and Trezor is managed by [Trezor Connect](https://github.com/trezor/connect) communication middleware which need to run locally.

Additionally if other browser then Chrome is used a [Trezor Bridge](https://wallet.trezor.io/#/bridge) needs to be installed on the machine.
Chrome allows to skip this step as it implements WebUSB API which allows to directly comminicate with Trezor device.

Trezor Bridge is required in case of using emulator instead of physical device.

### Running Trezor connect server

1. Clone project

```
git clone https://github.com/trezor/connect.git
```

2. Install dependencies

```
npm install
```

3. Build project and run server

```
npm run dev
```

Trezor connect will create local server on *https://localhost:8088* by default. 
If port needs to be changed you can modify port in build configuration ``/webpack/constants.js``

Recomended it to modify connection to insecure **http** for local development to avoid invalid certificates.
Do that in ``/webpack/config.dev.babel.js`` by changing *devServer.https* property to false.

## Running Trezor Bridge

This step is straightforward.

On **Windows** install the deamon and it will start service automatically.

On Linux you can use appropriate packages. 

If this do not work, you can compile the project directly from source code following instruction at https://github.com/trezor/trezord-go.

In order to run Trezor Bridge with emulator you will have to disable USB detection in Trezor Bridge by running it with parameters as

```
trezord -e 21324 -u=false
```


## Emulating trezor device

In case you do not own physical device you can emulate one. This can be recently done only in Linux and Mac OS X operating systems.
More details are available in repository - https://github.com/trezor/trezor-core/blob/master/docs/emulator.md

Short tutorial:

1. Clone git project
```
git clone https://github.com/trezor/trezor-core.git
cd trezor-core
```

2. Refresh submodules 

```
make vendor
```

3. Install required dependencies
See https://github.com/trezor/trezor-core/blob/master/docs/build.md as it depends on OS

4. Build

```
make build_unix
```

5.  Run the emulator
```
.\emu.sh
```

After starting the emulator you will need to either create new wallet or recover wallet using seed passphrases.
Follow instruction on display of the device and visit https://trezor.io/start/

## Building Electron application

Before building desktop version of the application you need to install extra dependencies required for packaging with elektron.

1. Change directory

```
cd electron
```

2. Install required dependencies

```
npm i
```

Now we can proceed to building the application


1. Build Angular application for electron release under project root

```
npm run build:electron
```

This creates folder with resulting Angular build in folder ``/electron/src/dist``

2. Change folder to electron and build electron application

```
cd electron
npm run build
```

You can find executables and installer in the release folder ``/electron/releae/``