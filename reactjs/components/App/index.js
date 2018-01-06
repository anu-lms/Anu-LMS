import React from 'react';
import PropTypes from 'prop-types';
import ProgressBar from '../ProgressBar'; // Do not remove!
import GlobalHeader from '../GlobalHeader/index';
import GlobalFooter from '../GlobalFooter/index';

const App = ({ children }) => (
  <div>
    <GlobalHeader />
    { children }
    <GlobalFooter />
  </div>
);

App.propTypes = {

};

export default App;
