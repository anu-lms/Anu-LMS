import React from 'react';
import Alert from 'react-s-alert';
import PropTypes from 'prop-types';
import sAlertStore from 'react-s-alert/dist/s-alert-parts/s-alert-store';

// Fix "undefined is not a constructor (evaluating 'Object.assign')"
// issue on login page in iOS 8 and IE 11.
import 'es6-shim';

import HtmlHead from './HtmlHead';
import routerEvents from '../router-events';
import '../components/atoms/ProgressBar/PageProgress';

// When route transition is completed,
// remove all alerts from previous page.
routerEvents.on('routeChangeComplete', () => {
  sAlertStore.dispatch({ type: 'REMOVEALL' });
});

const App = ({ children }) => (
  <div>
    <HtmlHead />
    <Alert
      stack={{ limit: 3 }}
      position="top-right"
      timeout={5000}
      effect="slide"
    />
    { children }
  </div>
);

App.propTypes = {
  children: PropTypes.node.isRequired,
};

export default App;
