// jshint esversion: 6
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
import TermsOfServicePrompt from "./termsPrompt";

import actions from "../actions";

// needed for kc login
import Login from "./cnag_login";

@connect((state) => ({
  loading: state.controls.loading,
  error: state.controls.error,
  graphRenderCounter: state.controls.graphRenderCounter,
  loggedIn: state.controls.loggedIn,
  token: state.controls.token,
}))
class App extends React.Component {
  componentDidMount() {
    /* listen for url changes, fire one when we start the app up */
    window.addEventListener("popstate", this._onURLChanged);
    this._onURLChanged();
    this.forceUpdate();
  }

  componentDidUpdate(prevProps) {
    const { loggedIn: prevLoggedIn } = prevProps;
    const { dispatch, loggedIn} = this.props;

    console.log("prevLoggedIn :>> ", prevLoggedIn);
    console.log("loggedIn :>> ", loggedIn);

    // console.log('auth.getToken() :>> ', cnag_auth.getToken());
    // console.log('token :>> ', token);

    // only allow doInitalDataLoad if user is logged in via Keycloak
    // TODO
    // Handover the token to the server
    if (prevLoggedIn === false && loggedIn === true) {

      console.log("prevLoggedIn === false && loggedIn === true")

      // console.log('auth.getToken() :>> ', cnag_auth.getToken());
      // console.log('token :>> ', token);



      dispatch(actions.doInitialDataLoad(window.location.search));
      this.forceUpdate();
    }
  }

  _onURLChanged() {
    const { dispatch } = this.props;

    dispatch({ type: "url changed", url: document.location.href });
  }

  render() {
    const { loading, error, graphRenderCounter, loggedIn } = this.props;
    return (
      <Container>
        <Helmet title="cellxgene" />
        {loggedIn ? null : <Login />}
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

        {loading || error ? null : (
          <Layout>
            <LeftSideBar />
            {(viewportRef) => (
              <>
                <MenuBar />
                <Embedding />
                <Autosave />
                <TermsOfServicePrompt />
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
