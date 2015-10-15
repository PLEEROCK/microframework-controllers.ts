# T-Controllers module for Microframework

Adds integration between [t-controllers](http://github.com/PLEEROCK/t-controllers) and 
[microframework](https://github.com/PLEEROCK/microframework).

## Usage

1. Install module:

    `npm install --save microframework-t-controllers microframework-express`

    This module depend on [microframework-express](https://github.com/PLEEROCK/microframework-express), so you need to 
    install it too.

2. Simply register module in the microframework when you are bootstrapping it.
    
    ```typescript
    
        import {MicroFrameworkBootstrapper} from "microframework/MicroFrameworkBootstrapper";
        import {ExpressModule} from "microframework-express/ExpressModule";
        import {TControllersModule} from "microframework-t-controllers/TControllersModule";
        
        new MicroFrameworkBootstrapper({ baseDirectory: __dirname })
            .registerModules([
                new ExpressModule(),
                new TControllersModule()
            ])
            .bootstrap()
            .then(result => console.log('Module is running. Open localhost:3000'))
            .catch(error => console.error('Error: ', error));
            
    ```

3. Now you can use [t-controllers](https://github.com/PLEEROCK/t-controllers) module in your microframework.

## Todos

* cover with tests
* add more docs