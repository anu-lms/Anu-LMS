import React from 'react';

const Audio = ({ isNavCollapsed }) => (
  <div className="container">
    <div className="row">
      <div className={`col-12 offset-md-1 col-md-10 offset-lg-${isNavCollapsed ? '2' : '1'} col-lg-8`}>

      </div>
    </div>
  </div>
);

export default Audio;
