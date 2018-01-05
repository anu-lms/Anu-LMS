import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '../../routes';
import matchesCurrentUrl from '../../lib/matchesCurrentUrl';

const Sections = ({ items, pathname }) => (
  <ul>
    { items.map(item => (
      <li
        key={item.url}
        className={matchesCurrentUrl(pathname, item.url) ? 'active' : ''}
      >
        <Link to={item.url}><a>{item.name}</a></Link>
      </li>
    ))}
  </ul>
);

Sections.propTypes = {
  pathname: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    url: PropTypes.string,
    subSections: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      url: PropTypes.string,
    })),
  })),
};

export default Sections;
