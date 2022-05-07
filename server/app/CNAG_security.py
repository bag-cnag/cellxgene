"""Authorization and API call logs"""

import datetime
from functools import wraps
from flask import request
import jwt

# TODO
# Where does cellxgene have the config file?
from server.app.kc_config import kc_config as kc

idrsa = kc["IDRSA"]
options = kc["JWT_OPTIONS"]
public_key = (
    "-----BEGIN PUBLIC KEY-----\n" + idrsa + "\n-----END PUBLIC KEY-----"
)

def extract_items(token, name):
    """
    Get information from Keycloak like e.g. keycloak groups
    """

    print(token)
    if token.get(name) is not None:
        return [s.replace("/", "") for s in token.get(name)]

    return []


def cnag_login_required(func):

    """
    Decorator for handling keycloak login
    """

    # test it using curl
    # curl localhost:5005/api/v0.2/schema --header Authorization:eyJhbG...'

    @wraps(func)
    def decorated_function(*args, **kwargs):
        token = request.headers["Authorization"]
        groups = []
        try:
            decoded = jwt.decode(
                token, public_key, algorithms="RS256", options=options
            )
            groups = [s.replace("/", "") for s in decoded.get("group")]
        
        except jwt.exceptions.InvalidAlgorithmError as e:
            # If this exception is triggered it is likely
            # that the installed cryptography version is wrong
            # supported versions = [3.4.7]
            return {"message": f"{e}"}, 500

        except Exception as e:
            return {
                "message": f"Something went wrong {e} {e.__class__.__name__}"
            }, 500

        userid = decoded.get("preferred_username")
        groups = extract_items(decoded, "group")  # keycloak groups
        projects = extract_items(decoded, "project")  # not needed
        if len(projects) == 0:
            projects.append("no_project")

        timestamp = datetime.datetime.now().strftime("%I:%M%p on %B %d, %Y")
        print(
            "\t".join(
                [
                    timestamp,
                    userid,
                    ",".join(groups),
                    f"{request.url}-{request.method}",
                ]
            )
        )

        try:
            return func(
                userid=userid, groups=groups, projects=projects, token=token, *args, **kwargs
            )
        except Exception as e:
            return {"message": f"{e}"}, 500

    return decorated_function