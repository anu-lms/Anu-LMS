import React from 'react';

// Default redux createStore function.
import { createStore } from 'redux';

// Persistent storage.
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Debug.
import { composeWithDevTools } from 'redux-devtools-extension';

// Import our custom reducers.
import reducers from '../reducers';

// redux-persist config.
const persistConfig = {
  key: 'root',
  storage: storage,
  // List reducers to store data for.
  whitelist: ['lesson', 'course', 'navigation', 'notebook'],
};

// Make reducers store persistent data.
const persistedReducers = persistReducer(persistConfig, reducers);

// Build store.
// TODO: Disable dev tools on production.
export const store = createStore(persistedReducers, {}, composeWithDevTools());

