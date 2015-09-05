var app = angular.module('app', ['app.config', 'ui.router', 'ngResource', 'CrossCheckList']);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
        //unmactched URLs return to monitor page
        $urlRouterProvider.otherwise('/list');

        $stateProvider
            .state('list', {
                url: '/list',
                templateUrl: 'partials/list.html',
                controller: 'List'
            });

        //$locationProvider.html5Mode(true);

    }]);

app.run(function($rootScope) {
    $rootScope.$on('$stateChangeError', console.log.bind(console));
});

angular.module('CrossCheckList', ['app.config', 'ui.router', 'ui.bootstrap']);
