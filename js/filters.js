/*jshint globalstrict:true */
/*global angular:true */
'use strict';

angular.module('kibana.filters', [])
.filter('stringSort', function() {
  return function(input) {
    return input.sort();
  };
}).filter('pinnedQuery', function(querySrv) {
  return function( items, pinned) {
    var ret = _.filter(querySrv.ids,function(id){
      var v = querySrv.list[id];
      if(!_.isUndefined(v.pin) && v.pin === true && pinned === true) {
        return true;
      }
      if((_.isUndefined(v.pin) || v.pin === false) && pinned === false) {
        return true;
      }
    });
    return ret;
  };
}).filter('slice', function() {
  return function(arr, start, end) {
    if(!_.isUndefined(arr)) {
      return arr.slice(start, end);
    }
  };
}).filter('stringify', function() {
  return function(arr, start, end) {
    if(!_.isUndefined(arr)) {
      return arr.toString();
    }
  };
}).filter('noXml', function() {
  var noXml = function(text) {
    return _.isString(text) ?
      text.
      replace(/&/g, '&amp;').
      replace(/</g, '&lt;').
      replace(/>/g, '&gt;').
      replace(/'/g, '&#39;').
      replace(/"/g, '&quot;') :
      text;
  };
  return function(text) {
    return _.isArray(text) ?
      _.map(text,function(t) {
        return noXml(t);
      }) :
      noXml(text);
  };
}).filter('urlLink', function() {
  var  //URLs starting with http://, https://, or ftp://
    r1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim,
    //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
    r2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim,
    //Change email addresses to mailto:: links.
    r3 = /(\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6})/gim;

  var urlLink = function(text) {
    var t1,t2,t3;
    if(!_.isString(text)) {
      return text;
    } else {
      var i=1;
      _.each(text.match(r1), function(url) {
        t1 = text.replace(r1, "<a href=\"$1\" target=\"_blank\">$1</a>");
      });
      text = t1 || text;
      _.each(text.match(r2), function(url) {
        t2 = text.replace(r2, "$1<a href=\"http://$2\" target=\"_blank\">$2</a>");
      });
      text = t2 || text;
      _.each(text.match(r3), function(url) {
        t3 = text.replace(r3, "<a href=\"mailto:$1\">$1</a>");
      });
      text = t3 || text;
      return text;
    }
  };

  return function(text, target, otherProp) {

    return _.isArray(text) ?
      _.map(text,function(t) {
        return urlLink(t);
      }) :
      urlLink(text);
  };
}).filter('gistid', function() {
  var gist_pattern = /(\d{5,})|([a-z0-9]{10,})|(gist.github.com(\/*.*)\/[a-z0-9]{5,}\/*$)/;
  return function(input, scope) {
    //return input+"boners"
    if(!(_.isUndefined(input))) {
      var output = input.match(gist_pattern);
      if(!_.isNull(output) && !_.isUndefined(output)) {
        return output[0].replace(/.*\//, '');
      }
    }
  };
});