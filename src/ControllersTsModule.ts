import {Server} from "http";
import {ControllersTsModuleConfig} from "./ControllersTsModuleConfig";
import {ExpressModule} from "microframework-express/ExpressModule";
import {Module, ModuleInitOptions} from "microframework/Module";
import {ControllerRunner} from "controllers.ts/ControllerRunner";
import {ExpressHttpFramework} from "controllers.ts/http-framework-integration/ExpressHttpFramework";

/**
 * Controllers.ts module integration with microframework.
 */
export class ControllersTsModule implements Module {

    // -------------------------------------------------------------------------
    // Constants
    // -------------------------------------------------------------------------

    public static DEFAULT_CONTROLLER_DIRECTORY = 'controller';
    public static DEFAULT_INTERCEPTOR_DIRECTORY = 'interceptor';

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    private options: ModuleInitOptions;
    private configuration: ControllersTsModuleConfig;
    private mfExpressModule: ExpressModule;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private requireAll?: any) {
        if (!requireAll)
            this.requireAll = require('require-all');
    }

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
            return [this.getSourceCodeDirectory() + ControllersTsModule.DEFAULT_CONTROLLER_DIRECTORY];

        return this.configuration.controllerDirectories;
    }

    private getInterceptorDirectories(): string[] {
        if (!this.configuration || !this.configuration.interceptorDirectories)
            return [this.getSourceCodeDirectory() + ControllersTsModule.DEFAULT_INTERCEPTOR_DIRECTORY];

        return this.configuration.interceptorDirectories;
    }

    private setupControllers() {
        this.getInterceptorDirectories().map(directory => this.requireAll({ dirname: directory }));

        const controllerDirectories = this.getControllerDirectories().map(directory => this.requireAll({ dirname: directory }));
        const controllerRunner = new ControllerRunner(new ExpressHttpFramework(this.mfExpressModule.express));
        controllerRunner.container = this.options.container;

        if (this.configuration && this.configuration.errorConsoleLoggingEnabled !== undefined)
            controllerRunner.isLogErrorsEnabled = this.configuration.errorConsoleLoggingEnabled;
        if (this.configuration && this.configuration.errorConsoleLoggingEnabled !== undefined)
            controllerRunner.isStackTraceEnabled = this.options.debugMode;
        if (this.configuration && this.configuration.errorOverridingMap !== undefined)
            controllerRunner.errorOverridingMap = this.configuration.errorOverridingMap;
        if (this.configuration && this.configuration.defaultErrorHandler !== undefined)
            controllerRunner.defaultErrorHandler = require(this.getSourceCodeDirectory() + this.configuration.defaultErrorHandler).default;
        if (this.configuration && this.configuration.jsonErrorHandler !== undefined)
            controllerRunner.jsonErrorHandler = require(this.getSourceCodeDirectory() + this.configuration.jsonErrorHandler).default;

        controllerRunner.registerActions(controllerDirectories);
    }

    private getSourceCodeDirectory() {
        return this.options.frameworkSettings.srcDirectory + '/';
    }

}