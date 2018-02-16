import React, { Fragment } from 'react';

class OneColumnLayout extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="one-column-layout container">
        {this.props.pageTitle &&
          <div className="row justify-content-center">
            <div className="col-12 col-md-8 col-lg-12">
              <h1>{this.props.pageTitle}</h1>
            </div>
          </div>
        }
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-8">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

export default OneColumnLayout;
