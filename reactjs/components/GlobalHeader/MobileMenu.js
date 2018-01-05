import React from 'react';
import PropTypes from 'prop-types';
import MobileSections from './MobileSections';
import { Link } from '../../routes';
import matchesCurrentUrl from '../../lib/matchesCurrentUrl';
import AdminLinkForEdit from '../AdminLinkForEdit';

class MobileMenu extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      idOpenNode: 0, // 0 - все закрыты
    };
  }

  getClassName(itemUrl, sections, index) {
    let className = '';
    if (matchesCurrentUrl(this.props.pathname, itemUrl)) className += 'active ';
    if (sections) {
      className = this.state.idOpenNode === index + 1 ? `${className}arrow-down` : `${className}arrow-up`;
    }
    return className;
  }

  toogleMenu(id) {
    if (this.state.idOpenNode === id) this.setState({ idOpenNode: 0 });
    else this.setState({ idOpenNode: id });
  }

  render() {
    return (
      <AdminLinkForEdit link={this.props.menuData.edit}>
        <ul className="nav navbar-nav-mobile pull-right">
          { this.props.menuData.menu.map((item, index) => (
            <li
              key={item.url}
              className={this.getClassName(item.url, !!item.sections, index)}
            >
              <Link to={item.url}><a>{item.name}</a></Link>
              { item.sections && this.props.countSectionsMenu > 0
                ?
                <i
                  onClick={() => this.toogleMenu(index + 1)}
                  className={`fa fa-caret-${this.state.idOpenNode === index + 1 ? 'up' : 'down'}`}
                  aria-hidden="true"
                />
                : ''
              }
              { item.sections
              && this.state.idOpenNode === index + 1
              && <MobileSections
                items={item.sections}
                pathname={this.props.pathname}
                closeMenuFunc={this.props.closeMenuFunc}
              />
              }

            </li>
          ))}
        </ul>
      </AdminLinkForEdit>
    );
  }
}

MobileMenu.propTypes = {
  closeMenuFunc: PropTypes.func,
  pathname: PropTypes.string,
  menuData: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    url: PropTypes.string,
    sections: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      url: PropTypes.string,
    })),
  })),
};

export default MobileMenu;
