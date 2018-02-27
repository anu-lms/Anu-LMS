import React from 'react';
import HtmlHead from './HtmlHead';
import Alert from 'react-s-alert';

// Fix "undefined is not a constructor (evaluating 'Object.assign')" issue on login page in iOS 8 and IE 11.
import "es6-shim";

// Adds IE11 support.
import "core-js/fn/symbol/iterator";
import "core-js/fn/symbol";

import '../components/atoms/ProgressBar/PageProgress';

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
