import logging
import re
import lxml.html
from django.conf import settings

logger = logging.getLogger('haunted.ghosts')


def insert_haunted_script(response):
    html = response.content
    try:
        content = lxml.html.fromstring(html)
        # styles = content.xpath('//style')
        # result = toronado.from_string(html)
        # result_html = result.decode('utf-8')
        # root = lxml.html.fromstring(result_html)
        head = content.find('.//head')
        head.insert(-1, lxml.html.fromstring(
            '<script type="text/javascript" src="%shaunted/main.js">' % settings.STATIC_URL
        ))
        html = lxml.html.tostring(content).decode('utf-8')
    except Exception as e:
        logger.debug(e)
    finally:
        return html

def haunted_middleware(get_response):
    # One-time configuration and initialization.

    def middleware(request):
        # Code to be executed for each request before
        # the view (and later middleware) are called.

        response = get_response(request)
        # Code to be executed for each request/response after
        # the view is called.

        response.content = insert_haunted_script(response)
        return response

    return middleware