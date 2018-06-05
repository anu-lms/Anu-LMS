import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SearchIcon from '../../../atoms/Search/Icon';
import SearchBar from '../../../atoms/Search/Bar';
import SearchTabs from '../../../atoms/Search/Tabs';
import SearchResults from '../../../atoms/Search/Results';
import * as searchActions from '../../../../actions/search';
import * as overlayActions from '../../../../actions/overlay';

class Search extends React.Component {
  constructor(props) {
    super(props);

    this.onHeaderSearchClick = this.onHeaderSearchClick.bind(this);
    this.onOverlayClose = this.onOverlayClose.bind(this);
  }

  onHeaderSearchClick() {
    const { dispatch } = this.props;

    const header = <SearchBar />;

    const content = (
      <div className="container search-overlay-content">
        <div className="row">
          <div className="col-12">
            <SearchTabs />
            <SearchResults />
          </div>
        </div>
      </div>
    );

    // Open an overlay with search components inside of it.
    dispatch(overlayActions.open(content, header, this.onOverlayClose));
  }

  onOverlayClose() {
    this.props.dispatch(searchActions.clear());
  }

  render() {
    return (
      <div className="search" onClick={this.onHeaderSearchClick} onKeyPress={() => {}}>

        <input type="text" placeholder="Search" disabled="disabled" />

        <div className="header-icon search-bar">
          <div className="icon">{SearchIcon}</div>
          <div className="label">Search</div>
        </div>

      </div>
    );
  }
}

Search.propTypes = {
  dispatch: PropTypes.func,
};

Search.defaultProps = {
  dispatch: () => {},
};

export default connect()(Search);
