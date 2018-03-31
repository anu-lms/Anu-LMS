import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Link } from '../../../routes';
import ProfileMenu from '../../moleculas/Header/ProfileMenu';

/* eslint-disable max-len */
const Header = ({ isEmpty = false }) => (
  <header className="site-header">
    {!isEmpty &&
    <Fragment>

      <div className="beta-label">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 63 57">
          <defs>
            <filter id="a" width="135.7%" height="140%" x="-14.3%" y="-16%" filterUnits="objectBoundingBox">
              <feOffset dx="2" dy="2" in="SourceAlpha" result="shadowOffsetOuter1" />
              <feGaussianBlur in="shadowOffsetOuter1" result="shadowBlurOuter1" stdDeviation="3" />
              <feColorMatrix in="shadowBlurOuter1" result="shadowMatrixOuter1" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" />
              <feMerge>
                <feMergeNode in="shadowMatrixOuter1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <g fill="none" fillRule="nonzero" filter="url(#a)">
            <path fill="#4698C9" d="M55.671.111L0 49.833V27.41L30.688 0h24.843z" />
            <path fill="#FFF" d="M17.645 27.785a2.766 2.766 0 0 0-.7-1.702 2.407 2.407 0 0 0-1.708-.882c-.45.004-.896.099-1.309.278a2.62 2.62 0 0 0 .203-.972A2.214 2.214 0 0 0 13.473 23a2.418 2.418 0 0 0-1.288-.77 2.918 2.918 0 0 0-2.583.902l-3.22 2.882 6.713 7.403 3.171-2.834c.887-.658 1.4-1.7 1.379-2.798zm-9.52-1.82l1.827-1.625a3.432 3.432 0 0 1 1.148-.757 1.301 1.301 0 0 1 1.484.445c.408.386.544.977.343 1.5-.199.414-.488.78-.847 1.07l-1.862 1.666-2.093-2.299zm7.385 3.75l-2.205 1.966-2.366-2.605 2.03-1.812a3.62 3.62 0 0 1 1.169-.792 1.47 1.47 0 0 1 1.729.445c.28.28.456.648.497 1.041a2.077 2.077 0 0 1-.854 1.757zM24.848 21.326l-4.508 4.021-2.24-2.507 4.06-3.66-.777-.86-4.095 3.666-2.037-2.25 4.424-3.958-.819-.903-5.418 4.861 6.72 7.403 5.488-4.903zM23.994 11.889L26.5 9.632l-.798-.882-6.048 5.403.791.882L23 12.785l5.922 6.527 1.022-.916zM29.188 5.639l-1.141 1.02 3.913 9.91 1.029-.923-1.197-2.938 2.926-2.61 2.8 1.52 1.113-.993-9.443-4.986zm2.156 5.986l-1.778-4.34 4.123 2.25-2.345 2.09z" />
          </g>
        </svg>
      </div>

      <div className="left">
        <Link to="/dashboard">
          <a className="icon" rel="home">
            <svg xmlns="http://www.w3.org/2000/svg" width="34" height="29" viewBox="0 0 34 29">
              <g fill="none" fillRule="evenodd">
                <path fill="#FFF" fillRule="nonzero" d="M13.667 28.333v-10h6.666v10h8.334V15h5L17 0 .333 15h5v13.333z" />
              </g>
            </svg>
          </a>
        </Link>
      </div>

      <div className="right">
        {/* <div className="search">
          <input type="text" />
          <div className="icon search">
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
              <g fill="none" fillRule="evenodd">
                <path fill="#FFF" fillRule="nonzero" d="M20.833 18.333h-1.316l-.467-.45a10.785 10.785 0 0 0 2.617-7.05C21.667 4.85 16.817 0 10.833 0 4.85 0 0 4.85 0 10.833c0 5.984 4.85 10.834 10.833 10.834 2.684 0 5.15-.984 7.05-2.617l.45.467v1.316l8.334 8.317 2.483-2.483-8.317-8.334zm-10 0a7.49 7.49 0 0 1-7.5-7.5c0-4.15 3.35-7.5 7.5-7.5s7.5 3.35 7.5 7.5-3.35 7.5-7.5 7.5z"/>
              </g>
            </svg>
          </div>
        </div>*/}

        <Link to="/notebook">
          <a className="icon notebook">
            <svg xmlns="http://www.w3.org/2000/svg" width="29" height="34" viewBox="0 0 29 34">
              <g fill="none" fillRule="evenodd">
                <path fill="#FFF" fillRule="nonzero" d="M25 .333H5a3.333 3.333 0 0 0-3.333 3.334v1.666a1.667 1.667 0 1 0 0 3.334V12a1.667 1.667 0 0 0 0 3.333v3.334a1.667 1.667 0 1 0 0 3.333v3.333a1.667 1.667 0 0 0 0 3.334v1.666A3.333 3.333 0 0 0 5 33.667h20a3.333 3.333 0 0 0 3.333-3.334V3.667A3.333 3.333 0 0 0 25 .333zM6.667 7h10v2.5h-10V7zm16.666 17.5H6.667V22h16.666v2.5zm0-5H6.667V17h16.666v2.5zm0-5H6.667V12h16.666v2.5z" />
              </g>
            </svg>
          </a>
        </Link>

        <ProfileMenu />

      </div>
    </Fragment>
    }
  </header>
);

Header.propTypes = {
  isEmpty: PropTypes.bool,
};

export default Header;
