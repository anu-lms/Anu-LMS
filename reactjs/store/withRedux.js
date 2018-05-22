import React, { Fragment } from 'react';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { store } from '../store/store';
import PageLoader from '../components/atoms/PageLoader';

export default function (PageComponent) {
  return class ReduxPage extends React.Component {
    static async getInitialProps(ctx) {
      let initialProps = {
        dispatch: store.dispatch,
      };

      if (PageComponent.getInitialProps) {
        const childInitialProps = await PageComponent.getInitialProps({ ...initialProps, ...ctx });
        return { ...initialProps, ...childInitialProps };
      }

      return initialProps;
    }

    constructor(props) {
      super(props);

      this.state = {
        storageLoaded: false,
      };
    }

    componentDidMount() {
      // eslint-disable-next-line react/no-did-mount-set-state
      this.setState({ storageLoaded: true });

      const state = store.getState();
      // If storage was already rehydrated, then skip setup store step.
      // eslint-disable-next-line no-underscore-dangle
      if (typeof state._persist !== 'undefined' && state._persist.rehydrated) {
        return;
      }

      persistStore(store);
    }

    render() {
      return (
        <Provider store={store}>
          <Fragment>
            { !this.state.storageLoaded &&
            <PageLoader type="fixed" />
            }
            <PageComponent {...this.props} />
          </Fragment>
        </Provider>
      );
    }
  };
}
