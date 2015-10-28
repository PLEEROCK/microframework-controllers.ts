/**
 * Configuration for mf-controllers.ts module.
 */
export interface ControllersTsModuleConfig {

    /**
     * List of directories where from controller classes will be loaded.
     */
    controllerDirectories?: string[];

    /**
     * Indicates if error console-logging is enabled or not. By default in controllers.ts it is enabled.
     */
    errorConsoleLoggingEnabled?: boolean;

}
