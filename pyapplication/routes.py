import json
from flask import redirect

# Delay emulation only
import time

from pyapplication import app
from pyapplication.modules.user_views import logout_view
from pyapplication.modules.oauth_views import alveo_authorise_view, alveo_callback_view
from pyapplication.modules.error_views import not_allowed, not_found, server_error

app.register_error_handler(403, not_allowed)
app.register_error_handler(404, not_found)
app.register_error_handler(500, server_error)

app.add_url_rule('/app/oa/logout', view_func=logout_view, methods=['GET',])
app.add_url_rule('/app/oa/authorise', view_func=alveo_authorise_view, methods=['GET',])
app.add_url_rule('/app/oa/callback', view_func=alveo_callback_view, methods=['GET',])

@app.before_first_request
def init():
    pass

@app.route('/')
def serve():
    return redirect('/static/index.html')

@app.route('/request-audio')
def requestaudio():
    return app.send_static_file('sample/audio.ogg')

@app.route('/request-data')
def request():
    # Emulate a delay
    time.sleep(2);
    # Confirm user is authenticated
    #  Confirm user can receive more
    #   Pull data out
    return json.dumps([{
            "id": "0",
            "label": "TestWWWWWWWWWW",
            "audio_url": "",
            "duration": 4730,
            "segments": [
                {
                    "start": 0.000,
                    "end": 7.1239,
                    "speaker": "1",
                    "annotation": "",
                },
                {
                    "start": 8.2383,
                    "end": 14.2395,
                    "speaker": 2,
                    "annotation": "",
                },
                {
                    "start": 16.2333,
                    "end": 19.2395,
                    "speaker": "",
                    "annotation": "",
                },
                {
                    "start": 22.2333,
                    "end": 27.2395,
                    "speaker": "",
                    "annotation": "",
                },
                {
                    "start": 28.2333,
                    "end": 35.2395,
                    "speaker": "",
                    "annotation": "",
                },
                {
                    "start": 36.2333,
                    "end": 39.2395,
                    "speaker": "",
                    "annotation": "",
                },
                {
                    "start": 42.2333,
                    "end": 45.2395,
                    "speaker": "",
                    "annotation": "",
                },
                {
                    "start": 47.2333,
                    "end": 52.2395,
                    "speaker": "",
                    "annotation": "",
                },
                {
                    "start": 53.2333,
                    "end": 62.2395,
                    "speaker": "",
                    "annotation": "",
                },
                {
                    "start": 62.2333,
                    "end": 69.2395,
                    "speaker": "",
                    "annotation": "",
                },
                {
                    "start": 73.2333,
                    "end": 78.2395,
                    "speaker": "",
                    "annotation": "",
                },
                {
                    "start": 81.2333,
                    "end": 83.2395,
                    "speaker": "",
                    "annotation": "",
                },
                {
                    "start": 84.2333,
                    "end": 87.2395,
                    "speaker": "",
                    "annotation": "",
                },
                {
                    "start": 87.2333,
                    "end": 111.2395,
                    "speaker": "",
                    "annotation": "",
                },
            ]
        },
        {
            "id": "1",
            "label": "Test Test Test Test Test Test Test Test Test Test Test Test",
            "audio_url": "",
            "duration": "63812",
            "segments": [
                {
                    "start": 0.000,
                    "end": 5.732,
                    "speaker": "1",
                    "annotation": "",
                },
                {
                    "start": 6.9271,
                    "end": 11.3293,
                    "speaker": "",
                    "annotation": "",
                }]
        },
        {
            "id": "2",
            "label": "Audio.wav",
            "audio_url": "",
            "duration": "4232000",
            "segments": [
                {
                    "start": 0.000,
                    "end": 1.763,
                    "speaker": "1",
                    "annotation": "",
                },
                {
                    "start": 2.132,
                    "end": 6.423,
                    "speaker": "",
                    "annotation": "",
                },
                {
                    "start": 7.432,
                    "end": 11.1292,
                    "speaker": "1",
                    "annotation": "Testing",
                },
                {
                    "start": 14.3923,
                    "end": 23.2391,
                    "speaker": "2",
                    "annotation": "",
                }]
        }])