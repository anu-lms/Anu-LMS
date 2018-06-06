import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const SearchTabs = ({ showBorder }) => (
  <div id="search-tabs" className={classNames('search-tabs', { 'show-border': showBorder })}>
    <div className="inner-wrapper">
      <div className="inner">
        <span className="active">All</span>
        <span>Media</span>
        <span>Resources</span>
      </div>
    </div>
  </div>
);

SearchTabs.propTypes = {
  showBorder: PropTypes.bool,
};

SearchTabs.defaultProps = {
  showBorder: false,
};

export default SearchTabs;
