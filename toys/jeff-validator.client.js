/**
 * Copyright 2013 GetHuman LLC
 * Author: christian
 * Date: 9/14/13
 *
 * Description...
 */
var translateController = function($scope) {
    $scope.markup =	"{"
        +	"\n\t html: {"
        + 	"\n\t\t head: {"
        +	"\n\t\t\t title: \"Jeff demo\","
        +	"\n\t\t\t \"meta[charset=utf8]\": N"
        +	"\n\t\t },"
        +	"\n\t\t body: {"
        +	"\n\t\t\t \"div.header\": bootstrapNav([\"Home\",\"About\",\"Contact us\"]),"
        +	"\n\t\t\t \"div#myID.aClz.anotherClz[anAttr=aVal]\": \"Hi \" + user.first,"
        + 	"\n\t\t\t h1: \"There are \" + tweets.length + \" tweets waiting for you\","
        +	"\n\t\t\t div: forEachTemplate(tweets,\"tweet\",\"{small:tweet.lapse, p:tweet.content}\"), "
        + 	"\n\t\t\t ol: {"
        +	"\n\t\t\t\t \"li.bullet\": ["
        +	"\n\t\t\t\t\t \"Top all-time tweets\","
        +	"\n\t\t\t\t\t templateCool, "
        +	"\n\t\t\t\t\t (10 * 7 + 4) + \" more items...\""
        +	"\n\t\t\t\t ]"
        +	"\n\t\t\t}"
        +	"\n\t\t}"
        +	"\n\t}"
        +	"\n};";
    $scope.mdl = "{"
        + "\n\t user: { "
        + "\n\t\t first: \"Christian\","
        + "\n\t\t last: \"Allen\""
        + "\n\t },"
        + "\n\t tweets: ["
        + "\n\t\t { lapse: \"1 min ago\", content: \"This is an awesome tweet!\" },"
        + "\n\t\t { lapse: \"3 mins ago\", content: \"Something happened!\" },"
        + "\n\t\t { lapse: \"7 mins ago\", content: \"a long, long time ago...\" }"
        + "\n\t ], "
        + "\n\t bootstrapNav: function(items) {"
        + "\n\t\t var ret = { \"div.navbar\": { \"div.nav.pill\": [] } };"
        + "\n\t\t for( var i = 0; i < items.length; i++ ) { "
        + "\n\t\t\t ret[\"div.navbar\"][\"div.nav.pill\"].push(items[i]);"
        + "\n\t\t } "
        + "\n\t\t return ret;"
        + "\n\t },"
        + "\n\t templateCool: { "
        + "\n\t\t div: { "
        + "\n\t\t\t \"img[src=photo.jpg]\": N, "
        + "\n\t\t\t p: \"A complicated item\""
        + "\n\t\t },"
        + "\n\t\t class: \"panel\""
        + "\n\t }"
        + "\n};";
}

var jeffApp = angular.module('jeffApp', [])
    .directive("translatedMarkup", function() {
        return function(scope, element, attrs) {
            var markup;

            scope.$watch(attrs.translatedMarkup, function(value) {
                markup = value;
                console.log("model in watch is " + scope.mdl);
                var translated = Jeff.jsonStringToMarkupStringPretty(markup, scope.mdl);
                if ( translated != null ) {
                    element.text(translated);
                }
            })

        }
    })