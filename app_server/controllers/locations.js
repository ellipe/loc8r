/* GET 'home' page */

var request = require('request');
var apiOptions = {
  server : "http://localhost:3000"
};
if (process.env.NODE_ENV === 'production') {
  apiOptions.server = "https://secret-plains-12522.herokuapp.com";
}

var _showError = function(req, res, status){
  var title, content;
  if (status === 404) {
    title = '404, page not found';
    content = "Oh dear. Looks like we can't find this page. Sorry.";

  }else {
    title = status + ", something's gone wrong";
    content = "Something, somewhere, has gone just a little bit wrong.";
  }

  res.status = status;
  res.render('generic-text', {
    title: title,
    content: content
  });
};

var _formatDistance = function(distance){
  if (isNaN(distance)) {
    return ' - '
  }else {
    var numDistance, unit;
    if (distance > 1) {
      numDistance = parseFloat(distance).toFixed(1);
      unit  = ' km';
    }else {
      numDistance = parseFloat(distance * 1000,10);
      unit = ' m';
    }
    return numDistance + unit;
  }
};


var getLocationInfo = function(req, res, callback){
  var requestOptions, path;
  path = '/api/locations/'+ req.params.locationid;
  requestOptions = {
    uri : apiOptions.server + path,
    method : 'GET',
    json : {},
  };
  request(requestOptions,
  function(err, response, body){
    var data = body;
    if (response.statusCode === 200) {
      data.coords = {
        lng: data.coords[0],
        lat: data.coords[1]
      }
      callback(req, res, data);
    }else {
      _showError(req, res, response.statusCode);
    }

  });
};


var renderReviewForm = function(req, res, locDetail) {
  res.render('location-review-form', {
    title: 'Review ' + locDetail.name +' on Loc8r',
    pageHeader: {
      title: 'Review '+ locDetail.name
    },
    error: req.query.err,
    url: req.originalUrl
  });
};

var renderDetailPage = function(req, res, responseBody){
  res.render('location-info', {
    title: responseBody.name,
    pageHeader: {
      title: responseBody.name
    },
    sidebar: {
      context: 'is on Loc8r because it has accessible wifi and space to sit ➥ down with your laptop and get some work done.',
      callToAction: 'If you\'ve been and you like it - or if you don\'t - ➥ please leave a review to help other people just like you.'
    },
    location: responseBody
  });
};


var renderHomepage = function(req, res){
  res.render('locations-list', {
    title: 'Loc8r - find a place to work with wifi',
    pageHeader: {
      title: 'Loc8r',
      strapline: 'Find places to work with wifi near you!'
    },
    sidebar: "Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake or a pint? Let Loc8r help you find the place you're looking for."
   });
};

module.exports.homelist = function(req, res){
  renderHomepage(req, res);
};


/* GET 'Location info' page */
module.exports.locationInfo = function(req, res){
  getLocationInfo(req, res, function(req, res, responseData){
    renderDetailPage(req, res, responseData);
  });

};

/* GET 'Add review' page */
module.exports.addReview = function(req, res){
  getLocationInfo(req, res, function(req, res, responseData){
    renderReviewForm(req, res, responseData);
  });
};

module.exports.doAddReview = function(req, res){
  var requestOptions, path, locationid, postdata;
  locationid = req.params.locationid;
  path = '/api/locations/' + locationid + '/reviews';
  postdata = {
    author: req.body.name,
    rating: parseInt(req.body.rating, 10),
    reviewText: req.body.review
  };

  requestOptions = {
    uri : apiOptions.server + path,
    method : 'POST',
    json : postdata,
  };
  if (!postdata.author || !postdata.rating || !postdata.reviewText) {
  res.redirect('/location/' + locationid + '/reviews/new?err=val');
  } else {
    request(requestOptions,
    function(err, response, body){
      if (response.statusCode === 201) {
        res.redirect('/location/' + locationid);
      }else if (response.statusCode === 404 && body.name && body.name === "ValidationError") {
        res.redirect('/location/' + locationid + '/reviews/new?err=val');
      }else {
        _showError(req, res, response.statusCode);
      }

    });
  }
};

