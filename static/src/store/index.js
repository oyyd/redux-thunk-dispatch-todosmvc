import { createStore, applyMiddleware, compose } from 'redux';
import instrument from 'redux-devtools-instrument';
import thunk from 'redux-thunk-dispatch/thunk';
import testInstrument, { ActionCreators } from 'redux-thunk-dispatch/dispatch-instrument';
import reducers from '../reducers';

const createThunkMiddleware = thunk.withExtraArgument;

export function createAppStore(state) {
  let lastState = state;

  // use last state when possible
  if (module.hot && module.hot.data && module.hot.data.lastState) {
    lastState = module.hot.data.lastState || lastState;
  }

  const store = createStore(reducers, lastState, compose(
    applyMiddleware(createThunkMiddleware()),
    testInstrument(),
    instrument(),
  ));

  if (module.hot) {
    module.hot.addDisposeHandler((data) => {
      data.lastState = store.getState();
    });

    store.replaceReducer(reducers);
  }

  return store;
}
