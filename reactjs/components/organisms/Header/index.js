import React, { Fragment } from 'react';
import { Link } from '../../../routes';
import ProfileMenu from '../../moleculas/Header/ProfileMenu';

const Header = ({isEmpty = false}) => (
  <header>
    {!isEmpty &&
    <Fragment>
      <div className="left">
        <Link to="/dashboard">
          <a className="icon" rel="home">
            <svg xmlns="http://www.w3.org/2000/svg" width="34" height="29" viewBox="0 0 34 29">
              <g fill="none" fillRule="evenodd">
                <path fill="#FFF" fillRule="nonzero" d="M13.667 28.333v-10h6.666v10h8.334V15h5L17 0 .333 15h5v13.333z"/>
              </g>
            </svg>
          </a>
        </Link>
      </div>

      <div className="right">

        {/*<div className="search">
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
                <path fill="#FFF" fillRule="nonzero" d="M25 .333H5a3.333 3.333 0 0 0-3.333 3.334v1.666a1.667 1.667 0 1 0 0 3.334V12a1.667 1.667 0 0 0 0 3.333v3.334a1.667 1.667 0 1 0 0 3.333v3.333a1.667 1.667 0 0 0 0 3.334v1.666A3.333 3.333 0 0 0 5 33.667h20a3.333 3.333 0 0 0 3.333-3.334V3.667A3.333 3.333 0 0 0 25 .333zM6.667 7h10v2.5h-10V7zm16.666 17.5H6.667V22h16.666v2.5zm0-5H6.667V17h16.666v2.5zm0-5H6.667V12h16.666v2.5z"/>
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

export default Header;
