var app = angular.module('github-app', []);

app.controller('mainController', ['$scope', 'githubService', function($scope, githubService){
  $scope.showCount = false;
  $scope.user = githubService.user;

  githubService.reqsRemaining().then(function(response){
    $scope.reqsLeft = response.data.resources.core.remaining;
    $scope.showCount = true;
  });

  githubService.gitEvents().then(function(response){
    var infoArray = response.data.data;
    $scope.gitEventsArray = [];
    for (var i = 0; i < infoArray.length; i++){
      var parsedTimestamp = infoArray[i].created_at.split(/[a-zA-Z]+/);
      $scope.gitEventsArray.push({
        repoName: infoArray[i].repo.name,
        desc: infoArray[i].type,
        timestamp: parsedTimestamp[0] + ", " + parsedTimestamp[1]
      });
      if (infoArray[i].payload.commits){
        $scope.gitEventsArray[i].commitMsg = infoArray[i].payload.commits[0].message;
      }
    }
  });
}]);

app.factory('githubService', ['$http', function($http){
  var user = 'sothep';

  function gitEvents(){
    return $http.jsonp('https://api.github.com/users/' + user + '/events?callback=JSON_CALLBACK');
  }

  function reqsLeftThisHour(){
      return $http.get('https://api.github.com/rate_limit');
  }

  return {
    gitEvents: gitEvents,
    reqsRemaining: reqsLeftThisHour,
    user: user
  }
}]);
