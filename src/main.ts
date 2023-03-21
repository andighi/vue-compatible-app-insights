import { ApplicationInsights, Util } from "@microsoft/applicationinsights-web";
/**
 * Install function passed to Vue.use() or app.use() show documentation on vue.js website.
 *
 * @param app
 * @param options
 */
function install(app: any, options: any) {
  const config = options.appInsightsConfig || {};
  config.instrumentationKey = config.instrumentationKey || options.id;
  let insights: any;
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
    if (typeof options.onAfterScriptLoaded === "function") {
      options.onAfterScriptLoaded(insights);
    }
  }
  const router = options.router;
  // Watch route event if router option is defined.
  if (router) {
    if (options.trackInitialPageView !== false) {
      setupPageTracking(options, insights);
    } else {
      router.onReady(() => setupPageTracking(options, insights));
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
function setupPageTracking(options: any, app: any) {
  const router = options.router;

  const baseName = options.baseName || "(Vue App)";

  router.beforeEach((route: any, from: any, next: any) => {
    const name = baseName + " / " + route.name;
    app.context.telemetryTrace.traceID = Util.generateW3CId();
    app.context.telemetryTrace.name = route.name;
    app.startTrackPage(name);
    next();
  });

  router.afterEach((route: any) => {
    const name = baseName + " / " + route.name;
    const url = location.protocol + "//" + location.host + route.fullPath;
    app.stopTrackPage(name, url);
    app.flush();
  });
}

export default install;
