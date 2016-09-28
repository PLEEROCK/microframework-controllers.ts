/**
 * Configuration for mf-routing-controllers module.
 */
export interface RoutingControllersModuleConfig {

    /**
     * Routing-controllers driver type. Can be express or koa. By default is express.
     */
    driver?: "express"|"koa";

    /**
     * List of directories where from controller classes will be loaded.
     */
    controllers?: string[];

    /**
     * List of directories where from middleware classes will be loaded.
     */
    middlewares?: string[];

    /**
     * List of directories where from interceptor classes will be loaded.
     */
    interceptors?: string[];

    /**
     * Indicates if default routing-controller's error handler is enabled or not. By default its enabled.
     */
    defaultErrorHandler?: boolean;

    /**
     * Represents map that overrides some properties of handled errors.
     */
    errorOverridingMap?: any;

    /**
     * Represents array of http codes and errors that must have each http code.
     */
    errorOverridingArray?: any;

}
