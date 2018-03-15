# Haunted Wagtail... muhahahahaaaaaa

Haunted wagtail provides a spot of evil for your website. Did you hear
that eerie noise? What is that face that stares at you from between
the lines?


## Install

Make sure haunted wagtail is on your Python path. You can do either

    python setup.py develop

or 

    python setup.py install

or your own favorite command to get things installed.
Add the following settings for your Django project:

    INSTALLED_APPS += ['haunted']

    MIDDLEWARE += ['haunted.middleware.haunted_middleware']

and in your url conf:

    from haunted import urls as haunted_urls

    ...

    url(r'haunted', include(haunted_urls))

Last but not least, run

    npm install

inside this directory, and if you like:

    npm run-script watch

during development. Rev up your website, and be afraid. Be very afraid...
