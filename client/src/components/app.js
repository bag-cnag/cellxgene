import React from "react";
import Helmet from "react-helmet";
import { connect } from "react-redux";

import Container from "./framework/container";
import Layout from "./framework/layout";
import LeftSideBar from "./leftSidebar";
import RightSideBar from "./rightSidebar";
import Legend from "./continuousLegend";
import Graph from "./graph/graph";
import MenuBar from "./menubar";
import Autosave from "./autosave";
import Embedding from "./embedding";

import actions from "../actions";

// needed for kc login
import cnag_auth from "./cnag_auth";
import Login from "./cnag_login";
import Route from "./cnag_route"

import { Redirect } from "react-router-dom";

// const showLogin = () => {
//   if (window.location.pathname === "/login") {
//     return <Login />
//   }
// }

@connect((state) => ({
  loading: state.controls.loading,
  error: state.controls.error,
  graphRenderCounter: state.controls.graphRenderCounter,
  loggedIn: state.controls.loggedIn,
}))
class App extends React.Component {
  componentDidMount() {
    debugger;

    const { dispatch, loggedIn } = this.props;

    /* listen for url changes, fire one when we start the app up */
    window.addEventListener("popstate", this._onURLChanged);
    this._onURLChanged();

    // TODO
    // only allow doInitalDataLoad if user is logged in via Keycloak
    if (cnag_auth.user.authenticated) {
      dispatch(actions.doInitialDataLoad(window.location.search));
    }

    dispatch(actions.doInitialDataLoad(window.location.search));
    this.forceUpdate();
  }

  _onURLChanged() {
    const { dispatch } = this.props;

    dispatch({ type: "url changed", url: document.location.href });
  }

  render() {
    // debugger;
    const { loading, error, graphRenderCounter, loggedIn } = this.props;
    return (
      <Container>
        <Helmet title="cellxgene" />
        {loggedIn ? null : (
            <Login />
        )}
        {loading ? (
          <div
            style={{
              position: "fixed",
              fontWeight: 500,
              top: window.innerHeight / 2,
              left: window.innerWidth / 2 - 50,
            }}
          >
            loading cellxgene
          </div>
        ) : null}
        {error ? (
          <div
            style={{
              position: "fixed",
              fontWeight: 500,
              top: window.innerHeight / 2,
              left: window.innerWidth / 2 - 50,
            }}
          >
            error loading cellxgene
          </div>
        ) : null}
        {loading || error ||loggedIn ? null : (
          <Layout>
            <LeftSideBar />
            {(viewportRef) => (
              <>
                <MenuBar />
                <Embedding />
                <Autosave />
                <Legend viewportRef={viewportRef} />
                <Graph key={graphRenderCounter} viewportRef={viewportRef} />
              </>
            )}
            <RightSideBar />
          </Layout>
        )}
      </Container>
    );
  }
}

export default App;
