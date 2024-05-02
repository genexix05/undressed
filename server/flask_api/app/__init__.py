from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Esto habilita CORS para todos los dominios en todas las rutas

# O puedes habilitar CORS solo para dominios específicos
# CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

from . import views
