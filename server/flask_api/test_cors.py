from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/")
def hello_world():
    return "CORS está habilitado!"

if __name__ == "__main__":
    app.run(debug=True)
