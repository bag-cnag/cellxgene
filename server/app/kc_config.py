"""
config for 3TR
"""

# pylint
# Class 'Config' inherits from object, can be safely removed from bases in python3 (useless-object-inheritance)`
# Too few public methods (0/2) (too-few-public-methods

kc_config = dict(
    JWT_OPTIONS = {"verify_exp": False, "verify_aud": False},
    IDRSA = "MIIB..."
)
