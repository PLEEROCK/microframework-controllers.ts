import {Server} from "http";
import {ControllersTsModuleConfig} from "./ControllersTsModuleConfig";
import {ControllerUtils} from "controllers.ts/ControllerUtils";
import {defaultActionRegistry} from "controllers.ts/ActionRegistry";
import {ExpressModule} from "microframework-express/ExpressModule";
import {Module, ModuleInitOptions} from "microframework/Module";

/**
 * Controllers.ts module integration with microframework.
 */
export class ControllersTsModule implements Module {

    // -------------------------------------------------------------------------
    // Constants
    // -------------------------------------------------------------------------

    public static DEFAULT_CONTROLLER_DIRECTORY = 'controller';

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    private options: ModuleInitOptions;
    private configuration: ControllersTsModuleConfig;
    private mfExpressModule: ExpressModule;

    // -------------------------------------------------------------------------
    // Accessors
    // -------------------------------------------------------------------------

    getName(): string {
        return 'ControllersTsModule';
    }

    getDependentModules(): string[] {
        return ['ExpressModule'];
    }

    getConfigurationName(): string {
        return 'controllers.ts';
    }

    isConfigurationRequired(): boolean {
        return false;
    }

    init(options: ModuleInitOptions, configuration: ControllersTsModuleConfig, dependentModules?: Module[]): void {
        this.options = options;
        this.configuration = configuration;
        this.mfExpressModule = <ExpressModule> dependentModules.reduce((found, mod) => mod.getName() === 'ExpressModule' ? mod : found, undefined);
    }

    onBootstrap(): Promise<any> {
        return Promise.resolve();
    }

    afterBootstrap(): Promise<any> {
        this.setupControllers();
        return Promise.resolve();
    }

    onShutdown(): Promise<any> {
        return Promise.resolve();
    }

    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------

    private getControllerDirectories(): string[] {
        if (!this.configuration || !this.configuration.controllerDirectories)
            return [this.options.frameworkSettings.baseDirectory + '/' + ControllersTsModule.DEFAULT_CONTROLLER_DIRECTORY];

        return this.configuration.controllerDirectories;
    }

    private setupControllers() {
        ControllerUtils.requireAll(this.getControllerDirectories());
        defaultActionRegistry.container = this.options.container;
        if (this.configuration && this.configuration.errorConsoleLoggingEnabled !== undefined)
            defaultActionRegistry.isLogErrorsEnabled = this.configuration.errorConsoleLoggingEnabled;

        defaultActionRegistry.registerActions(this.mfExpressModule.express); // register actions in the express app
    }

}