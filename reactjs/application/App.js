import React from 'react';
import Alert from 'react-s-alert';
import sAlertStore from 'react-s-alert/dist/s-alert-parts/s-alert-store';
import HtmlHead from './HtmlHead';
import routerEvents from '../router-events';
import '../components/atoms/ProgressBar/PageProgress';

// Fix "undefined is not a constructor (evaluating 'Object.assign')" issue on login page in iOS 8 and IE 11.
import "es6-shim";

// Adds IE11 support.
import "core-js/fn/symbol/iterator";
import "core-js/fn/symbol";

// When route transition is completed,
// remove all alerts from previous page.
routerEvents.on('routeChangeComplete', () => {
  sAlertStore.dispatch({type: 'REMOVEALL'})
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

export default App;
