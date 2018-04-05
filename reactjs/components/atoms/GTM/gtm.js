import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import gtmParts from 'react-google-tag-manager';

class GoogleTagManager extends React.Component {
  componentDidMount() {
    const { dataLayerName, scriptId } = this.props;

    if (!window[dataLayerName]) {
      const gtmScriptNode = document.getElementById(scriptId);

      eval(gtmScriptNode.textContent); // eslint-disable-line no-eval
    }
  }

  render() {
    const {
      gtmId, dataLayerName, additionalEvents, previewVariables,
    } = this.props;

    const gtm = gtmParts({
      id: gtmId, dataLayerName, additionalEvents, previewVariables,
    });

    return (
      <Fragment>
        {gtm.scriptAsReact()}
      </Fragment>
    );
  }
}

GoogleTagManager.propTypes = {
  gtmId: PropTypes.string.isRequired,
  dataLayerName: PropTypes.string,
  additionalEvents: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  previewVariables: PropTypes.string,
  scriptId: PropTypes.string,
};

GoogleTagManager.defaultProps = {
  dataLayerName: 'dataLayer',
  additionalEvents: {},
  previewVariables: false,
  scriptId: 'react-google-tag-manager-gtm',
};

export default GoogleTagManager;
