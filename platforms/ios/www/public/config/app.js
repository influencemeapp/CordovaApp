'use strict';

var objRedirect = {
	userAuthenticated: ["$http", "$q", "$location", function ($http, $q, $location) {
		var deferred = $q.defer();
		if (firebase.auth().currentUser) {
			deferred.resolve();
		} else {
			deferred.reject('NOT_AUTHORIZED');
			$location.path('/login');
		}
		return deferred.promise;
	}]
};

var app = angular.module('appInfluenceme', ['ui.router', 'angular-scroll-animate', 'ui.swiper', 'fullPage.js', 'lazy-scroll', '720kb.tooltips', 'ngAnimate','slickCarousel']);
app.config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
	// loader
	$httpProvider.interceptors.push(function ($q, $rootScope) {
		return {
			'request': function request(config) {
				$rootScope.$broadcast('REQUEST_START');
				return config;
			},
			'response': function response(_response) {
				$rootScope.$broadcast('REQUEST_END');
				return _response;
			},
			'responseError': function responseError(rejection) {
				$rootScope.$broadcast('REQUEST_END');

				return $q.reject(rejection);
			}
		};
	});
	// cache
	//$httpProvider.defaults.cache = true;
	$stateProvider.state('index', {
		url: '/',
		templateUrl: 'views/firts.html',
		controller: 'FirtsController',
		controllerAs: 'index'
	}).state('login', {
		url: '/login',
		templateUrl: 'views/login.html',
		controller: 'LoginController',
		controllerAs: 'login'
	}).state('loginTlf', {
		url: '/loginTlf',
		templateUrl: 'views/loginTlf.html',
		controller: 'LoginTlfController',
		controllerAs: 'loginTlf'
	}).state('loginEmail', {
		url: '/loginEmail',
		templateUrl: 'views/loginEmail.html',
		controller: 'LoginEmailController',
		controllerAs: 'loginEmail'
	}).state('home', {
		url: '/home',
		templateUrl: 'views/home.html',
		controller: 'HomeController',
		controllerAs: 'home',
		resolve: objRedirect
	}).state('progress', {
		url: '/progress',
		templateUrl: 'views/progress.html',
		controller: 'ProgressController',
		controllerAs: 'progress',
		resolve: objRedirect
	}).state('progressDetail', {
		url: '/progressDetail',
		templateUrl: 'views/progressDetail.html',
		controller: 'ProgressDetailController',
		controllerAs: 'progressDetail',
		resolve: objRedirect
	}).state('dailyRoutine', {
		url: '/dailyRoutine',
		templateUrl: 'views/dailyRoutine.html',
		resolve: objRedirect
		//controller: 'DailyRoutineController', defined in view
		//controllerAs: 'dailyRoutine'
	}).state('routinesByPlan', {
		url: '/routinesByPlan',
		templateUrl: 'views/routinesByPlan.html',
		resolve: objRedirect
		//controller: 'RoutinesByPlanController', defined in view
		//controllerAs: 'routinesByPlan'
	}).state('plansByAthlete', {
		url: '/plansByAthlete',
		templateUrl: 'views/plansByAthlete.html',
		//controller: 'PlansByAthleteController', defined in view
		controllerAs: 'plansByAthlete',
		resolve: objRedirect
	}).state('perfil', {
		url: '/perfil',
		templateUrl: 'views/perfil.html',
		controller: 'PerfilController',
		controllerAs: 'perfil',
		resolve: objRedirect
	}).state('calendar', {
		url: '/calendar',
		templateUrl: 'views/calendar.html',
		controller: 'CalendarController',
		controllerAs: 'calendar',
		resolve: objRedirect
	});
	$urlRouterProvider.otherwise('/');
});
