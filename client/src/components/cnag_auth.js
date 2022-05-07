import jwt_decode from "jwt-decode";

export default {
  user: {
    authenticated: false,
    access_token: "",
  },
  getToken() {
    console.log('this.user.keycloak', this.user.keycloak)
    if (this.user.keycloak !== undefined) return this.user.keycloak.token;
    else return false;
  },
  decoded() {
    if (this.user.keycloak !== undefined)
      return jwt_decode(this.user.keycloak.token);
    else return "empty";
  },
  setToken(user) {
    console.log("set token entered");
    this.user = user;
    this.user.authenticated = true;
  },
  getUser() {
    return this.user;
  },
  tokenExpired() {
    const now = new Date();
    const secondsSinceEpoch = Math.round(now.getTime() / 1000);
    return this.decoded().exp > secondsSinceEpoch ? false : true;
  },
};
