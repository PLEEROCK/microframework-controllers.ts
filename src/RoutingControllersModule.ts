import * as fs from "fs";
import {Server} from "http";
import {RoutingControllersModuleConfig} from "./RoutingControllersModuleConfig";
import {ExpressModule} from "microframework-express/ExpressModule";
import {Module, ModuleInitOptions} from "microframework/Module";
import {ControllerRegistrator} from "routing-controllers/ControllerRegistrator";
import {ExpressServer} from "routing-controllers/server/ExpressServer";

/**
 * Controllers.ts module integration with microframework.
 */
export class RoutingControllersModule implements Module {

    // -------------------------------------------------------------------------
    // Constants
    // -------------------------------------------------------------------------

    public static DEFAULT_CONTROLLER_DIRECTORY = "controller";
    public static DEFAULT_INTERCEPTOR_DIRECTORY = "interceptor";

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    private options: ModuleInitOptions;
    private configuration: RoutingControllersModuleConfig;
    private mfExpressModule: ExpressModule;

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    constructor(private requireAll?: any) {
        if (!requireAll)
            this.requireAll = require("require-all");
    }

    // -------------------------------------------------------------------------
    // Accessors
    // -------------------------------------------------------------------------

    getName(): string {
        return "RoutingControllersModule";
    }

    getDependentModules(): string[] {
        return ["ExpressModule"];
    }

    getConfigurationName(): string {
        return "routing-controllers";
    }

    isConfigurationRequired(): boolean {
        return false;
    }

    init(options: ModuleInitOptions, configuration: RoutingControllersModuleConfig, dependentModules?: Module[]): void {
        this.options = options;
        this.configuration = configuration;
        this.mfExpressModule = <ExpressModule> dependentModules.reduce((found, mod) => mod.getName() === "ExpressModule" ? mod : found, undefined);
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
            return [this.getSourceCodeDirectory() + RoutingControllersModule.DEFAULT_CONTROLLER_DIRECTORY];

        return this.configuration.controllerDirectories.reduce((allDirs, dir) => {
            return allDirs.concat(require("glob").sync(this.getSourceCodeDirectory() + dir));
        }, [] as string[]);
    }

    private getInterceptorDirectories(): string[] {
        if (!this.configuration || !this.configuration.interceptorDirectories)
            return [this.getSourceCodeDirectory() + RoutingControllersModule.DEFAULT_INTERCEPTOR_DIRECTORY];

        return this.configuration.interceptorDirectories.reduce((allDirs, dir) => {
            return allDirs.concat(require("glob").sync(this.getSourceCodeDirectory() + dir));
        }, [] as string[]);
    }

    private setupControllers() {
        this.getInterceptorDirectories()
            .filter(directory => fs.existsSync(directory))
            .map(directory => this.requireAll({ dirname: directory, recursive: true }));

        const controllerDirectories = this.getControllerDirectories()
            .filter(directory => fs.existsSync(directory))
            .map(directory => this.requireAll({ dirname: directory, recursive: true }));

        const controllerRunner = new ControllerRegistrator(new ExpressServer(this.mfExpressModule.express));
        controllerRunner.container = this.options.container;

        if (this.configuration) {

            if (this.configuration.errorOverridingArray !== undefined) {
                if (!controllerRunner.errorOverridingMap)
                    controllerRunner.errorOverridingMap = {};

                Object.keys(this.configuration.errorOverridingArray).forEach(httpCodeKey => {
                    this.configuration.errorOverridingArray[httpCodeKey].forEach((errorName: string) => {
                        // todo: fix any usage later
                        (<any>controllerRunner.errorOverridingMap)[errorName] = { httpCode: httpCodeKey };
                    });
                });
            }

            if (this.configuration.errorOverridingMap !== undefined) {
                if (!controllerRunner.errorOverridingMap)
                    controllerRunner.errorOverridingMap = {};

                controllerRunner.errorOverridingMap = this.configuration.errorOverridingMap;
            }

            if (this.configuration.errorConsoleLoggingEnabled !== undefined)
                controllerRunner.isLogErrorsEnabled = this.configuration.errorConsoleLoggingEnabled;
            if (this.configuration.errorConsoleLoggingEnabled !== undefined)
                controllerRunner.isStackTraceEnabled = this.options.debugMode;
            if (this.configuration.defaultErrorHandler !== undefined)
                controllerRunner.defaultErrorHandler = require(this.getSourceCodeDirectory() + this.configuration.defaultErrorHandler).default;
            if (this.configuration.jsonErrorHandler !== undefined)
                controllerRunner.jsonErrorHandler = require(this.getSourceCodeDirectory() + this.configuration.jsonErrorHandler).default;
        }

        const classes = this.flattenRequiredObjects(this.flattenRequiredObjects(controllerDirectories));
        controllerRunner.registerActions(classes);
    }

    private getSourceCodeDirectory() {
        return this.options.frameworkSettings.srcDirectory + "/";
    }

    private flattenRequiredObjects(requiredObjects: any[]): Function[] {
        return requiredObjects.reduce((allObjects, objects) => {
            return allObjects.concat(Object.keys(objects).map(key => objects[key]));
        }, []);
    }

}