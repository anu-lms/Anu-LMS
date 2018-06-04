import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const SearchResults = ({ results, isFetched, isError }) => (
  <div className="search-results">

    {!isError && results.map(result => (
      <div className="item" key={result.entity.uuid}>
        <div className="title">{result.entity.title}</div>
        {/* eslint-disable-next-line react/no-danger */}
        <div className="body" dangerouslySetInnerHTML={{ __html: result.excerpt }} />
      </div>
    ))}

    {results.length === 0 && isFetched &&
    <div className="empty-results">
      There are no search results. Please someone smart - update this copy.
    </div>
    }

    {isError &&
    <div className="error">
      The error has occurred. Please someone smart - update this copy.
    </div>
    }

  </div>
);

SearchResults.propTypes = {
  results: PropTypes.arrayOf(PropTypes.shape()),
  isFetching: PropTypes.bool,
  isFetched: PropTypes.bool,
  isError: PropTypes.bool,
};

SearchResults.defaultProps = {
  results: [],
  isFetching: false,
  isFetched: false,
  isError: false,
};

const mapStateToProps = ({ search }) => ({
  results: search.results,
  isFetching: search.isFetching,
  isFetched: search.isFetched,
  isError: search.isError,
});

export default connect(mapStateToProps)(SearchResults);
