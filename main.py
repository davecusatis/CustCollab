__author__ = 'David'

import logging
import tornado.auth
import tornado.escape
import tornado.ioloop
import tornado.web
import os.path
import uuid
import re

from tornado.concurrent import Future
from tornado import gen
from tornado.options import define, options, parse_command_line
from tornado.httpserver import HTTPServer

define("port", default=8888, help="run on the given port", type=int)
define("debug", default=False, help="run in debug mode")


class MessageBuffer(object):
    def __init__(self):
        self.waiters = set()
        self.cache = []
        self.cache_size = 200

    def wait_for_messages(self, cursor=None):
        result_future = Future()
        if cursor:
            new_count = 0
            for msg in reversed(self.cache):
                if msg["id"] == cursor:
                    break
                new_count += 1
            if new_count:
                result_future.set_result(self.cache[-new_count:])
                return result_future
        self.waiters.add(result_future)
        return result_future

    def cancel_wait(self, future):
        self.waiters.remove(future)
        future.set_result([])

    def new_messages(self, messages):
        logging.info("sending new message to %r listeners", len(self.waiters))
        for future in self.waiters:
            future.set_result(messages)
        self.waiters = set()
        self.cache.extend(messages)

        # takes first cache_size amount of chars
        if len(self.cache) > self.cache_size:
            self.cache = self.cache[-self.cache_size:]

#global_message_buffer = MessageBuffer()
room_buffers = {}
room_buffers["index"] = MessageBuffer()

class BaseHandler(tornado.web.RequestHandler):
    def get_current_user(self):
        user_json = self.get_secure_cookie("chatdemo_user")
        if not user_json:
            return None
        return tornado.escape.json_decode(user_json)


class MainHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self):
        self.render("index.html", messages=room_buffers["index"].cache)


class LoginHandler(BaseHandler):
    def prepare(self):
        self.render("login.html")

    # def post(self):
    #     room_id = self.get_argument("room_id")
    #     self.write("got room_id" + room_id)
    #     self.redirect("/room/"+room_id, True)


class MessageNewHandler(BaseHandler):
    @tornado.web.authenticated
    def post(self):
        #self._log()
        room = re.search('(?<=room/)(.*)', self.request.headers.get("Referer"))
        if room is None:
            room = "index"
        else:
            room = room.group(0)
        message = {
            "room": room,
            "id": str(uuid.uuid4()),
            "from": self.current_user,
            "body": self.get_argument("body"),
        }

        message["html"] = tornado.escape.to_basestring(
            self.render_string("message.html", message=message)
        )
        logging.log(logging.DEBUG, message["room"])

        if self.get_argument("next", None):
            self.redirect(self.get_argument("next"))
        else:
            self.write(message)

        room_buffers[message["room"]].new_messages([message])


class MessageUpdatesHandler(BaseHandler):
    @tornado.web.authenticated
    @gen.coroutine
    def post(self):
        cursor = self.get_argument("cursor", None)
        self.future = room_buffers["index"].wait_for_messages(cursor=cursor)
        messages = yield self.future
        if self.request.connection.stream.closed():
            return
        self.write(dict(messages=messages))

    def on_connection_close(self):
        room_buffers["index"].cancel_wait(self.future)


class AuthLoginHandler(BaseHandler, tornado.auth.GoogleMixin):
    @gen.coroutine
    def get(self):
        if self.get_argument("openid.mode", None):
            user = yield self.get_authenticated_user()
            self.set_secure_cookie("chatdemo_user", tornado.escape.json_encode(user))
            self.redirect("/")
            return
        self.authenticate_redirect(ax_attrs=["name"])


class AuthLogoutHandler(BaseHandler):
    def get(self):
        self.clear_cookie("chatdemo_user")
        self.write("you logged out")


class RoomHandler(BaseHandler):
    def prepare(self):
        # todo load chat/editor/google hangs

        return

    @tornado.web.authenticated
    def get(self, room_id):
        #self.write(self.get_current_user())
        self.render("index.html", messages=room_buffers[room_id].cache)
        return


class NewRoomHandler(BaseHandler):
    def post(self):
        user = self.get_argument("name")
        room_id = self.get_argument("room_id")
        room_buffers[room_id] = MessageBuffer()
        self.redirect("/room/" + room_id)


def main():
    parse_command_line()
    app = tornado.web.Application(
        [
            (r"/", MainHandler),
            (r"/new/", LoginHandler),
            (r"/room/(.*)", RoomHandler),
            (r"/newroom/", NewRoomHandler),
            (r"/auth/login", AuthLoginHandler),
            (r"/auth/logout", AuthLogoutHandler),
            (r"/a/message/new", MessageNewHandler),
            (r"/a/message/updates", MessageUpdatesHandler)
        ],
        cookie_secret="666",
        login_url="/auth/login",
        template_path=os.path.join(os.path.dirname(__file__), "templates"),
        static_path=os.path.join(os.path.dirname(__file__), "static"),
        xsrf_cookies=True,
        debug=options.debug
    )
    logging.getLogger().setLevel(logging.DEBUG)
    #app.listen(options.port)
    http_server = HTTPServer(app)
    http_server.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()

if __name__ == "__main__":
    main()