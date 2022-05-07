How to run the server (in debug mode using vscode):

Before starting it:

Secrets still needed to be hardcoded:
- IDRSA in server/app/kc_config.py

Steps:
- nvm use 11.10.0 
- make build-for-server-dev
- vscode: run and debug => flask(cellxgene)*

*launch.json() for vscode debug mode

```json
{
 "name":"flask",
 "request": "launch",
 "type": "python",
 "python": "${workspaceFolder}/venv/bin/python3",
 "stopOnEntry": false,
 "program": "${workspaceRoot}/server/cli/cli.py",
 "env": {
         "AWS_ACCESS_KEY_ID": "CEPH Access Key",
         "AWS_SECRET_ACCESS_KEY": "CEPH Secret key",
         "ENDPOINT_URL":"CEPH endpoint url",
         "BUCKET_NAME":"CEPH bucket",
         "CXG_OAUTH_CLIENT_API_URL":"https://sso.../auth/realms/REALM",
         "CXG_OAUTH_CLIENT_SECRET":"cellxgene client secret in keycloak",
         "CURL_CA_BUNDLE":"" (this prevents SSL errors for the oauth login)
        },
 "args": ["launch","-c","cellxgene_config.yaml","-v"]
}
```