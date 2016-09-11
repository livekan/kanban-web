/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var request = require("request");
var https = require("https");
var app = express();

var COMMENTS_FILE = path.join(__dirname, 'comments.json');
var EMPLOYEES_FILE = path.join(__dirname, 'employees.json');

var languages = {HTML:0, CSS:0, JavaScript:0, Java:0}
var myRes = null;

app.set('port', (process.env.PORT || 3016));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Additional middleware which will set headers that we need on each request.
app.use(function(req, res, next) {
    // Set permissive CORS header - this allows this server to be used only as
    // an API server in conjunction with something like webpack-dev-server.
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Disable caching so we'll always get the latest comments.
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

app.get('/api/notes', function(req, res) {
  fs.readFile(COMMENTS_FILE, function(err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    res.json(JSON.parse(data));
  });
});

app.get('/api/employees', function(req, res) {
  fs.readFile(EMPLOYEES_FILE, function(err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    res.json(JSON.parse(data));
  });
});

app.get('/api/github/:username', function(req, res){
  var username = req.params.username;

  if (username == "devanshk") languages = { HTML: 2012828,
    CSS: 864420,
    JavaScript: 873116,
    Java: 9130372,
    Ruby: 1934816,
    Shell: 64972,
    CoffeeScript: 6376,
    Nginx: 3216,
    Python: 244884,
    'C#': 24004 };
  else languages = { HTML: 5388156,
    CSS: 6339424,
    JavaScript: 24967444,
    Java: 18378460,
    Ruby: 3869632,
    Shell: 130284,
    CoffeeScript: 12752,
    Nginx: 6432,
    Python: 506796,
    'C#': 48008 };

  doStuff();
  console.log("languages is..");
  console.log(languages);
  returnVal = JSON.stringify(languages);
  console.log("Returning...");
  console.log(returnVal);
  res.json(returnVal);
});

function doStuff(){
  console.log("getting github yo");
  var username = "ndneighbor"

  var options = {
    host: 'api.github.com',
    path: '/users/' + username + '/repos?client_id=44201bb15711c6e095d6&client_secret=71faa084edb25ddc0389303b405b67a79cf46714',
    method: 'GET',
    headers: {'user-agent': 'node.js'}
  };

  var request = https.request(options, function(response){
  var body = '';
  response.on("data", function(chunk){
      body += chunk.toString('utf8');
  });

  response.on("end", function(){
      // console.log("Body: ", body);
      res = JSON.parse(body);
      for (var project in res){
        next = res[project].languages_url;
        console.log(next);
        pullLanguages(next);
      }
    });
  });

  console.log("bam.");
  request.end();
}

function pullLanguages(next){
  var options = {
    host: 'api.github.com',
    path: next+'?client_id=44201bb15711c6e095d6&client_secret=71faa084edb25ddc0389303b405b67a79cf46714',
    method: 'GET',
    headers: {'user-agent': 'node.js'}
  };

  var request = https.request(options, function(response){
  var body = '';
  response.on("data", function(chunk){
      body += chunk.toString('utf8');
  });

  response.on("end", function(){
      res = JSON.parse(body);
      console.log(res);
      for (var key in res) {
        if (res.hasOwnProperty(key)) {
          var temp = languages[key];
          if(temp == undefined){
            languages[key] = res[key];
          }
          else{
            languages[key] = languages[key] + res[key];
          }
        }
      }
      console.log("languages..");
      console.log(languages);
    });
  });

  console.log("bam");

  request.end();
}

app.post('/api/comments', function(req, res) {
  fs.readFile(COMMENTS_FILE, function(err, data) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    var comments = JSON.parse(data);
    var newComment = {
      id: Date.now(),
      author: req.body.author,
      text: req.body.text,
    };
    comments.push(newComment);
    fs.writeFile(COMMENTS_FILE, JSON.stringify(comments, null, 4), function(err) {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      res.json(comments);
    });
  });
});


app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
