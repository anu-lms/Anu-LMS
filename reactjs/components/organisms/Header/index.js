import React from 'react';
import { Link } from '../../../routes';

const Header = () => (
  <header>

    <div className="left">
      <Link to="/">
        <a className="icon" rel="home">
          <svg xmlns="http://www.w3.org/2000/svg" width="34" height="29" viewBox="0 0 34 29">
            <g fill="none" fillRule="evenodd">
              <path fill="#FFF" fillRule="nonzero" d="M13.667 28.333v-10h6.666v10h8.334V15h5L17 0 .333 15h5v13.333z"/>
              <path d="M-3-5h40v40H-3z"/>
            </g>
          </svg>
        </a>
      </Link>
    </div>

    <div className="right">

      <div className="search">
        <input type="text" />
        <div className="icon search">
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
            <g fill="none" fillRule="evenodd">
              <path fill="#FFF" fillRule="nonzero" d="M20.833 18.333h-1.316l-.467-.45a10.785 10.785 0 0 0 2.617-7.05C21.667 4.85 16.817 0 10.833 0 4.85 0 0 4.85 0 10.833c0 5.984 4.85 10.834 10.833 10.834 2.684 0 5.15-.984 7.05-2.617l.45.467v1.316l8.334 8.317 2.483-2.483-8.317-8.334zm-10 0a7.49 7.49 0 0 1-7.5-7.5c0-4.15 3.35-7.5 7.5-7.5s7.5 3.35 7.5 7.5-3.35 7.5-7.5 7.5z"/>
            </g>
          </svg>
        </div>
      </div>

      <div className="icon notifications">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="30" viewBox="0 0 24 30">
          <path fill="#FFF" fillRule="nonzero" d="M12 30c1.65 0 3-1.35 3-3H9a3 3 0 0 0 3 3zm9-9v-7.5c0-4.605-2.46-8.46-6.75-9.48V3A2.247 2.247 0 0 0 12 .75 2.247 2.247 0 0 0 9.75 3v1.02C5.445 5.04 3 8.88 3 13.5V21l-3 3v1.5h24V24l-3-3z"/>
        </svg>
      </div>

      <div className="icon profile">
        <svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" viewBox="0 0 33 33">
          <g fill="none" fillRule="evenodd">
            <path fill="#FFF" fillRule="nonzero" d="M16.5 0C7.392 0 0 7.392 0 16.5S7.392 33 16.5 33 33 25.608 33 16.5 25.608 0 16.5 0zm0 4.95a4.943 4.943 0 0 1 4.95 4.95 4.943 4.943 0 0 1-4.95 4.95 4.943 4.943 0 0 1-4.95-4.95 4.943 4.943 0 0 1 4.95-4.95zm0 23.43a11.88 11.88 0 0 1-9.9-5.313c.05-3.284 6.6-5.082 9.9-5.082 3.284 0 9.85 1.799 9.9 5.082a11.88 11.88 0 0 1-9.9 5.313z"/>
          </g>
        </svg>
      </div>

    </div>

  </header>
);

export default Header;
