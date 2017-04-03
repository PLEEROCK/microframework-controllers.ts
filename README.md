> This repository is deprecated. Microframework architecure has changed. Please consider writing your own module for a newer versions of microframework.

# routing-controllers module for Microframework

Adds integration between [routing-controllers](http://github.com/pleerock/routing-controllers) and
[microframework](https://github.com/pleerock/microframework).

## Usage

1. Install module:

    `npm install --save microframework-routing-controllers microframework-express`

    This module depend on [microframework-express](https://github.com/pleerock/microframework-express), so you need to
    install it too.

2. Simply register module in the microframework when you are bootstrapping it.
    
    ```typescript
        import {MicroFrameworkBootstrapper} from "microframework/MicroFrameworkBootstrapper";
        import {ExpressModule} from "microframework-express/ExpressModule";
        import {RoutingControllersModule} from "microframework-routing-controllers/RoutingControllersModule";
        
        new MicroFrameworkBootstrapper({ baseDirectory: __dirname })
            .registerModules([
                new ExpressModule(),
                new RoutingControllersModule()
            ])
            .bootstrap()
            .then(result => console.log('Module is running. Open localhost:3000'))
            .catch(error => console.error('Error: ', error));
    ```

3. ES6 features are used, so you may want to install [es6-shim](https://github.com/paulmillr/es6-shim) too:

    `npm install es6-shim --save`

    you may need to `require("es6-shim");` in your app.

4. Now you can use [routing-controllers](https://github.com/pleerock/routing-controllers) module in your microframework.

## Todos

* cover with tests
* add more docs
