'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var imgSplash = 'http://35.196.64.161:8080/api/file/Get/';
//localStorage.clear();

app.filter('strLimit', ['$filter', function ($filter) {
	return function (input, limit) {
		if (!input) return;
		if (input.length <= limit) {
			return input;
		}

		return $filter('limitTo')(input, limit) + '...';
	};
}]);

app.directive('readMore', function() {
  return {
    restrict: 'A',
    transclude: true,
    replace: true,
    template: '<p></p>',
    scope: {
      moreText: '@',
      lessText: '@',
      words: '@',
      ellipsis: '@',
      char: '@',
      limit: '@',
      content: '@'
    },
    link: function(scope, elem, attr, ctrl, transclude) {
      var moreText = angular.isUndefined(scope.moreText) ? ' <a class="read-more">Leer Más...</a>' : ' <a class="read-more">' + scope.moreText + '</a>',
        lessText = angular.isUndefined(scope.lessText) ? ' <a class="read-less">Leer Menos ^</a>' : ' <a class="read-less">' + scope.lessText + '</a>',
        ellipsis = angular.isUndefined(scope.ellipsis) ? '' : scope.ellipsis,
        limit = angular.isUndefined(scope.limit) ? 400 : scope.limit;

      attr.$observe('content', function(str) {
        readmore(str);
      });

      transclude(scope.$parent, function(clone, scope) {
        readmore(clone.text().trim());
      });

      function readmore(text) {

        var text = text,
          orig = text,
          regex = /\s+/gi,
          charCount = text.length,
          wordCount = text.trim().replace(regex, ' ').split(' ').length,
          countBy = 'char',
          count = charCount,
          foundWords = [],
          markup = text,
          more = '';

        if (!angular.isUndefined(attr.words)) {
          countBy = 'words';
          count = wordCount;
        }

        if (countBy === 'words') { // Count words

          foundWords = text.split(/\s+/);

          if (foundWords.length > limit) {
            text = foundWords.slice(0, limit).join(' ') + ellipsis;
            more = foundWords.slice(limit, count).join(' ');
            markup = text + moreText + '<span class="more-text">' + more + lessText + '</span>';
          }

        } else { // Count characters

          if (count > limit) {
            text = orig.slice(0, limit) + ellipsis;
            more = orig.slice(limit, count);
            markup = text + moreText + '<span class="more-text">' + more + lessText + '</span>';
          }

        }

        elem.append(markup);
        elem.find('.read-more').on('click', function() {
          $(this).hide();
          elem.find('.more-text').addClass('show').slideDown();
        });
        elem.find('.read-less').on('click', function() {
          elem.find('.read-more').show();
          elem.find('.more-text').hide().removeClass('show');
        });

      }
    }
  };
});

app.directive('imageonload', function () {
	return {
		restrict: 'A',
		link: function link(scope, element, attrs) {
			element.bind('load', function () {
				//console.log('image is loaded');
				scope.prr = true;
			});
			element.bind('error', function () {
				//console.log('image could not be loaded');
			});
		}
	};
});

app.directive('loadingMsg', [function () {
	return {
		template: '<div ng-show="pending" id="preloader-app" data-loading>\n\t\t\t\t\t    <div id="status-app" class="ld ld-ring ld-spin"></div>\n\t\t\t\t   </div>',
		scope: {},
		link: function link(scope, element, attrs) {
			scope.pending = 0;

			scope.$on('REQUEST_START', function () {
				scope.pending += 1;
			});

			scope.$on('REQUEST_END', function () {
				scope.pending -= 1;
			});
		}
	};
}]);

app.controller('FirtsController', function ($scope, ApiFactory) {
	console.log('index');
	angular.element('body').css({ background: '#4d4d4d' });

	firebase.auth().onAuthStateChanged(function (user) {
		if(user){
			ApiFactory.getCustomerState(user.uid).then(function (state) {
				if (state.data.error.value === 1) { //existe user BD
					location.href = "#!/home";
				}
			});
		}


	});

	$scope.arrSlide = [{
		title: "dist/img/Icono-blanco.png",
		title2: "dist/img/Logo-blanco-sin.png",
		sub: "Entrena usando las rutinas personales de tus Influencers Favoritos.",
		colorButton: 1,
		colorText: 1,
		url: "dist/img/influencers.jpg"
	},
	{
		title: "ENTRENA",
		title2: "",
		sub: "Elige tu nivel de resistencia y personaliza tu rutina.",
		colorButton: 2,
		colorText: 1,
		url: "dist/img/influencer_yarishna.jpg"
	},
	{
		title: "EXPLORA",
		title2: "",
		sub: "Existe un plan para cada una de las áreas que deseas trabajar.",
		colorButton: 1,
		colorText: 1,
		url: "dist/img/influencer_alex.jpg"
	}];
});

app.controller('LoginController', function ($scope, ApiFactory, typeLoginParam) {
	console.log('login');
	angular.element('body').css({ background: '#4d4d4d' });

	firebase.auth().onAuthStateChanged(function (user) {
		if (user) {
			ApiFactory.getCustomerState(user.uid).then(function (state) {
				if (state.data.error.value === 1) { //existe user BD
					location.href = "#!/home";
				}
			});
		}
	});

	var provider = new firebase.auth.FacebookAuthProvider().setCustomParameters({ auth_type: 'reauthenticate' });
	$scope.loginFB = function () {
		firebase.auth().signInWithRedirect(provider).then(function () {
			firebase.auth().getRedirectResult().then(function (result) {
				var token = result.credential.accessToken;
				var user = result.user;
				typeLoginParam.setString(2); //Login FB
				localStorage.setItem("typeLoginParam", 2);
				location.href = "#!/home";
			}).catch(function (error) {
				console.log(error);
				var errorCode = error.code;
				var errorMessage = error.message;
			});
		});
	};

});

app.controller('LoginTlfController', function ($scope, ApiFactory, typeLoginParam) {
	console.log('login1');
	angular.element('body').css({ background: 'white' });
	firebase.auth().onAuthStateChanged(function (user) {
		if (user) {
			ApiFactory.getCustomerState(user.uid).then(function (state) {
				if (state.data.error.value === 1) { //existe user BD
					location.href = "#!/home";
				}
			});
		}
	});
	$(function () {
		$("#phone").focus();
		$("#countries").msDropdown();
		$("#operator").msDropdown();
		$("#operator2").msDropdown();
		$("#operator3").msDropdown();
		$("#operator4").msDropdown();
		$('#co').hide();
		$('#ve').hide();
		$('#in').hide();
		$('#do').show();
		$('.modal').modal({
			dismissible: true,
			opacity    : .5,
			inDuration : 700,
			outDuration: 400,
			startingTop: '4%',
			endingTop: '10%',
			ready: function ready(modal, trigger) {
				console.log('abre');
			},
			complete: function complete(event) {
				console.log('cierra');
			}
		});
	});

	$('.termAccept').on('click', function () {
		$('#termCheck').prop('checked', true);
	});

	$('#countries').change(function () {
		console.log($(this).val());
		if ($(this).val() == '+58') {
			$('#ve').show();
			$('#co').hide();
			$('#do').hide();
			$('#in').hide();
		} else if ($(this).val() == '+57') {
			$('#co').show();
			$('#ve').hide();
			$('#do').hide();
			$('#in').hide();
		} else if ($(this).val() == '+1') {
			$('#do').show();
			$('#co').hide();
			$('#ve').hide();
			$('#in').hide();
		}
		else if ($(this).val() == '+91') {
			$('#do').hide();
			$('#co').hide();
			$('#ve').hide();
			$('#in').hide();
			$('#in').show();
		}
	});

	setTimeout(function () {

		$('#frm-phone').submit(function (e) {
			e.preventDefault();

			if ($('input[id="termCheck"]').is(':checked')) {
				// check checkbox
				//1->  ENVIO SMS
				//2->  VALIDO EL CODIGO
				var proceso = $(this).data('proceso');
				if (proceso == 1) {
					$scope.enviarSMS(1);
				} else if (proceso == 2) {
					$scope.enviarSMS(2);
				}
			} else {
				Materialize.toast('<div><p style="font-size: 3.5vw;">Debes leer y aceptar los términos y condiciones.</p></div>', 2500, 'red');
			}

		});


		$scope.enviarSMS = function (param) {

			var flag = $('#countries').val();
			if (flag == '+57') {
				var operator = $('#operator').val();
			} else if (flag == '+1') {
				var operator = $('#operator2').val();
			} else if (flag == '+58') {
				var operator = $('#operator3').val();
			}else if (flag == '+91') {
				var operator = $('#operator4').val();
			}
			var phone = $('#phone').val();
			//validate phone
			var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
			if (!phone.match(phoneno)) {
				Materialize.toast('Tel\xE9fono Inv\xE1lido', 3000, 'red');
				return false;
			}
			var phoneComplete = flag + phone;
			$('#showNumber').html(phoneComplete);
			$('#txtInfo').html('Ingresa el Código');
			window.FirebasePlugin.verifyPhoneNumber(phoneComplete, 120, function (credential) {
				console.log('SMS ENVIADO');
				// SMS sent
				if (param === 1) {
					Materialize.Toast.removeAll();
					Materialize.toast('SMS enviado.', 3000, 'green');
					$('#btn_change').fadeIn();
					$('#frm-phone').data('proceso', 2);
					$('#div-code').fadeIn();
					$('#formInit').fadeOut();
					$('#btn_phone').html('Registrar');

				} else if (param === 2) {
					/* var code = $('#code').val(); */
					var code = $('#input1').val() + $('#input2').val() + $('#input3').val() + $('#input4').val() + $('#input5').val() + $('#input6').val();
					var verificationId = credential.verificationId;
					var signInCredential = firebase.auth.PhoneAuthProvider.credential(verificationId, code);

					firebase.auth().signInWithCredential(signInCredential).then(function (res) {
						typeLoginParam.setString({
							type: 1,
							operator: operator,
							phone: phoneComplete
						}); //Login SMS
						localStorage.setItem("typeLoginParam", 1);

						location.href = "#!/home";
					}, function (error) {
						console.log("aqui1 => ",error);
						if (error == 'Error: The SMS verification code used to create the phone auth credential is invalid. Please resend the verification code sms and be sure use the verification code provided by the user.') {
							swal({
								title: 'Código Inválido',
								text: "El código que ingresaste no es válido, asegúrate que estás ingresando el código proporcionado correctamente. Si aún no logras acceder vuelve a enviar el SMS del código de verificación.",
								type: 'error',
								showCancelButton: false,
								confirmButtonText: 'Ok',
								confirmButtonColor: '#FF4200'
							});
						} else if (error == 'Error: The SMS code has expired.Please re-send the verification code to try again.') {
							swal({
								title: 'Código Inválido',
								text: "El código de SMS ha caducado.Vuelve a enviar el código de verificación para volver a intentarlo.",
								type: 'error',
								showCancelButton: false,
								confirmButtonText: 'Ok',
								confirmButtonColor: '#FF4200'
							});
						} else if (error == 'Error: This credential is already associated with a different user account.'){
							swal({
								title: 'Error',
								text: "Esta credencial ya está asociada a una cuenta de usuario diferente.",
								type: 'error',
								showCancelButton: false,
								confirmButtonText: 'Ok',
								confirmButtonColor: '#FF4200'
							});
						} else if (error == 'Error: User can only be linked to one identity for the given provider.') {
							swal({
								title: 'Error',
								text: "El usuario solo puede vincularse a una identidad para el proveedor determinado",
								type: 'error',
								showCancelButton: false,
								confirmButtonText: 'Ok',
								confirmButtonColor: '#FF4200'
							});
						}
						if (error.code == 'auth/invalid-verification-code') {
							Materialize.toast('C\xF3digo Inv\xE1lido.', 3000, 'red');
						} else if (error.code == 'auth/code-expired') {
							Materialize.toast('C\xF3digo SMS Expirado.', 3000, 'red');
						}
					});
				} else if (param === 3) {
					Materialize.Toast.removeAll();
					Materialize.toast('SMS Re-enviado.', 3000, 'green');
					$('#newCode').fadeIn();

				}
			}, function (error) {
				console.log("aqui2 => ", error);
			});
		};

		$scope.reiniciar = function () {
			$('#txtInfo').html('Ingresa con tu Número Móvil');
			$('#formInit').fadeIn();
			$('#btn_change').fadeOut();
			$('#frm-phone').data('proceso', 1);
			$('#div-code').fadeOut();
			$('#btn_phone').html('ENVIAR SMS');
		};
	}, 2000);
});

app.controller('LoginEmailController', function ($scope, ApiFactory, typeLoginParam) {
	console.log('loginEmail');
	firebase.auth().onAuthStateChanged(function (user) {
		if (user && user.providerData[0].providerId == 'facebook.com' || user && user.providerData[0].providerId == 'phone' || user && user.providerData[0].providerId == 'password' && user.emailVerified) location.href = "#!/home";
	});

	$(function () {
		Materialize.updateTextFields();
		$('#signup').on('click', function () {
			$('#iEmail').hide();
			$('#rEmail').fadeIn();
			$('#txtLabel').html('Registrate con tu Email');
			$('#ibtn').hide();
			$('#rbtn').fadeIn();
		});
		$('#login').on('click', function () {
			$('#iEmail').fadeIn();
			$('#rEmail').hide();
			$('#txtLabel').html('Ingresa con tu Email');
			$('#ibtn').fadeIn();
			$('#rbtn').hide();
		});
		$('#yourForgot').on('click', function () {
			$('#iEmail').hide();
			$('#ibtn').hide();
			$('#rbtn').hide();
			$('#txtLabel').html('Ingresa tu Email');
			$('#yourForgotForm').fadeIn();
		});
		$('#loginForgot').on('click', function () {
			$('#iEmail').fadeIn();
			$('#yourForgotForm').hide();
			$('#txtLabel').html('Ingresa con tu Email');
			$('#ibtn').fadeIn();
			$('#rbtn').hide();
		});

		$('#cemail').focus();

		$("#formValidate").validate({
			rules: {
				cemail: {
					required: true,
					email: true
				},
				rcemail: {
					required: true,
					email: true
				},
				rpassword: {
					required: true
				},
				rcpassword: {
					required: true,
					equalTo: "#rpassword"
				}
			},
			//For custom messages
			messages: {
				cemail: {
					required: "Ingrese un correo válido"
					//minlength: "Ingrese como mínimo 5 caracteres",
				},
				rcemail: {
					required: "Ingrese un correo válido"
					//minlength: "Ingrese como mínimo 5 caracteres",
				},
				rcpassword: "Error: La contraseña no coincide"
			},
			errorElement: 'div',
			errorPlacement: function errorPlacement(error, element) {
				var placement = $(element).data('error');
				if (placement) {
					$(placement).append(error);
				} else {
					error.insertAfter(element);
				}
			}
		});
	});

	$('#rcemail').on('change', function () {
		$('#cemail').val($('#rcemail').val());
		Materialize.updateTextFields();
	});

	//get elements
	var cemail     = document.getElementById('cemail');
	var password   = document.getElementById('password');
	var rcemail    = document.getElementById('rcemail');
	var rpassword  = document.getElementById('rpassword');
	var rcpassword = document.getElementById('rcpassword');
	var btnLogin   = document.getElementById('btnLogin');
	var btnSignUp  = document.getElementById('btnSignUp');
	var btnLogout  = document.getElementById('btnLogout');
	var youForgot  = document.getElementById('sendEmail');

	// reestablecimiento de contraseña
	youForgot.addEventListener('click', function (e) {
		var auth = firebase.auth();
		var emailAddress = $('#frcemail').val();
		console.log(emailAddress);

		auth.sendPasswordResetEmail(emailAddress).then(function () {
			swal({
				type: 'success',
				title: 'E-Mail enviado',
				html: $('<div>').addClass('some-class').text('E-Mail de reestablecimiento de contrase\xF1a enviado a ' + emailAddress),
				showConfirmButton: true,
				confirmButtonText: 'OK',
				confirmButtonColor: '#FF4200'
			});
			console.log('enviado reestablecimiento');
		}).catch(function (error) {
			console.log(error);
			if (error.code == 'auth/internal-error') {
				Materialize.toast('Exedido limite de E-mails.', 3000, 'red');
			} else if (error.code == 'auth/user-not-found') {
				Materialize.toast('E-Mail no Registrado.', 3000, 'red');
			} else if (error.code == 'auth/invalid-email') {
				Materialize.toast('E-Mail Inv\xE1lido.', 3000, 'red');
			}
		});
	});

	// add login event
	btnLogin.addEventListener('click', function (e) {
		//get email and pass
		var email = cemail.value;
		var pass = password.value;
		var auth = firebase.auth();
		// sign in
		var promise = auth.signInWithEmailAndPassword(email, pass);
		promise.then(function (t) {
			console.log(t);
			if (t.emailVerified) {
				location.href = "#!/home";
				typeLoginParam.setString(3); //Login Email
				localStorage.setItem("typeLoginParam", 3);
			} else {
				Materialize.toast('Confirme su E-Mail.', 3000, 'red');
			}
		});
		promise.catch(function (e) {
			console.log(e.message);
			if (e.message == 'The password is invalid or the user does not have a password.') {
				Materialize.toast('Contrase\xF1a Incorrecta.', 3000, 'red');
			} else {
				Materialize.toast('E-Mail no Registrado.', 3000, 'red');
			}
		});
	});

	//add sign up event
	btnSignUp.addEventListener('click', function (e) {
		//get email and pass
		// TODO: chequear email validar
		var email = rcemail.value;
		var rpass = rpassword.value;
		var pass = rcpassword.value;
		var auth = firebase.auth();

		if (rpass == pass) {

			// sign in
			var promise = auth.createUserWithEmailAndPassword(email, pass);
			promise.catch(function (e) {
				console.log(e.message);
				if (e.message == 'The email address is already in use by another account.') {
					Materialize.toast('E-Mail ya Existe.', 3000, 'red');
				} else if (e.message == 'The password must be 6 characters long or more.') {
					swal({
						type: 'warning',
						title: '¡Alerta!',
						html: $('<div>').addClass('some-class').text('La contraseña debe tener 6 caracteres de largo o más.'),
						allowOutsideClick: false,
						confirmButtonText: 'OK',
						confirmButtonColor: '#FF4200'
						//html: 'Submitted text: ' + text
					});
				} else {
					Materialize.toast('E-Mail Inv\xE1lido.', 3000, 'red');
				}
			});
		} else {
			Materialize.toast('No coinciden contrase\xF1as.', 3000, 'red');
		}
	});

	//logout
	/* btnLogout.addEventListener('click', e => {
 	firebase.auth().signOut();
 }); */

	firebase.auth().onAuthStateChanged(function (firebaseUser) {

		if (firebaseUser) {
			//btnLogout.classList.remove('hide');

			if (!firebaseUser.emailVerified && firebaseUser.providerData[0].providerId == 'password') {
				firebase.auth().languageCode = 'es';
				var user = firebase.auth().currentUser;
				/* var actionCodeSettings = {
					url: 'http://localhost/influenceme/#!/home',
					iOS: {
						bundleId: 'com.example.ios'
					},
					android: {
						packageName: 'com.example.android',
						installApp: true,
						minimumVersion: '12'
					},
					handleCodeInApp: true
				}; */
				user.sendEmailVerification().then(function () {
					console.log('email enviado');
					Materialize.toast('E-Mail de verificacion enviado.', 2500, 'green');
				}).catch(function (error) {
					console.log(error);
				});
			}
		} else {
			console.log("not login");
		}
	});
});

app.controller('HomeController', function ($sce, $scope, ApiFactory, paramAthlete, paramPlan, paramSearch, typeLoginParam, goPlans) {
	console.log('home');
	angular.element('body').css({ background: '#4d4d4d' });

	$('#backLogout').on('click',function() {
		firebase.auth().signOut();
	});

	$scope.varPlans = goPlans.getString;
	//console.log("goPlans => ", $scope.varPlans());
	if ($scope.varPlans() == 1){
		var initial = 1;
	} else {
		var initial = 0;
	}
	$(function () {
		if (initial == 1) {
			$('#influencers').removeClass('active-tab');
			$('#planes').addClass('active-tab');
		}
	});
	$scope.slickConfig = {
		enabled       : true,
		autoplay      : false,
		initialSlide  : initial,
		slidesToShow  : 1,
		slidesToScroll: 1,
		arrows        : false,
		infinite      : false,
		swipeToSlide  : true,
		draggable     : false,
		touchThreshold: 5,
		adaptiveHeight: true
	};

	$(document).ready(function () {
		$('#modal22').modal({
			dismissible: true
		});
	});
	// //plugins analitycs and notifications
	// var push = PushNotification.init({
	// 	"android": {
	// 		"senderID": "460396177087"
	// 	},
	// 	"browser": {},
	// 	"ios": {
	// 		"sound": true,
	// 		"vibration": true,
	// 		"badge": true
	// 	},
	// 	"windows": {}
	// });
	// push.on('registration', function (data) {
	// 	console.log(data);
	// });
	// push.on('notification', function (data) {
	// 	// data.message,
	// 	// data.title,
	// 	// data.count,
	// 	// data.sound,
	// 	// data.image,
	// 	// data.additionalData
	// });
	// cordova.plugins.firebase.analytics.logEvent("my_event", {param1: "value1"});
	// plugins analitycs

	// reset FORM
	/* $scope.reset = function() {
		$scope.formParams = {};
		$scope.stage = "";
	} */

	$(document).ready(function () {
		Materialize.updateTextFields();
		$('select').material_select();
	});

	$('.termAccept').on('click', function () {
		$('#termCheck').prop('checked', true);
	});

	var typeLoginParam = typeLoginParam.getString;
	var userFire = firebase.auth().currentUser;

	ApiFactory.getCustomerState(userFire.uid).then(function (state) {

		if (state.data.error.value === 0) { //user no exists

			$scope.changeHeight = function (val) {
				if (val == 1) { //cm
					$('.pp').hide();
					$('.cm').show();
				} else if (val == 2) { //pul
					$('.cm').hide();
					$('.pp').show();
				}
			}
			/* $scope.arrSelect = [];
			for (var index = 40; index <= 250; index++) {
				var element = [index];
				$scope.arrSelect.push(element);
			} */
			$('.modal-form').modal({
				dismissible: false,
				opacity    : .5,
				inDuration : 700,
				outDuration: 400,
				startingTop: '1%',
				endingTop  : '2.5%'
			});

		}

		var typeSession = localStorage.getItem("typeLoginParam");

		document.addEventListener("deviceready", onDeviceReady, false);
		function onDeviceReady() {

			var mac_adress = device.uuid + ' - ' + device.serial;

			if (userFire.providerData[0].providerId == 'facebook.com' && typeLoginParam() == 2 || userFire.providerData[0].providerId == 'facebook.com' && typeSession == 2) {

				firebase.auth().onAuthStateChanged(function (user) {

					var verifiedFB = user.displayName;

					if (verifiedFB.indexOf("verified") > -1) {
						$('#sectionNew').hide();
						$('#sectionOld').show();
					} else {
						$('#sectionNew').show();
						$('#sectionOld').hide();
					}

					if (state.data.error.value === 0) { // usuario no existe

						$(function () {
							$('#sectionNew').show();
							$('#sectionOld').hide();
							$("#phone").focus();
							$("#countries").msDropdown();
							$("#operator").msDropdown();
							$("#operator2").msDropdown();
							$("#operator3").msDropdown();
							$("#operator4").msDropdown();
							$('#co').hide();
							$('#ve').hide();
							$('#in').hide();
							$('#do').show();
						});
						$('#countries').change(function () {
							console.log($(this).val());
							if ($(this).val() == '+58') {
								$('#ve').show();
								$('#co').hide();
								$('#do').hide();
								$('#in').hide();
							} else if ($(this).val() == '+57') {
								$('#co').show();
								$('#ve').hide();
								$('#do').hide();
								$('#in').hide();
							} else if ($(this).val() == '+1') {
								$('#do').show();
								$('#co').hide();
								$('#ve').hide();
								$('#in').hide();
							}
							else if ($(this).val() == '+91') {
								$('#do').hide();
								$('#co').hide();
								$('#ve').hide();
								$('#in').show();
							}
						});
						$('#frm-phone').submit(function (e) {
							e.preventDefault();
							if ($('input[id="termCheck"]').is(':checked')) {
								// check checkbox
								//1->  ENVIO SMS
								//2->  VALIDO EL CODIGO
								var proceso = $(this).data('proceso');
								if (proceso == 1) {
									$scope.enviarSMS(1);
								} else if (proceso == 2) {
									$scope.enviarSMS(2);
								}
							} else {
								Materialize.toast('<div><p style="font-size: 3.5vw;">Debes leer y aceptar los términos y condiciones.</p></div>', 2500, 'red');
							}
						});

						$scope.enviarSMS = function (param) {
							var flag = $('#countries').val();
							var phone = $('#phone').val();
							if (flag == '+57') {
								var operator = $('#operator').val();
							} else if (flag == '+1') {
								var operator = $('#operator2').val();
							} else if (flag == '+58') {
								var operator = $('#operator3').val();
							}else if (flag == '+91') {
								var operator = $('#operator4').val();
							}
							//validate phone
							var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
							if (!phone.match(phoneno)) {
								Materialize.toast('Tel\xE9fono Inv\xE1lido.', 3000, 'red');
								return false;
							}
							var phoneComplete = flag + phone;
							$('#showNumber').html(phoneComplete);
							$('#txtInfo').html('Ingresa el Código');

							window.FirebasePlugin.verifyPhoneNumber(phoneComplete, 120, function (credential) {
								// SMS sent
								if (param === 1) {
									Materialize.Toast.removeAll();
									Materialize.toast('SMS enviado.', 3000, 'green');
									$('#btn_change').fadeIn();
									$('#frm-phone').data('proceso', 2);
									$('#div-code').fadeIn();
									$('#formInit').fadeOut();
									$('#btn_phone').html('Validar');
								} else if (param === 2) {
									/* var code = $('#code').val(); */
									var code = $('#input1').val() + $('#input2').val() + $('#input3').val() + $('#input4').val() + $('#input5').val() + $('#input6').val();
									var verificationId = credential.verificationId;
									var signInCredential = firebase.auth.PhoneAuthProvider.credential(verificationId, code);

									firebase.auth().currentUser.linkWithCredential(signInCredential).then(function (res) {

										//modal3//
										$('#modal3').modal('open');
										$scope.formParamsFB = {};
										$scope.stage = "";
										$scope.formValidation = false;
										$scope.toggleJSONView = false;
										$scope.toggleFormErrorsView = false;
										$scope.next = function (stage) {

											switch (stage) {
												case 'stage1':
													$("#generFB").addClass("active");
													if ($scope.multiStepForm3.generFB.$viewValue == undefined) {
														Materialize.toast('Selecciona tu G\xE9nero.', 2000, 'orange');
													}
													if ($scope.multiStepForm3.weightFB != undefined) {
														if ($scope.multiStepForm3.weightFB.$valid == false) {
															Materialize.toast('Ingresa tu peso.', 1000, 'orange');
														}
													}
													if ($scope.multiStepForm3.heightFB != undefined) {
														if ($scope.multiStepForm3.heightFB.$valid == false) {
															Materialize.toast('Ingresa tu altura.', 1000, 'orange');
														}
													}
													break;
											}

											if (JSON.stringify($scope.formParamsFB) == '{}') {
												$scope.formParamsFB = {
													cmheightFB: 150,
													generFB   : 1,
													idheightFB: 2,
													idweightFB: 1,
													piheightFB: 5,
													puheightFB: 6,
													weightFB  : 50
												}
											}

											$scope.formValidation = true;
											if ($scope.multiStepForm3.$valid) {
												$scope.direction = 1;
												$scope.stage = stage;
												$scope.formValidation = false;
											}
										};

										$scope.back = function (stage) {
											switch (stage) {
												case '':
													$("#generFB").removeClass("active");
													break;
												case 'stage1':
													$("#finishFB").removeClass("active");
													break;
											}
											$scope.direction = 0;
											$scope.stage = stage;
										};

										$scope.submitForm = function () {

											if ($scope.multiStepForm3.$valid) {
												$scope.formValidation = false;
												console.log("FORM => ",$scope.formParamsFB);
												if (JSON.stringify($scope.formParamsFB) == '{}') {
													$scope.formParamsFB = {
														cmheightFB: 150,
														generFB   : 1,
														idheightFB: 2,
														idweightFB: 1,
														piheightFB: 5,
														puheightFB: 6,
														weightFB  : 50
													}
												}
												//API

												if ($scope.formParamsFB.idheightFB == 1) { //cm
													var height = String($scope.formParamsFB.cmheightFB);
												} else if ($scope.formParamsFB.idheightFB == 2) { // pies pul
													var height =  String($scope.formParamsFB.piheightFB + "." +  $scope.formParamsFB.puheightFB);
												}
												console.log(height);

												var objUser = {
													id                : user.uid,
													Action            : 1, // 1 insert y 2 update
													Phone             : phoneComplete.replace(/[^a-zA-Z 0-9.]+/g, ''),
													First_name        : user.displayName,
													Last_name         : user.displayName,
													EMail             : user.email,
													User              : user.email,
													type              : 2, // 1 SMS | 2 FB | 3 GMAIL | 4 CORREO
													CreationTime      : moment(user.metadata.creationTime).format('YYYY-MM-DD'),
													LastSignInTime    : moment(user.metadata.lastSignInTime).format('YYYY-MM-DD'),
													Token             : user.uid, //data
													Birthday          : "1985-01-01",
													Password          : "",
													Gty_Id            : $scope.formParamsFB.generFB, //1 masculino 2 femenino
													UrlAvatar         : 6, // img por FB
													Set_Id            : 2, //tipo de inicio de session : 1 SMS 2 Facebook 3 Gmail 4 Email,
													Weight            : parseInt($scope.formParamsFB.weightFB),
													Height            : height,
													Uwt_Id            : parseInt($scope.formParamsFB.idweightFB),
													Height_Id         : parseInt($scope.formParamsFB.idheightFB),
													TermsAndConditions: 1,
													Idoperator        : operator,
													MAC_Address       : mac_adress,
													Url_Referrer      : "DATO QUEMADO URL"
												};
												console.log(user);
												console.log(objUser);

												//GET METHOD USER BACKEND
												ApiFactory.insertUser(objUser).then(function (data) {
													console.log("insert backend => ", data);
													if (data.data.error.value === 1) {
														//Materialize.toast('¡Usuario creado con exito!', 2000, 'green');
														$('#modal3').modal('close');
														swal({
															type: 'success',
															title: 'PERFIL CREADO CON ÉXITO',
															html: $('<div>').addClass('some-class').text('Ahora podrás disfrutar de InfluenceME. Para modificar los datos proporcionados dirígete a Perfil.'),
															allowOutsideClick: false,
															confirmButtonText: 'OK',
															confirmButtonColor: '#FF4200'
														});
														$('.swal2-confirm').click(function () {
															location.reload();
														});
													} else {
														if (data.data.error.message.indexOf("Duplicate") > -1){
															Materialize.toast('E-Mail o Teléfono Duplicado', 3000, 'red');
														}
														Materialize.toast('Error al crear usuario', 3000, 'red');
														location.href = "#!/login";
													}


												}).catch(function (error) {
													console.log(error);
												});

												userFire.updateProfile({ //isnewuser
													displayName: user.displayName + " verified"
												}).then(function () {
													console.log('new user');
												}).catch(function (error) {
													console.log(error);
												});
												//API
											}
										};
										// modal3//
									}, function (error) {
										console.log("aqui1 => ",error);
										if (error == 'Error: The SMS verification code used to create the phone auth credential is invalid. Please resend the verification code sms and be sure use the verification code provided by the user.'){
											swal({
												title             : 'Código Inválido',
												text              : "El código que ingresaste no es válido, asegúrate que estás ingresando el código proporcionado correctamente. Si aún no logras acceder vuelve a enviar el SMS del código de verificación.",
												type              : 'error',
												showCancelButton  : false,
												confirmButtonText : 'Ok',
												confirmButtonColor: '#FF4200'
											});
										} else if (error == 'Error: The SMS code has expired.Please re-send the verification code to try again.') {
											swal({
												title: 'Código Inválido',
												text: "El código de SMS ha caducado.Vuelve a enviar el código de verificación para volver a intentarlo.",
												type: 'error',
												showCancelButton: false,
												confirmButtonText: 'Ok',
												confirmButtonColor: '#FF4200'
											});
										} else if (error == 'Error: This credential is already associated with a different user account.') {
											swal({
												title: 'Error',
												text: "Esta credencial ya está asociada a una cuenta de usuario diferente.",
												type: 'error',
												showCancelButton: false,
												confirmButtonText: 'Ok',
												confirmButtonColor: '#FF4200'
											});
										} else if (error == 'Error: User can only be linked to one identity for the given provider.') {
											swal({
												title: 'Error',
												text: "El usuario solo puede vincularse a una identidad para el proveedor determinado",
												type: 'error',
												showCancelButton: false,
												confirmButtonText: 'Ok',
												confirmButtonColor: '#FF4200'
											});
										}
										if (error.code == 'auth/invalid-verification-code') {
											Materialize.toast('C\xF3digo Inv\xE1lido.', 3000, 'red');
										} else if (error.code == 'auth/code-expired') {
											Materialize.toast('C\xF3digo SMS Expirado.', 3000, 'red');
										}
									});
								} else if (param === 3) {
									Materialize.Toast.removeAll();
									Materialize.toast('SMS Re-enviado.', 3000, 'green');
									$('#newCode').fadeIn();
								}
							}, function (error) {
								console.log("aqui2 => ", error);
							});
						};

						$scope.reiniciar = function () {
							$('#txtInfo').html('Ingresa con tu Número Móvil');
							$('#formInit').fadeIn();
							$('#btn_change').fadeOut();
							$('#frm-phone').data('proceso', 1);
							$('#div-code').fadeOut();
							$('#btn_phone').html('ENVIAR SMS');
						};
					} // fin if user no existe

				});
			} else if (userFire.providerData[0].providerId == 'phone' && typeLoginParam().type == 1 || userFire.providerData[0].providerId == 'phone' && typeSession == 1) {

				firebase.auth().onAuthStateChanged(function (user) {

					if (state.data.error.value === 0) {// usuario no existe

						if (user) {

							//modal2//
							$('#modal2').modal('open');
							$scope.formParamsPhone = {};
							$scope.stage = "";
							$scope.formValidation = false;
							$scope.toggleJSONView = false;
							$scope.toggleFormErrorsView = false;
							$scope.next = function (stage) {

								switch (stage) {
									case 'stage1':
										$("#generPhone").addClass("active");
										if ($scope.multiStepForm2.generPhone.$viewValue == undefined) {
											Materialize.toast('Selecciona tu G\xE9nero.', 2000, 'orange');
										}
										if ($scope.multiStepForm2.weightPhone != undefined) {
											if ($scope.multiStepForm2.weightPhone.$valid == false) {
												Materialize.toast('Ingresa tu peso.', 1000, 'orange');
											}
										}
										if ($scope.multiStepForm2.heightPhone != undefined) {
											if ($scope.multiStepForm2.heightPhone.$valid == false) {
												Materialize.toast('Ingresa tu altura.', 1000, 'orange');
											}
										}
										if ($scope.multiStepForm2.namePhone != undefined) {
											if ($scope.multiStepForm2.namePhone.$valid == false) {
												Materialize.toast('Ingresa tu Nombre.', 1000, 'orange');
											}
										}
										if ($scope.multiStepForm2.emailPhone != undefined) {
											if ($scope.multiStepForm2.emailPhone.$valid == false) {
												Materialize.toast('Ingresa un E-Mail Válido.', 1000, 'orange');
											}
										}
										break;
									case 'stage2':
										$("#finishPhone").addClass("active");
										break;
								}

								if (JSON.stringify($scope.formParamsPhone) == '{}') {
									$scope.formParamsPhone = {
										cmheightPhone: 150,
										emailPhone   : 'email@email.com',
										generPhone   : 1,
										idheightPhone: 2,
										idweightPhone: 1,
										namePhone    : 'nombre',
										piheightPhone: 5,
										puheightPhone: 6,
										weightPhone  : 50
									}
								}

								$scope.formValidation = true;
								if ($scope.multiStepForm2.$valid) {
									$scope.direction = 1;
									$scope.stage = stage;
									$scope.formValidation = false;
								}
							};

							$scope.back = function (stage) {
								switch (stage) {
									case '':
										$("#generPhone").removeClass("active");
										break;
									case 'stage1':
										$("#finishPhone").removeClass("active");
										break;
								}
								$scope.direction = 0;
								$scope.stage = stage;
							};

							$scope.submitForm = function () {

								if ($scope.multiStepForm2.$valid) {
									$scope.formValidation = false;
									console.log("FORM => ",$scope.formParamsPhone);
									if (JSON.stringify($scope.formParamsPhone) == '{}') {
										$scope.formParamsPhone = {
											cmheightPhone: 150,
											emailPhone   : 'email@email.com',
											generPhone   : 1,
											idheightPhone: 2,
											idweightPhone: 1,
											namePhone    : 'nombre',
											piheightPhone: 5,
											puheightPhone: 6,
											weightPhone  : 50
										}
									}
									//API

									if ($scope.formParamsPhone.idheightPhone == 1) { //cm
										var height = String($scope.formParamsPhone.cmheightPhone);
									} else if ($scope.formParamsPhone.idheightPhone == 2) { // pies pul
										var height = String($scope.formParamsPhone.piheightPhone + "." + $scope.formParamsPhone.puheightPhone);
									}
									console.log(height);

									var objUser = {
										id                : user.uid,
										Action            : 1, // 1 insert y 2 update
										Phone             : typeLoginParam().phone.replace(/[^a-zA-Z 0-9.]+/g, ''),
										First_name        : $scope.formParamsPhone.namePhone,
										Last_name         : $scope.formParamsPhone.namePhone,
										EMail             : $scope.formParamsPhone.emailPhone,
										User              : $scope.formParamsPhone.emailPhone,
										type              : 1, // 1 SMS | 2 email | 3 FB | 4 GMAIL
										CreationTime      : moment(user.metadata.creationTime).format('YYYY-MM-DD'),
										LastSignInTime    : moment(user.metadata.lastSignInTime).format('YYYY-MM-DD'),
										Token             : user.uid, //data
										Birthday          : "1985-01-01",
										Password          : "",
										Gty_Id            : $scope.formParamsPhone.generPhone, //1 masculino 2 femenino
										UrlAvatar         : 6,
										Set_Id            : 1, //tipo de inicio de session: 1 SMS 2 Facebook 3 Gmail 4 Email,
										Weight            : parseInt($scope.formParamsPhone.weightPhone),
										Height            : height,
										Uwt_Id            : parseInt($scope.formParamsPhone.idweightPhone),
										Height_Id         : parseInt($scope.formParamsPhone.idheightPhone),
										TermsAndConditions: 1,
										Idoperator        : typeLoginParam().operator,
										MAC_Address       : mac_adress,
										Url_Referrer      : "DATO QUEMADO URL"
									};
									console.log(objUser);

									userFire.updateEmail($scope.formParamsPhone.emailPhone).then(function () {
										console.log('user sms email update');
									}).catch(function (error) {
										console.log('error update email sms');
									});

									userFire.updateProfile({ //isnewuser
										displayName: $scope.formParamsPhone.namePhone
									}).then(function () {
										console.log('new user update name');
									}).catch(function (error) {
										console.log(error);
									});

									//GET METHOD USER BACKEND
									ApiFactory.insertUser(objUser).then(function (data) {
										console.log("INSERT API => ",data);
										if (data.data.error.value === 1) {
											$('#modal2').modal('close');
											swal({
												type: 'success',
												title: 'PERFIL CREADO CON ÉXITO',
												html: $('<div>').addClass('some-class').text('Ahora podrás disfrutar de InfluenceME. Para modificar los datos proporcionados dirígete a Perfil.'),
												allowOutsideClick: false,
												confirmButtonText: 'OK',
												confirmButtonColor: '#FF4200'
											});
										} else {
											if (data.data.error.message.indexOf("Duplicate") > -1) {
												Materialize.toast('E-Mail o Teléfono Duplicado', 3000, 'red');
											}
											Materialize.toast('Error al crear usuario', 3000, 'red');
											location.href = "#!/login";
										}


									}).catch(function (error) {
										console.log(error);
									});

									//API
								}
							};
							// modal2//
						} // fin if user

					} // fin if user no existe
				});
			} else if (userFire.providerData[0].providerId == 'password' && typeLoginParam() == 3 || userFire.providerData[0].providerId == 'password' && typeSession == 3) {

				firebase.auth().onAuthStateChanged(function (user) {

					//alert(JSON.stringify(user));


					if (user.displayName != null) {
						$('#sectionNew').hide();
						$('#sectionOld').show();
					} else {
						$('#sectionNew').show();
						$('#sectionOld').hide();
					}

					if (state.data.error.value === 0) {
						//usuario no existe

						$(function () {
							$('#sectionNew').show();
							$('#sectionOld').hide();
							$("#phone").focus();
							$("#countries").msDropdown();
							$("#operator").msDropdown();
							$("#operator2").msDropdown();
							$("#operator3").msDropdown();
							$("#operator4").msDropdown();
							$('#co').hide();
							$('#ve').hide();
							$('#do').show();
							$('#in').hide();
						});
						$('#countries').change(function () {
							console.log($(this).val());
							if ($(this).val() == '+58') {
								$('#ve').show();
								$('#co').hide();
								$('#do').hide();
								$('#in').hide();
							} else if ($(this).val() == '+57') {
								$('#co').show();
								$('#ve').hide();
								$('#do').hide();
								$('#in').hide();
							} else if ($(this).val() == '+1') {
								$('#do').show();
								$('#co').hide();
								$('#ve').hide();
								$('#in').hide();
							}else if ($(this).val() == '+91') {
								$('#do').hide();
								$('#co').hide();
								$('#ve').hide();
								$('#in').show();
							}
						});
						$('#frm-phone').submit(function (e) {
							e.preventDefault();
							if ($('input[id="termCheck"]').is(':checked')) {
								// check checkbox
								//1->  ENVIO SMS
								//2->  VALIDO EL CODIGO
								var proceso = $(this).data('proceso');
								if (proceso == 1) {
									$scope.enviarSMS(1);
								} else if (proceso == 2) {
									$scope.enviarSMS(2);
								}
							} else {
								Materialize.toast('<div><p style="font-size: 3.5vw;">Debes leer y aceptar los términos y condiciones.</p></div>', 2500, 'red');
							}
						});

						$scope.enviarSMS = function (param) {
							var flag = $('#countries').val();
							var phone = $('#phone').val();
							if (flag == '+57') {
								var operator = $('#operator').val();
							} else if (flag == '+1') {
								var operator = $('#operator2').val();
							} else if (flag == '+58') {
								var operator = $('#operator3').val();
							}else if (flag == '+91') {
								var operator = $('#operator4').val();
							}

							var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
							if (!phone.match(phoneno)) {
								Materialize.toast('Tel\xE9fono Inv\xE1lido.', 3000, 'red');
								return false;
							}
							var phoneComplete = flag + phone;
							$('#showNumber').html(phoneComplete);
							$('#txtInfo').html('Ingresa el Código');

							window.FirebasePlugin.verifyPhoneNumber(phoneComplete, 120, function (credential) {
								// SMS sent
								if (param === 1) {
									Materialize.Toast.removeAll();
									Materialize.toast('SMS enviado.', 3000, 'green');
									$('#btn_change').fadeIn();
									$('#frm-phone').data('proceso', 2);
									$('#div-code').fadeIn();
									$('#formInit').fadeOut();
									$('#btn_phone').html('Validar');
								} else if (param === 2) {
									/* var code = $('#code').val(); */
									var code = $('#input1').val() + $('#input2').val() + $('#input3').val() + $('#input4').val() + $('#input5').val() + $('#input6').val();
									var verificationId = credential.verificationId;
									var signInCredential = firebase.auth.PhoneAuthProvider.credential(verificationId, code);

									firebase.auth().currentUser.linkWithCredential(signInCredential).then(function (res) {

										if (user.displayName == null && user.emailVerified) {

											//modal1//
											$('#modal1').modal('open');
											$scope.formParamsEmail = {};
											$scope.stage = "";
											$scope.formValidation = false;
											$scope.toggleJSONView = false;
											$scope.toggleFormErrorsView = false;
											$scope.next = function (stage) {

												switch (stage) {
													case 'stage1':
														console.log($scope.multiStepForm1)
														$("#generEmail").addClass("active");
														if ($scope.multiStepForm1.generEmail.$viewValue == undefined) {
															Materialize.toast('Selecciona tu G\xE9nero.', 1000, 'orange');
														}
														if ($scope.multiStepForm1.weightEmail != undefined) {
															if ($scope.multiStepForm1.weightEmail.$valid == false) {
																Materialize.toast('Ingresa tu peso.', 1000, 'orange');
															}
														}
														if ($scope.multiStepForm1.heightEmail != undefined) {
															if ($scope.multiStepForm1.heightEmail.$valid == false) {
																Materialize.toast('Ingresa tu altura.', 1000, 'orange');
															}
														}
														if ($scope.multiStepForm1.nameEmail != undefined) {
															if ($scope.multiStepForm1.nameEmail.$valid == false) {
																Materialize.toast('Ingresa un Nombre.', 1000, 'orange');
															}
														}
														break;
													case 'stage2':
														$("#finishEmail").addClass("active");
														break;
												}

												if (JSON.stringify($scope.formParamsEmail) == '{}') {
													$scope.formParamsEmail = {
														cmheightEmail: 150,
														generEmail   : 1,
														idheightEmail: 2,
														idweightEmail: 1,
														nameEmail    : 'nombre',
														piheightEmail: 5,
														puheightEmail: 6,
														weightEmail  : 50
													}
												}

												$scope.formValidation = true;
												if ($scope.multiStepForm1.$valid) {
													$scope.direction = 1;
													$scope.stage = stage;
													$scope.formValidation = false;
												}
											};

											$scope.back = function (stage) {
												switch (stage) {
													case '':
														$("#generEmail").removeClass("active");
														break;
													case 'stage1':
														$("#finishEmail").removeClass("active");
														break;
												}
												$scope.direction = 0;
												$scope.stage = stage;
											};

											$scope.submitForm = function () {

												if ($scope.multiStepForm1.$valid) {
													$scope.formValidation = false;
													console.log("FORM => ",$scope.formParamsEmail);
													if (JSON.stringify($scope.formParamsEmail) == '{}') {
														$scope.formParamsEmail = {
															cmheightEmail: 150,
															generEmail   : 1,
															idheightEmail: 2,
															idweightEmail: 1,
															nameEmail    : 'nombre',
															piheightEmail: 5,
															puheightEmail: 6,
															weightEmail  : 50
														}
													}
													//API

													if ($scope.formParamsEmail.idheightEmail == 1) { //cm
														var height = String($scope.formParamsEmail.cmheightEmail);
													} else if ($scope.formParamsEmail.idheightEmail == 2) { // pies pul
														var height = String($scope.formParamsEmail.piheightEmail + "." + $scope.formParamsEmail.puheightEmail);
													}
													console.log(height);


													var objUser = {
														id                : user.uid,
														Action            : 1, // 1 insert y 2 update
														Phone             : phoneComplete.replace(/[^a-zA-Z 0-9.]+/g, ''),
														First_name        : $scope.formParamsEmail.nameEmail,
														Last_name         : $scope.formParamsEmail.nameEmail,
														EMail             : user.email,
														User              : user.email,
														type              : 4, // 1 SMS | 2 FB | 3 GMAIL | 4 CORREO
														CreationTime      : moment(user.metadata.creationTime).format('YYYY-MM-DD'),
														LastSignInTime    : moment(user.metadata.lastSignInTime).format('YYYY-MM-DD'),
														Token             : user.uid, //data
														Birthday          : "1985-01-01",
														Password          : "",
														Gty_Id            : $scope.formParamsEmail.generEmail, //1 masculino 2 femenino
														UrlAvatar         : 6,
														Set_Id            : 4, //tipo de inicio de session: 1 SMS 2 Facebook 3 Gmail 4 Email,
														Weight            : parseInt($scope.formParamsEmail.weightEmail),
														Height            : height,
														Uwt_Id            : parseInt($scope.formParamsEmail.idweightEmail),
														Height_Id         : parseInt($scope.formParamsEmail.idheightEmail),
														TermsAndConditions: 1,
														Idoperator        : operator,
														MAC_Address       : mac_adress,
														Url_Referrer      : "DATO QUEMADO URL"
													};
													console.log(objUser);

													userFire.updateProfile({ //isnewuser
														displayName: $scope.formParamsEmail.nameEmail
													}).then(function () {
														console.log('USER DISPLAY NAME');
													}).catch(function (error) {
														console.log(error);
													});
													//GET METHOD USER BACKEND
													ApiFactory.insertUser(objUser).then(function (data) {
														console.log('insert API', data);
														if (data.data.error.value === 1) {
															//Materialize.toast('¡Usuario creado con exito!', 2000, 'green');
															$('#modal1').modal('close');
															swal({
																type: 'success',
																title: 'PERFIL CREADO CON ÉXITO',
																html: $('<div>').addClass('some-class').text('Ahora podrás disfrutar de InfluenceME. Para modificar los datos proporcionados dirígete a Perfil.'),
																allowOutsideClick: false,
																confirmButtonText: 'OK',
																confirmButtonColor: '#FF4200'
															});
															$('.swal2-confirm').click(function () {
																location.reload();
															});
														} else {
															if (data.data.error.message.indexOf("Duplicate") > -1) {
																Materialize.toast('E-Mail o Teléfono Duplicado', 3000, 'red');
															}
															Materialize.toast('Error al crear usuario', 3000, 'red');
															location.href = "#!/login";
														}
													}).catch(function (error) {
														console.log(error);
													});

													//API



												}
											};
											// modal1//
										}
									}, function (error) {
										console.log("aqui1 => ",error);
										if (error == 'Error: The SMS verification code used to create the phone auth credential is invalid. Please resend the verification code sms and be sure use the verification code provided by the user.') {
											swal({
												title: 'Código Inválido',
												text: "El código que ingresaste no es válido, asegúrate que estás ingresando el código proporcionado correctamente. Si aún no logras acceder vuelve a enviar el SMS del código de verificación.",
												type: 'error',
												showCancelButton: false,
												confirmButtonText: 'Ok',
												confirmButtonColor: '#FF4200'
											});
										} else if (error == 'Error: The SMS code has expired.Please re-send the verification code to try again.') {
											swal({
												title: 'Código Inválido',
												text: "El código de SMS ha caducado.Vuelve a enviar el código de verificación para volver a intentarlo.",
												type: 'error',
												showCancelButton: false,
												confirmButtonText: 'Ok',
												confirmButtonColor: '#FF4200'
											});
										} else if (error == 'Error: This credential is already associated with a different user account.') {
											swal({
												title: 'Error',
												text: "Esta credencial ya está asociada a una cuenta de usuario diferente.",
												type: 'error',
												showCancelButton: false,
												confirmButtonText: 'Ok',
												confirmButtonColor: '#FF4200'
											});
										} else if (error == 'Error: User can only be linked to one identity for the given provider.') {
											swal({
												title: 'Error',
												text: "El usuario solo puede vincularse a una identidad para el proveedor determinado",
												type: 'error',
												showCancelButton: false,
												confirmButtonText: 'Ok',
												confirmButtonColor: '#FF4200'
											});
										}
										if (error.code == 'auth/invalid-verification-code') {
											Materialize.toast('C\xF3digo Inv\xE1lido..', 3000, 'red');
										} else if (error.code == 'auth/code-expired') {
											Materialize.toast('C\xF3digo SMS Expirado..', 3000, 'red');
										}
									});
								} else if (param === 3) {
									Materialize.Toast.removeAll();
									Materialize.toast('SMS Re-enviado.', 3000, 'green');
									$('#newCode').fadeIn();
								}
							}, function (error) {
								console.log("aqui2 => ", error);
							});
						};

						$scope.reiniciar = function () {
							$('#txtInfo').html('Ingresa con tu Número Móvil');
							$('#formInit').fadeIn();
							$('#btn_change').fadeOut();
							$('#frm-phone').data('proceso', 1);
							$('#div-code').fadeOut();
							$('#btn_phone').html('ENVIAR SMS');
						};
					}
				});
			}
		}
	});

	$scope.prr = false;
	angular.element('body').css({ background: '#4d4d4d' });
	$scope.arrLists = [];
	ApiFactory.getAthletes().then(function (data) {
		if (data.status === 200 && data.data.error.value === 1) {
			var element = void 0;
			for (var i = 0; i <= data.data.list.length; i++) {
				element = data.data.list[i];
				if (element !== undefined) {
					element.url = imgSplash + element.url;
					element.urlList = imgSplash + element.listImg;
					$scope.arrLists.push(element);
				}
			}
			$scope.arrListsAthletes = $scope.arrLists;
			var start = 0;
			var ending = start + 5;
			var lastdata = $scope.arrListsAthletes.length + 1;
			var reachLast = false;
			$scope.loadmore = "Cargar Más";
			$scope.testData = [];
			$scope.listDataAthletes = function () {
				if (reachLast) {
					return false;
				}
				var jsondt = [];
				for (var i = start; i < ending; i++) {
					if ($scope.arrListsAthletes[i] !== undefined) jsondt.push($scope.arrListsAthletes[i]);
				};
				start = i;
				ending = i + 1;
				$scope.testData = $scope.testData.concat(jsondt);
				//console.log("ATLETAS ", $scope.testData);
				if (ending >= lastdata) {
					reachLast = true;
					$scope.loadmore = "Alcanzado el limite";
				}
			};
			$scope.listDataAthletes();
		}
	}).catch(function (err) {
		console.log(err);
		Materialize.toast('Error de conexión con la API', 4000, 'orange darken-4');
	});

	$scope.arrListsPlan = [];
	ApiFactory.getPlans().then(function (data) {
		if (data.status === 200 && data.data.error.value === 1) {

			var element = void 0;

			for (var i = 0; i <= data.data.list.length; i++) {
				element = data.data.list[i];
				if (element !== undefined) {
					element.url = imgSplash + element.url;
					$scope.arrListsPlan.push(element);
				}
			}
			$scope.listPlans = data.data.list;
			var start = 0;
			var ending = start + 15;
			var lastdata = $scope.listPlans.length + 1;
			var reachLast = false;
			$scope.loadmore = "Cargar Más";
			$scope.testDataPlans = [];
			$scope.listDataPlans = function () {
				if (reachLast) {
					return false;
				}
				var jsondtPlans = [];
				for (var i = start; i < ending; i++) {
					if ($scope.listPlans[i] !== undefined) jsondtPlans.push($scope.listPlans[i]);
				};
				start = i;
				ending = i + 1;
				$scope.testDataPlans = $scope.testDataPlans.concat(jsondtPlans);
				//console.log("PLANES ", $scope.testDataPlans);
				if (ending >= lastdata) {
					reachLast = true;
					$scope.loadmore = "Alcanzado el limite";
				}
			};
			$scope.listDataPlans();
		}
	}).catch(function (err) {
		console.log(err);
	});

	/* $scope.clearNg = function () {
		var myEl = angular.element(document.querySelector('#lolo'));
		myEl.addClass('fadeOut animated');

		$scope.arrAthleteSearcher = "";
		$scope.arrPlansSearcher   = "";
	}; */

	$scope.sendData = function (value) {
		$('#preloader-app').css('display', 'none');
		$('#status-app').css('display', 'none');
		ApiFactory.searcherAthlete(value).then(function (athlete) {
			$scope.arrAthleteSearcher = [];
			for (var index = 0; index < athlete.data.list.length; index++) {
				var element = athlete.data.list[index];
				element.url = imgSplash + element.url;
				$scope.arrAthleteSearcher.push(element);
			}
		});
		ApiFactory.searcherPlan(value).then(function (plan) {
			$scope.arrPlansSearcher = [];
			for (var index = 0; index < plan.data.list.length; index++) {
				var element = plan.data.list[index];
				element.url = imgSplash + element.url;
				$scope.arrPlansSearcher.push(element);
			}
		});
	};

	$('.clickSearcher').on('click',function(){
		$('#preloader-app').css('display', 'block');
		$('#status-app').css('display', 'block');
	});

	$scope.oneAthlete = function (id) {
		paramAthlete.setString(id);
	};
	$scope.onePlan = function (id) {
		paramPlan.setString(id);
	};

	ApiFactory.getFAQ().then(function (data) {
		if (data.status === 200 && data.data.error.value === 1) {
			$scope.FAQS = data.data.list;
			//console.log($scope.FAQS)
		}
	}).catch(function (err) {
		console.log(err);
	});

	/*Directiva scroll animate*/
	$scope.animation = {};
	$scope.animation.current = 'fadeIn';
	$scope.animation.previous = $scope.animation.current;
	$scope.animateElementIn = function ($el) {
		$el.removeClass('not-visible');
		$el.addClass('animated ' + $scope.animation.current);
	};

	$scope.animateElementOut = function ($el) {
		$el.addClass('not-visible');
		$el.removeClass('animated ' + $scope.animation.current);
	};
});

app.controller('ProgressController', function ($scope, ApiFactory, goPlans) {
	console.log('progress');
	angular.element('body').css({ background: '#4d4d4d' });

	var sort = ['BV4A9864.jpg', 'BV4A9759.jpg', 'BV4A8706.jpg', 'BV4A9448.jpg'];
	var ramdom = [0, 1, 2, 3];
	ramdom.sort(function () {
		return .5 - Math.random();
	});

	var imgBack = './dist/img/' + sort[ramdom[0]] + '';

	angular.element('body').css({
		//'background'     : 'linear-gradient(to bottom, rgba(255, 255, 255, 0) 0, #000 250%),url('+imgBack+') center',
		'background': 'url(\'' + imgBack + '\') no-repeat center',
		'background-attachment': 'fixed',
		'background-size': 'cover',
		'width': '100%'
	});

	$scope.goPlans = function(){
		goPlans.setString(1);
		location.href = "#!/home";
	}

});

app.controller('ProgressDetailController', function ($scope, ApiFactory, paramPlan) {
	console.log('progress Detail');
	angular.element('body').css({ background: '#4d4d4d' });
	$('#invitar').on('click', function () {
		Materialize.toast('Abriendo app de mensajería', 4000, 'orange darken-4');
	});

	/*Tiene que recibir ID del cliente por session despues de loguear*/
	var userID = firebase.auth().currentUser.uid;
	ApiFactory.getProgress(userID).then(function (data) {
		console.log("API Completa => ", data);
		if (data.data.list.length === 0) {
			location.href = "#!/progress";
		} else {
			if (data.status === 200) {
				$scope.progressDetail = data.data.list[0];
				var imgBack = imgSplash + $scope.progressDetail.backGround;
				angular.element('#bodyImg').css({
					'background': 'url(\'' + imgBack + '\') no-repeat center',
					'background-attachment': 'fixed',
					'background-size': 'cover',
					'width': '100%'
				});
				console.log("Progress Detail => ", $scope.progressDetail);
				console.log("IMG => ", imgBack);
				$scope.onePlan = function (id) {
					paramPlan.setString(id);
				};

			}
		}
	});
});

app.controller('PlansByAthleteController', function ($rootScope, $state, $compile, $scope, ApiFactory, paramAthlete, paramPlan, $window, $sce) {
	console.log('PlansByAthleteController');

	$(document).ready(function () {
		$('div.expander').expander({ slicePoint: 350 });
	});

	$('#seccionlink').click(function () {
		$.fn.fullpage.moveSectionDown();
	});
	$scope.mainOptions = {
		scrollOverflow                   : false,
		scrollingSpeed                   : 500,
		scrollOverflowReset              : false,
		scrollBar                        : true,
		scrollBar                        : false,
		autoScrolling                    : false,
		normalScrollElementTouchThreshold: 55,
		css3                             : true,
		normalScrollElements             : '.codegena_iframe',
		onLeave: function onLeave(index, nextIndex, direction) {
			/* if (nextIndex === 2) {
				$('#section0').css({
					'background-color': 'rgba(0, 0, 0, 0.53)',
					'-webkit-transition': 'background-color 1000ms linear',
					'-ms-transition': 'background-color 1000ms linear',
					'transition': 'background-color 1000ms linear',
				}, 500);
				$('#section1').css({
					'background-color': 'rgba(0, 0, 0, 0.53)',
					'-webkit-transition': 'background-color 1000ms linear',
					'-ms-transition': 'background-color 1000ms linear',
					'transition': 'background-color 1000ms linear',
				}, 500);

			} else {
				$('#section0').css({ backgroundColor: 'transparent' }, 1000);
				$('#section1').css({ backgroundColor: 'transparent' }, 1000);
			} */
		}
	};

	$scope.onePlan = function (id) {
		paramPlan.setString(id);
	};

	$scope.stringValue = paramAthlete.getString;
	ApiFactory.getAthlete($scope.stringValue()).then(function (data) {
		console.log(data);
		if (data.status === 200 && data.data.error.value === 1) {
			$scope.athlete = data.data.list[0];
			console.log("ATLETA => ", $scope.athlete);
			var imgBack = imgSplash + $scope.athlete.url;
			var urlVideo = '<div class="codegena_iframe">\n\t\t\t\t' + $scope.athlete.videoPresentation + '\n\t\t\t\t</div>';
			$scope.urlVideo = $sce.trustAsHtml(urlVideo);
			$scope.description = $scope.athlete.description;

			angular.element('body').css({
				background               : 'url(\'' + imgBack + '\') no-repeat fixed',
				'-webkit-background-size': '100%',
				'-moz-background-size'   : '100%',
				'-o-background-size'     : '100%',
				'background-size'        : '100%',
			});

			ApiFactory.getPlan($scope.athlete.id).then(function (query) {
				if (query.status === 200 && query.data.error.value === 1) {
					$scope.plan = [];
					for (var index = 0; index < query.data.list.length; index++) {
						var element = query.data.list[index];
						element.url = imgSplash + element.url;
						$scope.plan.push(element);
					}
					console.log("PLAN", $scope.plan);

					/*Tiene que recibir ID del cliente por session despues de loguear*/
					var userID = firebase.auth().currentUser.uid;
					console.log(userID);
					ApiFactory.getPlanState(userID).then(function (data) {
						console.log("primero => ", data);
						if (data.status === 200 && data.data.error === null) {
							if ($scope.plan[0].name != data.data.planName) {
								if ($scope.plan[0].name != data.data.planName) {
									Materialize.Toast.removeAll();
									Materialize.toast('<div class="row margin0 col m12">Atenci\xF3n ya est\xE1s en el plan <b>' + data.data.planName + '</b></div>', 2500, 'orange');
									$scope.state = {
										state: true,
										message: 'Atenci\xF3n ya est\xE1s en el plan ' + data.data.planName
									};
								}
							}
						} else {
							Materialize.Toast.removeAll();
							//Materialize.toast('\xA1No has empezado ning\xFAn plan!', 2500, 'green');
							$scope.state = {
								state: false
							};
						}
					}).catch(function (err) {
						console.log(err);
						Materialize.toast('Error de conexión con la API', 4000, 'orange darken-4');
					});
				}
			});
		} else {
			$window.location = "#!home";
		}
	}).catch(function (err) {
		console.log(err);
		Materialize.toast('Error de conexión con la API', 4000, 'orange darken-4');
	});
});

app.controller('RoutinesByPlanController', function ($scope, ApiFactory, paramPlan, paramRoutine, paramsStartRoutine, paramsCustomerPlan, $window, paramImgDay, $sce) {
	console.log('routine by plans');
	angular.element('body').css({ background: '#4d4d4d' });

	/* para cambiar entre secciones*/
	function goToByScroll(id) {
		id = id.replace("link", "");
		$('html,body').animate({
			scrollTop: $("#" + id).offset().top
		},
			'slow');
	}
	$("#sidebar > a").click(function (e) {
		e.preventDefault();
		goToByScroll($(this).attr("id"));
	});

	$(document).ready(function () {
		$('div.expander').expander({ slicePoint: 350 });
	});

	var userID = firebase.auth().currentUser.uid;
	console.log(userID);

	$('.modal').modal({
		dismissible: true,
		opacity    : .5,
		inDuration : 700,
		outDuration: 400,
		startingTop: '4%',
		endingTop  : '10%',
		ready: function ready(modal, trigger) {
			console.log('abre');
		},
		complete: function complete(event) {
			console.log('cierra');
		}
	});
	$('.termAccept').on('click', function () {
		$('#termCheck').prop('checked', true);
	});

	$scope.allSerie = function (id,index) {
		paramRoutine.setString({
			index: index,
			id   : id
		});
	};

	$scope.stringValue = paramPlan.getString;

	ApiFactory.getPlanByRoutine($scope.stringValue()).then(function (data) {
		if (data.status === 200 && data.data.error.value === 1) {
			$scope.plan = data.data.list[0];
			var urlVideo = '<div class="codegena_iframe">\n\t\t\t\t\t' + $scope.plan.videoPresentation + '\n\t\t\t\t</div>';
			$scope.urlVideo = $sce.trustAsHtml(urlVideo);
			console.log("PLAN", $scope.plan);

			/*Tiene que recibir ID del cliente por session despues de loguear*/
			ApiFactory.getCustomerState(userID).then(function (state) {
				// servicio que devuelve status de si es premium o no
				console.log("CLIENTE MAC URL ETC", state);
				if (state.status === 200 && state.data.error.value === 1) {


					ApiFactory.getTextCountry().then(function (textCountry) {
						var idOperator = state.data.list[0].idoperator;
						for (var i = 0; i < textCountry.data.list.length; i++) {
							textCountry.data.list[i]
							if (textCountry.data.list[i].id == idOperator) {
								$scope.operatorInfo = textCountry.data.list[i];
							}
						}
					}).catch(function (error) {
						console.log(error);
					});

				// VALIDATION PLAN
				ApiFactory.getPlanState(userID).then(function (planState) {
					console.log("DUDAAA", planState.data);

					if (planState.data.error === null) { // no posee plan
						if ($scope.plan.name != planState.data.planName) {
							swal({
							title            : '¿Desea cambiar de plan?',
							text             : "Al aceptar su plan actual pasa a estado inactivo, solo se puede realizar una vez al día.",
							type             : 'warning',
							showCancelButton : true,
							confirmButtonText: 'Si',
							cancelButtonText : 'No',
							confirmButtonColor: '#FF4200',
							cancelButtonColor: '#1a1a1a',
							}).then(function(isConfirm) {
								if (isConfirm) {
									var objChange = {
										"IdCustomer": userID,
										"IdPlan"    : $scope.plan.id
									};
									//inserta o cambia de plan
									ApiFactory.changePlan(objChange).then(function (changePlan) {
										console.log("CHANGE PLAN => ", changePlan.data);
										if(changePlan.data.error.value == -1){
											Materialize.Toast.removeAll();
											Materialize.toast('Un cambio ya ha sido hecho hoy', 2500, 'orange');
										}else{
											swal(
												'Listo!',
												'¡Cambio de plan exitoso!',
												'success'
											);
											$('.swal2-confirm').click(function () {
												$window.location = "#!home";
											});
											Materialize.Toast.removeAll(); //remove
										}
									});
								}
							})
							var obj = $scope.plan.id;
						} else if ($scope.plan.name == planState.data.planName) {
							var obj = {
								idPlan        : planState.data.idPlan,
								idCustomerPlan: planState.data.id
							};
						}
					}else{ // tiene plan
						if ($scope.plan.name != planState.data.planName){
							var obj = $scope.plan.id;
						}else if ($scope.plan.name == planState.data.planName) {
							var obj = {
								idPlan: planState.data.idPlan,
								idCustomerPlan: planState.data.id
							};
						}
					}

						console.log("READY obj get routinebyplan => ", obj);
						ApiFactory.getRoutinesByPlan(obj).then(function (query) {
							//id customer plan CAMBIO

							$scope.routine = query.data.list;
							var start = 0;
							var ending = start + 2;
							var lastdata = $scope.routine.length + 1;
							var reachLast = false;
							$scope.loadmore = "Cargar Más";
							$scope.testData = [];
							$scope.listDataRoutine = function () {
								if (reachLast) {
									return false;
								}
								var jsondt = [];
								for (var i = start; i < ending; i++) {
									var element = $scope.routine[i];
									element.urlImagen = imgSplash + element.urlImagen;
									if (i === 0) {
										element.sst_Id = 1;
										element.sty_Id = 1;
									} else {
										element.sst_Id = state.data.list[0].sst_Id;
										element.sty_Id = state.data.list[0].sty_Id;
									}
									jsondt.push(element);
								};
								start = i;
								ending = i + 1;

								$scope.testData = $scope.testData.concat(jsondt);

								if (ending >= lastdata) {
									reachLast = true;
									$scope.loadmore = "Alcanzado el limite";
								}
							};
							$scope.listDataRoutine();




							$scope.validationRoutine = function (id, sst_Id, sty_Id, urlImagen, name, index) {
								if (index > 0) {
									console.log('aqui1 >1 =>');

									var objRoutine = {
										idCustomer: planState.data.id, // id del plan
										idRoutine: id // id de la rutina
									};
									console.log("VALIDACION", objRoutine);

									var objRoutineDay = {
										idCus: userID, // id del cliente
										idCup: planState.data.id,
										idRoutine: id // id de la rutina
									};

									ApiFactory.getValidationRoutinesDay(objRoutineDay).then(function (validateRoutineDay) {
										ApiFactory.validationRoutine(objRoutine).then(function (validateRoutine) {
											console.log("validateRoutine => ", validateRoutine.data);
											console.log("VALIDACION rotuine day => ", validateRoutineDay);
											if (validateRoutineDay.data.id == 0) { // message solo puede realizar una rutina por dia
												if (validateRoutine.data.value === 0 && sst_Id === 2 && sty_Id === 1) { // abrir modal
													$('#modal1').modal('open');
												} else if (validateRoutine.data.value === 1 && sst_Id === 2 && sty_Id === 1) { // abrir modal
													$('#modal1').modal('open');
												} else if (validateRoutine.data.value === 0 && sst_Id === 2 && sty_Id === 2) { // abrir modal
													$('#modal1').modal('open');
												} else if (validateRoutine.data.value === 1 && sst_Id === 2 && sty_Id === 2) { // abrir modal
													$('#modal1').modal('open');
												} else if (validateRoutine.data.value === 0 && sst_Id === 3 && sty_Id === 2) { // abrir modal
													$('#modal1').modal('open');
												} else if (validateRoutine.data.value === 1 && sst_Id === 3 && sty_Id === 2) { // abrir modal
													$('#modal1').modal('open');
												} else if (validateRoutine.data.value === 0 && sst_Id === 3 && sty_Id === 1) { // abrir modal
													$('#modal1').modal('open');
												} else if (validateRoutine.data.value === 1 && sst_Id === 3 && sty_Id === 1) { // abrir modal
													$('#modal1').modal('open');
												}
												Materialize.Toast.removeAll();
												Materialize.toast('<div><p style="font-size: 3.5vw;">Solo se puede realizar una rutina por día.</p></div>', 2500, 'red');

											} else if (validateRoutineDay.data.id == 1) { // puede realizar rutina

												if (validateRoutine.data.value === 0 && sst_Id === 1 && sty_Id === 1) { // ver rutina // 0 ingresa rutina
													$scope.validateRoutine = true;

													var objStartRoutine = {
														"Cus_Id": userID, //id cliente recibir po session
														"Cup_Id": planState.data.id, //id validationPlan
														"Rou_Id": id //id routine
													};
													console.log("DATOS para iniciar rutina => ", objStartRoutine);
													paramsStartRoutine.setString(objStartRoutine);

													var objCustomerPlan = {
														"IdCustomer": userID, //id cliente recibir po session
														"idPlan": $scope.plan.id //id plan
													};
													console.log("DATOS CUSTOMER PLAN => ", objCustomerPlan);
													paramsCustomerPlan.setString(objCustomerPlan);

													paramImgDay.setString(urlImagen);
													console.log("IMG", urlImagen);

													if (/descanso/.test(name)) {
														if ($scope.plan.name == planState.data.planName) {
															Materialize.Toast.removeAll();
															Materialize.toast('D\xEDa de descanso.', 2500, 'orange');
														}
													} else {
														if (planState.data.planName == null) {
															$window.location = '#!dailyRoutine';
														} else {
															if ($scope.plan.name == planState.data.planName) {
																$window.location = '#!dailyRoutine';
															}
														}
													}
												} else if (validateRoutine.data.value === 1 && sst_Id === 1 && sty_Id === 1) { // rutina realizada
													$scope.validateRoutine = false;
													Materialize.Toast.removeAll();
													Materialize.toast('\xA1Rutina realizada!', 2500, 'orange');
												} else if (validateRoutine.data.value === 0 && sst_Id === 1 && sty_Id === 2) { // no tiene saldo
													Materialize.Toast.removeAll();
													Materialize.toast('\xA1No tiene saldo!', 2500, 'orange');
												} else if (validateRoutine.data.value === 1 && sst_Id === 1 && sty_Id === 2) { // no tiene saldo
													Materialize.Toast.removeAll();
													Materialize.toast('\xA1No tiene saldo!', 2500, 'orange');
												} else if (validateRoutine.data.value === 0 && sst_Id === 2 && sty_Id === 1) { // abrir modal
													$('#modal1').modal('open');
												} else if (validateRoutine.data.value === 1 && sst_Id === 2 && sty_Id === 1) { // abrir modal
													$('#modal1').modal('open');
												} else if (validateRoutine.data.value === 0 && sst_Id === 2 && sty_Id === 2) { // abrir modal
													$('#modal1').modal('open');
												} else if (validateRoutine.data.value === 1 && sst_Id === 2 && sty_Id === 2) { // abrir modal
													$('#modal1').modal('open');
												} else if (validateRoutine.data.value === 0 && sst_Id === 3 && sty_Id === 2) { // abrir modal
													$('#modal1').modal('open');
												} else if (validateRoutine.data.value === 1 && sst_Id === 3 && sty_Id === 2) { // abrir modal
													$('#modal1').modal('open');
												} else if (validateRoutine.data.value === 0 && sst_Id === 3 && sty_Id === 1) { // abrir modal
													$('#modal1').modal('open');
												} else if (validateRoutine.data.value === 1 && sst_Id === 3 && sty_Id === 1) { // abrir modal
													$('#modal1').modal('open');
												}

												if (planState.data.error === null) {
													if ($scope.plan.name != planState.data.planName) {
														swal({
															type: 'warning',
															text: 'Atenci\xF3n ya est\xE1s en el plan ' + planState.data.planName,
															animation: false,
															customClass: 'animated fadeInUp',
															confirmButtonText: 'OK',
															confirmButtonColor: '#FF4200'
														});
													}
												}

											}
										});
									});

								} else if (index == 0) {
									console.log('aqui2 => ==1');
									if (sst_Id === 1 && sty_Id === 1) { // ver rutina // 0 ingresa rutina
										$scope.validateRoutine = true;

										var objStartRoutine = {
											"Cus_Id": userID, //id cliente recibir po session
											"Cup_Id": planState.data.id, //id validationPlan
											"Rou_Id": id //id routine
										};
										console.log("DATOS para iniciar rutina => ", objStartRoutine);
										paramsStartRoutine.setString(objStartRoutine);

										var objCustomerPlan = {
											"IdCustomer": userID, //id cliente recibir po session
											"idPlan": $scope.plan.id //id plan
										};
										console.log("DATOS CUSTOMER PLAN => ", objCustomerPlan);
										paramsCustomerPlan.setString(objCustomerPlan);

										paramImgDay.setString(urlImagen);
										console.log("IMG", urlImagen);
										$window.location = '#!dailyRoutine';

										/* if (/descanso/.test(name)) {
											if ($scope.plan.name == planState.data.planName) {
												Materialize.Toast.removeAll();
												Materialize.toast('D\xEDa de descanso.', 2500, 'orange');
											}
										} else {
											if (planState.data.planName == null) {
												$window.location = '#!dailyRoutine';
											} else {
												if ($scope.plan.name == planState.data.planName) {
													$window.location = '#!dailyRoutine';
												}
											}
										} */
									}
								}
							}; // fin funcionCLICK


							if (planState.data.error === null) {
								if ($scope.plan.name != planState.data.planName) {
									/* $('.startRoutine').on('click', function () {
										swal({
											type: 'warning',
											html: $('<div>').addClass('some-class').text('' + 'Atenci\xF3n ya est\xE1s en el plan ' + planState.data.planName),
											animation        : false,
											customClass      : 'animated fadeInUp',
											confirmButtonText: 'OK',
											confirmButtonColor: '#FF4200'
										});
									}); */
									Materialize.Toast.removeAll();
									Materialize.toast('<div class="row margin0 col m12">Atenci\xF3n ya est\xE1s en el plan <b>' + planState.data.planName + '</b></div>', 2500, 'orange');

									$scope.state = {
										state: true,
										message: 'Atenci\xF3n ya est\xE1s en el plan ' + planState.data.planName
									};
								}
							} else {
								Materialize.toast('\xA1No has empezado ning\xFAn plan!', 2500, 'green');
								$scope.state = {
									state: false
								};
							}

							}).catch(function (err) {
								console.log(err);
								Materialize.toast('Error de conexión con la API', 4000, 'orange darken-4');
							});

							var customerClient = state.data.list[0];
							console.log("datos cliente => ", customerClient);
							var objSubscription = {
								id          : customerClient.id,
								First_name  : customerClient.first_name,
								Last_name   : customerClient.last_name,
								phone       : customerClient.phone,
								email       : customerClient.email,
								Token       : customerClient.token,
								maC_Address : customerClient.maC_Address,
								url_Referrer: customerClient.url_Referrer,
								height      : customerClient.height
							};

							//SUBSCRIPCION DEL CLIENTE
							$scope.openSubscription = function () {

								if ($('input[id="termCheck"]').is(':checked')) {
									// check checkbox
									ApiFactory.Subscription(objSubscription).then(function (data) {
										console.log("data controller send: ", data.data.error);
										if (data.status === 200 && data.data.error.value === 1) {

											//plugin analitycs
											cordova.plugins.firebase.analytics.logEvent("Suscripcion", { param1: "Suscripcion" });

											ApiFactory.getCustomerState(userID).then(function (newState) {
												console.log("LISTA => ", newState);

												ApiFactory.getRoutinesByPlan($scope.plan.id).then(function (querys) {

													//BEFORE
													/* let jsondts = [];
													//$scope.testData = [];
													for (let index = 0; index < $scope.testData.length; index++) {
														let element = $scope.testData[index];
														element.sst_Id = newState.data.list[0].sst_Id;
														element.sty_Id = newState.data.list[0].sty_Id;
														jsondts.push(element);
													}
													$scope.testData = jsondts;
													$scope.stateT = true; */

													//AFTER
													$scope.routine = querys.data.list;
													var starts = 0;
													var endings = starts + 2;
													var lastdatas = $scope.routine.length + 1;
													var reachLasts = false;
													$scope.loadmore = "Cargar Más";
													$scope.testData = [];
													$scope.listDataRoutine = function () {
														if (reachLasts) {
															return false;
														}
														var jsondts = [];
														for (var j = starts; j < endings; j++) {
															console.log(querys.data.list[j]);
															var element = $scope.routine[j];
															element.urlImagen = imgSplash + element.urlImagen;
															if (i === 0) {
																element.sst_Id = 1;
																element.sty_Id = 2;
															} else {
																element.sst_Id = newState.data.list[0].sst_Id;
																element.sty_Id = newState.data.list[0].sty_Id;
															}
															jsondts.push(element);
														};
														starts = j;
														endings = j + 1;

														$scope.testData = $scope.testData.concat(jsondts);
														console.log($scope.testData);

														if (endings >= lastdatas) {
															reachLasts = true;
															$scope.loadmore = "Alcanzado el limite";
														}
													};
													$scope.listDataRoutine();
												});
												Materialize.Toast.removeAll();
												Materialize.toast('¡Suscrito con éxito a InfluenceME!', 3000, 'green');
												$('#modal1').modal('close');
											});
										} else {
											Materialize.toast('Error al Suscribirse, Intente Nuevamente por Favor', 4000, 'red');
										}
									}).catch(function (err) {
										console.log(err);
										Materialize.toast('Error de conexión con la API', 4000, 'orange darken-4');
									});
								} else {
									Materialize.Toast.removeAll();
									Materialize.toast('<div><p style="font-size: 3.5vw;">Debes leer y aceptar los términos y condiciones.</p></div>', 2500, 'red');
								}
							};

							// Panel show more
							/* $(".show-more a").on("click", function () {
								var $this = $(this);
								var $content = $this.parent().prev("div.content");
								var linkText = $this.text();
									if (linkText == "Mostrar todos los " + $scope.routine.length + " días") {
									linkText = "Mostrar menos";
									$content.switchClass("hideContent", "showContent", 400);
								} else {
									linkText = "Mostrar todos los " + $scope.routine.length + " días";
									$content.switchClass("showContent", "hideContent", 400);
								};
								$this.text(linkText);
							}); */

					});
				}
			});
		} else {
			$window.location = "#!home";
		}
	}).catch(function (err) {
		console.log(err);
		Materialize.toast('Error de conexión con la API', 4000, 'orange darken-4');
	});
});

app.controller('DailyRoutineController', function ($scope, ApiFactory, paramRoutine, paramsStartRoutine, paramsCustomerPlan, $timeout, $window, $sce, paramImgDay, goPlans) {
	console.log('DailyRoutineController');
	angular.element('body').css({ background: '#4d4d4d' });

	document.addEventListener("backbutton", function () {
		//window.history.go(-1);
		//window.history.back();
		window.history.go(-1);
		navigator.app.backHistory();
	});


	var userID = firebase.auth().currentUser.uid;
	console.log(userID);

	$scope.paramsStartRoutine = paramsStartRoutine.getString;
	console.log("PARAMETROSS START: ", $scope.paramsStartRoutine());

	$scope.stringValue = paramRoutine.getString; // id rutina
	console.log("PARAMETROS GET EXER", $scope.stringValue());

	ApiFactory.getPlanState(userID).then(function (customerPlanInitital) {
		var validate = {
			"Cus_Id": userID, //id cliente recibir po session
			"Cup_Id": customerPlanInitital.data.id, //id validationPlan
			"Rou_Id": $scope.stringValue().id //id routine
		};
		console.log("validate", validate);

		ApiFactory.validateCustomerRoutine(validate).then(function (validateCustomerRoutine) {

			console.log("PLAN STATE ",customerPlanInitital);
			console.log("aqui => ", validateCustomerRoutine);
			console.log("ID PLAN STATE ", customerPlanInitital.data.idPlan);
			console.log("ID PLAN VALIDATE RUTINE ", validateCustomerRoutine.data.planId);
			$scope.disableActions = false;
			if (customerPlanInitital.data.idPlan != validateCustomerRoutine.data.planId && customerPlanInitital.data.error == null){
				$scope.disableActions = true;
				if($scope.stringValue().index > 0){
					goPlans.setString(1);
					location.href = "#!/home";
				}
			}
			if (customerPlanInitital.data.idPlan == validateCustomerRoutine.data.planId){
				console.log('MISMO PLAN =>');
				var objRoutine = {
					idCustomer: customerPlanInitital.data.id, // id del plan
					idRoutine : $scope.stringValue().id // id de la rutina
				};

				var objRoutineDay = {
					idCus    : userID, // id del cliente
					idCup    : customerPlanInitital.data.id,
					idRoutine: $scope.stringValue().id // id de la rutina
				};

				ApiFactory.getValidationRoutinesDay(objRoutineDay).then(function (validateRoutineDay) {
					console.log("validateRoutineDay = >>>>>>> ", validateRoutineDay);
					ApiFactory.validationRoutine(objRoutine).then(function (validateRoutine) {
						console.log("validateRoutine = >> ", validateRoutine);
						if ($scope.stringValue().index > 0) {
							if (validateRoutineDay.data.id == 0 || validateRoutine.data.value === 1) { // 1 rutina por dia
								goPlans.setString(1);
								location.href = "#!/home";
							}
						}
					});
				});
			}

			if (validateCustomerRoutine.data.id == 0) { //Rutina No creada
				$('#startRoutine').show();
				$('#finishRoutine').hide();
			} else if (validateCustomerRoutine.data.id == 1) { //Rutina Iniciada
				$('#startRoutine').hide();
				$('#finishRoutine').show();
			} else if (validateCustomerRoutine.data.id == 2) { //Rutina Finalizada
				Materialize.Toast.removeAll();
				Materialize.toast('Escoja la siguiente rutina', 2500, 'green');
				$window.location = '#!routinesByPlan';
			} else if (validateCustomerRoutine.data.state == null){
				Materialize.Toast.removeAll();
				Materialize.toast('Escoja la siguiente rutina', 2500, 'green');
				$window.location = '#!routinesByPlan';
			}

			$scope.cus_Id = [];

			$scope.paramsCustomerPlan = paramsCustomerPlan.getString;
			console.log("PARAMETROSS CUSTOMER: ", $scope.paramsCustomerPlan());

			$scope.imgDay = paramImgDay.getString;

			$scope.startRoutine = function () {
				//iniciar rutina

				// VALIDATION PLAN
				ApiFactory.getPlanState(userID).then(function (data) {
					console.log("lllll", data);
					if (data.data.error != null) {
						// no tiene plan
						ApiFactory.customerPlan($scope.paramsCustomerPlan()).then(function (customerPlan) {
							console.log("plan insertado => ", customerPlan);

							if (customerPlan.data.error.value == -1) {
								swal({
									type: 'error',
									title: '¡Usted tiene dos planes activos!',
									html: $('<div>').addClass('some-class').text('¡Comuniquese con el administrador para resolver su problema!'),
									animation: false,
									customClass: 'animated fadeInUp',
									allowOutsideClick: false,
									confirmButtonText: 'OK',
									confirmButtonColor: '#FF4200'
									//html: 'Submitted text: ' + text
								});
							} else {
								var arrStart = {
									"Cus_Id": $scope.paramsStartRoutine().Cus_Id, //id cliente recibir po session
									"Cup_Id": customerPlan.data.id, //id validationPlan
									"Rou_Id": $scope.paramsStartRoutine().Rou_Id //id routine
								};
								console.log("LLLL", arrStart);
								ApiFactory.startRoutine(arrStart).then(function (startRoutine) {
									if (startRoutine.status === 200) {
										console.log("RUTINA INICIADA", startRoutine.data);
										$scope.cus_Id.push(startRoutine.data.list[0].cus_Id);
										$scope.stateRutine = true;
										if (startRoutine.data.error.value === 1) {

											//plugin analitycs
											cordova.plugins.firebase.analytics.logEvent("Inicio_Rutina", { param1: "Inicio_Rutina" });
											$('#startRoutine').hide();
											$('#finishRoutine').show();
											Materialize.Toast.removeAll();
											Materialize.toast('\xA1Rutina Iniciada!', 2500, 'green');
											if (data.data.error.value == 0){ // no tiene plan
												swal({
													title             : '¡Plan seleccionado!',
													text              : "Al iniciar el plan queda escogido, solo se puede cambiar de plan una vez al día.",
													type              : 'warning',
													showCancelButton  : false,
													confirmButtonText : 'Ok',
													confirmButtonColor: '#FF4200'
												});
											}
										}
									}
								});

							}
						});
					} else {
						// tiene plan
						$scope.paramsStartRoutine = paramsStartRoutine.getString;
						console.log("PARAMETROSS START: ", $scope.paramsStartRoutine());

						var arrStart = {
							"Cus_Id": $scope.paramsStartRoutine().Cus_Id, //id cliente recibir po session
							"Cup_Id": data.data.id, //id validationPlan
							"Rou_Id": $scope.paramsStartRoutine().Rou_Id //id routine
						};
						console.log("LLLL", arrStart);

						ApiFactory.startRoutine(arrStart).then(function (startRoutine) {
							if (startRoutine.status === 200) {
								//plugin analitycs
								cordova.plugins.firebase.analytics.logEvent("Inicio_Rutina", { param1: "Inicio_Rutina" });
								console.log("RUTINA INICIADA", startRoutine.data);

								$scope.cus_Id.push(startRoutine.data.list[0].cus_Id);
								//localStorage.setItem("cus_Id", startRoutine.data.list[0].id); //id
								$scope.stateRutine = true;

								if (startRoutine.data.error.value === 1) {
									/* if (startRoutine.data.list.length > 0) {
										$('#startRoutine').hide();
										$('#finishRoutine').show();
										localStorage.setItem("startRoutine", "Init");
									} */
									//ApiFactory.validateCustomerRoutine(arrStart).then((validateCustomerRoutine) => {
									//console.log(validateCustomerRoutine);
									$('#startRoutine').hide();
									$('#finishRoutine').show();
									Materialize.Toast.removeAll();
									Materialize.toast('\xA1Rutina Iniciada!', 2500, 'green');
									//});
								}
							}
						});
					}
				});
			};

			//FINISH ROUTINE
			$scope.finishRoutine = function () {
				swal({
					title: '¿Desea finalizar la rutina?',
					type: 'warning',
					showCancelButton: true,
					confirmButtonText: 'Si',
					cancelButtonText: 'No',
					confirmButtonColor: '#FF4200',
					cancelButtonColor: '#1a1a1a',
				}).then(function (isConfirm) {
					if (isConfirm) {
						console.log('FINALIZADO ENTRENAMIENTO');
						ApiFactory.getPlanState(userID).then(function (customerPlan) {

							var arrStart = {
								"Cus_Id": userID, //id cliente recibir po session
								"Cup_Id": customerPlan.data.id, //id validationPlan
								"Rou_Id": $scope.stringValue().id //id routine
							};
							console.log(arrStart);
							ApiFactory.finishRoutine2(arrStart).then(function (finishRoutine) {
								console.log(finishRoutine);
								if (finishRoutine.data.error.value === 1) {
									//plugin analitycs
									cordova.plugins.firebase.analytics.logEvent("Finalizada_Rutina", { param1: "Finalizada_Rutina" });
									//localStorage.setItem("startRoutine", "Finish");
									Materialize.Toast.removeAll();
									swal({
										type: 'success',
										title: '¡Entrenamiento Finalizado!',
										html: $('<div>').addClass('some-class').text('¡Muy bien, terminaste el entrenamiento del día de hoy!'),
										animation: false,
										customClass: 'animated fadeInUp',
										allowOutsideClick: false,
										confirmButtonText: 'OK',
										confirmButtonColor: '#FF4200'
										//html: 'Submitted text: ' + text
									});
									$('.swal2-confirm').click(function () {
										$window.location = "#!routinesByPlan";
									});
								} else {
									Materialize.Toast.removeAll();
									swal({
										type: 'error',
										title: '¡Problema al finalizar la rutina!',
										html: $('<div>').addClass('some-class').text('¡Intenta nuevamente!'),
										animation: false,
										customClass: 'animated fadeInUp',
										allowOutsideClick: false,
										confirmButtonText: 'OK',
										confirmButtonColor: '#FF4200'
										//html: 'Submitted text: ' + text
									});
								}
							});
						});

					}
				})
			};


			$scope.arrExercises = [];
			ApiFactory.getExercisesByRoutines($scope.stringValue().id).then(function (dataExercises) {
				if (dataExercises.status === 200 && dataExercises.data.error == null) {
					$scope.exercises = dataExercises.data.list;
					console.log("JERCICIOS ", $scope.exercises);
					var _jj;
					for (var j = 0; j < $scope.exercises.length; j++) {
						var _jj = $scope.exercises[j];
						_jj.series = [];
						_jj.urlImage = imgSplash + _jj.urlImage;
						$scope.arrExercises.push(_jj);
					}

					//console.log($scope.arrExercises)
					$scope.pp = [];
					$scope.exercisesFinish = [];

					for (var i = 0; i < $scope.arrExercises.length; i++) {
						var element = $scope.arrExercises[i];
						$scope.pp.push(element);
						ApiFactory.getExercisesById(element.id).then(function (query) {
							if (query.status === 200 && query.data.error.value === 1) {
								$scope.arrQ = query.data.exercise;
								for (var oo = 0; oo < $scope.pp.length; oo++) {
									var elementH = $scope.pp[oo];
									if (elementH.name == "Descanso Activo") {
										$('#startRoutine').hide();
										$('#finishRoutine').hide();
									}
									if ($scope.arrQ.id === elementH.id) {
										elementH.series.push($scope.arrQ.series);
										elementH.numSeries = elementH.series[0].length;
										$scope.exercisesFinish.push(elementH);
									}
								}
							}
						});
					}

					$scope.dataSerie = [];
					$scope.countSerie = [];


					/* if (validateCustomerRoutine.data.id == 0) { //Rutina No creada
						$scope.stateRutine = false;
					} else if (validateCustomerRoutine.data.id == 1) { //Rutina Iniciada
						$scope.stateRutine = true;
					} */


					$scope.modalData = function (data, index) {
						data.index = index;

						if ($scope.cus_Id.length > 0) {
							var cur_Id = $scope.cus_Id[0];
						} /* else {
							var cur_Id = localStorage.getItem("cus_Id");
						} */

						/* // cuando no haya empezado rutina
						if (cur_Id == null) {
							$scope.stateRutine = false;
							Materialize.toast('Por favor inicie la rutina', 4000, 'orange');
						} else {
							$scope.stateRutine = true;
						} */


						/* ApiFactory.validateCustomerRoutine(validate).then(function (validateCustomerRoutine_) {
							console.log("data rutina ", validateCustomerRoutine_);
							if (validateCustomerRoutine_.data.id == 0) { //Rutina No creada
								Materialize.Toast.removeAll();
								Materialize.toast('Por favor inicie la rutina en el botón Empezar', 2500, 'orange');
							}
						}); */



						$scope.getWeight = [];

						var _loop = function _loop(_i) {
							var arr = data.series[0][_i];
							objWeights = {
								ser_Id: arr.id,
								cur_Id: cur_Id
							};

							console.log(objWeights);
							ApiFactory.getWeightExercises(objWeights).then(function (query) {
								console.log(query);
								$scope.getWeight.push(query.data.list.pop());
								console.log(query.data.list);
								for (var _index2 = 0; _index2 < $scope.getWeight.length; _index2++) {
									var l = $scope.getWeight[_index2];
									if (arr.id == l.ser_Id) {
										arr.weight = l.weight;
									}
								}
							});
						};

						for (var _i = 0; _i < data.series[0].length; _i++) {
							var objWeights;

							_loop(_i);
						}
						$scope.dataSerie.push(data);
						//console.log("getWeight GET", $scope.getWeights)
						console.log("data", $scope.dataSerie);

						$scope.countSerie.push(data.series[0].length);
						var urlVideo = '<div class="codegena_iframe">\n\t\t\t\t\t' + $scope.dataSerie[0].urlVideo + '\n\t\t\t\t\t</div>';
						$scope.urlVideo = $sce.trustAsHtml(urlVideo);

						//peso del select
						$scope.numberWeight = [];
						for (var _index = 0; _index <= 100; _index++) {
							var _element = _index;
							$scope.numberWeight.push(_element);
							//$scope.weightModel = $scope.numberWeight[100];
						}
					};

					$scope.updateWeight = function (data, weight) {

						if ($scope.cus_Id.length > 0) {
							var cur_Id = $scope.cus_Id[0];
						} /* else {
							var cur_Id = localStorage.getItem("cus_Id");
						} */

						var objWeight = {
							ser_Id: data.id,
							cur_Id: cur_Id,
							weight: weight
						};
						console.log(objWeight);
						ApiFactory.weightExercises(objWeight).then(function (query) {
							console.log("datos insertados: ", query);
						});
					};

					$scope.empty = function () {
						$('iframe').attr('src', $('iframe').attr('src'));
						$timeout(function () {
							$scope.dataSerie = [];
							$scope.countSerie = [];
						}, 400);
					};
				} else {
					$window.location = "#!home";
				}
			}).catch(function (err) {
				console.log(err);
				Materialize.toast('Error de conexión con la API', 4000, 'orange darken-4');
			});
		}); // fin validateCustomerRoutine
	}); // fin planState

});

app.controller('PerfilController', function ($scope, ApiFactory, $window, goPlans) {
	console.log('perfil');
	angular.element('body').css({ background: '#4d4d4d' });
	$('.termAccept').on('click', function () {
		$('#termCheck').prop('checked', true);
	});

	$(document).ready(function () {
		$('.collapsible').collapsible();
		Materialize.updateTextFields();
		$('.modal').modal();
	});
	$('.onsidebar').on('click', function () {
		$('#sidebar3').css('z-index', 9999);
	});

	$('#faq').on('click', function () {
		$('#faqNav').addClass('fadeInDown animated');
		$('.imgleft').addClass('fadeInRight animated');
		$('#titlefaq').addClass('fadeIn animated');
		$('#ulfaq').addClass('fadeIn animated');
	});

	$('#settings').on('click', function () {
		$('#settNav').addClass('fadeInDown animated');
		$('.effectJ').addClass('fadeInLeft animated');
	});

	//logout
	$('#btnLogout').on('click', function () {
		firebase.auth().signOut();
		$window.location = "#!/";
		console.log('Logout => Cierre de sesión exitoso');
	});

	$scope.goPlans = function () {
		goPlans.setString(1);
		location.href = "#!/home";
	}

	var userFire = firebase.auth().currentUser;
	var userID = userFire.uid;
	moment.locale('es');
	var creationTime = userFire.metadata.creationTime;
	$scope.fecha = moment(creationTime).fromNow();

	$scope.avatarFB = userFire.photoURL;
	console.log($scope.avatarFB);

	/*Tiene que recibir ID del cliente por session despues de loguear*/
	ApiFactory.getAllByCustomer(userID).then(function (customer) {
		console.log(customer.data.list);
		if (customer.status === 200) {
			$scope.planCustomers = [];
			for (var index = 0; index < customer.data.list.length; index++) {
				var element = customer.data.list[index];
				element.url = imgSplash + element.backGround;
				$scope.planCustomers.push(element);
			}
			console.log("REGISTROS ", $scope.planCustomers);
			if ($scope.planCustomers.length === 0) $scope.data = true; else $scope.data = false;
		} else {
			console.log('error en el metodo');
		}
	}).catch(function (err) {
		console.log(err);
	});

	/*Tiene que recibir ID del cliente por session despues de loguear*/
		/* ApiFactory.getPlansbyCustomer(userID).then((data) => {
		console.log(data)
		if (data.status === 200) {
			$scope.planCustomers = [];
			for (let index = 0; index < data.data.list.length; index++) {
				let element = data.data.list[index];
				element.url = imgSplash + element.url;
				$scope.planCustomers.push(element);
			}
			console.log("REGISTROS ", $scope.planCustomers)
			if ($scope.planCustomers.length === 0)
				$scope.data = true;
			else
				$scope.data = false;
		}else{
			console.log('error en el metodo')
		}
	}).catch(function (err) {
		console.log(err)
	}); */

	/*Tiene que recibir ID del cliente por session despues de loguear*/
	ApiFactory.getCustomerProfile(userID).then(function (dataCustomer) {
		if (dataCustomer.status === 200 && dataCustomer.data.error.value === 1) {
			$scope.customerProfile = dataCustomer.data.list[0];
			console.log("customerProfile ", $scope.customerProfile);
			if ($scope.customerProfile.uwt_Id == 1){
				$scope.unitW = 'Lbs';
			}else{
				$scope.unitW = 'Kgs';
			}
			if ($scope.customerProfile.height_Id == 1) {
				$scope.unitH = 'Cms';
			} else {
				$scope.unitH = 'Pulgadas';
			}

			ApiFactory.getTextCountry().then(function (textCountry) {
				var idOperator = dataCustomer.data.list[0].idoperator;
				for (var i = 0; i < textCountry.data.list.length; i++) {
					textCountry.data.list[i]
					if (textCountry.data.list[i].id == idOperator) {
						$scope.operatorInfo = textCountry.data.list[i];
					}
				}
			}).catch(function (error) {
				console.log(error);
			});



			if ($scope.customerProfile.type == 2){
				$("#cemail").attr("disabled", "true");
			}

			var objSubscription = {
				id          : $scope.customerProfile.id,
				First_name  : $scope.customerProfile.first_name,
				Last_name   : $scope.customerProfile.last_name,
				phone       : $scope.customerProfile.phone,
				email       : $scope.customerProfile.email,
				Token       : $scope.customerProfile.token,
				maC_Address : $scope.customerProfile.maC_Address,
				url_Referrer: $scope.customerProfile.url_Referrer,
				height      : $scope.customerProfile.height
			};
			console.log(objSubscription);
			//SUBSCRIPCION DEL CLIENTE
			$scope.openSubscription = function () {

				if ($('input[id="termCheck"]').is(':checked')) {
					// check checkbox
					ApiFactory.Subscription(objSubscription).then(function (data) {
						console.log("data controller send: ", data.data.error);
						if (data.status === 200 && data.data.error.value === 1) {
							//plugin analitycs
							cordova.plugins.firebase.analytics.logEvent("Suscripcion", { param1: "Suscripcion" });
							Materialize.Toast.removeAll();
							Materialize.toast('\xA1Suscrito con Exito!', 4000, 'green');
							$window.location = "#!/home";
						} else {
							Materialize.toast('Error al Suscribirse, Intente Nuevamente por Favor', 4000, 'red');
						}
					}).catch(function (err) {
						console.log(err);
						Materialize.toast('Error de conexión con la API', 4000, 'orange darken-4');
					});
				} else {
					Materialize.toast('<div><p style="font-size: 3.5vw;">Debes leer y aceptar los términos y condiciones.</p></div>', 2500, 'red');
				}
			};
		}
	}).catch(function (err) {
		console.log(err);
	});

	ApiFactory.getFAQ().then(function (query) {
		if (query.status === 200 && query.data.error.value === 1) {
			$scope.FAQS = query.data.list;
			//console.log($scope.FAQS)
		}
	}).catch(function (err) {
		console.log(err);
	});

	document.getElementById('cancelSubs').onclick = function () {
		swal(_defineProperty({
			title: '<strong>Para cancelar Subscripción, por favor escriba:</strong> Eliminar <script>en el campo de texto</strong>',
			input: 'text',
			showCancelButton: true,
			allowOutsideClick: false,
			confirmButtonText: 'Enviar',
			confirmButtonColor: '#FF4200',
			showLoaderOnConfirm: true,
			preConfirm: function preConfirm(text) {
				return new Promise(function (resolve, reject) {
					setTimeout(function () {
						var textCap = text.replace(/\b\w/g, function (l) {
							return l.toUpperCase();
						});
						if (textCap === 'Eliminar') {
							/*Tiene que recibir ID del cliente por session despues de loguear*/
							ApiFactory.cancelSubscription(userID).then(function (cancelSubscription) {
								console.log("CAMCEL SUBS => ", cancelSubscription);
								if (cancelSubscription.status === 200 && cancelSubscription.data.error.value === 1) {
									$scope.cancelSubscription = cancelSubscription.data.list[0];
									console.log("cancelSubscription ", $scope.cancelSubscription);
									resolve();
								}
							}).catch(function (err) {
								console.log(err);
							});
						} else {
							reject('El texto ingresado no coincide. Ingrese por favor Eliminar.');
						}
					}, 2000);
				});
			}
		}, 'allowOutsideClick', false)).then(function (text) {
			swal({
				type: 'success',
				title: '¡Tu suscripción ha sido cancelada!',
				html: $('<div>').addClass('some-class').text('Puedes volver cuando quieras, nos nos iremos a ningún lugar.'),
				allowOutsideClick: false,
				confirmButtonText: 'OK',
				confirmButtonColor: '#FF4200'
			});
			$('.swal2-confirm').click(function () {
				//firebase.auth().signOut();
				$window.location = "#!home";
			});
		});
	};

	//form email
	$("#formValidate").validate({
		rules: {
			cemail: {
				required: true,
				email: true
			}
		},
		//For custom messages
		messages: {
			cemail: {
				required: "Ingrese un correo válido"
				//minlength: "Ingrese como mínimo 5 caracteres",
			}
		},
		errorElement: 'div',
		errorPlacement: function errorPlacement(error, element) {
			var placement = $(element).data('error');
			console.log(placement);
			if (placement) {
				$(placement).append(error);
			} else {
				error.insertAfter(element);
			}
		}
	});

	//form password
	$("#formValidatePass").validate({
		rules: {
			password: {
				required: true
			},
			cpassword: {
				required: true,
				equalTo: "#password"
			}
		},
		//For custom messages
		messages: {
			cpassword: "Error: La contraseña no coincide"
		},
		errorElement: 'div',
		errorPlacement: function errorPlacement(error, element) {
			var placement = $(element).data('error');
			console.log(placement);
			if (placement) {
				$(placement).append(error);
			} else {
				error.insertAfter(element);
			}
		}
	});

	$scope.updatePerfil = function () {
		var cemail = $('#cemail').val();
		firebase.auth().onAuthStateChanged(function (firebaseUser) {
			if (firebaseUser) {
				var user = firebase.auth().currentUser;
				user.updateEmail(cemail).then(function () {
					console.log('update email successful');
					user.sendEmailVerification().then(function () {
						console.log('Email sent update');
					}, function (err) {
						console.log(err);
					});
				}, function (err) {
					console.log(err);
				});
			}
		});

		var updateInfo = {
			id: userID,
			email: cemail
		};
		ApiFactory.updateEmail(updateInfo).then(function (updateEmail) {
			console.log('Update email API => ', updateEmail);
		});
	};

	$scope.updatePass = function () {
		var password = $('#password').val();
		var cpassword = $('#cpassword').val();

		if (password != cpassword) {
			$('#updatePass').bind('click', false);
			Materialize.toast('Contraseñas no Coinciden', 3000, 'orange');
		} else if (password == cpassword && password != '' && cpassword != '') {
			$('#updatePass').unbind('click', false);
			firebase.auth().onAuthStateChanged(function (firebaseUser) {
				if (firebaseUser) {
					var user = firebase.auth().currentUser;
					user.updatePassword(cpassword).then(function () {
						console.log('update pass');
						Materialize.toast('Contraseña Actualizada', 3000, 'green');
					}, function (err) {
						console.log(err);
					});
				}
			});
		}
	};

	$scope.updateUnidad = function () {
		var unidad = $('#unidad').val();
		var updateInfo = {
			id: userID,
			Uwt_Id: unidad
		};
		console.log(updateInfo);
		ApiFactory.updateWeight(updateInfo).then(function (updateWeight) {
			console.log('Update Weight API => ', updateWeight);
			Materialize.toast('Unidad Actualizada', 3000, 'green');
		});
	};
});

app.controller('CalendarController', function ($scope, ApiFactory, $window) {
	console.log('calendar');
	angular.element('body').css({ background: '#4d4d4d' });

	/* ApiFactory.getFAQ().then(function (query) {
		if (query.status === 200 && query.data.error.value === 1) {
			$scope.FAQS = query.data.list;
			//console.log($scope.FAQS)

			var datos = [
				//{
					//title: 'prueba',
					//start: '2017-11-01'
				//},
				{
					title: '',
					url: '#!dailyRoutine',
					start: '2017-11-07',
					end: '2017-11-07'
				}, {
					title: '',
					url: '#!dailyRoutine',
					start: '2017-11-08',
					end: '2017-11-08'
				}, {
					title: '',
					url: '#!dailyRoutine',
					start: '2017-11-09',
					end: '2017-11-09'
				}, {
					title: '',
					url: '#!dailyRoutine',
					start: '2017-11-10',
					end: '2017-11-10'
				}, {
					title: '',
					url: '#!dailyRoutine',
					start: '2017-11-11',
					end: '2017-11-11'
				}, {
					title: '',
					url: '#!dailyRoutine',
					start: '2017-11-12',
					end: '2017-11-12'
				}, {
					title: '',
					url: '#!dailyRoutine',
					start: '2017-11-13',
					end: '2017-11-13'
				}, {
					title: '',
					url: '#!dailyRoutine',
					start: '2017-11-14',
					end: '2017-11-14'
				}, {
					title: '',
					url: '#!dailyRoutine',
					start: '2017-11-15',
					end: '2017-11-15'
				}, {
					title: '',
					url: '#!dailyRoutine',
					start: '2017-11-16',
					end: '2017-11-16'
				}, {
					title: '',
					url: '#!dailyRoutine',
					start: '2017-11-17',
					end: '2017-11-17'
				}, {
					title: '',
					url: '#!dailyRoutine',
					start: '2017-11-18',
					end: '2017-11-18'
				}, {
					title: '',
					url: '#!dailyRoutine',
					start: '2017-11-19',
					end: '2017-11-19'
				}, {
					title: '',
					url: '#!dailyRoutine',
					start: '2017-11-20',
					end: '2017-11-20'
				}, {
					title: '',
					url: '#!dailyRoutine',
					start: '2017-11-21',
					end: '2017-11-21'
				}, {
					title: '',
					url: '#!dailyRoutine',
					start: '2017-11-22',
					end: '2017-11-22'
				}, {
					title: '',
					url: '#!dailyRoutine',
					start: '2017-11-23',
					end: '2017-11-23'
				}, {
					title: '',
					url: '#!dailyRoutine',
					start: '2017-11-24',
					end: '2017-11-24'
				}, {
					title: '',
					url: '#!dailyRoutine',
					start: '2017-11-25',
					end: '2017-11-25'
				}, {
					title: '',
					url: '#!dailyRoutine',
					start: '2017-11-26',
					end: '2017-11-26'
				}, {
					title: '',
					url: '#!dailyRoutine',
					start: '2017-11-27',
					end: '2017-11-27'
				}, {
					title: '',
					url: '#!dailyRoutine',
					start: '2017-11-28',
					end: '2017-11-28'
				}, {
					title: '',
					url: '#!dailyRoutine',
					start: '2017-11-29',
					end: '2017-11-29'
				}];
			//$(document).ready(function () {
			initThemeChooser({
				init: function init(themeSystem) {
					$('#calendar').fullCalendar({
						events: datos,
						themeSystem: 'standard',
						locale: 'es'
					});
				}
			});
			//});
		}
	}).catch(function (err) {
		console.log(err);
	}); */
});
