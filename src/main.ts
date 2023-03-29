import {
  ApplicationInsights,
  Util,
  IConfiguration,
  IConfig,
} from "@microsoft/applicationinsights-web";
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

export type AppCompatibleInsights = ApplicationInsights;

/**
 * Install function passed to Vue.use() or app.use() show documentation on vue.js website.
 *
 * @param app
 * @param options
 */
function install(app: any, options: AppInsightsOptions) {
  const config = options.appInsightsConfig || {};
  config.instrumentationKey = config.instrumentationKey || options.id;
  let insights: ApplicationInsights;
  const isVue2 = app.prototype;

  if (isVue2) {
    app.insights = null;
    insights = app.appInsights;
  } else {
    app.config.globalProperties.$insights = null;
    insights = app.config.globalProperties.$insights;
  }
  if (options.appInsights) {
    insights = options.appInsights;
  } else {
    insights = new ApplicationInsights({ config });
    insights.loadAppInsights();
    if (options.onAfterScriptLoaded) {
      options.onAfterScriptLoaded(insights);
    }
  }
  const router = options.router;
  // Watch route event if router option is defined.
  if (router) {
    if (options.trackInitialPageView) {
      setupPageTracking(options, insights);
    } else {
      router.isReady().then(() => setupPageTracking(options, insights));
    }
  }

  if (isVue2) {
    Object.defineProperty(app.prototype, "$appInsights", {
      get: () => app.appInsights,
    });
  } else app.provide("appInsights", insights);
}

/**
 * Track route changes as page views with AppInsights
 * @param options
 */
function setupPageTracking(
  options: AppInsightsOptions,
  inisghts: ApplicationInsights
) {
  const router = options.router;
  const baseName = options.baseName || "(Vue App)";

  if (router) {
    router.beforeEach((route: any, from: any, next: any) => {
      const name = baseName + " / " + route.name;
      inisghts.context.telemetryTrace.traceID = Util.generateW3CId();
      inisghts.context.telemetryTrace.name = route.name;
      inisghts.startTrackPage(name);
      next();
    });

    router.afterEach((route: any) => {
      const name = baseName + " / " + route.name;
      const url = location.protocol + "//" + location.host + route.fullPath;
      inisghts.stopTrackPage(name, url);
      inisghts.flush();
    });
  }
}

export default install;
