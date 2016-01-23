'use strict';
var express = require('express');
var bcrypt = require('bcrypt-nodejs');

var router = express.Router();

var authenticate = function(req,res,next)
{
  if(req.session.isloggedin) {
   next();
 }
  else {
   res.redirect('/input/login');
 }
}

router.get('/',authenticate, function (request, response) {
         response.render('input', {message: null, results: null});
});

router.get('/register',authenticate,function(req,res,next){
   res.render('register');
});

router.post('/register',authenticate,function(req,res,next){
  var users = req.db.collection('users');
  var onInsert = function(err)
  {
   if(err)
    console.log(err)
  else
    {
      res.redirect('login');
    }
  }
  var uname = req.body.userName ;
  var pass = req.body.password ;
  console.log(pass);
  bcrypt.hash(pass,bcrypt.genSaltSync(),null,function(err,hash)
  {
   if(err)
    console.log(err);
   else
   {
     console.log('inserting');
     console.log(hash);
     users.insert({userName : uname , password : hash},onInsert);
   }
  });
});

router.post('/new',authenticate,function (request, response) {
    var collection = request.db.collection('articles');
    var article = {
        main_category: request.body.m_category,
        sub_category: request.body.s_category,
        topic: request.body.topic,
        content: request.body.contentText,
        tags: request.body.tag,
        timestamp: new Date()
    };
    var onInsert = function (err) {
        if (err) {
            console.log('error: ' + err);
        }
        else {
            response.status(200).send({"message": "Article Added"});
        }
    }
    collection.insert(article, onInsert);
});
router.get('/news',authenticate,function(req,res,next){
  res.render('news');
});

router.post('/news',authenticate,function(req,res){
       var news = req.db.collection('news')
        var newsDocument = {
           news_text : req.body.news,
           date_added : new Date()
         };
         news.insert(newsDocument,function(err){
           if (err) {
               console.log('error: ' + err);
           }
           else {
               res.render('input', {message: 'Inserted', results: null , listing :null})
           }
       });
    });

router.post('/find', function (request, response) {
    var collection = request.db.collection('articles');
    var topic = request.body.f_topic;
    console.log(topic);
    var onSearch = function (err, docs) {
        if (err) {
            console.log('error: ' + err);
        }
        else if (docs === null) {
            response.status(404).send({results: null, message: 'Not Found'});
        }
        else {
            response.status(200).send({results: docs, message: 'Search Successful'});
        }
    };
    collection.findOne({topic: topic}, onSearch);
});

router.post('/edit',authenticate, function (request, response) {
    var collection = request.db.collection('articles');
    var newArticle = {
        main_category: request.body.e_m_category,
        sub_category: request.body.e_s_category,
        topic: request.body.e_topic,
        content: request.body.e_contentText,
        tags: request.body.e_tag,
        timestamp: new Date()
    };
    var onUpdate = function (err) {
        console.log('here');
        if (err) {
            console.log('error: ' + err);
        }
        else {
            response.status(200).send({message: 'Updated', results: null});
        }
    };
    collection.findAndModify({
            query: {topic: newArticle.topic},
            update: {
                $set: {
                    main_category: newArticle.main_category,
                    sub_category: newArticle.sub_category,
                    content: newArticle.content,
                    tags: newArticle.tags,
                    timestamp: newArticle.timestamp
                }
            },
            new: true,
        }, onUpdate
    );
});

router.post('/delete',authenticate, function (request, response) {
    var collection = request.db.collection('articles');
    var updateCollection = request.db.collection('updates');
    var topic = request.body.d_topic;
    var onDelete = function (err, results) {
        if (err) {
            console.log('error: ' + err);
        }
        else {
            console.log(results);
            response.status(200).send({message: 'Deleted', results: null});
        }
    };
    var query = {topic: topic};
    collection.remove(query, onDelete);
});

router.get('/login',function(req,res,next){
  res.render('login',{message : null });
});

router.post('/login',function(req,res,next){
   var name = req.body.userName ;
   var password = req.body.password ;
   var collection = req.db.collection('users');
   collection.findOne({userName : name},function(err,doc){
     if (err) {
         console.log('error: ' + err);
         res.status(500).send('server error');
     }
     else if(!doc)
       {
         res.render('login',{message : 'user not found'});
       }
       else if(bcrypt.compareSync(password,doc.password))
       {
         req.session.isloggedin = true ;
         res.redirect('/');
       }
       else {
          res.render('login',{message : 'incorrect password'});
       }
   })
});

router.post('/upload',authenticate, function (request, response) {
    console.log('Image uploaded: ' + request.files.name);
    response.status(200).send({message: 'Uploaded', results: null});
});
module.exports = router;
