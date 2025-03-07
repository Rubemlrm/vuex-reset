const { test } = require('@ianwalter/bff')
const Vue = require('vue')
const Vuex = require('vuex')
const clone = require('@ianwalter/clone')
const VuexReset = require('.')

Vue.use(Vuex)

test('state is reset when trigger mutation executed', ctx => {
  const state = { message: 'Hello!' }
  const store = new Vuex.Store({
    plugins: [VuexReset()],
    state: clone(state),
    mutations: {
      message: (state, message) => (state.message = message),
      reset: () => {}
    }
  })
  store.commit('message', 'Greetings!')
  store.commit('reset')
  ctx.expect(store.state).toEqual(state)
  store.commit('message', 'Yo!')
  store.commit('reset')
  ctx.expect(store.state).toEqual(state)
})

test('only module state is reset when module mutation executed', ctx => {
  const rootMessage = 'Yo!'
  const songName = 'One Touch'
  const state = { message: 'Hello!' }
  const songState = { name: 'Messy Love', collections: [], map: {} }
  const store = new Vuex.Store({
    plugins: [VuexReset()],
    state: clone(state),
    mutations: {
      message: (state, message) => (state.message = message),
      reset: () => {}
    },
    modules: {
      song: {
        namespaced: true,
        state: clone(songState),
        mutations: {
          name: (state, name) => (state.name = name),
          collection: (state, collection) => {
            state.collections.push(collection)
            state.map[collection] = 1
          },
          reset: () => {}
        }
      }
    }
  })
  store.commit('message', rootMessage)
  store.commit('song/name', songName)
  ctx.expect(store.state.song.name).toBe(songName)
  store.commit('song/collection', 'Summer')
  ctx.expect(store.state.song.collections).toEqual(['Summer'])
  ctx.expect(store.state.song.map).toEqual({ Summer: 1 })
  store.commit('song/reset')
  ctx.expect(store.state.message).toBe(rootMessage)
  ctx.expect(store.state.song).toEqual(songState)
  store.commit('song/collection', 'Dance')
  store.commit('reset')
  ctx.expect(store.state.song).toEqual(songState)
})

test('module state can be reset when registered dynamically', ctx => {
  const rootMessage = 'Yo!'
  const songName = 'One Touch'
  const state = { message: 'Hello!' }
  const songState = { name: 'Messy Love', collections: [] }
  const song = {
    namespaced: true,
    state: clone(songState),
    mutations: {
      name: (state, name) => (state.name = name),
      collection: (state, collection) => state.collections.push(collection),
      reset: () => {}
    }
  }
  const store = new Vuex.Store({
    plugins: [VuexReset()],
    state: clone(state),
    mutations: {
      message: (state, message) => (state.message = message),
      reset: () => {}
    }
  })
  store.registerModuleState('song', song)
  store.commit('message', rootMessage)
  store.commit('song/name', songName)
  ctx.expect(store.state.song.name).toBe(songName)
  store.commit('song/collection', 'Summer')
  ctx.expect(store.state.song.collections).toEqual(['Summer'])
  store.commit('song/reset')
  ctx.expect(store.state.message).toEqual(rootMessage)
  ctx.expect(store.state.song).toEqual(songState)
})

test('ssr state is used but can reset to initial state', ctx => {
  const message = 'Yo!'
  const state = { message: 'Hello!', song: 'The Wheel' }
  const store = new Vuex.Store({
    plugins: [VuexReset({ ssr: { message, song: null } })],
    state: clone(state),
    mutations: {
      reset: () => true
    }
  })
  ctx.expect(store.state.message).toBe(message)
  store.commit('reset')
  ctx.expect(store.state).toEqual(state)
})

test('current route state is kept if it exists when reset', ctx => {
  const state = { message: 'Hello!' }
  const route = { path: '/' }
  const path = '/welcome'
  const store = new Vuex.Store({
    plugins: [VuexReset()],
    state: clone(state),
    modules: {
      route: {
        namespaced: true,
        state: clone(route),
        mutations: {
          path: (state, path) => (state.path = path)
        }
      }
    },
    mutations: {
      message: (state, message) => (state.message = message),
      reset: () => {}
    }
  })
  store.commit('route/path', path)
  store.commit('message', 'Greetings!')
  store.commit('reset')
  ctx.expect(store.state.message).toBe(state.message)
  ctx.expect(store.state.route.path).toBe(path)
})
