import React from 'react';
import { Link } from '../../../../routes';
import Button from '../../../atoms/Button';
import Separator from '../../../atoms/Separator';
import LoginForm from '../../../moleculas/Form/Login';

const LoginPageTemplate = () => (
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

            <Link to="/user/forgot">
              <a className="forgot-password" href="#">
                Forgot username or password?
              </a>
            </Link>

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
          <li className="d-inline-block"><a href="https://anu.solutions/" target="_blank">About Us</a></li>
          <li className="d-inline-block"><a href="#">Privacy</a></li>
          <li className="d-inline-block"><a href="https://www.krengeltech.com/legal" target="_blank">Legal</a></li>
        </ul>
      </div>
      <div className="col-12">
        <p className="caption">Copyright 2018 Anu © All Rights Reserved</p>
      </div>
    </div>

  </div>
);

export default LoginPageTemplate;
