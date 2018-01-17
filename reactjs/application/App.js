import React from 'react';
import HtmlHead from './HtmlHead';
import Alert from 'react-s-alert';
import '../components/atoms/ProgressBar/ProgressBar';

const App = ({ children }) => (
  <div>
    <HtmlHead />
    <Alert stack={{ limit: 3 }} position="top-right" timeout={5000} effect="slide" />
    { children }
  </div>
);

export default App;
