import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import SearchIcon from '../Icon';
import * as searchActions from '../../../../actions/search';

class SearchBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
    };

    this.onValueChange = this.onValueChange.bind(this);
    this.onClearInputClick = this.onClearInputClick.bind(this);
  }

  componentDidMount() {
    this.searchInput.focus();
  }

  onValueChange(event) {
    this.setState({ value: event.target.value });
    this.props.dispatch(searchActions.fetch(event.target.value));
  }

  onClearInputClick() {
    this.setState({ value: '' });
    this.searchInput.focus();
    this.props.dispatch(searchActions.clear());
  }

  render() {
    return (
      <div className="search-container">
        <div className="inner">
          <input
            type="text"
            placeholder="Search"
            ref={input => { this.searchInput = input; }}
            value={this.state.value}
            onChange={this.onValueChange}
          />
          <div className="search-bar">
            <div className="icon">{SearchIcon}</div>
          </div>
          {this.state.value !== '' &&
          <div className="clear" onClick={this.onClearInputClick} onKeyPress={() => {}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10">
              <g fill="none" fillRule="evenodd">
                <path fill="#FFF" fillRule="nonzero" d="M9.667 1.273l-.94-.94L5 4.06 1.273.333l-.94.94L4.06 5 .333 8.727l.94.94L5 5.94l3.727 3.727.94-.94L5.94 5z" />
              </g>
            </svg>
          </div>
          }
        </div>
      </div>
    );
  }
}

SearchBar.propTypes = {
  dispatch: PropTypes.func,
};

SearchBar.defaultProps = {
  dispatch: () => {},
};

export default connect()(SearchBar);
