/**
 * Created with IntelliJ IDEA.
 * User: dosapati
 * Date: 5/2/15
 * Time: 9:06 PM
 * To change this template use File | Settings | File Templates.
 */

var express = require('express');
var app = express();

var google = require('google')
var youtube = require ('youtube-feeds');
youtube.httpProtocol = 'https';
var async = require('async');


app.get('/suggest/:searchText', function (req, res) {
  var retObj = {};
  retObj.results=[];
  google.resultsPerPage = 25
  var nextCounter = 0;
  var finished = function () {

    async.each(retObj.results, function(result, callback) {
        var link = result.link;
      if(link && link.indexOf('youtube') != -1){
        console.log('video id -->',link.substring(link.indexOf('v=')+2,link.length));

        youtube.video (link.substring(link.indexOf('v=')+2,link.length)).details(function(err,data){
          //console.log('ytData -->',data);
          result.ytData = data;
          callback();
        });
      } else{
        callback();
      }
    }, function(err){
      retObj.status="success";
      res.send(retObj);
    });

    /*for (var i = 0; i < retObj.results.length; ++i) {
      if(retObj.results[i].link){
        if(links[i].link.indexOf('youtube') != -1){
          //get youtube data...
          console.log('video id -->',links[i].link.substring(links[i].link.indexOf('v=')+2,links[i].link.length));
          youtube.video (links[i].link.substring(links[i].link.indexOf('v=')+2,links[i].link.length)).details (console.log);
        }
      }
      //console.log(links[i].title + ' - ' + links[i].link) // link.href is an alias for link.link
      //console.log(links[i].description + "\n")
    }*/

  }
  console.log('searchText :: --->',req.params.searchText);
  google(req.params.searchText, function (err, next, links){
    if (err) console.error(err)

    for (var i = 0; i < links.length; ++i) {
      if(links[i].link){
      retObj.results.push({title:links[i].title,link:links[i].link,description:links[i].description});
        if(links[i].link.indexOf('youtube') != -1){
          //get youtube data...
          console.log('video id -->',links[i].link.substring(links[i].link.indexOf('v=')+2,links[i].link.length));
          //youtube.video (links[i].link.substring(links[i].link.indexOf('v=')+2,links[i].link.length)).details (console.log);
        }
      }
      //console.log(links[i].title + ' - ' + links[i].link) // link.href is an alias for link.link
      //console.log(links[i].description + "\n")
    }
    console.log('nextCounter  -->', nextCounter );
    if (nextCounter < 0) {
      nextCounter += 1
      if (next)
      {
        next();
        console.log('going again...');
      }else{
        console.log('finished...');
        finished();
      }
    }else{
      console.log('finished...');
      finished();
    }
  })

});

app.get('/', function (req, res) {
  res.send('Hello World!');
});

var server = app.listen(5015, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
