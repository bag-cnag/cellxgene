config = {
  security: true,
  config_keycloak: {
    realm: "3TR",
    // "auth-server-url": "http://localhost:8081/auth/",
    "auth-server-url": "https://sso.cnag.crg.dev/auth/",
    "ssl-required": "external",
    resource: "submission_client",
    "public-client": true,
    "confidential-port": 0,
  },
};
