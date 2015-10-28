# Controllers.ts module for Microframework

Adds integration between [controllers.ts](http://github.com/PLEEROCK/controllers.ts) and 
[microframework](https://github.com/PLEEROCK/microframework).

## Usage

1. Install module:

    `npm install --save microframework-controllers.ts microframework-express`

    This module depend on [microframework-express](https://github.com/PLEEROCK/microframework-express), so you need to 
    install it too.

2. Simply register module in the microframework when you are bootstrapping it.
    
    ```typescript
    
        import {MicroFrameworkBootstrapper} from "microframework/MicroFrameworkBootstrapper";
        import {ExpressModule} from "microframework-express/ExpressModule";
        import {ControllersTsModule} from "microframework-controllers.ts/ControllersTsModule";
        
        new MicroFrameworkBootstrapper({ baseDirectory: __dirname })
            .registerModules([
                new ExpressModule(),
                new ControllersTsModule()
            ])
            .bootstrap()
            .then(result => console.log('Module is running. Open localhost:3000'))
            .catch(error => console.error('Error: ', error));
            
    ```

3. Now you can use [controllers.ts](https://github.com/PLEEROCK/controllers.ts) module in your microframework.

## Todos

* cover with tests
* add more docs