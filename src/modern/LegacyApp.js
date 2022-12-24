import { Suspense } from "react";
import lazyLegacyRoot from "./lazyLegacyRoot";

// Lazy-load a component from the bundle using legacy Router
const LegacyAppBridge = lazyLegacyRoot(() => import("../legacy/LegacyApp"));

function LegacyApp() {
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

export { LegacyApp };
