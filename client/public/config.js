config = {
  security: true,
  config_keycloak: {
    realm: "REALM",
    "auth-server-url": "https://sso..",
    "ssl-required": "external",
    resource: "cellxgene",
    "public-client": true,
    "confidential-port": 0,
  },
};
