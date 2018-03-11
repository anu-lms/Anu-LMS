import React from 'react';

// Default redux createStore function.
import { createStore, applyMiddleware } from 'redux';

// Persistent storage.
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Debug.
import { composeWithDevTools } from 'redux-devtools-extension';

// Sagas!
import createSagaMiddleware from 'redux-saga';
import mainSaga from '../sagas';

// Import our custom reducers.
import reducers from '../reducers';

// redux-persist config.
const persistConfig = {
  key: 'root',
  storage: storage,
  // List reducers to store data for.
  // TODO: Potentially lesson and course can be not permanent any more.
  whitelist: ['lesson', 'course', 'navigation', 'notebook'],
};

// Make reducers store persistent data.
const persistedReducers = persistReducer(persistConfig, reducers);

// Create a saga middleware.
const sagaMiddleware = createSagaMiddleware();

// Build store.
// TODO: Disable dev tools on production.
export const store = createStore(persistedReducers, {}, composeWithDevTools(
  applyMiddleware(sagaMiddleware)
));

// Start watching all sagas.
sagaMiddleware.run(mainSaga);
