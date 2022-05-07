"""
config for 3TR
"""

# pylint
# Class 'Config' inherits from object, can be safely removed from bases in python3 (useless-object-inheritance)`
# Too few public methods (0/2) (too-few-public-methods

kc_config = dict(
    JWT_OPTIONS = {"verify_exp": False, "verify_aud": False},
    IDRSA = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAlGr9gD/7myzg6hgi5qchcjOmepZz8xOcfCyQ0nBCRnQXEfz+bLXyf+Yb8jE1oo/uyMlrId1l1CU9hLWZftcI3y4YTmbWzfDg/r3cWnKZUJIcgRjiQY3Gc5jp8NxUFtUc+8XxUC1skpUZkS7ZZaeEyvbLH4jiM0G0OB7Y38IZtnCSef2JOC27dndzFS08328+8+gU3ZLFJncF7M/ugvNazko9kA3lhKa5bJJO3YJI5CsvzUQZx845Ij1/v2xPB85aiYLaQeBXw1fqPBWK6ATDn4FakqoSwbmpGVcsDpnR0Bh1nrDqQg2eomTveJbw4F+Ugi1RPblDxReJOMI9a292IwIDAQAB"
)
