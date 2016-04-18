/**
 * Configuration for mf-routing-controllers module.
 */
export interface RoutingControllersModuleConfig {

    /**
     * List of directories where from controller classes will be loaded.
     */
    controllerDirectories?: string[];

    /**
     * List of directories where from interceptor classes will be loaded.
     */
    interceptorDirectories?: string[];

    /**
     * Indicates if error console-logging is enabled or not. By default in routing-controllers it is enabled.
     */
    errorConsoleLoggingEnabled?: boolean;

    /**
     * Represents map that overrides some properties of handled errors.
     */
    errorOverridingMap: any;

    /**
     * Represents array of http codes and errors that must have each http code.
     */
    errorOverridingArray: any;

    /**
     * Path to exported function that implements default error handling on its own.
     */
    defaultErrorHandler: any;

    /**
     * Path to exported function that implements json error handling on its own.
     */
    jsonErrorHandler: any;

}
