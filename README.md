# Demo of Gradual React-Router-Dom Upgrades 🪢🪡

This is a demo of how you can configure a build system to serve **two different versions of React-Router-Dom** side by side in the same app. This is not optimal, and should only be used as a compromise to prevent your app from getting stuck on an old version of React-Router-Dom.

**[Learn more about Gradual Upgrades.](https://reactjs.org/blog/2020/08/10/react-v17-rc.html#gradual-upgrades)**

## Why NOT Do This 🙅‍♂️

Note that **this approach is meant to be an escape hatch, not the norm**.

Normally, React team encourage us to use a single version of libs across our whole app. When we need to upgrade React-Router-Dom, it is better to try to upgrade it all at once.

Using a single version of React-Router-Dom removes a lot of complexity. It is also essential to ensure the best experience for our users who don't have to download the code twice. **Always prefer using one Router if you can.**

## Why Do This 🕺

However, for some apps that have been in production for many years, upgrading all routes at once may be prohibitively difficult. For example, if the application code does not follow consistency in representing the application's routes or does not have a good test coverage.

Traditionally, this meant that if a legacy API is deprecated, we would be stuck on the old version of React-Router-Dom forever. That prevents our whole app from receiving improvements and bugfixes. This repository demonstrates a hybrid approach. It shows how we can use a newer version of React-Router-Dom for some parts of our app, while **lazy-loading an older version of React-Router-Dom** for the parts that haven't been migrated yet.

This approach is inherently more complex, and should be used as a last resort when we can't upgrade.

We have two options:

- We either wait until the entire application is migrated with the new Router or
- We can apply the well known strangler pattern to our frontend application

The _strangler pattern_ comes from the idea of generating incremental value for the business and the user by releasing parts of the applications instead of waiting for the wholly new application to be ready.

Basically, with this gradual upgrade, we can tackle an area of the app where we think we may generate value for the business, build with the new features/router, and deploy them in the production environment living alongside the legacy application. Besides, by doing it incrementally we avoid introducing bugs and in case of failure it is much easier to perform a rollback of the route.

> This way we can wait for the team that maintains the library to incorporate the `Prompt` functionality again 😜

## Version Requirements 🎬

This demo uses two different versions of React-Router-Dom: RRD 6 for "modern" routes (in `src/modern`), and RRD 5 for "legacy" routes (in `src/legacy`).

**I still recommend upgrading the entire application to RRD 6 at once.** The remix team, has created some migration guidelines and even a compat layer, but sometimes we are not always fortunate enough to be able to carry out these migrations in the way they are proposed.

However, if you're already stuck on an old version of RRD, you may found this approach useful today.

> keep in mind that the usage of third-party libraries included in this demo (React-Router-Dom) may need to be adjusted or removed 👍

## Installation 👷‍♂️

To run this demo, clone the project, open its folder and execute:

```sh
npm i
npm start
```

If you want to test the production build, you can run instead:

```
npm i
npm run build
npx serve -s build
```

If you want to analyze the production build, you can run:

```
npm i
npm run build
npm run analyze
```

This sample app uses client-side routing and consists of five routes:

- `/` renders a page which uses a newer version of React-Router-Dom
- `/users/:id` renders a page which uses new features such a `defer` and `loader`
- `/about` renders a page which uses an older version of React-Router-Dom for a part of its tree. (In the production build, you can verify that both versions of React-Router-Dom are loaded from different chunks.)
- `/dashboard` renders a page which uses an older version of React-Router-Dom for a part of its tree. (In the production build, you can verify that both versions of React-Router-Dom are loaded from different chunks.)
- `/error` renders a page which uses a newer version of React-Router-Dom and catches all non-existent routes in both systems

**The purpose of this demo is to show some nuances of such setup:**

- How to install two versions of React-Router-Dom in a single app with npm side by side
- How to avoid the ["invalid Hook call" error](https://github.com/facebook/react/issues/13991) while nesting React trees
- How to pass context between different systems
- How to lazy-load the second React bundle so it's only loaded on the routes that use it
- How to do all of this without a special bundler configuration
- How to navigate between systems

## How It Works 👨‍🏫

File structure is extremely important in this demo. It has a direct effect on which code is going to use which version of React. This particular demo is using Create React App without ejecting, so **it doesn't rely on any bundler plugins or configuration**. The principle of this demo is portable to other setups.

### Dependencies 🏭

We will use three different `package.json`s: one for non-React code at the root, and two in the respective `src/legacy` and `src/modern` folders that specify the React dependencies:

- **`package.json`**: The root `package.json` is a place for build dependencies (such as `react-scripts`) and any React-agnostic libraries (for example, `lodash`, `immer`, or `redux`). We do **not** include React or any React-related libraries in this file
- **`src/legacy/package.json`**: This is where we declare the `react` and `react-dom` dependencies for the "legacy" trees. In this demo, we're using React-Router-Dom 5.3.4 (although, as noted above, we could downgrade it further below). This is **also** where we specify any third-party libraries that use React. For example, `react-redux` or other libs
- **`src/modern/package.json`**: This is where we declare the `react` and `react-dom` dependencies for the "modern" trees. In this demo, we're using React-Router-Dom 6.6.1. Here, we also specify third-party dependencies that use React and are used from the modern part of our app. This is why we _also_ have `react-router-dom` in this file. (Their versions don't strictly have to match their `legacy` counterparts, but features that rely on context may require workarounds if they differ, in this case, the contexts follow the same structure and we don't have to make any custom compat layer v6->v5.)

The `scripts` in the root `package.json` are set up so that when you run `npm install` in it, it also runs `npm intall` in both `src/legacy` and `src/modern` folders.

### Folders 📁

There are a few key folders in this example:

- **`src`**: Root of the source tree. At this level (or below it, except for the special folders noted below), you can put any logic that's agnostic of React. For example, in this demo we have `src/index.js` which is the app's entry point. These regular modules only execute once, and are **not** duplicated between the bundles.
- **`src/legacy`**: This is where all the code using the older version of React should go. This includes React components and Hooks, and general product code that is **only** used by the legacy trees.
- **`src/modern`**: This is where all the code using the newer version of React should go. This includes React components and Hooks, and general product code that is **only** used by the modern trees.
- **`src/shared`**: You may have some components or Hooks that you wish to use from both modern and legacy subtrees. The build process is set up so that **everything inside `src/shared` gets copied by a file watcher** into both `src/legacy/shared` and `src/modern/shared` on every change. This lets you write a component or a Hook once, but reuse it in both places.

### Lazy Loading 📩

Loading two Routers on the same page is bad for the user experience, so we should strive to push this as far as possible from the critical path of our app. For example, if there is a route that is rarely visited, those are better candidates for staying on an older version of React-Router-Dom than parts of our homepage.

To encourage only loading the older React-Router-Dom when necessary, this demo includes a helper that works similarly to `React.lazy`. For example, `src/modern/LegacyApp.js`, simplified, looks like this:

```js
import { Suspense } from "react";
import lazyLegacyRoot from "./lazyLegacyRoot";

// Lazy-load a component from the bundle using legacy Router
const LegacyAppBridge = lazyLegacyRoot(() => import("../legacy/LegacyApp"));

export function LegacyApp() {
  return (
    <>
      <h2>src/modern/LegacyBridge.js 🚨</h2>
      <h3>This component is rendered by the outer React-Router-Dom v6.6.1.</h3>
      <Suspense fallback={null}>
        <LegacyAppBridge />
      </Suspense>
      <br />
    </>
  );
}
```

As a result, only if the `/about` page gets rendered, we will load the bundle containing the legacy Router and the legacy `AboutPage` component. Like with `React.lazy()`, we wrap it in `<Suspense>` to specify the loading indicator:

```js
<Suspense fallback={<Spinner />}>
  <LegacyAppBridge />
</Suspense>
```

If the legacy component is only rendered conditionally, we won't load the second Router until it's shown:

```js
<>
  <button onClick={() => setShowGreeting(true)}>Say hi</button>
  {showGreeting && (
    <Suspense fallback={<Spinner />}>
      <Greeting />
    </Suspense>
  )}
</>
```

The implementation of the `src/modern/lazyLegacyRoot.js` helper is included so we can tweak it and customize it to our needs. Remember to test lazy loading with the production builds because the bundler may not optimize it in development.

### Navigating between routes of different systems 🏄‍♂️

It is very likely that at some point we will need to redirect our users from a migrated route to a legacy route and vice versa.

To do this, it must be remembered that the navigation performed and managed by **React-Router-Dom** is relative to the context where it is being rendered.
That is, if the user is in the old system and wants to navigate to a page which is totally managed by the new system, if we make use of `Link` or `history.push` it will not work as expected because it will look for the path in the `Switch` of the old system.

Therefore, to perform such navigations, we must delegate the responsibility of performing those navigations to the native html, using an anchor (aka `<a href="/path/en/new/system" />`).

> by using an anchor we have the disadvantage that all requests will be performed again and the current status on the client side will be lost 😰 but we can fix that 🤫

#### With DI 🌈

If we find the need to navigate without having to lose the current status of the application and prevent unnecessary requests, we have a solution for this problem ✌️

Basically we will inject the `navigate` function of the new system into one of the legacy system contexts, this is totally licit to do, since executing a function is possible in JavaScript 😜

i.e:

> Disclaimer: this is an example and for this reason best practices are not used, in our projects do it calmly and following the best possible practices 🥶

```js
// ./src/modern/lazyLegacyRoot.js

import { useNavigate } from "react-router-dom";

function lazyLegacyRoot() {
  // ...

  const navigate = useNavigate();

  const context = useMemo(() => ({ router, navigate }), [router]);
  // ...
}
```

```js
// ./src/legacy/createLegacyRoot.js

import { createContext, useContext } from "react";

const ModernBridge = createContext(null);
export const useModernBridge = () => useContext(ModernBridge);

function Bridge({ children, context }) {
  return (
    <ModernBridge.Provider value={context.navigate}>
      <__RouterContext.Provider value={context.router}>
        <BrowserRouter>{children}</BrowserRouter>
      </__RouterContext.Provider>
    </ModernBridge.Provider>
  );
}

// ./src/legacy/LegacyApp.js

import { useModernBridge } from "./createLegacyRoot";

function AboutPageLegacy() {
  const navigate = useModernBridge();

  return (
    <div>
      <button onClick={() => navigate("/users/120")}>
        Navigate to modern system page
      </button>
    </div>
  );
}
```

In this way, the state of our application remains intact and the navigation is performed by our new routing system 🤭.

> but be careful not to mix too much, there is a fine line that separates the lawful from a failed production 🤪

### Context 🏗

If we have nested trees managed by different versions of React-Router-Dom, the inner tree won't "see" the outer tree's Contexts.

This breaks third-party libraries like React-Redux or React-Router, as well as any of our own usage of Context (for example, for theming or auth).

To solve this problem, we read all the Contexts we care about in the outer tree, pass them to the inner tree, and then wrap the inner tree in the corresponding Providers. We can see this in action in two files:

- `src/modern/lazyLegacyRoot.js`: Look for `useContext` calls, and how their results are combined into a single object that is passed through. **We can read more Contexts there** if our app requires them.
- `src/legacy/createLegacyRoot.js`: Look for the `Bridge` component which receives that object and wraps its children with the appropriate Context Providers. **We can wrap them with more Providers there** if our app requires them.

Note that, generally saying, this approach is somewhat fragile, especially because some libraries may not expose their Contexts officially or consider their structure private. We may be able to expose private Contexts by using a tool like [patch-package](https://www.npmjs.com/package/patch-package), but remember to keep all the versions pinned because even a patch release of a third-party library may change the behavior.

### Nesting Direction ↩️

In this demo, we use an older Router inside an app managed by the newer Router. However, we could rename the folders and apply the same approach in the other direction.
It all depends on the degree of dependency of the application, such as state management, layouts, etc.

> Personally, doing it from the outside in is much simpler since at the end there will come a point when the legacy folder is empty and all we have to do is delete it and return to the initial state, just a `src` folder 😉 (also known as [Strangler Pattern](https://martinfowler.com/bliki/StranglerFigApplication.html))

## Gotchas 🕵️‍♂️

This setup is unusual, so it has a few gotchas.

- Don't add `package.json` to the `src/shared` folder. For example, if we want to use an npm React component inside `src/shared`, we should add it to both `src/modern/package.json` and `src/legacy/package.json` instead. We can use different versions of it but make sure our code works with both of them — and that it works with both Reacts!
- Don't use React outside of the `src/modern`, `src/legacy`, or `src/shared`. Don't add React-related libraries outside of `src/modern/package.json` or `src/legacy/package.json`
- Remember that `src/shared` is where we write shared components, but the files we write there are automatically copied into `src/modern/shared` and `src/legacy/shared`, **from which we should import them**. Both of the target directories are in `.gitignore`. Importing directly from `src/shared` **will not work** because it is ambiguous what `react` refers to in that folder
- Keep in mind that any code in `src/shared` gets duplicated between the legacy and the modern bundles. Code that should not be duplicated needs to be anywhere else in `src` (but we can't use React there since the version is ambiguous)
- We'll want to exclude `src/*/node_modules` from our linter's configuration, as this demo does in `.eslintignorerc`

> Many points mentioned in the list can be solved by adapting our bundler, such as webpack, and resolving the packages so that they are not duplicated when the application is compiled

This setup is complicated, and is not recommended for most apps. However, I believe it is important to offer it as an option for apps that would otherwise get left behind.
There might be better ways to perform such migrations, but having another alternative as an example is always a good thing ☺️.

## A few of my own considerations 🤠

- Better not to delegate the status of the application to the router status (saves a lot of unnecessary headaches)
- To avoid extremely complexities in handling global states, I highly recommend the use of tools like [`jotai`](https://jotai.org/), apart that we can import this from either folder without duplicating the object/state! 😲
- Please, for this to come out with an erotic result, I will not tire of recommending to add observability to our architecture, observability closes the feedback loop when our code runs in a production environment; otherwise, we would not be able to react quickly to any incidents happening durint prime time. (is a must-have feature! 🙏)
- Draw up a plan of action to migrate all the routes in a certain period of time, and determine which routes will be the first, it is always good to set a date to force us to work on it and that this migration does not remain in an application with both systems coexisting forever, thus being a new Frankestein 🧟‍♂️

## License

This example is [MIT licensed](./LICENSE).

> credits to the React team for this great alternative to make changes to legacy applications in an incremental and painless way 💙
