import React from 'react';
import HtmlHead from './HtmlHead';
import '../components/atoms/ProgressBar/ProgressBar';

const App = ({ children }) => (
  <div>
    <HtmlHead />
    { children }
  </div>
);

export default App;
