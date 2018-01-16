import React from 'react';
import App from '../application/App';
import LoginForm from '../components/moleculas/Form/Login';
import Button from '../components/atoms/Button';
import Separator from '../components/atoms/Separator';
import { isLogged } from '../utils/authentication';

const FrontPage = () => (
  <App>

    { isLogged() &&
    <p>Logged in</p>
    }

    { !isLogged() &&
    <div className="container-fluid page-login">

      <div className="overlay" />

      <div className="row header">
        <div className="col">
          <img src={"/static/img/logo.png"} />
        </div>
      </div>

      <div className="container">

        <div className="row content">
          <div className="col col-12 col-lg-6">
            <h1 className="heading">
              This is your tagline.<br/>
              Learn your way, your pace.
            </h1>
          </div>

          <div className="col col-12 col-lg-6">
            <div className="login-block">
              <LoginForm />

              <a className="forgot-password" href="#">
                Forgot username or password?
              </a>

              <Separator />

              <Button block type={'secondary'}>
                New? Register here
              </Button>
            </div>
          </div>

        </div>

      </div>

      <div className="row footer">
        <div className="col-12">
          <ul className="links">
            <li className="d-inline-block"><a href="#">About Us</a></li>
            <li className="d-inline-block"><a href="#">Our Partners</a></li>
            <li className="d-inline-block"><a href="#">Privacy</a></li>
            <li className="d-inline-block"><a href="#">Legal</a></li>
          </ul>
        </div>
        <div className="col-12">
          <p>Copyright 2018 Anu © All Rights Reserved</p>
        </div>
      </div>

    </div>
    }

  </App>
);

export default FrontPage;
