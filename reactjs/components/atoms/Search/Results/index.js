import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Scrollbars } from 'react-custom-scrollbars';
import SearchTabs from '../Tabs';
import Empty from '../Empty';
import LessonItem from '../LessonItem';
import CommentItem from '../CommentItem';
import NotebookItem from '../NotebookItem';
import ResourceItem from '../ResourceItem';
import MediaItem from '../MediaItem';
import * as searchActions from '../../../../actions/search';


class SearchResults extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showTabsBorder: false,
    };

    this.toggleTabsBorder = this.toggleTabsBorder.bind(this);
    this.tabClick = this.tabClick.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    // Don't rerender results list if search in progress.
    return !nextProps.isFetching;
  }

  getSearchComponent(type, category) {
    const components = {
      'lesson': category === 'media' ? MediaItem : LessonItem,
      'paragraph_comment': CommentItem,
      'notebook': NotebookItem,
      'media_resource': ResourceItem,
    };
    return components[type] ? components[type] : null;
  }

  tabClick(category) {
    const { query } = this.props;
    this.props.dispatch(searchActions.fetch(query, category));
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
    const { category, query, results, isFetched, isError } = this.props;

    return (
      <div className="search-container">
        {query && query.length > 1 &&
        <SearchTabs
          activeTab={category}
          onTabClick={this.tabClick}
          showBorder={this.state.showTabsBorder}
        />
        }

        <div className="search-results">
          <Scrollbars style={{ height: '100%' }} onScroll={this.toggleTabsBorder}>
            <div id="search-results-list" className="inner-wrapper">
              <div className="inner">

                {!isError && results.length > 0 &&
                <div className="list">
                  {results.map(resultItem => {
                    const SearchItemComponent = this.getSearchComponent(resultItem.type, category);
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
  category: PropTypes.oneOf(['all', 'media', 'resources']),
  isFetching: PropTypes.bool,
  isFetched: PropTypes.bool,
  isError: PropTypes.bool,
  dispatch: PropTypes.func.isRequired,
};

SearchResults.defaultProps = {
  results: [],
  query: '',
  category: 'all',
  isFetching: false,
  isFetched: false,
  isError: false,
};

const mapStateToProps = ({ search }) => ({
  query: search.query,
  category: search.category,
  results: search.results,
  isFetching: search.isFetching,
  isFetched: search.isFetched,
  isError: search.isError,
});

export default connect(mapStateToProps)(SearchResults);
