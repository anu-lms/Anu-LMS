import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import Overlay from '../../../atoms/Overlay';
import SearchIcon from '../../../atoms/Search/Icon';
import SearchBar from '../../../atoms/Search/Bar';
import SearchTabs from '../../../atoms/Search/Tabs';
import SearchResults from '../../../atoms/Search/Results';
import * as searchActions from '../../../../actions/search';

class Search extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isOpened: false,
    };

    this.onHeaderSearchClick = this.onHeaderSearchClick.bind(this);
    this.onOverlayClose = this.onOverlayClose.bind(this);
  }

  onHeaderSearchClick() {
    this.setState({ isOpened: true });
    document.body.classList.add('no-scroll');
  }

  onOverlayClose() {
    this.setState({ isOpened: false });
    document.body.classList.remove('no-scroll');
    this.props.dispatch(searchActions.clear());
  }

  render() {
    return (
      <Fragment>

        <div className="search" onClick={this.onHeaderSearchClick}>

          <input type="text" placeholder="Search" disabled="disabled" />

          <div className="header-icon search-bar">
            <div className="icon">{SearchIcon}</div>
            <div className="label">Search</div>
          </div>

        </div>

        {this.state.isOpened &&
        <Overlay
          onClose={this.onOverlayClose}
          navigation={[
            <SearchBar key="search" />
          ]}
        >
          <div className="container">
            <div className="row">
              <div className="col-12">
                <SearchTabs/>
                <SearchResults/>
              </div>
            </div>
          </div>
        </Overlay>
        }

      </Fragment>
    );
  }
}

export default connect()(Search);
