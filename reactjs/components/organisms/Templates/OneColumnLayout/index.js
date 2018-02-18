import React, { Fragment } from 'react';

class OneColumnLayout extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    let layoutClass = 'one-column-layout container';

    // Add extra classes.
    if (this.props.className) {
      layoutClass += ' ' + this.props.className;
    }

    return (
      <div className={layoutClass}>
        {this.props.pageTitle &&
          <div className="row justify-content-center title">
            <div className="col-12 col-md-8 col-lg-12">
              <h1>{this.props.pageTitle}</h1>
            </div>
          </div>
        }
        <div className="row justify-content-center content">
          <div className="col-12 col-md-8 col-lg-8">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

export default OneColumnLayout;
