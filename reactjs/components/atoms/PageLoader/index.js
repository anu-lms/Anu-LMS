import React from 'react';

export default ({ type }) => (
  <div className={type === 'fixed' ? 'page-loader-fixed' : 'page-loader'}>
    <div className="loader">
      <div className="shadow" />
      <div className="box" />
    </div>
  </div>
);
