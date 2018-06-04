import React from 'react';

class SearchTabs extends React.Component {

  render() {
    return (
      <div className="search-tabs">
          <span className="active">All</span>
          <span>Media</span>
          <span>Resources</span>
      </div>
    );
  }
}

export default SearchTabs;
