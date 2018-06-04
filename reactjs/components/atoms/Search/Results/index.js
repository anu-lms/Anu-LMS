import React, { Component } from 'react';
import { connect } from 'react-redux';

class SearchResults extends Component {

  render() {
    const { results, isFetching, isFetched, isError } = this.props;
    return (
      <div className="search-results">

        {!isError && results.map(result => (
          <div className="item" key={result.entity.uuid}>
            <div className="title">{result.entity.title}</div>
            <div className="body" dangerouslySetInnerHTML={{ __html: result.excerpt }}/>
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
  }
}

const mapStateToProps = ({ search }) => ({
  results: search.results,
  isFetching: search.isFetching,
  isFetched: search.isFetched,
  isError: search.isError,
});

export default connect(mapStateToProps)(SearchResults);
