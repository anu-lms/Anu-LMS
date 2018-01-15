import React from 'react';
import App from '../application/App';
import Test from '../components/atoms/Test';
import LoginForm from '../components/moleculas/Form/Login';
import { isLogged } from '../utils/authentication';

const FrontPage = () => (
  <App>

    { isLogged() &&
    <p>Logged in</p>
    }

    { !isLogged() &&
    <div className="container-fluid page-login">

      <div className="row content">
        <div className="overlay" />
        <div className="col">

          <img className="logo" src="/static/img/logo.png" />

          <h1 className="heading">
            This is your tagline.<br/>
            Learn your way, your pace.
          </h1>

          <div className="login-block">
            <LoginForm />
          </div>


        </div>
      </div>

      <div className="row footer">
        <div className="col">
         <ul className="links">
           <li className="d-inline"><a href="#">About Us</a></li>
           <li className="d-inline"><a href="#">Our Partners</a></li>
           <li className="d-inline"><a href="#">Privacy</a></li>
           <li className="d-inline"><a href="#">Legal</a></li>
         </ul>
          <p>Copyright 2018 Anu (c) All Rights Reserved</p>
        </div>
      </div>

    </div>
    }

  </App>
);

export default FrontPage;
