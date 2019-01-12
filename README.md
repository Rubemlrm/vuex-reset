# @ianwalter/vuex-reset
> A [Vuex][vuexUrl] plugin that makes restoring initial state to the store
> simple

[![npm page][npmImage]][npmUrl]

## Installation

```
yarn add @ianwalter/vuex-reset
```

## Usage

```js
import VuexReset from '@ianwalter/vuex-reset'

const store = new Vuex.Store({
  plugins: [VuexReset()],
  state: {
    message: 'Welcome!',
    mutations: {
      // A no-op mutation must be added to serve as a trigger for a reset. The
      // name of the trigger mutation defaults to 'reset' but can be specified
      // in options, e.g. VuexReset({ trigger: 'data' }).
      reset: () => {}
    }
  }
})

// Reset the store to it's initial state.
store.commit('reset')
```

You can also reset a namespaced module to it's initial state, for example:

```js
const store = new Vuex.Store({
  plugins: [VuexReset()],
  state: {
    message: 'Welcome!'
  },
  modules: {
    car: {
      namespaced: true,
      state: {
        brand: 'Honda'
      },
      mutations: {
        reset: () => {}
      }
    }
  }
})

// Reset the car module to it's initital state.
store.commit('car/reset')
```

## License

Apache 2.0 with Commons Clause - See [LICENSE][licenseUrl]

&nbsp;

Created by [Ian Walter](https://iankwalter.com)

[npmImage]: https://img.shields.io/npm/v/@ianwalter/dist.svg
[npmUrl]: https://www.npmjs.com/package/@ianwalter/dist
[vuexUrl]: https://github.com/vuejs/vuex
[licenseUrl]: https://github.com/ianwalter/vuex-reset/blob/master/LICENSE
