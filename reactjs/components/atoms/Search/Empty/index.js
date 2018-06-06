import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const EmptySearchItem = ({ searchQuery }) => (
  <div className="search-empty-text">
    No results for <span className="search-query">{searchQuery}.</span>
  </div>
);

EmptySearchItem.propTypes = {
  searchQuery: PropTypes.string.isRequired,
};

const mapStateToProps = ({ search }) => ({
  searchQuery: search.query,
});

export default connect(mapStateToProps)(EmptySearchItem);
