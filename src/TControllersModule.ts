import {Server} from "http";
import {TControllersModuleConfig} from "./TControllersModuleConfig";
import {ControllerUtils} from "t-controllers/ControllerUtils";
import {defaultActionRegistry} from "t-controllers/ActionRegistry";
import {ExpressModule} from "microframework-express/ExpressModule";
import {Module, ModuleInitOptions} from "microframework/Module";

/**
 * T-Controllers module integration with microframework.
 */
export class TControllersModule implements Module {

    // -------------------------------------------------------------------------
    // Constants
    // -------------------------------------------------------------------------

    public static DEFAULT_CONTROLLER_DIRECTORY = 'controller';

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    private options: ModuleInitOptions;
    private configuration: TControllersModuleConfig;
    private mfExpressModule: ExpressModule;

    // -------------------------------------------------------------------------
    // Accessors
    // -------------------------------------------------------------------------

    getName(): string {
        return 'TControllersModule';
    }

    getDependentModules(): string[] {
        return ['ExpressModule'];
    }

    getConfigurationName(): string {
        return 't-controllers';
    }

    isConfigurationRequired(): boolean {
        return false;
    }

    init(options: ModuleInitOptions, configuration: TControllersModuleConfig, dependentModules?: Module[]): void {
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
            return [this.options.frameworkSettings.baseDirectory + '/' + TControllersModule.DEFAULT_CONTROLLER_DIRECTORY];

        return this.configuration.controllerDirectories;
    }

    private setupControllers() {
        ControllerUtils.requireAll(this.getControllerDirectories());
        defaultActionRegistry.container = this.options.container;
        defaultActionRegistry.registerActions(this.mfExpressModule.express); // register actions in the express app
    }

}