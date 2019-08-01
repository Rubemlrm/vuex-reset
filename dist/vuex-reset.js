'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var clone = _interopDefault(require('@ianwalter/clone'));
var merge = _interopDefault(require('@ianwalter/merge'));

function VuexReset (opts = {}) {
  const { ssr, trigger } = merge({ trigger: 'reset' }, opts);

  return store => {
    // Extract the initial state from the store so that it can be used to reset
    // the store when a trigger mutation is executed.
    const initialState = clone(store.state);

    // If the Vuex store needs to be hydrated from SSR data, add it to the store
    // after the initialState is set so that initialState isn't polluted with
    // SSR data and the store can be reset cleanly.
    if (ssr) {
      store.replaceState(merge(clone(store.state), ssr));
    }

    store.subscribe((mutation, state) => {
      if (mutation.type === trigger) {
        const newState = clone(initialState);

        // Don't reset route module if set.
        if (state.route) {
          newState.route = clone(state.route);
        }

        // Reset the entire store state.
        store.replaceState(newState);
      } else {
        // Extract the name of the module and mutation.
        const splitCommand = mutation.type.split('/');
        const mutationTrigger = splitCommand.pop();
        const moduleNamespace = splitCommand.join("/");

        if (mutationTrigger === trigger) {
          // Reset the state for the module containing the mutation.
          store.replaceState({
            ...clone(state),
            [moduleNamespace]: clone(initialState[moduleNamespace])
          });
        }
      }
    });

    store.registerModuleState = (namespace, mod) => {
      store.registerModule(namespace, mod);
      initialState[namespace] = clone(mod.state);
    };

    store.unregisterModuleState = namespace => {
      store.unregisterModule(namespace);
      delete initialState[namespace];
    };
  }
}

module.exports = VuexReset;
