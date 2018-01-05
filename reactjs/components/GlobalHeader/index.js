import React from 'react';
import PropTypes from 'prop-types';
import DesktopMenu from './DesktopMenu';
import MobileMenu from './MobileMenu';
import { Link } from '../../routes';
import AdminLinkForEdit from '../AdminLinkForEdit';

class GlobalHeader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      menuExpanded: false,
    };

    this.toggleMenu = this.toggleMenu.bind(this);
  }

  toggleMenu(e) {
    e.preventDefault();
    this.setState({ menuExpanded: !this.state.menuExpanded });
  }

  render() {
    return (
      <header>
        <div className="navbarwrapper navbar-fixed-top">
          <nav className="navbar">
            <div className="container">
              <div className="row">
                <div className="header-iw">
                  <div itemScope itemType="http://schema.org/Organization" >
                    <meta itemProp="url" content={this.props.domain} style={{ display: 'none' }} />
                    {!!this.props.logoData.url && <meta itemProp="logo" content={this.props.logoData.url} style={{ display: 'none' }} />}
                    <AdminLinkForEdit link={this.props.logoData.edit}>
                      <Link to="/">
                        <a className="navbar-brand">
                          {this.props.logoData.url_logo_style
                            ?
                            <img
                              src={this.props.logoData.url_logo_style}
                              alt={this.props.logoData.alt ? this.props.logoData.alt : this.props.siteName}
                            />
                            : <div>{this.props.siteName}</div>
                          }
                        </a>
                      </Link>
                    </AdminLinkForEdit>
                  </div>
                  <div className="navbar-header">
                    <button className="navbar-toggle" onClick={this.toggleMenu} type="button">
                      <span className="sr-only" />
                      <span className="icon-bar" />
                      <span className="icon-bar" />
                      <span className="icon-bar" />
                    </button>
                  </div>
                  <div className="collapse navbar-collapse navbar-ex1-collapse">
                    <div className="cl-effect-12">
                      <AdminLinkForEdit link={this.props.menuData.edit}>
                        <DesktopMenu
                          menuData={this.props.menuData.menu}
                          countSectionsMenu={this.props.countSectionsMenu}
                          pathname={this.context.pathname}
                        />
                      </AdminLinkForEdit>
                    </div>
                  </div>
                </div>
                { this.state.menuExpanded &&
                <MobileMenu
                  closeMenuFunc={this.toggleMenu}
                  menuData={this.props.menuData}
                  pathname={this.context.pathname}
                />
                }
              </div>
            </div>
          </nav>
        </div>
      </header>
    );
  }
}

GlobalHeader.contextTypes = {
  pathname: PropTypes.string,
};

GlobalHeader.defaultProps = {
  countSectionsMenu: 2,
  logoData: {},
  menuData: {edit: '', menu: []}
};

GlobalHeader.propTypes = {
  siteName: PropTypes.string,
  domain: PropTypes.string,
  logoData: PropTypes.shape({
    url: PropTypes.string,
    alt: PropTypes.string,
    title: PropTypes.string,
    url_logo_style: PropTypes.string,
  }),
  countSectionsMenu: PropTypes.number,
  menuData: PropTypes.shape({
    menu: PropTypes.arrayOf(PropTypes.shape({
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
    edit: PropTypes.string,
  }),
  title: PropTypes.string,
  subTitle: PropTypes.string,
};

export default GlobalHeader;
