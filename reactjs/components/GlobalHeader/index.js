import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '../../routes';

class GlobalHeader extends React.Component {
  render() {
    return (
      <header>
        Header
      </header>
    );
  }
}

GlobalHeader.contextTypes = {
  pathname: PropTypes.string,
};

GlobalHeader.defaultProps = {

};

GlobalHeader.propTypes = {

};

export default GlobalHeader;
