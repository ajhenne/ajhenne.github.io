from flask import Flask
app = Flask(__name__)

@app.route('/')
def index():
    return "This is the home page."

@app.route('/pages/aprimonmaster.html')
def aprimonmaster():
    return "This is the master aprimon table."

if __name__ == '__main__':
    app.run(debug=True)
