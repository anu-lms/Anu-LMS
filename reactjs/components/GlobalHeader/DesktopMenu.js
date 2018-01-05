import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '../../routes';
import Sections from './Sections';
import matchesCurrentUrl from '../../lib/matchesCurrentUrl';

const DesktopMenu = ({ menuData, pathname, countSectionsMenu }) => (
  <ul className="nav navbar-nav pull-right">
    { menuData.map(item => (
      <li key={item.url} className={matchesCurrentUrl(pathname, item.url) ? 'active' : ''}>
        <Link to={item.url}><a>{item.name}</a></Link>

        { item.sections && countSectionsMenu > 0
          && <Sections items={item.sections} pathname={pathname} />
        }
      </li>
    ))}
  </ul>
);

DesktopMenu.propTypes = {
  countSectionsMenu: PropTypes.number,
  pathname: PropTypes.string,
  menuData: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    url: PropTypes.string,
    sections: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      url: PropTypes.string,
      subSections: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        url: PropTypes.string,
      })),
    })),
  })),
};

export default DesktopMenu;
