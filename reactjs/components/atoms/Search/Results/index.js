import React from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import { connect } from 'react-redux';
import { Scrollbars } from 'react-custom-scrollbars';
import SearchTabs from '../Tabs';
import Empty from '../Empty';

const availableSearchComponents = {
  'lesson': dynamic(import('../LessonItem')),
  'paragraph_comment': dynamic(import('../CommentItem')),
  'notebook': dynamic(import('../NotebookItem')),
  'media_resource': dynamic(import('../ResourceItem')),
};

class SearchResults extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showTabsBorder: false,
    };

    this.toggleTabsBorder = this.toggleTabsBorder.bind(this);
  }

  /**
   * Show border under tabs when user scroll down.
   */
  toggleTabsBorder() {
    const tabs = document.getElementById('search-tabs');
    const list = document.getElementById('search-results-list');
    const tabsBottom = tabs.getBoundingClientRect().bottom;

    if (!this.state.showTabsBorder && list.getBoundingClientRect().top < tabsBottom) {
      this.setState({ showTabsBorder: true });
    }
    else if (this.state.showTabsBorder && list.getBoundingClientRect().top >= tabsBottom) {
      this.setState({ showTabsBorder: false });
    }
  }

  render() {
    const { query, results, isFetched, isError } = this.props;

    return (
      <div className="search-container">
        {query && query.length > 1 &&
        <SearchTabs showBorder={this.state.showTabsBorder} />
        }

        <div className="search-results">
          <Scrollbars style={{ height: '100%' }} onScroll={this.toggleTabsBorder}>
            <div id="search-results-list" className="inner-wrapper">
              <div className="inner">

                {!isError && results.length > 0 &&
                <div className="list">
                  {results.map(resultItem => {
                    const SearchItemComponent = availableSearchComponents[resultItem.type];
                    if (SearchItemComponent) {
                      // eslint-disable-next-line max-len
                      return <SearchItemComponent key={resultItem.entity.uuid} searchItem={resultItem} />;
                    }

                    return null;
                  })}
                </div>
                }

                {query && query.length > 1 && results.length === 0 && isFetched && !isError &&
                <Empty />
                }

                {isError &&
                <div className="search-error">
                  {/* eslint-disable-next-line max-len */}
                  The error has occurred. Please try to reload the page or contact site administrator.
                </div>
                }
              </div>
            </div>
          </Scrollbars>
        </div>
      </div>
    );
  }
}

SearchResults.propTypes = {
  results: PropTypes.arrayOf(PropTypes.shape),
  query: PropTypes.string,
  isFetching: PropTypes.bool,
  isFetched: PropTypes.bool,
  isError: PropTypes.bool,
};

SearchResults.defaultProps = {
  results: [],
  query: '',
  isFetching: false,
  isFetched: false,
  isError: false,
};

const mapStateToProps = ({ search }) => ({
  query: search.query,
  results: search.results,
  isFetching: search.isFetching,
  isFetched: search.isFetched,
  isError: search.isError,
});

export default connect(mapStateToProps)(SearchResults);
