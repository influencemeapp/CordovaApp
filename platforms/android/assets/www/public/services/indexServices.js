'use strict';

app.factory('ApiFactory', function ($http) {

	var API_URL = 'http://35.196.64.161:8080/api';

	var ApiFactory = {

		getList: function getList() {
			return $http({
				method: 'GET',
				//cache: true,
				url: API_URL + '/splash/Get',
				headers: { 'Content-Type': 'application/json' }
			}).then(function (status) {
				return status;
			}).catch(function (err) {
				console.log(err);
				alert(JSON.stringify(err));
			});
		},
		getAthletes: function getAthletes() {
			return $http({
				method: 'GET',
				//cache: true,
				url: API_URL + '/Athlete/Get?token=%22uyuiy6yyutyut%22',
				headers: { 'Content-Type': 'application/json' }
			}).then(function (status) {
				return status;
			}).catch(function (err) {
				console.log(err);
			});
		},
		getPlans: function getPlans() {
			return $http({
				method: 'GET',
				//cache: true,
				url: API_URL + '/Plan/Get?token=uyuiy6yyutyut',
				headers: { 'Content-Type': 'application/json' }
			}).then(function (status) {
				return status;
			}).catch(function (err) {
				console.log(err);
			});
		},
		getAthlete: function getAthlete(id) {
			return $http({
				method: 'GET',
				//cache: true,
				url: API_URL + '/Athlete/GetById?IdAthlete=' + id + '&token=uyuiy6yyutyut',
				headers: { 'Content-Type': 'application/json' }
			}).then(function (status) {
				return status;
			}).catch(function (err) {
				console.log(err);
			});
		},
		getPlan: function getPlan(id) {
			console.log(id);
			return $http({
				method: 'GET',
				//cache: true,
				url: API_URL + '/Plan/GetPlansbyAthletes?token="uyuiy6yyutyut"&idAthletes=' + id,
				headers: { 'Content-Type': 'application/json' }
			}).then(function (status) {
				return status;
			}).catch(function (err) {
				console.log(err);
			});
		},
		getPlanByRoutine: function getPlanByRoutine(id) {
			//new
			console.log(id);
			return $http({
				method: 'GET',
				//cache: true,
				url: API_URL + '/Plan/GetById?token="uyuiy6yyutyut"&IdPlan=' + id,
				headers: { 'Content-Type': 'application/json' }
			}).then(function (status) {
				return status;
			}).catch(function (err) {
				console.log(err);
			});
		},
		getRoutinesByPlan: function getRoutinesByPlan(obj) {
			console.log("PARAM ROUTINE => ", obj);
			if (obj.idPlan > 0)
				var url = API_URL + '/Routine/RoutinesByPlan?token=%22uyuiy6yyutyut%22&IdPlan=' + obj.idPlan + '&CustomerPlan=' + obj.idCustomerPlan;
			else
				var url = API_URL + '/Routine/RoutinesByPlan?token=%22uyuiy6yyutyut%22&IdPlan=' + obj;

			return $http({
				method: 'GET',
				//cache: true,
				url: url,
				headers: { 'Content-Type': 'application/json' }
			}).then(function (status) {
				return status;
			}).catch(function (err) {
				console.log(err);
			});
		},
		getExercisesByRoutines: function getExercisesByRoutines(id) {
			console.log("ID API ROU", id);
			return $http({
				method: 'GET',
				//cache: true,
				url: API_URL + '/Exercise/ExerciseByRoutines?token=22uyuiy6yyutyut22&idRoutine=' + id,
				headers: { 'Content-Type': 'application/json' }
			}).then(function (status) {
				return status;
			}).catch(function (err) {
				console.log(err);
			});
		},
		getExercisesById: function getExercisesById(id) {
			return $http({
				method: 'GET',
				//cache: true,
				url: API_URL + '/Exercise/GetById?token=%22uyuiy6yyutyut%22&IdExercise=' + id,
				headers: { 'Content-Type': 'application/json' }
			}).then(function (status) {
				return status;
			}).catch(function (err) {
				console.log(err);
			});
		},
		getFAQ: function getFAQ() {
			return $http({
				method: 'GET',
				//cache: true,
				url: API_URL + '/Question/FAQ',
				headers: { 'Content-Type': 'application/json' }
			}).then(function (status) {
				return status;
			}).catch(function (err) {
				console.log(err);
			});
		},
		getPlansbyCustomer: function getPlansbyCustomer(id) {
			return $http({
				method: 'GET',
				//cache: true,
				url: API_URL + '/plan/GetPlansbyCustomer?Token=uyuiy6yyutyut&idCustomer=' + id,
				headers: { 'Content-Type': 'application/json' }
			}).then(function (status) {
				return status;
			}).catch(function (err) {
				console.log(err);
			});
		},
		getCustomerProfile: function getCustomerProfile(id) {
			return $http({
				method: 'GET',
				//cache: true,
				url: API_URL + '/customer/Profile?IdCustomer=' + id + '&Token=uyuiy6yyutyut',
				headers: { 'Content-Type': 'application/json' }
			}).then(function (status) {
				return status;
			}).catch(function (err) {
				console.log(err);
			});
		},
		getCustomerState: function getCustomerState(id) {
			return $http({
				method: 'GET',
				//cache: true,
				url: API_URL + '/customer/State?token=yueyrie&IdCustomer=' + id + '&Token=uyuiy6yyutyut',
				headers: { 'Content-Type': 'application/json' }
			}).then(function (status) {
				return status;
			}).catch(function (err) {
				console.log(err);
			});
		},
		getProgress: function getProgress(id) {
			return $http({
				method: 'GET',
				//cache: true,
				url: API_URL + '/progress/GetByCustomer?token=%22uyuiy6yyutyut%22&IdCustomer=' + id,
				headers: { 'Content-Type': 'application/json' }
			}).then(function (status) {
				return status;
			}).catch(function (err) {
				console.log(err);
			});
		},
		getAllByCustomer: function getAllByCustomer(id) {
			return $http({
				method: 'GET',
				//cache: true,
				url: API_URL + '/progress/GetAllByCustomer?token=22uyuiy6yyutyut&IdCustomer=' + id,
				headers: { 'Content-Type': 'application/json' }
			}).then(function (status) {
				return status;
			}).catch(function (err) {
				console.log(err);
			});
		},
		searcherAthlete: function searcherAthlete(value) {
			return $http({
				method: 'GET',
				//cache: true,
				url: API_URL + '/search/search?token=jlkjlk&search=' + value + '&idTypeSearch=2',
				headers: { 'Content-Type': 'application/json' }
			}).then(function (status) {
				return status;
			}).catch(function (err) {
				console.log(err);
			});
		},
		searcherPlan: function searcherPlan(value) {
			return $http({
				method: 'GET',
				//cache: true,
				url: API_URL + '/search/search?token=jlkjlk&search=' + value + '&idTypeSearch=1',
				headers: { 'Content-Type': 'application/json' }
			}).then(function (status) {
				return status;
			}).catch(function (err) {
				console.log(err);
			});
		},
		cancelSubscription: function cancelSubscription(id) {
			return $http({
				method: 'GET',
				//cache: true,
				url: API_URL + '/customer/CancelSubscription?token=yueyrie&IdCustomer=' + id,
				headers: { 'Content-Type': 'application/json' }
			}).then(function (status) {
				return status;
			}).catch(function (err) {
				console.log(err);
			});
		},
		Subscription: function Subscription(data) {
			return $http.post(API_URL + '/customer/Subscription?token=yueyrie', data).then(function (object) {
				return object;
			}).catch(function (err) {
				console.log(err);
			});
		},
		getPlanState: function getPlanState(id) {
			return $http({
				method: 'GET',
				//cache: true,
				url: API_URL + '/customer/PlanState?token=1&Id=' + id,
				headers: { 'Content-Type': 'application/json' }
			}).then(function (status) {
				return status;
			}).catch(function (err) {
				console.log(err);
			});
		},
		customerPlan: function customerPlan(data) {
			console.log("CONSOLE =>", data);
			return $http.post(API_URL + '/customer/plan?token=yueyrie', data).then(function (object) {
				return object;
			}).catch(function (err) {
				console.log(err);
			});
		},
		validationRoutine: function validationRoutine(data) {
			return $http({
				method: 'GET',
				//cache: true,
				url: API_URL + '/Routine/Status?token=yueyrie&idCustomerPlan=' + data.idCustomer + '&idRoutine=' + data.idRoutine,
				headers: { 'Content-Type': 'application/json' }
			}).then(function (status) {
				return status;
			}).catch(function (err) {
				console.log(err);
			});
		},
		startRoutine: function startRoutine(data) {
			console.log("DOATOS DESDE SERVICE: ", data);
			return $http.post(API_URL + '/Routine/Start?token=yueyrie', data).then(function (object) {
				return object;
			}).catch(function (err) {
				console.log(err);
			});
		},
		finishRoutine: function finishRoutine(data) {
			return $http({
				method: 'DELETE',
				//cache: true,
				url: API_URL + '/Routine/FinishRoutine?token=yueyrie&id=' + data,
				headers: { 'Content-Type': 'application/json' }
			}).then(function (status) {
				return status;
			}).catch(function (err) {
				console.log(err);
			});
		},
		finishRoutine2: function finishRoutine2(data) {
			console.log("datos finalizar: ", data);
			return $http.post(API_URL + '/Routine/FinishRoutine2?token=yueyrie&id=' + data, data).then(function (object) {
				return object;
			}).catch(function (err) {
				console.log(err);
			});
		},
		weightExercises: function weightExercises(data) {
			return $http.post(API_URL + '/serie/InsertCustomerData?token=uYUUYGuyuytr', data).then(function (object) {
				return object;
			}).catch(function (err) {
				console.log(err);
			});
		},
		getWeightExercises: function getWeightExercises(data) {
			return $http({
				method: 'GET',
				//cache: true,
				url: API_URL + '/serie/ByCustomerRoutine?token=dsds&serie=' + data.ser_Id + '&CusRoutine=' + data.cur_Id,
				headers: { 'Content-Type': 'application/json' }
			}).then(function (status) {
				return status;
			}).catch(function (err) {
				console.log(err);
			});
		},
		insertUser: function insertUser(data) {
			console.log("insert User: ", data);
			return $http.post(API_URL + '/customer/Insert', data).then(function (object) {
				return object;
			}).catch(function (err) {
				console.log(err);
			});
		},
		validateCustomerRoutine: function validateCustomerRoutine(data) {
			console.log("validate rutine: ", data);
			return $http.post(API_URL + '/Routine/validateCustomerRoutine?token=yueyrie', data).then(function (object) {
				return object;
			}).catch(function (err) {
				console.log(err);
			});
		},
		updateEmail: function updateEmail(data) {
			console.log("put email: ", data);
			return $http.put(API_URL + '/customer/Change/Email', data).then(function (object) {
				return object;
			}).catch(function (err) {
				console.log(err);
			});
		},
		updateWeight: function updateWeight(data) {
			console.log("put weight: ", data);
			return $http.put(API_URL + '/customer/Change/weight', data).then(function (object) {
				return object;
			}).catch(function (err) {
				console.log(err);
			});
		},
		
		updateHeight: function updateHeight(data) {
			return $http.put(API_URL +'/customer/ChangeHeight?token=lklkl',data).then(function(object){
				return object;
			}).catch(function(err){
			console.log(err);
			})
		},
		changePlan: function changePlan(data) {
			console.log("changePlan: ", data);
			return $http.post(API_URL + '/customer/ChangePlan?token=lklkl', data).then(function (object) {
				return object;
			}).catch(function (err) {
				console.log(err);
			});
		},
		getValidationRoutinesDay: function getValidationRoutinesDay(data) {
			return $http({
				method: 'GET',
				//cache: true,
				url: API_URL + '/routine/ValidationRoutinesDay?token=oiu&IdCus='+data.idCus+'&IdCup='+data.idCup+'&IdRoutine='+data.idRoutine,
				headers: { 'Content-Type': 'application/json' }
			}).then(function (status) {
				return status;
			}).catch(function (err) {
				console.log(err);
			});
		},
		getTextCountry: function getTextCountry() {
			return $http({
				method: 'GET',
				//cache: true,
				url: API_URL + '/operator/get?token=123',
				headers: { 'Content-Type': 'application/json' }
			}).then(function (status) {
				return status;
			}).catch(function (err) {
				console.log(err);
			});
		},

	};
	return ApiFactory;
});
