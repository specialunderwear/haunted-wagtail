from django.urls import path, re_path

import haunted.views

urlpatterns = [
    re_path(r'^$', haunted.views.index, name='index'),
]
