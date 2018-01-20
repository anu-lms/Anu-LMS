import React from 'react';

export default ({ text }) => (
  <div className="container">
    <div className="row">
      <div className="col" dangerouslySetInnerHTML={{ __html: text }} />
    </div>
  </div>
);
