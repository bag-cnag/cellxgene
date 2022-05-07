import React, { Component } from "react";
import Keycloak from "keycloak-js";
import cnag_auth from "./cnag_auth";
// import Home from "./home/Home";

import Config from 'Config';
import actions from "../actions";

import store from '../reducers';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keycloak: null,
      authenticated: false,
    };
  }

  componentDidMount() {

    console.log("Login componentDidMount");

    // debugger;
    // let config = window.config
    let config = Config;
    console.log('config', config)

    let keycloak = Keycloak({
      realm: config.config_keycloak.realm,
      url: config.config_keycloak["auth-server-url"],
      clientId: config.config_keycloak.resource,
    });

    // if (this.props.location.state !== undefined) {
    //   window.location.href =
    //     window.location.href +
    //     "?redirect=" +
    //     this.props.location.state.from.pathname;
    // }

    keycloak
      .init({ onLoad: "login-required", checkLoginIframe: false })
      .then((authenticated) => {
        this.setState({ keycloak, authenticated });
        let appState = {
          authenticated,
          keycloak,
        };

        console.log(store.getState())
        store.dispatch(actions.setLoginStatusTrue())
        
        cnag_auth.setToken(appState);
        // this.props.history.push(window.location.href.split("=")[1]);
      });
  }

  render() {
    if (this.state.keycloak) {
      if (this.state.authenticated) {
        return (
          <div className={"main"}>
            {/* <Home /> */}
          </div>
        );
      } else return <div className={"main"}>Unable to authenticate!</div>;
    }
    return <div className={"main"}>Initializing Keycloak...</div>;
  }
}

export default Login;
