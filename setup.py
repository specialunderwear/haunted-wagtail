from setuptools import setup, find_packages


__version__ = "0.0.1"


setup(
    # package name in pypi
    name='haunted-wagtail',
    # extract version from module.
    version=__version__,
    description="A spooky easteregg for wagtail",
    long_description="",
    classifiers=[],
    keywords='',
    author='',
    author_email='',
    url='',
    license='',
    # include all packages in the egg, except the test package.
    packages=find_packages(exclude=['ez_setup', 'examples', 'tests']),
    # for avoiding conflict have one namespace for all apc related eggs.
    namespace_packages=[],
    # include non python files
    include_package_data=True,
    zip_safe=False,
    # specify dependencies
    install_requires=[
        'setuptools',
        'wagtail',
    ],
    # generate scripts
    # entry_points={
    #     'console_scripts':[
    #         'script_name = name.module:main',
    #     ]
    # },
)
