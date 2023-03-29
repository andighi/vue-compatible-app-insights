# vue-compatible-app-insights

**!IMPORTANT - THIS IS NOT YET PUBLISHED TO NPM**

## Get started

### For Vue2
```js
import Vue from 'vue';
import VueCompatibleAppInsights from 'vue-compatible-app-insights';

Vue.use(VueCompatibleAppInsights, {
  baseName: 'My app name', // prefix to track route changes as page views with AppInsights
  id: 'XXXXXXXX--XXXX-XXXX-XXXXXXXXXXXX'
});
```
With vue router

```js
import Vue from 'vue';
import router from './router';

import VueCompatibleAppInsights from 'vue-compatible-app-insights'

Vue.use(VueCompatibleAppInsights, {
  baseName: 'My app name', 
  id: 'XXXXXXXX--XXXX-XXXX-XXXXXXXXXXXX',
  router
});
```

### For Vue3
```js
import App from "./App.vue";
import VueCompatibleAppInsights from 'vue-compatible-app-insights';

const app = createApp(App);

app.use(VueCompatibleAppInsights, {
  baseName: 'My app name',
  id: 'XXXXXXXX--XXXX-XXXX-XXXXXXXXXXXX',
});
app.mount("#app");

```
With vue router

```js
import App from "./App.vue";
import VueCompatibleAppInsights from 'vue-compatible-app-insights';
import router from "./router";

const app = createApp(App);
app.use(VueCompatibleAppInsights, {
  baseName: 'My app name',
  id: 'XXXXXXXX--XXXX-XXXX-XXXXXXXXXXXX',
  router: router
});
app.mount("#app");
```

If you want to keep your options object separately, you can:

```js
import type { AppInsightsOptions } from 'vue-compatible-app-insights';

const appInsightsOptions: AppInsightsOptions = {
  baseName: 'My app name',
  id: 'XXXXXXXX--XXXX-XXXX-XXXXXXXXXXXX',
};

app.use(VueCompatibleAppInsights, appInsightsOptions);

````

## Options

- **id** - The instrumentation key of your AppInsights resource on Azure.
- **router** - The router instance, which events should be tracked as page views _(optional)_.
- **baseName** String that will prefix the name of the tracked page _(optional, default is '(Vue App)')_
- **appInsights** Instance of the Application Insights client  _(optional)_.
- **trackInitialPageView** - Boolean that determines whether or not the initial page view should be tracked. _(optional, defaults to undefined)_
- **onAfterScriptLoaded** Callback function that will be invoked after AppInsights script have loaded. _(optional, defaults to undefined)_
- **appInsightsConfig** Object where you can put custom [AppInsights configuration](https://github.com/microsoft/ApplicationInsights-JS#configuration) _(optional, defaults to empty object)_

## Examples
### Vue3
```js
<script setup lang="ts">
import { inject } from 'vue'
import type { AppCompatibleInsights } from 'vue-compatible-app-insights'
// or import { AppCompatibleInsights } from 'vue-compatible-app-insights' if your project settings allows you to

const insights: AppCompatibleInsights = inject('appInsights')

const getUsers = async () => {
  try {
    await ApiService.getUsers()
  } catch (e) {
    insights.appInsights.trackEvent({ name: 'GET_USERS_ERROR' })
  }
}

</script>
```

### Vue2

```js
<script>
export default {
  name: "App",
  data() {
    return {
      message: "Hello World!",
      insights: this.$appInsights,
    };
  },
  methods: {
    onClick() {
      console.log(this.insights);
    },
  },
};
</script>
```

## Other Examples
```js
import VueCompatibleAppInsights from 'vue-compatible-app-insights';
import type { AppInsightsOptions, AppCompatibleInsights } from 'vue-compatible-app-insights'
// or import VueCompatibleAppInsights, { AppInsightsOptions, AppCompatibleInsights } from 'vue-compatible-app-insights' if your project settings allows you to

const app = createApp(App);

const afterInsightsCallback = (insights: AppCompatibleInsights) => {
    insights.someAction()
};

const options: AppInsightsOptions = {
  baseName: 'My app name',
  id: 'XXXXXXXX--XXXX-XXXX-XXXXXXXXXXXX',
  onAfterScriptLoaded: afterInsightsCallback,
};

app.use(VueCompatibleAppInsights, options);

app.mount('#app');

```



