from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from flask_login import LoginManager, login_required, login_user, logout_user, current_user, UserMixin, AnonymousUserMixin
from sqlalchemy import create_engine, Table, MetaData, text, insert

# Create tables.
engine = create_engine('sqlite:///database.db')
meta = MetaData()
meta.create_all(engine)
table_aprimon = Table('aprimon_master', meta, autoload_with=engine)

class User(UserMixin):
    def __init__(self, name, id, active=True):
        self.name = name
        self.id = id
        self.active = active

    def is_active(self):
        return self.active

class Anonymous(AnonymousUserMixin):
    name = u"Anonymous"

USERS = {
    1: User(u"henne", 1)
}

USER_NAMES = dict((u[1].name, u[1]) for u in USERS.items())
# USER_NAMES = dict([(u.name, u) for u in USERS.items()])

# USER_NAMES = dict((u.name, u) for u in USERS.items())

app = Flask(__name__, template_folder='pages')
app.config['SECRET_KEY'] = 'stratus2023'
app.config.from_object(__name__)
# admin_pass = 'test'

login_manager = LoginManager()
login_manager.anonymous_user = Anonymous
login_manager.login_view = "login"
login_manager.login_message = u"Please log in to access this page."
login_manager.refresh_view = "reauth"

@login_manager.user_loader
def load_user(id):
    return USERS.get(int(id))

login_manager.init_app(app)


### HOME PAGE ######################################################################

@app.route('/')
def index():
    # Check logged in.
    if current_user.is_authenticated:
        check_login_status = True
        print('User logged in')
    else:
        check_login_status = False
        print('User NOT logged in')

    return render_template("index.html", title='Stratus')

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.json.get('username')
        if username in USER_NAMES:
            if login_user(USER_NAMES[username], remember=False):
                return jsonify({'status': 'success'})
            else:
                return jsonify({'status': 'error', 'message': 'Unknown error. Contact a developer.'})
        else:
            return jsonify({'status': 'invalid_pass', 'message': 'Wrong password. Please try again.'})
    
    return jsonify({'status': 'error'})

@app.route("/logout")
@login_required
def logout():
    if current_user.is_authenticated:
        logout_user()
        return redirect(url_for('aprimon'))
    else:
        return jsonify({'status': 'error'})

### MASTER APRIMON TABLE ###########################################################

@app.route('/aprimon')
def aprimon():
    # Get data from table.
    with engine.connect() as conn:
        result = conn.execute(text("SELECT * FROM aprimon_master"))
        rows = result.fetchall()
        conn.close()
        columns = result.keys()
        row_data = [dict(zip(columns, row)) for row in rows]
    # Check logged in.
    if current_user.is_authenticated:
        check_login_status = True
        print('User logged in')
    else:
        check_login_status = False
        print('User NOT logged in')
    return render_template('aprimon.html', data=row_data, login_status=check_login_status)

@app.route('/add_aprimon', methods=['POST'])
@login_required
def add_row():
    name = request.json.get('name')
    if name:
        with engine.connect() as conn:
            addrow = insert(table_aprimon).values(name=name)
            conn.execute(addrow)
            conn.commit()
            conn.close()
        return jsonify({'status': 'success'})
    return jsonify({'status': 'error'})


###
if __name__ == '__main__':
    app.run(debug=True)
