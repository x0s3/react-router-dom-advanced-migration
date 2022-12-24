/* eslint-disable react/jsx-pascal-case */
import { createRoot } from "react-dom/client";

// Note: this is a semi-private API, but it's ok to use it
// if we never inspect the values, and only pass them through
import { __RouterContext } from "react-router";
import { BrowserRouter } from "react-router-dom";

// Pass through every context required by this tree
// The context object is populated in src/modern/withLegacyRoot
// i.e: redux, but excessive use is not recommended
function Bridge({ children, context }) {
  return (
    <__RouterContext.Provider value={context.router}>
      <BrowserRouter>{children}</BrowserRouter>
    </__RouterContext.Provider>
  );
}

export default function createLegacyRoot(container) {
  return {
    render(Component, props, context) {
      createRoot(container).render(
        <Bridge context={context}>
          <Component {...props} />
        </Bridge>
      );
    },
    unmount() {
      createRoot(container).unmount();
    },
  };
}
