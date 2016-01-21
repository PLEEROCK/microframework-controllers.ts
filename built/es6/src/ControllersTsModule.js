var fs = require("fs");
var ControllerRunner_1 = require("controllers.ts/ControllerRunner");
var ExpressServer_1 = require("controllers.ts/server/ExpressServer");
/**
 * Controllers.ts module integration with microframework.
 */
class ControllersTsModule {
    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------
    constructor(requireAll) {
        this.requireAll = requireAll;
        if (!requireAll)
            this.requireAll = require('require-all');
    }
    // -------------------------------------------------------------------------
    // Accessors
    // -------------------------------------------------------------------------
    getName() {
        return 'ControllersTsModule';
    }
    getDependentModules() {
        return ['ExpressModule'];
    }
    getConfigurationName() {
        return 'controllers.ts';
    }
    isConfigurationRequired() {
        return false;
    }
    init(options, configuration, dependentModules) {
        this.options = options;
        this.configuration = configuration;
        this.mfExpressModule = dependentModules.reduce((found, mod) => mod.getName() === 'ExpressModule' ? mod : found, undefined);
    }
    onBootstrap() {
        return Promise.resolve();
    }
    afterBootstrap() {
        this.setupControllers();
        return Promise.resolve();
    }
    onShutdown() {
        return Promise.resolve();
    }
    // -------------------------------------------------------------------------
    // Private Methods
    // -------------------------------------------------------------------------
    getControllerDirectories() {
        if (!this.configuration || !this.configuration.controllerDirectories)
            return [this.getSourceCodeDirectory() + ControllersTsModule.DEFAULT_CONTROLLER_DIRECTORY];
        return this.configuration.controllerDirectories;
    }
    getInterceptorDirectories() {
        if (!this.configuration || !this.configuration.interceptorDirectories)
            return [this.getSourceCodeDirectory() + ControllersTsModule.DEFAULT_INTERCEPTOR_DIRECTORY];
        return this.configuration.interceptorDirectories;
    }
    setupControllers() {
        this.getInterceptorDirectories()
            .filter(directory => fs.existsSync(directory))
            .map(directory => this.requireAll({ dirname: directory, recursive: true }));
        const controllerDirectories = this.getControllerDirectories()
            .filter(directory => fs.existsSync(directory))
            .map(directory => this.requireAll({ dirname: directory, recursive: true }));
        const controllerRunner = new ControllerRunner_1.ControllerRunner(new ExpressServer_1.ExpressServer(this.mfExpressModule.express));
        controllerRunner.container = this.options.container;
        if (this.configuration) {
            if (this.configuration.errorOverridingArray !== undefined) {
                if (!controllerRunner.errorOverridingMap)
                    controllerRunner.errorOverridingMap = {};
                Object.keys(this.configuration.errorOverridingArray).forEach(httpCodeKey => {
                    this.configuration.errorOverridingArray[httpCodeKey].forEach((errorName) => {
                        // todo: fix any usage later
                        controllerRunner.errorOverridingMap[errorName] = { httpCode: httpCodeKey };
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
    getSourceCodeDirectory() {
        return this.options.frameworkSettings.srcDirectory + '/';
    }
    flattenRequiredObjects(requiredObjects) {
        return requiredObjects.reduce((allObjects, objects) => {
            return allObjects.concat(Object.keys(objects).map(key => objects[key]));
        }, []);
    }
}
// -------------------------------------------------------------------------
// Constants
// -------------------------------------------------------------------------
ControllersTsModule.DEFAULT_CONTROLLER_DIRECTORY = 'controller';
ControllersTsModule.DEFAULT_INTERCEPTOR_DIRECTORY = 'interceptor';
exports.ControllersTsModule = ControllersTsModule;
//# sourceMappingURL=ControllersTsModule.js.map