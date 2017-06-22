import os

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

#static_url_path for remote if ever needed
app = Flask(__name__)
BASE_FOLDER = os.path.abspath(os.path.join(os.path.dirname( __file__ ), '..'))
app.static_folder = os.path.join(BASE_FOLDER, 'static')
app.config.from_pyfile('../config')

db = SQLAlchemy(app)
migrate = Migrate(app, db)

app.config['SQLALC_INSTANCE'] = db

#import application.views
