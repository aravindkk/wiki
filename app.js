var express=require('express');
var app=express();
var bodyParser=require('body-parser');
var expressSession = require('express-session');
var cookieParser = require('cookie-parser'); // the session is stored in a cookie, so we use this to parse it
var http=require('http');
var HTTPserver=http.createServer(app);
var url = require('url')
  , qs = require('querystring');
  


var application_root=__dirname,
    path=require('path');


var mongo = require('mongodb');
var Server = mongo.Server;
var ObjectID = mongo.ObjectID;
var Db = mongo.Db;

var server = new Server('localhost',27017, {auto_reconnect:true});
var db = new Db('abcd',server);


db.open(function(err,db)
{
 if(err)
 {
   console.log('Problem with mongodb');
 }
 else
 {
   console.log('Connected to db');
 }
});


var MongoStore = require('connect-mongo')(expressSession);

// must use cookieParser before expressSession
app.use(cookieParser());

app.use(expressSession({
  store: new MongoStore({
    db: 'myapp',
    host: '127.0.0.1',
    port: 27017 
  }),
  secret:'somesecrettokenhere'}));

var mongoose = require('mongoose');
var db = mongoose.connection;
var mongoUri = process.env.MONGOHQ_URL;
mongoose.connect('mongodb://localhost:27017');
db.on('error',console.error);

var User_Schema = new mongoose.Schema({
 user_id: Number,
 name: String,
 github_name: String,
 email: String
});
var User_Model = mongoose.model('User_Model' , User_Schema);


var Revision_Schema = new mongoose.Schema({
 section_id: String,
 revision: Number,
 user_id: Number,
 section_1: String,
 section_2: String,
 section_3: String,
 section_4: String,
 section_5: String,
 links: Array
});
var Revision_Model = mongoose.model('Revision_Model' , Revision_Schema);

app.use(bodyParser());
app.use(express.static(application_root));    

app.get('/user',function(req,res)
{
	if(req.session.token)
	{
		var html = '';
		var a = '<img src="'+req.session.avatar_url+'"/>';
		var b = '<p>Name: '+req.session.name+'</p>';
		var c = '<p>URL : '+req.session.html_url+'</p>';
		var d = '<p>Email: '+req.session.email+'</p>';
		html = a+b+c+d;
		res.send(html);
	}
	else
	{
	res.redirect('/test');
}
});

app.get('/test', function(req,res){
	
	req.session.token = 12;
	req.session.name = 'aravind';
	req.session.html_url = 'hey.com';
	req.session.email = '12@fb.com';
	req.session.user_id = 123;
    res.redirect('/user');
});

app.get('/wiki', function(req, res){
	res.sendfile('wiki.html');
});

app.get('/wiki/i/:section', function(req, res){
	console.log(req.params.section);
    Revision_Model.count({section_id: req.params.section},function(err,count){
    	  // so count is the number of the revision 
    	  if(count==0)res.send('-1');
    	  Revision_Model.find({section_id: req.params.section, revision: count}, function(err, records){
    	  	  if(err)console.error(err);
               res.send(records[0]);
    	  });
    });
});

app.get('/wiki/edit', function(req, res){
	res.sendfile('wiki-edit.html');
});

app.post('/wiki/edit', function(req, res){
   console.log('here in post');
   console.log(req.body.section_id);
   console.log(req.body.section_1);
   console.log(req.body.section_2);
   console.log(req.body.section_3);
   console.log(req.body.section_4);
   console.log(req.body.section_5);
   console.log('after printing');
   var rev_num;
   Revision_Model.count({section_id: req.body.section_id},function(err,count){
      rev_num=count;
      console.log('count is '+count);
      rev_num++;
      console.log('here in save');
   console.log(req.body.section_id);
   console.log(req.body.section_1);
   console.log(req.body.section_2);
   console.log(req.body.section_3);
   console.log(req.body.section_4);
   console.log(req.body.section_5);
   console.log('after printing');
         var Revision = new Revision_Model({
                       section_id: req.body.section_id,
 revision: rev_num,
 user_id: req.session.user_id,
 section_1: req.body.section_1,
 section_2: req.body.section_2,
 section_3: req.body.section_3,
 section_4: req.body.section_4,
 section_5: req.body.section_5
                  });
   Revision.save(function(err, Revision) {
      if(err) return console.error(err);
      console.dir(Revision);
   });
   });	

	res.redirect('/wiki');
});

app.get('/wiki/history/:section_id', function(req,res){
  var p = req.params.section_id || '3792';
  console.log('p is '+p);
  Revision_Model.find({section_id:p}, function(err, records){
  	if(err) return console.error(err);
  	console.log('HERE-------');
  	console.log(records);
  	res.send(records);
  });
});

app.get('/wiki/revisions', function(req,res){
	res.sendfile('revisions.html');
});


var port=process.env.PORT || 5000;
HTTPserver.listen(port);
console.log("Listening on "+port);