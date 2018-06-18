import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const SearchTabs = ({ activeTab, showBorder, onTabClick }) => {
  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'media', label: 'Media' },
    { id: 'resources', label: 'Resources' },
  ];
  return (
    <div id="search-tabs" className={classNames('search-tabs', { 'show-border': showBorder })}>
      <div className="inner-wrapper">
        <div className="inner">
          {tabs.map(tab => (
            <span
              key={tab.id}
              className={classNames({ 'active': activeTab === tab.id })}
              onClick={() => { onTabClick(tab.id); }}
              onKeyPress={() => { onTabClick(tab.id); }}
            >
              {tab.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

SearchTabs.propTypes = {
  showBorder: PropTypes.bool,
  onTabClick: PropTypes.func,
  activeTab: PropTypes.oneOf(['all', 'media', 'resources']),
};

SearchTabs.defaultProps = {
  showBorder: false,
  activeTab: 'all',
  onTabClick: () => {},
};

export default SearchTabs;
