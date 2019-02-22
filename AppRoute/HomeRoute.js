/**
 * This is a Route file. It defines routes for URL's that are browsed from user's browser.
 * Example: If the following URL is to be defined
 *      http://localhost:3000/route1
 * then, the route is defined as:
 *      router.get('/', function(req, res){ ... });
 * The 'req' contains 'request' data and 'res' constains the response from the server. And, 'get' is the
 * GET method.
 * 
 * This file defines how server handles request and defines appropiate route based on defined functionality. 
 */


const express = require('express');
const router = express.Router();

//Import 'articleModel' and 'userModel'
//Follow through /AppModel/articleModel.js and /AppModel/userModel.js
let ArticleSchema = require('../AppModel/articleModel');
let UserSchema = require('../AppModel/userModel');





/**
 * ROUTE: '/' (home).
 * GET method. 
 * When URL: http://localhost:3000/ is called in browser.
 * 
 * We will retrive all the articles stored in MongoDB 'ArticleSchema' imported above
 * and populate it '/AppView/home.pug' view along with default set of articles defined below (for demo only).
 */
router.get('/', function(req, res){
    ArticleSchema.find({} /* find all */, function(err, retrievedArticles){
        if(err){
            console.log('Error occured in retrieving data from Article Schema.');
        }else{

            let defaultArticle = [
                {
                    id: 0,
                    title: "The Code Ground",
                    content: "This id default Article"
                }
            ];

            //Calling '/AppView/home.pug' view and passing some data along with it.
            res.render('home', {
                page_title: 'Article List',
                articles: retrievedArticles,
                defaultArticle: defaultArticle
            })

        }
    });
});




/**
 * ROUTE: '/article/add_article' (Add Article)
 * GET method. 
 * Default browse to http://localhost:3000/add_article
 * 
 * Load the "Add Article" interface.
 */
router.get('/add_article', function(req, res){
    res.render('add_article', {
        page_title: "Add Article"
    });
});




/**
 * ROUTE: '/article/save_article' (Save Article)
 * POST method.
 * 
 * When 'http://localhost:300/article/save_article' is called from '/AppView/add_article.pug', the POST
 * data is handled using following call.
 * 
 * The data submitted is first going to be validated and saved to the 'ArticleSchema' schema.
 * However, the data to be saved needs to be parsable in JSON as MongoDB uses JSON.
 */
router.post('/save_article', function(req, res){
    //Validation
    req.checkBody('title','Title is required.').notEmpty();
    req.checkBody('author','Author is required.').notEmpty();
    req.checkBody('content','Body is required.').notEmpty();
    let errors = req.validationErrors();
    if(errors){
        //If error exists then route/call 'AppView/add_article.pug' using route define above
        //along with error message.
        res.render('add_article', {
            title: 'Add Article',
            errors: errors
        });
        return false;
    }
    

    let articleData = new ArticleSchema();
    //In next 3 lines, the RHS code requires parsing.
    articleData.title = req.body.title;
    articleData.author = req.body.author;
    articleData.content = req.body.content;
    articleData.save(function(err){
        if(err){
            console.log("Error occured while saving. " + err);
        }else{
            req.flash('success', 'Article is saved.');
            res.redirect('/');
        }
    });

});




/**
 * ROUTE: '/:id' (Retrieve Article)
 * GET Method.
 * 
 * The following route is going to render '/AppView/article.pug' view.
 * Note that the 'id' needs to be passed in query string and based on 'id' that specific data
 * will be retrieved from MongoDB and sent to article.pug view.
 */
router.get('/:id', function(req, res){
    ArticleSchema.findById(req.params.id, function(err, article){
        if(err){
            console.log("/:id" + err);
            return;
        }
         
        res.render('article', {
            article: article,
            //author: user.name
        });
          
    });
});




/**
 * ROUTE: '/edit/:id' (Edit Article)
 * GET Method.
 * 
 * The following code renders the 'edit_article.pug' view.
 * The query string must contain the 'id' that is to be edited. Based on 'id', the data is retrieved from
 * MongoDB and then send to view to be displayed.
 */
router.get('/edit/:id', function(req, res){
    ArticleSchema.findById(req.params.id, function(err, article){
        //Check where the article.author (from MongoDb) matches the req.user_id request data coming from
        //user session set in 'index.js' file.
        if(article.author != req.user_id){
            console.log("Not authorized.")
            return;
        }

        res.render('edit_article', {
            article: article
        })
    });
});



/**
 * ROUTE: '/edit/:id' (Update Article)
 * POST Method.
 * 
 * The following route is called from edit_article.pug view.
 * In following code, the form data is parsed and updated to database.
 */
router.post('/edit/:id', function(req, res){
    let article = {};
    article.title = req.body.title;
    article.author = req.body.author;
    article.content = req.body.content;
    //Update Query requires data us to pass 'id'.
    let query = {_id:req.params.id};
    ArticleSchema.update(query, article, function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect('/');
        }        
    });
});



/**
 * ROUTE: '/article/delete/:id' (Delete Article)
 * 
 * The following delete request comes from article.pug file.
 * The id needs to be passed for an database entry to be deleted from MongoDB.
 */
router.delete('/delete/:id', function (req, res){
    let query = {_id:req.params.id};    

    Article.remove(query, function(err){
        if(err){
            console.log(err);
        }
        res.send('Deleted.'); 
    });
});





/**
 * The following bug occurs if the module is not exported.
 *      TypeError: Router.use() requires a middleware function but got a Object...
 * 
 */
module.exports = router;