import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SearchIcon from '../../../atoms/Search/Icon';
import SearchBar from '../../../atoms/Search/Bar';
import SearchResults from '../../../atoms/Search/Results';
import * as searchActions from '../../../../actions/search';
import * as overlayActions from '../../../../actions/overlay';

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOverlayOpened: false,
    };

    this.onHeaderSearchClick = this.onHeaderSearchClick.bind(this);
    this.onOverlayClose = this.onOverlayClose.bind(this);
  }

  onHeaderSearchClick() {
    const { dispatch } = this.props;

    const header = <SearchBar />;

    const content = <SearchResults />;

    // Open an overlay with search components inside of it.
    dispatch(overlayActions.open(content, header, this.onOverlayClose));

    // Hide search input in header when overlay opened.
    this.setState({ isOverlayOpened: true });
  }

  onOverlayClose() {
    this.props.dispatch(searchActions.clear());

    // Show back search input in header when overlay closed.
    this.setState({ isOverlayOpened: false });
  }

  render() {
    return (
      <Fragment>
        {!this.state.isOverlayOpened &&
        <div className="search" onClick={this.onHeaderSearchClick} onKeyPress={() => {}}>
          <input type="text" placeholder="Search" value="" onChange={() => {}} />

          <div className="header-icon search-bar">
            <div className="icon"><SearchIcon /></div>
            <div className="label">Search</div>
          </div>

        </div>
      }
      </Fragment>
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
