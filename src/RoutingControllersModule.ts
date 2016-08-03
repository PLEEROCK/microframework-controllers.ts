import {RoutingControllersModuleConfig} from "./RoutingControllersModuleConfig";
import {Module, ModuleInitOptions} from "microframework/Module";
import {RoutingControllersOptions, useKoaServer, useExpressServer, useContainer} from "routing-controllers";
import {MicroFrameworkBootstrapper} from "microframework/MicroFrameworkBootstrapper";

/**
 * routing-controllers module integration with microframework.
 */
export class RoutingControllersModule implements Module {

    // -------------------------------------------------------------------------
    // Properties
    // -------------------------------------------------------------------------

    private options: ModuleInitOptions;
    private configuration: RoutingControllersModuleConfig;
    private expressModule: any;
    private koaModule: any;
    private framework: MicroFrameworkBootstrapper;

    // -------------------------------------------------------------------------
    // Accessors
    // -------------------------------------------------------------------------

    ignoreMissingDependencies = true;
    
    getName(): string {
        return "RoutingControllersModule";
    }

    getDependentModules(): string[] {
        return ["ExpressModule", "KoaModule"];
    }

    getConfigurationName(): string {
        return "routing-controllers";
    }

    isConfigurationRequired(): boolean {
        return true;
    }

    init(options: ModuleInitOptions, configuration: RoutingControllersModuleConfig, dependentModules?: Module[], framework?: MicroFrameworkBootstrapper): void {
        this.options = options;
        this.configuration = configuration;
        this.framework = framework;
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

    private setupControllers() {

        const options: RoutingControllersOptions = {
            developmentMode: this.options.debugMode,
            defaultErrorHandler: this.configuration.defaultErrorHandler,
            controllerDirs: this.getSourcePaths(this.configuration.controllerDirectories),
            interceptorDirs: this.getSourcePaths(this.configuration.interceptorDirectories),
            errorOverridingMap: this.buildErrorOverridingMap()
        };

        useContainer(this.options.container);
        
        if (this.configuration.driver === "koa") {
            const koaModule: any = this.framework.findModuleByName("KoaModule");
            if (!koaModule)
                throw new Error("Looks like microframework-koa module is not installed or is not connected to the microframework. Try to install it using \"npm install microframework-koa --save\" and check if its correctly connected to the microframework");

            useKoaServer(koaModule.koa, options);

        } else {
            const expressModule: any = this.framework.findModuleByName("ExpressModule");
            if (!expressModule)
                throw new Error("Looks like microframework-express module is not installed or is not connected to the microframework. Try to install it using \"npm install microframework-express --save\" and check if its correctly connected to the microframework");

            useExpressServer(expressModule.express, options);
        }
    }

    private buildErrorOverridingMap() {
        const errorOverridingMap: any = this.configuration.errorOverridingMap || {};

        if (this.configuration.errorOverridingArray !== undefined) {
            Object.keys(this.configuration.errorOverridingArray).forEach(httpCodeKey => {
                this.configuration.errorOverridingArray[httpCodeKey].forEach((errorName: string) => {
                    // todo: fix any usage later
                    errorOverridingMap[errorName] = { httpCode: httpCodeKey };
                });
            });
        }
        
        return errorOverridingMap;
    }

    private getSourcePaths(dirs: string[]) {
        if (!dirs || !dirs.length)
            return [];
        
        return dirs.map(dir => this.options.frameworkSettings.srcDirectory + "/" + dir);
    }

}