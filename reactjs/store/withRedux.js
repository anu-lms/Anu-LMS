import React from 'react';
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'
import { store, persistor } from '../store/store';
import jsCookie from "js-cookie";
import request from "../utils/request";

export default function(PageComponent) {
  return class ReduxPage extends React.Component {

    render() {
      return (
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <PageComponent {...this.props} />
          </PersistGate>
        </Provider>
      );
    }

    static async getInitialProps(ctx) {
      if (PageComponent.getInitialProps) {
        const childInitialProps = await PageComponent.getInitialProps({...ctx });
        return {...childInitialProps}
      }
      return {};
    }

  }
}
