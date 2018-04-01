import React, { Fragment } from 'react';
import { Provider } from 'react-redux';
import { persistStore } from 'redux-persist';
import { store } from '../store/store';
import PageLoader from '../components/atoms/PageLoader';

export default function (PageComponent) {
  return class ReduxPage extends React.Component {

    constructor(props) {
      super(props);

      this.state = {
        storageLoaded: false,
      };
    }

    componentDidMount() {
      const state = store.getState();

      // If storage was already rehydrated, then set state appropriately.
      if (typeof state._persist !== 'undefined') { // eslint-disable-line no-underscore-dangle
        if (state._persist.rehydrated) { // eslint-disable-line no-underscore-dangle
          // eslint-disable-next-line react/no-did-mount-set-state
          this.setState({ storageLoaded: true });
          return;
        }
      }

      persistStore(store, null, () => {
        this.setState({ storageLoaded: true });
      });
    }

    render() {
      return (
        <Provider store={store}>
          <Fragment>
            { !this.state.storageLoaded &&
            <PageLoader />
            }
            <PageComponent {...this.props} />
          </Fragment>
        </Provider>
      );
    }

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

  };
}
