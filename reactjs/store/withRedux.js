import React from 'react';
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'
import { store, persistor } from '../store/store';

export default function(PageComponent) {
  return class ReduxPage extends React.Component {
    render() {
      return (
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <PageComponent />
          </PersistGate>
        </Provider>
      );
    }
  }
}
