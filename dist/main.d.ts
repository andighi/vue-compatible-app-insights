import { ApplicationInsights, IConfiguration, IConfig } from "@microsoft/applicationinsights-web";
import { Router } from "vue-router";
export type AppInsightsOptions = {
    id?: string;
    router?: Router;
    baseName?: string;
    appInsights?: ApplicationInsights;
    trackInitialPageView?: boolean;
    onAfterScriptLoaded?(insights: ApplicationInsights): void;
    appInsightsConfig?: IConfiguration & IConfig;
};
/**
 * Install function passed to Vue.use() or app.use() show documentation on vue.js website.
 *
 * @param app
 * @param options
 */
declare function install(app: any, options: AppInsightsOptions): void;
export default install;
