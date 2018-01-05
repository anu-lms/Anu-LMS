import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '../../routes';
import matchesCurrentUrl from '../../lib/matchesCurrentUrl';

const MobileSections = ({ items, pathname, closeMenuFunc }) => {
  function closeAndScroll(e, name) {
    closeMenuFunc(e);
    scrollToElementName(e, name);
  }
  return (
    <ul className="mobile-submenu">
      {items.map((item, index) => (
        <li key={index} className={matchesCurrentUrl(pathname, item.url) ? 'active' : ''}>
          <Link to={item.url}><a>{item.name}</a></Link>
        </li>
      ))}
    </ul>
  );
};

MobileSections.propTypes = {
  closeMenuFunc: PropTypes.func,
  pathname: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    url: PropTypes.string,
  })),
};

export default MobileSections;
