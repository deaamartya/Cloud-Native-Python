from flask import Flask, jsonify, make_response, abort, request, render_template, session, redirect, url_for
from datetime import datetime
from flask_cors import CORS, cross_origin
import sqlite3, secrets, flask, random
from pymongo import MongoClient

app = Flask(__name__)
app.config.from_object(__name__)
app.secret_key = secrets.token_urlsafe(16)
app.template_folder = 'template'
CORS(app)

connection = MongoClient('mongodb://localhost:27017/')
def create_mongodatabase():
	try:
		dbnames = connection.list_database_names()
		if 'cloud_native' not in dbnames:
			db = connection.cloud_native.users
			db_tweets = connection.cloud_native.tweets
			db_api = connection.cloud_native.apirelease
			db.insert_one({
				"email": "eric.strom@google.com",
				"id": 33,
				"name": "Eric stromberg",
				"password": "eric@123",
				"username": "eric.strom"
			})
			db_tweets.insert_one({
				"body": "New blog post,Launch your app with the AWS Startup	Kit! #AWS",
				"id": 18,
				"timestamp": "2017-03-11T06:39:40Z",
				"tweetedby": "eric.strom"
			})
			db_api.insert_one( {
				"buildtime": "2017-01-01 10:00:00",
				"links": "/api/v1/users",
				"methods": "get, post, put, delete",
				"version": "v1"
			})
			db_api.insert_one( {
				"buildtime": "2017-02-11 10:00:00",
				"links": "api/v2/tweets",
				"methods": "get, post",
				"version": "2017-01-10 10:00:00"
			})
			print ("Database Initialize completed!")
		else:
			print ("Database already Initialized!")
	except:
		print ("Database creation failed!!")

@app.route("/")
def main():
	return render_template('main.html')

#html
@app.route('/addname')
def addname():
	if request.args.get('yourname'):
		session['name'] = request.args.get('yourname')
		# And then redirect the user to the main page
		return redirect(url_for('main'))
	else:
		return render_template('addname.html', session=session)

@app.route('/addtweets')
def addtweetjs():
	return render_template('addtweets.html')

@app.route('/adduser')
def adduser():
	return render_template('adduser.html')

#clear session
@app.route('/clear')
def clearsession():
	# Clear the session
	session.clear()
	# Redirect the user to the main page
	return redirect(url_for('main'))

#set cookie
@app.route('/set_cookie')
def cookie_insertion():
	redirect_to_main = redirect('/')
	response = app.make_response(redirect_to_main)
	response.set_cookie('my_cookie',value=session['name'])
	return response

@app.route('/read_cookie')
def get_cookie():
	return flask.request.cookies.get('my_cookie')

@app.route("/api/v1/info")
# mongodb
def home_index():
	api_list=[]
	db = connection.cloud_native.apirelease
	for row in db.find():
		api_list.append(str(row))
	return jsonify({'api_version': api_list}), 200

@app.route("/api/v1/users", methods=["GET"])
def get_users():
	return list_users()

# mongodb
def list_users():
	api_list=[]
	db = connection.cloud_native.users
	for row in db.find():
		api_list.append(str(row))
	return jsonify({'user_list': api_list})

@app.route("/api/v1/users/<int:user_id>", methods=["GET"])
def get_user(user_id):
    return list_user(user_id)

# mongodb
def list_user(user_id):
	api_list=[]
	db = connection.cloud_native.users
	for i in db.find({'id':user_id}):
		api_list.append(str(i))
	if api_list == []:
		abort(404)
	return jsonify({'user_details':api_list})

@app.errorhandler(404)
def resource_not_found(error):
	return make_response(jsonify({'error':'Resource not found!'}), 404)

@app.route('/api/v1/users', methods=['POST'])
# mongodb
def create_user():
	if not request.json or not 'username' in request.json or not 'email' in request.json or not 'password' in request.json:
		abort(400)
	user = {
		'username': request.json['username'],
		'email': request.json['email'],
		'name': request.json.get('name',""),
		'password': request.json['password'],
		'id': random.randint(1,1000)
	}
	return jsonify({'status': add_user(user)}), 200

# mongodb
def add_user(new_user):
	api_list=[]
	print (new_user)
	db = connection.cloud_native.users
	user = db.find({'$or':[{"username":new_user['username']},{"email":new_user['email']}]})
	for i in user:
		print (str(i))
		api_list.append(str(i))
	if api_list == []:
		db.insert_one(new_user)
		return "Success"
	else :
		abort(409)

@app.errorhandler(400)
def invalid_request(error):
	return make_response(jsonify({'error': 'Bad Request'}), 400)

@app.route('/api/v1/users', methods=['DELETE'])
def delete_user():
	if not request.json or not 'username' in request.json:
		abort(400)
	user=request.json['username']
	return jsonify({'status': del_user(user)}), 200

# mongodb
def del_user(del_user):
	db = connection.cloud_native.users
	api_list = []
	for i in db.find({'username':del_user}):
		api_list.append(str(i))
	if api_list == []:
		abort(404)
	else:
		db.remove({"username":del_user})
		return "Success"

@app.route('/api/v1/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
	user = {}
	if not request.json:
		abort(400)
	user['id']=user_id
	key_list = request.json.keys()
	for i in key_list:
		user[i] = request.json[i]
	print (user)
	return jsonify({'status': upd_user(user)}), 200

# mongodb
def upd_user(upd_user):
	api_list=[]
	print (upd_user)
	db_user = connection.cloud_native.users
	user = db_user.find_one({"id":upd_user['id']})
	api_list.append(user)
	if api_list == []:
		abort(409)
	else:
		db_user.update_one({'id':user['id']},{'$set': upd_user})
		return "Success"

@app.route('/api/v2/tweets', methods=['GET'])
def get_tweets():
	return list_tweets()

# mongodb
def list_tweets():
	api_list=[]
	db = connection.cloud_native.tweets
	for row in db.find():
		api_list.append(str(row))
	return jsonify({'tweets_list': api_list})

@app.route('/api/v2/tweets', methods=['POST'])
def add_tweets():
	user_tweet = {}
	if not request.json or not 'username' in request.json or not 'body' in request.json:
		abort(400)
	user_tweet['username'] = request.json['username']
	user_tweet['body'] = request.json['body']
	user_tweet['created_at']=datetime.now().strftime('%d-%m-%Y %H:%M:%SZ')
	print (user_tweet)
	return jsonify({'status': add_tweet(user_tweet)}), 200

# mongodb
def add_tweet(new_tweet):
	api_list=[]
	print (new_tweet)
	db_user = connection.cloud_native.users
	db_tweet = connection.cloud_native.tweets
	user = db_user.find({"username":new_tweet['username']})
	for i in user:
		api_list.append(str(i))
	if api_list == []:
		abort(404)
	else:
		db_tweet.insert(new_tweet)
		return "Success"

@app.route('/api/v2/tweets/<int:id>', methods=['GET'])
def get_tweet(id):
	return list_tweet(id)

# mongodb
def list_tweet(id):
	db = connection.cloud_native.tweets
	api_list = []
	list = db.find({'id':id})
	for i in list:
		api_list.append(str(i))
	if api_list == []:
		abort(404)
	else:
		return jsonify({'tweets_list': api_list})

if __name__ == "__main__":
	create_mongodatabase()
	app.run(host='127.0.0.1', port=5000, debug=True)