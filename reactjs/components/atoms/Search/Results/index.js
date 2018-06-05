import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LessonItem from '../LessonItem';
import CommentItem from '../CommentItem';

const SearchResults = ({ results, isFetched, isError }) => (
  <div className="search-results">

    {!isError && results.map(resultItem => {
      switch (resultItem.type) {
        case 'lesson':
          return <LessonItem key={resultItem.entity.uuid} searchItem={resultItem} />;
        case 'paragraph_comment':
          return <CommentItem key={resultItem.entity.uuid} searchItem={resultItem} />;
        default:
          return null;
      }
    })}

    {results.length === 0 && isFetched && !isError &&
    <div>
      There are no search results. Please someone smart - update this copy.
    </div>
    }

    {isError &&
    <div>
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
