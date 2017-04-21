'use strict';

angular.module('mediaboxApp', ['mediaboxApp.auth', 'mediaboxApp.admin', 'mediaboxApp.constants', 'ngCookies', 'ngResource', 'ngSanitize', 'ngMessages', 'btford.socket-io', 'ui.router', 'validation.match', 'ngMaterial', 'ngAnimate', 'ngMdIcons', 'angularMoment', 'infinite-scroll', 'materialDatePicker', 'ngFileUpload', 'rzModule', 'darthwade.dwLoading', 'ui.tree', 'ui.odometer', 'oitozero.ngSweetAlert', 'naif.base64', 'ngPintura', 'ngOnload', 'kendo.directives']).config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $urlMatcherFactoryProvider, $mdThemingProvider, $mdIconProvider) {
  $urlRouterProvider.otherwise('/');
  $locationProvider.html5Mode(true);

  // set the default palette name
  var defaultPalette = 'blue';
  // define a palette to darken the background of components
  var greyBackgroundMap = $mdThemingProvider.extendPalette(defaultPalette, { 'A100': 'fafafa' });

  $mdThemingProvider.definePalette('grey-background', greyBackgroundMap);
  $mdThemingProvider.setDefaultTheme(defaultPalette);

  // customize the theme
  $mdThemingProvider.theme(defaultPalette).primaryPalette(defaultPalette).accentPalette('pink').backgroundPalette('grey-background');

  // var spritePath = 'bower_components/material-design-icons/sprites/svg-sprite/';
  // $mdIconProvider.iconSet('navigation', spritePath + 'svg-sprite-navigation.svg');
  // $mdIconProvider.iconSet('image', spritePath + 'svg-sprite-image.svg');
  // $mdIconProvider.iconSet('action', spritePath + 'svg-sprite-action.svg');
  // $mdIconProvider.iconSet('content', spritePath + 'svg-sprite-content.svg');
  // $mdIconProvider.iconSet('toggle', spritePath + 'svg-sprite-toggle.svg');
  // $mdIconProvider.iconSet('alert', spritePath + 'svg-sprite-alert.svg');
  // $mdIconProvider.iconSet('social', spritePath + 'svg-sprite-social.svg');
  // $mdIconProvider.iconSet('avatar', '../assets/iconsets/avatar-icons.svg', 128);
  // $mdIconProvider.defaultIconSet(spritePath + 'svg-sprite-alert.svg');
}).controller('preLoaderCtrl', function ($scope) {
  $scope.siteLoaded = true;
});
//# sourceMappingURL=app.js.map

'use strict';

angular.module('mediaboxApp.admin', ['mediaboxApp.auth', 'ui.router']);
//# sourceMappingURL=admin.module.js.map

'use strict';

angular.module('mediaboxApp.auth', ['mediaboxApp.constants', 'mediaboxApp.util', 'ngCookies', 'ui.router']).config(function ($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
});
//# sourceMappingURL=auth.module.js.map

'use strict';

angular.module('mediaboxApp.util', []);
//# sourceMappingURL=util.module.js.map

'use strict';

angular.module('mediaboxApp').config(function ($stateProvider) {
  // login, signup are used for emergency situations otherwise LoginModal
  $stateProvider.state('login', {
    url: '/login?referrer',
    templateUrl: 'app/account/login/login.html',
    controller: 'LoginController',
    controllerAs: 'login',
    title: 'Login to Mediabox'
  }).state('logout', {
    url: '/logout?referrer',
    referrer: '/',
    template: '',
    controller: function controller($state, Auth) {
      Auth.logout();
      $state.go('/');
    }
  }).state('signup', {
    url: '/signup',
    templateUrl: 'app/account/signup/signup.html',
    controller: 'SignupController',
    controllerAs: 'signup',
    title: 'Signup for Mediabox'
  }).state('forgot', {
    url: '/forgot?email',
    templateUrl: 'app/account/password/forgot.html',
    controller: 'PasswordController',
    controllerAs: 'forgot',
    title: 'Password Recovery'
  }).state('reset', {
    url: '/reset/:token',
    templateUrl: 'app/account/password/reset.html',
    controller: 'PasswordController',
    controllerAs: 'reset',
    title: 'Reset Password'
  }).state('cp', {
    url: '/change-password',
    templateUrl: 'app/account/cp/cp.html',
    controller: 'CpController',
    controllerAs: 'cp',
    title: 'Change Password',
    authenticate: true
  });
}).run(function ($rootScope, Auth) {
  $rootScope.$on('$stateChangeStart', function (event, next, nextParams, current) {
    if (next.name === 'logout' && current && current.name && !current.authenticate) {
      next.referrer = current.name;
    }
  });

  $rootScope.$on('$stateChangeSuccess', function (evt, toState) {
    if (toState.title) {
      window.document.title = toState.title + ' - Mediabox';
    } else if (toState.name != 'crud-table') {
      var input = toState.name;
      input = input.replace(/([A-Z])/g, ' $1');
      input = input[0].toUpperCase() + input.slice(1);
      window.document.title = input + ' - Mediabox';
    }
  });
});
//# sourceMappingURL=account.js.map

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CpController = function () {
  function CpController(Auth, Settings, Toast) {
    _classCallCheck(this, CpController);

    this.errors = {};
    this.submitted = false;
    this.Settings = Settings;
    this.Toast = Toast;
    this.Auth = Auth;
  }

  _createClass(CpController, [{
    key: 'changePassword',
    value: function changePassword(form) {
      var _this = this;

      this.submitted = true;

      if (form.$valid) {
        this.loading = true;

        this.Auth.changePassword(this.user.oldPassword, this.user.newPassword).then(function () {
          _this.loading = false;
          _this.message = 'Password successfully changed.';
        }).catch(function () {
          _this.loading = false;
          form.password.$setValidity('mongoose', false);
          _this.errors.other = 'Incorrect password';
          _this.message = '';
        });
      } else {
        this.Toast.show({ type: 'info', text: 'Form is not valid. Check your inputs' });
      }
    }
  }]);

  return CpController;
}();

angular.module('mediaboxApp').controller('CpController', CpController);
//# sourceMappingURL=cp.controller.js.map

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LoginController = function () {
  function LoginController(Auth, $state) {
    _classCallCheck(this, LoginController);

    this.user = { email: 'admin@codenx.com', password: 'codenx' };
    this.errors = {};
    this.submitted = false;

    this.Auth = Auth;
    this.$state = $state;
  }

  _createClass(LoginController, [{
    key: 'login',
    value: function login(form) {
      var _this = this;

      this.submitted = true;

      if (form.$valid) {
        this.loading = true;
        this.Auth.login({
          email: this.user.email,
          password: this.user.password
        }).then(function () {
          if (!angular.isUndefined(_this.$state.params.referrer)) {
            _this.$state.go(_this.$state.params.referrer);
          } else {
            _this.$state.go('/');
          }
        }).catch(function (err) {
          _this.errors.other = err.message;
          _this.loading = false;
        });
      }
    }
  }]);

  return LoginController;
}();

angular.module('mediaboxApp').controller('LoginController', LoginController);
//# sourceMappingURL=login.controller.js.map

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PasswordController = function () {
  function PasswordController(Auth, $state, $http) {
    _classCallCheck(this, PasswordController);

    this.user = {};
    this.user.email = $state.params.email;
    this.errors = {};
    this.submitted = false;

    this.Auth = Auth;
    this.$state = $state;
    this.$http = $http;
  }

  _createClass(PasswordController, [{
    key: 'reset',
    value: function reset(form) {
      var _this = this;

      this.submitted = true;

      if (form.$valid) {
        this.loading = true;
        this.user.token = this.$state.params.token;
        this.$http.post('api/users/reset/' + this.$state.params.token, this.user).then(function (data) {
          _this.errors.message = data.data.message;
          _this.errors.email = '';
          _this.loading = false;
        }).catch(function (err) {
          _this.errors.message = '';
          _this.errors.email = err.data.message;
          _this.loading = false;
        });
      }
    }
  }, {
    key: 'forgot',
    value: function forgot(form) {
      var _this2 = this;

      this.submitted = true;

      if (form.$valid) {
        this.loading = true;
        this.$http.post('api/users/forgot', this.user).then(function (data) {
          _this2.errors.message = data.data.message;
          _this2.errors.email = '';
          _this2.loading = false;
        }).catch(function (err) {
          _this2.errors.message = '';
          _this2.errors.email = err.data.message;
          _this2.loading = false;
        });
      }
    }
  }]);

  return PasswordController;
}();

angular.module('mediaboxApp').controller('PasswordController', PasswordController);
//# sourceMappingURL=password.controller.js.map

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SignupController = function () {
  function SignupController(Auth, $state) {
    _classCallCheck(this, SignupController);

    this.user = {};
    this.errors = {};
    this.submitted = false;
    this.Auth = Auth;
    this.$state = $state;
  }

  _createClass(SignupController, [{
    key: 'register',
    value: function register(form) {
      var _this = this;

      console.log(this.user);
      this.submitted = true;
      if (form.$valid) {
        this.loading = true;
        this.Auth.createUser({
          name: this.user.name,
          email: this.user.email,
          phone: this.user.phone,
          company: this.user.company,
          website: this.user.website,
          role: this.user.role,
          password: this.user.password
        }).then(function () {
          // Account created, redirect to home
          _this.$state.go('/');
        }).catch(function (err) {
          err = err.data;
          // this.errors = {};
          _this.loading = false;
          // Update validity of form fields that match the sequelize errors
          if (err.name) {
            angular.forEach(err.errors, function (field) {
              // console.log('err',field);
              form[field.path].$setValidity('mongoose', false);
              // this.errors[field] = err.message;
            });
          }
        });
      }
    }
  }, {
    key: 'cancel',
    value: function cancel() {
      this.$state.go('login');
    }
  }]);

  return SignupController;
}();

angular.module('mediaboxApp').controller('SignupController', SignupController);
//# sourceMappingURL=signup.controller.js.map

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
    var AddressController = function () {
        function AddressController(Toast, Address, Settings, socket, $http, $scope, $mdDialog) {
            _classCallCheck(this, AddressController);

            var vm = this;
            this.Address = Address;
            this.addr = {};
            this.$http = $http;
            this.$mdDialog = $mdDialog;
            this.socket = socket;
            this.Toast = Toast;
            this.newAddress = false;
            this.options = {};
            this.Settings = Settings;
            this.getMyAddress();
            $scope.$on('$destroy', function () {
                socket.unsyncUpdates('address');
            });
        }

        _createClass(AddressController, [{
            key: 'getMyAddress',
            value: function getMyAddress() {
                var vm = this;
                vm.Address.my.query(function (res) {
                    vm.address = res;
                    vm.addr = res[0];
                    vm.socket.syncUpdates('address', vm.address);
                });
            }
        }, {
            key: 'switchAddress',
            value: function switchAddress(a) {
                this.addr = a;
            }
        }, {
            key: 'delete',
            value: function _delete(item) {
                var vm = this;
                var confirm = this.$mdDialog.confirm().title('Would you like to delete the address?').textContent('This is unrecoverable').ariaLabel('Confirm delete address').ok('Please do it!').cancel('No. keep');

                this.$mdDialog.show(confirm).then(function () {
                    vm.Address.delete({ id: item._id }, function () {}, function (res) {
                        vm.Toast.show({ type: 'error', text: res });
                    });
                });
            }
        }, {
            key: 'saveAddress',
            value: function saveAddress(data) {
                var vm = this;
                data.country = vm.Settings.country.name;
                vm.loadingAddress = true;
                if (_.has(data, '_id')) {
                    this.Address.update({ id: data._id }, data, function () {
                        vm.loadingAddress = false;
                        vm.getMyAddress();
                    }, function (err) {
                        // If rejected by auth interceptor.service
                        vm.loadingAddress = false;
                    });
                } else {
                    this.Address.save(data, function () {
                        vm.loadingAddress = false;
                        vm.getMyAddress();
                    });
                }
                vm.addressForm(false);
            }
        }, {
            key: 'addressForm',
            value: function addressForm(visible) {
                this.showAddressForm = visible;
            }
        }, {
            key: 'cancelForm',
            value: function cancelForm(addr) {
                this.showAddressForm = false;
                this.addr = this.address[0];
            }
        }]);

        return AddressController;
    }();

    angular.module('mediaboxApp').controller('AddressController', AddressController);
})();
//# sourceMappingURL=address.controller.js.map

'use strict';

angular.module('mediaboxApp').config(function ($stateProvider) {
  $stateProvider.state('address', {
    url: '/address?id&msg',
    templateUrl: 'app/address/address.html',
    controller: 'AddressController as address',
    authenticate: true
  });
});
//# sourceMappingURL=address.js.map

'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var AdminController = function AdminController(User, Settings, appConfig) {
    _classCallCheck(this, AdminController);

    var userRoles = appConfig.userRoles || [];
    this.options = [{ field: 'name' }, { field: 'role', dataType: 'select', options: userRoles }];
    if (Settings.demo) this.options.push({ field: 'null', heading: 'email (Hidden in demo mode)' });else this.options.push({ field: 'email' });

    this.options.push({ field: 'provider', noEdit: true });
  }

  //   delete(user) {
  //     user.$remove();
  //     this.users.splice(this.users.indexOf(user), 1);
  //   }
  ;

  angular.module('mediaboxApp.admin').controller('AdminController', AdminController);
})();
//# sourceMappingURL=admin.controller.js.map

'use strict';

angular.module('mediaboxApp.admin').config(function ($stateProvider) {
  $stateProvider.state('admin', {
    url: '/admin',
    templateUrl: 'app/admin/admin.html',
    controller: 'AdminController as admin',
    authenticate: 'admin'
  });
});
//# sourceMappingURL=admin.router.js.map

"use strict";

(function (angular, undefined) {
	angular.module("mediaboxApp.constants", []).constant("appConfig", {
		"userRoles": ["guest", "user", "manager", "admin"],
		"reviewSettings": {
			"enabled": true,
			"moderate": false
		},
		"wishlist": true,
		"mailOptions": {}
	});
})(angular);
//# sourceMappingURL=app.constant.js.map

'use strict';

angular.module('mediaboxApp').controller('BookCtrl', function ($scope) {
  $scope.options = [{ field: 'image', heading: 'Image', dataType: 'image' }, { field: 'name', title: 'Title', dataType: 'text' }, { field: 'author', dataType: 'text' }, { field: 'category', dataType: 'select', options: ['Fiction', 'Non fiction', 'Inspirational', 'Novel', 'Science', 'Story'] }, { field: 'price', dataType: 'currency' }, { field: 'releaseDate', dataType: 'date' }, { field: 'isbn', heading: 'ISBN', dataType: 'text', noEdit: true }, { field: 'active', heading: 'Availability', dataType: 'boolean' }];
});
//# sourceMappingURL=book.controller.js.map

'use strict';

angular.module('mediaboxApp').config(function ($stateProvider) {
  $stateProvider.state('book', {
    url: '/book',
    templateUrl: 'app/book/book.html',
    controller: 'BookCtrl',
    authenticate: true,
    title: 'Books Management'
  });
});
//# sourceMappingURL=book.js.map

'use strict';

angular.module('mediaboxApp').controller('BrandCtrl', function ($scope) {
  $scope.options = [{ field: 'name' }, { field: 'brand', dataType: 'number', heading: 'ID' }, { field: 'image', dataType: 'image' }, { field: 'active', dataType: 'boolean' }];
});
//# sourceMappingURL=brand.controller.js.map

'use strict';

angular.module('mediaboxApp').config(function ($stateProvider) {
  $stateProvider.state('brand', {
    url: '/brand',
    templateUrl: 'app/brand/brand.html',
    controller: 'BrandCtrl',
    authenticate: 'manager'
  });
});
//# sourceMappingURL=brand.js.map

'use strict';

angular.module('mediaboxApp').controller('BrandMGCtrl', function ($scope) {
  $scope.options = [{ field: 'name' }, { field: 'brand', dataType: 'number', heading: 'ID' }, { field: 'image', dataType: 'image' }, { field: 'active', dataType: 'boolean' }];
});
//# sourceMappingURL=brandmg.controller.js.map

'use strict';

angular.module('mediaboxApp').config(function ($stateProvider) {
  $stateProvider.state('brandmg', {
    url: '/brandmg',
    templateUrl: 'app/brandmg/brandmg.html',
    controller: 'BrandMGCtrl',
    authenticate: 'manager'
  });
});
//# sourceMappingURL=brandmg.js.map

'use strict';

angular.module('mediaboxApp').controller('BrandTVCtrl', function ($scope) {
  $scope.options = [{ field: 'name' }, { field: 'brand', dataType: 'number', heading: 'ID' }, { field: 'image', dataType: 'image' }, { field: 'active', dataType: 'boolean' }];
});
//# sourceMappingURL=brandtv.controller.js.map

'use strict';

angular.module('mediaboxApp').config(function ($stateProvider) {
  $stateProvider.state('brandtv', {
    url: '/brandtv',
    templateUrl: 'app/brandtv/brandtv.html',
    controller: 'BrandTVCtrl',
    authenticate: 'manager'
  });
});
//# sourceMappingURL=brandtv.js.map

'use strict';

angular.module('mediaboxApp').controller('LeftCtrl', function ($scope, $timeout, $mdSidenav, $log) {
  $scope.close = function () {
    // Component lookup should always be available since we are not using `ng-if`
    $mdSidenav('left').close().then(function () {
      $log.debug("close LEFT is done");
    });
  };
}).controller('RightCtrl', function ($scope, $timeout, $mdSidenav, $log) {
  $scope.close = function () {
    // Component lookup should always be available since we are not using `ng-if`
    $mdSidenav('right').close().then(function () {
      $log.debug("close RIGHT is done");
    });
  };
}).controller('CampaignController', function ($scope, Cart, Auth, $log, $mdSidenav, Campaign, $loading, Upload, $timeout, $http, socket, $mdDialog, Settings, Toast) {
  //clear items added to campaign from cart
  //clear items added to campaign from cart
  Cart.cart.clearItems();
  Cart.cart.products = 20;

  Auth.getCurrentUser().photo = {};

  //alert(Auth.getCurrentUser().company);
  ////console.log(Auth.getCurrentUser());


  $loading.start("campaigns");

  ////console.log(Cart);

  var vm = this;
  vm.cart = Cart.cart;

  vm.itemsGrid = [];

  vm.toggleLeft = buildDelayedToggler('left');
  vm.toggleRight = buildToggler('right');
  vm.isOpenRight = function () {
    return $mdSidenav('right').isOpen();
  };
  /**
   * Supplies a function that will continue to operate until the
   * time is up.
   */
  function debounce(func, wait, context) {
    var timer;
    return function debounced() {
      var context = $scope,
          args = Array.prototype.slice.call(arguments);
      $timeout.cancel(timer);
      timer = $timeout(function () {
        timer = undefined;
        func.apply(context, args);
      }, wait || 10);
    };
  }
  /**
   * Build handler to open/close a SideNav; when animation finishes
   * report completion in console
   */
  function buildDelayedToggler(navID) {
    return debounce(function () {
      $mdSidenav(navID).toggle().then(function () {
        $log.debug("toggle " + navID + " is done");
      });
    }, 200);
  }
  function buildToggler(navID) {
    return function () {
      $mdSidenav(navID).toggle().then(function () {
        $log.debug("toggle " + navID + " is done");
      });
    };
  }

  vm.cmp = {};
  vm.campaignStatusLov = Campaign.status;
  vm.campaignStatus = [{ name: '', val: 402 }, { name: 'Avail Check', val: 201 }, { name: 'Buy', val: 202 }];

  vm.mediaLibrary = function (index) {
    $mdDialog.show({
      template: '<md-dialog aria-label="Media Library" ng-cloak flex="95">\n        <md-toolbar class="md-warn">\n          <div class="md-toolbar-tools">\n            <h2>Media Library</h2>\n            <span flex></span>\n            <md-button class="md-icon-button" ng-click="cancel()">\n              <ng-md-icon icon="close" aria-label="Close dialog"></ng-md-icon>\n            </md-button>\n          </div>\n        </md-toolbar>\n\n        <md-dialog-content>\n            <div class="md-dialog-content padding"  class="md-whiteframe-z2">\n                <md-grid-list class="media-list" md-cols-xs ="3" md-cols-sm="4" md-cols-md="5" md-cols-lg="7" md-cols-gt-lg="10" md-row-height-gt-md="1:1" md-row-height="4:3" md-gutter="12px" md-gutter-gt-sm="8px" layout="row" layout-align="center center">\n                  <md-grid-tile ng-repeat="i in media" class="md-whiteframe-z2" ng-click="ok(i.path)">\n                    <div class="thumbnail">\n                        <img ng-src="{{i.path}}" draggable="false" alt="{{i.name}}">\n                    </div>\n                    <md-grid-tile-footer><h3>{{i.name}}</h3></md-grid-tile-footer>\n                  </md-grid-tile>\n                </md-grid-list>\n          </div>\n        </md-dialog-content>\n        <md-dialog-actions layout="row">\n          <span flex></span>\n          <md-button ng-click="addNewImage()" class="md-warn md-raised">\n           Add new Creative\n          </md-button>\n        </md-dialog-actions>\n      </md-dialog>\n',
      controller: function controller($scope, $mdDialog, $http, socket, $state) {
        // Start query the database for the table
        var vm = this;
        $scope.loading = true;
        $http.get('/api/media/').then(function (res) {
          $scope.loading = false;
          $scope.media = res.data;
          socket.syncUpdates('media', $scope.data);
        }, handleError);

        function handleError(error) {
          // error handler
          $scope.loading = false;
          if (error.status === 403) {
            Toast.show({
              type: 'error',
              text: 'Not authorised to make changes.'
            });
          } else {
            Toast.show({
              type: 'error',
              text: error.status
            });
          }
        }
        $scope.ok = function (path) {
          $mdDialog.hide(path);
        };
        $scope.hide = function () {
          $mdDialog.hide();
        };
        $scope.cancel = function () {
          $mdDialog.cancel();
        };
        $scope.addNewImage = function () {
          $state.go('media');
          //vm.save(vm.product)
          $mdDialog.hide();
        };
      }

    }).then(function (answer) {
      //console.log(answer);
      if (index === 1000000) vm.cart.items.push({ size: 'x', creative: answer });else vm.cart.items[index].creative = answer;
    }, function () {});
  };

  vm.imageDetails = function (img) {
    $mdDialog.show({
      template: '\n    <md-dialog aria-label="Image Details Dialog"  ng-cloak>\n  <md-toolbar>\n    <div class="md-toolbar-tools">\n      <h2>Media Details</h2>\n      <span flex></span>\n      <md-button class="md-icon-button" ng-click="cancel()">\n        <ng-md-icon icon="close" aria-label="Close dialog"></ng-md-icon>\n      </md-button>\n    </div>\n  </md-toolbar>\n  <md-dialog-content>\n    <div class="md-dialog-content">\n      <div layout="row" class="md-whiteframe-z2">\n        <div class="flexbox-container">\n          <div>\n            <img ng-src="{{img}}" draggable="false"  class="detail-image"/>\n          </div>\n          </div>\n      </div>\n  </md-dialog-content>\n  <md-dialog-actions layout="row">\n    <span flex></span>\n    <md-button ng-click="delete(img)" class="md-warn">\n     Delete Permanently\n    </md-button>\n  </md-dialog-actions>\n</md-dialog>\n',
      controller: function controller($scope, $mdDialog) {
        $scope.img = img;
        $scope.delete = function (img) {
          var confirm = $mdDialog.confirm().title('Would you like to delete the media permanently?').textContent('Media once deleted can not be undone.').ariaLabel('Delete Media').ok('Please do it!').cancel('Cancel');
          $mdDialog.show(confirm).then(function () {
            $http.delete('/api/media/' + img._id).then(function () {
              $mdDialog.hide();
            }, handleError);
          }, function () {
            $mdDialog.hide();
          });
        };
        $scope.hide = function () {
          $mdDialog.hide();
        };
        $scope.cancel = function () {
          $mdDialog.cancel();
        };
      }
    }).then(function (answer) {
      $scope.alert = 'You said the information was "' + answer + '".';
    }, function () {
      $scope.alert = 'You cancelled the dialog.';
    });
  };

  var qAll = {};
  qAll.where = { 'items.advertiser.email': Auth.getCurrentUser().email };

  vm.campaignsAll = Campaign.my.query(qAll, function (res) {

    var totalCampaign = res.length;

    res.totalCampaign = totalCampaign;
    ////console.log(totalCampaign);
    $loading.finish("campaigns");

    // }
    // res.total = total;
  });

  var qPending = {};
  qPending.where = { $and: [{ 'items.advertiser.email': Auth.getCurrentUser().email }, { 'status': 'Campaign Placed' }] };

  vm.campaignsPending = Campaign.my.query(qPending, function (res) {

    var totalCampaign = res.length;

    res.totalCampaign = totalCampaign;
    ////console.log(totalCampaign);
    $loading.finish("campaigns");

    // }
    // res.total = total;
  });

  var qScheduled = {};
  qScheduled.where = { $and: [{ 'items.advertiser.email': Auth.getCurrentUser().email }, { 'items.startDate': { $gt: Date.now() } }, { 'status': 'Campaign Accepted' }] };

  vm.campaignsScheduled = Campaign.my.query(qScheduled, function (res) {

    var totalCampaign = res.length;

    res.totalCampaign = totalCampaign;
    ////console.log(totalCampaign);
    $loading.finish("campaigns");

    // }
    // res.total = total;
  });

  var qRunning = {};
  qRunning.where = { $and: [{ 'items.advertiser.email': Auth.getCurrentUser().email }, { 'items.startDate': { $lt: Date.now() } }, { 'items.endDate': { $gt: Date.now() } }, { 'status': 'Campaign Accepted' }] };

  vm.campaignsRunning = Campaign.my.query(qRunning, function (res) {

    var totalCampaign = res.length;

    res.totalCampaign = totalCampaign;
    ////console.log(totalCampaign);
    $loading.finish("campaigns");

    // }
    // res.total = total;
  });

  var qFinished = {};
  qFinished.where = { $and: [{ 'items.advertiser.email': Auth.getCurrentUser().email }, { 'items.endDate': { $lt: Date.now() } }, { 'status': 'Campaign Accepted' }] };

  vm.campaignsCompleted = Campaign.my.query(qFinished, function (res) {

    var totalCampaign = res.length;

    res.totalCampaign = totalCampaign;
    ////console.log(totalCampaign);
    $loading.finish("campaigns");

    // }
    // res.total = total;
  });

  vm.getTotal = function (item) {
    // //console.log(item);
    var total = 0;

    for (var i = 0; i < item.items.length; i++) {

      // items[i].total = 0;

      var p = item.items[i].price;
      var q = item.items[i].quantity;
      total += p * q;
      // var x.sub.push(total);
    }
    // //console.log(total);

    return total;
  };

  // alert(Auth.getCurrentUser().email);


  vm.mainGridOptions = {
    dataSource: {

      transport: {
        read: function read(options) {
          //options holds the grids current page and filter settings
          var qPending = {};
          qPending.where = { $and: [{ 'items.advertiser.email': Auth.getCurrentUser().email }, { 'status': 'Campaign Placed' }] };

          Campaign.my.query(qPending, function (res) {

            console.log(res);

            for (var j = 0; j < res.length; j++) {
              var total = 0;
              var item = res[j];
              for (var i = 0; i < item.items.length; i++) {

                var p = item.items[i].price;
                var q = item.items[i].quantity;
                total += p * q;
              }

              res[j].total = total;
            }

            options.success(res);
            ////console.log(res);
          });
        }
      },
      pageSize: 10,
      serverPaging: true,
      serverSorting: true
    },
    toolbar: ['excel', 'pdf'],

    excel: {
      allPages: true,
      proxyURL: "//demos.telerik.com/kendo-ui/service/export",
      fileName: 'Mediabox-campaigns.xlsx',
      filterable: true
    },
    pdf: {
      allPages: true,
      avoidLinks: true,
      paperSize: "A4",
      margin: { top: "2cm", left: "1cm", right: "1cm", bottom: "1cm" },
      landscape: true,
      repeatHeaders: true,
      template: $("#page-template").html(),
      scale: 0.8
    },
    sortable: true,
    pageable: true,
    editable: "popup",

    filterable: true,

    dataBound: function dataBound() {
      this.expandRow(this.tbody.find("tr.k-master-row").first());
    },
    columns: [{ field: "campaignNo", title: "Campaign #" }, { field: "campaignName", title: "Campaign Name" }, { field: "created_at", title: "Date Created", type: 'datetime', template: "#=  (created_at == null)? '' : kendo.toString(kendo.parseDate(created_at, 'yyyy-MM-dd'), 'MM/dd/yy') #" },
    //{ field: "endDate", title: "Start Date-End Date",type: 'datetime',template: "#=  (endDate == null)? '' : kendo.toString(kendo.parseDate(endDate, 'yyyy-MM-dd'), 'MM/dd/yy') #" },
    { field: "status", title: "Status", template: function template(dataItem) {
        return "<div ng-show= \"dataItem.status.val=='305'\" class=\"alert alert-success\"><small>Approved</small></div>" +
        // "<div ng-show=\"!dataItem.creative\" class=\"alert alert-danger\" ><small>Needs Creative</small></div>"+
        "<div  ng-show = \"dataItem.status=='Campaign Placed'\" class=\"alert alert-danger\" ><small>Waiting Response<small></div>" + "<div  ng-show = \"dataItem.status=='Campaign Accepted'\" class=\"alert alert-success\" ><small>Campaign Approved</small> </div>" + "<div  ng-show = \"dataItem.status=='Campaign Rejected'\" class=\"alert alert-danger\" ><small>Campaign Rejected</small> </div>" + "<div  ng-show = \"dataItem.status=='Campaign Completed'\" class=\"alert alert-success\" ><small>Campaign Completed</small> </div>";
      } }, { field: "total", title: "Total", format: "{0:c2}" }]
  };

  vm.detailGridOptions = function (dataItem) {

    return {
      dataSource: {
        filter: { field: "campaignNo", operator: "eq", value: dataItem.campaignNo },
        transport: {
          read: function read(options) {
            //options holds the grids current page and filter settings
            var itemsGrid = [];
            var qPending = {};
            qPending.where = { $and: [{ 'items.advertiser.email': Auth.getCurrentUser().email }, { 'status': 'Campaign Placed' }] };

            Campaign.my.query(qPending, function (res) {

              var totalFinal = 0;
              var totalCampaign = res.length;

              for (var j = 0; j < res.length; j++) {
                var total = 0;

                var item = res[j];
                for (var i = 0; i < item.items.length; i++) {

                  var itemGridTemp = {
                    campaignNo: item.campaignNo,
                    status: item.status,
                    id: item._id,
                    advertiser: item.items[i].advertiser,
                    category: item.items[i].category,
                    creative: item.items[i].creative,
                    image: item.items[i].image,
                    messages: item.items[i].messages,
                    mrp: item.items[i].mrp,
                    name: item.items[i].name,
                    price: item.items[i].price,
                    publisher: item.items[i].publisher,
                    publisheruid: item.items[i].publisheruid,
                    quantity: item.items[i].quantity,
                    request: item.items[i].request,
                    size: item.items[i].size,
                    sku: item.items[i].sku,
                    uid: item.items[i].uid
                  };

                  var p = item.items[i].price;
                  var q = item.items[i].quantity;
                  total += p * q;

                  vm.itemsGrid.push(itemGridTemp);
                }

                res[j].total = total;
              }

              res.totalFinal = total;

              var data = [];
              ////console.log(vm.itemsGrid);
              for (var i = 0; i < vm.itemsGrid.length; i++) {
                var item = vm.itemsGrid[i];
                if (item.campaignNo == dataItem.campaignNo) {
                  //alert(item.campaignNo);
                  data.push(item);
                }

                options.success(data);
                //console.log(data);

                vm.data = [];
              }

              vm.itemsGrid = [];
            });
          }
        },
        serverPaging: true,
        serverSorting: true,
        serverFiltering: true,
        pageSize: 5,
        filterable: true

      },
      scrollable: false,
      sortable: true,

      pageable: true,
      columns: [
      //{ field: "campaignNo", title:"Campaign #", width: "70px" },
      //{ field: "publisher", title:"Publisher", width: "100px" },
      // { field: "category", title:"Category", width: "50px" },
      { field: "name", title: "Name", width: "80px" }, { field: "category", title: "Start - End Date", width: "60px" }, { field: "price", title: "Price", width: "50px", format: "{0:c2}" }, { field: "quantity", title: "Inserts", width: "30px" },
      //    { 

      //    title: "Status",
      //     width: "40px",
      //      template: function (dataItem) {
      //          return "<div ng-show= \"dataItem.status.val=='305'\" class=\"alert alert-success\"><small>Approved</small></div>"+
      //         // "<div ng-show=\"!dataItem.creative\" class=\"alert alert-danger\" ><small>Needs Creative</small></div>"+
      //          "<div  ng-show = \"dataItem.status.val=='402'\" class=\"alert alert-danger\" ><small>Pending<small></div>"+
      //         "<div  ng-show = \"dataItem.status.val=='300'\" class=\"alert alert-success\" ><small>Ready</small> </div>"+
      //          "<div  ng-show = \"dataItem.status.val=='500'\" class=\"alert alert-danger\" ><small>Rejected</small> </div>"+
      //            "<div  ng-show = \"dataItem.status.val=='309'\" class=\"alert alert-success\" ><small>Completed</small> </div>";
      //     } 
      // },
      {
        field: "creative",
        title: "Creative",
        width: "20px",
        template: function template(dataItem) {
          return "<div ng-hide=\"dataItem.creative\">" + "<button  class=\"btn btn-danger\" ng-hide=\"isAdmin()\" ng-click=\"vm.mediaLibrary(dataItem)\" ><i class=\"fa fa-image\"></i><span class=\"glyphicon glyphicon-upload\"></span></button></div>" + "</div>" + "<div ng-show=\"dataItem.creative\">" + "<button  class=\"btn btn-success\" ng-hide=\"isAdmin()\" ng-click=\"vm.imageDetails(dataItem.creative)\" ><i class=\"fa fa-image\"></i><span class=\"glyphicon glyphicon-upload\"></span></button></div>" + "</div>";
          //return "<div> <button  class=\"btn btn-danger\"  ng-click=\"vm.open(cart.items,item,item.creative,'md')\" ><i class=\"fa fa-image\"></i><span class=\"glyphicon glyphicon-upload\"></span></button></div>";
        } }, {
        title: "Action",
        width: "40px",
        template: function template(dataItem) {
          return "<div  ng-show= \"dataItem.status=='Campaign Accepted'\" ><md-button ng-click=\"vm.addToCart({'sku':dataItem.id, 'name':dataItem.name ,'advertiser':dataItem.advertiser,'publisher':dataItem.publisher,'publisheruid':dataItem.publisheruid,'price':dataItem.price, 'quantity':dataItem.quantity,'image':dataItem.image,  'vid':dataItem.id} ,dataItem.quantity)\" class=\"md-raised cart\">" + "<ng-md-icon icon=\"shopping_cart\"></ng-md-icon>" + "</div>";
          // return "<button class=\"btn-success btn-sm btn-success\" ng-click=\"goToSite(site)\">Buy</button>";
        } }]
    };
  };

  vm.action = function (campaign) {
    // method
    ////console.log(campaign);
    Campaign.delete({ id: campaign._id }, function () {
      ////console.log("Campaign deleted");

      Campaign.save(campaign).$promise.then(function () {
        toastr.success("Campaign info saved successfully", "Success");
      });
    });
  };

  vm.changeStatus = function (campaign) {

    Campaign.update({ id: campaign._id }, campaign).$promise.then(function (res) {
      ////console.log(res);
    }, function (error) {
      // error handler
      ////console.log(error);
      if (error.data.errors) {
        var err = error.data.errors;
        toastr.error(err[Object.keys(err)].message, err[Object.keys(err)].name);
      } else {
        var msg = error.data.message;
        toastr.error(msg);
      }
    });
  };

  vm.addToCart = function (item, i) {

    Cart.cart.addItem(item, i);
    Cart.cart.flagOn();

    Toast.show({
      type: 'success',
      text: item.publisher + "-" + item.name + "" + "Has Been Added to Cart"
    });
  };

  var toNumber = function toNumber(value) {
    value = value * 1;
    return isNaN(value) ? 0 : value;
  };
});
//# sourceMappingURL=campaign.controller.js.map

'use strict';

angular.module('mediaboxApp').config(function ($stateProvider) {
  $stateProvider.state('campaign', {
    url: '/campaign',
    templateUrl: 'app/campaign/campaign.html',
    controller: 'CampaignController as campaign',
    authenticate: true
  });
});
//# sourceMappingURL=campaign.js.map

'use strict';

angular.module('mediaboxApp').controller('CampaignCompletedController', function ($scope, Cart, Auth, $log, $mdSidenav, Campaign, $loading, Upload, $timeout, $http, socket, $mdDialog, Settings, Toast) {
  //clear items added to campaign from cart
  //clear items added to campaign from cart
  Cart.cart.clearItems();
  Cart.cart.products = 20;

  Auth.getCurrentUser().photo = {};

  //alert(Auth.getCurrentUser().company);
  ////console.log(Auth.getCurrentUser());


  $loading.start("campaigns");

  ////console.log(Cart);

  var vm = this;
  vm.cart = Cart.cart;

  vm.itemsGrid = [];

  vm.toggleLeft = buildDelayedToggler('left');
  vm.toggleRight = buildToggler('right');
  vm.isOpenRight = function () {
    return $mdSidenav('right').isOpen();
  };
  /**
   * Supplies a function that will continue to operate until the
   * time is up.
   */
  function debounce(func, wait, context) {
    var timer;
    return function debounced() {
      var context = $scope,
          args = Array.prototype.slice.call(arguments);
      $timeout.cancel(timer);
      timer = $timeout(function () {
        timer = undefined;
        func.apply(context, args);
      }, wait || 10);
    };
  }
  /**
   * Build handler to open/close a SideNav; when animation finishes
   * report completion in console
   */
  function buildDelayedToggler(navID) {
    return debounce(function () {
      $mdSidenav(navID).toggle().then(function () {
        $log.debug("toggle " + navID + " is done");
      });
    }, 200);
  }
  function buildToggler(navID) {
    return function () {
      $mdSidenav(navID).toggle().then(function () {
        $log.debug("toggle " + navID + " is done");
      });
    };
  }

  vm.cmp = {};
  vm.campaignStatusLov = Campaign.status;
  vm.campaignStatus = [{ name: '', val: 402 }, { name: 'Avail Check', val: 201 }, { name: 'Buy', val: 202 }];

  vm.mediaLibrary = function (index) {
    $mdDialog.show({
      template: '<md-dialog aria-label="Media Library" ng-cloak flex="95">\n        <md-toolbar class="md-warn">\n          <div class="md-toolbar-tools">\n            <h2>Media Library</h2>\n            <span flex></span>\n            <md-button class="md-icon-button" ng-click="cancel()">\n              <ng-md-icon icon="close" aria-label="Close dialog"></ng-md-icon>\n            </md-button>\n          </div>\n        </md-toolbar>\n\n        <md-dialog-content>\n            <div class="md-dialog-content padding"  class="md-whiteframe-z2">\n                <md-grid-list class="media-list" md-cols-xs ="3" md-cols-sm="4" md-cols-md="5" md-cols-lg="7" md-cols-gt-lg="10" md-row-height-gt-md="1:1" md-row-height="4:3" md-gutter="12px" md-gutter-gt-sm="8px" layout="row" layout-align="center center">\n                  <md-grid-tile ng-repeat="i in media" class="md-whiteframe-z2" ng-click="ok(i.path)">\n                    <div class="thumbnail">\n                        <img ng-src="{{i.path}}" draggable="false" alt="{{i.name}}">\n                    </div>\n                    <md-grid-tile-footer><h3>{{i.name}}</h3></md-grid-tile-footer>\n                  </md-grid-tile>\n                </md-grid-list>\n          </div>\n        </md-dialog-content>\n        <md-dialog-actions layout="row">\n          <span flex></span>\n          <md-button ng-click="addNewImage()" class="md-warn md-raised">\n           Add new Creative\n          </md-button>\n        </md-dialog-actions>\n      </md-dialog>\n',
      controller: function controller($scope, $mdDialog, $http, socket, $state) {
        // Start query the database for the table
        var vm = this;
        $scope.loading = true;
        $http.get('/api/media/').then(function (res) {
          $scope.loading = false;
          $scope.media = res.data;
          socket.syncUpdates('media', $scope.data);
        }, handleError);

        function handleError(error) {
          // error handler
          $scope.loading = false;
          if (error.status === 403) {
            Toast.show({
              type: 'error',
              text: 'Not authorised to make changes.'
            });
          } else {
            Toast.show({
              type: 'error',
              text: error.status
            });
          }
        }
        $scope.ok = function (path) {
          $mdDialog.hide(path);
        };
        $scope.hide = function () {
          $mdDialog.hide();
        };
        $scope.cancel = function () {
          $mdDialog.cancel();
        };
        $scope.addNewImage = function () {
          $state.go('media');
          //vm.save(vm.product)
          $mdDialog.hide();
        };
      }

    }).then(function (answer) {
      //console.log(answer);
      if (index === 1000000) vm.cart.items.push({ size: 'x', creative: answer });else vm.cart.items[index].creative = answer;
    }, function () {});
  };

  vm.imageDetails = function (img) {
    $mdDialog.show({
      template: '\n    <md-dialog aria-label="Image Details Dialog"  ng-cloak>\n  <md-toolbar>\n    <div class="md-toolbar-tools">\n      <h2>Media Details</h2>\n      <span flex></span>\n      <md-button class="md-icon-button" ng-click="cancel()">\n        <ng-md-icon icon="close" aria-label="Close dialog"></ng-md-icon>\n      </md-button>\n    </div>\n  </md-toolbar>\n  <md-dialog-content>\n    <div class="md-dialog-content">\n      <div layout="row" class="md-whiteframe-z2">\n        <div class="flexbox-container">\n          <div>\n            <img ng-src="{{img}}" draggable="false"  class="detail-image"/>\n          </div>\n          </div>\n      </div>\n  </md-dialog-content>\n  <md-dialog-actions layout="row">\n    <span flex></span>\n    <md-button ng-click="delete(img)" class="md-warn">\n     Delete Permanently\n    </md-button>\n  </md-dialog-actions>\n</md-dialog>\n',
      controller: function controller($scope, $mdDialog) {
        $scope.img = img;
        $scope.delete = function (img) {
          var confirm = $mdDialog.confirm().title('Would you like to delete the media permanently?').textContent('Media once deleted can not be undone.').ariaLabel('Delete Media').ok('Please do it!').cancel('Cancel');
          $mdDialog.show(confirm).then(function () {
            $http.delete('/api/media/' + img._id).then(function () {
              $mdDialog.hide();
            }, handleError);
          }, function () {
            $mdDialog.hide();
          });
        };
        $scope.hide = function () {
          $mdDialog.hide();
        };
        $scope.cancel = function () {
          $mdDialog.cancel();
        };
      }
    }).then(function (answer) {
      $scope.alert = 'You said the information was "' + answer + '".';
    }, function () {
      $scope.alert = 'You cancelled the dialog.';
    });
  };

  vm.campaignsAll = Campaign.my.query({}, function (res) {

    var totalCampaign = res.length;

    res.totalCampaign = totalCampaign;
    ////console.log(totalCampaign);
    $loading.finish("campaigns");

    // }
    // res.total = total;
  });

  var qPending = {};
  qPending.where = { $and: [{ 'items.advertiser.email': Auth.getCurrentUser().email }, { 'status': 'Campaign Placed' }] };

  vm.campaignsPending = Campaign.my.query(qPending, function (res) {

    var totalCampaign = res.length;

    res.totalCampaign = totalCampaign;
    ////console.log(totalCampaign);
    $loading.finish("campaigns");

    // }
    // res.total = total;
  });

  var qScheduled = {};
  qScheduled.where = { $and: [{ 'items.advertiser.email': Auth.getCurrentUser().email }, { 'items.startDate': { $gt: Date.now() } }, { 'status': 'Campaign Accepted' }] };

  vm.campaignsScheduled = Campaign.my.query(qScheduled, function (res) {

    var totalCampaign = res.length;

    res.totalCampaign = totalCampaign;
    ////console.log(totalCampaign);
    $loading.finish("campaigns");

    // }
    // res.total = total;
  });

  var qRunning = {};
  qRunning.where = { $and: [{ 'items.advertiser.email': Auth.getCurrentUser().email }, { 'items.startDate': { $lt: Date.now() } }, { 'items.endDate': { $gt: Date.now() } }, { 'status': 'Campaign Accepted' }] };

  vm.campaignsRunning = Campaign.my.query(qRunning, function (res) {

    var totalCampaign = res.length;

    res.totalCampaign = totalCampaign;
    ////console.log(totalCampaign);
    $loading.finish("campaigns");

    // }
    // res.total = total;
  });

  var qFinished = {};
  qFinished.where = { $and: [{ 'items.advertiser.email': Auth.getCurrentUser().email }, { 'items.endDate': { $lt: Date.now() } }, { 'status': 'Campaign Completed' }] };

  vm.campaignsCompleted = Campaign.my.query(qFinished, function (res) {

    var totalCampaign = res.length;

    res.totalCampaign = totalCampaign;
    ////console.log(totalCampaign);
    $loading.finish("campaigns");

    // }
    // res.total = total;
  });

  vm.getTotal = function (item) {
    // //console.log(item);
    var total = 0;

    for (var i = 0; i < item.items.length; i++) {

      // items[i].total = 0;

      var p = item.items[i].price;
      var q = item.items[i].quantity;
      total += p * q;
      // var x.sub.push(total);
    }
    // //console.log(total);

    return total;
  };

  // alert(Auth.getCurrentUser().email);


  vm.mainGridOptions = {
    dataSource: {

      transport: {
        read: function read(options) {
          //options holds the grids current page and filter settings
          var itemsGrid = [];
          var qFinished = {};
          qFinished.where = { $and: [{ 'items.advertiser.email': Auth.getCurrentUser().email }, { 'items.endDate': { $lt: Date.now() } }, { 'status': 'Campaign Accepted' }] };
          Campaign.my.query(qFinished, function (res) {

            console.log(res);

            for (var j = 0; j < res.length; j++) {
              var total = 0;
              var item = res[j];
              for (var i = 0; i < item.items.length; i++) {

                var p = item.items[i].price;
                var q = item.items[i].quantity;
                total += p * q;
              }

              res[j].total = total;
            }

            options.success(res);
            ////console.log(res);
          });
        }
      },
      pageSize: 10,
      serverPaging: true,
      serverSorting: true
    },
    toolbar: ['excel', 'pdf'],

    excel: {
      allPages: true,
      proxyURL: "//demos.telerik.com/kendo-ui/service/export",
      fileName: 'Mediabox-campaigns.xlsx',
      filterable: true
    },
    pdf: {
      allPages: true,
      avoidLinks: true,
      paperSize: "A4",
      margin: { top: "2cm", left: "1cm", right: "1cm", bottom: "1cm" },
      landscape: true,
      repeatHeaders: true,
      template: $("#page-template").html(),
      scale: 0.8
    },
    sortable: true,
    pageable: true,
    editable: "popup",

    filterable: true,

    dataBound: function dataBound() {
      this.expandRow(this.tbody.find("tr.k-master-row").first());
    },
    columns: [
    //{ field: "campaignNo", title: "Campaign ID" },
    { field: "campaignName", title: "Campaign Name" }, { field: "created_at", title: "Date Created", type: 'datetime', template: "#=  (created_at == null)? '' : kendo.toString(kendo.parseDate(created_at, 'yyyy-MM-dd'), 'MM/dd/yy') #" },
    //{ field: "endDate", title: "Start Date-End Date",type: 'datetime',template: "#=  (endDate == null)? '' : kendo.toString(kendo.parseDate(endDate, 'yyyy-MM-dd'), 'MM/dd/yy') #" },
    { field: "status", title: "Status", template: function template(dataItem) {
        return "<div ng-show= \"dataItem.status.val=='305'\" class=\"alert alert-success\"><small>Approved</small></div>" +
        // "<div ng-show=\"!dataItem.creative\" class=\"alert alert-danger\" ><small>Needs Creative</small></div>"+
        "<div  ng-show = \"dataItem.status=='Campaign Placed'\" class=\"alert alert-danger\" ><small>Waiting Response<small></div>" + "<div  ng-show = \"dataItem.status=='Campaign Accepted'\" class=\"alert alert-success\" ><small>Campaign Approved</small> </div>" + "<div  ng-show = \"dataItem.status=='Campaign Rejected'\" class=\"alert alert-danger\" ><small>Campaign Rejected</small> </div>" + "<div  ng-show = \"dataItem.status=='Campaign Completed'\" class=\"alert alert-success\" ><small>Campaign Completed</small> </div>";
      } }, { field: "total", title: "Total", format: "{0:c2}" }]
  };

  vm.detailGridOptions = function (dataItem) {

    return {
      dataSource: {
        filter: { field: "campaignNo", operator: "eq", value: dataItem.campaignNo },
        transport: {
          read: function read(options) {
            //options holds the grids current page and filter settings
            var itemsGrid = [];
            var qFinished = {};
            qFinished.where = { $and: [{ 'items.advertiser.email': Auth.getCurrentUser().email }, { 'items.endDate': { $lt: Date.now() } }, { 'status': 'Campaign Accepted' }] };
            Campaign.my.query(qFinished, function (res) {
              ////console.log(res);


              var totalFinal = 0;
              var totalCampaign = res.length;

              for (var j = 0; j < res.length; j++) {
                var total = 0;

                var item = res[j];
                for (var i = 0; i < item.items.length; i++) {

                  var itemGridTemp = {
                    campaignNo: item.campaignNo,
                    status: item.status,
                    id: item._id,
                    advertiser: item.items[i].advertiser,
                    category: item.items[i].category,
                    creative: item.items[i].creative,
                    image: item.items[i].image,
                    messages: item.items[i].messages,
                    mrp: item.items[i].mrp,
                    name: item.items[i].name,
                    price: item.items[i].price,
                    publisher: item.items[i].publisher,
                    publisheruid: item.items[i].publisheruid,
                    quantity: item.items[i].quantity,
                    request: item.items[i].request,
                    size: item.items[i].size,
                    sku: item.items[i].sku,
                    uid: item.items[i].uid
                  };

                  var p = item.items[i].price;
                  var q = item.items[i].quantity;
                  total += p * q;

                  vm.itemsGrid.push(itemGridTemp);
                }

                res[j].total = total;
              }

              res.totalFinal = total;

              var data = [];
              ////console.log(vm.itemsGrid);
              for (var i = 0; i < vm.itemsGrid.length; i++) {
                var item = vm.itemsGrid[i];
                if (item.campaignNo == dataItem.campaignNo) {
                  //alert(item.campaignNo);
                  data.push(item);
                }

                options.success(data);
                //console.log(data);

                vm.data = [];
              }

              vm.itemsGrid = [];
            });
          }
        },
        serverPaging: true,
        serverSorting: true,
        serverFiltering: true,
        pageSize: 5,
        filterable: true

      },
      scrollable: false,
      sortable: true,

      pageable: true,
      columns: [{ field: "campaignNo", title: "Campaign #", width: "70px" },
      //{ field: "publisher", title:"Publisher", width: "100px" },
      // { field: "category", title:"Category", width: "50px" },
      { field: "name", title: "Name", width: "80px" }, { field: "category", title: "Start - End Date", width: "60px" }, { field: "price", title: "Price", width: "50px", format: "{0:c2}" }, { field: "quantity", title: "Inserts", width: "30px" },
      //    { 

      //    title: "Status",
      //     width: "40px",
      //      template: function (dataItem) {
      //          return "<div ng-show= \"dataItem.status.val=='305'\" class=\"alert alert-success\"><small>Approved</small></div>"+
      //         // "<div ng-show=\"!dataItem.creative\" class=\"alert alert-danger\" ><small>Needs Creative</small></div>"+
      //          "<div  ng-show = \"dataItem.status.val=='402'\" class=\"alert alert-danger\" ><small>Pending<small></div>"+
      //         "<div  ng-show = \"dataItem.status.val=='300'\" class=\"alert alert-success\" ><small>Ready</small> </div>"+
      //          "<div  ng-show = \"dataItem.status.val=='500'\" class=\"alert alert-danger\" ><small>Rejected</small> </div>"+
      //            "<div  ng-show = \"dataItem.status.val=='309'\" class=\"alert alert-success\" ><small>Completed</small> </div>";
      //     } 
      // },
      {
        field: "creative",
        title: "Creative",
        width: "20px",
        template: function template(dataItem) {
          return "<div ng-hide=\"dataItem.creative\">" + "<button  class=\"btn btn-danger\" ng-hide=\"isAdmin()\" ng-click=\"vm.mediaLibrary(dataItem)\" ><i class=\"fa fa-image\"></i><span class=\"glyphicon glyphicon-upload\"></span></button></div>" + "</div>" + "<div ng-show=\"dataItem.creative\">" + "<button  class=\"btn btn-success\" ng-hide=\"isAdmin()\" ng-click=\"vm.imageDetails(dataItem.creative)\" ><i class=\"fa fa-image\"></i><span class=\"glyphicon glyphicon-upload\"></span></button></div>" + "</div>";
          //return "<div> <button  class=\"btn btn-danger\"  ng-click=\"vm.open(cart.items,item,item.creative,'md')\" ><i class=\"fa fa-image\"></i><span class=\"glyphicon glyphicon-upload\"></span></button></div>";
        } }, {
        title: "Action",
        width: "40px",
        template: function template(dataItem) {
          return "<div  ng-show= \"dataItem.status=='Campaign Accepted'\" ><md-button ng-click=\"vm.addToCart({'sku':dataItem.id, 'name':dataItem.name ,'advertiser':dataItem.advertiser,'publisher':dataItem.publisher,'publisheruid':dataItem.publisheruid,'price':dataItem.price, 'quantity':dataItem.quantity,'image':dataItem.image,  'vid':dataItem.id} ,dataItem.quantity)\" class=\"md-raised cart\">" + "<ng-md-icon icon=\"shopping_cart\"></ng-md-icon>" + "</div>";
          // return "<button class=\"btn-success btn-sm btn-success\" ng-click=\"goToSite(site)\">Buy</button>";
        } }]
    };
  };

  vm.action = function (campaign) {
    // method
    ////console.log(campaign);
    Campaign.delete({ id: campaign._id }, function () {
      ////console.log("Campaign deleted");

      Campaign.save(campaign).$promise.then(function () {
        toastr.success("Campaign info saved successfully", "Success");
      });
    });
  };

  vm.changeStatus = function (campaign) {

    Campaign.update({ id: campaign._id }, campaign).$promise.then(function (res) {
      ////console.log(res);
    }, function (error) {
      // error handler
      ////console.log(error);
      if (error.data.errors) {
        var err = error.data.errors;
        toastr.error(err[Object.keys(err)].message, err[Object.keys(err)].name);
      } else {
        var msg = error.data.message;
        toastr.error(msg);
      }
    });
  };

  vm.addToCart = function (item, i) {

    Cart.cart.addItem(item, i);
    Cart.cart.flagOn();

    Toast.show({
      type: 'success',
      text: item.publisher + "-" + item.name + "" + "Has Been Added to Cart"
    });
  };

  var toNumber = function toNumber(value) {
    value = value * 1;
    return isNaN(value) ? 0 : value;
  };
});
//# sourceMappingURL=campaignCompleted.controller.js.map

'use strict';

angular.module('mediaboxApp').controller('CampaignRunningController', function ($scope, Cart, Auth, $log, $mdSidenav, Campaign, $loading, Upload, $timeout, $http, socket, $mdDialog, Settings, Toast) {
  //clear items added to campaign from cart
  //clear items added to campaign from cart
  Cart.cart.clearItems();
  Cart.cart.products = 20;

  Auth.getCurrentUser().photo = {};

  //alert(Auth.getCurrentUser().company);
  ////console.log(Auth.getCurrentUser());


  $loading.start("campaigns");

  ////console.log(Cart);

  var vm = this;
  vm.cart = Cart.cart;

  vm.itemsGrid = [];

  vm.toggleLeft = buildDelayedToggler('left');
  vm.toggleRight = buildToggler('right');
  vm.isOpenRight = function () {
    return $mdSidenav('right').isOpen();
  };
  /**
   * Supplies a function that will continue to operate until the
   * time is up.
   */
  function debounce(func, wait, context) {
    var timer;
    return function debounced() {
      var context = $scope,
          args = Array.prototype.slice.call(arguments);
      $timeout.cancel(timer);
      timer = $timeout(function () {
        timer = undefined;
        func.apply(context, args);
      }, wait || 10);
    };
  }
  /**
   * Build handler to open/close a SideNav; when animation finishes
   * report completion in console
   */
  function buildDelayedToggler(navID) {
    return debounce(function () {
      $mdSidenav(navID).toggle().then(function () {
        $log.debug("toggle " + navID + " is done");
      });
    }, 200);
  }
  function buildToggler(navID) {
    return function () {
      $mdSidenav(navID).toggle().then(function () {
        $log.debug("toggle " + navID + " is done");
      });
    };
  }

  vm.cmp = {};
  vm.campaignStatusLov = Campaign.status;
  vm.campaignStatus = [{ name: '', val: 402 }, { name: 'Avail Check', val: 201 }, { name: 'Buy', val: 202 }];

  vm.mediaLibrary = function (index) {
    $mdDialog.show({
      template: '<md-dialog aria-label="Media Library" ng-cloak flex="95">\n        <md-toolbar class="md-warn">\n          <div class="md-toolbar-tools">\n            <h2>Media Library</h2>\n            <span flex></span>\n            <md-button class="md-icon-button" ng-click="cancel()">\n              <ng-md-icon icon="close" aria-label="Close dialog"></ng-md-icon>\n            </md-button>\n          </div>\n        </md-toolbar>\n\n        <md-dialog-content>\n            <div class="md-dialog-content padding"  class="md-whiteframe-z2">\n                <md-grid-list class="media-list" md-cols-xs ="3" md-cols-sm="4" md-cols-md="5" md-cols-lg="7" md-cols-gt-lg="10" md-row-height-gt-md="1:1" md-row-height="4:3" md-gutter="12px" md-gutter-gt-sm="8px" layout="row" layout-align="center center">\n                  <md-grid-tile ng-repeat="i in media" class="md-whiteframe-z2" ng-click="ok(i.path)">\n                    <div class="thumbnail">\n                        <img ng-src="{{i.path}}" draggable="false" alt="{{i.name}}">\n                    </div>\n                    <md-grid-tile-footer><h3>{{i.name}}</h3></md-grid-tile-footer>\n                  </md-grid-tile>\n                </md-grid-list>\n          </div>\n        </md-dialog-content>\n        <md-dialog-actions layout="row">\n          <span flex></span>\n          <md-button ng-click="addNewImage()" class="md-warn md-raised">\n           Add new Creative\n          </md-button>\n        </md-dialog-actions>\n      </md-dialog>\n',
      controller: function controller($scope, $mdDialog, $http, socket, $state) {
        // Start query the database for the table
        var vm = this;
        $scope.loading = true;
        $http.get('/api/media/').then(function (res) {
          $scope.loading = false;
          $scope.media = res.data;
          socket.syncUpdates('media', $scope.data);
        }, handleError);

        function handleError(error) {
          // error handler
          $scope.loading = false;
          if (error.status === 403) {
            Toast.show({
              type: 'error',
              text: 'Not authorised to make changes.'
            });
          } else {
            Toast.show({
              type: 'error',
              text: error.status
            });
          }
        }
        $scope.ok = function (path) {
          $mdDialog.hide(path);
        };
        $scope.hide = function () {
          $mdDialog.hide();
        };
        $scope.cancel = function () {
          $mdDialog.cancel();
        };
        $scope.addNewImage = function () {
          $state.go('media');
          //vm.save(vm.product)
          $mdDialog.hide();
        };
      }

    }).then(function (answer) {
      //console.log(answer);
      if (index === 1000000) vm.cart.items.push({ size: 'x', creative: answer });else vm.cart.items[index].creative = answer;
    }, function () {});
  };

  vm.imageDetails = function (img) {
    $mdDialog.show({
      template: '\n    <md-dialog aria-label="Image Details Dialog"  ng-cloak>\n  <md-toolbar>\n    <div class="md-toolbar-tools">\n      <h2>Media Details</h2>\n      <span flex></span>\n      <md-button class="md-icon-button" ng-click="cancel()">\n        <ng-md-icon icon="close" aria-label="Close dialog"></ng-md-icon>\n      </md-button>\n    </div>\n  </md-toolbar>\n  <md-dialog-content>\n    <div class="md-dialog-content">\n      <div layout="row" class="md-whiteframe-z2">\n        <div class="flexbox-container">\n          <div>\n            <img ng-src="{{img}}" draggable="false"  class="detail-image"/>\n          </div>\n          </div>\n      </div>\n  </md-dialog-content>\n  <md-dialog-actions layout="row">\n    <span flex></span>\n    <md-button ng-click="delete(img)" class="md-warn">\n     Delete Permanently\n    </md-button>\n  </md-dialog-actions>\n</md-dialog>\n',
      controller: function controller($scope, $mdDialog) {
        $scope.img = img;
        $scope.delete = function (img) {
          var confirm = $mdDialog.confirm().title('Would you like to delete the media permanently?').textContent('Media once deleted can not be undone.').ariaLabel('Delete Media').ok('Please do it!').cancel('Cancel');
          $mdDialog.show(confirm).then(function () {
            $http.delete('/api/media/' + img._id).then(function () {
              $mdDialog.hide();
            }, handleError);
          }, function () {
            $mdDialog.hide();
          });
        };
        $scope.hide = function () {
          $mdDialog.hide();
        };
        $scope.cancel = function () {
          $mdDialog.cancel();
        };
      }
    }).then(function (answer) {
      $scope.alert = 'You said the information was "' + answer + '".';
    }, function () {
      $scope.alert = 'You cancelled the dialog.';
    });
  };

  vm.campaignsAll = Campaign.my.query({}, function (res) {

    var totalCampaign = res.length;

    res.totalCampaign = totalCampaign;
    ////console.log(totalCampaign);
    $loading.finish("campaigns");

    // }
    // res.total = total;
  });

  var qPending = {};
  qPending.where = { $and: [{ 'items.advertiser.email': Auth.getCurrentUser().email }, { 'status': 'Campaign Placed' }] };

  vm.campaignsPending = Campaign.my.query(qPending, function (res) {

    var totalCampaign = res.length;

    res.totalCampaign = totalCampaign;
    ////console.log(totalCampaign);
    $loading.finish("campaigns");

    // }
    // res.total = total;
  });

  var qScheduled = {};
  qScheduled.where = { $and: [{ 'items.advertiser.email': Auth.getCurrentUser().email }, { 'items.startDate': { $gt: Date.now() } }, { 'status': 'Campaign Accepted' }] };

  vm.campaignsScheduled = Campaign.my.query(qScheduled, function (res) {

    var totalCampaign = res.length;

    res.totalCampaign = totalCampaign;
    ////console.log(totalCampaign);
    $loading.finish("campaigns");

    // }
    // res.total = total;
  });

  var qRunning = {};
  qRunning.where = { $and: [{ 'items.advertiser.email': Auth.getCurrentUser().email }, { 'items.startDate': { $lt: Date.now() } }, { 'items.endDate': { $gt: Date.now() } }, { 'status': 'Campaign Accepted' }] };

  vm.campaignsRunning = Campaign.my.query(qRunning, function (res) {

    var totalCampaign = res.length;

    res.totalCampaign = totalCampaign;
    ////console.log(totalCampaign);
    $loading.finish("campaigns");

    // }
    // res.total = total;
  });

  var qFinished = {};
  qFinished.where = { $and: [{ 'items.advertiser.email': Auth.getCurrentUser().email }, { 'items.endDate': { $lt: Date.now() } }, { 'status': 'Campaign Completed' }] };

  vm.campaignsCompleted = Campaign.my.query(qFinished, function (res) {

    var totalCampaign = res.length;

    res.totalCampaign = totalCampaign;
    ////console.log(totalCampaign);
    $loading.finish("campaigns");

    // }
    // res.total = total;
  });

  vm.getTotal = function (item) {
    // //console.log(item);
    var total = 0;

    for (var i = 0; i < item.items.length; i++) {

      // items[i].total = 0;

      var p = item.items[i].price;
      var q = item.items[i].quantity;
      total += p * q;
      // var x.sub.push(total);
    }
    // //console.log(total);

    return total;
  };

  // alert(Auth.getCurrentUser().email);


  vm.mainGridOptions = {
    dataSource: {

      transport: {
        read: function read(options) {
          var qRunning = {};
          qRunning.where = { $and: [{ 'items.advertiser.email': Auth.getCurrentUser().email }, { 'items.startDate': { $lt: Date.now() } }, { 'items.endDate': { $gt: Date.now() } }, { 'status': 'Campaign Accepted' }] };

          Campaign.my.query(qRunning, function (res) {

            console.log(res);

            for (var j = 0; j < res.length; j++) {
              var total = 0;
              var item = res[j];
              for (var i = 0; i < item.items.length; i++) {

                var p = item.items[i].price;
                var q = item.items[i].quantity;
                total += p * q;
              }

              res[j].total = total;
            }

            options.success(res);
            ////console.log(res);
          });
        }
      },
      pageSize: 10,
      serverPaging: true,
      serverSorting: true
    },
    toolbar: ['excel', 'pdf'],

    excel: {
      allPages: true,
      proxyURL: "//demos.telerik.com/kendo-ui/service/export",
      fileName: 'Mediabox-campaigns.xlsx',
      filterable: true
    },
    pdf: {
      allPages: true,
      avoidLinks: true,
      paperSize: "A4",
      margin: { top: "2cm", left: "1cm", right: "1cm", bottom: "1cm" },
      landscape: true,
      repeatHeaders: true,
      template: $("#page-template").html(),
      scale: 0.8
    },
    sortable: true,
    pageable: true,
    editable: "popup",

    filterable: true,

    dataBound: function dataBound() {
      this.expandRow(this.tbody.find("tr.k-master-row").first());
    },
    columns: [{ field: "campaignNo", title: "Campaign #" }, { field: "campaignName", title: "Campaign Name" }, { field: "created_at", title: "Date Created", type: 'datetime', template: "#=  (created_at == null)? '' : kendo.toString(kendo.parseDate(created_at, 'yyyy-MM-dd'), 'MM/dd/yy') #" },
    //{ field: "endDate", title: "Start Date-End Date",type: 'datetime',template: "#=  (endDate == null)? '' : kendo.toString(kendo.parseDate(endDate, 'yyyy-MM-dd'), 'MM/dd/yy') #" },
    { field: "status", title: "Status", template: function template(dataItem) {
        return "<div ng-show= \"dataItem.status.val=='305'\" class=\"alert alert-success\"><small>Approved</small></div>" +
        // "<div ng-show=\"!dataItem.creative\" class=\"alert alert-danger\" ><small>Needs Creative</small></div>"+
        "<div  ng-show = \"dataItem.status=='Campaign Placed'\" class=\"alert alert-danger\" ><small>Waiting Response<small></div>" + "<div  ng-show = \"dataItem.status=='Campaign Accepted'\" class=\"alert alert-success\" ><small>Campaign Approved</small> </div>" + "<div  ng-show = \"dataItem.status=='Campaign Rejected'\" class=\"alert alert-danger\" ><small>Campaign Rejected</small> </div>" + "<div  ng-show = \"dataItem.status=='Campaign Completed'\" class=\"alert alert-success\" ><small>Campaign Completed</small> </div>";
      } }, { field: "total", title: "Total", format: "{0:c2}" }]
  };

  vm.detailGridOptions = function (dataItem) {

    return {
      dataSource: {
        filter: { field: "campaignNo", operator: "eq", value: dataItem.campaignNo },
        transport: {
          read: function read(options) {
            //options holds the grids current page and filter settings
            var itemsGrid = [];
            var qRunning = {};
            qRunning.where = { $and: [{ 'items.advertiser.email': Auth.getCurrentUser().email }, { 'items.startDate': { $lt: Date.now() } }, { 'items.endDate': { $gt: Date.now() } }, { 'status': 'Campaign Accepted' }] };
            Campaign.my.query(qRunning, function (res) {
              ////console.log(res);


              var totalFinal = 0;
              var totalCampaign = res.length;

              for (var j = 0; j < res.length; j++) {
                var total = 0;

                var item = res[j];
                for (var i = 0; i < item.items.length; i++) {

                  var itemGridTemp = {
                    campaignNo: item.campaignNo,
                    status: item.status,
                    id: item._id,
                    advertiser: item.items[i].advertiser,
                    category: item.items[i].category,
                    creative: item.items[i].creative,
                    image: item.items[i].image,
                    messages: item.items[i].messages,
                    mrp: item.items[i].mrp,
                    name: item.items[i].name,
                    price: item.items[i].price,
                    publisher: item.items[i].publisher,
                    publisheruid: item.items[i].publisheruid,
                    quantity: item.items[i].quantity,
                    request: item.items[i].request,
                    size: item.items[i].size,
                    sku: item.items[i].sku,
                    uid: item.items[i].uid
                  };

                  var p = item.items[i].price;
                  var q = item.items[i].quantity;
                  total += p * q;

                  vm.itemsGrid.push(itemGridTemp);
                }

                res[j].total = total;
              }

              res.totalFinal = total;

              var data = [];
              ////console.log(vm.itemsGrid);
              for (var i = 0; i < vm.itemsGrid.length; i++) {
                var item = vm.itemsGrid[i];
                if (item.campaignNo == dataItem.campaignNo) {
                  //alert(item.campaignNo);
                  data.push(item);
                }

                options.success(data);
                //console.log(data);

                vm.data = [];
              }

              vm.itemsGrid = [];
            });
          }
        },
        serverPaging: true,
        serverSorting: true,
        serverFiltering: true,
        pageSize: 5,
        filterable: true

      },
      scrollable: false,
      sortable: true,

      pageable: true,
      columns: [
      //{ field: "campaignNo", title:"Campaign #", width: "70px" },
      //{ field: "publisher", title:"Publisher", width: "100px" },
      // { field: "category", title:"Category", width: "50px" },
      { field: "name", title: "Name", width: "80px" }, { field: "category", title: "Start - End Date", width: "60px" }, { field: "price", title: "Price", width: "50px", format: "{0:c2}" }, { field: "quantity", title: "Inserts", width: "30px" },
      //    { 

      //    title: "Status",
      //     width: "40px",
      //      template: function (dataItem) {
      //          return "<div ng-show= \"dataItem.status.val=='305'\" class=\"alert alert-success\"><small>Approved</small></div>"+
      //         // "<div ng-show=\"!dataItem.creative\" class=\"alert alert-danger\" ><small>Needs Creative</small></div>"+
      //          "<div  ng-show = \"dataItem.status.val=='402'\" class=\"alert alert-danger\" ><small>Pending<small></div>"+
      //         "<div  ng-show = \"dataItem.status.val=='300'\" class=\"alert alert-success\" ><small>Ready</small> </div>"+
      //          "<div  ng-show = \"dataItem.status.val=='500'\" class=\"alert alert-danger\" ><small>Rejected</small> </div>"+
      //            "<div  ng-show = \"dataItem.status.val=='309'\" class=\"alert alert-success\" ><small>Completed</small> </div>";
      //     } 
      // },
      {
        field: "creative",
        title: "Creative",
        width: "20px",
        template: function template(dataItem) {
          return "<div ng-hide=\"dataItem.creative\">" + "<button  class=\"btn btn-danger\" ng-hide=\"isAdmin()\" ng-click=\"vm.mediaLibrary(dataItem)\" ><i class=\"fa fa-image\"></i><span class=\"glyphicon glyphicon-upload\"></span></button></div>" + "</div>" + "<div ng-show=\"dataItem.creative\">" + "<button  class=\"btn btn-success\" ng-hide=\"isAdmin()\" ng-click=\"vm.imageDetails(dataItem.creative)\" ><i class=\"fa fa-image\"></i><span class=\"glyphicon glyphicon-upload\"></span></button></div>" + "</div>";
          //return "<div> <button  class=\"btn btn-danger\"  ng-click=\"vm.open(cart.items,item,item.creative,'md')\" ><i class=\"fa fa-image\"></i><span class=\"glyphicon glyphicon-upload\"></span></button></div>";
        } }, {
        title: "Action",
        width: "40px",
        template: function template(dataItem) {
          return "<div  ng-show= \"dataItem.status=='Campaign Accepted'\" ><md-button ng-click=\"vm.addToCart({'sku':dataItem.id, 'name':dataItem.name ,'advertiser':dataItem.advertiser,'publisher':dataItem.publisher,'publisheruid':dataItem.publisheruid,'price':dataItem.price, 'quantity':dataItem.quantity,'image':dataItem.image,  'vid':dataItem.id} ,dataItem.quantity)\" class=\"md-raised cart\">" + "<ng-md-icon icon=\"shopping_cart\"></ng-md-icon>" + "</div>";
          // return "<button class=\"btn-success btn-sm btn-success\" ng-click=\"goToSite(site)\">Buy</button>";
        } }]
    };
  };

  vm.action = function (campaign) {
    // method
    ////console.log(campaign);
    Campaign.delete({ id: campaign._id }, function () {
      ////console.log("Campaign deleted");

      Campaign.save(campaign).$promise.then(function () {
        toastr.success("Campaign info saved successfully", "Success");
      });
    });
  };

  vm.changeStatus = function (campaign) {

    Campaign.update({ id: campaign._id }, campaign).$promise.then(function (res) {
      ////console.log(res);
    }, function (error) {
      // error handler
      ////console.log(error);
      if (error.data.errors) {
        var err = error.data.errors;
        toastr.error(err[Object.keys(err)].message, err[Object.keys(err)].name);
      } else {
        var msg = error.data.message;
        toastr.error(msg);
      }
    });
  };

  vm.addToCart = function (item, i) {

    Cart.cart.addItem(item, i);
    Cart.cart.flagOn();

    Toast.show({
      type: 'success',
      text: item.publisher + "-" + item.name + "" + "Has Been Added to Cart"
    });
  };

  var toNumber = function toNumber(value) {
    value = value * 1;
    return isNaN(value) ? 0 : value;
  };
});
//# sourceMappingURL=campaignRunning.controller.js.map

'use strict';

angular.module('mediaboxApp').controller('CampaignScheduledController', function ($scope, Cart, Auth, $log, $mdSidenav, Campaign, $loading, Upload, $timeout, $http, socket, $mdDialog, Settings, Toast) {
  //clear items added to campaign from cart
  //clear items added to campaign from cart
  Cart.cart.clearItems();
  Cart.cart.products = 20;

  Auth.getCurrentUser().photo = {};

  //alert(Auth.getCurrentUser().company);
  ////console.log(Auth.getCurrentUser());


  $loading.start("campaigns");

  ////console.log(Cart);

  var vm = this;
  vm.cart = Cart.cart;

  vm.itemsGrid = [];

  vm.toggleLeft = buildDelayedToggler('left');
  vm.toggleRight = buildToggler('right');
  vm.isOpenRight = function () {
    return $mdSidenav('right').isOpen();
  };
  /**
   * Supplies a function that will continue to operate until the
   * time is up.
   */
  function debounce(func, wait, context) {
    var timer;
    return function debounced() {
      var context = $scope,
          args = Array.prototype.slice.call(arguments);
      $timeout.cancel(timer);
      timer = $timeout(function () {
        timer = undefined;
        func.apply(context, args);
      }, wait || 10);
    };
  }
  /**
   * Build handler to open/close a SideNav; when animation finishes
   * report completion in console
   */
  function buildDelayedToggler(navID) {
    return debounce(function () {
      $mdSidenav(navID).toggle().then(function () {
        $log.debug("toggle " + navID + " is done");
      });
    }, 200);
  }
  function buildToggler(navID) {
    return function () {
      $mdSidenav(navID).toggle().then(function () {
        $log.debug("toggle " + navID + " is done");
      });
    };
  }

  vm.cmp = {};
  vm.campaignStatusLov = Campaign.status;
  vm.campaignStatus = [{ name: '', val: 402 }, { name: 'Avail Check', val: 201 }, { name: 'Buy', val: 202 }];

  vm.mediaLibrary = function (index) {
    $mdDialog.show({
      template: '<md-dialog aria-label="Media Library" ng-cloak flex="95">\n        <md-toolbar class="md-warn">\n          <div class="md-toolbar-tools">\n            <h2>Media Library</h2>\n            <span flex></span>\n            <md-button class="md-icon-button" ng-click="cancel()">\n              <ng-md-icon icon="close" aria-label="Close dialog"></ng-md-icon>\n            </md-button>\n          </div>\n        </md-toolbar>\n\n        <md-dialog-content>\n            <div class="md-dialog-content padding"  class="md-whiteframe-z2">\n                <md-grid-list class="media-list" md-cols-xs ="3" md-cols-sm="4" md-cols-md="5" md-cols-lg="7" md-cols-gt-lg="10" md-row-height-gt-md="1:1" md-row-height="4:3" md-gutter="12px" md-gutter-gt-sm="8px" layout="row" layout-align="center center">\n                  <md-grid-tile ng-repeat="i in media" class="md-whiteframe-z2" ng-click="ok(i.path)">\n                    <div class="thumbnail">\n                        <img ng-src="{{i.path}}" draggable="false" alt="{{i.name}}">\n                    </div>\n                    <md-grid-tile-footer><h3>{{i.name}}</h3></md-grid-tile-footer>\n                  </md-grid-tile>\n                </md-grid-list>\n          </div>\n        </md-dialog-content>\n        <md-dialog-actions layout="row">\n          <span flex></span>\n          <md-button ng-click="addNewImage()" class="md-warn md-raised">\n           Add new Creative\n          </md-button>\n        </md-dialog-actions>\n      </md-dialog>\n',
      controller: function controller($scope, $mdDialog, $http, socket, $state) {
        // Start query the database for the table
        var vm = this;
        $scope.loading = true;
        $http.get('/api/media/').then(function (res) {
          $scope.loading = false;
          $scope.media = res.data;
          socket.syncUpdates('media', $scope.data);
        }, handleError);

        function handleError(error) {
          // error handler
          $scope.loading = false;
          if (error.status === 403) {
            Toast.show({
              type: 'error',
              text: 'Not authorised to make changes.'
            });
          } else {
            Toast.show({
              type: 'error',
              text: error.status
            });
          }
        }
        $scope.ok = function (path) {
          $mdDialog.hide(path);
        };
        $scope.hide = function () {
          $mdDialog.hide();
        };
        $scope.cancel = function () {
          $mdDialog.cancel();
        };
        $scope.addNewImage = function () {
          $state.go('media');
          //vm.save(vm.product)
          $mdDialog.hide();
        };
      }

    }).then(function (answer) {
      //console.log(answer);
      if (index === 1000000) vm.cart.items.push({ size: 'x', creative: answer });else vm.cart.items[index].creative = answer;
    }, function () {});
  };

  vm.imageDetails = function (img) {
    $mdDialog.show({
      template: '\n    <md-dialog aria-label="Image Details Dialog"  ng-cloak>\n  <md-toolbar>\n    <div class="md-toolbar-tools">\n      <h2>Media Details</h2>\n      <span flex></span>\n      <md-button class="md-icon-button" ng-click="cancel()">\n        <ng-md-icon icon="close" aria-label="Close dialog"></ng-md-icon>\n      </md-button>\n    </div>\n  </md-toolbar>\n  <md-dialog-content>\n    <div class="md-dialog-content">\n      <div layout="row" class="md-whiteframe-z2">\n        <div class="flexbox-container">\n          <div>\n            <img ng-src="{{img}}" draggable="false"  class="detail-image"/>\n          </div>\n          </div>\n      </div>\n  </md-dialog-content>\n  <md-dialog-actions layout="row">\n    <span flex></span>\n    <md-button ng-click="delete(img)" class="md-warn">\n     Delete Permanently\n    </md-button>\n  </md-dialog-actions>\n</md-dialog>\n',
      controller: function controller($scope, $mdDialog) {
        $scope.img = img;
        $scope.delete = function (img) {
          var confirm = $mdDialog.confirm().title('Would you like to delete the media permanently?').textContent('Media once deleted can not be undone.').ariaLabel('Delete Media').ok('Please do it!').cancel('Cancel');
          $mdDialog.show(confirm).then(function () {
            $http.delete('/api/media/' + img._id).then(function () {
              $mdDialog.hide();
            }, handleError);
          }, function () {
            $mdDialog.hide();
          });
        };
        $scope.hide = function () {
          $mdDialog.hide();
        };
        $scope.cancel = function () {
          $mdDialog.cancel();
        };
      }
    }).then(function (answer) {
      $scope.alert = 'You said the information was "' + answer + '".';
    }, function () {
      $scope.alert = 'You cancelled the dialog.';
    });
  };

  vm.campaignsAll = Campaign.my.query({}, function (res) {

    var totalCampaign = res.length;

    res.totalCampaign = totalCampaign;
    ////console.log(totalCampaign);
    $loading.finish("campaigns");

    // }
    // res.total = total;
  });

  var qPending = {};
  qPending.where = { $and: [{ 'items.advertiser.email': Auth.getCurrentUser().email }, { 'status': 'Campaign Placed' }] };

  vm.campaignsPending = Campaign.my.query(qPending, function (res) {

    var totalCampaign = res.length;

    res.totalCampaign = totalCampaign;
    ////console.log(totalCampaign);
    $loading.finish("campaigns");

    // }
    // res.total = total;
  });

  var qScheduled = {};
  qScheduled.where = { $and: [{ 'items.advertiser.email': Auth.getCurrentUser().email }, { 'items.startDate': { $gt: Date.now() } }, { 'status': 'Campaign Accepted' }] };

  vm.campaignsScheduled = Campaign.my.query(qScheduled, function (res) {

    var totalCampaign = res.length;

    res.totalCampaign = totalCampaign;
    ////console.log(totalCampaign);
    $loading.finish("campaigns");

    // }
    // res.total = total;
  });

  var qRunning = {};
  qRunning.where = { $and: [{ 'items.advertiser.email': Auth.getCurrentUser().email }, { 'items.startDate': { $lt: Date.now() } }, { 'items.endDate': { $gt: Date.now() } }, { 'status': 'Campaign Accepted' }] };

  vm.campaignsRunning = Campaign.my.query(qRunning, function (res) {

    var totalCampaign = res.length;

    res.totalCampaign = totalCampaign;
    ////console.log(totalCampaign);
    $loading.finish("campaigns");

    // }
    // res.total = total;
  });

  var qFinished = {};
  qFinished.where = { $and: [{ 'items.advertiser.email': Auth.getCurrentUser().email }, { 'items.endDate': { $lt: Date.now() } }, { 'status': 'Campaign Completed' }] };

  vm.campaignsCompleted = Campaign.my.query(qFinished, function (res) {

    var totalCampaign = res.length;

    res.totalCampaign = totalCampaign;
    ////console.log(totalCampaign);
    $loading.finish("campaigns");

    // }
    // res.total = total;
  });

  vm.getTotal = function (item) {
    // //console.log(item);
    var total = 0;

    for (var i = 0; i < item.items.length; i++) {

      // items[i].total = 0;

      var p = item.items[i].price;
      var q = item.items[i].quantity;
      total += p * q;
      // var x.sub.push(total);
    }
    // //console.log(total);

    return total;
  };

  // alert(Auth.getCurrentUser().email);


  vm.mainGridOptions = {
    dataSource: {

      transport: {
        read: function read(options) {
          //options holds the grids current page and filter settings
          var qScheduled = {};
          qScheduled.where = { $and: [{ 'items.advertiser.email': Auth.getCurrentUser().email }, { 'items.startDate': { $gt: Date.now() } }, { 'status': 'Campaign Accepted' }] };

          Campaign.my.query(qScheduled, function (res) {

            console.log(res);

            for (var j = 0; j < res.length; j++) {
              var total = 0;
              var item = res[j];
              for (var i = 0; i < item.items.length; i++) {

                var p = item.items[i].price;
                var q = item.items[i].quantity;
                total += p * q;
              }

              res[j].total = total;
            }

            options.success(res);
            ////console.log(res);
          });
        }
      },
      pageSize: 10,
      serverPaging: true,
      serverSorting: true
    },
    toolbar: ['excel', 'pdf'],

    excel: {
      allPages: true,
      proxyURL: "//demos.telerik.com/kendo-ui/service/export",
      fileName: 'Mediabox-campaigns.xlsx',
      filterable: true
    },
    pdf: {
      allPages: true,
      avoidLinks: true,
      paperSize: "A4",
      margin: { top: "2cm", left: "1cm", right: "1cm", bottom: "1cm" },
      landscape: true,
      repeatHeaders: true,
      template: $("#page-template").html(),
      scale: 0.8
    },
    sortable: true,
    pageable: true,
    editable: "popup",

    filterable: true,

    dataBound: function dataBound() {
      this.expandRow(this.tbody.find("tr.k-master-row").first());
    },
    columns: [{ field: "campaignNo", title: "Campaign #" }, { field: "campaignName", title: "Campaign Name" }, { field: "created_at", title: "Date Created", type: 'datetime', template: "#=  (created_at == null)? '' : kendo.toString(kendo.parseDate(created_at, 'yyyy-MM-dd'), 'MM/dd/yy') #" },
    //{ field: "endDate", title: "Start Date-End Date",type: 'datetime',template: "#=  (endDate == null)? '' : kendo.toString(kendo.parseDate(endDate, 'yyyy-MM-dd'), 'MM/dd/yy') #" },
    { field: "status", title: "Status", template: function template(dataItem) {
        return "<div ng-show= \"dataItem.status.val=='305'\" class=\"alert alert-success\"><small>Approved</small></div>" +
        // "<div ng-show=\"!dataItem.creative\" class=\"alert alert-danger\" ><small>Needs Creative</small></div>"+
        "<div  ng-show = \"dataItem.status=='Campaign Placed'\" class=\"alert alert-danger\" ><small>Waiting Response<small></div>" + "<div  ng-show = \"dataItem.status=='Campaign Accepted'\" class=\"alert alert-success\" ><small>Campaign Approved</small> </div>" + "<div  ng-show = \"dataItem.status=='Campaign Rejected'\" class=\"alert alert-danger\" ><small>Campaign Rejected</small> </div>" + "<div  ng-show = \"dataItem.status=='Campaign Completed'\" class=\"alert alert-success\" ><small>Campaign Completed</small> </div>";
      } }, { field: "total", title: "Total", format: "{0:c2}" }]
  };

  vm.detailGridOptions = function (dataItem) {

    return {
      dataSource: {
        filter: { field: "campaignNo", operator: "eq", value: dataItem.campaignNo },
        transport: {
          read: function read(options) {
            //options holds the grids current page and filter settings
            var itemsGrid = [];
            var qScheduled = {};
            qScheduled.where = { $and: [{ 'items.advertiser.email': Auth.getCurrentUser().email }, { 'items.startDate': { $gt: Date.now() } }, { 'status': 'Campaign Accepted' }] };

            Campaign.my.query(qScheduled, function (res) {
              ////console.log(res);


              var totalFinal = 0;
              var totalCampaign = res.length;

              for (var j = 0; j < res.length; j++) {
                var total = 0;

                var item = res[j];
                for (var i = 0; i < item.items.length; i++) {

                  var itemGridTemp = {
                    campaignNo: item.campaignNo,
                    status: item.status,
                    id: item._id,
                    advertiser: item.items[i].advertiser,
                    category: item.items[i].category,
                    creative: item.items[i].creative,
                    image: item.items[i].image,
                    messages: item.items[i].messages,
                    mrp: item.items[i].mrp,
                    name: item.items[i].name,
                    price: item.items[i].price,
                    publisher: item.items[i].publisher,
                    publisheruid: item.items[i].publisheruid,
                    quantity: item.items[i].quantity,
                    request: item.items[i].request,
                    size: item.items[i].size,
                    sku: item.items[i].sku,
                    uid: item.items[i].uid
                  };

                  var p = item.items[i].price;
                  var q = item.items[i].quantity;
                  total += p * q;

                  vm.itemsGrid.push(itemGridTemp);
                }

                res[j].total = total;
              }

              res.totalFinal = total;

              var data = [];
              ////console.log(vm.itemsGrid);
              for (var i = 0; i < vm.itemsGrid.length; i++) {
                var item = vm.itemsGrid[i];
                if (item.campaignNo == dataItem.campaignNo) {
                  //alert(item.campaignNo);
                  data.push(item);
                }

                options.success(data);
                //console.log(data);

                vm.data = [];
              }

              vm.itemsGrid = [];
            });
          }
        },
        serverPaging: true,
        serverSorting: true,
        serverFiltering: true,
        pageSize: 5,
        filterable: true

      },
      scrollable: false,
      sortable: true,

      pageable: true,
      columns: [{ field: "name", title: "Name", width: "80px" }, { field: "category", title: "Start - End Date", width: "60px" }, { field: "price", title: "Price", format: "{0:c2}", width: "50px" }, { field: "quantity", title: "Inserts", width: "30px" }, {
        field: "creative",
        title: "Creative",
        width: "20px",
        template: function template(dataItem) {
          return "<div ng-hide=\"dataItem.creative\">" + "<button  class=\"btn btn-danger\" ng-hide=\"isAdmin()\" ng-click=\"vm.mediaLibrary(dataItem)\" ><i class=\"fa fa-image\"></i><span class=\"glyphicon glyphicon-upload\"></span></button></div>" + "</div>" + "<div ng-show=\"dataItem.creative\">" + "<button  class=\"btn btn-success\" ng-hide=\"isAdmin()\" ng-click=\"vm.imageDetails(dataItem.creative)\" ><i class=\"fa fa-image\"></i><span class=\"glyphicon glyphicon-upload\"></span></button></div>" + "</div>";
        } }, {
        title: "Action",
        width: "40px",
        template: function template(dataItem) {
          return "<div  ng-show= \"dataItem.status=='Campaign Accepted'\" ><md-button ng-click=\"vm.addToCart({'sku':dataItem.id, 'name':dataItem.name ,'advertiser':dataItem.advertiser,'publisher':dataItem.publisher,'publisheruid':dataItem.publisheruid,'price':dataItem.price, 'quantity':dataItem.quantity,'image':dataItem.image,  'vid':dataItem.id} ,dataItem.quantity)\" class=\"md-raised cart\">" + "<ng-md-icon icon=\"shopping_cart\"></ng-md-icon>" + "</div>";
        } }]
    };
  };

  vm.action = function (campaign) {
    // method
    ////console.log(campaign);
    Campaign.delete({ id: campaign._id }, function () {
      ////console.log("Campaign deleted");

      Campaign.save(campaign).$promise.then(function () {
        toastr.success("Campaign info saved successfully", "Success");
      });
    });
  };

  vm.changeStatus = function (campaign) {

    Campaign.update({ id: campaign._id }, campaign).$promise.then(function (res) {
      ////console.log(res);
    }, function (error) {
      // error handler
      ////console.log(error);
      if (error.data.errors) {
        var err = error.data.errors;
        toastr.error(err[Object.keys(err)].message, err[Object.keys(err)].name);
      } else {
        var msg = error.data.message;
        toastr.error(msg);
      }
    });
  };

  vm.addToCart = function (item, i) {

    Cart.cart.addItem(item, i);
    Cart.cart.flagOn();

    Toast.show({
      type: 'success',
      text: item.publisher + "-" + item.name + "" + "Has Been Added to Cart"
    });
  };

  var toNumber = function toNumber(value) {
    value = value * 1;
    return isNaN(value) ? 0 : value;
  };
});
//# sourceMappingURL=campaignScheduled.controller.js.map

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var CampaignsController = function () {
    function CampaignsController(Cart, Country, Auth, PaymentMethod, Shipping, Coupon, Campaign, Toast, Settings, $state, $scope, $loading, Upload, $timeout, $http, socket, $mdDialog) {
      _classCallCheck(this, CampaignsController);

      $loading.start("campaigns");
      var vm = this;
      vm.itemsGrid = [];
      this.Cart = Cart, this.campaignStatusLov = Campaign.status;
      this.Campaign = Campaign;
      this.Toast = Toast;
      this.Settings = Settings;
      this.$state = $state;
      this.options = {};
      //this.campaigns = Campaign.query();
      this.campaignStatus = [{ name: '', val: 402 }, { name: 'Approved', val: 305 }, { name: 'Reject', val: 500 }];

      this.campaignStatusCreativeAdded = [{ name: 'Completed', val: 309 }];

      var qAll = {};
      qAll.where = { 'items.advertiser.email': Auth.getCurrentUser().email };
      this.campaigns = Campaign.pub.query(qAll, function (res) {
        var totalCampaign = res.length;

        res.totalCampaign = totalCampaign;
        console.log(totalCampaign);
        $loading.finish("campaigns");

        // }
        // res.total = total;
      });

      vm.mediaLibrary = function (index) {
        $mdDialog.show({
          template: '<md-dialog aria-label="Media Library" ng-cloak flex="95">\n        <md-toolbar class="md-warn">\n          <div class="md-toolbar-tools">\n            <h2>Media Library</h2>\n            <span flex></span>\n            <md-button class="md-icon-button" ng-click="cancel()">\n              <ng-md-icon icon="close" aria-label="Close dialog"></ng-md-icon>\n            </md-button>\n          </div>\n        </md-toolbar>\n\n        <md-dialog-content>\n            <div class="md-dialog-content padding"  class="md-whiteframe-z2">\n                <md-grid-list class="media-list" md-cols-xs ="3" md-cols-sm="4" md-cols-md="5" md-cols-lg="7" md-cols-gt-lg="10" md-row-height-gt-md="1:1" md-row-height="4:3" md-gutter="12px" md-gutter-gt-sm="8px" layout="row" layout-align="center center">\n                  <md-grid-tile ng-repeat="i in media" class="md-whiteframe-z2" ng-click="ok(i.path)">\n                    <div class="thumbnail">\n                        <img ng-src="{{i.path}}" draggable="false" alt="{{i.name}}">\n                    </div>\n                    <md-grid-tile-footer><h3>{{i.name}}</h3></md-grid-tile-footer>\n                  </md-grid-tile>\n                </md-grid-list>\n          </div>\n        </md-dialog-content>\n        <md-dialog-actions layout="row">\n          <span flex></span>\n          <md-button ng-click="addNewImage()" class="md-warn md-raised">\n           Add new Creative\n          </md-button>\n        </md-dialog-actions>\n      </md-dialog>\n',
          controller: function controller($scope, $mdDialog, $http, socket, $state) {
            // Start query the database for the table
            var vm = this;
            $scope.loading = true;
            $http.get('/api/media/').then(function (res) {
              $scope.loading = false;
              $scope.media = res.data;
              socket.syncUpdates('media', $scope.data);
            }, handleError);

            function handleError(error) {
              // error handler
              $scope.loading = false;
              if (error.status === 403) {
                Toast.show({
                  type: 'error',
                  text: 'Not authorised to make changes.'
                });
              } else {
                Toast.show({
                  type: 'error',
                  text: error.status
                });
              }
            }
            $scope.ok = function (path) {
              $mdDialog.hide(path);
            };
            $scope.hide = function () {
              $mdDialog.hide();
            };
            $scope.cancel = function () {
              $mdDialog.cancel();
            };
            $scope.addNewImage = function () {
              $state.go('media');
              //vm.save(vm.product)
              $mdDialog.hide();
            };
          }

        }).then(function (answer) {
          console.log(answer);
          if (index === 1000000) vm.cart.items.push({ size: 'x', creative: answer });else vm.cart.items[index].creative = answer;
        }, function () {});
      };

      vm.imageDetails = function (img) {
        $mdDialog.show({
          template: '\n    <md-dialog aria-label="Image Details Dialog"  ng-cloak>\n  <md-toolbar>\n    <div class="md-toolbar-tools">\n      <h2>Media Details</h2>\n      <span flex></span>\n      <md-button class="md-icon-button" ng-click="cancel()">\n        <ng-md-icon icon="close" aria-label="Close dialog"></ng-md-icon>\n      </md-button>\n    </div>\n  </md-toolbar>\n  <md-dialog-content>\n    <div class="md-dialog-content">\n      <div layout="row" class="md-whiteframe-z2">\n        <div class="flexbox-container">\n          <div>\n            <img ng-src="{{img}}" draggable="false"  class="detail-image"/>\n          </div>\n          </div>\n      </div>\n  </md-dialog-content>\n  <md-dialog-actions layout="row">\n    <span flex></span>\n    <md-button ng-click="delete(img)" class="md-warn">\n     Delete Permanently\n    </md-button>\n  </md-dialog-actions>\n</md-dialog>\n',
          controller: function controller($scope, $mdDialog) {
            $scope.img = img;
            $scope.delete = function (img) {
              var confirm = $mdDialog.confirm().title('Would you like to delete the media permanently?').textContent('Media once deleted can not be undone.').ariaLabel('Delete Media').ok('Please do it!').cancel('Cancel');
              $mdDialog.show(confirm).then(function () {
                $http.delete('/api/media/' + img._id).then(function () {
                  $mdDialog.hide();
                }, handleError);
              }, function () {
                $mdDialog.hide();
              });
            };
            $scope.hide = function () {
              $mdDialog.hide();
            };
            $scope.cancel = function () {
              $mdDialog.cancel();
            };
          }
        }).then(function (answer) {
          $scope.alert = 'You said the information was "' + answer + '".';
        }, function () {
          $scope.alert = 'You cancelled the dialog.';
        });
      };

      var qPending = {};
      qPending.where = { $and: [{ 'items.publisheruid': Auth.getCurrentUser().email }, { 'status': 'Campaign Placed' }] };

      this.campaignsPending = Campaign.pub.query(qPending, function (res) {

        var totalCampaign = res.length;

        res.totalCampaign = totalCampaign;
        console.log(totalCampaign);
        $loading.finish("campaigns");

        // }
        // res.total = total;
      });

      var qScheduled = {};
      qScheduled.where = { $and: [{ 'items.publisheruid': Auth.getCurrentUser().email }, { 'items.startDate': { $gt: Date.now() } }, { 'status': 'Campaign Accepted' }] };

      this.campaignsScheduled = Campaign.pub.query(qScheduled, function (res) {

        var totalCampaign = res.length;

        res.totalCampaign = totalCampaign;
        console.log(totalCampaign);
        $loading.finish("campaigns");

        // }
        // res.total = total;
      });

      var qRunning = {};
      qRunning.where = { $and: [{ 'items.publisheruid': Auth.getCurrentUser().email }, { 'items.startDate': { $lt: Date.now() } }, { 'items.endDate': { $gt: Date.now() } }, { 'status': 'Campaign Accepted' }] };

      this.campaignsRunning = Campaign.pub.query(qRunning, function (res) {

        var totalCampaign = res.length;

        res.totalCampaign = totalCampaign;
        console.log(totalCampaign);
        $loading.finish("campaigns");

        // }
        // res.total = total;
      });

      var qFinished = {};
      qFinished.where = { $and: [{ 'items.publisheruid': Auth.getCurrentUser().email }, { 'items.endDate': { $lt: Date.now() } }, { 'status': 'Campaign Accepted' }] };

      this.campaignsCompleted = Campaign.pub.query(qFinished, function (res) {

        var totalCampaign = res.length;

        res.totalCampaign = totalCampaign;
        console.log(totalCampaign);
        $loading.finish("campaigns");

        // }
        // res.total = total;
      });

      this.items = Campaign.pub.query(qAll, function (res) {

        var total = 0;

        // for(var i=0;i<res.length;i++){
        //     var subTotal = 0;
        for (var j = 0; j < res.length; j++) {

          // console.log(res[j].campaignDate);

          total = 0;
          // console.log();
          // subTotal += res[i].shipping.charge;
          var item = res[j];

          // console.log(item.items);
          // var x = item.items
          // var x.sub = [];

          for (var i = 0; i < item.items.length; i++) {

            var p = item.items[i].price;
            var q = item.items[i].quantity;
            total += p * q;
            // var x.sub.push(total);
          }
          // console.log(total);
        }
        res.total = total;
        //console.log(res);
        $loading.finish('campaigns');

        // }
        // res.total = total;
      });

      this.itemsGrid = [];

      this.mainGridOptions = {
        dataSource: {

          transport: {
            read: function read(options) {
              //options holds the grids current page and filter settings

              var qPending = {};
              qPending.where = { $and: [{ 'items.publisheruid': Auth.getCurrentUser().email }, { 'status': 'Campaign Placed' }] };
              Campaign.pub.query(qPending, function (res) {

                for (var j = 0; j < res.length; j++) {
                  var total = 0;
                  var item = res[j];
                  for (var i = 0; i < item.items.length; i++) {

                    var p = item.items[i].price;
                    var q = item.items[i].quantity;
                    total += p * q;
                  }

                  res[j].total = total;
                }

                options.success(res);
                // console.log(res);
              });
            }
          },
          pageSize: 10,
          serverPaging: true,
          serverSorting: true
        },
        toolbar: ['excel', 'pdf'],

        excel: {
          allPages: true,
          proxyURL: "//demos.telerik.com/kendo-ui/service/export",
          fileName: 'Mediabox-campaigns.xlsx',
          filterable: true
        },
        pdf: {
          allPages: true,
          avoidLinks: true,
          paperSize: "A4",
          margin: { top: "2cm", left: "1cm", right: "1cm", bottom: "1cm" },
          landscape: true,
          repeatHeaders: true,
          template: $("#page-template").html(),
          scale: 0.8
        },
        sortable: true,
        pageable: true,

        filterable: true,

        dataBound: function dataBound() {
          this.expandRow(this.tbody.find("tr.k-master-row").first());
        },
        columns: [//{ field: "items[0].advertiser.company", title: "Advertiser" },
        //{ field: "campaignNo", title: "Campaign ID" },
        { field: "campaignName", title: "Campaign Name" }, { field: "created_at", title: "Campaign Date", type: 'datetime', template: "#=  (created_at == null)? '' : kendo.toString(kendo.parseDate(created_at, 'yyyy-MM-dd'), 'MM/dd/yy') #" },
        //{ field: "endDate", title: "End Date",type: 'datetime',template: "#=  (endDate == null)? '' : kendo.toString(kendo.parseDate(endDate, 'yyyy-MM-dd'), 'MM/dd/yy') #" },
        { field: "total", title: "Total", template: function template(dataItem) {
            return "<div></span><span style='display:inline-block;width:75%;text-align:left;white-space:nowrap;'>$ " + dataItem.total + "</span></div>";
          } }, { field: "status", title: "Status", template: function template(dataItem) {
            return " <span class=\"md-subhead\"><md-select ng-model=\"dataItem.status\"  ng-change=\"vm.changeStatus(dataItem)\" flex><md-option ng-value=\"o\" ng-repeat=\"o in vm.Settings.campaignStatus\">{{o}}</md-option></md-select></span>";
            // return "<div  ng-if = \"dataItem.status =='Campaign Placed'\">"+
            //  "<md-select ng-model=\"dataItem.status\" value=\"dataItem.status\" ng-options=\"p.name for p in vm.campaignStatus track by p.val\" ng-change=\"vm.action(dataItem)\" class=\"k-select\" style=\"max-width: 150px\"></md-select>"+
            //   "</div>"+

            //  "<div  ng-show = \"!dataItem.status.val=='402'\" >"+
            //  "<select ng-model=\"dataItem.status\" ng-options=\"p.name for p in vm.campaignStatusCreativeAdded track by p.val\" ng-change=\"vm.action(o)\" class=\"k-select\"  style=\"max-width: 150px\"></select>"+
            //  "</div>"; 
          } }]
      };

      this.detailGridOptions = function (dataItem) {

        this.dataItem = dataItem;
        this.uCampaign = dataItem;
        console.log(this.dataItem);

        return {
          update: function update(e) {
            console.log(e);
            // e.success();
            alert("update called");
            e.container.find("input[name=price]").data("KendoNumericTextBox");
          },
          edit: function edit(e) {
            //e.success();
            alert("edit called");
            e.container.find("input[name=price]").data("KendoNumericTextBox");
          },
          destroy: function destroy(e) {
            e.success();
            alert("update called");
            e.container.find("input[name=price]").data("KendoNumericTextBox");
          },
          create: function create(e) {
            e.success();
            alert("update called");
            e.container.find("input[name=price]").data("KendoNumericTextBox");
          },
          toolbar: ["create"],
          dataSource: {
            schema: {
              model: {
                id: "id",
                fields: {
                  "id": { type: "number" },
                  "publisher": { type: "String" },
                  "name": { type: "String" },
                  "price": { type: "number" },
                  "quantity": { type: "number" },
                  "creative": { type: "upload" }
                }
              }
            },
            filter: { field: "id", operator: "eq", value: dataItem.id },
            transport: {
              read: function read(options) {
                //options holds the grids current page and filter settings
                var itemsGrid = [];
                var qPending = {};
                qPending.where = { $and: [{ 'items.publisheruid': Auth.getCurrentUser().email }, { 'status': 'Campaign Placed' }] };
                Campaign.pub.query(qPending, function (res) {
                  //console.log(res);


                  var totalFinal = 0;
                  var totalCampaign = res.length;

                  for (var j = 0; j < res.length; j++) {
                    var total = 0;

                    var item = res[j];
                    for (var i = 0; i < item.items.length; i++) {

                      var itemGridTemp = {
                        campaignNo: item.campaignNo,
                        campaignName: item.campaignName,
                        campaignid: item._id,
                        advertiser: item.items[i].advertiser,
                        category: item.items[i].category,
                        creative: item.items[i].creative,
                        image: item.items[i].image,
                        messages: item.items[i].messages,
                        mrp: item.items[i].mrp,
                        name: item.items[i].name,
                        price: item.items[i].price,
                        publisher: item.items[i].publisher,
                        quantity: item.items[i].quantity,
                        request: item.items[i].request,
                        size: item.items[i].size,
                        sku: item.items[i].sku,
                        status: item.items[i].status,
                        uid: item.items[i].uid,
                        position: i

                      };

                      var p = item.items[i].price;
                      var q = item.items[i].quantity;
                      total += p * q;

                      vm.itemsGrid.push(itemGridTemp);
                    }

                    res[j].total = total;
                  }

                  res.totalFinal = total;

                  var data = [];
                  //console.log(vm.itemsGrid);
                  for (var i = 0; i < vm.itemsGrid.length; i++) {
                    var item = vm.itemsGrid[i];
                    if (item.campaignNo == dataItem.campaignNo) {
                      //alert(item.campaignNo);
                      data.push(item);
                    }

                    options.success(data);
                    console.log(data);

                    vm.data = [];
                  }

                  vm.itemsGrid = [];
                });
              }
            },
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            pageSize: 5,
            filterable: true

          },
          scrollable: false,
          sortable: true,
          editable: "inline",

          pageable: true,
          columns: [
          //{ field: "campaignNo", title:"Campaign #", width: "70px" },
          //{ field: "email", title:"Email", width: "70px" },
          { field: "publisher", title: "Publisher", width: "80px" }, { field: "name", title: "Name", width: "70px" }, { field: "category", title: "Dates", width: "100px", template: function template(dataItem) {
              return "<md-input-container>" + "<label>&nbsp</label>" + "<input  name=\"daterange\" value=\"dataItem.category\" id=\"config-demo\"   ng-model= \"dataItem.category\"\>" + "<i class=\"glyphicon glyphicon-calendar form-control-feedback\"></i>" + "</md-input-container>";
            } }, {
            field: "price",
            title: "Price",
            width: "50px",

            template: function template(dataItem) {

              return "<md-input-container>" + "<label>&nbsp</label>" + "<input  type=\"number\" value=\"dataItem.price\" ng-model= \"dataItem.price\"\>" + "</md-input-container>";
            } }, { field: "quantity", title: "Quantity", width: "40px", template: function template(dataItem) {

              return "<md-input-container>" + "<label>&nbsp</label>" + "<input  type=\"number\" value=\"dataItem.quantity\" ng-model= \"dataItem.quantity\"\>" + "</md-input-container>";
            } }, {
            field: "creative",
            title: "Creative",
            width: "40px",
            template: function template(dataItem) {
              return "<div ng-hide=\"dataItem.creative\">" + "<button  class=\"btn btn-danger\" ng-hide=\"isAdmin()\" ng-click=\"vm.mediaLibrary(dataItem)\" ><i class=\"fa fa-image\"></i><span class=\"glyphicon glyphicon-upload\"></span></button></div>" + "</div>" + "<div ng-show=\"dataItem.creative\">" + "<button  class=\"btn btn-success\" ng-hide=\"isAdmin()\" ng-click=\"vm.imageDetails(dataItem.creative)\" ><i class=\"fa fa-image\"></i><span class=\"glyphicon glyphicon-upload\"></span></button></div>" + "</div>";
              //return "<div> <button  class=\"btn btn-danger\"  ng-click=\"vm.open(cart.items,item,item.creative,'md')\" ><i class=\"fa fa-image\"></i><span class=\"glyphicon glyphicon-upload\"></span></button></div>";
            } },
          //    { 
          //      field: "status.name", 
          //      title: "Status", 
          //      width: "40px" ,
          //      template: function (dataItem) {
          //      return "<div ng-show= \"dataItem.status.val=='305'\" class=\"alert alert-success\"><small>Approved</small></div>"+
          //         // "<div ng-show=\"!dataItem.creative\" class=\"alert alert-danger\" ><small>Needs Creative</small></div>"+
          //          "<div  ng-show = \"dataItem.status.val=='402'\" class=\"alert alert-danger\" ><small>Pending<small></div>"+
          //       "<div  ng-show = \"dataItem.status.val=='300'\" class=\"alert alert-success\" ><small>Ready</small> </div>"+
          //      "<div  ng-show = \"dataItem.status.val=='500'\" class=\"alert alert-danger\" ><small>Rejected</small> </div>"+
          //        "<div  ng-show = \"dataItem.status.val=='309'\" class=\"alert alert-success\" ><small>Completed</small> </div>";
          // } 

          //    },
          //     { 
          //       title:"Action",
          //        width: "50px" ,
          //         template: function (dataItem) {
          //        //return "<div ng-show= \"dataItem.status.val=='305'\"><button class=\"btn-success btn-sm btn-success\" ng-click=\"cart.addItem({sku:dataItem.sku, name:dataItem.name,slug:adspace.formart,mrp:dataItem.mrp, weight:dataItem.maxSize,size:dataItem.size,price:dataItem.price , publisher:dataItem.publisher,uid:dataItem.uid,category:dataItem.category,image:dataItem.image,quantity:1} ,true);\" ng-show=\"checkCart(dataItem.name)\"><i class=\"fa fa-shopping-cart\" ></i></button></div>";
          //     // return "<button class=\"btn-success btn-sm btn-success\" ng-click=\"goToSite(site)\">Buy</button>";
          //     return "<div  ng-if = \"dataItem.status.val=='402'\">"+
          //            "<select ng-model=\"dataItem.status\" ng-options=\"p.name for p in vm.campaignStatus track by p.val\" ng-change=\"vm.action(dataItem)\" class=\"k-select\" style=\"max-width: 150px\"></select>"+
          // "</div>"+

          //            "<div  ng-show = \"!dataItem.status.val=='402'\" >"+
          //            "<select ng-model=\"dataItem.status\" ng-options=\"p.name for p in vm.campaignStatusCreativeAdded track by p.val\" ng-change=\"vm.action(o)\" class=\"k-select\"  style=\"max-width: 150px\"></select>"+
          //            "</div>";  
          //  }},
          // { command: [
          //    { name :"Update",
          //      click:function(dataItem){
          //        console.log(e);
          //        alert("clicked event");
          //    }},
          //    // {name:"edit"},
          //    // {name:"destroy"}

          //  ],width :"40px"}
          //  
          {
            field: "campaignNo",
            title: "Update",
            width: "60px",
            template: function template(dataItem) {
              return "<div>" + "<button  class=\"btn btn-success\"  ng-click=\"vm.updateItem(dataItem)\" ><i class=\"fa fa-check\">Update</i><span class=\"glyphicon glyphicon-check\"></span></button></div>" + "</div>";
            } }]
        };
      };
    } //end constructor

    _createClass(CampaignsController, [{
      key: 'navigate',
      value: function navigate(params) {
        this.$state.go('single-product', { id: params.sku, slug: params.description }, { reload: false });
      }
    }, {
      key: 'getTotal',
      value: function getTotal(item) {
        // console.log(item);
        var total = 0;

        for (var i = 0; i < item.items.length; i++) {

          // items[i].total = 0;

          var p = item.items[i].price;
          var q = item.items[i].quantity;
          total += p * q;
          // var x.sub.push(total);
        }
        // //console.log(total);

        return total;
      }
    }, {
      key: 'action',
      value: function action(items) {

        var newStatus = { name: 'Approved', val: 305 };

        //var updated = _.merge(itemToMergeCampaign,items.itemToMergeItem);
        // method

        if (items) {
          console.log(vm.uCampaign._id);
          //vm.uCampaign.items = [];
          console.log(items);

          Campaign.update({ id: vm.uCampaign._id }, items).$promise.then(function (res) {
            //console.log(res);
            toastr.success("Campaign has been Approved", "Success");
          }, function (error) {
            // error handler
            //console.log(error);
            if (error.data.errors) {
              var err = error.data.errors;
              toastr.error(err[Object.keys(err)].message, err[Object.keys(err)].name);
            } else {
              var msg = error.data.message;
              toastr.error(msg);
            }
          });
        }
      }
    }, {
      key: 'changeStatus',
      value: function changeStatus(campaign) {
        var vm = this;
        var vm = this;

        this.Campaign.update({ id: campaign._id }, { campaignName: campaign.campaignName,
          status: campaign.status,
          startDate: campaign.items[0].startDate,
          endDate: campaign.items[0].endDate }).$promise.then(function (res) {}, function (error) {
          // error handler
          if (error) {
            vm.Toast.show({
              type: 'error',
              text: error.data.errors.status.message
            });
          } else {
            vm.Toast.show({
              type: 'success',
              text: error.statusText
            });
          }
        });
      }
    }, {
      key: 'updateItem',
      value: function updateItem(campaign) {

        var dateArray = campaign.category.split('-');

        var newItem = {
          name: campaign.name,
          publisher: campaign.publisher,
          category: campaign.category,
          price: campaign.price,
          quantity: campaign.quantity,
          position: true
        };

        var vm = this;
        this.Campaign.update({ id: campaign.campaignid }, { campaignName: campaign.campaignName,
          startDate: dateArray[0],
          endDate: dateArray[1],
          items: newItem }).$promise.then(function (res) {}, function (error) {
          // error handler
          if (error) {
            vm.Toast.show({
              type: 'error',
              text: error.data.errors.status.message
            });
          } else {
            vm.Toast.show({
              type: 'success',
              text: error.statusText
            });
          }
        });
      }
    }]);

    return CampaignsController;
  }();

  angular.module('mediaboxApp').controller('CampaignsController', CampaignsController);
})();
//# sourceMappingURL=campaigns.controller.js.map

'use strict';

angular.module('mediaboxApp').config(function ($stateProvider) {
  $stateProvider.state('campaigns', {
    url: '/campaigns',
    templateUrl: 'app/campaigns/campaigns.html',
    controller: 'CampaignsController as campaigns',
    authenticate: 'manager'
  });
});
//# sourceMappingURL=campaigns.js.map

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var CampaignsCompletedController = function () {
    function CampaignsCompletedController(Cart, Country, Auth, PaymentMethod, Shipping, Coupon, Campaign, Toast, Settings, $state, $scope, $loading, Upload, $timeout, $http, socket, $mdDialog) {
      _classCallCheck(this, CampaignsCompletedController);

      $loading.start("campaigns");
      var vm = this;
      vm.itemsGrid = [];
      this.campaignStatusLov = Campaign.status;
      this.Campaign = Campaign;
      this.Toast = Toast;
      this.Settings = Settings;
      this.$state = $state;
      this.options = {};
      //this.campaigns = Campaign.query();
      this.campaignStatus = [{ name: '', val: 402 }, { name: 'Approved', val: 305 }, { name: 'Reject', val: 500 }];

      this.campaignStatusCreativeAdded = [{ name: 'Completed', val: 309 }];

      this.campaigns = Campaign.pub.query({}, function (res) {
        var totalCampaign = res.length;

        res.totalCampaign = totalCampaign;
        console.log(totalCampaign);
        $loading.finish("campaigns");

        // }
        // res.total = total;
      });

      vm.mediaLibrary = function (index) {
        $mdDialog.show({
          template: '<md-dialog aria-label="Media Library" ng-cloak flex="95">\n        <md-toolbar class="md-warn">\n          <div class="md-toolbar-tools">\n            <h2>Media Library</h2>\n            <span flex></span>\n            <md-button class="md-icon-button" ng-click="cancel()">\n              <ng-md-icon icon="close" aria-label="Close dialog"></ng-md-icon>\n            </md-button>\n          </div>\n        </md-toolbar>\n\n        <md-dialog-content>\n            <div class="md-dialog-content padding"  class="md-whiteframe-z2">\n                <md-grid-list class="media-list" md-cols-xs ="3" md-cols-sm="4" md-cols-md="5" md-cols-lg="7" md-cols-gt-lg="10" md-row-height-gt-md="1:1" md-row-height="4:3" md-gutter="12px" md-gutter-gt-sm="8px" layout="row" layout-align="center center">\n                  <md-grid-tile ng-repeat="i in media" class="md-whiteframe-z2" ng-click="ok(i.path)">\n                    <div class="thumbnail">\n                        <img ng-src="{{i.path}}" draggable="false" alt="{{i.name}}">\n                    </div>\n                    <md-grid-tile-footer><h3>{{i.name}}</h3></md-grid-tile-footer>\n                  </md-grid-tile>\n                </md-grid-list>\n          </div>\n        </md-dialog-content>\n        <md-dialog-actions layout="row">\n          <span flex></span>\n          <md-button ng-click="addNewImage()" class="md-warn md-raised">\n           Add new Creative\n          </md-button>\n        </md-dialog-actions>\n      </md-dialog>\n',
          controller: function controller($scope, $mdDialog, $http, socket, $state) {
            // Start query the database for the table
            var vm = this;
            $scope.loading = true;
            $http.get('/api/media/').then(function (res) {
              $scope.loading = false;
              $scope.media = res.data;
              socket.syncUpdates('media', $scope.data);
            }, handleError);

            function handleError(error) {
              // error handler
              $scope.loading = false;
              if (error.status === 403) {
                Toast.show({
                  type: 'error',
                  text: 'Not authorised to make changes.'
                });
              } else {
                Toast.show({
                  type: 'error',
                  text: error.status
                });
              }
            }
            $scope.ok = function (path) {
              $mdDialog.hide(path);
            };
            $scope.hide = function () {
              $mdDialog.hide();
            };
            $scope.cancel = function () {
              $mdDialog.cancel();
            };
            $scope.addNewImage = function () {
              $state.go('media');
              //vm.save(vm.product)
              $mdDialog.hide();
            };
          }

        }).then(function (answer) {
          console.log(answer);
          if (index === 1000000) vm.cart.items.push({ size: 'x', creative: answer });else vm.cart.items[index].creative = answer;
        }, function () {});
      };

      vm.imageDetails = function (img) {
        $mdDialog.show({
          template: '\n    <md-dialog aria-label="Image Details Dialog"  ng-cloak>\n  <md-toolbar>\n    <div class="md-toolbar-tools">\n      <h2>Media Details</h2>\n      <span flex></span>\n      <md-button class="md-icon-button" ng-click="cancel()">\n        <ng-md-icon icon="close" aria-label="Close dialog"></ng-md-icon>\n      </md-button>\n    </div>\n  </md-toolbar>\n  <md-dialog-content>\n    <div class="md-dialog-content">\n      <div layout="row" class="md-whiteframe-z2">\n        <div class="flexbox-container">\n          <div>\n            <img ng-src="{{img}}" draggable="false"  class="detail-image"/>\n          </div>\n          </div>\n      </div>\n  </md-dialog-content>\n  <md-dialog-actions layout="row">\n    <span flex></span>\n    <md-button ng-click="delete(img)" class="md-warn">\n     Delete Permanently\n    </md-button>\n  </md-dialog-actions>\n</md-dialog>\n',
          controller: function controller($scope, $mdDialog) {
            $scope.img = img;
            $scope.delete = function (img) {
              var confirm = $mdDialog.confirm().title('Would you like to delete the media permanently?').textContent('Media once deleted can not be undone.').ariaLabel('Delete Media').ok('Please do it!').cancel('Cancel');
              $mdDialog.show(confirm).then(function () {
                $http.delete('/api/media/' + img._id).then(function () {
                  $mdDialog.hide();
                }, handleError);
              }, function () {
                $mdDialog.hide();
              });
            };
            $scope.hide = function () {
              $mdDialog.hide();
            };
            $scope.cancel = function () {
              $mdDialog.cancel();
            };
          }
        }).then(function (answer) {
          $scope.alert = 'You said the information was "' + answer + '".';
        }, function () {
          $scope.alert = 'You cancelled the dialog.';
        });
      };

      this.itemsGrid = [];

      this.mainGridOptions = {
        dataSource: {

          transport: {
            read: function read(options) {
              //options holds the grids current page and filter settings
              var qFinished = {};
              qFinished.where = { $and: [{ 'items.publisheruid': Auth.getCurrentUser().email }, { 'items.endDate': { $lt: Date.now() } }, { 'status': 'Campaign Accepted' }] };
              Campaign.pub.query(qFinished, function (res) {

                for (var j = 0; j < res.length; j++) {
                  var total = 0;
                  var item = res[j];
                  for (var i = 0; i < item.items.length; i++) {

                    var p = item.items[i].price;
                    var q = item.items[i].quantity;
                    total += p * q;
                  }

                  res[j].total = total;
                }

                options.success(res);
                // console.log(res);
              });
            }
          },
          pageSize: 10,
          serverPaging: true,
          serverSorting: true
        },
        toolbar: ['excel', 'pdf'],

        excel: {
          allPages: true,
          proxyURL: "//demos.telerik.com/kendo-ui/service/export",
          fileName: 'Mediabox-campaigns.xlsx',
          filterable: true
        },
        pdf: {
          allPages: true,
          avoidLinks: true,
          paperSize: "A4",
          margin: { top: "2cm", left: "1cm", right: "1cm", bottom: "1cm" },
          landscape: true,
          repeatHeaders: true,
          template: $("#page-template").html(),
          scale: 0.8
        },
        sortable: true,
        pageable: true,

        filterable: true,

        dataBound: function dataBound() {
          this.expandRow(this.tbody.find("tr.k-master-row").first());
        },
        columns: [//{ field: "items[0].advertiser.company", title: "Advertiser" },
        //{ field: "campaignNo", title: "Campaign ID" },
        { field: "campaignName", title: "Campaign Name" }, { field: "created_at", title: "Campaign Date", type: 'datetime', template: "#=  (created_at == null)? '' : kendo.toString(kendo.parseDate(created_at, 'yyyy-MM-dd'), 'MM/dd/yy') #" },
        //{ field: "endDate", title: "End Date",type: 'datetime',template: "#=  (endDate == null)? '' : kendo.toString(kendo.parseDate(endDate, 'yyyy-MM-dd'), 'MM/dd/yy') #" },
        { field: "total", title: "Total", template: function template(dataItem) {
            return "<div></span><span style='display:inline-block;width:75%;text-align:left;white-space:nowrap;'>$ " + dataItem.total + "</span></div>";
          } }, { field: "status", title: "Status" }]
      };

      this.detailGridOptions = function (dataItem) {

        this.dataItem = dataItem;
        this.uCampaign = dataItem;
        console.log(this.dataItem);

        return {
          dataSource: {
            filter: { field: "id", operator: "eq", value: dataItem.id },
            transport: {
              read: function read(options) {
                //options holds the grids current page and filter settings
                var itemsGrid = [];
                var qFinished = {};
                qFinished.where = { $and: [{ 'items.publisheruid': Auth.getCurrentUser().email }, { 'items.endDate': { $lt: Date.now() } }, { 'status': 'Campaign Accepted' }] };
                Campaign.pub.query(qFinished, function (res) {
                  //console.log(res);


                  var totalFinal = 0;
                  var totalCampaign = res.length;

                  for (var j = 0; j < res.length; j++) {
                    var total = 0;

                    var item = res[j];
                    for (var i = 0; i < item.items.length; i++) {

                      var itemGridTemp = {
                        campaignNo: item.campaignNo,
                        id: item._id,
                        advertiser: item.items[i].advertiser,
                        category: item.items[i].category,
                        creative: item.items[i].creative,
                        image: item.items[i].image,
                        messages: item.items[i].messages,
                        mrp: item.items[i].mrp,
                        name: item.items[i].name,
                        price: item.items[i].price,
                        publisher: item.items[i].publisher,
                        quantity: item.items[i].quantity,
                        request: item.items[i].request,
                        size: item.items[i].size,
                        sku: item.items[i].sku,
                        status: item.items[i].status,
                        uid: item.items[i].uid
                      };

                      var p = item.items[i].price;
                      var q = item.items[i].quantity;
                      total += p * q;

                      vm.itemsGrid.push(itemGridTemp);
                    }

                    res[j].total = total;
                  }

                  res.totalFinal = total;

                  var data = [];
                  //console.log(vm.itemsGrid);
                  for (var i = 0; i < vm.itemsGrid.length; i++) {
                    var item = vm.itemsGrid[i];
                    if (item.campaignNo == dataItem.campaignNo) {
                      //alert(item.campaignNo);
                      data.push(item);
                    }

                    options.success(data);
                    console.log(data);

                    vm.data = [];
                  }

                  vm.itemsGrid = [];
                });
              }
            },
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            pageSize: 5,
            filterable: true

          },
          scrollable: false,
          sortable: true,

          pageable: true,
          columns: [
          //{ field: "campaignNo", title:"Campaign #", width: "70px" },
          //{ field: "email", title:"Email", width: "70px" },
          { field: "publisher", title: "Publisher", width: "100px" }, { field: "name", title: "Name", width: "70px" }, { field: "category", title: "Dates", width: "70px" }, {
            field: "price",
            title: "Price",
            width: "50px",

            template: function template(dataItem) {
              return "<div><span style='display:inline-block;width:75%;text-align:left;white-space:nowrap;'>$" + dataItem.price + "</span></div>";
            } }, { field: "quantity", title: "Quantity", width: "50px" }, {
            field: "creative",
            title: "Creative",
            width: "50px",
            template: function template(dataItem) {
              return "<div ng-hide=\"dataItem.creative\">" + "<button  class=\"btn btn-danger\" ng-hide=\"isAdmin()\" ng-click=\"vm.mediaLibrary(dataItem)\" ><i class=\"fa fa-image\"></i><span class=\"glyphicon glyphicon-upload\"></span></button></div>" + "</div>" + "<div ng-show=\"dataItem.creative\">" + "<button  class=\"btn btn-success\" ng-hide=\"isAdmin()\" ng-click=\"vm.imageDetails(dataItem.creative)\" ><i class=\"fa fa-image\"></i><span class=\"glyphicon glyphicon-upload\"></span></button></div>" + "</div>";
              //return "<div> <button  class=\"btn btn-danger\"  ng-click=\"vm.open(cart.items,item,item.creative,'md')\" ><i class=\"fa fa-image\"></i><span class=\"glyphicon glyphicon-upload\"></span></button></div>";
            } },
          //    { 
          //      field: "status.name", 
          //      title: "Status", 
          //      width: "40px" ,
          //      template: function (dataItem) {
          //      return "<div ng-show= \"dataItem.status.val=='305'\" class=\"alert alert-success\"><small>Approved</small></div>"+
          //         // "<div ng-show=\"!dataItem.creative\" class=\"alert alert-danger\" ><small>Needs Creative</small></div>"+
          //          "<div  ng-show = \"dataItem.status.val=='402'\" class=\"alert alert-danger\" ><small>Pending<small></div>"+
          //       "<div  ng-show = \"dataItem.status.val=='300'\" class=\"alert alert-success\" ><small>Ready</small> </div>"+
          //      "<div  ng-show = \"dataItem.status.val=='500'\" class=\"alert alert-danger\" ><small>Rejected</small> </div>"+
          //        "<div  ng-show = \"dataItem.status.val=='309'\" class=\"alert alert-success\" ><small>Completed</small> </div>";
          // } 

          //    },
          {
            title: "Action",
            width: "50px",
            template: function template(dataItem) {
              //return "<div ng-show= \"dataItem.status.val=='305'\"><button class=\"btn-success btn-sm btn-success\" ng-click=\"cart.addItem({sku:dataItem.sku, name:dataItem.name,slug:adspace.formart,mrp:dataItem.mrp, weight:dataItem.maxSize,size:dataItem.size,price:dataItem.price , publisher:dataItem.publisher,uid:dataItem.uid,category:dataItem.category,image:dataItem.image,quantity:1} ,true);\" ng-show=\"checkCart(dataItem.name)\"><i class=\"fa fa-shopping-cart\" ></i></button></div>";
              // return "<button class=\"btn-success btn-sm btn-success\" ng-click=\"goToSite(site)\">Buy</button>";
              return "<div  ng-if = \"dataItem.status.val=='402'\">" + "<select ng-model=\"dataItem.status\" ng-options=\"p.name for p in vm.campaignStatus track by p.val\" ng-change=\"vm.action(dataItem)\" class=\"k-select\" style=\"max-width: 150px\"></select>" + "</div>" + "<div  ng-show = \"!dataItem.status.val=='402'\" >" + "<select ng-model=\"dataItem.status\" ng-options=\"p.name for p in vm.campaignStatusCreativeAdded track by p.val\" ng-change=\"vm.action(o)\" class=\"k-select\"  style=\"max-width: 150px\"></select>" + "</div>";
            } }]
        };
      };
    } //end constructor

    _createClass(CampaignsCompletedController, [{
      key: 'navigate',
      value: function navigate(params) {
        this.$state.go('single-product', { id: params.sku, slug: params.description }, { reload: false });
      }
    }, {
      key: 'getTotal',
      value: function getTotal(item) {
        // console.log(item);
        var total = 0;

        for (var i = 0; i < item.items.length; i++) {

          // items[i].total = 0;

          var p = item.items[i].price;
          var q = item.items[i].quantity;
          total += p * q;
          // var x.sub.push(total);
        }
        // //console.log(total);

        return total;
      }
    }, {
      key: 'action',
      value: function action(items) {

        var newStatus = { name: 'Approved', val: 305 };

        //var updated = _.merge(itemToMergeCampaign,items.itemToMergeItem);
        // method

        if (items) {
          console.log(vm.uCampaign._id);
          //vm.uCampaign.items = [];
          console.log(items);

          Campaign.update({ id: vm.uCampaign._id }, items).$promise.then(function (res) {
            //console.log(res);
            toastr.success("Campaign has been Approved", "Success");
          }, function (error) {
            // error handler
            //console.log(error);
            if (error.data.errors) {
              var err = error.data.errors;
              toastr.error(err[Object.keys(err)].message, err[Object.keys(err)].name);
            } else {
              var msg = error.data.message;
              toastr.error(msg);
            }
          });
        }
      }
    }, {
      key: 'changeStatus',
      value: function changeStatus(campaign) {
        var vm = this;
        var vm = this;
        this.Campaign.update({ id: campaign._id }, campaign).$promise.then(function (res) {}, function (error) {
          // error handler
          if (error.data.errors) {
            vm.Toast.show({
              type: 'error',
              text: error.data.errors.status.message
            });
          } else {
            vm.Toast.show({
              type: 'success',
              text: error.statusText
            });
          }
        });
      }
    }]);

    return CampaignsCompletedController;
  }();

  angular.module('mediaboxApp').controller('CampaignsCompletedController', CampaignsCompletedController);
})();
//# sourceMappingURL=campaignsCompleted.controller.js.map

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var CampaignsRunningController = function () {
    function CampaignsRunningController(Cart, Country, Auth, PaymentMethod, Shipping, Coupon, Campaign, Toast, Settings, $state, $scope, $loading, Upload, $timeout, $http, socket, $mdDialog) {
      _classCallCheck(this, CampaignsRunningController);

      $loading.start("campaigns");
      var vm = this;
      vm.itemsGrid = [];
      this.campaignStatusLov = Campaign.status;
      this.Campaign = Campaign;
      this.Toast = Toast;
      this.Settings = Settings;
      this.$state = $state;
      this.options = {};
      //this.campaigns = Campaign.query();
      this.campaignStatus = [{ name: '', val: 402 }, { name: 'Approved', val: 305 }, { name: 'Reject', val: 500 }];

      this.campaignStatusCreativeAdded = [{ name: 'Completed', val: 309 }];

      this.campaigns = Campaign.pub.query({}, function (res) {
        var totalCampaign = res.length;

        res.totalCampaign = totalCampaign;
        console.log(totalCampaign);
        $loading.finish("campaigns");

        // }
        // res.total = total;
      });

      vm.mediaLibrary = function (index) {
        $mdDialog.show({
          template: '<md-dialog aria-label="Media Library" ng-cloak flex="95">\n        <md-toolbar class="md-warn">\n          <div class="md-toolbar-tools">\n            <h2>Media Library</h2>\n            <span flex></span>\n            <md-button class="md-icon-button" ng-click="cancel()">\n              <ng-md-icon icon="close" aria-label="Close dialog"></ng-md-icon>\n            </md-button>\n          </div>\n        </md-toolbar>\n\n        <md-dialog-content>\n            <div class="md-dialog-content padding"  class="md-whiteframe-z2">\n                <md-grid-list class="media-list" md-cols-xs ="3" md-cols-sm="4" md-cols-md="5" md-cols-lg="7" md-cols-gt-lg="10" md-row-height-gt-md="1:1" md-row-height="4:3" md-gutter="12px" md-gutter-gt-sm="8px" layout="row" layout-align="center center">\n                  <md-grid-tile ng-repeat="i in media" class="md-whiteframe-z2" ng-click="ok(i.path)">\n                    <div class="thumbnail">\n                        <img ng-src="{{i.path}}" draggable="false" alt="{{i.name}}">\n                    </div>\n                    <md-grid-tile-footer><h3>{{i.name}}</h3></md-grid-tile-footer>\n                  </md-grid-tile>\n                </md-grid-list>\n          </div>\n        </md-dialog-content>\n        <md-dialog-actions layout="row">\n          <span flex></span>\n          <md-button ng-click="addNewImage()" class="md-warn md-raised">\n           Add new Creative\n          </md-button>\n        </md-dialog-actions>\n      </md-dialog>\n',
          controller: function controller($scope, $mdDialog, $http, socket, $state) {
            // Start query the database for the table
            var vm = this;
            $scope.loading = true;
            $http.get('/api/media/').then(function (res) {
              $scope.loading = false;
              $scope.media = res.data;
              socket.syncUpdates('media', $scope.data);
            }, handleError);

            function handleError(error) {
              // error handler
              $scope.loading = false;
              if (error.status === 403) {
                Toast.show({
                  type: 'error',
                  text: 'Not authorised to make changes.'
                });
              } else {
                Toast.show({
                  type: 'error',
                  text: error.status
                });
              }
            }
            $scope.ok = function (path) {
              $mdDialog.hide(path);
            };
            $scope.hide = function () {
              $mdDialog.hide();
            };
            $scope.cancel = function () {
              $mdDialog.cancel();
            };
            $scope.addNewImage = function () {
              $state.go('media');
              //vm.save(vm.product)
              $mdDialog.hide();
            };
          }

        }).then(function (answer) {
          console.log(answer);
          if (index === 1000000) vm.cart.items.push({ size: 'x', creative: answer });else vm.cart.items[index].creative = answer;
        }, function () {});
      };

      vm.imageDetails = function (img) {
        $mdDialog.show({
          template: '\n    <md-dialog aria-label="Image Details Dialog"  ng-cloak>\n  <md-toolbar>\n    <div class="md-toolbar-tools">\n      <h2>Media Details</h2>\n      <span flex></span>\n      <md-button class="md-icon-button" ng-click="cancel()">\n        <ng-md-icon icon="close" aria-label="Close dialog"></ng-md-icon>\n      </md-button>\n    </div>\n  </md-toolbar>\n  <md-dialog-content>\n    <div class="md-dialog-content">\n      <div layout="row" class="md-whiteframe-z2">\n        <div class="flexbox-container">\n          <div>\n            <img ng-src="{{img}}" draggable="false"  class="detail-image"/>\n          </div>\n          </div>\n      </div>\n  </md-dialog-content>\n  <md-dialog-actions layout="row">\n    <span flex></span>\n    <md-button ng-click="delete(img)" class="md-warn">\n     Delete Permanently\n    </md-button>\n  </md-dialog-actions>\n</md-dialog>\n',
          controller: function controller($scope, $mdDialog) {
            $scope.img = img;
            $scope.delete = function (img) {
              var confirm = $mdDialog.confirm().title('Would you like to delete the media permanently?').textContent('Media once deleted can not be undone.').ariaLabel('Delete Media').ok('Please do it!').cancel('Cancel');
              $mdDialog.show(confirm).then(function () {
                $http.delete('/api/media/' + img._id).then(function () {
                  $mdDialog.hide();
                }, handleError);
              }, function () {
                $mdDialog.hide();
              });
            };
            $scope.hide = function () {
              $mdDialog.hide();
            };
            $scope.cancel = function () {
              $mdDialog.cancel();
            };
          }
        }).then(function (answer) {
          $scope.alert = 'You said the information was "' + answer + '".';
        }, function () {
          $scope.alert = 'You cancelled the dialog.';
        });
      };

      this.itemsGrid = [];

      this.mainGridOptions = {
        dataSource: {

          transport: {
            read: function read(options) {
              //options holds the grids current page and filter settings
              var qRunning = {};
              qRunning.where = { $and: [{ 'items.publisheruid': Auth.getCurrentUser().email }, { 'items.startDate': { $lt: Date.now() } }, { 'items.endDate': { $gt: Date.now() } }, { 'status': 'Campaign Accepted' }] };
              Campaign.pub.query(qRunning, function (res) {

                for (var j = 0; j < res.length; j++) {
                  var total = 0;
                  var item = res[j];
                  for (var i = 0; i < item.items.length; i++) {

                    var p = item.items[i].price;
                    var q = item.items[i].quantity;
                    total += p * q;
                  }

                  res[j].total = total;
                }

                options.success(res);
                // console.log(res);
              });
            }
          },
          pageSize: 10,
          serverPaging: true,
          serverSorting: true
        },
        toolbar: ['excel', 'pdf'],

        excel: {
          allPages: true,
          proxyURL: "//demos.telerik.com/kendo-ui/service/export",
          fileName: 'Mediabox-campaigns.xlsx',
          filterable: true
        },
        pdf: {
          allPages: true,
          avoidLinks: true,
          paperSize: "A4",
          margin: { top: "2cm", left: "1cm", right: "1cm", bottom: "1cm" },
          landscape: true,
          repeatHeaders: true,
          template: $("#page-template").html(),
          scale: 0.8
        },
        sortable: true,
        pageable: true,

        filterable: true,

        dataBound: function dataBound() {
          this.expandRow(this.tbody.find("tr.k-master-row").first());
        },
        columns: [//{ field: "items[0].advertiser.company", title: "Advertiser" },
        //{ field: "campaignNo", title: "Campaign ID" },
        { field: "campaignName", title: "Campaign Name" }, { field: "created_at", title: "Campaign Date", type: 'datetime', template: "#=  (created_at == null)? '' : kendo.toString(kendo.parseDate(created_at, 'yyyy-MM-dd'), 'MM/dd/yy') #" },
        //{ field: "endDate", title: "End Date",type: 'datetime',template: "#=  (endDate == null)? '' : kendo.toString(kendo.parseDate(endDate, 'yyyy-MM-dd'), 'MM/dd/yy') #" },
        { field: "total", title: "Total", template: function template(dataItem) {
            return "<div></span><span style='display:inline-block;width:75%;text-align:left;white-space:nowrap;'>$ " + dataItem.total + "</span></div>";
          } }, { field: "status", title: "Status" }]
      };

      this.detailGridOptions = function (dataItem) {

        this.dataItem = dataItem;
        this.uCampaign = dataItem;
        console.log(this.dataItem);

        return {
          dataSource: {
            filter: { field: "id", operator: "eq", value: dataItem.id },
            transport: {
              read: function read(options) {
                //options holds the grids current page and filter settings
                var itemsGrid = [];
                var qRunning = {};
                qRunning.where = { $and: [{ 'items.publisheruid': Auth.getCurrentUser().email }, { 'items.startDate': { $lt: Date.now() } }, { 'items.endDate': { $gt: Date.now() } }, { 'status': 'Campaign Accepted' }] };
                Campaign.pub.query(qRunning, function (res) {
                  //console.log(res);


                  var totalFinal = 0;
                  var totalCampaign = res.length;

                  for (var j = 0; j < res.length; j++) {
                    var total = 0;

                    var item = res[j];
                    for (var i = 0; i < item.items.length; i++) {

                      var itemGridTemp = {
                        campaignNo: item.campaignNo,
                        id: item._id,
                        advertiser: item.items[i].advertiser,
                        category: item.items[i].category,
                        creative: item.items[i].creative,
                        image: item.items[i].image,
                        messages: item.items[i].messages,
                        mrp: item.items[i].mrp,
                        name: item.items[i].name,
                        price: item.items[i].price,
                        publisher: item.items[i].publisher,
                        quantity: item.items[i].quantity,
                        request: item.items[i].request,
                        size: item.items[i].size,
                        sku: item.items[i].sku,
                        status: item.items[i].status,
                        uid: item.items[i].uid
                      };

                      var p = item.items[i].price;
                      var q = item.items[i].quantity;
                      total += p * q;

                      vm.itemsGrid.push(itemGridTemp);
                    }

                    res[j].total = total;
                  }

                  res.totalFinal = total;

                  var data = [];
                  //console.log(vm.itemsGrid);
                  for (var i = 0; i < vm.itemsGrid.length; i++) {
                    var item = vm.itemsGrid[i];
                    if (item.campaignNo == dataItem.campaignNo) {
                      //alert(item.campaignNo);
                      data.push(item);
                    }

                    options.success(data);
                    console.log(data);

                    vm.data = [];
                  }

                  vm.itemsGrid = [];
                });
              }
            },
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            pageSize: 5,
            filterable: true

          },
          scrollable: false,
          sortable: true,

          pageable: true,
          columns: [
          //{ field: "campaignNo", title:"Campaign #", width: "70px" },
          //{ field: "email", title:"Email", width: "70px" },
          { field: "publisher", title: "Publisher", width: "100px" }, { field: "name", title: "Name", width: "70px" }, { field: "category", title: "Dates", width: "70px" }, {
            field: "price",
            title: "Price",
            width: "50px",

            template: function template(dataItem) {
              return "<div><span style='display:inline-block;width:75%;text-align:left;white-space:nowrap;'>$" + dataItem.price + "</span></div>";
            } }, { field: "quantity", title: "Quantity", width: "50px" }, {
            field: "creative",
            title: "Creative",
            width: "50px",
            template: function template(dataItem) {
              return "<div ng-hide=\"dataItem.creative\">" + "<button  class=\"btn btn-danger\" ng-hide=\"isAdmin()\" ng-click=\"vm.mediaLibrary(dataItem)\" ><i class=\"fa fa-image\"></i><span class=\"glyphicon glyphicon-upload\"></span></button></div>" + "</div>" + "<div ng-show=\"dataItem.creative\">" + "<button  class=\"btn btn-success\" ng-hide=\"isAdmin()\" ng-click=\"vm.imageDetails(dataItem.creative)\" ><i class=\"fa fa-image\"></i><span class=\"glyphicon glyphicon-upload\"></span></button></div>" + "</div>";
              //return "<div> <button  class=\"btn btn-danger\"  ng-click=\"vm.open(cart.items,item,item.creative,'md')\" ><i class=\"fa fa-image\"></i><span class=\"glyphicon glyphicon-upload\"></span></button></div>";
            } },
          //    { 
          //      field: "status.name", 
          //      title: "Status", 
          //      width: "40px" ,
          //      template: function (dataItem) {
          //      return "<div ng-show= \"dataItem.status.val=='305'\" class=\"alert alert-success\"><small>Approved</small></div>"+
          //         // "<div ng-show=\"!dataItem.creative\" class=\"alert alert-danger\" ><small>Needs Creative</small></div>"+
          //          "<div  ng-show = \"dataItem.status.val=='402'\" class=\"alert alert-danger\" ><small>Pending<small></div>"+
          //       "<div  ng-show = \"dataItem.status.val=='300'\" class=\"alert alert-success\" ><small>Ready</small> </div>"+
          //      "<div  ng-show = \"dataItem.status.val=='500'\" class=\"alert alert-danger\" ><small>Rejected</small> </div>"+
          //        "<div  ng-show = \"dataItem.status.val=='309'\" class=\"alert alert-success\" ><small>Completed</small> </div>";
          // } 

          //    },
          {
            title: "Action",
            width: "50px",
            template: function template(dataItem) {
              //return "<div ng-show= \"dataItem.status.val=='305'\"><button class=\"btn-success btn-sm btn-success\" ng-click=\"cart.addItem({sku:dataItem.sku, name:dataItem.name,slug:adspace.formart,mrp:dataItem.mrp, weight:dataItem.maxSize,size:dataItem.size,price:dataItem.price , publisher:dataItem.publisher,uid:dataItem.uid,category:dataItem.category,image:dataItem.image,quantity:1} ,true);\" ng-show=\"checkCart(dataItem.name)\"><i class=\"fa fa-shopping-cart\" ></i></button></div>";
              // return "<button class=\"btn-success btn-sm btn-success\" ng-click=\"goToSite(site)\">Buy</button>";
              return "<div  ng-if = \"dataItem.status.val=='402'\">" + "<select ng-model=\"dataItem.status\" ng-options=\"p.name for p in vm.campaignStatus track by p.val\" ng-change=\"vm.action(dataItem)\" class=\"k-select\" style=\"max-width: 150px\"></select>" + "</div>" + "<div  ng-show = \"!dataItem.status.val=='402'\" >" + "<select ng-model=\"dataItem.status\" ng-options=\"p.name for p in vm.campaignStatusCreativeAdded track by p.val\" ng-change=\"vm.action(o)\" class=\"k-select\"  style=\"max-width: 150px\"></select>" + "</div>";
            } }]
        };
      };
    } //end constructor

    _createClass(CampaignsRunningController, [{
      key: 'navigate',
      value: function navigate(params) {
        this.$state.go('single-product', { id: params.sku, slug: params.description }, { reload: false });
      }
    }, {
      key: 'getTotal',
      value: function getTotal(item) {
        // console.log(item);
        var total = 0;

        for (var i = 0; i < item.items.length; i++) {

          // items[i].total = 0;

          var p = item.items[i].price;
          var q = item.items[i].quantity;
          total += p * q;
          // var x.sub.push(total);
        }
        // //console.log(total);

        return total;
      }
    }, {
      key: 'action',
      value: function action(items) {

        var newStatus = { name: 'Approved', val: 305 };

        //var updated = _.merge(itemToMergeCampaign,items.itemToMergeItem);
        // method

        if (items) {
          console.log(vm.uCampaign._id);
          //vm.uCampaign.items = [];
          console.log(items);

          Campaign.update({ id: vm.uCampaign._id }, items).$promise.then(function (res) {
            //console.log(res);
            toastr.success("Campaign has been Approved", "Success");
          }, function (error) {
            // error handler
            //console.log(error);
            if (error.data.errors) {
              var err = error.data.errors;
              toastr.error(err[Object.keys(err)].message, err[Object.keys(err)].name);
            } else {
              var msg = error.data.message;
              toastr.error(msg);
            }
          });
        }
      }
    }, {
      key: 'changeStatus',
      value: function changeStatus(campaign) {
        var vm = this;
        var vm = this;
        this.Campaign.update({ id: campaign._id }, campaign).$promise.then(function (res) {}, function (error) {
          // error handler
          if (error.data.errors) {
            vm.Toast.show({
              type: 'error',
              text: error.data.errors.status.message
            });
          } else {
            vm.Toast.show({
              type: 'success',
              text: error.statusText
            });
          }
        });
      }
    }]);

    return CampaignsRunningController;
  }();

  angular.module('mediaboxApp').controller('CampaignsRunningController', CampaignsRunningController);
})();
//# sourceMappingURL=campaignsRunning.controller.js.map

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var CampaignsScheduledController = function () {
    function CampaignsScheduledController(Cart, Country, Auth, PaymentMethod, Shipping, Coupon, Campaign, Toast, Settings, $state, $scope, $loading, Upload, $timeout, $http, socket, $mdDialog) {
      _classCallCheck(this, CampaignsScheduledController);

      $loading.start("campaigns");
      var vm = this;
      vm.itemsGrid = [];
      this.campaignStatusLov = Campaign.status;
      this.Campaign = Campaign;
      this.Toast = Toast;
      this.Settings = Settings;
      this.$state = $state;
      this.options = {};
      //this.campaigns = Campaign.query();
      this.campaignStatus = [{ name: '', val: 402 }, { name: 'Approved', val: 305 }, { name: 'Reject', val: 500 }];

      this.campaignStatusCreativeAdded = [{ name: 'Completed', val: 309 }];

      this.campaigns = Campaign.pub.query({}, function (res) {
        var totalCampaign = res.length;

        res.totalCampaign = totalCampaign;
        console.log(totalCampaign);
        $loading.finish("campaigns");

        // }
        // res.total = total;
      });

      vm.mediaLibrary = function (index) {
        $mdDialog.show({
          template: '<md-dialog aria-label="Media Library" ng-cloak flex="95">\n        <md-toolbar class="md-warn">\n          <div class="md-toolbar-tools">\n            <h2>Media Library</h2>\n            <span flex></span>\n            <md-button class="md-icon-button" ng-click="cancel()">\n              <ng-md-icon icon="close" aria-label="Close dialog"></ng-md-icon>\n            </md-button>\n          </div>\n        </md-toolbar>\n\n        <md-dialog-content>\n            <div class="md-dialog-content padding"  class="md-whiteframe-z2">\n                <md-grid-list class="media-list" md-cols-xs ="3" md-cols-sm="4" md-cols-md="5" md-cols-lg="7" md-cols-gt-lg="10" md-row-height-gt-md="1:1" md-row-height="4:3" md-gutter="12px" md-gutter-gt-sm="8px" layout="row" layout-align="center center">\n                  <md-grid-tile ng-repeat="i in media" class="md-whiteframe-z2" ng-click="ok(i.path)">\n                    <div class="thumbnail">\n                        <img ng-src="{{i.path}}" draggable="false" alt="{{i.name}}">\n                    </div>\n                    <md-grid-tile-footer><h3>{{i.name}}</h3></md-grid-tile-footer>\n                  </md-grid-tile>\n                </md-grid-list>\n          </div>\n        </md-dialog-content>\n        <md-dialog-actions layout="row">\n          <span flex></span>\n          <md-button ng-click="addNewImage()" class="md-warn md-raised">\n           Add new Creative\n          </md-button>\n        </md-dialog-actions>\n      </md-dialog>\n',
          controller: function controller($scope, $mdDialog, $http, socket, $state) {
            // Start query the database for the table
            var vm = this;
            $scope.loading = true;
            $http.get('/api/media/').then(function (res) {
              $scope.loading = false;
              $scope.media = res.data;
              socket.syncUpdates('media', $scope.data);
            }, handleError);

            function handleError(error) {
              // error handler
              $scope.loading = false;
              if (error.status === 403) {
                Toast.show({
                  type: 'error',
                  text: 'Not authorised to make changes.'
                });
              } else {
                Toast.show({
                  type: 'error',
                  text: error.status
                });
              }
            }
            $scope.ok = function (path) {
              $mdDialog.hide(path);
            };
            $scope.hide = function () {
              $mdDialog.hide();
            };
            $scope.cancel = function () {
              $mdDialog.cancel();
            };
            $scope.addNewImage = function () {
              $state.go('media');
              //vm.save(vm.product)
              $mdDialog.hide();
            };
          }

        }).then(function (answer) {
          console.log(answer);
          if (index === 1000000) vm.cart.items.push({ size: 'x', creative: answer });else vm.cart.items[index].creative = answer;
        }, function () {});
      };

      vm.imageDetails = function (img) {
        $mdDialog.show({
          template: '\n    <md-dialog aria-label="Image Details Dialog"  ng-cloak>\n  <md-toolbar>\n    <div class="md-toolbar-tools">\n      <h2>Media Details</h2>\n      <span flex></span>\n      <md-button class="md-icon-button" ng-click="cancel()">\n        <ng-md-icon icon="close" aria-label="Close dialog"></ng-md-icon>\n      </md-button>\n    </div>\n  </md-toolbar>\n  <md-dialog-content>\n    <div class="md-dialog-content">\n      <div layout="row" class="md-whiteframe-z2">\n        <div class="flexbox-container">\n          <div>\n            <img ng-src="{{img}}" draggable="false"  class="detail-image"/>\n          </div>\n          </div>\n      </div>\n  </md-dialog-content>\n  <md-dialog-actions layout="row">\n    <span flex></span>\n    <md-button ng-click="delete(img)" class="md-warn">\n     Delete Permanently\n    </md-button>\n  </md-dialog-actions>\n</md-dialog>\n',
          controller: function controller($scope, $mdDialog) {
            $scope.img = img;
            $scope.delete = function (img) {
              var confirm = $mdDialog.confirm().title('Would you like to delete the media permanently?').textContent('Media once deleted can not be undone.').ariaLabel('Delete Media').ok('Please do it!').cancel('Cancel');
              $mdDialog.show(confirm).then(function () {
                $http.delete('/api/media/' + img._id).then(function () {
                  $mdDialog.hide();
                }, handleError);
              }, function () {
                $mdDialog.hide();
              });
            };
            $scope.hide = function () {
              $mdDialog.hide();
            };
            $scope.cancel = function () {
              $mdDialog.cancel();
            };
          }
        }).then(function (answer) {
          $scope.alert = 'You said the information was "' + answer + '".';
        }, function () {
          $scope.alert = 'You cancelled the dialog.';
        });
      };

      this.itemsGrid = [];

      this.mainGridOptions = {
        dataSource: {

          transport: {
            read: function read(options) {
              //options holds the grids current page and filter settings
              var qScheduled = {};
              qScheduled.where = { $and: [{ 'items.publisheruid': Auth.getCurrentUser().email }, { 'items.startDate': { $gt: Date.now() } }, { 'status': 'Campaign Accepted' }] };
              Campaign.pub.query(qScheduled, function (res) {

                for (var j = 0; j < res.length; j++) {
                  var total = 0;
                  var item = res[j];
                  for (var i = 0; i < item.items.length; i++) {

                    var p = item.items[i].price;
                    var q = item.items[i].quantity;
                    total += p * q;
                  }

                  res[j].total = total;
                }

                options.success(res);
                // console.log(res);
              });
            }
          },
          pageSize: 10,
          serverPaging: true,
          serverSorting: true
        },
        toolbar: ['excel', 'pdf'],

        excel: {
          allPages: true,
          proxyURL: "//demos.telerik.com/kendo-ui/service/export",
          fileName: 'Mediabox-campaigns.xlsx',
          filterable: true
        },
        pdf: {
          allPages: true,
          avoidLinks: true,
          paperSize: "A4",
          margin: { top: "2cm", left: "1cm", right: "1cm", bottom: "1cm" },
          landscape: true,
          repeatHeaders: true,
          template: $("#page-template").html(),
          scale: 0.8
        },
        sortable: true,
        pageable: true,

        filterable: true,

        dataBound: function dataBound() {
          this.expandRow(this.tbody.find("tr.k-master-row").first());
        },
        columns: [//{ field: "items[0].advertiser.company", title: "Advertiser" },
        //{ field: "campaignNo", title: "Campaign ID" },
        { field: "campaignName", title: "Campaign Name" }, { field: "created_at", title: "Campaign Date", type: 'datetime', template: "#=  (created_at == null)? '' : kendo.toString(kendo.parseDate(created_at, 'yyyy-MM-dd'), 'MM/dd/yy') #" },
        //{ field: "endDate", title: "End Date",type: 'datetime',template: "#=  (endDate == null)? '' : kendo.toString(kendo.parseDate(endDate, 'yyyy-MM-dd'), 'MM/dd/yy') #" },
        { field: "total", title: "Total", template: function template(dataItem) {
            return "<div></span><span style='display:inline-block;width:75%;text-align:left;white-space:nowrap;'>$ " + dataItem.total + "</span></div>";
          } },
        /// { field: "status", title: "Status" },
        { field: "status", title: "Status", template: function template(dataItem) {
            return " <span class=\"md-subhead\"><md-select ng-model=\"dataItem.status\"  ng-change=\"vm.changeStatus(dataItem)\" flex><md-option ng-value=\"o\" ng-repeat=\"o in vm.Settings.campaignStatus\">{{o}}</md-option></md-select></span>";
            // return "<div  ng-if = \"dataItem.status =='Campaign Placed'\">"+
            //  "<md-select ng-model=\"dataItem.status\" value=\"dataItem.status\" ng-options=\"p.name for p in vm.campaignStatus track by p.val\" ng-change=\"vm.action(dataItem)\" class=\"k-select\" style=\"max-width: 150px\"></md-select>"+
            //   "</div>"+

            //  "<div  ng-show = \"!dataItem.status.val=='402'\" >"+
            //  "<select ng-model=\"dataItem.status\" ng-options=\"p.name for p in vm.campaignStatusCreativeAdded track by p.val\" ng-change=\"vm.action(o)\" class=\"k-select\"  style=\"max-width: 150px\"></select>"+
            //  "</div>"; 
          } }]
      };

      this.detailGridOptions = function (dataItem) {

        this.dataItem = dataItem;
        this.uCampaign = dataItem;
        console.log(this.dataItem);

        return {
          dataSource: {
            filter: { field: "id", operator: "eq", value: dataItem.id },
            transport: {
              read: function read(options) {
                //options holds the grids current page and filter settings
                var itemsGrid = [];
                var qScheduled = {};
                qScheduled.where = { $and: [{ 'items.publisheruid': Auth.getCurrentUser().email }, { 'items.startDate': { $gt: Date.now() } }, { 'status': 'Campaign Accepted' }] };
                Campaign.pub.query(qScheduled, function (res) {

                  var totalFinal = 0;
                  var totalCampaign = res.length;

                  for (var j = 0; j < res.length; j++) {
                    var total = 0;

                    var item = res[j];
                    for (var i = 0; i < item.items.length; i++) {

                      var itemGridTemp = {
                        campaignNo: item.campaignNo,
                        id: item._id,
                        advertiser: item.items[i].advertiser,
                        category: item.items[i].category,
                        creative: item.items[i].creative,
                        image: item.items[i].image,
                        messages: item.items[i].messages,
                        mrp: item.items[i].mrp,
                        name: item.items[i].name,
                        price: item.items[i].price,
                        publisher: item.items[i].publisher,
                        quantity: item.items[i].quantity,
                        request: item.items[i].request,
                        size: item.items[i].size,
                        sku: item.items[i].sku,
                        status: item.items[i].status,
                        uid: item.items[i].uid
                      };

                      var p = item.items[i].price;
                      var q = item.items[i].quantity;
                      total += p * q;

                      vm.itemsGrid.push(itemGridTemp);
                    }

                    res[j].total = total;
                  }

                  res.totalFinal = total;

                  var data = [];
                  //console.log(vm.itemsGrid);
                  for (var i = 0; i < vm.itemsGrid.length; i++) {
                    var item = vm.itemsGrid[i];
                    if (item.campaignNo == dataItem.campaignNo) {
                      //alert(item.campaignNo);
                      data.push(item);
                    }

                    options.success(data);
                    console.log(data);

                    vm.data = [];
                  }

                  vm.itemsGrid = [];
                });
              }
            },
            serverPaging: true,
            serverSorting: true,
            serverFiltering: true,
            pageSize: 5,
            filterable: true

          },
          scrollable: false,
          sortable: true,

          pageable: true,
          columns: [
          //{ field: "campaignNo", title:"Campaign #", width: "70px" },
          //{ field: "email", title:"Email", width: "70px" },
          { field: "publisher", title: "Publisher", width: "100px" }, { field: "name", title: "Name", width: "70px" }, { field: "category", title: "Dates", width: "70px" }, {
            field: "price",
            title: "Price",
            width: "50px",

            template: function template(dataItem) {
              return "<div><span style='display:inline-block;width:75%;text-align:left;white-space:nowrap;'>$" + dataItem.price + "</span></div>";
            } }, { field: "quantity", title: "Quantity", width: "50px" }, {
            field: "creative",
            title: "Creative",
            width: "50px",
            template: function template(dataItem) {
              return "<div ng-hide=\"dataItem.creative\">" + "<button  class=\"btn btn-danger\" ng-hide=\"isAdmin()\" ng-click=\"vm.mediaLibrary(dataItem)\" ><i class=\"fa fa-image\"></i><span class=\"glyphicon glyphicon-upload\"></span></button></div>" + "</div>" + "<div ng-show=\"dataItem.creative\">" + "<button  class=\"btn btn-success\" ng-hide=\"isAdmin()\" ng-click=\"vm.imageDetails(dataItem.creative)\" ><i class=\"fa fa-image\"></i><span class=\"glyphicon glyphicon-upload\"></span></button></div>" + "</div>";
              //return "<div> <button  class=\"btn btn-danger\"  ng-click=\"vm.open(cart.items,item,item.creative,'md')\" ><i class=\"fa fa-image\"></i><span class=\"glyphicon glyphicon-upload\"></span></button></div>";
            } },
          //    { 
          //      field: "status.name", 
          //      title: "Status", 
          //      width: "40px" ,
          //      template: function (dataItem) {
          //      return "<div ng-show= \"dataItem.status.val=='305'\" class=\"alert alert-success\"><small>Approved</small></div>"+
          //         // "<div ng-show=\"!dataItem.creative\" class=\"alert alert-danger\" ><small>Needs Creative</small></div>"+
          //          "<div  ng-show = \"dataItem.status.val=='402'\" class=\"alert alert-danger\" ><small>Pending<small></div>"+
          //       "<div  ng-show = \"dataItem.status.val=='300'\" class=\"alert alert-success\" ><small>Ready</small> </div>"+
          //      "<div  ng-show = \"dataItem.status.val=='500'\" class=\"alert alert-danger\" ><small>Rejected</small> </div>"+
          //        "<div  ng-show = \"dataItem.status.val=='309'\" class=\"alert alert-success\" ><small>Completed</small> </div>";
          // } 

          //    },
          {
            title: "Action",
            width: "50px",
            template: function template(dataItem) {
              //return "<div ng-show= \"dataItem.status.val=='305'\"><button class=\"btn-success btn-sm btn-success\" ng-click=\"cart.addItem({sku:dataItem.sku, name:dataItem.name,slug:adspace.formart,mrp:dataItem.mrp, weight:dataItem.maxSize,size:dataItem.size,price:dataItem.price , publisher:dataItem.publisher,uid:dataItem.uid,category:dataItem.category,image:dataItem.image,quantity:1} ,true);\" ng-show=\"checkCart(dataItem.name)\"><i class=\"fa fa-shopping-cart\" ></i></button></div>";
              // return "<button class=\"btn-success btn-sm btn-success\" ng-click=\"goToSite(site)\">Buy</button>";
              return "<div  ng-if = \"dataItem.status.val=='402'\">" + "<select ng-model=\"dataItem.status\" ng-options=\"p.name for p in vm.campaignStatus track by p.val\" ng-change=\"vm.action(dataItem)\" class=\"k-select\" style=\"max-width: 150px\"></select>" + "</div>" + "<div  ng-show = \"!dataItem.status.val=='402'\" >" + "<select ng-model=\"dataItem.status\" ng-options=\"p.name for p in vm.campaignStatusCreativeAdded track by p.val\" ng-change=\"vm.action(o)\" class=\"k-select\"  style=\"max-width: 150px\"></select>" + "</div>";
            } }]
        };
      };
    } //end constructor

    _createClass(CampaignsScheduledController, [{
      key: 'navigate',
      value: function navigate(params) {
        this.$state.go('single-product', { id: params.sku, slug: params.description }, { reload: false });
      }
    }, {
      key: 'getTotal',
      value: function getTotal(item) {
        // console.log(item);
        var total = 0;

        for (var i = 0; i < item.items.length; i++) {

          // items[i].total = 0;

          var p = item.items[i].price;
          var q = item.items[i].quantity;
          total += p * q;
          // var x.sub.push(total);
        }
        // //console.log(total);

        return total;
      }
    }, {
      key: 'action',
      value: function action(items) {

        var newStatus = { name: 'Approved', val: 305 };

        //var updated = _.merge(itemToMergeCampaign,items.itemToMergeItem);
        // method

        if (items) {
          console.log(vm.uCampaign._id);
          //vm.uCampaign.items = [];
          console.log(items);

          Campaign.update({ id: vm.uCampaign._id }, items).$promise.then(function (res) {
            //console.log(res);
            toastr.success("Campaign has been Approved", "Success");
          }, function (error) {
            // error handler
            //console.log(error);
            if (error.data.errors) {
              var err = error.data.errors;
              toastr.error(err[Object.keys(err)].message, err[Object.keys(err)].name);
            } else {
              var msg = error.data.message;
              toastr.error(msg);
            }
          });
        }
      }
    }, {
      key: 'changeStatus',
      value: function changeStatus(campaign) {
        var vm = this;
        var vm = this;
        this.Campaign.update({ id: campaign._id }, campaign).$promise.then(function (res) {}, function (error) {
          // error handler
          if (error.data.errors) {
            vm.Toast.show({
              type: 'error',
              text: error.data.errors.status.message
            });
          } else {
            vm.Toast.show({
              type: 'success',
              text: error.statusText
            });
          }
        });
      }
    }]);

    return CampaignsScheduledController;
  }();

  angular.module('mediaboxApp').controller('CampaignsScheduledController', CampaignsScheduledController);
})();
//# sourceMappingURL=campaignsScheduled.controller.js.map

'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var CartController = function CartController(ToggleComponent, $filter, Media, Auth, Toast, Campaign, Settings, Cart, SweetAlert, Category, Brand, Product, $state, $stateParams, $mdMedia, $mdDialog) {
    _classCallCheck(this, CartController);

    var vm = this;

    /* autocomplete */
    vm.simulateQuery = true;
    vm.querySearch = querySearch;
    vm.selectedItemChange = selectedItemChange;
    vm.searchTextChange = searchTextChange;
    vm.products = [];
    vm.product = {};
    vm.product.variants = [];
    vm.cart = Cart.cart;
    vm.Settings = Settings;
    vm.$mdMedia = $mdMedia;
    vm.$filter = $filter;
    vm.Media = Media;
    this.Media = Media;
    vm.Toast = Toast;

    console.log(vm.cart);
    // var productId = localStorage !== null ? localStorage.productId : null;

    if ($stateParams.search) // When searched print the search text inside search textbox 
      vm.searchText = $stateParams.name;

    vm.cart.getBestShipper().$promise.then(function (data) {
      vm.shipping = data[0];
      vm.totalPriceAfterShipping = vm.cartTotal + data[0].charge;
    });

    vm.mediaLibrary = function (index) {
      $mdDialog.show({
        template: '<md-dialog aria-label="Media Library" ng-cloak flex="95">\n        <md-toolbar class="md-warn">\n          <div class="md-toolbar-tools">\n            <h2>Media Library</h2>\n            <span flex></span>\n            <md-button class="md-icon-button" ng-click="cancel()">\n              <ng-md-icon icon="close" aria-label="Close dialog"></ng-md-icon>\n            </md-button>\n          </div>\n        </md-toolbar>\n\n        <md-dialog-content>\n            <div class="md-dialog-content"  class="md-whiteframe-z2">\n                <md-grid-list class="media-list" md-cols-xs ="3" md-cols-sm="4" md-cols-md="5" md-cols-lg="7" md-cols-gt-lg="10" md-row-height-gt-md="1:1" md-row-height="4:3" md-gutter="12px" md-gutter-gt-sm="8px" layout="row" layout-align="center center">\n                  <md-grid-tile ng-repeat="i in media" class="md-whiteframe-z2" ng-click="ok(i.path)">\n                    <div class="thumbnail">\n                        <img ng-src="{{i.path}}" draggable="false" alt="{{i.name}}">\n                    </div>\n                    <md-grid-tile-footer><h3>{{i.name}}</h3></md-grid-tile-footer>\n                  </md-grid-tile>\n                </md-grid-list>\n          </div>\n        </md-dialog-content>\n        <md-dialog-actions layout="row">\n          <span flex></span>\n          <md-button ng-click="addNewImage()" class="md-warn md-raised">\n           Add new Image\n          </md-button>\n        </md-dialog-actions>\n      </md-dialog>\n',
        controller: function controller($scope, $mdDialog, $http, socket, $state) {
          // Start query the database for the table
          var vm = this;
          $scope.loading = true;
          $http.get('/api/media/').then(function (res) {
            $scope.loading = false;
            $scope.media = res.data;
            socket.syncUpdates('media', $scope.data);
          }, handleError);

          function handleError(error) {
            // error handler
            $scope.loading = false;
            if (error.status === 403) {
              Toast.show({
                type: 'error',
                text: 'Not authorised to make changes.'
              });
            } else {
              Toast.show({
                type: 'error',
                text: error.status
              });
            }
          }
          $scope.ok = function (path) {
            $mdDialog.hide(path);
          };
          $scope.hide = function () {
            $mdDialog.hide();
          };
          $scope.cancel = function () {
            $mdDialog.cancel();
          };
          $scope.addNewImage = function () {
            $state.go('media');
            //vm.save(vm.product)
            $mdDialog.hide();
          };
        }

      }).then(function (answer) {
        console.log(answer);
        if (index === 1000000) vm.cart.items.push({ size: 'x', creative: answer });else vm.cart.items[index].creative = answer;
      }, function () {});
    };

    function querySearch(input) {
      var data = [];
      if (input) {
        input = input.toLowerCase();
        data = Product.query({ where: { nameLower: { '$regex': input }, active: true }, limit: 10, skip: 0, select: { id: 1, name: 1, slug: 1, 'variants.image': 1 } });
      }
      return data;
    }

    function selectedItemChange(item) {
      $state.go('single-product', { id: item._id, slug: item.slug, search: true, name: item.name }, { reload: false });
    }
    function searchTextChange() {}
    /**
     * Create filter function for a query string
     */

    vm.isLoggedIn = Auth.isLoggedIn;
    vm.openFilter = function () {
      ToggleComponent('filtermenu').open();
    };
    vm.openCart = function () {
      ToggleComponent('cart').open();
      vm.cart.getBestShipper().$promise.then(function (data) {
        vm.shipping = data[0];
        vm.totalPriceAfterShipping = vm.cartTotal + data[0].charge;
      });
    };
    var originatorEv;
    vm.openMenu = function ($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);
    };

    vm.menu = [{
      'title': 'Home',
      'link': '/'
    }];

    vm.brands = Brand.query({ active: true });

    vm.isCollapsed = true;
    vm.isCollapsed1 = true;
    vm.getCurrentUser = Auth.getCurrentUser;

    vm.gotoDetail = function (params) {
      $state.go('single-product', { id: params.sku, slug: params.slug }, { reload: false });
    };

    vm.createCampaign = function (cart) {

      for (var i = 0; i < cart.items.length; i++) {
        cart.items[i];
        var dateArray = cart.items[i].category.split('-');
        cart.items[i].startDate = dateArray[0];
        cart.items[i].endDate = dateArray[1];
      }

      console.log(cart);

      var newCampaign = {
        campaignNo: cart.campaignNo,
        cartName: cart.campaignName,
        skuArray: cart.skuArray,
        totalWeight: cart.totalWeight,
        taxRate: cart.taxRate,
        tax: cart.tax,
        campaignName: cart.campaignName,
        objective: cart.objective,
        startDate: cart.startDate,
        endDate: cart.endDate,
        products: cart.products,
        totalSpend: cart.totalSpend,
        spendStats: cart.spendStats,
        shipping: cart.shipping,
        age: cart.age,
        uid: cart.uid,
        income: cart.income,
        items: cart.items

      };

      console.log(newCampaign);

      if (cart.campaignName == "") {

        swal('Oops...', 'Campaign name is required!', 'error');
      } else {

        var mytable = "<table class=\"table table-striped table-responsive\">" + "<tr>" + "<td class=\"col-sm-4\" style=\"text-align:left\">Publisher</td>" + "<td class=\"col-sm-6\" style=\"text-align:left\">Ad Space</td>" +
        //"<td class=\"col-sm-3\" style=\"text-align:left\">Dates</td>"+
        "<td class=\"col-sm-1\" style=\"text-align:left\">Price</td>" + "<td class=\"col-sm-1\" style=\"text-align:left\">Inserts</td>" + "</tr></tbody>";

        for (var i = 0; i < cart.items.length; i++) {

          mytable += "<tr><td class=\"col-sm-4\" style=\"text-align:left\">" + cart.items[i].publisher + "</td>" + "<td class=\"col-sm-6\" style=\"text-align:left\">" + cart.items[i].name + "</td>" +
          // "<td class=\"col-sm-3\" style=\"text-align:left\">"+cart.items[i].category+"</td>"+
          "<td class=\"col-sm-1\" style=\"text-align:left\">" + vm.Settings.currency.symbol + parseFloat(cart.items[i].price) + "</td>" + "<td class=\"col-sm-1\" style=\"text-align:left\">" + cart.items[i].quantity + "</td>" + "</tr>";
        }

        mytable += "<tr>" + "<td class=\"col-sm-2\" style=\"text-align:left\">SubTotal</td>" + "<td class=\"col-sm-4\" style=\"text-align:left\">" + vm.Settings.currency.symbol + parseFloat(cart.getTotalPrice()) + "</td>" + "<td class=\"col-sm-4\" style=\"text-align:left\">&nbsp;</td>" + "<td class=\"col-sm-1\" style=\"text-align:left\">&nbsp;</td>" + "<td class=\"col-sm-1\" style=\"text-align:left\">&nbsp;</td></tr>";

        mytable += "</tbody></table>";

        swal({
          title: 'Confirm to continue',
          text: "A proposal will be send to the publisher(s)!",
          type: 'warning',
          html: mytable,
          width: '600px',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, Continue!',
          cancelButtonText: 'No, cancel!',
          confirmButtonClass: 'btn btn-success',
          cancelButtonClass: 'btn btn-danger',
          buttonsStyling: false
        }).then(function (vm) {
          setTimeout(function (vm) {

            swal("proposal Send!", "Your proposal has been send ,you will get response from the publisher within 7 working days!", "success");

            var vm = this;
            Campaign.save(newCampaign).$promise.then(function (res) {

              var vm = this;
              for (var i = 0; i < newCampaign.items.length; i++) {
                var vm = this;
                var item = newCampaign.items[i];

                console.log(item);

                Media.update({ id: item.creative }, { pub: item.uid }).$promise.then(function (res) {}, function (error) {
                  // error handler
                  // 
                  console.log(error);
                  if (error.data.errors.status.message == 'not found') {
                    Toast.show({
                      type: 'error',
                      text: "Creative not found"
                    });
                  } else if (error.data.errors) {
                    Toast.show({
                      type: 'error',
                      text: error.data.errors.status.message
                    });
                  } else {
                    Toast.show({
                      type: 'success',
                      text: error.statusText
                    });
                  }
                });
              }

              $state.go('campaign');
            });
          }, 2000);
        }, function (dismiss) {
          // dismiss can be 'cancel', 'overlay',
          // 'close', and 'timer'
          if (dismiss === 'cancel') {
            swal("Cancelled", "Process cancelled :)", "error");
          }
        });
      }
    };

    vm.getQuantity = function (sku) {
      for (var i = 0; i < vm.cart.items.length; i++) {
        if (vm.cart.items[i].sku === sku) {
          return vm.cart.items[i].quantity;
        }
      }
    };

    vm.getQuantity = function (sku) {
      for (var i = 0; i < vm.cart.items.length; i++) {
        if (vm.cart.items[i].sku === sku) {
          return vm.cart.items[i].quantity;
        }
      }
    };
    vm.toggle = function (item, list) {
      //   console.log(item,list);
      if (angular.isUndefined(list)) list = [];
      var idx = list.indexOf(item);
      if (idx > -1) list.splice(idx, 1);else list.push(item);
      vm.filter();
    };

    vm.categories = Category.loaded.query();

    console.log(vm.categories);

    vm.close = function () {
      ToggleComponent('cart').close();
    };
  };

  angular.module('mediaboxApp').controller('CartController', CartController);
})();
//# sourceMappingURL=cart.controller.js.map

'use strict';

angular.module('mediaboxApp').config(function ($stateProvider) {
  $stateProvider.state('cart', {
    url: '/cart',
    templateUrl: 'app/cart/cart.html',
    controller: 'CartController as cart',
    authenticate: true
  });
});
//# sourceMappingURL=cart.js.map

'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var CategoryComponent = function CategoryComponent(Modal) {
    _classCallCheck(this, CategoryComponent);

    this.message = 'Hello';
  };

  angular.module('mediaboxApp').component('category', {
    templateUrl: 'app/category/category.html',
    controller: CategoryComponent
  });
})();
//# sourceMappingURL=category.controller.js.map

'use strict';

// angular.module('mediaboxApp')
//   .config(function ($stateProvider) {
//     $stateProvider
//       .state('category', {
//         url: '/category',
//         template: '<category></category>'
//       });
//   });


angular.module('mediaboxApp').config(function ($stateProvider) {
  $stateProvider.state('category', {
    url: '/category',
    params: { options: null, columns: null },
    views: {
      '': {
        templateUrl: 'app/category/main.html',
        controller: 'CategoriesMainController as main'
      },
      'content@category': {
        url: '/content',
        templateUrl: 'app/category/list.html',
        controller: 'CategoriesListController as list'
      }
    },
    authenticate: 'manager'
  }).state('category-detail', {
    url: '/category-detail/:id',
    onEnter: onEnterUserListDetail, // To open right sidebar
    params: { category: null, categories: null, brands: null, features: null },
    parent: 'category',
    views: {
      '': {
        templateUrl: 'app/category/main.html'
      },
      'detail': {
        templateUrl: 'app/category/detail.html',
        controller: 'CategoriesDetailController as detail'
      }
    },
    authenticate: 'manager'
  }).state('categories-create', {
    url: '/categories-create',
    parent: 'categories',
    params: { data: null },
    views: {
      '': {}
    },
    authenticate: 'manager'
  });
  function resolveIdFromArray($stateParams) {
    return { '_id': $stateParams.id, 'api': $stateParams.api };
  }

  onEnterUserListDetail.$inject = ['$timeout', 'ToggleComponent'];

  function onEnterUserListDetail($timeout, ToggleComponent) {
    $timeout(showDetails, 0, false);

    function showDetails() {
      ToggleComponent('categories.detailView').open();
    }
  }
});
//# sourceMappingURL=category.js.map

'use strict';

(function () {

  function CategoriesDetailController($http, $state, Toast, $stateParams, ToggleComponent, Settings, $mdDialog, socket) {
    var vm = this;
    vm.myDate = new Date();
    vm.header = 'cat';
    vm.cat = {};
    vm.options = {};
    vm.cat.subcat = [];
    vm.cat.newSubCat = {};
    vm.cat.features = [];
    vm.cat.keyFeatures = [];
    vm.unsavedCategory = $stateParams.categories;
    vm.category = angular.copy($stateParams.categories);
    vm.options.categories = angular.copy($stateParams.categories);

    vm.mediaLibrary = function (index) {
      $mdDialog.show({
        template: '<md-dialog aria-label="Media Library" ng-cloak flex="95">\n        <md-toolbar class="md-warn">\n          <div class="md-toolbar-tools">\n            <h2>Media Library</h2>\n            <span flex></span>\n            <md-button class="md-icon-button" ng-click="cancel()">\n              <ng-md-icon icon="close" aria-label="Close dialog"></ng-md-icon>\n            </md-button>\n          </div>\n        </md-toolbar>\n\n        <md-dialog-content>\n            <div class="md-dialog-content"  class="md-whiteframe-z2">\n                <md-grid-list class="media-list" md-cols-xs ="3" md-cols-sm="4" md-cols-md="5" md-cols-lg="7" md-cols-gt-lg="10" md-row-height-gt-md="1:1" md-row-height="4:3" md-gutter="12px" md-gutter-gt-sm="8px" layout="row" layout-align="center center">\n                  <md-grid-tile ng-repeat="i in media" class="md-whiteframe-z2" ng-click="ok(i.path)">\n                \t\t<div class="thumbnail">\n                \t\t\t\t<img ng-src="{{i.path}}" draggable="false" alt="{{i.name}}">\n                \t\t</div>\n                    <md-grid-tile-footer><h3>{{i.name}}</h3></md-grid-tile-footer>\n                  </md-grid-tile>\n                </md-grid-list>\n          </div>\n        </md-dialog-content>\n        <md-dialog-actions layout="row">\n          <span flex></span>\n          <md-button ng-click="addNewImage()" class="md-warn md-raised">\n           Add new Image\n          </md-button>\n        </md-dialog-actions>\n      </md-dialog>\n',
        controller: function controller($scope, $mdDialog, $http, socket, $state) {
          function handleError(error) {
            // error handler
            $scope.loading = false;
            if (error.status === 403) {
              Toast.show({
                type: 'error',
                text: 'Not authorised to make changes.'
              });
            } else {
              Toast.show({
                type: 'error',
                text: error.status
              });
            }
          }

          // Start query the database for the table
          $scope.loading = true;
          $http.get('/api/media/').then(function (res) {
            $scope.loading = false;
            $scope.media = res.data;
            socket.syncUpdates('media', $scope.data);
          }, handleError);

          $scope.ok = function (path) {
            $mdDialog.hide(path);
          };
          $scope.hide = function () {
            $mdDialog.hide();
          };
          $scope.cancel = function () {
            $mdDialog.cancel();
          };
          $scope.addNewImage = function () {
            $state.go('media');
            vm.save(vm.cat);
            $mdDialog.hide();
          };
        }

      }).then(function (answer) {
        vm.cat.subcat[index].image = answer;
      }, function () {});
    };

    // goBack.$inject = ['ToggleComponent'];
    function goBack() {
      ToggleComponent('categories.detailView').close();
      $state.go('^', {}, { location: false });
    }
    vm.goBack = goBack;

    vm.save = function (cat) {
      // refuse to work with invalid data
      if (!cat) {
        Toast.show({
          type: 'error',
          text: 'No cat defined.'
        });
        return;
      }
      if ('newSubCat' in cat) {
        vm.cat.subcat.push(cat.newSubCat);
      }

      function success() {
        vm.cat.newSubCat = {};
        Toast.show({
          type: 'success',
          text: 'Category has been updated'
        });
      };

      function err(err) {
        console.log(err);
        if (cat && err) {}

        Toast.show({
          type: 'warn',
          text: 'Error while updating database'
        });
      };

      $http.patch('/api/categories/' + cat._id, cat).then(success).catch(err);
    };

    vm.deleteFeature = function (index, cat) {
      vm.cat.features.splice(index, 1);
      vm.save(cat);
    };

    vm.deleteKF = function (index, cat) {
      vm.cat.keyFeatures.splice(index, 1);
      vm.save(cat);
    };

    vm.deleteVariants = function (index, cat) {
      vm.cat.subcat.splice(index, 1);
      vm.save(cat);
    };
  }

  angular.module('mediaboxApp').controller('CategoriesDetailController', CategoriesDetailController);
})();
//# sourceMappingURL=detail.controller.js.map

'use strict';

(function () {

  function CategoriesListController($scope, $http, socket, $state, $stateParams, Modal, Toast, Settings, Category, $location, $anchorScroll, $mdDialog) {
    this.cols = [
    // {field: 'image', heading: 'image'},
    { field: 'edit', heading: 'Action' }, { field: 'name', heading: 'name' }, { field: 'status', heading: 'status' }];
    this.header = 'Categories';
    this.sort = {};
    this.$mdDialog = $mdDialog;
    var vm = this;
    vm.loading = true;
    // vm.Cat = Cat;
    // the selected item id
    var _id = null;
    var originatorEv;

    // Tabs
    var selected = null,
        previous = null;
    // this.tabs = tabs;
    $scope.newSubItem = function (scope) {
      var nodeData = scope.$modelValue;
      nodeData.child.push({
        id: nodeData.id * 10 + nodeData.child.length,
        title: nodeData.title + '.' + (nodeData.child.length + 1),
        child: []
      });
    };

    $scope.visible = function (item) {
      return !($scope.query && $scope.query.length > 0 && item.title.indexOf($scope.query) === -1);
    };

    $scope.findNodes = function () {};

    this.getCategories = function () {
      vm.loading = true;
      $http.get('/api/categories').then(function (res) {
        vm.loading = false;
        vm.data = res.data;
        // socket.syncUpdates('category', vm.data);
      }, handleError);
    };

    this.remove = function (scope, node) {
      var confirm = this.$mdDialog.confirm().title('Are you sure to delete the category?').textContent('This is unrecoverable').ariaLabel('Confirm delete category').ok('Please do it!').cancel('No. keep');

      this.$mdDialog.show(confirm).then(function () {
        scope.remove();
        $http.delete('/api/categories/' + node._id, node);
      });
    };

    vm.toggle = function (scope) {
      scope.toggle();
    };

    $scope.treeOptions = {
      dropped: function dropped(event) {
        var sourceNode = event.source.nodeScope;
        var op = event.source.nodesScope.$nodeScope;
        var destNodes = event.dest.nodesScope;
        var sortBefore = event.source.index + 1;
        var sortAfter = event.dest.index + 1;
        var np = destNodes.$parent;
        var me = sourceNode.$modelValue;
        var oldParent = null;
        var newParent = null;
        // var oldParentId = null;
        if (!_.isNull(op)) {
          // If I had a oldParent (If I was already assigned to a oldParent) 
          // Update oldParent's child reference
          oldParent = op.$modelValue;
          $http.put('/api/categories/' + oldParent._id, oldParent).then().catch(err);
        }
        if (!_.isUndefined(np) && !_.isNull(np)) {
          // If I have a newParent now
          // Update my new parent's child reference
          newParent = np.$modelValue;

          $http.put('/api/categories/' + newParent._id, newParent).then().catch(err);
          me.parent = newParent._id;
        }

        $http.put('/api/categories/' + me._id, me).then(vm.getCategories).catch(err);
        // I was recently created or not under any parent
      }

    };

    this.selectedIndex = 2;
    $scope.$watch('selectedIndex', function (current, old) {
      previous = selected;
    });

    // Add new category
    this.addTab = function (category) {
      $http.post('/api/categories', category).then(function (res) {
        vm.loading = false;
        vm.getCategories();
        $location.hash('bottom');
        $anchorScroll();
      }, handleError);
    };

    this.sort.reverse = true;
    this.order = function (predicate) {
      this.sort.reverse = this.sort.predicate === predicate ? !this.sort.reverse : false;
      this.sort.predicate = predicate;
    };

    this.l = 10;
    this.loadMore = function () {
      this.l += 2;
    };

    this.exportData = function (type) {
      var data = JSON.stringify(this.data, undefined, 2);
      var blob;
      if (type === 'txt') {
        // Save as .txt
        blob = new Blob([data], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, 'cat.txt');
      } else if (type === 'csv') {
        // Save as .csv
        blob = new Blob([document.getElementById('exportable').innerHTML], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' });
        saveAs(blob, 'cat.csv');
      } else if (type === 'xls') {
        // Save as xls
        blob = new Blob([document.getElementById('exportable').innerHTML], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
        });
        saveAs(blob, 'cat.xls');
      } else {
        // Save as .json
        blob = new Blob([data], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, 'cat.json');
      }
    };

    this.openMenu = function ($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);
    };
    vm.isSelected = function (cat) {
      return _id === cat._id;
    };

    // Start query the database for categories
    vm.loading = true;
    $http.get('/api/categories').then(function (res) {
      vm.loading = false;
      vm.data = res.data;
    }, handleError);

    // Start query the database for brands
    vm.loading = true;
    $http.get('/api/brands').then(function (res) {
      vm.loading = false;
      vm.brands = res.data;
      socket.syncUpdates('brand', vm.brands);
    }, handleError);

    this.saveSubCategory = function (i, cat) {
      if (cat) {
        i.subcat.push(cat);
      }
      $http.put('/api/categories/' + i._id, i).then(success).catch(err);
    };
    function success(res) {
      var item = vm.cat = res.data;
      Toast.show({ type: 'success', text: 'Category has been updated' });
    }

    function err(err) {
      Toast.show({ type: 'warn', text: 'Error while updating database' });
    }

    this.changeStatus = function (x) {
      $http.put('/api/categories/' + x._id, x).then(success).catch(err);
    };

    this.delete = function (data) {
      var confirm = this.$mdDialog.confirm().title('Are you sure to delete the category?').textContent('This is unrecoverable').ariaLabel('Confirm delete category').ok('Please do it!').cancel('No. keep');

      this.$mdDialog.show(confirm).then(function () {
        $http.delete('/api/categories/' + data._id).then(function () {}, handleError);
      });
    };

    function handleError(error) {
      // error handler
      vm.loading = false;
      if (error.status === 403) {
        Toast.show({ type: 'error', text: 'Not authorised to make changes.' });
      } else if (err.type !== 'demo') {
        Toast.show({ type: 'error', text: error.status });
      }
    }

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('categories');
    });

    this.showInDetails = function (item) {
      _id = item._id;
      $state.go('category-detail', { categories: item }, { location: false });
    };
  }

  angular.module('mediaboxApp').controller('CategoriesListController', CategoriesListController);
})();
//# sourceMappingURL=list.controller.js.map

'use strict';

(function () {

  function CategoriesMainController(Modal, $stateParams) {
    // var options = {api:'cat'};
    // var cols = [{field: 'name', heading:'Name'}];
    // this.create = function(){
    //   Modal.show(cols,options);
    // }
  }

  angular.module('mediaboxApp').controller('CategoriesMainController', CategoriesMainController);
})();
//# sourceMappingURL=main.controller.js.map

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
    var CheckoutController = function () {
        function CheckoutController(Cart, Country, PaymentMethod, Shipping, Coupon, Order, Pay, Toast, Address, Settings, socket, $scope, Auth, $stateParams, $state, $http, $mdDialog, $window) {
            _classCallCheck(this, CheckoutController);

            var vm = this;
            this.msg = 'No items in cart.';
            this.customer = {};
            this.coupon = {};
            this.Coupon = Coupon;
            this.Shipping = Shipping;
            this.Order = Order;
            this.Pay = Pay;
            this.cart = Cart.cart;
            this.Address = Address;
            this.Auth = Auth;
            this.addr = {};
            this.order = {};
            this.$http = $http;
            this.$mdDialog = $mdDialog;
            this.$window = $window;
            this.socket = socket;
            this.Toast = Toast;
            this.Cart = Cart;
            this.newAddress = false;
            this.options = { email: 'smkorera@mediabox.co.zw' };
            this.stripeToken = {
                number: '4242424242424242',
                cvc: '123',
                exp_month: '12',
                exp_year: '2020'
            };
            PaymentMethod.active.query(function (res) {
                vm.paymentOptions = res;
                vm.options.paymentMethod = res[0];
            });
            this.Settings = Settings;
            this.getMyAddress();
            if ($stateParams.id === '404') this.payment = { id: $stateParams.id, msg: JSON.parse($stateParams.msg) };else if ($stateParams.msg) this.payment = { id: $stateParams.id, msg: [{ field: ':', issue: $stateParams.msg }] };

            this.$state = $state;
            $scope.$on('$destroy', function () {
                socket.unsyncUpdates('address');
            });
            // vm.cartTotal = Cart.cart.getTotalPrice();
            // vm.cartCount = Cart.cart.getTotalCount();
            //vm.getBestShipper()
        }

        _createClass(CheckoutController, [{
            key: 'getMyAddress',
            value: function getMyAddress() {
                var vm = this;
                vm.Address.my.query(function (res) {
                    vm.address = res;
                    vm.addr = res[0];
                    vm.options.paymentMethod = vm.paymentOptions[0];
                    vm.socket.syncUpdates('address', vm.address);
                });
            }
        }, {
            key: 'switchAddress',
            value: function switchAddress(a) {
                this.options.paymentMethod = this.paymentOptions[0];
                this.addr = a;
                // this.getBestShipper();         
            }
        }, {
            key: 'delete',
            value: function _delete(item) {
                var vm = this;
                var confirm = this.$mdDialog.confirm().title('Would you like to delete the address?').textContent('This is unrecoverable').ariaLabel('Confirm delete address').ok('Please do it!').cancel('No. keep');

                this.$mdDialog.show(confirm).then(function () {
                    vm.Address.delete({ id: item._id }, function () {}, function (res) {
                        vm.Toast.show({ type: 'error', text: res });
                    });
                });
            }
            // Setting the default country on page load
            // getBestShipper(){
            //   var vm = this;
            //   vm.Cart.cart.getBestShipper().$promise.then(function(data){
            //       vm.shipping = data[0];
            //   })
            // }

        }, {
            key: 'saveAddress',
            value: function saveAddress(data) {
                var vm = this;
                data.country = vm.Settings.country.name;
                vm.loadingAddress = true;
                if (_.has(data, '_id')) {
                    this.Address.update({ id: data._id }, data, function () {
                        vm.loadingAddress = false;
                        vm.getMyAddress();
                    }, function (err) {
                        // If rejected by auth interceptor.service
                        vm.loadingAddress = false;
                    });
                } else {
                    this.Address.save(data, function () {
                        vm.loadingAddress = false;
                        vm.getMyAddress();
                    });
                }
                vm.addressForm(false);
            }
        }, {
            key: 'addressForm',
            value: function addressForm(visible) {
                this.showAddressForm = visible;
            }
        }, {
            key: 'cancelForm',
            value: function cancelForm(addr) {
                this.showAddressForm = false;
                this.addr = this.address[0];
            }
        }, {
            key: 'checkout',
            value: function checkout(order, o, clearCart) {

                var vm = this;
                order = _.merge(order, o);
                order.options = {};
                if (!_.has(order, 'phone') || !order.phone) {
                    vm.Toast.show({ type: 'error', text: 'You need to specify an address with phone number' });
                    return;
                }

                if (!_.has(order, 'paymentMethod') || order.paymentMethod.name == undefined || o.paymentMethod.name == null || o.paymentMethod.name == "") {
                    vm.Toast.show({ type: 'error', text: 'Please select a payment method' });
                    return;
                }

                if (this.cart.items.length == 0) {
                    vm.Toast.show({ type: 'error', text: 'Your cart found empty. Please add some items' });
                }
                //order.shipping = vm.shipping.best
                if (!vm.coupon) vm.coupon = { amount: 0 };else if (!vm.coupon.amount) vm.coupon = { amount: 0 };
                order.couponAmount = vm.coupon.amount;
                order.stripeToken = vm.stripeToken;
                order.country_code = vm.Settings.country.code;
                order.currency_code = vm.Settings.currency.code;
                order.exchange_rate = vm.Settings.currency.exchange_rate;
                order.total = vm.cartTotal + this.cart.getHandlingFee() - vm.coupon.amount;
                order.email = this.Auth.getCurrentUser().email;
                order.payment = 'Pending';
                order.items = this.cart.items;
                delete order._id;
                if (true) {

                    this.loading = true;
                    this.cart.flagOff();

                    this.cart.checkout(order, clearCart);
                } else {
                    vm.Toast.show({ type: 'error', text: 'Item not available for your location' });
                }
            }
        }, {
            key: 'removeCoupon',
            value: function removeCoupon() {
                this.coupon = {};
            }
        }, {
            key: 'checkCoupon',
            value: function checkCoupon(code, cartValue) {
                var q = {};
                var vm = this;
                // x.where is required else it adds unneccessery colons which can not be parsed by the JSON parser at the Server
                q.where = { code: code, active: true, 'minimumCartValue': { $lte: cartValue } };
                this.Coupon.query(q, function (res) {
                    vm.coupon = res[0];
                });
            }
        }]);

        return CheckoutController;
    }();

    angular.module('mediaboxApp').controller('CheckoutController', CheckoutController);
})();
//# sourceMappingURL=checkout.controller.js.map

'use strict';

angular.module('mediaboxApp').config(function ($stateProvider) {
  $stateProvider.state('checkout', {
    url: '/checkout?id&msg',
    templateUrl: 'app/checkout/checkout.html',
    controller: 'CheckoutController as checkout',
    authenticate: true
  }).state('payment/prepare', {
    url: '/payment/prepare',
    authenticate: true
  });
});
//# sourceMappingURL=checkout.js.map

'use strict';

angular.module('mediaboxApp').controller('ContactCtrl', function ($scope) {
  $scope.options = [{ field: 'photo', dataType: 'image' }, { field: 'name', noEdit: true }, { field: 'email' }, { field: 'phone' }, { field: 'category', dataType: 'select', options: ['Family', 'Friends', 'Acquaintances', 'Services'] }, { field: 'active', dataType: 'boolean' }];
});
//# sourceMappingURL=contact.controller.js.map

'use strict';

angular.module('mediaboxApp').config(function ($stateProvider) {
  $stateProvider.state('contact', {
    url: '/contact',
    templateUrl: 'app/contact/contact.html',
    controller: 'ContactCtrl',
    authenticate: true,
    title: 'Contacts Manager'
  });
});
//# sourceMappingURL=contact.js.map

'use strict';

angular.module('mediaboxApp').controller('CountryCtrl', function ($scope) {
  $scope.options = [{ field: 'name' }, { field: 'dial_code' }, { field: 'code' }, { field: 'active', dataType: 'boolean' }];
});
//# sourceMappingURL=country.controller.js.map

'use strict';

angular.module('mediaboxApp').config(function ($stateProvider) {
  $stateProvider.state('country', {
    url: '/country',
    templateUrl: 'app/country/country.html',
    controller: 'CountryCtrl',
    authenticate: 'manager'
  });
});
//# sourceMappingURL=country.js.map

'use strict';

angular.module('mediaboxApp').controller('CouponCtrl', function ($scope) {
  $scope.options = [{ field: 'code' }, { field: 'amount', dataType: 'currency' }, { field: 'minimumCartValue', dataType: 'number' }, { field: 'info' }, { field: 'type' }, { field: 'active', dataType: 'boolean' }];
});
//# sourceMappingURL=coupon.controller.js.map

'use strict';

angular.module('mediaboxApp').config(function ($stateProvider) {
  $stateProvider.state('coupon', {
    url: '/coupon',
    templateUrl: 'app/coupon/coupon.html',
    controller: 'CouponCtrl',
    authenticate: 'admin'
  });
});
//# sourceMappingURL=coupon.js.map

'use strict';

angular.module('mediaboxApp').controller('CustomerCtrl', function ($scope) {
  $scope.options = [{ field: 'photo', heading: 'Image', dataType: 'image' }, { field: 'name', noSort: true, noEdit: true }, { field: 'address', dataType: 'textarea' }, { field: 'country', dataType: 'select', options: ['India', 'USA', 'Australlia', 'China', 'Japan'] }, { field: 'active', heading: 'Status', dataType: 'boolean' }];
});
//# sourceMappingURL=customer.controller.js.map

'use strict';

angular.module('mediaboxApp').config(function ($stateProvider) {
  $stateProvider.state('customer', {
    url: '/customer',
    templateUrl: 'app/customer/customer.html',
    controller: 'CustomerCtrl',
    authenticate: true
  });
});
//# sourceMappingURL=customer.js.map

'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var DashboardController = function DashboardController(Settings) {
    _classCallCheck(this, DashboardController);

    this.getColor = function ($index) {
      var _d = ($index + 1) % 11;
      var bg = '';

      switch (_d) {
        case 1:
          bg = 'red';break;
        case 2:
          bg = 'green';break;
        case 3:
          bg = 'darkBlue';break;
        case 4:
          bg = 'blue';break;
        case 5:
          bg = 'yellow';break;
        case 6:
          bg = 'pink';break;
        case 7:
          bg = 'darkBlue';break;
        case 8:
          bg = 'purple';break;
        case 9:
          bg = 'deepBlue';break;
        case 10:
          bg = 'lightPurple';break;
        default:
          bg = 'yellow';break;
      }

      return bg;
    };

    this.pages = [];
    this.pages = Settings.menu.pages;
  };

  angular.module('mediaboxApp').controller('DashboardController', DashboardController);
})();
//# sourceMappingURL=dashboard.controller.js.map

'use strict';

angular.module('mediaboxApp').config(function ($stateProvider) {
  $stateProvider.state('dashboard', {
    url: '/dashboard',
    templateUrl: 'app/dashboard/dashboard.html',
    controller: 'DashboardController',
    controllerAs: 'dashboard',
    title: 'Shop Dashboard for Admin',
    authenticate: true
  });
});
//# sourceMappingURL=dashboard.js.map

'use strict';

angular.module('mediaboxApp').controller('DocumentationCtrl', function () {
  this.topFeatures = [{ h: 'PayPal Shopping Cart', p: 'Enter your paypal app ID into settings, add products and start selling with no matter of time. This has got inbuilt multi currency support with curency conversion feature', i: 'assets/images/paypal-e9dccdb656.png' }, { h: 'MEAN Stack', p: 'Developed using the most popular MEAN(MongoDB + Express + Angular + Node) which has a RestAPI based architecture with high scallability.', i: 'assets/images/mean.png' }, { h: 'Authentication', p: 'Inbuilt authentication mechanism with role based user access and user management', i: 'assets/images/user-roles-4e6a449f54.png' }, { h: 'Material Design', p: 'Most of the components are based on Google Material designe guidelines which gives you a responsive, bold and accessible design with great amount of user interactivity', i: 'assets/images/material-design-f0a449231f.png' }, { h: 'Emails', p: 'Integration of emails at diffent levels like Order Placement, Forgot/Reset password gives a secure as well as informative feeling', i: 'assets/images/email-bdab61141f.png' }, { h: 'Modular Code', p: 'The modular application structure gives you enormous ability to modify, test and deploy easily', i: 'assets/images/code-6ff7c0abcb.png' }];
  this.why = [{ h: 'Drag and drop category selection', i: 'playlist_add', c: 'fill: #FF5722' }, { h: 'AngularJS Shopping Cart', i: 'shopping_basket', c: 'fill:#DE140E' }, { h: 'Local + OAUTH login', i: 'lock_outline', c: 'fill: #2196F3' }, { h: 'Email integration', i: 'email', c: 'fill: #FABD0E' }, { h: 'PayPal Checkout', i: 'account_balance_wallet', c: 'fill: #795548' }, { h: 'Material Design', i: 'devices', c: 'fill: #ab47bc' }, { h: 'CRUD Generator', i: 'settings', c: 'fill: #3949ab' }, { h: 'Image uploader', i: 'collections', c: 'fill: #8bc34a' }, { h: 'ReST API based backend', i: 'http', c: 'fill: #26a69a' }];

  this.future = [{ h2: 'Multivendor', p: 'Support for multiple vendors where each vendor will have their own profile to mange their orders' }, { h2: 'Social Media', p: 'Integration of social info profile of each customer' }, { h2: 'Backorders', p: 'Shoppers can order an item even if stock is 0' }, { h2: 'Additional Payment Methods', p: 'Support for more payment methods e.g. Stripe, Credit Card.' }, { h2: 'Inventory Mangement', p: 'The store owner can manage inventory with automated replenishment orders' }, { h2: 'SMS Integration', p: 'SMS for each important transaction performed' }, { h2: 'Hotkeys', p: 'Keyboard Shortcuts for regular tasks' }, { h2: 'Reviews', p: 'Product Reviews and Comments' }, { h2: 'Ratings', p: 'Product Ratings feature' }, { h2: 'Tax Management', p: 'Integrated Tax Manager' }, { h2: 'Theming', p: 'Advanced theming support for the whole website' }, { h2: 'Static Page Management', p: 'Create and edit static pages, such as Contact, About, or Support.' }, { h2: 'Returns and Refunds', p: 'Adminster and manage returns and refunds.' }];

  this.newFeatures = [{ h2: 'Coupons', p: 'Ability yo manage discount coupons on cart total', i: 'settings' }, { h2: 'Media Management', p: 'With integrated drag and drop image upload its easy to manage the images for the whole shop' }, { h2: 'NodeJS Module', p: 'ES6 module structure for serve side programming.' }, { h2: 'Order Management', p: 'PayPal integration with orders' }, { h2: 'User Roles', p: 'Role based user management for both client and server side e.g. User, Manager, Administrator' }, { h2: 'Email Integration', p: 'Now an email is sent as soon as a order is placed or payment failed' }, { h2: 'Material Design', p: 'Mobile Centered Material Designed components with accessibility support' }, { h2: 'New Design Principle', p: 'Flex based page design principle' }, { h2: 'CRUD Table', p: 'Free Material CRUD Table module comes with this Material Shop' }, { h2: 'Image Selector', p: 'Directly select image for a product from the media gallery' }, { h2: 'Cloning', p: 'Now Clone any brand, country, shipping, coupon to save time' }, { h2: 'Multi Level Category', p: 'Drag and drop category management upto 10 levels' }, { h2: 'Multi Currency', p: 'Support for additional currencies beyond US Dollars from a single settings page' }, { h2: 'Forgot Password', p: 'Forgotten password of a user or shop manager can be retrieved with a encryption based email service' }, { h2: 'Contact Page', p: 'A tiny little popup window for anybody to reach the store owner with any grievance or suggestions' }, { h2: 'PayPal', p: 'Now PayPal integration is more powerful with the managed payment status' }, { h2: 'Search', p: 'Auto-suggest, keyword product search.' }];

  this.storeFrontFeatures = [{ h2: 'MEAN', p: 'The MEAN Stack ecommerce with Material Design' }, { h2: 'AngularJS', p: 'A whole ecommerce application created using AngularJS as front end' }, { h2: 'NodeJS', p: 'The backend (server side) is backed with the awesome NodeJS framework for better speed and wide extensions support with a very large community base' }, { h2: 'MongoDB', p: 'The document based No_SQL database used for faster communication and more efficiency' }, { h2: 'Modular', p: 'Industry standard application module structure' }, { h2: 'Single Page', p: 'SPA(Single Page App) created with the power of AngularJS and ui-router' }, { h2: 'One Page Checkout', p: 'Instant and single page advance checkout system' }, { h2: 'SocketIO', p: 'Now every activity by a user or shop manger is reflected in realtime across the web app(without page reloads)' }, { h2: 'Acive/Inactive', p: 'Option to save inactive product for publishing later' }, { h2: 'Product Variants', p: 'Option to add multiple variants of a single product with different price, size and image' }, { h2: 'Product Features', p: 'Additional product details in key/value list' }, { h2: 'Featured Product Details', p: 'More product details in key/value list which need to be highlighted in the product details page' }, { h2: 'Cross Platform', p: 'Cross Platform development setup with efficient with gulp, bower, npm' }, { h2: 'Product Category', p: 'Category wise product details' }, { h2: 'Filters', p: 'Advanced features like Multiple brands selector, Prodcut type filter, price slider' }, { h2: 'OAUTH', p: 'Integrated social media login' }, { h2: 'Passwords', p: 'Reset and Change Password option' }, { h2: 'Infinite Scroll', p: 'Automatically load more products on scroll without the need of pagination' }, { h2: 'SEO friendly', p: 'SEO friendly URLs for each page' }, { h2: 'Assistive Technology', p: 'Ready for screen readers for improved assistive' }, { h2: 'Contact Form', p: 'Email service for queries/suggestions/grievances through popup contact form' }];

  this.storeBackFeatures = [{ h2: 'Manage Backoffice', p: 'Products, Categories, Brand, Order Management from admin panel with easy directives' }, { h2: 'Order Management', p: 'Manage Order and Change Status from admin panel' }, { h2: 'Product Variants', p: 'Facility for Multiple product variants (size, color, price, image)' }, { h2: 'User roles', p: '- Administrator, User, Manager' }, { h2: 'Quality Code', p: 'Secure and quality code - Takes care all single page web app standards' }, { h2: 'Secure', p: 'Securely built and prevent security attacks' }, { h2: 'CRUD Generator', p: 'Generates CRUD(Create, Read, Update, Delete) pages automatically from database.' }, { h2: 'ReST API', p: 'NodeJS based ReST API architecture' }, { h2: 'Date picker', p: 'Integrated material designed date picker for date fields' }, { h2: 'Modular Code', p: 'Code is Modular, Maintainable, Well Structured, Easy to customize, Production Ready' }, { h2: 'HTML Components Generator', p: 'Automatically generates dropdowns, datepickers, number field, toggle switch based on field types' }, { h2: 'Exportable', p: 'Easily export the table as Excel, JSON, txt format' }];
});
//# sourceMappingURL=documentation.controller.js.map

'use strict';

angular.module('mediaboxApp').config(function ($stateProvider) {
  $stateProvider.state('doc', {
    url: '/index',
    templateUrl: 'app/documentation/index.html',
    controller: 'DocumentationCtrl as doc'
  }).state('terms', {
    url: '/index/terms',
    templateUrl: 'app/documentation/install.html',
    controller: 'DocumentationCtrl as doc'
  }).state('faq', {
    url: '/index/faq',
    templateUrl: 'app/documentation/features.html',
    controller: 'DocumentationCtrl as doc'
  }).state('verified-publishers', {
    url: '/index/verified',
    templateUrl: 'app/documentation/use.html',
    controller: 'DocumentationCtrl as doc'
  });
}).directive('docMenu', function ($state) {
  return {
    restrict: 'E',
    link: function link(scope, element, attrs) {
      scope.page = $state.current.name;
    },
    template: '\n      <md-toolbar class="md-whiteframe-2dp">\n        <div class="md-toolbar-tools navbar" layout="row" layout-align="space-around center">\n          <h3><a ui-sref="/">Material Shop</a></h3>\n        <md-button ui-sref="docInstall" class="md-raised md-default md-button md-ink-ripple" flex="20" ng-hide="page==\'docInstall\'"><ng-md-icon icon="now_widgets"></ng-md-icon>Installation</md-button>\n        <md-button ui-sref="doc" class="md-raised md-default md-button md-ink-ripple" flex="20" ng-hide="page==\'doc\'"><ng-md-icon icon="star"></ng-md-icon>Highlights</md-button>\n        <md-button ui-sref="docFeatures" class="md-raised md-default md-button md-ink-ripple" flex="20" ng-hide="page==\'docFeatures\'"><ng-md-icon icon="spellcheck"></ng-md-icon>Features</md-button>\n        <md-button ui-sref="docUse" class="md-raised md-default md-button md-ink-ripple" flex="20" ng-hide="page==\'docUse\'"><ng-md-icon icon="spellcheck"></ng-md-icon>Store Use</md-button>\n        <md-button ui-sref="/" class="md-raised md-default md-button md-ink-ripple" flex="20" ng-hide="page==\'docBack\'"><ng-md-icon icon="spellcheck"></ng-md-icon>Store Demo</md-button>\n      </div>\n      </md-toolbar>\n      '
  };
}).directive('docNav', function ($state) {
  return {
    restrict: 'E',
    link: function link(scope, element, attrs) {
      scope.page = $state.current.name;
    },
    template: '\n      <md-button ui-sref="docInstall" class="md-raised md-primary md-button md-ink-ripple" ng-hide="page==\'docInstall\'"><ng-md-icon icon="now_widgets"></ng-md-icon>Installation</md-button>\n        <md-button ui-sref="doc" class="md-raised md-primary md-button md-ink-ripple"   ng-hide="page==\'doc\'"><ng-md-icon icon="star"></ng-md-icon>Highlights</md-button>\n        <md-button ui-sref="docFeatures" class="md-raised md-primary md-button md-ink-ripple" ng-hide="page==\'docFeatures\'"><ng-md-icon icon="spellcheck"></ng-md-icon>Features</md-button>\n      '
  };
});
//# sourceMappingURL=documentation.js.map

'use strict';

angular.module('mediaboxApp').controller('FeatureCtrl', function ($scope) {
  $scope.options = [{ field: 'key' }, { field: 'val' }, { field: 'active', dataType: 'boolean' }];
});
//# sourceMappingURL=feature.controller.js.map

'use strict';

angular.module('mediaboxApp').config(function ($stateProvider) {
  $stateProvider.state('feature', {
    url: '/feature',
    templateUrl: 'app/feature/feature.html',
    controller: 'FeatureCtrl',
    authenticate: 'manager'
  });
});
//# sourceMappingURL=feature.js.map

'use strict';

angular.module('mediaboxApp').controller('KeyFeatureCtrl', function ($scope) {
  $scope.options = [{ field: 'key' }, { field: 'val' }, { field: 'active', dataType: 'boolean' }];
});
//# sourceMappingURL=keyfeature.controller.js.map

'use strict';

angular.module('mediaboxApp').config(function ($stateProvider) {
  $stateProvider.state('keyfeature', {
    url: '/keyfeature',
    templateUrl: 'app/keyfeature/keyfeature.html',
    controller: 'KeyFeatureCtrl',
    authenticate: 'manager'
  });
});
//# sourceMappingURL=keyfeature.js.map

"use strict";
//# sourceMappingURL=campaign.controller.js.map

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var MainController = function () {
    function MainController($scope, $state, $stateParams, $http, $location, Cart, Product, Brand, BrandMG, BrandTV, Category, Feature, Settings, socket, $rootScope, $injector, $loading, $timeout, $mdMedia) {
      _classCallCheck(this, MainController);

      var vm = this;
      // Start query the database for products
      // this.loading = true;
      // if ($stateParams.productSku) { // != null
      //     this.product = this.store.getProduct($stateParams.productSku);
      // }
      // this
      this.$http = $http;
      this.$timeout = $timeout;
      this.$loading = $loading;
      this.$mdMedia = $mdMedia;
      this.$location = $location;
      this.$state = $state;
      this.Product = Product;
      this.product = {};
      this.products = {};
      this.filtered = {};
      this.products.busy = false;
      this.products.end = false;
      this.products.after = 0;
      this.products.items = [];
      this.fl = {};
      this.fl.brands = [];
      this.fl.categories = [];
      this.priceSlider = {};
      this.features = Feature.group.query();
      this.categories = Category.query();
      this.brands = Brand.query({ active: true });
      this.Brand = Brand;
      this.Category = Category;
      this.BrandMG = BrandMG;
      this.BrandTV = BrandTV;
      this.selected = [];
      this.$scope = $scope;
      this.$rootScope = $rootScope;
      this.$injector = $injector;
      this.Settings = Settings;
      // this.fl.brands = this.selected;
      this.sort = this.products.sort = $stateParams.sort;
      this.q = { where: { active: true }, limit: 20 };
      this.f = [];
      this.fl.features = {};
      this.resetPriceRange();

      // This is done at ui-router resolve
      // var id = $stateParams.id;
      // // Storing the product id into localStorage because the _id of the selected product which was passed as a hidden parameter from products won't available on page refresh
      // if (localStorage !== null && JSON !== null && id !== null) {
      //     localStorage.productId = id;
      // }
      // var productId = localStorage !== null ? localStorage.productId : null;

      // if (productId && productId !== 'undefined') { // To avoid product undefined error at Category/slug/id page
      //     this.product = Product.get({id:productId});
      // }


      //Range slider config
      this.priceSlider = {
        min: 0,
        max: 3000,
        options: {
          floor: 0,
          step: 1,
          translate: function translate(value) {
            return vm.Settings.currency.symbol + value;
          },
          onStart: function onStart() {
            // console.log('start slider......');
          },
          onChange: function onChange() {
            // console.log('change slider......');
          },
          onEnd: function onEnd() {
            // console.log('end slider......');
            vm.filter(vm, 'price');
          }
        }
      };

      if ('page' in $stateParams) {
        this.brands = false;
        console.log($stateParams);
        if ($stateParams.slug === 'magazines' || $stateParams.slug === 'newspapers') {
          this.brands = this.BrandMG.query({ active: true });
          console.log(this.brands);
        } else if ($stateParams.slug === 'banner' || $stateParams.slug === 'social-media') {
          this.brands = this.Brand.query({ active: true });
          console.log(this.brands);
        } else if ($stateParams.slug === 'television' || $stateParams.slug === 'cinema' || $stateParams.slug === 'radio') {
          this.brands = this.BrandTV.query({ active: true });
          console.log(this.brands);
        } else {}

        //this.brands = this.Brand.query({active:true});

        // If category or brand page

        if ($stateParams.page && $stateParams._id) {
          this.products.brand = { _id: $stateParams._id };
          this.breadcrumb = { type: $stateParams.page };
          this.generateBreadCrumb(this, $stateParams.page, $stateParams._id);
          if ($stateParams.page === 'Category') {
            this.fl.categories.push({ _id: $stateParams._id, name: $stateParams.slug });
          } else if ($stateParams.page === 'Brand') {

            this.fl.brands.push({ _id: $stateParams._id, name: $stateParams.slug });
          }
          // this.resetPriceRange(this);
        } else {
          this.q = { sort: this.sort, limit: 20 };
        }
        this.filter(this);
      } else {
        this.q = { limit: 20 };
      }

      this.scroll = function () {
        if (this.products.busy || this.products.end) {
          return;
        }
        this.products.busy = false;
        this.q.skip = this.products.after;
        this.displayProducts(this.q);
      };

      $scope.$on('$destroy', function () {
        socket.unsyncUpdates('product');
      });

      this.selectedFeatures = [];
      this.selectedSubFeatures = [];
    }
    // for the checkboxs


    _createClass(MainController, [{
      key: 'exists',
      value: function exists(item, list) {
        if (angular.isUndefined(list)) list = [];
        return list.indexOf(item) > -1;
        // this.filter(this);
      }
    }, {
      key: 'toggle',
      value: function toggle(item, list) {
        var idx = list.indexOf(item);
        if (idx > -1) list.splice(idx, 1);else list.push(item);
        this.filter(this);
      }
    }, {
      key: 'navigate',
      value: function navigate(page, params) {
        if (page === 'sort') {
          delete params.$$hashKey;
          var paramString = JSON.stringify(params);
          this.$state.go(this.$state.current, { sort: paramString }, { reload: true });
        } else if (params) {
          this.$location.replace().path(page + '/' + params.slug + '/' + params._id);
        } else {
          this.$location.replace().path('/');
        }
      }
    }, {
      key: 'gotoDetail',
      value: function gotoDetail(params) {
        this.$state.go('single-product', { id: params._id, slug: params.slug }, { reload: false });
      }
    }, {
      key: 'gotoCheckout',
      value: function gotoCheckout(params) {
        this.$state.go('checkout');
      }
    }, {
      key: 'generateBreadCrumb',
      value: function generateBreadCrumb(vm, page, id) {
        vm.breadcrumb.items = [];
        var api = vm.$injector.get(page);
        api.get({ id: id }).$promise.then(function (child) {
          vm.breadcrumb.items.push(child);
          if (page === 'Category') {
            vm.breadcrumb.items.push({ name: 'All Categories' });
          } else if (page === 'Brand') {
            vm.breadcrumb.items.push({ name: 'All Brands' });
          }
        });
      }
    }, {
      key: 'filter',
      value: function filter(vm) {
        // var q = {};
        var f = [];
        if (vm.fl.features) {
          _.forEach(vm.fl.features, function (val, key) {
            if (val.length > 0) {
              f.push({ 'features.key': key, 'features.val': { $in: val } });
            }
          });
        }

        if (vm.fl.brands) {
          if (vm.fl.brands.length > 0) {
            var brandIds = [];
            _.forEach(vm.fl.brands, function (brand) {
              brandIds.push(brand._id);
            });
            f.push({ 'brand': { $in: brandIds } });
          }
        }
        if (vm.fl.categories) {
          if (vm.fl.categories.length > 0) {
            var categoryIds = [];
            _.forEach(vm.fl.categories, function (category) {
              categoryIds.push(category._id);
            });
            f.push({ 'category': { $in: categoryIds } });
          }
        }

        f.push({ 'variants.price': { $gt: vm.priceSlider.min, $lt: vm.priceSlider.max } });

        // var vm = this;
        if (f.length > 0) {
          vm.q.where = { $and: f };
        } else {
          vm.q.where = {};
        }

        vm.displayProducts(vm.q, true);
        // vm.resetPriceRange(vm.q);
      }
    }, {
      key: 'sortNow',
      value: function sortNow(sort) {
        this.q.sort = sort;
        this.displayProducts(this.q, true);
      }
    }, {
      key: 'displayProducts',
      value: function displayProducts(q, flush) {
        var products = this.products;
        var filtered = this.filtered;
        var $loading = this.$loading;
        if (flush) {
          q.skip = 0;
          products.items = [];
          products.end = false;
          products.after = 0;
        }
        $loading.start('products');
        products.busy = true;
        var vm = this;
        this.Product.query(q, function (data) {

          for (var i = 0; i < data.length; i++) {
            var success2 = function success2(res) {
              console.log(res.data.name);
              item.startDate = res.data.name;
            };

            var err2 = function err2(err) {
              console.log(err);
              // if (product && err) {
              // }
            };

            var success = function success(res) {
              console.log(res.data.name);
              data[i].endDate = res.data.name;
            };

            var err = function err(_err) {
              console.log(_err);
              // if (product && err) {
              // }
            };

            var item = data[i];

            console.log(item.category);
            var catid = item.category;
            var brandid = item.brand;

            vm.$http.get('/api/brands/' + brandid).then(success2).catch(err2);


            vm.$http.get('/api/categories/' + catid).then(success).catch(err);


            products.items.push(data[i]);
          }
          // Products count
          filtered.count = data.length + products.after;
          if (data.length >= 5) {
            products.after = products.after + data.length;
          } else {
            products.end = true;
          }

          products.busy = false;
          $loading.finish('products');
        }, function () {
          products.busy = false;vm.$loading.finish('products');
        }).$promise.then(function () {
          vm.Product.count.query(q, function (res) {
            products.count = res[0].count;
          });
        });
      }
    }, {
      key: 'resetPriceRange',
      value: function resetPriceRange(q) {
        // Could not be implemented. Need to try again later
        var vm = this;
        vm.Product.pr.get(q, function (data) {
          vm.priceSlider.options.floor = data.min;
          vm.priceSlider.min = data.min;
          vm.priceSlider.options.ceil = data.max;
          vm.priceSlider.max = 3000;
        });
      }

      // For Price slider

    }, {
      key: 'currencyFormatting',
      value: function currencyFormatting(value) {
        return this.Settings.currency.symbol + ' ' + value.toString();
      }
    }, {
      key: 'removeFeatures',
      value: function removeFeatures(features, k, f) {
        this.fl.features[k] = _.without(features, f);
        this.filter(this);
      }
    }, {
      key: 'removeBrand',
      value: function removeBrand(brand) {
        var index = this.fl.brands.indexOf(brand);
        if (index > -1) {
          this.fl.brands.splice(index, 1);
          this.filter(this);
        }
      }
    }, {
      key: 'removeCategory',
      value: function removeCategory() {
        this.fl.categories = undefined;
        this.filter();
      }
    }, {
      key: 'handleError',
      value: function handleError(error) {
        // error handler
        this.loading = false;
        if (error.status === 403) {
          Toast.show({
            type: 'error',
            text: 'Not authorised to make changes.'
          });
        } else {
          Toast.show({
            type: 'error',
            text: error.status
          });
        }
      }
    }]);

    return MainController;
  }();

  angular.module('mediaboxApp').controller('MainController', MainController);
})();
//# sourceMappingURL=main.controller.js.map

'use strict';

angular.module('mediaboxApp').config(function ($stateProvider) {
  $stateProvider.state('/', {
    url: '/',
    templateUrl: 'app/main/main.html',
    controller: 'MainController as main',
    title: 'Mediabox | Discover | Plan | Buy '
  }).state('/Category', {
    url: '/Category',
    templateUrl: 'app/main/test.html',
    controller: 'MainController as main',
    title: 'Categories'
  }).state('/campaign', {
    url: '/campaign',
    templateUrl: 'app/main/campaign.html',
    controller: 'CampaignController as cart',
    title: 'Campaign'

  }).state('single-product', {
    params: { id: null, name: null, slug: null, search: false },
    url: '/p/:slug',
    templateUrl: 'app/main/single-product.html',
    controller: 'SingleProductController as single',
    title: 'Product details',
    resolve: {
      SingleProduct: function SingleProduct($stateParams, Product) {
        // Storing the product id into localStorage because the _id of the selected product which was passed as a hidden parameter from products won't available on page refresh
        var id = $stateParams.id;
        if (localStorage !== null && JSON !== null && id !== null) {
          localStorage.productId = id;
        }
        var productId = localStorage !== null ? localStorage.productId : null;

        if (productId) {
          // != null
          return Product.get({ id: productId });
        }

        // return productId;
      }
    }
  }).state('main', {
    title: 'Mediabox',
    url: '/',
    templateUrl: 'app/main/main.html',
    controller: 'MainController as main',
    params: {
      sort: null
    }
  })
  // When a category selected from the navbar megamenu
  .state('SubProduct', {
    title: 'All products under current category or brand',
    url: '/:page/:slug/:_id',
    templateUrl: 'app/main/main.html',
    controller: 'MainController as main',
    params: {
      id: null,
      sort: null,
      brand: null,
      category: null,
      price1: 0,
      price2: 100000
    }
  });
});
//# sourceMappingURL=main.js.map

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
    var SingleProductController = function () {
        function SingleProductController($stateParams, $scope, Product, Review, socket, SingleProduct, Auth, Toast, LoginModal, $mdDialog, appConfig) {
            _classCallCheck(this, SingleProductController);

            var vm = this;

            vm.$mdDialog = $mdDialog;
            vm.$scope = $scope;
            vm.currentUser = Auth.getCurrentUser();
            vm.LoginModal = LoginModal;
            vm.Auth = Auth;
            vm.Toast = Toast;
            vm.Review = Review;

            $scope.vm = vm;

            var id = $stateParams.id;
            console.log($stateParams);
            if (localStorage !== null && JSON !== null && id !== null) {
                localStorage.productId = id;
            }
            vm.productId = localStorage !== null ? localStorage.productId : null;

            SingleProduct.$promise.then(function (res) {
                vm.product = res;
                console.log(res.category.name);

                if (res.category.name == "Magazines") {
                    vm.magazines = true;
                } else if (res.category.name == "Television") {
                    vm.television = true;
                } else if (res.category.name == "Radio") {
                    vm.radio = true;
                } else if (res.category.name == "Newspapers") {
                    vm.newspapers = true;
                } else if (res.category.name == "Fliers") {
                    vm.fliers = true;
                } else if (res.category.name == "Cinema") {
                    vm.cinema = true;
                } else if (res.category.name == "Airline") {
                    vm.airline = true;
                } else if (res.category.name == "Instore") {
                    vm.instore = true;
                } else if (res.category.name == "Email Marketing") {
                    vm.emailMarketing = true;
                } else if (res.category.name == "Bulk SMS") {
                    vm.bulkSms = true;
                } else if (res.category.name == "Banner") {
                    vm.banner = true;
                } else if (res.category.name == "Social Media") {
                    vm.socialMedia = true;
                } else if (res.category.name == "Billboards") {
                    vm.billboards = true;
                } else {
                    vm.default = true;
                }

                if (!appConfig.reviewSettings.enabled) {
                    // If the settings says not to enable reviews
                    return;
                }
                vm.q = { pid: SingleProduct._id };
                vm.getReviews();
            });
            vm.i = 0;
            vm.changeIndex = function (i) {
                vm.i = i;
            };
        }

        _createClass(SingleProductController, [{
            key: "preview",
            value: function preview(adspace) {

                console.log(adspace);
                var vm = this;

                if (adspace.image) {

                    vm.name = adspace.name;
                    vm.size = adspace.size;
                    vm.formart = adspace.formart;

                    vm.image = {
                        src: adspace.image,
                        position: {
                            x: -137.5,
                            y: -68
                        },
                        scaling: 1,
                        maxScaling: 5,
                        scaleStep: 0.11,
                        mwScaleStep: 0.09,
                        moveStep: 99,
                        fitOnload: true,
                        progress: 0
                    };

                    this.$scope.$watch('adspace.image', function (newValue) {
                        if (typeof newValue != "string") {
                            console.log(newValue);
                        }
                    });
                } else {
                    vm.name = false;
                    vm.size = false;
                }
            }
        }, {
            key: "getReviews",
            value: function getReviews() {
                var vm = this;
                vm.Review.my.query(vm.q, function (r) {
                    vm.reviews = r;
                    vm.publishtRatings(vm.reviews);
                });
            }
        }, {
            key: "publishtRatings",
            value: function publishtRatings(r) {
                var vm = this;
                var reviewCount = 0;
                var rating = { r5: 0, r4: 0, r3: 0, r2: 0, r1: 0, count: 0, total: 0, avg: 0 };
                r.forEach(function (i) {
                    if (i.message) reviewCount++;
                    if (i.rating) rating.count++;
                    if (i.rating) rating.total = rating.total + i.rating;
                    if (i.rating == 5) rating.r5++;
                    if (i.rating == 4) rating.r4++;
                    if (i.rating == 3) rating.r3++;
                    if (i.rating == 2) rating.r2++;
                    if (i.rating == 1) rating.r1++;
                }, this);
                vm.reviewCount = reviewCount;
                rating.avg = Math.round(rating.total / rating.count * 10) / 10;
                vm.rating = rating;
            }
        }, {
            key: "deleteReview",
            value: function deleteReview(review) {
                var vm = this;
                var confirm = this.$mdDialog.confirm().title('Are you sure to delete your review?').textContent('This is unrecoverable').ariaLabel('Confirm delete review').ok('Please do it!').cancel('No. keep');

                this.$mdDialog.show(confirm).then(function () {
                    vm.Review.delete({ id: review._id }, function () {
                        vm.getReviews();
                    }, function (err) {
                        vm.Toast.show({ type: 'error', text: 'Error while saving your review: ' + err.data });
                    });
                });
            }
        }, {
            key: "myReview",
            value: function myReview(review) {
                if (this.Auth.getCurrentUser().email == review.email) return true;
            }
        }, {
            key: "reviewForm",
            value: function reviewForm() {
                var vm = this;
                if (!vm.Auth.getCurrentUser().name) {
                    vm.LoginModal.show('single-product', true); // Reload the route, else it won't show the wishlist status of the product
                    return;
                }
                vm.$mdDialog.show({
                    templateUrl: 'app/main/review-form.html',
                    controller: NewReviewController
                }).then(function (data) {
                    vm.getReviews();
                    if (vm.reviewSettings.moderate) vm.Toast.show({ type: 'success', text: 'Your review is under moderation. Will be visible to public after approval.' });
                });
                function NewReviewController($scope, $mdDialog, Review, Toast) {
                    var user = vm.Auth.getCurrentUser();
                    $scope.hide = function () {
                        $mdDialog.hide();
                    };
                    $scope.cancel = function () {
                        $mdDialog.cancel();
                    };
                    $scope.save = function (data) {
                        if (!data) {
                            $scope.message = 'Please rate the item from a scale of 1-5';
                            return;
                        }
                        data.pid = vm.product._id;
                        data.pname = vm.product.name;
                        data.pslug = vm.product.slug;
                        data.email = user.email;
                        data.reviewer = user.name;
                        Review.save(data, function () {}, function (err) {
                            Toast.show({ type: 'error', text: 'Error while saving your review: ' + err.data });
                        });
                        $mdDialog.hide(data);
                    };
                }
                NewReviewController.$inject = ['$scope', '$mdDialog', 'Review', 'Toast'];
            }
        }]);

        return SingleProductController;
    }();

    SingleProductController.$inject = ['$stateParams', '$scope', 'Product', 'Review', 'socket', 'SingleProduct', 'Auth', 'Toast', 'LoginModal', '$mdDialog', 'appConfig'];

    angular.module('mediaboxApp').controller('SingleProductController', SingleProductController);
})();
//# sourceMappingURL=single.controller.js.map

'use strict';

angular.module('mediaboxApp').controller('MediaCtrl', function ($scope, Upload, $timeout, $http, socket, $mdDialog, Settings, Toast) {

  $scope.imageDetails = function (img) {
    $mdDialog.show({
      template: '\n    <md-dialog aria-label="Image Details Dialog"  ng-cloak>\n  <md-toolbar>\n    <div class="md-toolbar-tools">\n      <h2>Media Details</h2>\n      <span flex></span>\n      <md-button class="md-icon-button" ng-click="cancel()">\n        <ng-md-icon icon="close" aria-label="Close dialog"></ng-md-icon>\n      </md-button>\n    </div>\n  </md-toolbar>\n  <md-dialog-content>\n    <div class="md-dialog-content">\n      <div layout="row" class="md-whiteframe-z2">\n        <div class="flexbox-container">\n        \t<div>\n            <img ng-src="{{img.path}}" draggable="false" alt="{{img.name}}" class="detail-image"/>\n          </div>\n        \t<div>\n            <ul>\n              <li><strong>Media Name:</strong> {{img.originalFilename}}</li>\n              <li><strong>Media Size:</strong> {{img.size}}</li>\n              <li><strong>Media type:</strong> {{img.type}}</li>\n              <li><strong>Date Uploaded:</strong> {{img.created_at}}</li>\n              <li><strong>Uploaded By:</strong> {{img.name}}</li>\n\n            </ul>\n        \t</div>\n        </div>\n      </div>\n  </md-dialog-content>\n  <md-dialog-actions layout="row">\n    <span flex></span>\n    <md-button ng-click="delete(img)" class="md-warn">\n     Delete Permanently\n    </md-button>\n  </md-dialog-actions>\n</md-dialog>\n',
      controller: function controller($scope, $mdDialog) {
        $scope.img = img;
        $scope.delete = function (img) {
          var confirm = $mdDialog.confirm().title('Would you like to delete the media permanently?').textContent('Media once deleted can not be undone.').ariaLabel('Delete Media').ok('Please do it!').cancel('Cancel');
          $mdDialog.show(confirm).then(function () {
            $http.delete('/api/media/' + img._id).then(function () {
              $mdDialog.hide();
            }, handleError);
          }, function () {
            $mdDialog.hide();
          });
        };
        $scope.hide = function () {
          $mdDialog.hide();
        };
        $scope.cancel = function () {
          $mdDialog.cancel();
        };
      }
    }).then(function (answer) {
      $scope.alert = 'You said the information was "' + answer + '".';
    }, function () {
      $scope.alert = 'You cancelled the dialog.';
    });
  };
  // Start query the database for the table
  $scope.loading = true;
  $http.get('/api/media/').then(function (res) {
    console.log(res);
    $scope.loading = false;
    $scope.data = res.data;
    socket.syncUpdates('media', $scope.data);
  }, handleError);

  function handleError(error) {
    // error handler
    $scope.loading = false;
    if (error.status === 403) {
      Toast.show({
        type: 'error',
        text: 'Not authorised to make changes.'
      });
    } else {
      Toast.show({
        type: 'error',
        text: error.status
      });
    }
  }
  $scope.$watch('files', function () {
    $scope.upload($scope.files);
  });
  $scope.$watch('file', function () {
    if ($scope.file != null) {
      $scope.files = [$scope.file];
    }
  });
  $scope.log = '';

  $scope.upload = function (files) {
    if (files && files.length) {
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        if (!file.$error) {
          Upload.upload({
            url: 'api/media',
            data: {
              username: $scope.username,
              file: file
            }
          }).then(function (resp) {
            $timeout(function () {
              $scope.log = 'file: ' + resp.config.data.file.name + ', Response: ' + JSON.stringify(resp.data) + '\n' + $scope.log;
              $scope.result = resp.data;
            });
          }, function (response) {
            if (response.status > 0) {
              $scope.errorMsg = response.status + ': ' + response.data;
            }
          }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            $scope.log = 'progress: ' + progressPercentage + '% ' + evt.config.data.file.name + '\n' + $scope.log;
            $scope.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
          });
        }
      }
    }
  };
});
//# sourceMappingURL=media.controller.js.map

'use strict';

angular.module('mediaboxApp').config(function ($stateProvider) {
  $stateProvider.state('media', {
    url: '/media',
    templateUrl: 'app/media/media.html',
    controller: 'MediaCtrl',
    authenticate: true
  });
});
//# sourceMappingURL=media.js.map

'use strict';

angular.module('mediaboxApp').controller('MediasCtrl', function ($scope, Upload, Media, Auth, $timeout, $http, socket, $mdDialog, Settings, Toast) {

  $scope.imageDetails = function (img) {
    $mdDialog.show({
      template: '\n    <md-dialog aria-label="Image Details Dialog"  ng-cloak>\n  <md-toolbar>\n    <div class="md-toolbar-tools">\n      <h2>Media Details</h2>\n      <span flex></span>\n      <md-button class="md-icon-button" ng-click="cancel()">\n        <ng-md-icon icon="close" aria-label="Close dialog"></ng-md-icon>\n      </md-button>\n    </div>\n  </md-toolbar>\n  <md-dialog-content>\n    <div class="md-dialog-content">\n      <div layout="row" class="md-whiteframe-z2">\n        <div class="flexbox-container">\n        \t<div>\n            <img ng-src="{{img.path}}" draggable="false" alt="{{img.name}}" class="detail-image"/>\n          </div>\n        \t<div>\n            <ul>\n              <li><strong>Media Name:</strong> {{img.originalFilename}}</li>\n              <li><strong>Media Size:</strong> {{img.size}}</li>\n              <li><strong>Media type:</strong> {{img.type}}</li>\n              <li><strong>Media path:</strong> {{img.path}}</li>\n              <li><strong>Date Uploaded:</strong> {{img.created_at}}</li>\n              <li><strong>Uploaded By:</strong> {{img.uid}}</li>\n\n            </ul>\n        \t</div>\n        </div>\n      </div>\n  </md-dialog-content>\n  <md-dialog-actions layout="row">\n    <span flex></span>\n    <md-button ng-click="delete(img)" class="md-warn">\n     Delete Permanently\n    </md-button>\n  </md-dialog-actions>\n</md-dialog>\n',
      controller: function controller($scope, Auth, Media, $mdDialog) {
        $scope.img = img;
        $scope.delete = function (img) {
          var confirm = $mdDialog.confirm().title('Would you like to delete the media permanently?').textContent('Media once deleted can not be undone.').ariaLabel('Delete Media').ok('Please do it!').cancel('Cancel');
          $mdDialog.show(confirm).then(function () {
            $http.delete('/api/media/' + img._id).then(function () {
              $mdDialog.hide();
            }, handleError);
          }, function () {
            $mdDialog.hide();
          });
        };
        $scope.hide = function () {
          $mdDialog.hide();
        };
        $scope.cancel = function () {
          $mdDialog.cancel();
        };
      }
    }).then(function (answer) {
      $scope.alert = 'You said the information was "' + answer + '".';
    }, function () {
      $scope.alert = 'You cancelled the dialog.';
    });
  };
  // Start query the database for the table
  $scope.loading = true;

  Media.pub.query(function (res) {
    console.log(res);
    $scope.loading = false;
    $scope.data = res;
    socket.syncUpdates('media', $scope.data);
  });

  function handleError(error) {
    // error handler
    $scope.loading = false;
    if (error.status === 403) {
      Toast.show({
        type: 'error',
        text: 'Not authorised to make changes.'
      });
    } else {
      Toast.show({
        type: 'error',
        text: error.status
      });
    }
  }
  $scope.$watch('files', function () {
    $scope.upload($scope.files);
  });
  $scope.$watch('file', function () {
    if ($scope.file != null) {
      $scope.files = [$scope.file];
    }
  });
  $scope.log = '';

  $scope.upload = function (files) {
    if (files && files.length) {
      for (var i = 0; i < files.length; i++) {
        var file = files[i];
        if (!file.$error) {
          Upload.upload({
            url: 'api/media',
            data: {
              username: $scope.username,
              file: file
            }
          }).then(function (resp) {
            $timeout(function () {
              $scope.log = 'file: ' + resp.config.data.file.name + ', Response: ' + JSON.stringify(resp.data) + '\n' + $scope.log;
              $scope.result = resp.data;
            });
          }, function (response) {
            if (response.status > 0) {
              $scope.errorMsg = response.status + ': ' + response.data;
            }
          }, function (evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            $scope.log = 'progress: ' + progressPercentage + '% ' + evt.config.data.file.name + '\n' + $scope.log;
            $scope.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
          });
        }
      }
    }
  };
});
//# sourceMappingURL=medias.controller.js.map

'use strict';

angular.module('mediaboxApp').config(function ($stateProvider) {
  $stateProvider.state('medias', {
    url: '/medias',
    templateUrl: 'app/medias/medias.html',
    controller: 'MediasCtrl',
    authenticate: 'true'
  });
});
//# sourceMappingURL=medias.js.map

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
    var OrderController = function () {
        function OrderController(Cart, Auth, Order, Toast, Settings, $state, $stateParams, $loading) {
            _classCallCheck(this, OrderController);

            var vm = this;
            this.orderStatusLov = Order.status;
            this.Toast = Toast;
            this.Auth = Auth;
            this.Settings = Settings; // Used to get currency symbol
            this.$state = $state;
            this.options = {};
            this.payment = $stateParams;
            this.itemsGrid = [];

            if ($stateParams.id) // If payment was successful clear cart
                Cart.cart.clearItems();

            this.itemsGrid = [];

            $loading.start("orders");

            this.orders = Order.my.query({}, function (res) {
                var total = 0;
                for (var i = 0; i < res.length; i++) {
                    //     var subTotal = 0;
                    var item = res[i];
                    total += item.amount.total;
                    console.log(total);
                    $loading.finish("orders");
                }
                $loading.finish("orders");
                res.total = total;
            });

            /***data table**/

            this.mainGridOptions = {
                dataSource: {

                    transport: {
                        read: function read(options) {
                            //options holds the grids current page and filter settings
                            Order.my.query({ sort: { created_at: -1 } }, function (res) {

                                for (var j = 0; j < res.length; j++) {
                                    var total = 0;
                                    var item = res[j];
                                    for (var i = 0; i < item.items.length; i++) {

                                        var p = item.items[i].price;
                                        var q = item.items[i].quantity;
                                        total += p * q;
                                    }

                                    res[j].total = total;
                                }

                                options.success(res);
                                //console.log(res);
                            });
                        }
                    },
                    pageSize: 10,
                    serverPaging: true,
                    serverSorting: true
                },
                toolbar: ['excel', 'pdf'],

                excel: {
                    allPages: true,
                    proxyURL: "//demos.telerik.com/kendo-ui/service/export",
                    fileName: 'Mediabox-campaigns.xlsx',
                    filterable: true
                },
                pdf: {
                    allPages: true,
                    avoidLinks: true,
                    paperSize: "A4",
                    margin: { top: "2cm", left: "1cm", right: "1cm", bottom: "1cm" },
                    landscape: true,
                    repeatHeaders: true,
                    template: $("#page-template").html(),
                    scale: 0.8
                },
                sortable: true,
                pageable: true,
                editable: "popup",

                filterable: true,

                dataBound: function dataBound() {
                    this.expandRow(this.tbody.find("tr.k-master-row").first());
                },
                columns: [
                // { field: "orderNo", title: "Order Number" },
                { field: "created_at", title: "Order Date", type: 'datetime', template: "#=  (created_at == null)? '' : kendo.toString(kendo.parseDate(created_at, 'yyyy-MM-dd'), 'MM/dd/yy') #" }, { field: "status", title: "Status" }, { field: "payment.id", title: "Payment Reference" }, { field: "amount.total", title: "Total", format: "{0:c2}" }]
            };

            this.detailGridOptions = function (dataItem) {

                return {
                    dataSource: {
                        filter: { field: "orderNo", operator: "eq", value: dataItem.orderNo },
                        transport: {
                            read: function read(options) {
                                //options holds the grids current page and filter settings
                                var itemsGrid = [];
                                var q = {};
                                //q.where = { $and: [ { 'items.uid' : Auth.getCurrentUser().email }, { 'status':'Campaign Placed'} ] };
                                Order.my.query(function (res) {
                                    //console.log(res);


                                    var totalFinal = 0;
                                    var totalOrder = res.length;

                                    for (var j = 0; j < res.length; j++) {
                                        var total = 0;

                                        var item = res[j];
                                        for (var i = 0; i < item.items.length; i++) {

                                            var itemGridTemp = {
                                                orderNo: item.orderNo,
                                                puburl: item.items[i].url,
                                                id: item.items[i]._id,
                                                advertiser: item.items[i].advertiser,
                                                category: item.items[i].category,
                                                mrp: item.items[i].mrp,
                                                name: item.items[i].name,
                                                price: parseFloat(item.items[i].price),
                                                publisher: item.items[i].publisher,
                                                quantity: item.items[i].quantity,
                                                size: item.items[i].size,
                                                sku: item.items[i].sku,
                                                uid: item.items[i].uid
                                            };

                                            var p = item.items[i].price;
                                            var q = item.items[i].quantity;
                                            total += p * q;

                                            vm.itemsGrid.push(itemGridTemp);
                                        }

                                        res[j].total = total;
                                    }

                                    res.totalFinal = total;

                                    var data = [];
                                    //console.log(vm.itemsGrid);
                                    for (var i = 0; i < vm.itemsGrid.length; i++) {
                                        var item = vm.itemsGrid[i];
                                        if (item.orderNo == dataItem.orderNo) {
                                            //alert(item.campaignNo);
                                            data.push(item);
                                        }

                                        options.success(data);
                                        console.log(data);

                                        vm.data = [];
                                    }

                                    vm.itemsGrid = [];
                                });
                            }
                        },
                        serverPaging: true,
                        serverSorting: true,
                        serverFiltering: true,
                        pageSize: 5,
                        filterable: true

                    },
                    scrollable: false,
                    sortable: true,

                    pageable: true,
                    columns: [{ field: "orderNo", title: "Order #", width: "50px" }, { field: "publisher", title: "Publisher", width: "50px" },
                    //{ field: "category", title:"Category", width: "100px" },
                    { field: "name", title: "Name", width: "100px" }, { field: "price", title: "Price", width: "50px", format: "{0:c2}" }, { field: "quantity", title: "Quantity", width: "50px" }]
                };
            };
        } //end constuctor

        _createClass(OrderController, [{
            key: "navigate",
            value: function navigate(params) {
                this.$state.go('single-product', { id: params.sku, slug: params.description }, { reload: false });
            }
        }, {
            key: "getTotal",
            value: function getTotal(item) {
                // console.log(item);
                var total = 0;

                for (var i = 0; i < item.items.length; i++) {

                    // items[i].total = 0;

                    var p = item.items[i].price;
                    var q = item.items[i].quantity;
                    total += p * q;
                    // var x.sub.push(total);
                }
                // console.log(total);

                return total;
            }
        }, {
            key: "changeStatus",
            value: function changeStatus(order) {
                var vm = this;
                var vm = this;
                this.Order.update({ id: order._id }, order).$promise.then(function (res) {}, function (error) {
                    // error handler
                    if (error.data.errors) {
                        vm.Toast.show({
                            type: 'error',
                            text: error.data.errors.status.message
                        });
                    } else {
                        vm.Toast.show({
                            type: 'success',
                            text: error.statusText
                        });
                    }
                });
            }
        }]);

        return OrderController;
    }();

    angular.module('mediaboxApp').controller('OrderController', OrderController);
})();
//# sourceMappingURL=order.controller.js.map

'use strict';

angular.module('mediaboxApp').config(function ($stateProvider) {
  $stateProvider.state('order', {
    url: '/order?id&msg',
    templateUrl: 'app/order/order.html',
    controller: 'OrderController as order',
    authenticate: true
  });
});
//# sourceMappingURL=order.js.map

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
    var OrdersController = function () {
        function OrdersController(Cart, Auth, Order, Toast, Settings, $state, $stateParams, $loading) {
            _classCallCheck(this, OrdersController);

            var vm = this;
            this.Order = Order;
            this.orderStatusLov = Order.status;
            this.Toast = Toast;
            this.Auth = Auth;
            this.Settings = Settings; // Used to get currency symbol
            this.$state = $state;
            this.options = {};
            this.itemsGrid = [];

            $loading.start("orders");

            this.orders = Order.pub.query({}, function (res) {
                var total = 0;
                for (var i = 0; i < res.length; i++) {
                    //     var subTotal = 0;
                    var item = res[i];
                    for (var j = 0; j < item.items.length; j++) {

                        // items[i].total = 0;

                        var p = item.items[j].price;
                        var q = item.items[j].quantity;
                        total += p * q;
                        // var x.sub.push(total);
                    }
                    // res.total = total;
                    console.log(total);
                    $loading.finish("orders");
                }
                $loading.finish("orders");
                res.total = total;
            });

            /***data table**/

            this.mainGridOptions = {
                dataSource: {

                    transport: {
                        read: function read(options) {
                            //options holds the grids current page and filter settings
                            Order.pub.query(function (res) {

                                for (var j = 0; j < res.length; j++) {
                                    var total = 0;
                                    var item = res[j];
                                    for (var i = 0; i < item.items.length; i++) {

                                        var p = item.items[i].price;
                                        var q = item.items[i].quantity;
                                        total += p * q;
                                    }

                                    res[j].total = total;
                                }

                                options.success(res);
                                console.log(res);
                            });
                        }
                    },
                    pageSize: 10,
                    serverPaging: true,
                    serverSorting: true
                },
                toolbar: ['excel', 'pdf'],

                excel: {
                    allPages: true,
                    proxyURL: "//demos.telerik.com/kendo-ui/service/export",
                    fileName: 'Mediabox-Orders.xlsx',
                    filterable: true
                },
                pdf: {
                    allPages: true,
                    avoidLinks: true,
                    paperSize: "A4",
                    margin: { top: "2cm", left: "1cm", right: "1cm", bottom: "1cm" },
                    landscape: true,
                    repeatHeaders: true,
                    template: $("#page-template").html(),
                    scale: 0.8
                },
                sortable: true,
                pageable: true,

                filterable: true,

                dataBound: function dataBound() {
                    this.expandRow(this.tbody.find("tr.k-master-row").first());
                },
                columns: [{ field: "created_at", title: "Order Date", type: 'datetime', template: "#=  (created_at == null)? '' : kendo.toString(kendo.parseDate(created_at, 'yyyy-MM-dd'), 'MM/dd/yy') #" }, { field: "status", title: "Status" }, { field: "payment.id", title: "Payment Reference" }, { field: "total", title: "Total", format: "{0:c2}" }]
            };

            this.detailGridOptions = function (dataItem) {

                return {
                    dataSource: {
                        transport: {
                            read: function read(options) {
                                //options holds the grids current page and filter settings
                                var itemsGrid = [];
                                Order.pub.query({}, function (res) {

                                    var total = 0;
                                    var totalOrder = res.length;

                                    // console.log(res.OrderName);
                                    // for(var i=0;i<res.length;i++){
                                    //     var subTotal = 0;
                                    for (var j = 0; j < res.length; j++) {
                                        total = 0;
                                        // console.log();
                                        // subTotal += res[i].shipping.charge;
                                        var item = res[j];
                                        //console.log(dataItem.orderNo);


                                        //s console.log(item.orderNo);
                                        //itemsGrid.push(item.items);
                                        // var x = item.items
                                        // var x.sub = [];

                                        for (var i = 0; i < item.items.length; i++) {

                                            var itemGridTemp = {
                                                orderNo: item.orderNo,
                                                id: item._id,
                                                advertiser: item.items[i].advertiser,
                                                category: item.items[i].category,
                                                mrp: item.items[i].mrp,
                                                name: item.items[i].name,
                                                price: parseFloat(item.items[i].price),
                                                publisher: item.items[i].publisher,
                                                quantity: item.items[i].quantity,
                                                size: item.items[i].size,
                                                sku: item.items[i].sku,
                                                uid: item.items[i].uid
                                            };

                                            // items[i].total = 0;

                                            var p = item.items[i].price;
                                            var q = item.items[i].quantity;
                                            total += p * q;
                                            res.totalSpend = total;
                                            // var x.sub.push(total);

                                            vm.itemsGrid.push(itemGridTemp);
                                        }
                                        //console.log(total);
                                    }
                                    res.total = total;
                                    res.totalOrder = totalOrder;

                                    var data = [];
                                    //console.log(vm.itemsGrid);
                                    for (var i = 0; i < vm.itemsGrid.length; i++) {
                                        var item = vm.itemsGrid[i];
                                        if (item.orderNo == dataItem.orderNo) {
                                            //alert(item.campaignNo);
                                            data.push(item);
                                        }

                                        options.success(data);
                                        console.log(data);

                                        vm.data = [];
                                    }

                                    vm.itemsGrid = [];
                                });
                            }
                        },
                        serverPaging: true,
                        serverSorting: true,
                        serverFiltering: true,
                        pageSize: 5,
                        filter: { field: "orderNo", operator: "eq", value: dataItem.orderNo }

                    },
                    scrollable: false,
                    sortable: true,

                    pageable: true,
                    columns: [{ field: "orderNo", title: "Order #", width: "50px" }, { field: "publisher", title: "Product/Site", width: "100px" }, { field: "name", title: "Name", width: "100px" }, { field: "price", title: "Price", format: "{0:c2}", width: "50px" }, { field: "quantity", title: "Quantity", width: "50px" }]
                };
            };
        } //end constuctor

        _createClass(OrdersController, [{
            key: "navigate",
            value: function navigate(params) {
                this.$state.go('single-product', { id: params.sku, slug: params.description }, { reload: false });
            }
        }, {
            key: "getTotal",
            value: function getTotal(item) {
                // console.log(item);
                var total = 0;

                for (var i = 0; i < item.items.length; i++) {

                    // items[i].total = 0;

                    var p = item.items[i].price;
                    var q = item.items[i].quantity;
                    total += p * q;
                    // var x.sub.push(total);
                }
                // console.log(total);

                return total;
            }
        }, {
            key: "changeStatus",
            value: function changeStatus(order) {

                //console.log(order);
                var vm = this;
                var vm = this;
                this.Order.update({ id: order._id }, order).$promise.then(function (res) {}, function (error) {
                    // error handler
                    if (error.data.errors) {
                        vm.Toast.show({
                            type: 'error',
                            text: error.data.errors.status.message
                        });
                    } else {
                        vm.Toast.show({
                            type: 'success',
                            text: error.statusText
                        });
                    }
                });
            }
        }]);

        return OrdersController;
    }();

    angular.module('mediaboxApp').controller('OrdersController', OrdersController);
})();
//# sourceMappingURL=orders.controller.js.map

'use strict';

angular.module('mediaboxApp').config(function ($stateProvider) {
  $stateProvider.state('orders', {
    url: '/orders',
    templateUrl: 'app/orders/orders.html',
    controller: 'OrdersController as orders',
    authenticate: 'manager'
  });
});
//# sourceMappingURL=orders.js.map

'use strict';

angular.module('mediaboxApp').controller('PaymentMethodCtrl', function ($scope) {
  $scope.options = [{ field: 'name', dataType: 'select', options: ['PayPal', 'COD', 'Stripe'] }, { field: 'email' }, { field: 'active', dataType: 'boolean' }];
});
//# sourceMappingURL=payment-method.controller.js.map

'use strict';

angular.module('mediaboxApp').config(function ($stateProvider) {
  $stateProvider.state('payment-method', {
    url: '/payment-method',
    templateUrl: 'app/payment-method/payment-method.html',
    controller: 'PaymentMethodCtrl',
    authenticate: 'admin'
  });
});
//# sourceMappingURL=payment-method.js.map

'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var PaymentController = function PaymentController() {
    _classCallCheck(this, PaymentController);
  };

  angular.module('mediaboxApp').controller('PaymentController', PaymentController);
})();
//# sourceMappingURL=payment.controller.js.map

'use strict';

angular.module('mediaboxApp').config(function ($stateProvider) {
  $stateProvider.state('payment-success', {
    url: '/payment/success',
    templateUrl: 'app/payment/success.html',
    controller: 'PaymentController as payment',
    authenticate: true
  }).state('payment-cancel', {
    url: '/payment/cancel',
    templateUrl: 'app/payment/cancel.html',
    controller: 'PaymentController as payment',
    authenticate: true
  }).state('payment-error', {
    url: '/payment/error',
    templateUrl: 'app/payment/error.html',
    controller: 'PaymentController as payment',
    authenticate: true
  });
});
//# sourceMappingURL=payment.js.map

'use strict';

(function () {

  function ProductsDetailController($http, $state, Toast, $stateParams, ToggleComponent, Settings, $mdDialog, socket, $scope) {
    var vm = this;
    vm.myDate = new Date();
    vm.header = 'product';

    vm.product = {};
    vm.options = {};
    vm.product.variants = [];
    vm.product.newVariant = {};
    vm.product.features = [];
    vm.product.stats = [];
    vm.product.keyFeatures = [];
    vm.unsavedProduct = $stateParams.products;
    vm.product = angular.copy($stateParams.products);
    vm.options.categories = angular.copy($stateParams.categories);

    $scope.$watch('vm.product.category', function (newValue) {
      console.log(vm.product.category);
      if (typeof newValue != "string") {
        console.log(vm.product.category);
      }
    });

    if (vm.product.category == '582597286bf2000d54ac92fa' || vm.product.category == '5825972f6bf2000d54ac92fb' || vm.product.category == '582597976bf2000d54ac9304') {
      vm.options.brands = $stateParams.brandtvs;
    } else if (vm.product.category == '582597646bf2000d54ac9300' || vm.product.category == '5825976d6bf2000d54ac9301') {
      vm.options.brands = $stateParams.brandmgs;
    } else {
      vm.options.brands = angular.copy($stateParams.brands);
    }

    vm.options.brandmgs = angular.copy($stateParams.brandmgs);
    vm.options.brandtvs = angular.copy($stateParams.brandtvs);
    console.log($stateParams);

    vm.options.variants = angular.copy($stateParams.variants);
    vm.options.features = angular.copy($stateParams.features);
    vm.options.statistics = angular.copy($stateParams.statistics);
    vm.options.keyfeatures = angular.copy($stateParams.keyfeatures);

    console.log(vm.options.statistics);

    // The whole category hierarchy
    vm.loading = true;
    $http.get('/api/categories/all').then(function (res) {
      vm.loading = false;
      vm.options.categories = res.data;
    }, handleError);

    vm.changeCategory = function (cat) {

      console.log(vm.product.category);
      if (vm.product.category == '582597286bf2000d54ac92fa' || vm.product.category == '5825972f6bf2000d54ac92fb' || vm.product.category == '582597976bf2000d54ac9304') {
        vm.options.brands = $stateParams.brandtvs;
      } else if (vm.product.category == '582597646bf2000d54ac9300' || vm.product.category == '5825976d6bf2000d54ac9301') {
        vm.options.brands = $stateParams.brandmgs;
      } else {
        vm.options.brands = angular.copy($stateParams.brands);
      }
    };

    vm.save = function (product) {

      // refuse to work with invalid data
      if (!product) {
        Toast.show({
          type: 'error',
          text: 'No product defined.'
        });
        return;
      }
      if ('newVariant' in product) {
        vm.product.variants.push(product.newVariant);
      }

      $http.put('/api/products/' + product._id, product).then(success).catch(err);
      function success(res) {
        var item = vm.product = res.data;
        Toast.show({
          type: 'success',
          text: 'Product has been updated'
        });
      }

      function err(err) {
        console.log(err);
        if (product && err) {}

        Toast.show({
          type: 'warn',
          text: 'Error while updating database'
        });
      }
    };

    vm.mediaLibrary = function (index) {
      $mdDialog.show({
        template: '<md-dialog aria-label="Media Library" ng-cloak flex="95">\n        <md-toolbar class="md-warn">\n          <div class="md-toolbar-tools">\n            <h2>Media Library</h2>\n            <span flex></span>\n            <md-button class="md-icon-button" ng-click="cancel()">\n              <ng-md-icon icon="close" aria-label="Close dialog"></ng-md-icon>\n            </md-button>\n          </div>\n        </md-toolbar>\n\n        <md-dialog-content>\n            <div class="md-dialog-content"  class="md-whiteframe-z2">\n                <md-grid-list class="media-list" md-cols-xs ="3" md-cols-sm="4" md-cols-md="5" md-cols-lg="7" md-cols-gt-lg="10" md-row-height-gt-md="1:1" md-row-height="4:3" md-gutter="12px" md-gutter-gt-sm="8px" layout="row" layout-align="center center">\n                  <md-grid-tile ng-repeat="i in media" class="md-whiteframe-z2" ng-click="ok(i.path)">\n                \t\t<div class="thumbnail">\n                \t\t\t\t<img ng-src="{{i.path}}" draggable="false" alt="{{i.name}}">\n                \t\t</div>\n                    <md-grid-tile-footer><h3>{{i.name}}</h3></md-grid-tile-footer>\n                  </md-grid-tile>\n                </md-grid-list>\n          </div>\n        </md-dialog-content>\n        <md-dialog-actions layout="row">\n          <span flex></span>\n          <md-button ng-click="addNewImage()" class="md-warn md-raised">\n           Add new Image\n          </md-button>\n        </md-dialog-actions>\n      </md-dialog>\n',
        controller: function controller($scope, $mdDialog, $http, socket, $state) {
          // Start query the database for the table
          var vm = this;
          $scope.loading = true;
          $http.get('/api/media/').then(function (res) {
            $scope.loading = false;
            $scope.media = res.data;
            socket.syncUpdates('media', $scope.data);
          }, handleError);

          function handleError(error) {
            // error handler
            $scope.loading = false;
            if (error.status === 403) {
              Toast.show({
                type: 'error',
                text: 'Not authorised to make changes.'
              });
            } else {
              Toast.show({
                type: 'error',
                text: error.status
              });
            }
          }
          $scope.ok = function (path) {
            $mdDialog.hide(path);
          };
          $scope.hide = function () {
            $mdDialog.hide();
          };
          $scope.cancel = function () {
            $mdDialog.cancel();
          };
          $scope.addNewImage = function () {
            var vm = this;
            $state.go('media');
            vm.save(vm.product);
            $mdDialog.hide();
          };
        }

      }).then(function (answer) {
        if (index === 1000000) vm.product.variants.push({ size: 'x', image: answer });else vm.product.variants[index].image = answer;
      }, function () {});
    };

    function goBack() {
      ToggleComponent('products.detailView').close();
      $state.go('^', {}, { location: false });
    }
    vm.goBack = goBack;

    vm.deleteFeature = function (index, product) {
      vm.product.features.splice(index, 1);
      vm.save(product);
    };

    vm.deleteKeyFeature = function (index, product) {
      vm.product.keyFeatures.splice(index, 1);
      vm.save(product);
    };

    vm.deleteStat = function (index, product) {
      vm.product.stats.splice(index, 1);
      vm.save(product);
    };

    vm.deleteKF = function (index, product) {
      vm.product.keyFeatures.splice(index, 1);
      vm.save(product);
    };

    vm.deleteVariants = function (index, product) {
      vm.product.variants.splice(index, 1);
      vm.save(product);
    };
    function handleError(error) {
      // error handler
      vm.loading = false;
      if (error.status === 403) {
        Toast.show({
          type: 'error',
          text: 'Not authorised to make changes.'
        });
      } else {
        Toast.show({
          type: 'error',
          text: error.status
        });
      }
    }
  }

  angular.module('mediaboxApp').controller('ProductsDetailController', ProductsDetailController);
})();
//# sourceMappingURL=detail.controller.js.map

'use strict';

(function () {

  function ProductsListController($scope, $http, socket, $state, $mdDialog, $stateParams, Modal, Toast, Settings) {
    this.cols = [{ field: 'image', heading: 'image' }, { field: 'name', heading: 'name' }, { field: 'active', heading: 'active' }];
    this.header = 'Product';
    this.sort = {};
    this.$mdDialog = $mdDialog;
    var vm = this;
    vm.loading = true;

    // the selected item id
    var _id = null;
    var originatorEv;

    this.sort.predicate = 'name';
    this.sort.reverse = false;
    this.order = function (predicate) {
      this.sort.reverse = this.sort.predicate === predicate ? !this.sort.reverse : false;
      this.sort.predicate = predicate;
    };

    this.l = 10;
    this.loadMore = function () {
      this.l += 2;
    };

    this.exportData = function (type) {
      var data = JSON.stringify(this.data, undefined, 2);
      var blob;
      if (type === 'txt') {
        // Save as .txt
        blob = new Blob([data], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, 'product.txt');
      } else if (type === 'csv') {
        // Save as .csv
        blob = new Blob([document.getElementById('exportable').innerHTML], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' });
        saveAs(blob, "product.csv");
      } else if (type === 'xls') {
        // Save as xls
        blob = new Blob([document.getElementById('exportable').innerHTML], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        saveAs(blob, "product.xls");
      } else {
        // Save as .json
        blob = new Blob([data], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, 'product.json');
      }
    };

    this.openMenu = function ($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);
    };
    vm.isSelected = function (product) {
      return _id === product._id;
    };

    // Start query the database for products
    vm.loading = true;
    $http.get('/api/products').then(function (res) {
      vm.loading = false;
      vm.data = res.data;
      socket.syncUpdates('product', vm.data);
    }, handleError);

    // Start query the database for brands
    vm.loading = true;
    $http.get('/api/brands').then(function (res) {
      vm.loading = false;
      vm.brands = res.data;
      socket.syncUpdates('brand', vm.brands);
    }, handleError);

    $http.get('/api/brandmgs').then(function (res) {
      vm.loading = false;
      vm.brandmgs = res.data;
      socket.syncUpdates('brandmg', vm.brandmgs);
    }, handleError);

    $http.get('/api/brandtvs').then(function (res) {
      vm.loading = false;
      vm.brandtvs = res.data;
      socket.syncUpdates('brandtv', vm.brandtvs);
    }, handleError);

    // Start query the database for categories
    vm.loading = true;
    $http.get('/api/categories').then(function (res) {
      vm.loading = false;
      vm.categories = res.data;
      socket.syncUpdates('category', vm.categories);
    }, handleError);

    // Start query the database for features
    vm.loading = true;
    $http.get('/api/features').then(function (res) {
      vm.loading = false;
      vm.features = res.data;
      socket.syncUpdates('feature', vm.features);
    }, handleError);
    // Start query the database for features
    vm.loading = true;
    $http.get('/api/keyfeatures').then(function (res) {
      vm.loading = false;
      vm.keyfeatures = res.data;
      socket.syncUpdates('feature', vm.features);
    }, handleError);

    vm.loading = true;
    $http.get('api/statistics').then(function (res) {
      vm.loading = false;
      vm.statistics = res.data;
      socket.syncUpdates('statistic', vm.statistics);
    }, handleError);

    this.changeStatus = function (x) {
      $http.put('/api/products/' + x._id, { active: x.active }).then(function () {}, handleError);
    };

    this.delete = function (data) {
      var confirm = this.$mdDialog.confirm().title('Would you like to delete the product completely?').textContent('All its details will be deleted as well').ariaLabel('Confirm delete product').ok('Please do it!').cancel('No. keep');

      this.$mdDialog.show(confirm).then(function () {
        $http.delete('/api/products/' + data._id).then(function () {}, handleError);
      });
    };

    function handleError(error) {
      // error handler
      vm.loading = false;
      if (error.status === 403) {
        Toast.show({
          type: 'error',
          text: 'Not authorised to make changes.'
        });
      } else {
        Toast.show({
          type: 'error',
          text: error.status
        });
      }
    }

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('product');
    });

    this.showInDetails = function (item) {
      _id = item._id;
      $state.go('product-detail', { products: item, brands: vm.brands, brandmgs: vm.brandmgs, brandtvs: vm.brandtvs, categories: vm.categories, features: vm.features, keyfeatures: vm.keyfeatures, statistics: vm.statistics }, { location: false });
    };

    this.gotoDetail = function (params) {
      $state.go('single-product', { id: params._id, slug: params.slug }, { reload: false });
    };
  }

  angular.module('mediaboxApp').controller('ProductsListController', ProductsListController);
})();
//# sourceMappingURL=list.controller.js.map

'use strict';

(function () {

  function ProductsMainController(Modal, $stateParams) {
    var options = { api: 'product' };
    var cols = [{ field: 'sku', heading: 'SKU' }, { field: 'name', heading: 'Name' }, { field: 'description', heading: 'Description', dataType: 'textarea' }];
    this.create = function () {
      Modal.show(cols, options);
    };
  }

  angular.module('mediaboxApp').controller('ProductsMainController', ProductsMainController);
})();
//# sourceMappingURL=main.controller.js.map

'use strict';

angular.module('mediaboxApp').controller('ProductCtrl', function ($scope) {
  $scope.summary = [{ field: 'name' }, { field: 'category' }, { field: 'active' }];
  $scope.details = [{ field: 'name' }, { field: 'category' }, { field: 'brand' }, { field: 'active' }];
});
//# sourceMappingURL=product.controller.js.map

'use strict';

angular.module('mediaboxApp').config(function ($stateProvider) {
  $stateProvider.state('product', {
    url: '/product',
    params: { options: null, columns: null },
    views: {
      '': {
        templateUrl: 'app/product/main.html',
        controller: 'ProductsMainController as main'
      },
      'content@product': {
        url: '/content',
        templateUrl: 'app/product/list.html',
        controller: 'ProductsListController as list'
      }
    },
    authenticate: 'manager'
  }).state('product-detail', {
    url: '/product-detail/:id',
    onEnter: onEnterUserListDetail, // To open right sidebar
    params: { products: null, categories: null, brands: null, brandmgs: null, brandtvs: null, features: null, keyfeatures: null, statistics: null },
    parent: 'product',
    views: {
      '': {
        templateUrl: 'app/product/main.html'
      },
      'detail': {
        templateUrl: 'app/product/detail.html',
        controller: 'ProductsDetailController as detail'
      }
    },
    authenticate: 'manager'
  }).state('products-create', {
    url: '/products-create',
    parent: 'products',
    params: { data: null },
    views: {
      '': {}
    },
    authenticate: 'manager'
  });
  function resolveIdFromArray($stateParams) {
    return { '_id': $stateParams.id, 'api': $stateParams.api };
  }

  onEnterUserListDetail.$inject = ['$timeout', 'ToggleComponent'];

  function onEnterUserListDetail($timeout, ToggleComponent) {
    $timeout(showDetails, 0, false);

    function showDetails() {
      ToggleComponent('products.detailView').open();
    }
  }
});
//# sourceMappingURL=product.js.map

'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
    var ReviewController = function ReviewController() {
        _classCallCheck(this, ReviewController);

        this.options = [{ field: 'pid', heading: 'Product ID' }, { field: 'pname', heading: 'Product Name' }, { field: 'reviewer' }, { field: 'email' }, { field: 'message' }, { field: 'rating', dataType: 'number' }, { field: 'created', dataType: 'date' }];
    };

    angular.module('mediaboxApp').controller('ReviewController', ReviewController);
})();
//# sourceMappingURL=review.controller.js.map

'use strict';

angular.module('mediaboxApp').config(function ($stateProvider) {
  $stateProvider.state('review', {
    url: '/review',
    templateUrl: 'app/review/review.html',
    controller: 'ReviewController as review',
    authenticate: true
  });
});
//# sourceMappingURL=review.js.map

'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
    var ReviewsController = function ReviewsController() {
        _classCallCheck(this, ReviewsController);

        this.options = [{ field: 'pid', heading: 'Product ID' }, { field: 'pname', heading: 'Product Name' }, { field: 'reviewer' }, { field: 'email' }, { field: 'message' }, { field: 'rating', dataType: 'number' }, { field: 'created', dataType: 'date' }, { field: 'active', dataType: 'boolean' }];
    };

    angular.module('mediaboxApp').controller('ReviewsController', ReviewsController);
})();
//# sourceMappingURL=reviews.controller.js.map

'use strict';

angular.module('mediaboxApp').config(function ($stateProvider) {
  $stateProvider.state('reviews', {
    url: '/reviews',
    templateUrl: 'app/reviews/reviews.html',
    controller: 'ReviewsController as reviews',
    authenticate: true
  });
});
//# sourceMappingURL=reviews.js.map

'use strict';

(function () {
  angular.module('mediaboxApp').constant('Settings', {
    demo: false,
    country: {
      name: 'Zimbabwe',
      code: 'ZW' // must be 2 digit code from the list https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2 
    },
    handlingFee: '5 %',
    currency: {
      code: 'USD', // Paypal currency code *** Please choose from https://developer.paypal.com/docs/classic/api/currency_codes/
      shop_currency: 'USD',
      symbol: '$ ', // Currency symbol to be displayed through out the shop
      exchange_rate: '1' // Paypal currency code(USD) / Shop currency (INR) ***  exchange_rate should not be 0 else it will generate divided by 0 error
    },
    paymentStatus: ['Pending', 'Paid', 'created'], // On success from Paypal it stores as created
    orderStatus: ['Payment Pending', 'Order Placed', 'Order Accepted', 'Order Executed', 'Shipped', 'Delivered', 'Cancelled', 'Not in Stock'],
    campaignStatus: ['Creative Pending', 'Campaign Placed', 'Campaign Ready', 'Campaign Accepted', 'Campaign Executed', 'Campaign Completed', 'Campaign Rejected'],
    menu: {
      pages: [// Main menu8
      { text: 'Transaction History', url: 'order', authenticate: true, icon: 'account_balance' }, { text: 'Manage Orders', url: 'orders', authenticate: true, role: 'manager', icon: 'shopping_basket' }, { text: 'Campaign Management', url: 'campaigns', authenticate: true, role: 'manager', icon: 'chrome_reader_mode' }, { text: 'Campaigns', url: 'campaign', authenticate: true, icon: 'perm_media' }, { text: 'Profile', url: 'address', authenticate: true, icon: 'directions' },
      //{text:'Reviews', url: 'review', authenticate: true, role: 'admin',icon: 'star'},
      //{text:'Moderate Reviews', url: 'reviews', authenticate: true, role: 'admin', icon: 'star'},
      //{text:'Wishlist', url: 'wish', authenticate: true, role: 'admin',icon: 'favorite'},
      { text: 'My Library', url: 'media', authenticate: true, icon: 'photo_library' }, { text: 'Media Library', url: 'medias', authenticate: true, role: 'manager', icon: 'photo_library' }, { text: 'Inventory', url: 'product', authenticate: true, role: 'manager', icon: 'style' }],
      user: [// Separate panel for user management tasks for both admin and user
      /// {text:'Users', url: 'admin', authenticate: true, role: 'admin', icon: 'perm_identity'},
      { text: 'Change Password', authenticate: true, url: 'cp', icon: 'settings_applications' }, { text: 'logout', authenticate: true, url: 'logout', icon: 'logout' }]
    }
  });
})();
//# sourceMappingURL=settings.js.map

'use strict';

angular.module('mediaboxApp').controller('ShippingCtrl', function ($scope) {
  $scope.options = [{ field: 'carrier' }, { field: 'country' }, { field: 'charge', dataType: 'currency' }, { field: 'minWeight', dataType: 'number' }, { field: 'maxWeight', dataType: 'number' }, { field: 'freeShipping', dataType: 'currency' }, { field: 'active', dataType: 'boolean' }];
});
//# sourceMappingURL=shipping.controller.js.map

'use strict';

angular.module('mediaboxApp').config(function ($stateProvider) {
  $stateProvider.state('shipping', {
    url: '/shipping',
    templateUrl: 'app/shipping/shipping.html',
    controller: 'ShippingCtrl',
    authenticate: 'manager'
  });
});
//# sourceMappingURL=shipping.js.map

'use strict';

angular.module('mediaboxApp').controller('StatisticCtrl', function ($scope) {
  $scope.options = [{ field: 'key' }, { field: 'val' }, { field: 'active', dataType: 'boolean' }];
});
//# sourceMappingURL=statistic.controller.js.map

'use strict';

angular.module('mediaboxApp').config(function ($stateProvider) {
  $stateProvider.state('statistic', {
    url: '/statistic',
    templateUrl: 'app/statistic/statistic.html',
    controller: 'StatisticCtrl',
    authenticate: 'manager'
  });
});
//# sourceMappingURL=statistic.js.map

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
    var WishController = function () {
        function WishController(Wishlist, $state) {
            _classCallCheck(this, WishController);

            this.Wishlist = Wishlist;
            this.wishes = Wishlist.query();
            this.$state = $state;
        }

        _createClass(WishController, [{
            key: 'remove',
            value: function remove(wish) {
                var vm = this;
                this.Wishlist.delete({ id: wish._id }, function (res) {
                    if (res) {
                        vm.wishes = vm.Wishlist.query();
                    }
                });
            }
        }, {
            key: 'gotoDetail',
            value: function gotoDetail(params) {
                this.$state.go('single-product', { id: params.pid, slug: params.slug }, { reload: false });
            }
        }]);

        return WishController;
    }();

    angular.module('mediaboxApp').controller('WishController', WishController);
})();
//# sourceMappingURL=wish.controller.js.map

'use strict';

angular.module('mediaboxApp').config(function ($stateProvider) {
  $stateProvider.state('wish', {
    url: '/wish',
    templateUrl: 'app/wish/wish.html',
    controller: 'WishController as wish',
    authenticate: true
  });
});
//# sourceMappingURL=wish.js.map

'use strict';

(function () {
  var NGPCanvas,
      NGPImage,
      NGPImageLoader,
      NGPIndicator,
      module,
      __bind = function __bind(fn, me) {
    return function () {
      return fn.apply(me, arguments);
    };
  };

  module = angular.module('ngPintura', []);

  NGPImageLoader = function () {
    function NGPImageLoader(files, loadedCb, progressCb) {
      var file, _i, _len, _ref;
      this.files = files != null ? files : [];
      this.loadedCb = loadedCb;
      this.progressCb = progressCb;
      this.onload = __bind(this.onload, this);
      this.loaded = 0;
      _ref = this.files;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        file.image = new Image();
        file.image.onload = this.onload;
        file.image.src = file.url;
      }
    }

    NGPImageLoader.prototype.onload = function () {
      this.loaded += 1;
      if (this.progressCb) {
        this.progressCb(this.loaded / this.files.length);
      }
      if (this.loaded >= this.files.length) {
        return this.loadedCb(this.files);
      }
    };

    return NGPImageLoader;
  }();

  NGPCanvas = function () {
    function NGPCanvas() {
      var imageNode, indicatorNode, layerNode, stageNode;
      stageNode = new Konva.Stage({
        container: angular.element('<div>')[0]
      });
      layerNode = new Konva.Layer();
      imageNode = new Konva.Image();
      indicatorNode = new Konva.Rect();
      stageNode.add(layerNode);
      layerNode.add(imageNode);
      layerNode.add(indicatorNode);
      this.progressCb = void 0;
      this.stage = stageNode;
      this.layer = layerNode;
      this.image = new NGPImage(imageNode);
      this.indicator = new NGPIndicator(indicatorNode);
    }

    NGPCanvas.prototype.resize = function (width, height) {
      this.stage.size({
        width: width,
        height: height
      });
      this.indicator.node.position({
        x: width / 2,
        y: height / 2
      });
      return this.image.adjustScaleBounds(this.stage.size());
    };

    NGPCanvas.prototype.imageChange = function (src) {
      this.image.node.visible(false);
      this.indicator.node.visible(true);
      this.indicator.animation.start();
      if (typeof src === 'string') {
        return Konva.Image.fromURL(src, function (_this) {
          return function (newImage) {
            _this.setImage(newImage.image());
            return newImage.destroy();
          };
        }(this));
      } else if (src instanceof Image) {
        return this.setImage(src);
      } else if (src instanceof Array) {
        return this.setCollage(src);
      } else {
        return console.log('src is empty or unknown format:', src);
      }
    };

    NGPCanvas.prototype.setImage = function (newImage) {
      this.image.node.size({
        width: newImage.width,
        height: newImage.height
      });
      this.image.node.image(newImage);
      this.indicator.node.visible(false);
      this.indicator.animation.stop();
      this.image.adjustScaleBounds(this.stage.size());
      this.image.node.visible(true);
      this.image.node.parent.draw();
      return this.image.node.fire(this.image.LOADED);
    };

    NGPCanvas.prototype.setCollage = function (files) {
      var loaded;
      loaded = function (_this) {
        return function (images) {
          var image, rowsX, rowsY, tmpLayer, _i, _len;
          rowsX = 0;
          rowsY = 0;
          tmpLayer = new Konva.Layer();
          for (_i = 0, _len = images.length; _i < _len; _i++) {
            image = images[_i];
            rowsX = Math.max(image.x + 1, rowsX);
            rowsY = Math.max(image.y + 1, rowsY);
            tmpLayer.add(new Konva.Image({
              image: image.image,
              x: image.x * image.image.width,
              y: image.y * image.image.height
            }));
          }
          return tmpLayer.toImage({
            x: 0,
            y: 0,
            width: rowsX * images[0].image.width,
            height: rowsY * images[0].image.height,
            callback: function callback(image) {
              _this.setImage(image);
              return tmpLayer.destroy();
            }
          });
        };
      }(this);
      return new NGPImageLoader(files, loaded, this.progressCb);
    };

    return NGPCanvas;
  }();

  /*
   *
   */

  NGPIndicator = function () {
    function NGPIndicator(node) {
      var _animFn;
      this.node = node;
      this.rotationSpeed = 270;
      this.node.setAttrs({
        width: 50,
        height: 50,
        fill: 'pink',
        stroke: 'white',
        strokeWidth: 4,
        zIndex: 99,
        visible: false,
        offset: {
          x: 25,
          y: 25
        }
      });
      _animFn = function (_this) {
        return function (frame) {
          var angleDiff;
          angleDiff = frame.timeDiff * _this.rotationSpeed / 1000;
          return _this.node.rotate(angleDiff);
        };
      }(this);
      this.animation = new Konva.Animation(_animFn, this.node.parent);
    }

    return NGPIndicator;
  }();

  /*
   *
   */

  NGPImage = function () {
    function NGPImage(node) {
      this.node = node;
      this.LOADED = 'loaded';
      this.node.draggable(true);
      this.minScale = 0.5;
      this.maxScale = 1;
      this.tween = void 0;
      this.tweenDuration = 0.25;
    }

    NGPImage.prototype.adjustScaleBounds = function (viewport) {
      if (!this.node.width() || !this.node.height()) {
        return;
      }
      this.minScale = viewport.width / this.node.width();
      if (viewport.height < this.node.height() * this.minScale) {
        this.minScale = viewport.height / this.node.height();
      }
      return this.minScale = Math.min(this.minScale, 1);
    };

    NGPImage.prototype._fitScale = function (scale) {
      return Math.min(Math.max(scale, this.minScale), this.maxScale);
    };

    NGPImage.prototype._zoomToPointAttrs = function (scale, point) {
      var attrs, imgPoint, scaling;
      scaling = this.node.scaleX() + scale;
      scaling = this._fitScale(scaling);
      imgPoint = this.node.getAbsoluteTransform().copy().invert().point(point);
      return attrs = {
        x: (-imgPoint.x + point.x / scaling) * scaling,
        y: (-imgPoint.y + point.y / scaling) * scaling,
        scaleX: scaling,
        scaleY: scaling
      };
    };

    NGPImage.prototype.zoomToPoint = function (scale, point) {
      this.node.setAttrs(this._zoomToPointAttrs(scale, point));
      return this.node.parent.draw();
    };

    NGPImage.prototype.zoomToPointer = function (scale) {
      return this.zoomToPoint(scale, this.node.getStage().getPointerPosition());
    };

    NGPImage.prototype._stageCenter = function () {
      var center;
      return center = {
        x: this.node.getStage().width() / 2,
        y: this.node.getStage().height() / 2
      };
    };

    NGPImage.prototype.zoomToCenter = function (scale) {
      return this.zoomToPoint(scale, this._stageCenter());
    };

    NGPImage.prototype.zoomToPointTween = function (scale, point, callback) {
      var tweenAttrs;
      tweenAttrs = this._zoomToPointAttrs(scale, point);
      if (scale !== this.node.scaleX() || tweenAttrs.x !== this.node.x() || tweenAttrs.y !== this.node.y()) {
        if (this.tween) {
          this.tween.pause().destroy();
        }
        this.tween = new Konva.Tween(angular.extend(tweenAttrs, {
          node: this.node,
          duration: this.tweenDuration,
          easing: Konva.Easings.EaseOut,
          onFinish: callback
        }));
        return this.tween.play();
      }
    };

    NGPImage.prototype.zoomToCenterTween = function (scale, callback) {
      return this.zoomToPointTween(scale, this._stageCenter(), callback);
    };

    NGPImage.prototype.moveByVectorTween = function (v, callback) {
      var pos;
      pos = this.node.position();
      if (v.x) {
        pos.x += v.x;
      }
      if (v.y) {
        pos.y += v.y;
      }
      if (pos.x !== this.node.x() || pos.y !== this.node.y()) {
        if (this.tween) {
          this.tween.pause().destroy();
        }
        this.tween = new Konva.Tween(angular.extend(pos, {
          node: this.node,
          duration: this.tweenDuration,
          easing: Konva.Easings.EaseOut,
          onFinish: callback
        }));
        return this.tween.play();
      }
    };

    NGPImage.prototype.fitInViewTween = function (callback) {
      var attrs, imgScaled;
      imgScaled = {
        width: this.node.width() * this.minScale,
        height: this.node.height() * this.minScale
      };
      attrs = {
        scaleX: this.minScale,
        scaleY: this.minScale,
        x: imgScaled.width < this.node.getStage().width() ? (this.node.getStage().width() - imgScaled.width) / 2 : 0,
        y: imgScaled.height < this.node.getStage().height() ? (this.node.getStage().height() - imgScaled.height) / 2 : 0
      };
      if (attrs.x !== this.node.x() || attrs.y !== this.node.y() || attrs.scaleX !== this.node.scaleX()) {
        if (this.tween) {
          this.tween.pause().destroy();
        }
        this.tween = new Konva.Tween(angular.extend(attrs, {
          node: this.node,
          duration: this.tweenDuration,
          easing: Konva.Easings.EaseOut,
          onFinish: callback
        }));
        return this.tween.play();
      }
    };

    return NGPImage;
  }();

  module.service('ngPintura', function () {
    return new NGPCanvas();
  });

  /**
   * pintura container
   * creates and shares paperjs scope with child directives
   * creates canvas
   */

  module.directive('ngPintura', ["ngPintura", "$window", function (ngPintura, $window) {
    var directive;
    return directive = {
      transclude: true,
      scope: {
        src: '=ngpSrc',
        scaling: '=ngpScaling',
        position: '=ngpPosition',
        fitOnload: '=ngpfitOnload',
        maxScaling: '=ngpMaxScaling',
        scaleStep: '=ngpScaleStep',
        mwScaleStep: '=ngpMwScaleStep',
        moveStep: '=ngpMoveStep',
        progress: '=ngpProgress'
      },
      link: function link(scope, element, attrs, ctrl, transcludeFn) {
        var applySyncScope, imageChange, imageLoad, maxScalingChange, mouseWheel, positionChange, resizeContainer, scalingChange, setScalingDisabled, syncScope;
        scope.slider = {
          value: void 0,
          fromScaling: function fromScaling(scale) {
            return this.value = parseInt((scale - ngPintura.image.minScale) / (ngPintura.image.maxScale - ngPintura.image.minScale) * 100);
          },
          toScaling: function toScaling() {
            return (ngPintura.image.maxScale - ngPintura.image.minScale) * (this.value / 100) + ngPintura.image.minScale;
          }
        };
        resizeContainer = function resizeContainer() {
          ngPintura.resize(element[0].clientWidth, element[0].clientHeight);
          return setScalingDisabled();
        };
        imageChange = function imageChange() {
          return ngPintura.imageChange(scope.src);
        };
        positionChange = function positionChange() {
          var _ref, _ref1;
          if (((_ref = scope.position) != null ? _ref.x : void 0) && ((_ref1 = scope.position) != null ? _ref1.y : void 0)) {
            ngPintura.image.node.position(scope.position);
            return ngPintura.layer.draw();
          }
        };
        scalingChange = function scalingChange() {
          ngPintura.image.node.scale({
            x: scope.scaling,
            y: scope.scaling
          });
          ngPintura.layer.draw();
          return scope.slider.fromScaling(scope.scaling);
        };
        mouseWheel = function mouseWheel(e) {
          e.evt.preventDefault();
          if (e.evt.wheelDeltaY > 0) {
            ngPintura.image.zoomToPointer(scope.mwScaleStep);
          } else {
            ngPintura.image.zoomToPointer(-scope.mwScaleStep);
          }
          return applySyncScope();
        };
        syncScope = function syncScope() {
          scope.position = ngPintura.image.node.position();
          scope.scaling = ngPintura.image.node.scaleX();
          if (scope.slider.toScaling() !== scope.scaling) {
            return scope.slider.fromScaling(scope.scaling);
          }
        };
        applySyncScope = function applySyncScope() {
          return scope.$apply(syncScope);
        };
        scope.fitInView = function () {
          return ngPintura.image.fitInViewTween(applySyncScope);
        };
        scope.moveUp = function () {
          return ngPintura.image.moveByVectorTween({
            y: scope.moveStep
          }, applySyncScope);
        };
        scope.moveDown = function () {
          return ngPintura.image.moveByVectorTween({
            y: -scope.moveStep
          }, applySyncScope);
        };
        scope.moveRight = function () {
          return ngPintura.image.moveByVectorTween({
            x: -scope.moveStep
          }, applySyncScope);
        };
        scope.moveLeft = function () {
          return ngPintura.image.moveByVectorTween({
            x: scope.moveStep
          }, applySyncScope);
        };
        scope.zoomIn = function () {
          return ngPintura.image.zoomToCenterTween(scope.scaleStep, applySyncScope);
        };
        scope.zoomOut = function () {
          return ngPintura.image.zoomToCenterTween(-scope.scaleStep, applySyncScope);
        };
        scope.sliderChange = function () {
          var scale;
          scale = scope.slider.toScaling() - ngPintura.image.node.scaleX();
          ngPintura.image.zoomToCenter(scale);
          return syncScope();
        };
        setScalingDisabled = function setScalingDisabled() {
          return scope.scalingDisabled = ngPintura.image.minScale >= ngPintura.image.maxScale;
        };
        imageLoad = function imageLoad() {
          if (scope.fitOnload) {
            scope.fitInView();
          }
          return setScalingDisabled();
        };
        maxScalingChange = function maxScalingChange() {
          ngPintura.image.maxScale = scope.maxScaling;
          return setScalingDisabled();
        };
        ngPintura.progressCb = function (progress) {
          return scope.$apply(function () {
            return scope.progress = progress;
          });
        };
        if (scope.maxScaling == null) {
          scope.maxScaling = 1;
        }
        if (scope.scaleStep == null) {
          scope.scaleStep = 0.4;
        }
        if (scope.mwScaleStep == null) {
          scope.mwScaleStep = 0.1;
        }
        if (scope.moveStep == null) {
          scope.moveStep = 100;
        }
        if (scope.fitOnload == null) {
          scope.fitOnload = true;
        }
        element.append(ngPintura.stage.content);
        resizeContainer();
        angular.element($window).on('resize', resizeContainer);
        scope.$watch('src', imageChange);
        scope.$watch('position', positionChange, true);
        scope.$watch('scaling', scalingChange);
        scope.$watch('maxScaling', maxScalingChange);
        ngPintura.image.node.on('dragend', applySyncScope);
        ngPintura.image.node.on('mousewheel', mouseWheel);
        ngPintura.image.node.on(ngPintura.image.LOADED, imageLoad);
        return transcludeFn(scope, function (clonedTranscludedTemplate) {
          return element.append(clonedTranscludedTemplate);
        });
      }
    };
  }]);
}).call(undefined);
//# sourceMappingURL=angular-pintura.js.map

'use strict';

(function () {

  function AuthService($location, $http, $cookies, $q, appConfig, Util, User) {
    var safeCb = Util.safeCb;
    var currentUser = {};
    var userRoles = appConfig.userRoles || [];

    if ($cookies.get('token') && $location.path() !== '/logout') {
      currentUser = User.get();
    }

    var Auth = {

      /**
       * Authenticate user and save token
       *
       * @param  {Object}   user     - login info
       * @param  {Function} callback - optional, function(error, user)
       * @return {Promise}
       */
      login: function login(_ref, callback) {
        var email = _ref.email,
            password = _ref.password;

        return $http.post('/auth/local', {
          email: email,
          password: password
        }).then(function (res) {
          $cookies.put('token', res.data.token);
          currentUser = User.get();
          return currentUser.$promise;
        }).then(function (user) {
          safeCb(callback)(null, user);
          return user;
        }).catch(function (err) {
          Auth.logout();
          safeCb(callback)(err.data);
          return $q.reject(err.data);
        });
      },


      /**
       * Delete access token and user info
       */
      logout: function logout() {
        $cookies.remove('token');
        currentUser = {};
      },


      /**
       * Create a new user
       *
       * @param  {Object}   user     - user info
       * @param  {Function} callback - optional, function(error, user)
       * @return {Promise}
       */
      createUser: function createUser(user, callback) {
        return User.save(user, function (data) {
          $cookies.put('token', data.token);
          currentUser = User.get();
          return safeCb(callback)(null, user);
        }, function (err) {
          Auth.logout();
          return safeCb(callback)(err);
        }).$promise;
      },


      /**
       * Change password
       *
       * @param  {String}   oldPassword
       * @param  {String}   newPassword
       * @param  {Function} callback    - optional, function(error, user)
       * @return {Promise}
       */
      changePassword: function changePassword(oldPassword, newPassword, callback) {
        return User.changePassword({ id: currentUser._id }, {
          oldPassword: oldPassword,
          newPassword: newPassword
        }, function () {
          return safeCb(callback)(null);
        }, function (err) {
          return safeCb(callback)(err);
        }).$promise;
      },


      /**
       * Gets all available info on a user
       *   (synchronous|asynchronous)
       *
       * @param  {Function|*} callback - optional, funciton(user)
       * @return {Object|Promise}
       */
      getCurrentUser: function getCurrentUser(callback) {
        if (arguments.length === 0) {
          return currentUser;
        }

        var value = currentUser.hasOwnProperty('$promise') ? currentUser.$promise : currentUser;
        return $q.when(value).then(function (user) {
          safeCb(callback)(user);
          return user;
        }, function () {
          safeCb(callback)({});
          return {};
        });
      },


      /**
       * Check if a user is logged in
       *   (synchronous|asynchronous)
       *
       * @param  {Function|*} callback - optional, function(is)
       * @return {Bool|Promise}
       */
      isLoggedIn: function isLoggedIn(callback) {
        if (arguments.length === 0) {
          return currentUser.hasOwnProperty('role');
        }

        return Auth.getCurrentUser(null).then(function (user) {
          var is = user.hasOwnProperty('role');
          safeCb(callback)(is);
          return is;
        });
      },

      isLoggedInAsync: function isLoggedInAsync(cb) {
        if (currentUser.hasOwnProperty('$promise')) {
          currentUser.$promise.then(function () {
            cb(true);
          }).catch(function () {
            cb(false);
          });
        } else if (currentUser.hasOwnProperty('role')) {
          cb(true);
        } else {
          cb(false);
        }
      },

      /**
       * Check if a user has a specified role or higher
       *   (synchronous|asynchronous)
       *
       * @param  {String}     role     - the role to check against
       * @param  {Function|*} callback - optional, function(has)
       * @return {Bool|Promise}
       */
      hasRole: function hasRole(role, callback) {
        var hasRole = function hasRole(r, h) {
          return userRoles.indexOf(r) >= userRoles.indexOf(h);
        };

        if (arguments.length < 2) {
          return hasRole(currentUser.role, role);
        }

        return Auth.getCurrentUser(null).then(function (user) {
          var has = user.hasOwnProperty('role') ? hasRole(user.role, role) : false;
          safeCb(callback)(has);
          return has;
        });
      },


      /**
       * Check if a user is an admin
       *   (synchronous|asynchronous)
       *
       * @param  {Function|*} callback - optional, function(is)
       * @return {Bool|Promise}
       */
      isAdmin: function isAdmin() {
        return Auth.hasRole.apply(Auth, [].concat.apply(['admin'], arguments));
      },


      /**
       * Get auth token
       *
       * @return {String} - a token string used for authenticating
       */
      getToken: function getToken() {
        return $cookies.get('token');
      }
    };

    return Auth;
  }

  angular.module('mediaboxApp.auth').factory('Auth', AuthService);
})();
//# sourceMappingURL=auth.service.js.map

'use strict';

(function () {

  function authInterceptor($q, $cookies, $injector, Util, Settings) {
    var state;

    return {
      // Add authorization token to headers
      request: function request(config) {
        config.headers = config.headers || {};
        if (Settings.demo) {
          if (config.method === 'PATCH' || config.method === 'PUT' || config.method === 'POST' || config.method === 'DELETE') {
            var allowedURL = config.url === '/auth/local' || config.url.match('api/users/*') // Allow login, signup, change-password, forgot, reset ** User Deletion blocked at admin page
            || config.url === '/api/orders' || config.url === '/api/reviews' || config.url === '/api/wishlists' || config.url === '/api/pay/stripe' || config.url === '/api/sendmail' || config.url.match('/api/address/*');
            if (!allowedURL || config.method === 'DELETE' || config.data.role) {
              // Do not allow delete in demo mode
              var response = { type: 'demo', text: 'Demo Mode: Unable to save', message: 'Demo Mode: Unable to save', data: 'Demo Mode: Unable to save' };
              $injector.get('Toast').show(response);
              return $q.reject(response);
            }
          }
        }
        if ($cookies.get('token') && Util.isSameOrigin(config.url)) {
          config.headers.Authorization = 'Bearer ' + $cookies.get('token');
        }
        return config;
      },


      // Intercept 401s and redirect you to login
      responseError: function responseError(response) {
        // console.log('error at auth interceptor', response)
        if (response.status === 401) {
          // $injector.get('Toast').show({type: 'error', text: response.statusText});
          if (response.config.url !== "/auth/local") // If the request is not from login modal page
            $injector.get('LoginModal').show('/'); // Causes circular dependency

          // (state || (state = $injector.get('$state'))).go('login');
          // remove any stale tokens
          $cookies.remove('token');
        }
        return $q.reject(response);
      }
    };
  }

  angular.module('mediaboxApp.auth').factory('authInterceptor', authInterceptor);
})();
//# sourceMappingURL=interceptor.service.js.map

'use strict';

(function () {

  angular.module('mediaboxApp.auth').run(function ($rootScope, $state, $location, Auth, LoginModal, Toast) {
    // Redirect to login if route requires auth and the user is not logged in, or doesn't have required role
    $rootScope.$on('$stateChangeStart', function (event, next) {
      // Routes that does not require login (Public routes)
      if (!next.authenticate) {
        return;
      }
      // Routes that require specific roles
      if (typeof next.authenticate === 'string') {
        Auth.hasRole(next.authenticate, _.noop).then(function (has) {
          if (has) {
            return;
          }
          $state.go('login');
          Toast.show({ type: 'error', text: 'Unauthorized to make changes' });
        });
      } else {
        // Routes that require only authentication without any specific roles
        Auth.isLoggedInAsync(function (is) {
          if (!is) {
            event.preventDefault();
            LoginModal.show(next.name);
          }
        });
      }
    });
    $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
      // this is required if you want to prevent the $UrlRouter reverting the URL to the previous valid location
      Toast.show({ type: 'error', text: 'The requested page has some error' });
      return $location.path(fromState, fromParams);
    });
  });
})();
//# sourceMappingURL=router.decorator.js.map

'use strict';

(function () {

  function UserResource($resource) {
    return $resource('/api/users/:id/:controller', {
      id: '@_id'
    }, {
      changePassword: {
        method: 'PUT',
        params: {
          controller: 'password'
        }
      },
      get: {
        method: 'GET',
        params: {
          id: 'me'
        }
      }
    });
  }

  angular.module('mediaboxApp.auth').factory('User', UserResource);
})();
//# sourceMappingURL=user.service.js.map

'use strict';

angular.module('mediaboxApp').directive('input', ['$mdDatePicker', '$timeout', function ($mdDatePicker, $timeout) {
  return {
    restrict: 'E',
    require: '?ngModel',
    templateUrl: 'components/calendar/calendar.html',
    link: function link(scope, element, attrs, ngModel) {
      if ('undefined' !== typeof attrs.type && 'calendar' === attrs.type && ngModel) {
        $timeout(function () {
          var isDate = moment(ngModel.$modelValue).isValid();
          if (isDate) {
            ngModel.$setViewValue(moment(ngModel.$modelValue).format('YYYY-MM-DD'));
            ngModel.$render();
          }
        });
        // ngModel.$setViewValue('2013-12-10');
        // ngModel.$render();
        angular.element(element).on('click', function (ev) {
          var isDate = moment(ngModel.$modelValue).isValid();
          if (!isDate) {
            ngModel.$modelValue = Date.now();
          }
          $mdDatePicker(ev, ngModel.$modelValue).then(function (selectedDate) {
            $timeout(function () {
              var isDate = moment(selectedDate).isValid();
              if (isDate) {
                ngModel.$setViewValue(moment(selectedDate).format('YYYY-MM-DD'));
                ngModel.$render();
              }
            });
          });
        });
      }
    }
  };
}]).controller('DatePickerCtrl', ['$scope', '$mdDialog', 'currentDate', '$mdMedia', function ($scope, $mdDialog, currentDate, $mdMedia) {
  var self = this;
  this.currentDate = currentDate;
  this.currentMoment = moment(self.currentDate);
  this.weekDays = moment.weekdaysMin();

  $scope.$mdMedia = $mdMedia;
  $scope.yearsOptions = [];
  for (var i = 1970; i <= this.currentMoment.year() + 100; i++) {
    $scope.yearsOptions.push(i);
  }
  $scope.year = this.currentMoment.year();

  this.setYear = function () {
    self.currentMoment.year($scope.year);
  };

  this.selectDate = function (dom) {
    self.currentMoment.date(dom);
  };

  this.cancel = function () {
    $mdDialog.cancel();
  };

  this.confirm = function () {
    $mdDialog.hide(this.currentMoment.toDate());
  };

  this.getDaysInMonth = function () {
    var days = self.currentMoment.daysInMonth(),
        firstDay = moment(self.currentMoment).date(1).day();

    var arr = [];
    for (var i = 1; i <= firstDay + days; i++) {
      arr.push(i > firstDay ? i - firstDay : false);
    }
    return arr;
  };

  this.nextMonth = function () {
    self.currentMoment.add(1, 'months');
    $scope.year = self.currentMoment.year();
  };

  this.prevMonth = function () {
    self.currentMoment.subtract(1, 'months');
    $scope.year = self.currentMoment.year();
  };
}]).factory('$mdDatePicker', ['$mdDialog', function ($mdDialog) {
  var datePicker = function datePicker(targetEvent, currentDate) {
    var jsDate = moment(currentDate, 'DD-MMM-YYYY').toDate();
    if (!angular.isDate(jsDate)) {
      currentDate = Date.now();
    }
    return $mdDialog.show({
      controller: 'DatePickerCtrl',
      controllerAs: 'datepicker',
      templateUrl: '/modal.datepicker.html',
      targetEvent: targetEvent,
      locals: {
        currentDate: currentDate
      }
    });
  };

  return datePicker;
}]);
//# sourceMappingURL=calendar.directive.js.map

'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
    var cartButtonsController =
    /*@ngInject*/
    function cartButtonsController(Cart, Auth) {
        _classCallCheck(this, cartButtonsController);

        this.cart = Cart.cart;
        this.Auth = Auth;
        this.addItem = function (product, variant, i) {
            var advertiser = this.Auth.getCurrentUser();
            i = i || 1;

            if (product.campaignName) {

                this.cart.addItem({ sku: variant._id, name: variant.name, slug: variant.formart, mrp: variant.model, image: variant.image, weight: variant.maxSize, size: variant.size, price: variant.price, quantity: 1, 'advertiser': advertiser, publisher: variant.publisher, publisheruid: variant.publisheruid, vid: variant._id }, i);
            }

            //ng-click="cart.addItem({sku:adspace.sku, name:adspace.name,slug:adspace.formart,mrp:adspace.model, weight:adspace.maxSize,size:adspace.size,price:adspace.price ,status: {name:'New', val:402}, publisher:product.name,advertiser:user,uid:product.uid,category:product.brand.name,image:product.logo[0].base64,quantity:1} ,true);"
            /*
               todo add category to cart
             */

            this.cart.addItem({ sku: variant._id, name: variant.name, slug: variant.formart, mrp: variant.model, weight: variant.maxSize, size: variant.size, price: variant.price, status: { name: 'New', val: 402 }, publisher: product.name, publisheruid: product.uid, advertiser: this.Auth.getCurrentUser(), uid: product.uid, image: product.logo[0].base64, quantity: 1, vid: variant._id }, i);
        };
    };

    angular.module('mediaboxApp').component('cartButtons', {
        template: '    \n        <section class="md-actions cta" layout="row" layout-align="start end" ng-show="$ctrl.variant.price" ng-if="$ctrl.cart.checkCart($ctrl.variant._id, $ctrl.variant._id)">\n            <md-button ng-click="$ctrl.addItem($ctrl.product, $ctrl.variant)" class="md-raised md-primary"\n            aria-label="Add to cart">\n                <ng-md-icon icon="shopping_cart"></ng-md-icon>Add to cart\n            </md-button>\n        </section>\n\n        <section class="md-actions cta" ng-hide="$ctrl.variant.price" layout="row" layout-align="start end" ng-if="$ctrl.cart.checkCart($ctrl.variant._id, $ctrl.variant._id)">\n            <md-button ng-click="$ctrl.addItem($ctrl.product, $ctrl.variant)" class="md-raised md-primary"\n            aria-label="Add to cart">\n                <ng-md-icon icon="mail_outline"></ng-md-icon>Enquire\n            </md-button>\n        </section>\n\n        <section class="md-actions cta" layout="row" layout-align="start center" ng-if="!$ctrl.cart.checkCart($ctrl.variant._id, $ctrl.variant._id)">\n            <md-button class="md-raised md-primary left md-icon-button" \n            ng-click="$ctrl.addItem($ctrl.product, $ctrl.variant,-1)" \n            aria-label="Remove from cart">\n                <ng-md-icon icon="remove"></ng-md-icon>\n            </md-button>\n\n            <md-button class="middle" aria-label="Cart quantity" ui-sref="checkout">Buy {{$ctrl.cart.getQuantity($ctrl.variant._id, $ctrl.variant._id)}}</md-button>\n\n            <md-button class="md-raised md-primary right md-icon-button" ng-click="$ctrl.addItem($ctrl.product, $ctrl.variant,1)" aria-label="Add to cart">\n                <ng-md-icon icon="add"></ng-md-icon>\n            </md-button>\n        </section>\n    ',
        bindings: {
            product: '<', // One way binding towards controller
            variant: '<', // One way binding towards controller
            readOnly: '@?' // String value
        },
        controller: cartButtonsController
    });
})();
//# sourceMappingURL=cart-buttons.component.js.map

'use strict';

angular.module('mediaboxApp').directive('crudTable', function ($http, $state) {
  return {
    templateUrl: 'components/crud-table/main.html',
    restrict: 'E',
    scope: { api: '@', columns: '=options' },
    transclude: true,
    link: function link(scope, element, attrs) {
      var obj = [];
      var columns = scope.columns;
      angular.forEach(columns, function (i) {
        var o = {};
        // Extract sortType from dataType
        if (i.dataType === 'numeric' || i.dataType === 'number' || i.dataType === 'float' || i.dataType === 'integer' || i.dataType === 'currency') {
          i.dataType = 'parseFloat';
          o.sortType = 'parseFloat';
        } else if (i.dataType === 'date' || i.dataType === 'calendar') {
          i.dataType = 'date';
          o.sortType = 'date';
        } else if (i.dataType === 'dropdown' || i.dataType === 'select' || i.dataType === 'option') {
          i.dataType = 'dropdown';
          o.sortType = 'lowercase';
        } else if (i.dataType === 'textarea' || i.dataType === 'multiline') {
          i.dataType = 'textarea';
          o.sortType = 'lowercase';
        } else if (i.dataType === 'image' || i.dataType === 'photo' || i.dataType === 'picture') {
          i.dataType = 'image';
          o.sortType = 'lowercase';
        } else {
          o.sortType = 'lowercase';
        }
        // check heading (Assign heading if not exists)
        if ('heading' in i) {
          o.heading = i.heading;
        } else if ('title' in i) {
          o.heading = i.title;
        } else {
          o.heading = i.field;
        }

        // Assign fields to object
        o.field = i.field;
        // o.sort = attrs.sort; // The field where the sort=true
        o.noSort = i.noSort;
        o.noAdd = i.noAdd;
        o.noEdit = i.noEdit;
        o.dataType = i.dataType;
        o.options = i.options;

        obj.push(o);
      });
      $state.go('crud-table', { api: attrs.api, options: attrs, columns: obj }, { location: false });
    }
  };
});
//# sourceMappingURL=crud-table.js.map

'use strict';

(function () {

  function CrudTableDetailController($http, $state, Toast, $stateParams, ToggleComponent, Settings, $mdDialog, socket, $scope, $filter) {
    var vm = this;
    var api = $stateParams.api;
    // var _id = $stateParams.id;
    vm.myDate = new Date();
    vm.header = api;
    vm.item = angular.copy($stateParams.data);
    vm.columns = $stateParams.columns;
    vm.mediaLibrary = function () {
      $mdDialog.show({
        templateUrl: '/components/crud-table/media-library.html',
        controller: function controller($scope, $mdDialog) {
          // Start query the database for the table
          $scope.loading = true;
          $http.get('/api/media/').then(function (res) {
            $scope.loading = false;
            $scope.media = res.data;
            socket.syncUpdates('media', $scope.data);
          }, handleError);

          function handleError(error) {
            // error handler
            $scope.loading = false;
            if (error.status === 403) {
              Toast.show({
                type: 'error',
                text: 'Not authorised to make changes.'
              });
            } else if (error.status !== 500) {
              Toast.show({
                type: 'error',
                text: error.status
              });
            }
          }
          $scope.ok = function (path) {
            $mdDialog.hide(path);
          };
          $scope.hide = function () {
            $mdDialog.hide();
          };
          $scope.cancel = function () {
            $mdDialog.cancel();
          };
          $scope.addNewImage = function () {
            $state.go('media');
            $mdDialog.hide(path);
          };
        }
      }).then(function (answer) {
        vm.item.image = answer;
      }, function () {});
    };

    function goBack() {
      ToggleComponent('crud-table.detailView').close();
      $state.go('^', {}, { location: false });
    }
    vm.goBack = goBack;

    vm.edit = function (product) {
      // refuse to work with invalid data
      if (!product) {
        return;
      }

      $http.put('/api/' + $filter('pluralize')(api) + '/' + product._id, product).then(success).catch(err);
      function success(res) {
        var item = vm.item = res.data;
        Toast.show({ type: 'success', text: api + ' has been updated' });
      }

      function err(err) {}
    };
  }

  angular.module('mediaboxApp').controller('CrudTableDetailController', CrudTableDetailController);
})();
//# sourceMappingURL=detail.controller.js.map

'use strict';

(function () {

  function CrudTableListController($scope, $http, socket, $state, $stateParams, Modal, Toast, Settings, $filter, $mdDialog) {
    var api = $stateParams.api;
    this.sortPredicate = $stateParams.options.sort;
    var options = $stateParams.options;
    this.cols = $stateParams.columns;
    this.header = api;
    this.sort = {};
    this.$mdDialog = $mdDialog;
    var vm = this;
    vm.loading = true;

    // the selected item id
    var _id = null;
    var originatorEv;

    if (options) {
      if (options.predicate) {
        this.sort.predicate = options.predicate;
      } else {
        this.sort.predicate = this.sortPredicate || 'name';
      }
    }
    this.sort.reverse = true;
    this.order = function (predicate) {
      this.sort.reverse = this.sort.predicate === predicate ? !this.sort.reverse : false;
      this.sort.predicate = predicate;
    };
    this.no = {};
    if ('noadd' in options) {
      this.no.add = true;
    }
    if ('nocopy' in options) {
      this.no.copy = true;
    }
    if ('nodelete' in options) {
      this.no.delete = true;
    }
    if ('noedit' in options) {
      this.no.edit = true;
    }
    if ('nosort' in options) {
      this.no.sort = true;
    }
    if ('nosearch' in options) {
      this.no.filter = true;
    }
    if ('nofilter' in options) {
      this.no.filter = true;
    }
    if ('noexport' in options) {
      this.no.export = true;
    }
    this.l = 10;
    this.loadMore = function () {
      this.l += 2;
    };

    this.exportData = function (type) {
      var data = JSON.stringify(this.data, undefined, 2);
      var blob;
      if (type === 'txt') {
        // Save as .txt
        blob = new Blob([data], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, options.api + '.txt');
      } else if (type === 'csv') {
        // Save as .csv
        blob = new Blob([document.getElementById('exportable').innerHTML], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8' });
        saveAs(blob, options.api + ".csv");
      } else if (type === 'xls') {
        // Save as xls
        blob = new Blob([document.getElementById('exportable').innerHTML], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
        });
        saveAs(blob, options.api + ".xls");
      } else {
        // Save as .json
        blob = new Blob([data], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, options.api + '.json');
      }
    };

    this.openMenu = function ($mdOpenMenu, ev) {
      originatorEv = ev;
      $mdOpenMenu(ev);
    };
    vm.isSelected = function (product) {
      return _id === product._id;
    };

    // Start query the database for the table
    vm.loading = true;
    var api2 = $filter('pluralize')(api);

    $http.get('/api/' + api2).then(function (res) {
      vm.loading = false;
      vm.data = res.data;
      socket.syncUpdates(api, vm.data);
    }, handleError);

    this.changeStatus = function (x) {
      $http.put('/api/' + api2 + '/' + x._id, { active: x.active }).then(function () {}, handleError);
    };

    this.copy = function (data) {
      var confirm = this.$mdDialog.confirm().title('Would you like to copy the ' + api + '?').ariaLabel('Confirm to copy ' + api).ok('Yes').cancel('No');
      this.$mdDialog.show(confirm).then(function () {
        var d = angular.copy(data);
        delete d._id;
        $http.post('/api/' + api2, d).then(function (response) {
          Toast.show({
            type: 'success',
            text: 'The ' + options.api + ' copied successfully.'
          });
        }).catch(function (err) {
          if (err.type === 'demo') return;

          Toast.show({
            type: 'warn',
            text: 'Error while duplicating ' + options.api
          });
        });
      });
    };

    this.delete = function (data) {
      var confirm = this.$mdDialog.confirm().title('Would you like to delete the ' + api + '?').ariaLabel('Confirm delete ' + api).ok('Yes').cancel('No');
      this.$mdDialog.show(confirm).then(function () {
        $http.delete('/api/' + api2 + '/' + data._id).then(function () {}, handleError);
      });
    };

    function handleError(error) {
      // error handler
      vm.loading = false;
      if (error.status === 401 || error.status === 403) {
        Toast.show({
          type: 'error',
          text: 'Not authorised to make changes.'
        });
      } else if (error.status === 404) {
        Toast.show({ type: 'error', text: 'The requested resource not found.' });
      } else if (error.status !== 500 && error.type !== 'demo') {
        Toast.show({
          type: 'error',
          text: error.status
        });
      }
    }

    this.showInDetails = function (item) {
      _id = item._id;
      $state.go('detail', { 'data': item }, { location: false });
    };
  }

  angular.module('mediaboxApp').controller('CrudTableListController', CrudTableListController);
})();
//# sourceMappingURL=list.controller.js.map

'use strict';

(function () {

  function CrudTableMainController(Modal, $stateParams) {
    var options = $stateParams.options;
    var cols = $stateParams.columns;
    this.create = function () {
      Modal.show(cols, options);
    };
  }

  angular.module('mediaboxApp').controller('CrudTableMainController', CrudTableMainController);
})();
//# sourceMappingURL=main.controller.js.map

'use strict';

(function () {
  'use strict';

  angular.module('mediaboxApp').config(mainRoute);
  mainRoute.$inject = ['$stateProvider'];
  function mainRoute($stateProvider, $stateParams) {
    $stateProvider.state('crud-table', {
      url: '/crud-table/:api',
      params: { options: null, columns: null },
      views: {
        '': {
          templateUrl: 'components/crud-table/main.html',
          controller: 'CrudTableMainController as main'
        },
        'content@crud-table': {
          url: '/content',
          templateUrl: 'components/crud-table/list.html',
          controller: 'CrudTableListController as list'
        }
      }
    }).state('detail', {
      url: '/detail/:id',
      onEnter: onEnterUserListDetail, // To open right sidebar
      params: { data: null },
      parent: 'crud-table',
      views: {
        '': {
          templateUrl: 'components/crud-table/main.html'
        },
        'detail': {
          templateUrl: 'components/crud-table/detail.html',
          controller: 'CrudTableDetailController as detail'
        }
      }
    }).state('create', {
      url: '/create',
      parent: 'crud-table',
      params: { data: null },
      views: {
        '': {}
      }
    });
  }
  function resolveIdFromArray($stateParams) {
    return { '_id': $stateParams.id, 'api': $stateParams.api };
  }

  onEnterUserListDetail.$inject = ['$timeout', 'ToggleComponent'];

  function onEnterUserListDetail($timeout, ToggleComponent) {
    $timeout(showDetails, 0, false);
    function showDetails() {
      ToggleComponent('crud-table.detailView').open();
    }
  }
})();
//# sourceMappingURL=main.js.map

'use strict';

angular.module('mediaboxApp').directive('noautocomplete', function () {

  return {

    restrict: 'A',

    link: function link(scope, el, attrs) {
      // password fields need one of the same type above it (firefox)
      var type = el.attr('type') || 'text';
      // chrome tries to act smart by guessing on the name.. so replicate a shadow name
      var name = el.attr('name') || '';
      var shadowName = name + '_shadow';
      // trick the browsers to fill this innocent silhouette
      var shadowEl = angular.element('<input type="' + type + '" name="' + shadowName + '" style="display: none">');

      // insert before
      el.parent()[0].insertBefore(shadowEl[0], el[0]);
    }

  };
}).directive('errSrc', function () {
  return {
    link: function link(scope, element, attrs) {
      element.bind('error', function () {
        if (attrs.src !== attrs.errSrc) {
          attrs.$set('src', attrs.errSrc);
        }
      });
    }
  };
}).directive('onlyNumbers', function () {
  return function (scope, element, attrs) {
    var keyCode = [8, 9, 13, 37, 39, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 110, 190];
    element.bind('keydown', function (event) {
      if (_.indexOf(keyCode, event.which) === -1) {
        scope.$apply(function () {
          scope.$eval(attrs.onlyNum);
          event.preventDefault();
        });
        event.preventDefault();
      }
    });
  };
}).directive('focusMe', function ($timeout, $parse) {
  return {
    link: function link(scope, element, attrs) {
      var model = $parse(attrs.focusMe);
      scope.$watch(model, function (value) {
        if (value === true) {
          $timeout(function () {
            element[0].focus();
          });
        }
      });
      // on blur event:
      element.bind('blur', function () {
        scope.$apply(model.assign(scope, false));
      });
    }
  };
}).directive('ngPrism', ['$interpolate', function ($interpolate) {
  return {
    restrict: 'E',
    template: '<pre><code ng-transclude></code></pre>',
    replace: true,
    transclude: true
  };
}]).directive('validateCart', function (Cart) {
  return {
    restrict: 'A',
    scope: true,
    require: 'ngModel',
    link: function link(scope, elem, attrs, control) {
      var checker = function checker() {
        var cv = Cart.cart.getTotalPrice();
        // if(e2!=null)
        return cv !== 0;
      };
      scope.$watch(checker, function (n) {
        control.$setValidity("validCart", n);
      });
    }
  };
});
//# sourceMappingURL=directive.directive.js.map

'use strict';

function ShoppingCart(cartName, Settings, Shipping, Order, Mail, Pay, appConfig, $state) {
    this.cartName = cartName;
    this.clearCart = false;
    this.flag = false;
    this.pflag = false;
    this.checkoutParameters = {};
    this.items = [];
    this.skuArray = [];
    this.variantsArray = [];
    this.totalWeight = 0;
    this.taxRate = 10;
    this.tax = null;
    this.campaignName = "";
    this.objectives = "";
    this.startDate = "";
    this.endDate = "";
    this.products = null;
    this.totalSpend = null;
    this.spendStats = null;
    this.age = [];
    this.income = [];
    // load items from local storage when initializing
    this.loadItems();

    this.Settings = Settings;
    this.Shipping = Shipping;
    this.Order = Order;
    this.Mail = Mail;
    this.Pay = Pay;
    this.appConfig = appConfig;
    this.$state = $state;
}

//----------------------------------------------------------------
// items in the cart
//
function CartItem(sku, name, slug, mrp, price, quantity, image, category, size, weight, status, publisher, publisheruid, advertiser, uid, vid) {
    this.sku = sku;
    this.name = name;
    this.slug = slug;
    this.image = image;
    this.category = category;
    this.size = size;
    this.mrp = mrp;
    this.price = price * 1;
    this.quantity = quantity * 1;
    this.weight = weight;
    this.status = status;
    this.publisher = publisher;
    this.publisheruid = publisheruid;
    this.advertiser = advertiser;
    this.uid = uid;
    this.vid = vid;
    this.status = 0;
}

//----------------------------------------------------------------
// checkout parameters (one per supported payment service)
// replaced this.serviceName with serviceName because of jshint complaint
//
function checkoutParameters(serviceName, merchantID, options) {
    this.serviceName = serviceName;
    this.merchantID = merchantID;
    this.options = options;
}

// load items from local storage
ShoppingCart.prototype.loadItems = function () {
    var items = localStorage !== null ? localStorage[this.cartName + '_items'] : null;
    if (items !== null && JSON !== null) {
        try {
            items = JSON.parse(items);
            for (var i = 0; i < items.length; i++) {
                var item = items[i];

                if (this.pflag) {
                    if (item.sku !== null && item.name !== null && item.price !== null) {
                        item = new CartItem(item.sku, item.name, item.slug, item.mrp, item.price, item.quantity, item.image, item.category, item.size, item.weight, item.status, item.publisher, item.publisheruid, item.advertiser, item.uid, item.vid);
                        this.items.push(item);
                        this.skuArray.push(item.sku);
                        this.variantsArray.push(item.vid);
                        // this.totalWeight = item.weight;
                    } else {
                        if (item.sku !== null && item.name !== null) {
                            item = new CartItem(item.sku, item.name, item.slug, item.mrp, item.price, item.quantity, item.image, item.category, item.size, item.weight, item.status, item.publisher, item.publisheruid, item.advertiser, item.uid, item.vid);
                            this.items.push(item);
                            this.skuArray.push(item.sku);
                            this.variantsArray.push(item.vid);
                            // this.totalWeight = item.weight;
                        }
                    }
                }
            }
        } catch (err) {
            // ignore errors while loading...
        }
    }
};

// save items to local storage
ShoppingCart.prototype.saveItems = function () {
    if (localStorage !== null && JSON !== null) {
        localStorage[this.cartName + '_items'] = JSON.stringify(this.items);
    }
};

// adds an item to the cart
ShoppingCart.prototype.addItem = function (product, quantity) {

    if (this.pflag) {
        quantity = this.toNumber(quantity);
        if (quantity !== 0) {
            // update quantity for existing item
            var found = false;
            for (var i = 0; i < this.items.length && !found; i++) {
                var item = this.items[i];
                if (item.sku === product.sku && item.vid === product.vid) {
                    found = true;
                    item.quantity = this.toNumber(this.toNumber(item.quantity) + quantity);
                    if (item.weight == null) {
                        item.weight = 0;
                    }
                    item.slug = product.slug;
                    if (item.quantity <= 0) {
                        this.items.splice(i, 1);
                        this.skuArray.splice(i, 1);
                        this.variantsArray.splice(i, 1);
                    }
                }
            }

            // new item, add now
            if (!found && product.price) {
                var itm = new CartItem(product.sku, product.name, product.slug, product.mrp, product.price, product.quantity, product.image, product.category, product.size, product.weight, product.status, product.publisher, product.publisheruid, product.advertiser, product.uid, product.vid);
                this.items.push(itm);
                this.skuArray.push(itm.sku);
                this.variantsArray.push(itm.vid);
            }

            // save changes
            this.saveItems();
        }
    } else {
        if (quantity !== 0) {
            // update quantity for existing item
            var found = false;
            for (var i = 0; i < this.items.length && !found; i++) {
                var item = this.items[i];
                if (item.sku === product.sku && item.vid === product.vid) {
                    found = true;
                    item.quantity = this.toNumber(this.toNumber(item.quantity) + quantity);
                    if (item.weight == null) {
                        item.weight = 0;
                    }
                    item.slug = product.slug;
                    if (item.quantity <= 0) {
                        this.items.splice(i, 1);
                        this.skuArray.splice(i, 1);
                        this.variantsArray.splice(i, 1);
                    }
                }
            }

            // new item, add now
            if (!found) {
                var itm = new CartItem(product.sku, product.name, product.slug, product.mrp, product.price, product.quantity, product.image, product.category, product.size, product.weight, product.status, product.publisher, product.publisheruid, product.advertiser, product.uid, product.vid);
                this.items.push(itm);
                this.skuArray.push(itm.sku);
                this.variantsArray.push(itm.vid);
            }

            // save changes
            this.saveItems();
        }
    }
};

// get the total price for all items currently in the cart
ShoppingCart.prototype.getBestShipper = function () {
    var cartValue = this.getTotalPrice();
    var totalWeight = this.getTotalWeight();

    //return 0;
    return this.Shipping.best.query({ country: this.Settings.country.name, weight: totalWeight, cartValue: cartValue });
};

// get handling fee
ShoppingCart.prototype.getHandlingFee = function () {
    var cartValue = this.getTotalPrice();

    return cartValue * 0.05;
};

// get the total price for all items currently in the cart
ShoppingCart.prototype.getTotalWeight = function (sku) {
    var totalWeight = 0;
    for (var i = 0; i < this.items.length; i++) {
        var item = this.items[i];
        if (sku === undefined || item.sku === sku) {
            totalWeight += this.toNumber(item.quantity * item.weight);
        }
    }
    return totalWeight;
};

// get the total price for all items currently in the cart
ShoppingCart.prototype.getTotalPrice = function (sku) {
    var total = 0;
    for (var i = 0; i < this.items.length; i++) {
        var item = this.items[i];
        if (sku === undefined || item.sku === sku) {
            total += this.toNumber(item.quantity * item.price);
        }
    }
    return total;
};

ShoppingCart.prototype.checkCart = function (id, vid) {
    // Returns false when there is item in cart
    if (!_.includes(this.skuArray, id) || !_.includes(this.variantsArray, vid)) {
        return true;
    } else {
        return false;
    }
};
ShoppingCart.prototype.getQuantity = function (sku, vid) {
    // Get quantity based on the combination of product_id and variant_id
    for (var i = 0; i < this.items.length; i++) {
        if (this.items[i].sku === sku && this.items[i].vid === vid) {
            return this.items[i].quantity;
        }
    }
};

// get the total price for all items currently in the cart
ShoppingCart.prototype.getTotalCount = function (sku) {
    var count = 0;
    for (var i = 0; i < this.items.length; i++) {
        var item = this.items[i];
        if (sku === undefined || item.sku === sku) {
            count += this.toNumber(item.quantity);
        }
    }
    return count;
};

// clear the cart
ShoppingCart.prototype.clearItems = function () {
    this.items = [];
    this.skuArray = [];
    this.variantsArray = [];
    this.saveItems();
};

ShoppingCart.prototype.toNumber = function (value) {
    value = value * 1;
    return isNaN(value) ? 0 : value;
};
ShoppingCart.prototype.flagOn = function () {
    this.flag = true;
};
ShoppingCart.prototype.flagOff = function () {
    this.flag = false;
};

// define checkout parameters
ShoppingCart.prototype.addCheckoutParameters = function (serviceName, merchantID, options) {

    // check parameters
    if (serviceName != "PayPal" && serviceName != "PayNow" && serviceName != "Google" && serviceName != "Stripe" && serviceName != "COD") {
        throw "serviceName must be 'PayPal' or 'Google' or 'Stripe' or 'Cash On Delivery'.";
    }
    // if (merchantID == null) {
    //     throw "A merchantID is required in order to checkout.";
    // }

    // save parameters
    this.checkoutParameters[serviceName] = new checkoutParameters(serviceName, merchantID, options);
};

// check out
ShoppingCart.prototype.checkout = function (serviceName, clearCart) {

    serviceName = { name: serviceName.paymentMethod.name, email: serviceName.paymentMethod.email, options: serviceName };

    this.addCheckoutParameters(serviceName.name, serviceName.email, serviceName.options);

    // select serviceName if we have to
    if (serviceName.name == null) {
        var p = this.checkoutParameters[Object.keys(this.checkoutParameters)[0]];
        serviceName = p.serviceName;
    }

    // sanity
    if (serviceName.name == null) {
        throw "Use the 'addCheckoutParameters' method to define at least one checkout service.";
    }

    // go to work
    var parms = this.checkoutParameters[serviceName.name];
    if (parms == null) {
        throw "Cannot get checkout parameters for '" + serviceName.name + "'.";
    }
    switch (parms.serviceName) {
        case "PayPal":
            this.checkoutPayPal(parms, clearCart);
            break;
        case "PayNow":
            this.checkoutPayNow(parms, clearCart);
            break;
        case "Google":
            this.checkoutGoogle(parms, clearCart);
            break;
        case "Stripe":
            this.checkoutStripe(parms, clearCart);
            break;
        case "COD":
            this.checkoutCOD(parms, clearCart);
            break;
        default:
            throw "Unknown checkout service: " + parms.serviceName;
    }
};

ShoppingCart.prototype.checkoutPayPal = function (parms, clearCart) {

    var vm = this;

    for (var i = 0; i < this.items.length; i++) {
        this.items[i].image = null;
    }

    var opt = parms.options;
    var options = { uid: opt.uid, email: opt.email, recipient_name: opt.name, phone: opt.phone, line1: opt.address, city: opt.city, postal_code: opt.zip, country_code: opt.country_code, discount: opt.couponAmount, shipping: 0, currency_code: opt.currency_code, exchange_rate: opt.exchange_rate };
    var data = {
        cmd: "_cart",
        business: 'smkorera@gmail.com',
        upload: "1",
        rm: "2",
        charset: "utf-8",
        data: this.items,
        options: options
    };
    var form = $('<form/></form>');
    form.attr("id", "paypalForm");
    form.attr("action", "/api/pay/prepare");
    form.attr("method", "GET");
    form.attr("style", "display:none;");
    this.addFormFields(form, data);
    $("body").append(form);

    // submit form
    this.clearCart = clearCart == null || clearCart;
    form.submit();
    form.remove();
};

ShoppingCart.prototype.checkoutPayNow = function (parms, clearCart) {

    for (var i = 0; i < this.items.length; i++) {
        this.items[i].image = null;
    }

    var vm = this;
    var opt = parms.options;
    var options = { uid: opt.uid, email: opt.email, recipient_name: opt.name, phone: opt.phone, line1: opt.address, city: opt.city, postal_code: opt.zip, country_code: opt.country_code, discount: opt.couponAmount, shipping: 0, currency_code: opt.currency_code, exchange_rate: opt.exchange_rate };
    var data = {
        business: 'smkorera@gmail.com',
        upload: "1",
        rm: "2",
        charset: "utf-8",
        data: this.items,
        options: options
    };
    var form = $('<form/></form>');
    form.attr("id", "paypalForm");
    form.attr("action", "/api/pay/prepare");
    form.attr("method", "GET");
    form.attr("style", "display:none;");
    this.addFormFields(form, data);
    $("body").append(form);

    // submit form
    this.clearCart = clearCart == null || clearCart;
    form.submit();
    form.remove();
};

// check out using COD
ShoppingCart.prototype.checkoutCOD = function (parms, clearCart) {
    var vm = this;
    var opt = parms.options;
    var data = opt.items;
    var total = Math.round(this.getTotalPrice() + this.getHandlingFee() - opt.couponAmount);
    var subtotal = Math.round(this.getTotalPrice() - opt.couponAmount);

    var items = [];

    if (isNaN(opt.exchange_rate) || opt.exchange_rate === '') // If exchange rate is not a float value, force this to 1
        opt.exchange_rate = 1;
    for (var k = 0; k < data.length; k++) {
        var i = data[k];
        items.push({ sku: i.sku, name: i.name, url: i.image, description: i.slug, publisher: i.publisher, publisheruid: i.publisheruid, price: Math.round(i.price), quantity: i.quantity, currency: opt.currency_code });
    }
    if (opt.discount > 0) items.push({ sku: '#', name: 'Coupon Discount', url: '-', description: '-', price: -Math.round(opt.discount), quantity: 1, currency: opt.currency_code });

    var orderDetails = {
        uid: opt.uid,
        email: opt.email,
        phone: opt.phone,
        address: { country_code: opt.country_code, postal_code: opt.zip, state: opt.state, city: opt.city, line1: opt.address, recipient_name: opt.name },
        payment: { state: opt.payment },
        amount: { total: total, currency: opt.currency_code, details: { shipping: Math.round(this.getHandlingFee()), subtotal: subtotal } },
        exchange_rate: opt.exchange_rate,
        items: items,
        status: 'Payment Pending',
        payment_method: 'COD'
    };

    // When order.status is null, the client will replace with the Array[0] of order status at Settings page
    this.Order.save(orderDetails, function (data, err) {
        if (clearCart) vm.clearItems();
        vm.$state.go('order');
    });
};

// check out using Google Wallet
// for details see:
// developers.google.com/checkout/developer/Google_Checkout_Custom_Cart_How_To_HTML
// developers.google.com/checkout/developer/interactive_demo
ShoppingCart.prototype.checkoutGoogle = function (parms, clearCart) {

    // global data
    var data = {};

    // item data
    for (var i = 0; i < this.items.length; i++) {
        var item = this.items[i];
        var ctr = i + 1;
        data["item_name_" + ctr] = item.sku;
        data["item_description_" + ctr] = item.name;
        data["item_price_" + ctr] = item.price.toFixed(2);
        data["item_quantity_" + ctr] = item.quantity;
        data["item_merchant_id_" + ctr] = parms.merchantID;
    }

    // build form
    var form = $('<form/></form>');
    // NOTE: in production projects, use the checkout.google url below;
    // for debugging/testing, use the sandbox.google url instead.
    //form.attr("action", "https://checkout.google.com/api/checkout/v2/merchantCheckoutForm/Merchant/" + parms.merchantID);
    form.attr("action", "https://sandbox.google.com/checkout/api/checkout/v2/checkoutForm/Merchant/" + parms.merchantID);
    form.attr("method", "POST");
    form.attr("style", "display:none;");
    this.addFormFields(form, data);
    if (!parms.options) {
        parms.options = {};
    }
    this.addFormFields(form, parms.options);
    $("body").append(form);

    // submit form
    this.clearCart = clearCart == null || clearCart;
    form.submit();
    form.remove();
};

// check out using Stripe
// for details see:
// https://stripe.com/docs/checkout
ShoppingCart.prototype.checkoutStripe = function (parms, clearCart) {
    var vm = this;
    var opt = parms.options;
    var data = opt.items;
    var total = Math.round((this.getTotalPrice() + opt.shipping.charge - opt.couponAmount) * opt.exchange_rate * 100) / 100;
    var subtotal = Math.round((this.getTotalPrice() - opt.couponAmount) * opt.exchange_rate * 100) / 100;
    parms.options.total = total;

    var items = [];

    if (isNaN(opt.exchange_rate) || opt.exchange_rate === '') // If exchange rate is not a float value, force this to 1
        opt.exchange_rate = 1;
    for (var k = 0; k < data.length; k++) {
        var i = data[k];
        items.push({ sku: i.sku, name: i.name, url: i.image, description: i.slug, price: Math.round(i.price * opt.exchange_rate * 100) / 100, quantity: i.quantity, currency: opt.currency_code });
    }
    if (opt.discount > 0) items.push({ sku: '#', name: 'Coupon Discount', url: '-', description: '-', price: -Math.round(opt.discount * opt.exchange_rate * 100) / 100, quantity: 1, currency: opt.currency_code });

    parms.options.items = items;
    this.Pay.stripe.save(parms.options, function (res) {
        if (clearCart) vm.clearItems();
        vm.$state.go('order', { id: res.id, msg: 'Stripe payment successful' });
    }, function (err) {
        vm.$state.go('checkout', { id: err.data.id, msg: err.data.message });
    });
};

// utility methods
ShoppingCart.prototype.addFormFields = function (form, data) {
    if (data !== null) {
        $.each(data, function (name, value) {
            if (value !== null) {
                var input = $('<input></input>').attr('type', 'hidden').attr('name', name).val(JSON.stringify(value));
                form.append(input);
            }
        });
    }
};

angular.module('mediaboxApp').factory('Cart', function (Settings, Shipping, Order, Mail, Pay, appConfig, $state) {
    var myCart = new ShoppingCart('mShop', Settings, Shipping, Order, Mail, Pay, appConfig, $state);
    return { cart: myCart };
});
//# sourceMappingURL=cart.service.js.map

'use strict';

angular.module('mediaboxApp').factory('Product', ['$resource', function ($resource) {
  var obj = {};
  obj = $resource('/api/products/:id', null, { 'update': { method: 'PUT' } });
  obj.count = $resource('/api/products/count');
  obj.pr = $resource('/api/products/priceRange');
  return obj;
}]).factory('Shipping', ['$resource', function ($resource) {
  var obj = {};
  obj = $resource('/api/shippings/:id', null, { 'update': { method: 'PUT' } });
  obj.best = $resource('/api/shippings/best', null, { 'update': { method: 'PUT' } });
  return obj;
}]).factory('Category', ['$resource', function ($resource) {
  var obj = {};
  obj = $resource('/api/categories/:id', null, {
    'update': { method: 'PUT' },
    'query': { method: 'GET', isArray: true } });
  obj.loaded = $resource('/api/categories/loaded');
  obj.tree = $resource('/api/categories/tree');
  return obj;
}]).factory('Cat', ['$resource', function ($resource) {
  var obj = {};
  obj = $resource('/api/cats/:id', null, { 'update': { method: 'PUT' } });
  obj.headings = $resource('/api/cats/headings');
  return obj;
}]).factory('Country', ['$resource', function ($resource) {
  var obj = {};
  obj = $resource('/api/countries/:id', null, { 'update': { method: 'PUT' } });
  obj.active = $resource('/api/countries/active', null, { 'update': { method: 'PUT' } });
  return obj;
}]).factory('Brand', ['$resource', '$rootScope', function ($resource, $rootScope) {
  var obj = {};

  var pageFlag = $rootScope.page;

  if (pageFlag == "OnlineStore") {} else if (pageFlag == "magazines") {

    return $resource('/api/brandmgs/:id', null, { 'update': { method: 'PUT' } });
  } else if (pageFlag == "Ticketing") {

    return $resource('/api/brands/:id', null, { 'update': { method: 'PUT' } });
  } else if (pageFlag == "television") {

    return $resource('/api/brandtvs/:id', null, { 'update': { method: 'PUT' } });
  } else {

    return $resource('/api/brands/:id', null, { 'update': { method: 'PUT' } });
  }
}]).factory('BrandMG', ['$resource', function ($resource) {
  return $resource('/api/brandmgs/:id', null, { 'update': { method: 'PUT' } });
}]).factory('BrandTV', ['$resource', function ($resource) {
  return $resource('/api/brandtvs/:id', null, { 'update': { method: 'PUT' } });
}]).factory('Coupon', ['$resource', function ($resource) {
  return $resource('/api/coupons/:id', null, { 'update': { method: 'PUT' } });
}]).factory('Address', ['$resource', function ($resource) {
  var obj = {};
  obj = $resource('/api/address/:id', null, { 'update': { method: 'PUT' } });
  obj.my = $resource('/api/address/my', null);
  return obj;
}]).factory('Feature', ['$resource', function ($resource) {
  var obj = {};
  obj = $resource('/api/features/:id', null, { 'update': { method: 'PUT' } });
  obj.group = $resource('/api/features/group', null, { 'update': { method: 'PUT' } });
  return obj;
}]).factory('KeyFeature', ['$resource', function ($resource) {
  var obj = {};
  obj = $resource('/api/keyfeatures/:id', null, { 'update': { method: 'PUT' } });
  obj.group = $resource('/api/keyfeatures/group', null, { 'update': { method: 'PUT' } });
  return obj;
}]).factory('Media', ['$resource', function ($resource) {
  var obj = {};
  obj = $resource('/api/media/:id', null, { 'update': { method: 'PUT' } });
  obj.my = $resource('/api/media/my/:id', null, { 'update': { method: 'PUT' } });
  obj.pub = $resource('/api/media/pub/:id', null, { 'update': { method: 'PUT' } });
  return obj;
}]).factory('Statistic', ['$resource', function ($resource) {
  var obj = {};
  obj = $resource('/api/statistics/:id', null, { 'update': { method: 'PUT' } });
  obj.group = $resource('/api/statistics/group', null, { 'update': { method: 'PUT' } });
  return obj;
}]).factory('PaymentMethod', ['$resource', function ($resource) {
  var obj = {};
  obj = $resource('/api/PaymentMethods/:id', null, { 'update': { method: 'PUT' } });
  obj.active = $resource('/api/PaymentMethods/active', null, { 'update': { method: 'PUT' } });
  return obj;
}]).factory('Order', ['$resource', function ($resource) {
  var obj = {};
  obj = $resource('/api/orders/:id', null, { 'update': { method: 'PUT' } });
  obj.my = $resource('/api/orders/my', null, { 'update': { method: 'PUT' } });
  obj.pub = $resource('/api/orders/pub', null, { 'update': { method: 'PUT' } });
  return obj;
}]).factory('Campaign', ['$resource', function ($resource) {
  var obj = {};
  obj = $resource('/api/campaigns/:id', null, { 'update': { method: 'PUT' } });
  obj.my = $resource('/api/campaigns/my', null, { 'update': { method: 'PUT' } });
  obj.pub = $resource('/api/campaigns/pub', null, { 'update': { method: 'PUT' } });
  return obj;
}]).factory('Pay', ['$resource', function ($resource) {
  var obj = {};
  obj = $resource('/api/pay/:id', null, { 'update': { method: 'PUT' } });
  obj.prepare = $resource('/api/pay/prepare');
  obj.stripe = $resource('/api/pay/stripe');
  obj.paynow = $resource('/api/pay/paynow');
  return obj;
}]).factory('Review', ['$resource', function ($resource) {
  var obj = {};
  obj = $resource('/api/reviews/:id', null, { 'update': { method: 'PUT' } });
  obj.my = $resource('/api/reviews/my');
  return obj;
}]).factory('Wishlist', ['$resource', function ($resource) {
  var obj = {};
  obj = $resource('/api/wishlists/:id', null, { 'update': { method: 'PUT' } });
  obj.my = $resource('/api/wishlists/my');
  return obj;
}]).factory('Mail', ['$resource', function ($resource) {
  return $resource('/api/sendmail/:id');
}]);
//# sourceMappingURL=factory.service.js.map

'use strict';

angular.module('mediaboxApp').filter('localPrice', function (Settings, $filter) {
  return function (input, key) {
    var input = Math.round(input / Settings.currency.exchange_rate * 100) / 100;
    if (!input) {
      return 0;
    }
    if (parseFloat(input) != 0) {
      return $filter('currency')(input, Settings.currency.symbol);
    }
    return $filter('currency')(input);
  };
}).filter('pluralize', function () {
  return function (noun, key) {
    var plural = noun;
    if (noun.substr(noun.length - 2) == 'us') {
      plural = plural.substr(0, plural.length - 2) + 'i';
    } else if (noun.substr(noun.length - 2) == 'ch' || noun.charAt(noun.length - 1) == 'x' || noun.charAt(noun.length - 1) == 's') {
      plural += 'es';
    } else if (noun.charAt(noun.length - 1) == 'y' && ['a', 'e', 'i', 'o', 'u'].indexOf(noun.charAt(noun.length - 2)) == -1) {
      plural = plural.substr(0, plural.length - 1) + 'ies';
    } else if (noun.substr(noun.length - 2) == 'is') {
      plural = plural.substr(0, plural.length - 2) + 'es';
    } else {
      plural += 's';
    }
    return plural;
  };
}).filter('unique', function () {
  return function (input, key) {
    var unique = {};
    var uniqueList = [];
    for (var i = 0; i < input.length; i++) {
      if (typeof unique[input[i][key]] === 'undefined') {
        unique[input[i][key]] = '';
        uniqueList.push(input[i]);
      }
    }
    return uniqueList;
  };
}).filter('labelCase', [function () {
  return function (input) {
    if (!input) {
      return input;
    } else {
      input = input.replace(/([A-Z])/g, ' $1');
      return input[0].toUpperCase() + input.slice(1);
    }
  };
}]).filter('camelCase', [function () {
  return function (input) {
    if (!input) {
      return input;
    } else {
      return input.toLowerCase().replace(/ (\w)/g, function (match, letter) {
        return letter.toUpperCase();
      });
    }
  };
}]).filter('reverse', [function () {
  return function (items) {
    if (items) {
      return items.slice().reverse();
    } else {
      return items;
    }
  };
}]);
//# sourceMappingURL=filters.filter.js.map

'use strict';

angular.module('mediaboxApp').directive('footer', function ($mdDialog, $http, $mdMedia) {
    return {
        templateUrl: 'components/footer/footer.html',
        restrict: 'E',
        link: function link(scope, element) {
            element.addClass('footer');
            scope.addDialog = function () {
                $mdDialog.show({
                    templateUrl: 'components/footer/contact-form.html',
                    controller: function controller($scope, $mdDialog, Toast) {
                        $scope.hide = function () {
                            $mdDialog.hide();
                        };
                        $scope.cancel = function () {
                            $mdDialog.cancel();
                        };
                        $scope.send = function (mail) {
                            $http.post('/api/sendmail', {
                                from: 'Mediabox admin@mediabox.co.zw>',
                                to: 'support@mediabox.co.zw',
                                subject: 'Message from Mediabox',
                                text: mail.message
                            });
                            $mdDialog.hide(mail);
                            Toast.show({ type: 'success', text: 'Thanks for contacting us.' });
                        };
                    }
                }).then(function (answer) {
                    scope.alert = 'You said the information was "' + answer + '".';
                }, function () {
                    scope.alert = 'You cancelled the dialog.';
                });
            };
            scope.screenIsBig = $mdMedia('gt-sm'); // Erase the parent reference from md-toast the (md-toast bug)
        }
    };
});
//# sourceMappingURL=footer.directive.js.map

"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*!

JSZip - A Javascript class for generating and reading zip files
<http://stuartk.com/jszip>

(c) 2009-2014 Stuart Knightley <stuart [at] stuartk.com>
Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/master/LICENSE.markdown.

JSZip uses the library pako released under the MIT license :
https://github.com/nodeca/pako/blob/master/LICENSE
*/
!function (a) {
  if ("object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) && "undefined" != typeof module) module.exports = a();else if ("function" == typeof define && define.amd) define([], a);else {
    var b;b = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this, b.JSZip = a();
  }
}(function () {
  return function a(b, c, d) {
    function e(g, h) {
      if (!c[g]) {
        if (!b[g]) {
          var i = "function" == typeof require && require;if (!h && i) return i(g, !0);if (f) return f(g, !0);var j = new Error("Cannot find module '" + g + "'");throw j.code = "MODULE_NOT_FOUND", j;
        }var k = c[g] = { exports: {} };b[g][0].call(k.exports, function (a) {
          var c = b[g][1][a];return e(c ? c : a);
        }, k, k.exports, a, b, c, d);
      }return c[g].exports;
    }for (var f = "function" == typeof require && require, g = 0; g < d.length; g++) {
      e(d[g]);
    }return e;
  }({ 1: [function (a, b, c) {
      "use strict";
      function d(a) {
        if (a) {
          this.data = a, this.length = this.data.length, this.index = 0, this.zero = 0;for (var b = 0; b < this.data.length; b++) {
            a[b] = 255 & a[b];
          }
        }
      }var e = a("./dataReader");d.prototype = new e(), d.prototype.byteAt = function (a) {
        return this.data[this.zero + a];
      }, d.prototype.lastIndexOfSignature = function (a) {
        for (var b = a.charCodeAt(0), c = a.charCodeAt(1), d = a.charCodeAt(2), e = a.charCodeAt(3), f = this.length - 4; f >= 0; --f) {
          if (this.data[f] === b && this.data[f + 1] === c && this.data[f + 2] === d && this.data[f + 3] === e) return f - this.zero;
        }return -1;
      }, d.prototype.readData = function (a) {
        if (this.checkOffset(a), 0 === a) return [];var b = this.data.slice(this.zero + this.index, this.zero + this.index + a);return this.index += a, b;
      }, b.exports = d;
    }, { "./dataReader": 6 }], 2: [function (a, b, c) {
      "use strict";
      var d = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";c.encode = function (a, b) {
        for (var c, e, f, g, h, i, j, k = "", l = 0; l < a.length;) {
          c = a.charCodeAt(l++), e = a.charCodeAt(l++), f = a.charCodeAt(l++), g = c >> 2, h = (3 & c) << 4 | e >> 4, i = (15 & e) << 2 | f >> 6, j = 63 & f, isNaN(e) ? i = j = 64 : isNaN(f) && (j = 64), k = k + d.charAt(g) + d.charAt(h) + d.charAt(i) + d.charAt(j);
        }return k;
      }, c.decode = function (a, b) {
        var c,
            e,
            f,
            g,
            h,
            i,
            j,
            k = "",
            l = 0;for (a = a.replace(/[^A-Za-z0-9\+\/\=]/g, ""); l < a.length;) {
          g = d.indexOf(a.charAt(l++)), h = d.indexOf(a.charAt(l++)), i = d.indexOf(a.charAt(l++)), j = d.indexOf(a.charAt(l++)), c = g << 2 | h >> 4, e = (15 & h) << 4 | i >> 2, f = (3 & i) << 6 | j, k += String.fromCharCode(c), 64 != i && (k += String.fromCharCode(e)), 64 != j && (k += String.fromCharCode(f));
        }return k;
      };
    }, {}], 3: [function (a, b, c) {
      "use strict";
      function d() {
        this.compressedSize = 0, this.uncompressedSize = 0, this.crc32 = 0, this.compressionMethod = null, this.compressedContent = null;
      }d.prototype = { getContent: function getContent() {
          return null;
        }, getCompressedContent: function getCompressedContent() {
          return null;
        } }, b.exports = d;
    }, {}], 4: [function (a, b, c) {
      "use strict";
      c.STORE = { magic: "\x00\x00", compress: function compress(a, b) {
          return a;
        }, uncompress: function uncompress(a) {
          return a;
        }, compressInputType: null, uncompressInputType: null }, c.DEFLATE = a("./flate");
    }, { "./flate": 9 }], 5: [function (a, b, c) {
      "use strict";
      var d = a("./utils"),
          e = [0, 1996959894, 3993919788, 2567524794, 124634137, 1886057615, 3915621685, 2657392035, 249268274, 2044508324, 3772115230, 2547177864, 162941995, 2125561021, 3887607047, 2428444049, 498536548, 1789927666, 4089016648, 2227061214, 450548861, 1843258603, 4107580753, 2211677639, 325883990, 1684777152, 4251122042, 2321926636, 335633487, 1661365465, 4195302755, 2366115317, 997073096, 1281953886, 3579855332, 2724688242, 1006888145, 1258607687, 3524101629, 2768942443, 901097722, 1119000684, 3686517206, 2898065728, 853044451, 1172266101, 3705015759, 2882616665, 651767980, 1373503546, 3369554304, 3218104598, 565507253, 1454621731, 3485111705, 3099436303, 671266974, 1594198024, 3322730930, 2970347812, 795835527, 1483230225, 3244367275, 3060149565, 1994146192, 31158534, 2563907772, 4023717930, 1907459465, 112637215, 2680153253, 3904427059, 2013776290, 251722036, 2517215374, 3775830040, 2137656763, 141376813, 2439277719, 3865271297, 1802195444, 476864866, 2238001368, 4066508878, 1812370925, 453092731, 2181625025, 4111451223, 1706088902, 314042704, 2344532202, 4240017532, 1658658271, 366619977, 2362670323, 4224994405, 1303535960, 984961486, 2747007092, 3569037538, 1256170817, 1037604311, 2765210733, 3554079995, 1131014506, 879679996, 2909243462, 3663771856, 1141124467, 855842277, 2852801631, 3708648649, 1342533948, 654459306, 3188396048, 3373015174, 1466479909, 544179635, 3110523913, 3462522015, 1591671054, 702138776, 2966460450, 3352799412, 1504918807, 783551873, 3082640443, 3233442989, 3988292384, 2596254646, 62317068, 1957810842, 3939845945, 2647816111, 81470997, 1943803523, 3814918930, 2489596804, 225274430, 2053790376, 3826175755, 2466906013, 167816743, 2097651377, 4027552580, 2265490386, 503444072, 1762050814, 4150417245, 2154129355, 426522225, 1852507879, 4275313526, 2312317920, 282753626, 1742555852, 4189708143, 2394877945, 397917763, 1622183637, 3604390888, 2714866558, 953729732, 1340076626, 3518719985, 2797360999, 1068828381, 1219638859, 3624741850, 2936675148, 906185462, 1090812512, 3747672003, 2825379669, 829329135, 1181335161, 3412177804, 3160834842, 628085408, 1382605366, 3423369109, 3138078467, 570562233, 1426400815, 3317316542, 2998733608, 733239954, 1555261956, 3268935591, 3050360625, 752459403, 1541320221, 2607071920, 3965973030, 1969922972, 40735498, 2617837225, 3943577151, 1913087877, 83908371, 2512341634, 3803740692, 2075208622, 213261112, 2463272603, 3855990285, 2094854071, 198958881, 2262029012, 4057260610, 1759359992, 534414190, 2176718541, 4139329115, 1873836001, 414664567, 2282248934, 4279200368, 1711684554, 285281116, 2405801727, 4167216745, 1634467795, 376229701, 2685067896, 3608007406, 1308918612, 956543938, 2808555105, 3495958263, 1231636301, 1047427035, 2932959818, 3654703836, 1088359270, 936918e3, 2847714899, 3736837829, 1202900863, 817233897, 3183342108, 3401237130, 1404277552, 615818150, 3134207493, 3453421203, 1423857449, 601450431, 3009837614, 3294710456, 1567103746, 711928724, 3020668471, 3272380065, 1510334235, 755167117];b.exports = function (a, b) {
        if ("undefined" == typeof a || !a.length) return 0;var c = "string" !== d.getTypeOf(a);"undefined" == typeof b && (b = 0);var f = 0,
            g = 0,
            h = 0;b = -1 ^ b;for (var i = 0, j = a.length; j > i; i++) {
          h = c ? a[i] : a.charCodeAt(i), g = 255 & (b ^ h), f = e[g], b = b >>> 8 ^ f;
        }return -1 ^ b;
      };
    }, { "./utils": 22 }], 6: [function (a, b, c) {
      "use strict";
      function d(a) {
        this.data = null, this.length = 0, this.index = 0, this.zero = 0;
      }var e = a("./utils");d.prototype = { checkOffset: function checkOffset(a) {
          this.checkIndex(this.index + a);
        }, checkIndex: function checkIndex(a) {
          if (this.length < this.zero + a || 0 > a) throw new Error("End of data reached (data length = " + this.length + ", asked index = " + a + "). Corrupted zip ?");
        }, setIndex: function setIndex(a) {
          this.checkIndex(a), this.index = a;
        }, skip: function skip(a) {
          this.setIndex(this.index + a);
        }, byteAt: function byteAt(a) {}, readInt: function readInt(a) {
          var b,
              c = 0;for (this.checkOffset(a), b = this.index + a - 1; b >= this.index; b--) {
            c = (c << 8) + this.byteAt(b);
          }return this.index += a, c;
        }, readString: function readString(a) {
          return e.transformTo("string", this.readData(a));
        }, readData: function readData(a) {}, lastIndexOfSignature: function lastIndexOfSignature(a) {}, readDate: function readDate() {
          var a = this.readInt(4);return new Date((a >> 25 & 127) + 1980, (a >> 21 & 15) - 1, a >> 16 & 31, a >> 11 & 31, a >> 5 & 63, (31 & a) << 1);
        } }, b.exports = d;
    }, { "./utils": 22 }], 7: [function (a, b, c) {
      "use strict";
      c.base64 = !1, c.binary = !1, c.dir = !1, c.createFolders = !1, c.date = null, c.compression = null, c.compressionOptions = null, c.comment = null, c.unixPermissions = null, c.dosPermissions = null;
    }, {}], 8: [function (a, b, c) {
      "use strict";
      var d = a("./utils");c.string2binary = function (a) {
        return d.string2binary(a);
      }, c.string2Uint8Array = function (a) {
        return d.transformTo("uint8array", a);
      }, c.uint8Array2String = function (a) {
        return d.transformTo("string", a);
      }, c.string2Blob = function (a) {
        var b = d.transformTo("arraybuffer", a);return d.arrayBuffer2Blob(b);
      }, c.arrayBuffer2Blob = function (a) {
        return d.arrayBuffer2Blob(a);
      }, c.transformTo = function (a, b) {
        return d.transformTo(a, b);
      }, c.getTypeOf = function (a) {
        return d.getTypeOf(a);
      }, c.checkSupport = function (a) {
        return d.checkSupport(a);
      }, c.MAX_VALUE_16BITS = d.MAX_VALUE_16BITS, c.MAX_VALUE_32BITS = d.MAX_VALUE_32BITS, c.pretty = function (a) {
        return d.pretty(a);
      }, c.findCompression = function (a) {
        return d.findCompression(a);
      }, c.isRegExp = function (a) {
        return d.isRegExp(a);
      };
    }, { "./utils": 22 }], 9: [function (a, b, c) {
      "use strict";
      var d = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Uint32Array,
          e = a("pako");c.uncompressInputType = d ? "uint8array" : "array", c.compressInputType = d ? "uint8array" : "array", c.magic = "\b\x00", c.compress = function (a, b) {
        return e.deflateRaw(a, { level: b.level || -1 });
      }, c.uncompress = function (a) {
        return e.inflateRaw(a);
      };
    }, { pako: 25 }], 10: [function (a, b, c) {
      "use strict";
      function d(a, b) {
        return this instanceof d ? (this.files = {}, this.comment = null, this.root = "", a && this.load(a, b), void (this.clone = function () {
          var a = new d();for (var b in this) {
            "function" != typeof this[b] && (a[b] = this[b]);
          }return a;
        })) : new d(a, b);
      }var e = a("./base64");d.prototype = a("./object"), d.prototype.load = a("./load"), d.support = a("./support"), d.defaults = a("./defaults"), d.utils = a("./deprecatedPublicUtils"), d.base64 = { encode: function encode(a) {
          return e.encode(a);
        }, decode: function decode(a) {
          return e.decode(a);
        } }, d.compressions = a("./compressions"), b.exports = d;
    }, { "./base64": 2, "./compressions": 4, "./defaults": 7, "./deprecatedPublicUtils": 8, "./load": 11, "./object": 14, "./support": 18 }], 11: [function (a, b, c) {
      "use strict";
      var d = a("./base64"),
          e = a("./utf8"),
          f = a("./utils"),
          g = a("./zipEntries");b.exports = function (a, b) {
        var c, h, i, j;for (b = f.extend(b || {}, { base64: !1, checkCRC32: !1, optimizedBinaryString: !1, createFolders: !1, decodeFileName: e.utf8decode }), b.base64 && (a = d.decode(a)), h = new g(a, b), c = h.files, i = 0; i < c.length; i++) {
          j = c[i], this.file(j.fileNameStr, j.decompressed, { binary: !0, optimizedBinaryString: !0, date: j.date, dir: j.dir, comment: j.fileCommentStr.length ? j.fileCommentStr : null, unixPermissions: j.unixPermissions, dosPermissions: j.dosPermissions, createFolders: b.createFolders });
        }return h.zipComment.length && (this.comment = h.zipComment), this;
      };
    }, { "./base64": 2, "./utf8": 21, "./utils": 22, "./zipEntries": 23 }], 12: [function (a, b, c) {
      (function (a) {
        "use strict";
        b.exports = function (b, c) {
          return new a(b, c);
        }, b.exports.test = function (b) {
          return a.isBuffer(b);
        };
      }).call(this, "undefined" != typeof Buffer ? Buffer : void 0);
    }, {}], 13: [function (a, b, c) {
      "use strict";
      function d(a) {
        this.data = a, this.length = this.data.length, this.index = 0, this.zero = 0;
      }var e = a("./uint8ArrayReader");d.prototype = new e(), d.prototype.readData = function (a) {
        this.checkOffset(a);var b = this.data.slice(this.zero + this.index, this.zero + this.index + a);return this.index += a, b;
      }, b.exports = d;
    }, { "./uint8ArrayReader": 19 }], 14: [function (a, b, c) {
      "use strict";
      var d = a("./support"),
          e = a("./utils"),
          f = a("./crc32"),
          g = a("./signature"),
          h = a("./defaults"),
          i = a("./base64"),
          j = a("./compressions"),
          k = a("./compressedObject"),
          l = a("./nodeBuffer"),
          m = a("./utf8"),
          n = a("./stringWriter"),
          o = a("./uint8ArrayWriter"),
          p = function p(a) {
        if (a._data instanceof k && (a._data = a._data.getContent(), a.options.binary = !0, a.options.base64 = !1, "uint8array" === e.getTypeOf(a._data))) {
          var b = a._data;a._data = new Uint8Array(b.length), 0 !== b.length && a._data.set(b, 0);
        }return a._data;
      },
          q = function q(a) {
        var b = p(a),
            c = e.getTypeOf(b);return "string" === c ? !a.options.binary && d.nodebuffer ? l(b, "utf-8") : a.asBinary() : b;
      },
          r = function r(a) {
        var b = p(this);return null === b || "undefined" == typeof b ? "" : (this.options.base64 && (b = i.decode(b)), b = a && this.options.binary ? D.utf8decode(b) : e.transformTo("string", b), a || this.options.binary || (b = e.transformTo("string", D.utf8encode(b))), b);
      },
          s = function s(a, b, c) {
        this.name = a, this.dir = c.dir, this.date = c.date, this.comment = c.comment, this.unixPermissions = c.unixPermissions, this.dosPermissions = c.dosPermissions, this._data = b, this.options = c, this._initialMetadata = { dir: c.dir, date: c.date };
      };s.prototype = { asText: function asText() {
          return r.call(this, !0);
        }, asBinary: function asBinary() {
          return r.call(this, !1);
        }, asNodeBuffer: function asNodeBuffer() {
          var a = q(this);return e.transformTo("nodebuffer", a);
        }, asUint8Array: function asUint8Array() {
          var a = q(this);return e.transformTo("uint8array", a);
        }, asArrayBuffer: function asArrayBuffer() {
          return this.asUint8Array().buffer;
        } };var t = function t(a, b) {
        var c,
            d = "";for (c = 0; b > c; c++) {
          d += String.fromCharCode(255 & a), a >>>= 8;
        }return d;
      },
          u = function u(a) {
        return a = a || {}, a.base64 !== !0 || null !== a.binary && void 0 !== a.binary || (a.binary = !0), a = e.extend(a, h), a.date = a.date || new Date(), null !== a.compression && (a.compression = a.compression.toUpperCase()), a;
      },
          v = function v(a, b, c) {
        var d,
            f = e.getTypeOf(b);if (c = u(c), "string" == typeof c.unixPermissions && (c.unixPermissions = parseInt(c.unixPermissions, 8)), c.unixPermissions && 16384 & c.unixPermissions && (c.dir = !0), c.dosPermissions && 16 & c.dosPermissions && (c.dir = !0), c.dir && (a = x(a)), c.createFolders && (d = w(a)) && y.call(this, d, !0), c.dir || null === b || "undefined" == typeof b) c.base64 = !1, c.binary = !1, b = null, f = null;else if ("string" === f) c.binary && !c.base64 && c.optimizedBinaryString !== !0 && (b = e.string2binary(b));else {
          if (c.base64 = !1, c.binary = !0, !(f || b instanceof k)) throw new Error("The data of '" + a + "' is in an unsupported format !");"arraybuffer" === f && (b = e.transformTo("uint8array", b));
        }var g = new s(a, b, c);return this.files[a] = g, g;
      },
          w = function w(a) {
        "/" == a.slice(-1) && (a = a.substring(0, a.length - 1));var b = a.lastIndexOf("/");return b > 0 ? a.substring(0, b) : "";
      },
          x = function x(a) {
        return "/" != a.slice(-1) && (a += "/"), a;
      },
          y = function y(a, b) {
        return b = "undefined" != typeof b ? b : !1, a = x(a), this.files[a] || v.call(this, a, null, { dir: !0, createFolders: b }), this.files[a];
      },
          z = function z(a, b, c) {
        var d,
            g = new k();return a._data instanceof k ? (g.uncompressedSize = a._data.uncompressedSize, g.crc32 = a._data.crc32, 0 === g.uncompressedSize || a.dir ? (b = j.STORE, g.compressedContent = "", g.crc32 = 0) : a._data.compressionMethod === b.magic ? g.compressedContent = a._data.getCompressedContent() : (d = a._data.getContent(), g.compressedContent = b.compress(e.transformTo(b.compressInputType, d), c))) : (d = q(a), d && 0 !== d.length && !a.dir || (b = j.STORE, d = ""), g.uncompressedSize = d.length, g.crc32 = f(d), g.compressedContent = b.compress(e.transformTo(b.compressInputType, d), c)), g.compressedSize = g.compressedContent.length, g.compressionMethod = b.magic, g;
      },
          A = function A(a, b) {
        var c = a;return a || (c = b ? 16893 : 33204), (65535 & c) << 16;
      },
          B = function B(a, b) {
        return 63 & (a || 0);
      },
          C = function C(a, b, c, d, h, i) {
        var j,
            k,
            l,
            n,
            o = (c.compressedContent, i !== m.utf8encode),
            p = e.transformTo("string", i(b.name)),
            q = e.transformTo("string", m.utf8encode(b.name)),
            r = b.comment || "",
            s = e.transformTo("string", i(r)),
            u = e.transformTo("string", m.utf8encode(r)),
            v = q.length !== b.name.length,
            w = u.length !== r.length,
            x = b.options,
            y = "",
            z = "",
            C = "";l = b._initialMetadata.dir !== b.dir ? b.dir : x.dir, n = b._initialMetadata.date !== b.date ? b.date : x.date;var D = 0,
            E = 0;l && (D |= 16), "UNIX" === h ? (E = 798, D |= A(b.unixPermissions, l)) : (E = 20, D |= B(b.dosPermissions, l)), j = n.getHours(), j <<= 6, j |= n.getMinutes(), j <<= 5, j |= n.getSeconds() / 2, k = n.getFullYear() - 1980, k <<= 4, k |= n.getMonth() + 1, k <<= 5, k |= n.getDate(), v && (z = t(1, 1) + t(f(p), 4) + q, y += "up" + t(z.length, 2) + z), w && (C = t(1, 1) + t(this.crc32(s), 4) + u, y += "uc" + t(C.length, 2) + C);var F = "";F += "\n\x00", F += o || !v && !w ? "\x00\x00" : "\x00\b", F += c.compressionMethod, F += t(j, 2), F += t(k, 2), F += t(c.crc32, 4), F += t(c.compressedSize, 4), F += t(c.uncompressedSize, 4), F += t(p.length, 2), F += t(y.length, 2);var G = g.LOCAL_FILE_HEADER + F + p + y,
            H = g.CENTRAL_FILE_HEADER + t(E, 2) + F + t(s.length, 2) + "\x00\x00\x00\x00" + t(D, 4) + t(d, 4) + p + y + s;return { fileRecord: G, dirRecord: H, compressedObject: c };
      },
          D = { load: function load(a, b) {
          throw new Error("Load method is not defined. Is the file jszip-load.js included ?");
        }, filter: function filter(a) {
          var b,
              c,
              d,
              f,
              g = [];for (b in this.files) {
            this.files.hasOwnProperty(b) && (d = this.files[b], f = new s(d.name, d._data, e.extend(d.options)), c = b.slice(this.root.length, b.length), b.slice(0, this.root.length) === this.root && a(c, f) && g.push(f));
          }return g;
        }, file: function file(a, b, c) {
          if (1 === arguments.length) {
            if (e.isRegExp(a)) {
              var d = a;return this.filter(function (a, b) {
                return !b.dir && d.test(a);
              });
            }return this.filter(function (b, c) {
              return !c.dir && b === a;
            })[0] || null;
          }return a = this.root + a, v.call(this, a, b, c), this;
        }, folder: function folder(a) {
          if (!a) return this;if (e.isRegExp(a)) return this.filter(function (b, c) {
            return c.dir && a.test(b);
          });var b = this.root + a,
              c = y.call(this, b),
              d = this.clone();return d.root = c.name, d;
        }, remove: function remove(a) {
          a = this.root + a;var b = this.files[a];if (b || ("/" != a.slice(-1) && (a += "/"), b = this.files[a]), b && !b.dir) delete this.files[a];else for (var c = this.filter(function (b, c) {
            return c.name.slice(0, a.length) === a;
          }), d = 0; d < c.length; d++) {
            delete this.files[c[d].name];
          }return this;
        }, generate: function generate(a) {
          a = e.extend(a || {}, { base64: !0, compression: "STORE", compressionOptions: null, type: "base64", platform: "DOS", comment: null, mimeType: "application/zip", encodeFileName: m.utf8encode }), e.checkSupport(a.type), "darwin" !== a.platform && "freebsd" !== a.platform && "linux" !== a.platform && "sunos" !== a.platform || (a.platform = "UNIX"), "win32" === a.platform && (a.platform = "DOS");var b,
              c,
              d = [],
              f = 0,
              h = 0,
              k = e.transformTo("string", a.encodeFileName(a.comment || this.comment || ""));for (var l in this.files) {
            if (this.files.hasOwnProperty(l)) {
              var p = this.files[l],
                  q = p.options.compression || a.compression.toUpperCase(),
                  r = j[q];if (!r) throw new Error(q + " is not a valid compression method !");var s = p.options.compressionOptions || a.compressionOptions || {},
                  u = z.call(this, p, r, s),
                  v = C.call(this, l, p, u, f, a.platform, a.encodeFileName);f += v.fileRecord.length + u.compressedSize, h += v.dirRecord.length, d.push(v);
            }
          }var w = "";w = g.CENTRAL_DIRECTORY_END + "\x00\x00\x00\x00" + t(d.length, 2) + t(d.length, 2) + t(h, 4) + t(f, 4) + t(k.length, 2) + k;var x = a.type.toLowerCase();for (b = "uint8array" === x || "arraybuffer" === x || "blob" === x || "nodebuffer" === x ? new o(f + h + w.length) : new n(f + h + w.length), c = 0; c < d.length; c++) {
            b.append(d[c].fileRecord), b.append(d[c].compressedObject.compressedContent);
          }for (c = 0; c < d.length; c++) {
            b.append(d[c].dirRecord);
          }b.append(w);var y = b.finalize();switch (a.type.toLowerCase()) {case "uint8array":case "arraybuffer":case "nodebuffer":
              return e.transformTo(a.type.toLowerCase(), y);case "blob":
              return e.arrayBuffer2Blob(e.transformTo("arraybuffer", y), a.mimeType);case "base64":
              return a.base64 ? i.encode(y) : y;default:
              return y;}
        }, crc32: function crc32(a, b) {
          return f(a, b);
        }, utf8encode: function utf8encode(a) {
          return e.transformTo("string", m.utf8encode(a));
        }, utf8decode: function utf8decode(a) {
          return m.utf8decode(a);
        } };b.exports = D;
    }, { "./base64": 2, "./compressedObject": 3, "./compressions": 4, "./crc32": 5, "./defaults": 7, "./nodeBuffer": 12, "./signature": 15, "./stringWriter": 17, "./support": 18, "./uint8ArrayWriter": 20, "./utf8": 21, "./utils": 22 }], 15: [function (a, b, c) {
      "use strict";
      c.LOCAL_FILE_HEADER = "PK", c.CENTRAL_FILE_HEADER = "PK", c.CENTRAL_DIRECTORY_END = "PK", c.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK", c.ZIP64_CENTRAL_DIRECTORY_END = "PK", c.DATA_DESCRIPTOR = "PK\b";
    }, {}], 16: [function (a, b, c) {
      "use strict";
      function d(a, b) {
        this.data = a, b || (this.data = f.string2binary(this.data)), this.length = this.data.length, this.index = 0, this.zero = 0;
      }var e = a("./dataReader"),
          f = a("./utils");d.prototype = new e(), d.prototype.byteAt = function (a) {
        return this.data.charCodeAt(this.zero + a);
      }, d.prototype.lastIndexOfSignature = function (a) {
        return this.data.lastIndexOf(a) - this.zero;
      }, d.prototype.readData = function (a) {
        this.checkOffset(a);var b = this.data.slice(this.zero + this.index, this.zero + this.index + a);return this.index += a, b;
      }, b.exports = d;
    }, { "./dataReader": 6, "./utils": 22 }], 17: [function (a, b, c) {
      "use strict";
      var d = a("./utils"),
          e = function e() {
        this.data = [];
      };e.prototype = { append: function append(a) {
          a = d.transformTo("string", a), this.data.push(a);
        }, finalize: function finalize() {
          return this.data.join("");
        } }, b.exports = e;
    }, { "./utils": 22 }], 18: [function (a, b, c) {
      (function (a) {
        "use strict";
        if (c.base64 = !0, c.array = !0, c.string = !0, c.arraybuffer = "undefined" != typeof ArrayBuffer && "undefined" != typeof Uint8Array, c.nodebuffer = "undefined" != typeof a, c.uint8array = "undefined" != typeof Uint8Array, "undefined" == typeof ArrayBuffer) c.blob = !1;else {
          var b = new ArrayBuffer(0);try {
            c.blob = 0 === new Blob([b], { type: "application/zip" }).size;
          } catch (d) {
            try {
              var e = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder,
                  f = new e();f.append(b), c.blob = 0 === f.getBlob("application/zip").size;
            } catch (d) {
              c.blob = !1;
            }
          }
        }
      }).call(this, "undefined" != typeof Buffer ? Buffer : void 0);
    }, {}], 19: [function (a, b, c) {
      "use strict";
      function d(a) {
        a && (this.data = a, this.length = this.data.length, this.index = 0, this.zero = 0);
      }var e = a("./arrayReader");d.prototype = new e(), d.prototype.readData = function (a) {
        if (this.checkOffset(a), 0 === a) return new Uint8Array(0);var b = this.data.subarray(this.zero + this.index, this.zero + this.index + a);return this.index += a, b;
      }, b.exports = d;
    }, { "./arrayReader": 1 }], 20: [function (a, b, c) {
      "use strict";
      var d = a("./utils"),
          e = function e(a) {
        this.data = new Uint8Array(a), this.index = 0;
      };e.prototype = { append: function append(a) {
          0 !== a.length && (a = d.transformTo("uint8array", a), this.data.set(a, this.index), this.index += a.length);
        }, finalize: function finalize() {
          return this.data;
        } }, b.exports = e;
    }, { "./utils": 22 }], 21: [function (a, b, c) {
      "use strict";
      for (var d = a("./utils"), e = a("./support"), f = a("./nodeBuffer"), g = new Array(256), h = 0; 256 > h; h++) {
        g[h] = h >= 252 ? 6 : h >= 248 ? 5 : h >= 240 ? 4 : h >= 224 ? 3 : h >= 192 ? 2 : 1;
      }g[254] = g[254] = 1;var i = function i(a) {
        var b,
            c,
            d,
            f,
            g,
            h = a.length,
            i = 0;for (f = 0; h > f; f++) {
          c = a.charCodeAt(f), 55296 === (64512 & c) && h > f + 1 && (d = a.charCodeAt(f + 1), 56320 === (64512 & d) && (c = 65536 + (c - 55296 << 10) + (d - 56320), f++)), i += 128 > c ? 1 : 2048 > c ? 2 : 65536 > c ? 3 : 4;
        }for (b = e.uint8array ? new Uint8Array(i) : new Array(i), g = 0, f = 0; i > g; f++) {
          c = a.charCodeAt(f), 55296 === (64512 & c) && h > f + 1 && (d = a.charCodeAt(f + 1), 56320 === (64512 & d) && (c = 65536 + (c - 55296 << 10) + (d - 56320), f++)), 128 > c ? b[g++] = c : 2048 > c ? (b[g++] = 192 | c >>> 6, b[g++] = 128 | 63 & c) : 65536 > c ? (b[g++] = 224 | c >>> 12, b[g++] = 128 | c >>> 6 & 63, b[g++] = 128 | 63 & c) : (b[g++] = 240 | c >>> 18, b[g++] = 128 | c >>> 12 & 63, b[g++] = 128 | c >>> 6 & 63, b[g++] = 128 | 63 & c);
        }return b;
      },
          j = function j(a, b) {
        var c;for (b = b || a.length, b > a.length && (b = a.length), c = b - 1; c >= 0 && 128 === (192 & a[c]);) {
          c--;
        }return 0 > c ? b : 0 === c ? b : c + g[a[c]] > b ? c : b;
      },
          k = function k(a) {
        var b,
            c,
            e,
            f,
            h = a.length,
            i = new Array(2 * h);for (c = 0, b = 0; h > b;) {
          if (e = a[b++], 128 > e) i[c++] = e;else if (f = g[e], f > 4) i[c++] = 65533, b += f - 1;else {
            for (e &= 2 === f ? 31 : 3 === f ? 15 : 7; f > 1 && h > b;) {
              e = e << 6 | 63 & a[b++], f--;
            }f > 1 ? i[c++] = 65533 : 65536 > e ? i[c++] = e : (e -= 65536, i[c++] = 55296 | e >> 10 & 1023, i[c++] = 56320 | 1023 & e);
          }
        }return i.length !== c && (i.subarray ? i = i.subarray(0, c) : i.length = c), d.applyFromCharCode(i);
      };c.utf8encode = function (a) {
        return e.nodebuffer ? f(a, "utf-8") : i(a);
      }, c.utf8decode = function (a) {
        if (e.nodebuffer) return d.transformTo("nodebuffer", a).toString("utf-8");a = d.transformTo(e.uint8array ? "uint8array" : "array", a);for (var b = [], c = 0, f = a.length, g = 65536; f > c;) {
          var h = j(a, Math.min(c + g, f));e.uint8array ? b.push(k(a.subarray(c, h))) : b.push(k(a.slice(c, h))), c = h;
        }return b.join("");
      };
    }, { "./nodeBuffer": 12, "./support": 18, "./utils": 22 }], 22: [function (a, b, c) {
      "use strict";
      function d(a) {
        return a;
      }function e(a, b) {
        for (var c = 0; c < a.length; ++c) {
          b[c] = 255 & a.charCodeAt(c);
        }return b;
      }function f(a) {
        var b = 65536,
            d = [],
            e = a.length,
            f = c.getTypeOf(a),
            g = 0,
            h = !0;try {
          switch (f) {case "uint8array":
              String.fromCharCode.apply(null, new Uint8Array(0));break;case "nodebuffer":
              String.fromCharCode.apply(null, j(0));}
        } catch (i) {
          h = !1;
        }if (!h) {
          for (var k = "", l = 0; l < a.length; l++) {
            k += String.fromCharCode(a[l]);
          }return k;
        }for (; e > g && b > 1;) {
          try {
            "array" === f || "nodebuffer" === f ? d.push(String.fromCharCode.apply(null, a.slice(g, Math.min(g + b, e)))) : d.push(String.fromCharCode.apply(null, a.subarray(g, Math.min(g + b, e)))), g += b;
          } catch (i) {
            b = Math.floor(b / 2);
          }
        }return d.join("");
      }function g(a, b) {
        for (var c = 0; c < a.length; c++) {
          b[c] = a[c];
        }return b;
      }var h = a("./support"),
          i = a("./compressions"),
          j = a("./nodeBuffer");c.string2binary = function (a) {
        for (var b = "", c = 0; c < a.length; c++) {
          b += String.fromCharCode(255 & a.charCodeAt(c));
        }return b;
      }, c.arrayBuffer2Blob = function (a, b) {
        c.checkSupport("blob"), b = b || "application/zip";try {
          return new Blob([a], { type: b });
        } catch (d) {
          try {
            var e = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder,
                f = new e();return f.append(a), f.getBlob(b);
          } catch (d) {
            throw new Error("Bug : can't construct the Blob.");
          }
        }
      }, c.applyFromCharCode = f;var k = {};k.string = { string: d, array: function array(a) {
          return e(a, new Array(a.length));
        }, arraybuffer: function arraybuffer(a) {
          return k.string.uint8array(a).buffer;
        }, uint8array: function uint8array(a) {
          return e(a, new Uint8Array(a.length));
        }, nodebuffer: function nodebuffer(a) {
          return e(a, j(a.length));
        } }, k.array = { string: f, array: d, arraybuffer: function arraybuffer(a) {
          return new Uint8Array(a).buffer;
        }, uint8array: function uint8array(a) {
          return new Uint8Array(a);
        }, nodebuffer: function nodebuffer(a) {
          return j(a);
        } }, k.arraybuffer = { string: function string(a) {
          return f(new Uint8Array(a));
        }, array: function array(a) {
          return g(new Uint8Array(a), new Array(a.byteLength));
        }, arraybuffer: d, uint8array: function uint8array(a) {
          return new Uint8Array(a);
        }, nodebuffer: function nodebuffer(a) {
          return j(new Uint8Array(a));
        } }, k.uint8array = { string: f, array: function array(a) {
          return g(a, new Array(a.length));
        }, arraybuffer: function arraybuffer(a) {
          return a.buffer;
        }, uint8array: d, nodebuffer: function nodebuffer(a) {
          return j(a);
        } }, k.nodebuffer = { string: f, array: function array(a) {
          return g(a, new Array(a.length));
        }, arraybuffer: function arraybuffer(a) {
          return k.nodebuffer.uint8array(a).buffer;
        }, uint8array: function uint8array(a) {
          return g(a, new Uint8Array(a.length));
        }, nodebuffer: d }, c.transformTo = function (a, b) {
        if (b || (b = ""), !a) return b;c.checkSupport(a);var d = c.getTypeOf(b),
            e = k[d][a](b);return e;
      }, c.getTypeOf = function (a) {
        return "string" == typeof a ? "string" : "[object Array]" === Object.prototype.toString.call(a) ? "array" : h.nodebuffer && j.test(a) ? "nodebuffer" : h.uint8array && a instanceof Uint8Array ? "uint8array" : h.arraybuffer && a instanceof ArrayBuffer ? "arraybuffer" : void 0;
      }, c.checkSupport = function (a) {
        var b = h[a.toLowerCase()];if (!b) throw new Error(a + " is not supported by this browser");
      }, c.MAX_VALUE_16BITS = 65535, c.MAX_VALUE_32BITS = -1, c.pretty = function (a) {
        var b,
            c,
            d = "";for (c = 0; c < (a || "").length; c++) {
          b = a.charCodeAt(c), d += "\\x" + (16 > b ? "0" : "") + b.toString(16).toUpperCase();
        }return d;
      }, c.findCompression = function (a) {
        for (var b in i) {
          if (i.hasOwnProperty(b) && i[b].magic === a) return i[b];
        }return null;
      }, c.isRegExp = function (a) {
        return "[object RegExp]" === Object.prototype.toString.call(a);
      }, c.extend = function () {
        var a,
            b,
            c = {};for (a = 0; a < arguments.length; a++) {
          for (b in arguments[a]) {
            arguments[a].hasOwnProperty(b) && "undefined" == typeof c[b] && (c[b] = arguments[a][b]);
          }
        }return c;
      };
    }, { "./compressions": 4, "./nodeBuffer": 12, "./support": 18 }], 23: [function (a, b, c) {
      "use strict";
      function d(a, b) {
        this.files = [], this.loadOptions = b, a && this.load(a);
      }var e = a("./stringReader"),
          f = a("./nodeBufferReader"),
          g = a("./uint8ArrayReader"),
          h = a("./arrayReader"),
          i = a("./utils"),
          j = a("./signature"),
          k = a("./zipEntry"),
          l = a("./support");a("./object");d.prototype = { checkSignature: function checkSignature(a) {
          var b = this.reader.readString(4);if (b !== a) throw new Error("Corrupted zip or bug : unexpected signature (" + i.pretty(b) + ", expected " + i.pretty(a) + ")");
        }, isSignature: function isSignature(a, b) {
          var c = this.reader.index;this.reader.setIndex(a);var d = this.reader.readString(4),
              e = d === b;return this.reader.setIndex(c), e;
        }, readBlockEndOfCentral: function readBlockEndOfCentral() {
          this.diskNumber = this.reader.readInt(2), this.diskWithCentralDirStart = this.reader.readInt(2), this.centralDirRecordsOnThisDisk = this.reader.readInt(2), this.centralDirRecords = this.reader.readInt(2), this.centralDirSize = this.reader.readInt(4), this.centralDirOffset = this.reader.readInt(4), this.zipCommentLength = this.reader.readInt(2);var a = this.reader.readData(this.zipCommentLength),
              b = l.uint8array ? "uint8array" : "array",
              c = i.transformTo(b, a);this.zipComment = this.loadOptions.decodeFileName(c);
        }, readBlockZip64EndOfCentral: function readBlockZip64EndOfCentral() {
          this.zip64EndOfCentralSize = this.reader.readInt(8), this.versionMadeBy = this.reader.readString(2), this.versionNeeded = this.reader.readInt(2), this.diskNumber = this.reader.readInt(4), this.diskWithCentralDirStart = this.reader.readInt(4), this.centralDirRecordsOnThisDisk = this.reader.readInt(8), this.centralDirRecords = this.reader.readInt(8), this.centralDirSize = this.reader.readInt(8), this.centralDirOffset = this.reader.readInt(8), this.zip64ExtensibleData = {};for (var a, b, c, d = this.zip64EndOfCentralSize - 44, e = 0; d > e;) {
            a = this.reader.readInt(2), b = this.reader.readInt(4), c = this.reader.readString(b), this.zip64ExtensibleData[a] = { id: a, length: b, value: c };
          }
        }, readBlockZip64EndOfCentralLocator: function readBlockZip64EndOfCentralLocator() {
          if (this.diskWithZip64CentralDirStart = this.reader.readInt(4), this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8), this.disksCount = this.reader.readInt(4), this.disksCount > 1) throw new Error("Multi-volumes zip are not supported");
        }, readLocalFiles: function readLocalFiles() {
          var a, b;for (a = 0; a < this.files.length; a++) {
            b = this.files[a], this.reader.setIndex(b.localHeaderOffset), this.checkSignature(j.LOCAL_FILE_HEADER), b.readLocalPart(this.reader), b.handleUTF8(), b.processAttributes();
          }
        }, readCentralDir: function readCentralDir() {
          var a;for (this.reader.setIndex(this.centralDirOffset); this.reader.readString(4) === j.CENTRAL_FILE_HEADER;) {
            a = new k({ zip64: this.zip64 }, this.loadOptions), a.readCentralPart(this.reader), this.files.push(a);
          }if (this.centralDirRecords !== this.files.length && 0 !== this.centralDirRecords && 0 === this.files.length) throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
        }, readEndOfCentral: function readEndOfCentral() {
          var a = this.reader.lastIndexOfSignature(j.CENTRAL_DIRECTORY_END);if (0 > a) {
            var b = !this.isSignature(0, j.LOCAL_FILE_HEADER);throw b ? new Error("Can't find end of central directory : is this a zip file ? If it is, see http://stuk.github.io/jszip/documentation/howto/read_zip.html") : new Error("Corrupted zip : can't find end of central directory");
          }this.reader.setIndex(a);var c = a;if (this.checkSignature(j.CENTRAL_DIRECTORY_END), this.readBlockEndOfCentral(), this.diskNumber === i.MAX_VALUE_16BITS || this.diskWithCentralDirStart === i.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === i.MAX_VALUE_16BITS || this.centralDirRecords === i.MAX_VALUE_16BITS || this.centralDirSize === i.MAX_VALUE_32BITS || this.centralDirOffset === i.MAX_VALUE_32BITS) {
            if (this.zip64 = !0, a = this.reader.lastIndexOfSignature(j.ZIP64_CENTRAL_DIRECTORY_LOCATOR), 0 > a) throw new Error("Corrupted zip : can't find the ZIP64 end of central directory locator");if (this.reader.setIndex(a), this.checkSignature(j.ZIP64_CENTRAL_DIRECTORY_LOCATOR), this.readBlockZip64EndOfCentralLocator(), !this.isSignature(this.relativeOffsetEndOfZip64CentralDir, j.ZIP64_CENTRAL_DIRECTORY_END) && (this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(j.ZIP64_CENTRAL_DIRECTORY_END), this.relativeOffsetEndOfZip64CentralDir < 0)) throw new Error("Corrupted zip : can't find the ZIP64 end of central directory");this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir), this.checkSignature(j.ZIP64_CENTRAL_DIRECTORY_END), this.readBlockZip64EndOfCentral();
          }var d = this.centralDirOffset + this.centralDirSize;this.zip64 && (d += 20, d += 12 + this.zip64EndOfCentralSize);var e = c - d;if (e > 0) this.isSignature(c, j.CENTRAL_FILE_HEADER) || (this.reader.zero = e);else if (0 > e) throw new Error("Corrupted zip: missing " + Math.abs(e) + " bytes.");
        }, prepareReader: function prepareReader(a) {
          var b = i.getTypeOf(a);if (i.checkSupport(b), "string" !== b || l.uint8array) {
            if ("nodebuffer" === b) this.reader = new f(a);else if (l.uint8array) this.reader = new g(i.transformTo("uint8array", a));else {
              if (!l.array) throw new Error("Unexpected error: unsupported type '" + b + "'");this.reader = new h(i.transformTo("array", a));
            }
          } else this.reader = new e(a, this.loadOptions.optimizedBinaryString);
        }, load: function load(a) {
          this.prepareReader(a), this.readEndOfCentral(), this.readCentralDir(), this.readLocalFiles();
        } }, b.exports = d;
    }, { "./arrayReader": 1, "./nodeBufferReader": 13, "./object": 14, "./signature": 15, "./stringReader": 16, "./support": 18, "./uint8ArrayReader": 19, "./utils": 22, "./zipEntry": 24 }], 24: [function (a, b, c) {
      "use strict";
      function d(a, b) {
        this.options = a, this.loadOptions = b;
      }var e = a("./stringReader"),
          f = a("./utils"),
          g = a("./compressedObject"),
          h = a("./object"),
          i = a("./support"),
          j = 0,
          k = 3;d.prototype = { isEncrypted: function isEncrypted() {
          return 1 === (1 & this.bitFlag);
        }, useUTF8: function useUTF8() {
          return 2048 === (2048 & this.bitFlag);
        }, prepareCompressedContent: function prepareCompressedContent(a, b, c) {
          return function () {
            var d = a.index;a.setIndex(b);var e = a.readData(c);return a.setIndex(d), e;
          };
        }, prepareContent: function prepareContent(a, b, c, d, e) {
          return function () {
            var a = f.transformTo(d.uncompressInputType, this.getCompressedContent()),
                b = d.uncompress(a);if (b.length !== e) throw new Error("Bug : uncompressed data size mismatch");return b;
          };
        }, readLocalPart: function readLocalPart(a) {
          var b, c;if (a.skip(22), this.fileNameLength = a.readInt(2), c = a.readInt(2), this.fileName = a.readData(this.fileNameLength), a.skip(c), -1 == this.compressedSize || -1 == this.uncompressedSize) throw new Error("Bug or corrupted zip : didn't get enough informations from the central directory (compressedSize == -1 || uncompressedSize == -1)");if (b = f.findCompression(this.compressionMethod), null === b) throw new Error("Corrupted zip : compression " + f.pretty(this.compressionMethod) + " unknown (inner file : " + f.transformTo("string", this.fileName) + ")");if (this.decompressed = new g(), this.decompressed.compressedSize = this.compressedSize, this.decompressed.uncompressedSize = this.uncompressedSize, this.decompressed.crc32 = this.crc32, this.decompressed.compressionMethod = this.compressionMethod, this.decompressed.getCompressedContent = this.prepareCompressedContent(a, a.index, this.compressedSize, b), this.decompressed.getContent = this.prepareContent(a, a.index, this.compressedSize, b, this.uncompressedSize), this.loadOptions.checkCRC32 && (this.decompressed = f.transformTo("string", this.decompressed.getContent()), h.crc32(this.decompressed) !== this.crc32)) throw new Error("Corrupted zip : CRC32 mismatch");
        }, readCentralPart: function readCentralPart(a) {
          if (this.versionMadeBy = a.readInt(2), this.versionNeeded = a.readInt(2), this.bitFlag = a.readInt(2), this.compressionMethod = a.readString(2), this.date = a.readDate(), this.crc32 = a.readInt(4), this.compressedSize = a.readInt(4), this.uncompressedSize = a.readInt(4), this.fileNameLength = a.readInt(2), this.extraFieldsLength = a.readInt(2), this.fileCommentLength = a.readInt(2), this.diskNumberStart = a.readInt(2), this.internalFileAttributes = a.readInt(2), this.externalFileAttributes = a.readInt(4), this.localHeaderOffset = a.readInt(4), this.isEncrypted()) throw new Error("Encrypted zip are not supported");this.fileName = a.readData(this.fileNameLength), this.readExtraFields(a), this.parseZIP64ExtraField(a), this.fileComment = a.readData(this.fileCommentLength);
        }, processAttributes: function processAttributes() {
          this.unixPermissions = null, this.dosPermissions = null;var a = this.versionMadeBy >> 8;this.dir = !!(16 & this.externalFileAttributes), a === j && (this.dosPermissions = 63 & this.externalFileAttributes), a === k && (this.unixPermissions = this.externalFileAttributes >> 16 & 65535), this.dir || "/" !== this.fileNameStr.slice(-1) || (this.dir = !0);
        }, parseZIP64ExtraField: function parseZIP64ExtraField(a) {
          if (this.extraFields[1]) {
            var b = new e(this.extraFields[1].value);this.uncompressedSize === f.MAX_VALUE_32BITS && (this.uncompressedSize = b.readInt(8)), this.compressedSize === f.MAX_VALUE_32BITS && (this.compressedSize = b.readInt(8)), this.localHeaderOffset === f.MAX_VALUE_32BITS && (this.localHeaderOffset = b.readInt(8)), this.diskNumberStart === f.MAX_VALUE_32BITS && (this.diskNumberStart = b.readInt(4));
          }
        }, readExtraFields: function readExtraFields(a) {
          var b,
              c,
              d,
              e = a.index;for (this.extraFields = this.extraFields || {}; a.index < e + this.extraFieldsLength;) {
            b = a.readInt(2), c = a.readInt(2), d = a.readString(c), this.extraFields[b] = { id: b, length: c, value: d };
          }
        }, handleUTF8: function handleUTF8() {
          var a = i.uint8array ? "uint8array" : "array";if (this.useUTF8()) this.fileNameStr = h.utf8decode(this.fileName), this.fileCommentStr = h.utf8decode(this.fileComment);else {
            var b = this.findExtraFieldUnicodePath();if (null !== b) this.fileNameStr = b;else {
              var c = f.transformTo(a, this.fileName);this.fileNameStr = this.loadOptions.decodeFileName(c);
            }var d = this.findExtraFieldUnicodeComment();if (null !== d) this.fileCommentStr = d;else {
              var e = f.transformTo(a, this.fileComment);this.fileCommentStr = this.loadOptions.decodeFileName(e);
            }
          }
        }, findExtraFieldUnicodePath: function findExtraFieldUnicodePath() {
          var a = this.extraFields[28789];if (a) {
            var b = new e(a.value);return 1 !== b.readInt(1) ? null : h.crc32(this.fileName) !== b.readInt(4) ? null : h.utf8decode(b.readString(a.length - 5));
          }return null;
        }, findExtraFieldUnicodeComment: function findExtraFieldUnicodeComment() {
          var a = this.extraFields[25461];if (a) {
            var b = new e(a.value);return 1 !== b.readInt(1) ? null : h.crc32(this.fileComment) !== b.readInt(4) ? null : h.utf8decode(b.readString(a.length - 5));
          }return null;
        } }, b.exports = d;
    }, { "./compressedObject": 3, "./object": 14, "./stringReader": 16, "./support": 18, "./utils": 22 }], 25: [function (a, b, c) {
      "use strict";
      var d = a("./lib/utils/common").assign,
          e = a("./lib/deflate"),
          f = a("./lib/inflate"),
          g = a("./lib/zlib/constants"),
          h = {};d(h, e, f, g), b.exports = h;
    }, { "./lib/deflate": 26, "./lib/inflate": 27, "./lib/utils/common": 28, "./lib/zlib/constants": 31 }], 26: [function (a, b, c) {
      "use strict";
      function d(a) {
        if (!(this instanceof d)) return new d(a);this.options = i.assign({ level: s, method: u, chunkSize: 16384, windowBits: 15, memLevel: 8, strategy: t, to: "" }, a || {});var b = this.options;b.raw && b.windowBits > 0 ? b.windowBits = -b.windowBits : b.gzip && b.windowBits > 0 && b.windowBits < 16 && (b.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new l(), this.strm.avail_out = 0;var c = h.deflateInit2(this.strm, b.level, b.method, b.windowBits, b.memLevel, b.strategy);if (c !== p) throw new Error(k[c]);b.header && h.deflateSetHeader(this.strm, b.header);
      }function e(a, b) {
        var c = new d(b);if (c.push(a, !0), c.err) throw c.msg;return c.result;
      }function f(a, b) {
        return b = b || {}, b.raw = !0, e(a, b);
      }function g(a, b) {
        return b = b || {}, b.gzip = !0, e(a, b);
      }var h = a("./zlib/deflate"),
          i = a("./utils/common"),
          j = a("./utils/strings"),
          k = a("./zlib/messages"),
          l = a("./zlib/zstream"),
          m = Object.prototype.toString,
          n = 0,
          o = 4,
          p = 0,
          q = 1,
          r = 2,
          s = -1,
          t = 0,
          u = 8;d.prototype.push = function (a, b) {
        var c,
            d,
            e = this.strm,
            f = this.options.chunkSize;if (this.ended) return !1;d = b === ~~b ? b : b === !0 ? o : n, "string" == typeof a ? e.input = j.string2buf(a) : "[object ArrayBuffer]" === m.call(a) ? e.input = new Uint8Array(a) : e.input = a, e.next_in = 0, e.avail_in = e.input.length;do {
          if (0 === e.avail_out && (e.output = new i.Buf8(f), e.next_out = 0, e.avail_out = f), c = h.deflate(e, d), c !== q && c !== p) return this.onEnd(c), this.ended = !0, !1;0 !== e.avail_out && (0 !== e.avail_in || d !== o && d !== r) || ("string" === this.options.to ? this.onData(j.buf2binstring(i.shrinkBuf(e.output, e.next_out))) : this.onData(i.shrinkBuf(e.output, e.next_out)));
        } while ((e.avail_in > 0 || 0 === e.avail_out) && c !== q);return d === o ? (c = h.deflateEnd(this.strm), this.onEnd(c), this.ended = !0, c === p) : d === r ? (this.onEnd(p), e.avail_out = 0, !0) : !0;
      }, d.prototype.onData = function (a) {
        this.chunks.push(a);
      }, d.prototype.onEnd = function (a) {
        a === p && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = i.flattenChunks(this.chunks)), this.chunks = [], this.err = a, this.msg = this.strm.msg;
      }, c.Deflate = d, c.deflate = e, c.deflateRaw = f, c.gzip = g;
    }, { "./utils/common": 28, "./utils/strings": 29, "./zlib/deflate": 33, "./zlib/messages": 38, "./zlib/zstream": 40 }], 27: [function (a, b, c) {
      "use strict";
      function d(a) {
        if (!(this instanceof d)) return new d(a);this.options = h.assign({ chunkSize: 16384, windowBits: 0, to: "" }, a || {});var b = this.options;b.raw && b.windowBits >= 0 && b.windowBits < 16 && (b.windowBits = -b.windowBits, 0 === b.windowBits && (b.windowBits = -15)), !(b.windowBits >= 0 && b.windowBits < 16) || a && a.windowBits || (b.windowBits += 32), b.windowBits > 15 && b.windowBits < 48 && 0 === (15 & b.windowBits) && (b.windowBits |= 15), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new l(), this.strm.avail_out = 0;var c = g.inflateInit2(this.strm, b.windowBits);if (c !== j.Z_OK) throw new Error(k[c]);this.header = new m(), g.inflateGetHeader(this.strm, this.header);
      }function e(a, b) {
        var c = new d(b);if (c.push(a, !0), c.err) throw c.msg;return c.result;
      }function f(a, b) {
        return b = b || {}, b.raw = !0, e(a, b);
      }var g = a("./zlib/inflate"),
          h = a("./utils/common"),
          i = a("./utils/strings"),
          j = a("./zlib/constants"),
          k = a("./zlib/messages"),
          l = a("./zlib/zstream"),
          m = a("./zlib/gzheader"),
          n = Object.prototype.toString;d.prototype.push = function (a, b) {
        var c,
            d,
            e,
            f,
            k,
            l = this.strm,
            m = this.options.chunkSize,
            o = !1;if (this.ended) return !1;d = b === ~~b ? b : b === !0 ? j.Z_FINISH : j.Z_NO_FLUSH, "string" == typeof a ? l.input = i.binstring2buf(a) : "[object ArrayBuffer]" === n.call(a) ? l.input = new Uint8Array(a) : l.input = a, l.next_in = 0, l.avail_in = l.input.length;do {
          if (0 === l.avail_out && (l.output = new h.Buf8(m), l.next_out = 0, l.avail_out = m), c = g.inflate(l, j.Z_NO_FLUSH), c === j.Z_BUF_ERROR && o === !0 && (c = j.Z_OK, o = !1), c !== j.Z_STREAM_END && c !== j.Z_OK) return this.onEnd(c), this.ended = !0, !1;l.next_out && (0 !== l.avail_out && c !== j.Z_STREAM_END && (0 !== l.avail_in || d !== j.Z_FINISH && d !== j.Z_SYNC_FLUSH) || ("string" === this.options.to ? (e = i.utf8border(l.output, l.next_out), f = l.next_out - e, k = i.buf2string(l.output, e), l.next_out = f, l.avail_out = m - f, f && h.arraySet(l.output, l.output, e, f, 0), this.onData(k)) : this.onData(h.shrinkBuf(l.output, l.next_out)))), 0 === l.avail_in && 0 === l.avail_out && (o = !0);
        } while ((l.avail_in > 0 || 0 === l.avail_out) && c !== j.Z_STREAM_END);return c === j.Z_STREAM_END && (d = j.Z_FINISH), d === j.Z_FINISH ? (c = g.inflateEnd(this.strm), this.onEnd(c), this.ended = !0, c === j.Z_OK) : d === j.Z_SYNC_FLUSH ? (this.onEnd(j.Z_OK), l.avail_out = 0, !0) : !0;
      }, d.prototype.onData = function (a) {
        this.chunks.push(a);
      }, d.prototype.onEnd = function (a) {
        a === j.Z_OK && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = h.flattenChunks(this.chunks)), this.chunks = [], this.err = a, this.msg = this.strm.msg;
      }, c.Inflate = d, c.inflate = e, c.inflateRaw = f, c.ungzip = e;
    }, { "./utils/common": 28, "./utils/strings": 29, "./zlib/constants": 31, "./zlib/gzheader": 34, "./zlib/inflate": 36, "./zlib/messages": 38, "./zlib/zstream": 40 }], 28: [function (a, b, c) {
      "use strict";
      var d = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Int32Array;c.assign = function (a) {
        for (var b = Array.prototype.slice.call(arguments, 1); b.length;) {
          var c = b.shift();if (c) {
            if ("object" != (typeof c === "undefined" ? "undefined" : _typeof(c))) throw new TypeError(c + "must be non-object");for (var d in c) {
              c.hasOwnProperty(d) && (a[d] = c[d]);
            }
          }
        }return a;
      }, c.shrinkBuf = function (a, b) {
        return a.length === b ? a : a.subarray ? a.subarray(0, b) : (a.length = b, a);
      };var e = { arraySet: function arraySet(a, b, c, d, e) {
          if (b.subarray && a.subarray) return void a.set(b.subarray(c, c + d), e);for (var f = 0; d > f; f++) {
            a[e + f] = b[c + f];
          }
        }, flattenChunks: function flattenChunks(a) {
          var b, c, d, e, f, g;for (d = 0, b = 0, c = a.length; c > b; b++) {
            d += a[b].length;
          }for (g = new Uint8Array(d), e = 0, b = 0, c = a.length; c > b; b++) {
            f = a[b], g.set(f, e), e += f.length;
          }return g;
        } },
          f = { arraySet: function arraySet(a, b, c, d, e) {
          for (var f = 0; d > f; f++) {
            a[e + f] = b[c + f];
          }
        }, flattenChunks: function flattenChunks(a) {
          return [].concat.apply([], a);
        } };c.setTyped = function (a) {
        a ? (c.Buf8 = Uint8Array, c.Buf16 = Uint16Array, c.Buf32 = Int32Array, c.assign(c, e)) : (c.Buf8 = Array, c.Buf16 = Array, c.Buf32 = Array, c.assign(c, f));
      }, c.setTyped(d);
    }, {}], 29: [function (a, b, c) {
      "use strict";
      function d(a, b) {
        if (65537 > b && (a.subarray && g || !a.subarray && f)) return String.fromCharCode.apply(null, e.shrinkBuf(a, b));for (var c = "", d = 0; b > d; d++) {
          c += String.fromCharCode(a[d]);
        }return c;
      }var e = a("./common"),
          f = !0,
          g = !0;try {
        String.fromCharCode.apply(null, [0]);
      } catch (h) {
        f = !1;
      }try {
        String.fromCharCode.apply(null, new Uint8Array(1));
      } catch (h) {
        g = !1;
      }for (var i = new e.Buf8(256), j = 0; 256 > j; j++) {
        i[j] = j >= 252 ? 6 : j >= 248 ? 5 : j >= 240 ? 4 : j >= 224 ? 3 : j >= 192 ? 2 : 1;
      }i[254] = i[254] = 1, c.string2buf = function (a) {
        var b,
            c,
            d,
            f,
            g,
            h = a.length,
            i = 0;for (f = 0; h > f; f++) {
          c = a.charCodeAt(f), 55296 === (64512 & c) && h > f + 1 && (d = a.charCodeAt(f + 1), 56320 === (64512 & d) && (c = 65536 + (c - 55296 << 10) + (d - 56320), f++)), i += 128 > c ? 1 : 2048 > c ? 2 : 65536 > c ? 3 : 4;
        }for (b = new e.Buf8(i), g = 0, f = 0; i > g; f++) {
          c = a.charCodeAt(f), 55296 === (64512 & c) && h > f + 1 && (d = a.charCodeAt(f + 1), 56320 === (64512 & d) && (c = 65536 + (c - 55296 << 10) + (d - 56320), f++)), 128 > c ? b[g++] = c : 2048 > c ? (b[g++] = 192 | c >>> 6, b[g++] = 128 | 63 & c) : 65536 > c ? (b[g++] = 224 | c >>> 12, b[g++] = 128 | c >>> 6 & 63, b[g++] = 128 | 63 & c) : (b[g++] = 240 | c >>> 18, b[g++] = 128 | c >>> 12 & 63, b[g++] = 128 | c >>> 6 & 63, b[g++] = 128 | 63 & c);
        }return b;
      }, c.buf2binstring = function (a) {
        return d(a, a.length);
      }, c.binstring2buf = function (a) {
        for (var b = new e.Buf8(a.length), c = 0, d = b.length; d > c; c++) {
          b[c] = a.charCodeAt(c);
        }return b;
      }, c.buf2string = function (a, b) {
        var c,
            e,
            f,
            g,
            h = b || a.length,
            j = new Array(2 * h);for (e = 0, c = 0; h > c;) {
          if (f = a[c++], 128 > f) j[e++] = f;else if (g = i[f], g > 4) j[e++] = 65533, c += g - 1;else {
            for (f &= 2 === g ? 31 : 3 === g ? 15 : 7; g > 1 && h > c;) {
              f = f << 6 | 63 & a[c++], g--;
            }g > 1 ? j[e++] = 65533 : 65536 > f ? j[e++] = f : (f -= 65536, j[e++] = 55296 | f >> 10 & 1023, j[e++] = 56320 | 1023 & f);
          }
        }return d(j, e);
      }, c.utf8border = function (a, b) {
        var c;for (b = b || a.length, b > a.length && (b = a.length), c = b - 1; c >= 0 && 128 === (192 & a[c]);) {
          c--;
        }return 0 > c ? b : 0 === c ? b : c + i[a[c]] > b ? c : b;
      };
    }, { "./common": 28 }], 30: [function (a, b, c) {
      "use strict";
      function d(a, b, c, d) {
        for (var e = 65535 & a | 0, f = a >>> 16 & 65535 | 0, g = 0; 0 !== c;) {
          g = c > 2e3 ? 2e3 : c, c -= g;do {
            e = e + b[d++] | 0, f = f + e | 0;
          } while (--g);e %= 65521, f %= 65521;
        }return e | f << 16 | 0;
      }b.exports = d;
    }, {}], 31: [function (a, b, c) {
      "use strict";
      b.exports = { Z_NO_FLUSH: 0, Z_PARTIAL_FLUSH: 1, Z_SYNC_FLUSH: 2, Z_FULL_FLUSH: 3, Z_FINISH: 4, Z_BLOCK: 5, Z_TREES: 6, Z_OK: 0, Z_STREAM_END: 1, Z_NEED_DICT: 2, Z_ERRNO: -1, Z_STREAM_ERROR: -2, Z_DATA_ERROR: -3, Z_BUF_ERROR: -5, Z_NO_COMPRESSION: 0, Z_BEST_SPEED: 1, Z_BEST_COMPRESSION: 9, Z_DEFAULT_COMPRESSION: -1, Z_FILTERED: 1, Z_HUFFMAN_ONLY: 2, Z_RLE: 3, Z_FIXED: 4, Z_DEFAULT_STRATEGY: 0, Z_BINARY: 0, Z_TEXT: 1, Z_UNKNOWN: 2, Z_DEFLATED: 8 };
    }, {}], 32: [function (a, b, c) {
      "use strict";
      function d() {
        for (var a, b = [], c = 0; 256 > c; c++) {
          a = c;for (var d = 0; 8 > d; d++) {
            a = 1 & a ? 3988292384 ^ a >>> 1 : a >>> 1;
          }b[c] = a;
        }return b;
      }function e(a, b, c, d) {
        var e = f,
            g = d + c;a ^= -1;for (var h = d; g > h; h++) {
          a = a >>> 8 ^ e[255 & (a ^ b[h])];
        }return -1 ^ a;
      }var f = d();b.exports = e;
    }, {}], 33: [function (a, b, c) {
      "use strict";
      function d(a, b) {
        return a.msg = H[b], b;
      }function e(a) {
        return (a << 1) - (a > 4 ? 9 : 0);
      }function f(a) {
        for (var b = a.length; --b >= 0;) {
          a[b] = 0;
        }
      }function g(a) {
        var b = a.state,
            c = b.pending;c > a.avail_out && (c = a.avail_out), 0 !== c && (D.arraySet(a.output, b.pending_buf, b.pending_out, c, a.next_out), a.next_out += c, b.pending_out += c, a.total_out += c, a.avail_out -= c, b.pending -= c, 0 === b.pending && (b.pending_out = 0));
      }function h(a, b) {
        E._tr_flush_block(a, a.block_start >= 0 ? a.block_start : -1, a.strstart - a.block_start, b), a.block_start = a.strstart, g(a.strm);
      }function i(a, b) {
        a.pending_buf[a.pending++] = b;
      }function j(a, b) {
        a.pending_buf[a.pending++] = b >>> 8 & 255, a.pending_buf[a.pending++] = 255 & b;
      }function k(a, b, c, d) {
        var e = a.avail_in;return e > d && (e = d), 0 === e ? 0 : (a.avail_in -= e, D.arraySet(b, a.input, a.next_in, e, c), 1 === a.state.wrap ? a.adler = F(a.adler, b, e, c) : 2 === a.state.wrap && (a.adler = G(a.adler, b, e, c)), a.next_in += e, a.total_in += e, e);
      }function l(a, b) {
        var c,
            d,
            e = a.max_chain_length,
            f = a.strstart,
            g = a.prev_length,
            h = a.nice_match,
            i = a.strstart > a.w_size - ka ? a.strstart - (a.w_size - ka) : 0,
            j = a.window,
            k = a.w_mask,
            l = a.prev,
            m = a.strstart + ja,
            n = j[f + g - 1],
            o = j[f + g];a.prev_length >= a.good_match && (e >>= 2), h > a.lookahead && (h = a.lookahead);do {
          if (c = b, j[c + g] === o && j[c + g - 1] === n && j[c] === j[f] && j[++c] === j[f + 1]) {
            f += 2, c++;do {} while (j[++f] === j[++c] && j[++f] === j[++c] && j[++f] === j[++c] && j[++f] === j[++c] && j[++f] === j[++c] && j[++f] === j[++c] && j[++f] === j[++c] && j[++f] === j[++c] && m > f);if (d = ja - (m - f), f = m - ja, d > g) {
              if (a.match_start = b, g = d, d >= h) break;n = j[f + g - 1], o = j[f + g];
            }
          }
        } while ((b = l[b & k]) > i && 0 !== --e);return g <= a.lookahead ? g : a.lookahead;
      }function m(a) {
        var b,
            c,
            d,
            e,
            f,
            g = a.w_size;do {
          if (e = a.window_size - a.lookahead - a.strstart, a.strstart >= g + (g - ka)) {
            D.arraySet(a.window, a.window, g, g, 0), a.match_start -= g, a.strstart -= g, a.block_start -= g, c = a.hash_size, b = c;do {
              d = a.head[--b], a.head[b] = d >= g ? d - g : 0;
            } while (--c);c = g, b = c;do {
              d = a.prev[--b], a.prev[b] = d >= g ? d - g : 0;
            } while (--c);e += g;
          }if (0 === a.strm.avail_in) break;if (c = k(a.strm, a.window, a.strstart + a.lookahead, e), a.lookahead += c, a.lookahead + a.insert >= ia) for (f = a.strstart - a.insert, a.ins_h = a.window[f], a.ins_h = (a.ins_h << a.hash_shift ^ a.window[f + 1]) & a.hash_mask; a.insert && (a.ins_h = (a.ins_h << a.hash_shift ^ a.window[f + ia - 1]) & a.hash_mask, a.prev[f & a.w_mask] = a.head[a.ins_h], a.head[a.ins_h] = f, f++, a.insert--, !(a.lookahead + a.insert < ia));) {}
        } while (a.lookahead < ka && 0 !== a.strm.avail_in);
      }function n(a, b) {
        var c = 65535;for (c > a.pending_buf_size - 5 && (c = a.pending_buf_size - 5);;) {
          if (a.lookahead <= 1) {
            if (m(a), 0 === a.lookahead && b === I) return ta;if (0 === a.lookahead) break;
          }a.strstart += a.lookahead, a.lookahead = 0;var d = a.block_start + c;if ((0 === a.strstart || a.strstart >= d) && (a.lookahead = a.strstart - d, a.strstart = d, h(a, !1), 0 === a.strm.avail_out)) return ta;if (a.strstart - a.block_start >= a.w_size - ka && (h(a, !1), 0 === a.strm.avail_out)) return ta;
        }return a.insert = 0, b === L ? (h(a, !0), 0 === a.strm.avail_out ? va : wa) : a.strstart > a.block_start && (h(a, !1), 0 === a.strm.avail_out) ? ta : ta;
      }function o(a, b) {
        for (var c, d;;) {
          if (a.lookahead < ka) {
            if (m(a), a.lookahead < ka && b === I) return ta;if (0 === a.lookahead) break;
          }if (c = 0, a.lookahead >= ia && (a.ins_h = (a.ins_h << a.hash_shift ^ a.window[a.strstart + ia - 1]) & a.hash_mask, c = a.prev[a.strstart & a.w_mask] = a.head[a.ins_h], a.head[a.ins_h] = a.strstart), 0 !== c && a.strstart - c <= a.w_size - ka && (a.match_length = l(a, c)), a.match_length >= ia) {
            if (d = E._tr_tally(a, a.strstart - a.match_start, a.match_length - ia), a.lookahead -= a.match_length, a.match_length <= a.max_lazy_match && a.lookahead >= ia) {
              a.match_length--;do {
                a.strstart++, a.ins_h = (a.ins_h << a.hash_shift ^ a.window[a.strstart + ia - 1]) & a.hash_mask, c = a.prev[a.strstart & a.w_mask] = a.head[a.ins_h], a.head[a.ins_h] = a.strstart;
              } while (0 !== --a.match_length);a.strstart++;
            } else a.strstart += a.match_length, a.match_length = 0, a.ins_h = a.window[a.strstart], a.ins_h = (a.ins_h << a.hash_shift ^ a.window[a.strstart + 1]) & a.hash_mask;
          } else d = E._tr_tally(a, 0, a.window[a.strstart]), a.lookahead--, a.strstart++;if (d && (h(a, !1), 0 === a.strm.avail_out)) return ta;
        }return a.insert = a.strstart < ia - 1 ? a.strstart : ia - 1, b === L ? (h(a, !0), 0 === a.strm.avail_out ? va : wa) : a.last_lit && (h(a, !1), 0 === a.strm.avail_out) ? ta : ua;
      }function p(a, b) {
        for (var c, d, e;;) {
          if (a.lookahead < ka) {
            if (m(a), a.lookahead < ka && b === I) return ta;if (0 === a.lookahead) break;
          }if (c = 0, a.lookahead >= ia && (a.ins_h = (a.ins_h << a.hash_shift ^ a.window[a.strstart + ia - 1]) & a.hash_mask, c = a.prev[a.strstart & a.w_mask] = a.head[a.ins_h], a.head[a.ins_h] = a.strstart), a.prev_length = a.match_length, a.prev_match = a.match_start, a.match_length = ia - 1, 0 !== c && a.prev_length < a.max_lazy_match && a.strstart - c <= a.w_size - ka && (a.match_length = l(a, c), a.match_length <= 5 && (a.strategy === T || a.match_length === ia && a.strstart - a.match_start > 4096) && (a.match_length = ia - 1)), a.prev_length >= ia && a.match_length <= a.prev_length) {
            e = a.strstart + a.lookahead - ia, d = E._tr_tally(a, a.strstart - 1 - a.prev_match, a.prev_length - ia), a.lookahead -= a.prev_length - 1, a.prev_length -= 2;do {
              ++a.strstart <= e && (a.ins_h = (a.ins_h << a.hash_shift ^ a.window[a.strstart + ia - 1]) & a.hash_mask, c = a.prev[a.strstart & a.w_mask] = a.head[a.ins_h], a.head[a.ins_h] = a.strstart);
            } while (0 !== --a.prev_length);if (a.match_available = 0, a.match_length = ia - 1, a.strstart++, d && (h(a, !1), 0 === a.strm.avail_out)) return ta;
          } else if (a.match_available) {
            if (d = E._tr_tally(a, 0, a.window[a.strstart - 1]), d && h(a, !1), a.strstart++, a.lookahead--, 0 === a.strm.avail_out) return ta;
          } else a.match_available = 1, a.strstart++, a.lookahead--;
        }return a.match_available && (d = E._tr_tally(a, 0, a.window[a.strstart - 1]), a.match_available = 0), a.insert = a.strstart < ia - 1 ? a.strstart : ia - 1, b === L ? (h(a, !0), 0 === a.strm.avail_out ? va : wa) : a.last_lit && (h(a, !1), 0 === a.strm.avail_out) ? ta : ua;
      }function q(a, b) {
        for (var c, d, e, f, g = a.window;;) {
          if (a.lookahead <= ja) {
            if (m(a), a.lookahead <= ja && b === I) return ta;if (0 === a.lookahead) break;
          }if (a.match_length = 0, a.lookahead >= ia && a.strstart > 0 && (e = a.strstart - 1, d = g[e], d === g[++e] && d === g[++e] && d === g[++e])) {
            f = a.strstart + ja;do {} while (d === g[++e] && d === g[++e] && d === g[++e] && d === g[++e] && d === g[++e] && d === g[++e] && d === g[++e] && d === g[++e] && f > e);a.match_length = ja - (f - e), a.match_length > a.lookahead && (a.match_length = a.lookahead);
          }if (a.match_length >= ia ? (c = E._tr_tally(a, 1, a.match_length - ia), a.lookahead -= a.match_length, a.strstart += a.match_length, a.match_length = 0) : (c = E._tr_tally(a, 0, a.window[a.strstart]), a.lookahead--, a.strstart++), c && (h(a, !1), 0 === a.strm.avail_out)) return ta;
        }return a.insert = 0, b === L ? (h(a, !0), 0 === a.strm.avail_out ? va : wa) : a.last_lit && (h(a, !1), 0 === a.strm.avail_out) ? ta : ua;
      }function r(a, b) {
        for (var c;;) {
          if (0 === a.lookahead && (m(a), 0 === a.lookahead)) {
            if (b === I) return ta;break;
          }if (a.match_length = 0, c = E._tr_tally(a, 0, a.window[a.strstart]), a.lookahead--, a.strstart++, c && (h(a, !1), 0 === a.strm.avail_out)) return ta;
        }return a.insert = 0, b === L ? (h(a, !0), 0 === a.strm.avail_out ? va : wa) : a.last_lit && (h(a, !1), 0 === a.strm.avail_out) ? ta : ua;
      }function s(a, b, c, d, e) {
        this.good_length = a, this.max_lazy = b, this.nice_length = c, this.max_chain = d, this.func = e;
      }function t(a) {
        a.window_size = 2 * a.w_size, f(a.head), a.max_lazy_match = C[a.level].max_lazy, a.good_match = C[a.level].good_length, a.nice_match = C[a.level].nice_length, a.max_chain_length = C[a.level].max_chain, a.strstart = 0, a.block_start = 0, a.lookahead = 0, a.insert = 0, a.match_length = a.prev_length = ia - 1, a.match_available = 0, a.ins_h = 0;
      }function u() {
        this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = Z, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new D.Buf16(2 * ga), this.dyn_dtree = new D.Buf16(2 * (2 * ea + 1)), this.bl_tree = new D.Buf16(2 * (2 * fa + 1)), f(this.dyn_ltree), f(this.dyn_dtree), f(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new D.Buf16(ha + 1), this.heap = new D.Buf16(2 * da + 1), f(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new D.Buf16(2 * da + 1), f(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
      }function v(a) {
        var b;return a && a.state ? (a.total_in = a.total_out = 0, a.data_type = Y, b = a.state, b.pending = 0, b.pending_out = 0, b.wrap < 0 && (b.wrap = -b.wrap), b.status = b.wrap ? ma : ra, a.adler = 2 === b.wrap ? 0 : 1, b.last_flush = I, E._tr_init(b), N) : d(a, P);
      }function w(a) {
        var b = v(a);return b === N && t(a.state), b;
      }function x(a, b) {
        return a && a.state ? 2 !== a.state.wrap ? P : (a.state.gzhead = b, N) : P;
      }function y(a, b, c, e, f, g) {
        if (!a) return P;var h = 1;if (b === S && (b = 6), 0 > e ? (h = 0, e = -e) : e > 15 && (h = 2, e -= 16), 1 > f || f > $ || c !== Z || 8 > e || e > 15 || 0 > b || b > 9 || 0 > g || g > W) return d(a, P);8 === e && (e = 9);var i = new u();return a.state = i, i.strm = a, i.wrap = h, i.gzhead = null, i.w_bits = e, i.w_size = 1 << i.w_bits, i.w_mask = i.w_size - 1, i.hash_bits = f + 7, i.hash_size = 1 << i.hash_bits, i.hash_mask = i.hash_size - 1, i.hash_shift = ~~((i.hash_bits + ia - 1) / ia), i.window = new D.Buf8(2 * i.w_size), i.head = new D.Buf16(i.hash_size), i.prev = new D.Buf16(i.w_size), i.lit_bufsize = 1 << f + 6, i.pending_buf_size = 4 * i.lit_bufsize, i.pending_buf = new D.Buf8(i.pending_buf_size), i.d_buf = i.lit_bufsize >> 1, i.l_buf = 3 * i.lit_bufsize, i.level = b, i.strategy = g, i.method = c, w(a);
      }function z(a, b) {
        return y(a, b, Z, _, aa, X);
      }function A(a, b) {
        var c, h, k, l;if (!a || !a.state || b > M || 0 > b) return a ? d(a, P) : P;if (h = a.state, !a.output || !a.input && 0 !== a.avail_in || h.status === sa && b !== L) return d(a, 0 === a.avail_out ? R : P);if (h.strm = a, c = h.last_flush, h.last_flush = b, h.status === ma) if (2 === h.wrap) a.adler = 0, i(h, 31), i(h, 139), i(h, 8), h.gzhead ? (i(h, (h.gzhead.text ? 1 : 0) + (h.gzhead.hcrc ? 2 : 0) + (h.gzhead.extra ? 4 : 0) + (h.gzhead.name ? 8 : 0) + (h.gzhead.comment ? 16 : 0)), i(h, 255 & h.gzhead.time), i(h, h.gzhead.time >> 8 & 255), i(h, h.gzhead.time >> 16 & 255), i(h, h.gzhead.time >> 24 & 255), i(h, 9 === h.level ? 2 : h.strategy >= U || h.level < 2 ? 4 : 0), i(h, 255 & h.gzhead.os), h.gzhead.extra && h.gzhead.extra.length && (i(h, 255 & h.gzhead.extra.length), i(h, h.gzhead.extra.length >> 8 & 255)), h.gzhead.hcrc && (a.adler = G(a.adler, h.pending_buf, h.pending, 0)), h.gzindex = 0, h.status = na) : (i(h, 0), i(h, 0), i(h, 0), i(h, 0), i(h, 0), i(h, 9 === h.level ? 2 : h.strategy >= U || h.level < 2 ? 4 : 0), i(h, xa), h.status = ra);else {
          var m = Z + (h.w_bits - 8 << 4) << 8,
              n = -1;n = h.strategy >= U || h.level < 2 ? 0 : h.level < 6 ? 1 : 6 === h.level ? 2 : 3, m |= n << 6, 0 !== h.strstart && (m |= la), m += 31 - m % 31, h.status = ra, j(h, m), 0 !== h.strstart && (j(h, a.adler >>> 16), j(h, 65535 & a.adler)), a.adler = 1;
        }if (h.status === na) if (h.gzhead.extra) {
          for (k = h.pending; h.gzindex < (65535 & h.gzhead.extra.length) && (h.pending !== h.pending_buf_size || (h.gzhead.hcrc && h.pending > k && (a.adler = G(a.adler, h.pending_buf, h.pending - k, k)), g(a), k = h.pending, h.pending !== h.pending_buf_size));) {
            i(h, 255 & h.gzhead.extra[h.gzindex]), h.gzindex++;
          }h.gzhead.hcrc && h.pending > k && (a.adler = G(a.adler, h.pending_buf, h.pending - k, k)), h.gzindex === h.gzhead.extra.length && (h.gzindex = 0, h.status = oa);
        } else h.status = oa;if (h.status === oa) if (h.gzhead.name) {
          k = h.pending;do {
            if (h.pending === h.pending_buf_size && (h.gzhead.hcrc && h.pending > k && (a.adler = G(a.adler, h.pending_buf, h.pending - k, k)), g(a), k = h.pending, h.pending === h.pending_buf_size)) {
              l = 1;break;
            }l = h.gzindex < h.gzhead.name.length ? 255 & h.gzhead.name.charCodeAt(h.gzindex++) : 0, i(h, l);
          } while (0 !== l);h.gzhead.hcrc && h.pending > k && (a.adler = G(a.adler, h.pending_buf, h.pending - k, k)), 0 === l && (h.gzindex = 0, h.status = pa);
        } else h.status = pa;if (h.status === pa) if (h.gzhead.comment) {
          k = h.pending;do {
            if (h.pending === h.pending_buf_size && (h.gzhead.hcrc && h.pending > k && (a.adler = G(a.adler, h.pending_buf, h.pending - k, k)), g(a), k = h.pending, h.pending === h.pending_buf_size)) {
              l = 1;break;
            }l = h.gzindex < h.gzhead.comment.length ? 255 & h.gzhead.comment.charCodeAt(h.gzindex++) : 0, i(h, l);
          } while (0 !== l);h.gzhead.hcrc && h.pending > k && (a.adler = G(a.adler, h.pending_buf, h.pending - k, k)), 0 === l && (h.status = qa);
        } else h.status = qa;if (h.status === qa && (h.gzhead.hcrc ? (h.pending + 2 > h.pending_buf_size && g(a), h.pending + 2 <= h.pending_buf_size && (i(h, 255 & a.adler), i(h, a.adler >> 8 & 255), a.adler = 0, h.status = ra)) : h.status = ra), 0 !== h.pending) {
          if (g(a), 0 === a.avail_out) return h.last_flush = -1, N;
        } else if (0 === a.avail_in && e(b) <= e(c) && b !== L) return d(a, R);if (h.status === sa && 0 !== a.avail_in) return d(a, R);if (0 !== a.avail_in || 0 !== h.lookahead || b !== I && h.status !== sa) {
          var o = h.strategy === U ? r(h, b) : h.strategy === V ? q(h, b) : C[h.level].func(h, b);if (o !== va && o !== wa || (h.status = sa), o === ta || o === va) return 0 === a.avail_out && (h.last_flush = -1), N;if (o === ua && (b === J ? E._tr_align(h) : b !== M && (E._tr_stored_block(h, 0, 0, !1), b === K && (f(h.head), 0 === h.lookahead && (h.strstart = 0, h.block_start = 0, h.insert = 0))), g(a), 0 === a.avail_out)) return h.last_flush = -1, N;
        }return b !== L ? N : h.wrap <= 0 ? O : (2 === h.wrap ? (i(h, 255 & a.adler), i(h, a.adler >> 8 & 255), i(h, a.adler >> 16 & 255), i(h, a.adler >> 24 & 255), i(h, 255 & a.total_in), i(h, a.total_in >> 8 & 255), i(h, a.total_in >> 16 & 255), i(h, a.total_in >> 24 & 255)) : (j(h, a.adler >>> 16), j(h, 65535 & a.adler)), g(a), h.wrap > 0 && (h.wrap = -h.wrap), 0 !== h.pending ? N : O);
      }function B(a) {
        var b;return a && a.state ? (b = a.state.status, b !== ma && b !== na && b !== oa && b !== pa && b !== qa && b !== ra && b !== sa ? d(a, P) : (a.state = null, b === ra ? d(a, Q) : N)) : P;
      }var C,
          D = a("../utils/common"),
          E = a("./trees"),
          F = a("./adler32"),
          G = a("./crc32"),
          H = a("./messages"),
          I = 0,
          J = 1,
          K = 3,
          L = 4,
          M = 5,
          N = 0,
          O = 1,
          P = -2,
          Q = -3,
          R = -5,
          S = -1,
          T = 1,
          U = 2,
          V = 3,
          W = 4,
          X = 0,
          Y = 2,
          Z = 8,
          $ = 9,
          _ = 15,
          aa = 8,
          ba = 29,
          ca = 256,
          da = ca + 1 + ba,
          ea = 30,
          fa = 19,
          ga = 2 * da + 1,
          ha = 15,
          ia = 3,
          ja = 258,
          ka = ja + ia + 1,
          la = 32,
          ma = 42,
          na = 69,
          oa = 73,
          pa = 91,
          qa = 103,
          ra = 113,
          sa = 666,
          ta = 1,
          ua = 2,
          va = 3,
          wa = 4,
          xa = 3;C = [new s(0, 0, 0, 0, n), new s(4, 4, 8, 4, o), new s(4, 5, 16, 8, o), new s(4, 6, 32, 32, o), new s(4, 4, 16, 16, p), new s(8, 16, 32, 32, p), new s(8, 16, 128, 128, p), new s(8, 32, 128, 256, p), new s(32, 128, 258, 1024, p), new s(32, 258, 258, 4096, p)], c.deflateInit = z, c.deflateInit2 = y, c.deflateReset = w, c.deflateResetKeep = v, c.deflateSetHeader = x, c.deflate = A, c.deflateEnd = B, c.deflateInfo = "pako deflate (from Nodeca project)";
    }, { "../utils/common": 28, "./adler32": 30, "./crc32": 32, "./messages": 38, "./trees": 39 }], 34: [function (a, b, c) {
      "use strict";
      function d() {
        this.text = 0, this.time = 0, this.xflags = 0, this.os = 0, this.extra = null, this.extra_len = 0, this.name = "", this.comment = "", this.hcrc = 0, this.done = !1;
      }b.exports = d;
    }, {}], 35: [function (a, b, c) {
      "use strict";
      var d = 30,
          e = 12;b.exports = function (a, b) {
        var c, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z, A, B, C;c = a.state, f = a.next_in, B = a.input, g = f + (a.avail_in - 5), h = a.next_out, C = a.output, i = h - (b - a.avail_out), j = h + (a.avail_out - 257), k = c.dmax, l = c.wsize, m = c.whave, n = c.wnext, o = c.window, p = c.hold, q = c.bits, r = c.lencode, s = c.distcode, t = (1 << c.lenbits) - 1, u = (1 << c.distbits) - 1;a: do {
          15 > q && (p += B[f++] << q, q += 8, p += B[f++] << q, q += 8), v = r[p & t];b: for (;;) {
            if (w = v >>> 24, p >>>= w, q -= w, w = v >>> 16 & 255, 0 === w) C[h++] = 65535 & v;else {
              if (!(16 & w)) {
                if (0 === (64 & w)) {
                  v = r[(65535 & v) + (p & (1 << w) - 1)];continue b;
                }if (32 & w) {
                  c.mode = e;break a;
                }a.msg = "invalid literal/length code", c.mode = d;break a;
              }x = 65535 & v, w &= 15, w && (w > q && (p += B[f++] << q, q += 8), x += p & (1 << w) - 1, p >>>= w, q -= w), 15 > q && (p += B[f++] << q, q += 8, p += B[f++] << q, q += 8), v = s[p & u];c: for (;;) {
                if (w = v >>> 24, p >>>= w, q -= w, w = v >>> 16 & 255, !(16 & w)) {
                  if (0 === (64 & w)) {
                    v = s[(65535 & v) + (p & (1 << w) - 1)];continue c;
                  }a.msg = "invalid distance code", c.mode = d;break a;
                }if (y = 65535 & v, w &= 15, w > q && (p += B[f++] << q, q += 8, w > q && (p += B[f++] << q, q += 8)), y += p & (1 << w) - 1, y > k) {
                  a.msg = "invalid distance too far back", c.mode = d;break a;
                }if (p >>>= w, q -= w, w = h - i, y > w) {
                  if (w = y - w, w > m && c.sane) {
                    a.msg = "invalid distance too far back", c.mode = d;break a;
                  }if (z = 0, A = o, 0 === n) {
                    if (z += l - w, x > w) {
                      x -= w;do {
                        C[h++] = o[z++];
                      } while (--w);z = h - y, A = C;
                    }
                  } else if (w > n) {
                    if (z += l + n - w, w -= n, x > w) {
                      x -= w;do {
                        C[h++] = o[z++];
                      } while (--w);if (z = 0, x > n) {
                        w = n, x -= w;do {
                          C[h++] = o[z++];
                        } while (--w);z = h - y, A = C;
                      }
                    }
                  } else if (z += n - w, x > w) {
                    x -= w;do {
                      C[h++] = o[z++];
                    } while (--w);z = h - y, A = C;
                  }for (; x > 2;) {
                    C[h++] = A[z++], C[h++] = A[z++], C[h++] = A[z++], x -= 3;
                  }x && (C[h++] = A[z++], x > 1 && (C[h++] = A[z++]));
                } else {
                  z = h - y;do {
                    C[h++] = C[z++], C[h++] = C[z++], C[h++] = C[z++], x -= 3;
                  } while (x > 2);x && (C[h++] = C[z++], x > 1 && (C[h++] = C[z++]));
                }break;
              }
            }break;
          }
        } while (g > f && j > h);x = q >> 3, f -= x, q -= x << 3, p &= (1 << q) - 1, a.next_in = f, a.next_out = h, a.avail_in = g > f ? 5 + (g - f) : 5 - (f - g), a.avail_out = j > h ? 257 + (j - h) : 257 - (h - j), c.hold = p, c.bits = q;
      };
    }, {}], 36: [function (a, b, c) {
      "use strict";
      function d(a) {
        return (a >>> 24 & 255) + (a >>> 8 & 65280) + ((65280 & a) << 8) + ((255 & a) << 24);
      }function e() {
        this.mode = 0, this.last = !1, this.wrap = 0, this.havedict = !1, this.flags = 0, this.dmax = 0, this.check = 0, this.total = 0, this.head = null, this.wbits = 0, this.wsize = 0, this.whave = 0, this.wnext = 0, this.window = null, this.hold = 0, this.bits = 0, this.length = 0, this.offset = 0, this.extra = 0, this.lencode = null, this.distcode = null, this.lenbits = 0, this.distbits = 0, this.ncode = 0, this.nlen = 0, this.ndist = 0, this.have = 0, this.next = null, this.lens = new r.Buf16(320), this.work = new r.Buf16(288), this.lendyn = null, this.distdyn = null, this.sane = 0, this.back = 0, this.was = 0;
      }function f(a) {
        var b;return a && a.state ? (b = a.state, a.total_in = a.total_out = b.total = 0, a.msg = "", b.wrap && (a.adler = 1 & b.wrap), b.mode = K, b.last = 0, b.havedict = 0, b.dmax = 32768, b.head = null, b.hold = 0, b.bits = 0, b.lencode = b.lendyn = new r.Buf32(oa), b.distcode = b.distdyn = new r.Buf32(pa), b.sane = 1, b.back = -1, C) : F;
      }function g(a) {
        var b;return a && a.state ? (b = a.state, b.wsize = 0, b.whave = 0, b.wnext = 0, f(a)) : F;
      }function h(a, b) {
        var c, d;return a && a.state ? (d = a.state, 0 > b ? (c = 0, b = -b) : (c = (b >> 4) + 1, 48 > b && (b &= 15)), b && (8 > b || b > 15) ? F : (null !== d.window && d.wbits !== b && (d.window = null), d.wrap = c, d.wbits = b, g(a))) : F;
      }function i(a, b) {
        var c, d;return a ? (d = new e(), a.state = d, d.window = null, c = h(a, b), c !== C && (a.state = null), c) : F;
      }function j(a) {
        return i(a, ra);
      }function k(a) {
        if (sa) {
          var b;for (p = new r.Buf32(512), q = new r.Buf32(32), b = 0; 144 > b;) {
            a.lens[b++] = 8;
          }for (; 256 > b;) {
            a.lens[b++] = 9;
          }for (; 280 > b;) {
            a.lens[b++] = 7;
          }for (; 288 > b;) {
            a.lens[b++] = 8;
          }for (v(x, a.lens, 0, 288, p, 0, a.work, { bits: 9 }), b = 0; 32 > b;) {
            a.lens[b++] = 5;
          }v(y, a.lens, 0, 32, q, 0, a.work, { bits: 5 }), sa = !1;
        }a.lencode = p, a.lenbits = 9, a.distcode = q, a.distbits = 5;
      }function l(a, b, c, d) {
        var e,
            f = a.state;return null === f.window && (f.wsize = 1 << f.wbits, f.wnext = 0, f.whave = 0, f.window = new r.Buf8(f.wsize)), d >= f.wsize ? (r.arraySet(f.window, b, c - f.wsize, f.wsize, 0), f.wnext = 0, f.whave = f.wsize) : (e = f.wsize - f.wnext, e > d && (e = d), r.arraySet(f.window, b, c - d, e, f.wnext), d -= e, d ? (r.arraySet(f.window, b, c - d, d, 0), f.wnext = d, f.whave = f.wsize) : (f.wnext += e, f.wnext === f.wsize && (f.wnext = 0), f.whave < f.wsize && (f.whave += e))), 0;
      }function m(a, b) {
        var c,
            e,
            f,
            g,
            h,
            i,
            j,
            m,
            n,
            o,
            p,
            q,
            oa,
            pa,
            qa,
            ra,
            sa,
            ta,
            ua,
            va,
            wa,
            xa,
            ya,
            za,
            Aa = 0,
            Ba = new r.Buf8(4),
            Ca = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];if (!a || !a.state || !a.output || !a.input && 0 !== a.avail_in) return F;c = a.state, c.mode === V && (c.mode = W), h = a.next_out, f = a.output, j = a.avail_out, g = a.next_in, e = a.input, i = a.avail_in, m = c.hold, n = c.bits, o = i, p = j, xa = C;a: for (;;) {
          switch (c.mode) {case K:
              if (0 === c.wrap) {
                c.mode = W;break;
              }for (; 16 > n;) {
                if (0 === i) break a;i--, m += e[g++] << n, n += 8;
              }if (2 & c.wrap && 35615 === m) {
                c.check = 0, Ba[0] = 255 & m, Ba[1] = m >>> 8 & 255, c.check = t(c.check, Ba, 2, 0), m = 0, n = 0, c.mode = L;break;
              }if (c.flags = 0, c.head && (c.head.done = !1), !(1 & c.wrap) || (((255 & m) << 8) + (m >> 8)) % 31) {
                a.msg = "incorrect header check", c.mode = la;break;
              }if ((15 & m) !== J) {
                a.msg = "unknown compression method", c.mode = la;break;
              }if (m >>>= 4, n -= 4, wa = (15 & m) + 8, 0 === c.wbits) c.wbits = wa;else if (wa > c.wbits) {
                a.msg = "invalid window size", c.mode = la;break;
              }c.dmax = 1 << wa, a.adler = c.check = 1, c.mode = 512 & m ? T : V, m = 0, n = 0;break;case L:
              for (; 16 > n;) {
                if (0 === i) break a;i--, m += e[g++] << n, n += 8;
              }if (c.flags = m, (255 & c.flags) !== J) {
                a.msg = "unknown compression method", c.mode = la;break;
              }if (57344 & c.flags) {
                a.msg = "unknown header flags set", c.mode = la;break;
              }c.head && (c.head.text = m >> 8 & 1), 512 & c.flags && (Ba[0] = 255 & m, Ba[1] = m >>> 8 & 255, c.check = t(c.check, Ba, 2, 0)), m = 0, n = 0, c.mode = M;case M:
              for (; 32 > n;) {
                if (0 === i) break a;i--, m += e[g++] << n, n += 8;
              }c.head && (c.head.time = m), 512 & c.flags && (Ba[0] = 255 & m, Ba[1] = m >>> 8 & 255, Ba[2] = m >>> 16 & 255, Ba[3] = m >>> 24 & 255, c.check = t(c.check, Ba, 4, 0)), m = 0, n = 0, c.mode = N;case N:
              for (; 16 > n;) {
                if (0 === i) break a;i--, m += e[g++] << n, n += 8;
              }c.head && (c.head.xflags = 255 & m, c.head.os = m >> 8), 512 & c.flags && (Ba[0] = 255 & m, Ba[1] = m >>> 8 & 255, c.check = t(c.check, Ba, 2, 0)), m = 0, n = 0, c.mode = O;case O:
              if (1024 & c.flags) {
                for (; 16 > n;) {
                  if (0 === i) break a;i--, m += e[g++] << n, n += 8;
                }c.length = m, c.head && (c.head.extra_len = m), 512 & c.flags && (Ba[0] = 255 & m, Ba[1] = m >>> 8 & 255, c.check = t(c.check, Ba, 2, 0)), m = 0, n = 0;
              } else c.head && (c.head.extra = null);c.mode = P;case P:
              if (1024 & c.flags && (q = c.length, q > i && (q = i), q && (c.head && (wa = c.head.extra_len - c.length, c.head.extra || (c.head.extra = new Array(c.head.extra_len)), r.arraySet(c.head.extra, e, g, q, wa)), 512 & c.flags && (c.check = t(c.check, e, q, g)), i -= q, g += q, c.length -= q), c.length)) break a;c.length = 0, c.mode = Q;case Q:
              if (2048 & c.flags) {
                if (0 === i) break a;q = 0;do {
                  wa = e[g + q++], c.head && wa && c.length < 65536 && (c.head.name += String.fromCharCode(wa));
                } while (wa && i > q);if (512 & c.flags && (c.check = t(c.check, e, q, g)), i -= q, g += q, wa) break a;
              } else c.head && (c.head.name = null);c.length = 0, c.mode = R;case R:
              if (4096 & c.flags) {
                if (0 === i) break a;q = 0;do {
                  wa = e[g + q++], c.head && wa && c.length < 65536 && (c.head.comment += String.fromCharCode(wa));
                } while (wa && i > q);if (512 & c.flags && (c.check = t(c.check, e, q, g)), i -= q, g += q, wa) break a;
              } else c.head && (c.head.comment = null);c.mode = S;case S:
              if (512 & c.flags) {
                for (; 16 > n;) {
                  if (0 === i) break a;i--, m += e[g++] << n, n += 8;
                }if (m !== (65535 & c.check)) {
                  a.msg = "header crc mismatch", c.mode = la;break;
                }m = 0, n = 0;
              }c.head && (c.head.hcrc = c.flags >> 9 & 1, c.head.done = !0), a.adler = c.check = 0, c.mode = V;break;case T:
              for (; 32 > n;) {
                if (0 === i) break a;i--, m += e[g++] << n, n += 8;
              }a.adler = c.check = d(m), m = 0, n = 0, c.mode = U;case U:
              if (0 === c.havedict) return a.next_out = h, a.avail_out = j, a.next_in = g, a.avail_in = i, c.hold = m, c.bits = n, E;a.adler = c.check = 1, c.mode = V;case V:
              if (b === A || b === B) break a;case W:
              if (c.last) {
                m >>>= 7 & n, n -= 7 & n, c.mode = ia;break;
              }for (; 3 > n;) {
                if (0 === i) break a;i--, m += e[g++] << n, n += 8;
              }switch (c.last = 1 & m, m >>>= 1, n -= 1, 3 & m) {case 0:
                  c.mode = X;break;case 1:
                  if (k(c), c.mode = ba, b === B) {
                    m >>>= 2, n -= 2;break a;
                  }break;case 2:
                  c.mode = $;break;case 3:
                  a.msg = "invalid block type", c.mode = la;}m >>>= 2, n -= 2;break;case X:
              for (m >>>= 7 & n, n -= 7 & n; 32 > n;) {
                if (0 === i) break a;i--, m += e[g++] << n, n += 8;
              }if ((65535 & m) !== (m >>> 16 ^ 65535)) {
                a.msg = "invalid stored block lengths", c.mode = la;break;
              }if (c.length = 65535 & m, m = 0, n = 0, c.mode = Y, b === B) break a;case Y:
              c.mode = Z;case Z:
              if (q = c.length) {
                if (q > i && (q = i), q > j && (q = j), 0 === q) break a;r.arraySet(f, e, g, q, h), i -= q, g += q, j -= q, h += q, c.length -= q;break;
              }c.mode = V;break;case $:
              for (; 14 > n;) {
                if (0 === i) break a;i--, m += e[g++] << n, n += 8;
              }if (c.nlen = (31 & m) + 257, m >>>= 5, n -= 5, c.ndist = (31 & m) + 1, m >>>= 5, n -= 5, c.ncode = (15 & m) + 4, m >>>= 4, n -= 4, c.nlen > 286 || c.ndist > 30) {
                a.msg = "too many length or distance symbols", c.mode = la;break;
              }c.have = 0, c.mode = _;case _:
              for (; c.have < c.ncode;) {
                for (; 3 > n;) {
                  if (0 === i) break a;i--, m += e[g++] << n, n += 8;
                }c.lens[Ca[c.have++]] = 7 & m, m >>>= 3, n -= 3;
              }for (; c.have < 19;) {
                c.lens[Ca[c.have++]] = 0;
              }if (c.lencode = c.lendyn, c.lenbits = 7, ya = { bits: c.lenbits }, xa = v(w, c.lens, 0, 19, c.lencode, 0, c.work, ya), c.lenbits = ya.bits, xa) {
                a.msg = "invalid code lengths set", c.mode = la;break;
              }c.have = 0, c.mode = aa;case aa:
              for (; c.have < c.nlen + c.ndist;) {
                for (; Aa = c.lencode[m & (1 << c.lenbits) - 1], qa = Aa >>> 24, ra = Aa >>> 16 & 255, sa = 65535 & Aa, !(n >= qa);) {
                  if (0 === i) break a;i--, m += e[g++] << n, n += 8;
                }if (16 > sa) m >>>= qa, n -= qa, c.lens[c.have++] = sa;else {
                  if (16 === sa) {
                    for (za = qa + 2; za > n;) {
                      if (0 === i) break a;i--, m += e[g++] << n, n += 8;
                    }if (m >>>= qa, n -= qa, 0 === c.have) {
                      a.msg = "invalid bit length repeat", c.mode = la;break;
                    }wa = c.lens[c.have - 1], q = 3 + (3 & m), m >>>= 2, n -= 2;
                  } else if (17 === sa) {
                    for (za = qa + 3; za > n;) {
                      if (0 === i) break a;i--, m += e[g++] << n, n += 8;
                    }m >>>= qa, n -= qa, wa = 0, q = 3 + (7 & m), m >>>= 3, n -= 3;
                  } else {
                    for (za = qa + 7; za > n;) {
                      if (0 === i) break a;i--, m += e[g++] << n, n += 8;
                    }m >>>= qa, n -= qa, wa = 0, q = 11 + (127 & m), m >>>= 7, n -= 7;
                  }if (c.have + q > c.nlen + c.ndist) {
                    a.msg = "invalid bit length repeat", c.mode = la;break;
                  }for (; q--;) {
                    c.lens[c.have++] = wa;
                  }
                }
              }if (c.mode === la) break;if (0 === c.lens[256]) {
                a.msg = "invalid code -- missing end-of-block", c.mode = la;break;
              }if (c.lenbits = 9, ya = { bits: c.lenbits }, xa = v(x, c.lens, 0, c.nlen, c.lencode, 0, c.work, ya), c.lenbits = ya.bits, xa) {
                a.msg = "invalid literal/lengths set", c.mode = la;break;
              }if (c.distbits = 6, c.distcode = c.distdyn, ya = { bits: c.distbits }, xa = v(y, c.lens, c.nlen, c.ndist, c.distcode, 0, c.work, ya), c.distbits = ya.bits, xa) {
                a.msg = "invalid distances set", c.mode = la;break;
              }if (c.mode = ba, b === B) break a;case ba:
              c.mode = ca;case ca:
              if (i >= 6 && j >= 258) {
                a.next_out = h, a.avail_out = j, a.next_in = g, a.avail_in = i, c.hold = m, c.bits = n, u(a, p), h = a.next_out, f = a.output, j = a.avail_out, g = a.next_in, e = a.input, i = a.avail_in, m = c.hold, n = c.bits, c.mode === V && (c.back = -1);break;
              }for (c.back = 0; Aa = c.lencode[m & (1 << c.lenbits) - 1], qa = Aa >>> 24, ra = Aa >>> 16 & 255, sa = 65535 & Aa, !(n >= qa);) {
                if (0 === i) break a;i--, m += e[g++] << n, n += 8;
              }if (ra && 0 === (240 & ra)) {
                for (ta = qa, ua = ra, va = sa; Aa = c.lencode[va + ((m & (1 << ta + ua) - 1) >> ta)], qa = Aa >>> 24, ra = Aa >>> 16 & 255, sa = 65535 & Aa, !(n >= ta + qa);) {
                  if (0 === i) break a;i--, m += e[g++] << n, n += 8;
                }m >>>= ta, n -= ta, c.back += ta;
              }if (m >>>= qa, n -= qa, c.back += qa, c.length = sa, 0 === ra) {
                c.mode = ha;break;
              }if (32 & ra) {
                c.back = -1, c.mode = V;break;
              }if (64 & ra) {
                a.msg = "invalid literal/length code", c.mode = la;break;
              }c.extra = 15 & ra, c.mode = da;case da:
              if (c.extra) {
                for (za = c.extra; za > n;) {
                  if (0 === i) break a;i--, m += e[g++] << n, n += 8;
                }c.length += m & (1 << c.extra) - 1, m >>>= c.extra, n -= c.extra, c.back += c.extra;
              }c.was = c.length, c.mode = ea;case ea:
              for (; Aa = c.distcode[m & (1 << c.distbits) - 1], qa = Aa >>> 24, ra = Aa >>> 16 & 255, sa = 65535 & Aa, !(n >= qa);) {
                if (0 === i) break a;i--, m += e[g++] << n, n += 8;
              }if (0 === (240 & ra)) {
                for (ta = qa, ua = ra, va = sa; Aa = c.distcode[va + ((m & (1 << ta + ua) - 1) >> ta)], qa = Aa >>> 24, ra = Aa >>> 16 & 255, sa = 65535 & Aa, !(n >= ta + qa);) {
                  if (0 === i) break a;i--, m += e[g++] << n, n += 8;
                }m >>>= ta, n -= ta, c.back += ta;
              }if (m >>>= qa, n -= qa, c.back += qa, 64 & ra) {
                a.msg = "invalid distance code", c.mode = la;break;
              }c.offset = sa, c.extra = 15 & ra, c.mode = fa;case fa:
              if (c.extra) {
                for (za = c.extra; za > n;) {
                  if (0 === i) break a;i--, m += e[g++] << n, n += 8;
                }c.offset += m & (1 << c.extra) - 1, m >>>= c.extra, n -= c.extra, c.back += c.extra;
              }if (c.offset > c.dmax) {
                a.msg = "invalid distance too far back", c.mode = la;break;
              }c.mode = ga;case ga:
              if (0 === j) break a;if (q = p - j, c.offset > q) {
                if (q = c.offset - q, q > c.whave && c.sane) {
                  a.msg = "invalid distance too far back", c.mode = la;break;
                }q > c.wnext ? (q -= c.wnext, oa = c.wsize - q) : oa = c.wnext - q, q > c.length && (q = c.length), pa = c.window;
              } else pa = f, oa = h - c.offset, q = c.length;q > j && (q = j), j -= q, c.length -= q;do {
                f[h++] = pa[oa++];
              } while (--q);0 === c.length && (c.mode = ca);break;case ha:
              if (0 === j) break a;f[h++] = c.length, j--, c.mode = ca;break;case ia:
              if (c.wrap) {
                for (; 32 > n;) {
                  if (0 === i) break a;i--, m |= e[g++] << n, n += 8;
                }if (p -= j, a.total_out += p, c.total += p, p && (a.adler = c.check = c.flags ? t(c.check, f, p, h - p) : s(c.check, f, p, h - p)), p = j, (c.flags ? m : d(m)) !== c.check) {
                  a.msg = "incorrect data check", c.mode = la;break;
                }m = 0, n = 0;
              }c.mode = ja;case ja:
              if (c.wrap && c.flags) {
                for (; 32 > n;) {
                  if (0 === i) break a;i--, m += e[g++] << n, n += 8;
                }if (m !== (4294967295 & c.total)) {
                  a.msg = "incorrect length check", c.mode = la;break;
                }m = 0, n = 0;
              }c.mode = ka;case ka:
              xa = D;break a;case la:
              xa = G;break a;case ma:
              return H;case na:default:
              return F;}
        }return a.next_out = h, a.avail_out = j, a.next_in = g, a.avail_in = i, c.hold = m, c.bits = n, (c.wsize || p !== a.avail_out && c.mode < la && (c.mode < ia || b !== z)) && l(a, a.output, a.next_out, p - a.avail_out) ? (c.mode = ma, H) : (o -= a.avail_in, p -= a.avail_out, a.total_in += o, a.total_out += p, c.total += p, c.wrap && p && (a.adler = c.check = c.flags ? t(c.check, f, p, a.next_out - p) : s(c.check, f, p, a.next_out - p)), a.data_type = c.bits + (c.last ? 64 : 0) + (c.mode === V ? 128 : 0) + (c.mode === ba || c.mode === Y ? 256 : 0), (0 === o && 0 === p || b === z) && xa === C && (xa = I), xa);
      }function n(a) {
        if (!a || !a.state) return F;var b = a.state;return b.window && (b.window = null), a.state = null, C;
      }function o(a, b) {
        var c;return a && a.state ? (c = a.state, 0 === (2 & c.wrap) ? F : (c.head = b, b.done = !1, C)) : F;
      }var p,
          q,
          r = a("../utils/common"),
          s = a("./adler32"),
          t = a("./crc32"),
          u = a("./inffast"),
          v = a("./inftrees"),
          w = 0,
          x = 1,
          y = 2,
          z = 4,
          A = 5,
          B = 6,
          C = 0,
          D = 1,
          E = 2,
          F = -2,
          G = -3,
          H = -4,
          I = -5,
          J = 8,
          K = 1,
          L = 2,
          M = 3,
          N = 4,
          O = 5,
          P = 6,
          Q = 7,
          R = 8,
          S = 9,
          T = 10,
          U = 11,
          V = 12,
          W = 13,
          X = 14,
          Y = 15,
          Z = 16,
          $ = 17,
          _ = 18,
          aa = 19,
          ba = 20,
          ca = 21,
          da = 22,
          ea = 23,
          fa = 24,
          ga = 25,
          ha = 26,
          ia = 27,
          ja = 28,
          ka = 29,
          la = 30,
          ma = 31,
          na = 32,
          oa = 852,
          pa = 592,
          qa = 15,
          ra = qa,
          sa = !0;c.inflateReset = g, c.inflateReset2 = h, c.inflateResetKeep = f, c.inflateInit = j, c.inflateInit2 = i, c.inflate = m, c.inflateEnd = n, c.inflateGetHeader = o, c.inflateInfo = "pako inflate (from Nodeca project)";
    }, { "../utils/common": 28, "./adler32": 30, "./crc32": 32, "./inffast": 35, "./inftrees": 37 }], 37: [function (a, b, c) {
      "use strict";
      var d = a("../utils/common"),
          e = 15,
          f = 852,
          g = 592,
          h = 0,
          i = 1,
          j = 2,
          k = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0],
          l = [16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18, 19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78],
          m = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577, 0, 0],
          n = [16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 64, 64];b.exports = function (a, b, c, o, p, q, r, s) {
        var t,
            u,
            v,
            w,
            x,
            y,
            z,
            A,
            B,
            C = s.bits,
            D = 0,
            E = 0,
            F = 0,
            G = 0,
            H = 0,
            I = 0,
            J = 0,
            K = 0,
            L = 0,
            M = 0,
            N = null,
            O = 0,
            P = new d.Buf16(e + 1),
            Q = new d.Buf16(e + 1),
            R = null,
            S = 0;for (D = 0; e >= D; D++) {
          P[D] = 0;
        }for (E = 0; o > E; E++) {
          P[b[c + E]]++;
        }for (H = C, G = e; G >= 1 && 0 === P[G]; G--) {}if (H > G && (H = G), 0 === G) return p[q++] = 20971520, p[q++] = 20971520, s.bits = 1, 0;for (F = 1; G > F && 0 === P[F]; F++) {}for (F > H && (H = F), K = 1, D = 1; e >= D; D++) {
          if (K <<= 1, K -= P[D], 0 > K) return -1;
        }if (K > 0 && (a === h || 1 !== G)) return -1;for (Q[1] = 0, D = 1; e > D; D++) {
          Q[D + 1] = Q[D] + P[D];
        }for (E = 0; o > E; E++) {
          0 !== b[c + E] && (r[Q[b[c + E]]++] = E);
        }if (a === h ? (N = R = r, y = 19) : a === i ? (N = k, O -= 257, R = l, S -= 257, y = 256) : (N = m, R = n, y = -1), M = 0, E = 0, D = F, x = q, I = H, J = 0, v = -1, L = 1 << H, w = L - 1, a === i && L > f || a === j && L > g) return 1;for (var T = 0;;) {
          T++, z = D - J, r[E] < y ? (A = 0, B = r[E]) : r[E] > y ? (A = R[S + r[E]], B = N[O + r[E]]) : (A = 96, B = 0), t = 1 << D - J, u = 1 << I, F = u;do {
            u -= t, p[x + (M >> J) + u] = z << 24 | A << 16 | B | 0;
          } while (0 !== u);for (t = 1 << D - 1; M & t;) {
            t >>= 1;
          }if (0 !== t ? (M &= t - 1, M += t) : M = 0, E++, 0 === --P[D]) {
            if (D === G) break;D = b[c + r[E]];
          }if (D > H && (M & w) !== v) {
            for (0 === J && (J = H), x += F, I = D - J, K = 1 << I; G > I + J && (K -= P[I + J], !(0 >= K));) {
              I++, K <<= 1;
            }if (L += 1 << I, a === i && L > f || a === j && L > g) return 1;v = M & w, p[v] = H << 24 | I << 16 | x - q | 0;
          }
        }return 0 !== M && (p[x + M] = D - J << 24 | 64 << 16 | 0), s.bits = H, 0;
      };
    }, { "../utils/common": 28 }], 38: [function (a, b, c) {
      "use strict";
      b.exports = { 2: "need dictionary", 1: "stream end", 0: "", "-1": "file error", "-2": "stream error", "-3": "data error", "-4": "insufficient memory", "-5": "buffer error", "-6": "incompatible version" };
    }, {}], 39: [function (a, b, c) {
      "use strict";
      function d(a) {
        for (var b = a.length; --b >= 0;) {
          a[b] = 0;
        }
      }function e(a, b, c, d, e) {
        this.static_tree = a, this.extra_bits = b, this.extra_base = c, this.elems = d, this.max_length = e, this.has_stree = a && a.length;
      }function f(a, b) {
        this.dyn_tree = a, this.max_code = 0, this.stat_desc = b;
      }function g(a) {
        return 256 > a ? ia[a] : ia[256 + (a >>> 7)];
      }function h(a, b) {
        a.pending_buf[a.pending++] = 255 & b, a.pending_buf[a.pending++] = b >>> 8 & 255;
      }function i(a, b, c) {
        a.bi_valid > X - c ? (a.bi_buf |= b << a.bi_valid & 65535, h(a, a.bi_buf), a.bi_buf = b >> X - a.bi_valid, a.bi_valid += c - X) : (a.bi_buf |= b << a.bi_valid & 65535, a.bi_valid += c);
      }function j(a, b, c) {
        i(a, c[2 * b], c[2 * b + 1]);
      }function k(a, b) {
        var c = 0;do {
          c |= 1 & a, a >>>= 1, c <<= 1;
        } while (--b > 0);return c >>> 1;
      }function l(a) {
        16 === a.bi_valid ? (h(a, a.bi_buf), a.bi_buf = 0, a.bi_valid = 0) : a.bi_valid >= 8 && (a.pending_buf[a.pending++] = 255 & a.bi_buf, a.bi_buf >>= 8, a.bi_valid -= 8);
      }function m(a, b) {
        var c,
            d,
            e,
            f,
            g,
            h,
            i = b.dyn_tree,
            j = b.max_code,
            k = b.stat_desc.static_tree,
            l = b.stat_desc.has_stree,
            m = b.stat_desc.extra_bits,
            n = b.stat_desc.extra_base,
            o = b.stat_desc.max_length,
            p = 0;for (f = 0; W >= f; f++) {
          a.bl_count[f] = 0;
        }for (i[2 * a.heap[a.heap_max] + 1] = 0, c = a.heap_max + 1; V > c; c++) {
          d = a.heap[c], f = i[2 * i[2 * d + 1] + 1] + 1, f > o && (f = o, p++), i[2 * d + 1] = f, d > j || (a.bl_count[f]++, g = 0, d >= n && (g = m[d - n]), h = i[2 * d], a.opt_len += h * (f + g), l && (a.static_len += h * (k[2 * d + 1] + g)));
        }if (0 !== p) {
          do {
            for (f = o - 1; 0 === a.bl_count[f];) {
              f--;
            }a.bl_count[f]--, a.bl_count[f + 1] += 2, a.bl_count[o]--, p -= 2;
          } while (p > 0);for (f = o; 0 !== f; f--) {
            for (d = a.bl_count[f]; 0 !== d;) {
              e = a.heap[--c], e > j || (i[2 * e + 1] !== f && (a.opt_len += (f - i[2 * e + 1]) * i[2 * e], i[2 * e + 1] = f), d--);
            }
          }
        }
      }function n(a, b, c) {
        var d,
            e,
            f = new Array(W + 1),
            g = 0;for (d = 1; W >= d; d++) {
          f[d] = g = g + c[d - 1] << 1;
        }for (e = 0; b >= e; e++) {
          var h = a[2 * e + 1];0 !== h && (a[2 * e] = k(f[h]++, h));
        }
      }function o() {
        var a,
            b,
            c,
            d,
            f,
            g = new Array(W + 1);for (c = 0, d = 0; Q - 1 > d; d++) {
          for (ka[d] = c, a = 0; a < 1 << ba[d]; a++) {
            ja[c++] = d;
          }
        }for (ja[c - 1] = d, f = 0, d = 0; 16 > d; d++) {
          for (la[d] = f, a = 0; a < 1 << ca[d]; a++) {
            ia[f++] = d;
          }
        }for (f >>= 7; T > d; d++) {
          for (la[d] = f << 7, a = 0; a < 1 << ca[d] - 7; a++) {
            ia[256 + f++] = d;
          }
        }for (b = 0; W >= b; b++) {
          g[b] = 0;
        }for (a = 0; 143 >= a;) {
          ga[2 * a + 1] = 8, a++, g[8]++;
        }for (; 255 >= a;) {
          ga[2 * a + 1] = 9, a++, g[9]++;
        }for (; 279 >= a;) {
          ga[2 * a + 1] = 7, a++, g[7]++;
        }for (; 287 >= a;) {
          ga[2 * a + 1] = 8, a++, g[8]++;
        }for (n(ga, S + 1, g), a = 0; T > a; a++) {
          ha[2 * a + 1] = 5, ha[2 * a] = k(a, 5);
        }ma = new e(ga, ba, R + 1, S, W), na = new e(ha, ca, 0, T, W), oa = new e(new Array(0), da, 0, U, Y);
      }function p(a) {
        var b;for (b = 0; S > b; b++) {
          a.dyn_ltree[2 * b] = 0;
        }for (b = 0; T > b; b++) {
          a.dyn_dtree[2 * b] = 0;
        }for (b = 0; U > b; b++) {
          a.bl_tree[2 * b] = 0;
        }a.dyn_ltree[2 * Z] = 1, a.opt_len = a.static_len = 0, a.last_lit = a.matches = 0;
      }function q(a) {
        a.bi_valid > 8 ? h(a, a.bi_buf) : a.bi_valid > 0 && (a.pending_buf[a.pending++] = a.bi_buf), a.bi_buf = 0, a.bi_valid = 0;
      }function r(a, b, c, d) {
        q(a), d && (h(a, c), h(a, ~c)), G.arraySet(a.pending_buf, a.window, b, c, a.pending), a.pending += c;
      }function s(a, b, c, d) {
        var e = 2 * b,
            f = 2 * c;return a[e] < a[f] || a[e] === a[f] && d[b] <= d[c];
      }function t(a, b, c) {
        for (var d = a.heap[c], e = c << 1; e <= a.heap_len && (e < a.heap_len && s(b, a.heap[e + 1], a.heap[e], a.depth) && e++, !s(b, d, a.heap[e], a.depth));) {
          a.heap[c] = a.heap[e], c = e, e <<= 1;
        }a.heap[c] = d;
      }function u(a, b, c) {
        var d,
            e,
            f,
            h,
            k = 0;if (0 !== a.last_lit) do {
          d = a.pending_buf[a.d_buf + 2 * k] << 8 | a.pending_buf[a.d_buf + 2 * k + 1], e = a.pending_buf[a.l_buf + k], k++, 0 === d ? j(a, e, b) : (f = ja[e], j(a, f + R + 1, b), h = ba[f], 0 !== h && (e -= ka[f], i(a, e, h)), d--, f = g(d), j(a, f, c), h = ca[f], 0 !== h && (d -= la[f], i(a, d, h)));
        } while (k < a.last_lit);j(a, Z, b);
      }function v(a, b) {
        var c,
            d,
            e,
            f = b.dyn_tree,
            g = b.stat_desc.static_tree,
            h = b.stat_desc.has_stree,
            i = b.stat_desc.elems,
            j = -1;for (a.heap_len = 0, a.heap_max = V, c = 0; i > c; c++) {
          0 !== f[2 * c] ? (a.heap[++a.heap_len] = j = c, a.depth[c] = 0) : f[2 * c + 1] = 0;
        }for (; a.heap_len < 2;) {
          e = a.heap[++a.heap_len] = 2 > j ? ++j : 0, f[2 * e] = 1, a.depth[e] = 0, a.opt_len--, h && (a.static_len -= g[2 * e + 1]);
        }for (b.max_code = j, c = a.heap_len >> 1; c >= 1; c--) {
          t(a, f, c);
        }e = i;do {
          c = a.heap[1], a.heap[1] = a.heap[a.heap_len--], t(a, f, 1), d = a.heap[1], a.heap[--a.heap_max] = c, a.heap[--a.heap_max] = d, f[2 * e] = f[2 * c] + f[2 * d], a.depth[e] = (a.depth[c] >= a.depth[d] ? a.depth[c] : a.depth[d]) + 1, f[2 * c + 1] = f[2 * d + 1] = e, a.heap[1] = e++, t(a, f, 1);
        } while (a.heap_len >= 2);a.heap[--a.heap_max] = a.heap[1], m(a, b), n(f, j, a.bl_count);
      }function w(a, b, c) {
        var d,
            e,
            f = -1,
            g = b[1],
            h = 0,
            i = 7,
            j = 4;for (0 === g && (i = 138, j = 3), b[2 * (c + 1) + 1] = 65535, d = 0; c >= d; d++) {
          e = g, g = b[2 * (d + 1) + 1], ++h < i && e === g || (j > h ? a.bl_tree[2 * e] += h : 0 !== e ? (e !== f && a.bl_tree[2 * e]++, a.bl_tree[2 * $]++) : 10 >= h ? a.bl_tree[2 * _]++ : a.bl_tree[2 * aa]++, h = 0, f = e, 0 === g ? (i = 138, j = 3) : e === g ? (i = 6, j = 3) : (i = 7, j = 4));
        }
      }function x(a, b, c) {
        var d,
            e,
            f = -1,
            g = b[1],
            h = 0,
            k = 7,
            l = 4;for (0 === g && (k = 138, l = 3), d = 0; c >= d; d++) {
          if (e = g, g = b[2 * (d + 1) + 1], !(++h < k && e === g)) {
            if (l > h) {
              do {
                j(a, e, a.bl_tree);
              } while (0 !== --h);
            } else 0 !== e ? (e !== f && (j(a, e, a.bl_tree), h--), j(a, $, a.bl_tree), i(a, h - 3, 2)) : 10 >= h ? (j(a, _, a.bl_tree), i(a, h - 3, 3)) : (j(a, aa, a.bl_tree), i(a, h - 11, 7));h = 0, f = e, 0 === g ? (k = 138, l = 3) : e === g ? (k = 6, l = 3) : (k = 7, l = 4);
          }
        }
      }function y(a) {
        var b;for (w(a, a.dyn_ltree, a.l_desc.max_code), w(a, a.dyn_dtree, a.d_desc.max_code), v(a, a.bl_desc), b = U - 1; b >= 3 && 0 === a.bl_tree[2 * ea[b] + 1]; b--) {}return a.opt_len += 3 * (b + 1) + 5 + 5 + 4, b;
      }function z(a, b, c, d) {
        var e;for (i(a, b - 257, 5), i(a, c - 1, 5), i(a, d - 4, 4), e = 0; d > e; e++) {
          i(a, a.bl_tree[2 * ea[e] + 1], 3);
        }x(a, a.dyn_ltree, b - 1), x(a, a.dyn_dtree, c - 1);
      }function A(a) {
        var b,
            c = 4093624447;for (b = 0; 31 >= b; b++, c >>>= 1) {
          if (1 & c && 0 !== a.dyn_ltree[2 * b]) return I;
        }if (0 !== a.dyn_ltree[18] || 0 !== a.dyn_ltree[20] || 0 !== a.dyn_ltree[26]) return J;for (b = 32; R > b; b++) {
          if (0 !== a.dyn_ltree[2 * b]) return J;
        }return I;
      }function B(a) {
        pa || (o(), pa = !0), a.l_desc = new f(a.dyn_ltree, ma), a.d_desc = new f(a.dyn_dtree, na), a.bl_desc = new f(a.bl_tree, oa), a.bi_buf = 0, a.bi_valid = 0, p(a);
      }function C(a, b, c, d) {
        i(a, (L << 1) + (d ? 1 : 0), 3), r(a, b, c, !0);
      }function D(a) {
        i(a, M << 1, 3), j(a, Z, ga), l(a);
      }function E(a, b, c, d) {
        var e,
            f,
            g = 0;a.level > 0 ? (a.strm.data_type === K && (a.strm.data_type = A(a)), v(a, a.l_desc), v(a, a.d_desc), g = y(a), e = a.opt_len + 3 + 7 >>> 3, f = a.static_len + 3 + 7 >>> 3, e >= f && (e = f)) : e = f = c + 5, e >= c + 4 && -1 !== b ? C(a, b, c, d) : a.strategy === H || f === e ? (i(a, (M << 1) + (d ? 1 : 0), 3), u(a, ga, ha)) : (i(a, (N << 1) + (d ? 1 : 0), 3), z(a, a.l_desc.max_code + 1, a.d_desc.max_code + 1, g + 1), u(a, a.dyn_ltree, a.dyn_dtree)), p(a), d && q(a);
      }function F(a, b, c) {
        return a.pending_buf[a.d_buf + 2 * a.last_lit] = b >>> 8 & 255, a.pending_buf[a.d_buf + 2 * a.last_lit + 1] = 255 & b, a.pending_buf[a.l_buf + a.last_lit] = 255 & c, a.last_lit++, 0 === b ? a.dyn_ltree[2 * c]++ : (a.matches++, b--, a.dyn_ltree[2 * (ja[c] + R + 1)]++, a.dyn_dtree[2 * g(b)]++), a.last_lit === a.lit_bufsize - 1;
      }var G = a("../utils/common"),
          H = 4,
          I = 0,
          J = 1,
          K = 2,
          L = 0,
          M = 1,
          N = 2,
          O = 3,
          P = 258,
          Q = 29,
          R = 256,
          S = R + 1 + Q,
          T = 30,
          U = 19,
          V = 2 * S + 1,
          W = 15,
          X = 16,
          Y = 7,
          Z = 256,
          $ = 16,
          _ = 17,
          aa = 18,
          ba = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0],
          ca = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13],
          da = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7],
          ea = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15],
          fa = 512,
          ga = new Array(2 * (S + 2));d(ga);var ha = new Array(2 * T);d(ha);var ia = new Array(fa);d(ia);var ja = new Array(P - O + 1);d(ja);var ka = new Array(Q);d(ka);var la = new Array(T);d(la);var ma,
          na,
          oa,
          pa = !1;c._tr_init = B, c._tr_stored_block = C, c._tr_flush_block = E, c._tr_tally = F, c._tr_align = D;
    }, { "../utils/common": 28 }], 40: [function (a, b, c) {
      "use strict";
      function d() {
        this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
      }b.exports = d;
    }, {}] }, {}, [10])(10);
});
//# sourceMappingURL=jszip.min.js.map

"use strict";var _typeof=typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"?function(obj){return typeof obj;}:function(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj;};/** 
 * Kendo UI v2016.2.714 (http://www.telerik.com/kendo-ui)                                                                                                                                               
 * Copyright 2016 Telerik AD. All rights reserved.                                                                                                                                                      
 *                                                                                                                                                                                                      
 * Kendo UI commercial licenses may be obtained at                                                                                                                                                      
 * http://www.telerik.com/purchase/license-agreement/kendo-ui-complete                                                                                                                                  
 * If you do not own a commercial license, this file shall be governed by the trial license terms.                                                                                                      
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       
                                                                                                                                                                                                       

//# sourceMappingURL=kendo.all.min.js.map

"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/* pako 1.0.1 nodeca/pako */
!function (t) {
  if ("object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) && "undefined" != typeof module) module.exports = t();else if ("function" == typeof define && define.amd) define([], t);else {
    var e;e = "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this, e.pako = t();
  }
}(function () {
  return function t(e, a, n) {
    function r(s, h) {
      if (!a[s]) {
        if (!e[s]) {
          var l = "function" == typeof require && require;if (!h && l) return l(s, !0);if (i) return i(s, !0);var o = new Error("Cannot find module '" + s + "'");throw o.code = "MODULE_NOT_FOUND", o;
        }var _ = a[s] = { exports: {} };e[s][0].call(_.exports, function (t) {
          var a = e[s][1][t];return r(a ? a : t);
        }, _, _.exports, t, e, a, n);
      }return a[s].exports;
    }for (var i = "function" == typeof require && require, s = 0; s < n.length; s++) {
      r(n[s]);
    }return r;
  }({ 1: [function (t, e, a) {
      "use strict";
      var n = "undefined" != typeof Uint8Array && "undefined" != typeof Uint16Array && "undefined" != typeof Int32Array;a.assign = function (t) {
        for (var e = Array.prototype.slice.call(arguments, 1); e.length;) {
          var a = e.shift();if (a) {
            if ("object" != (typeof a === "undefined" ? "undefined" : _typeof(a))) throw new TypeError(a + "must be non-object");for (var n in a) {
              a.hasOwnProperty(n) && (t[n] = a[n]);
            }
          }
        }return t;
      }, a.shrinkBuf = function (t, e) {
        return t.length === e ? t : t.subarray ? t.subarray(0, e) : (t.length = e, t);
      };var r = { arraySet: function arraySet(t, e, a, n, r) {
          if (e.subarray && t.subarray) return void t.set(e.subarray(a, a + n), r);for (var i = 0; n > i; i++) {
            t[r + i] = e[a + i];
          }
        }, flattenChunks: function flattenChunks(t) {
          var e, a, n, r, i, s;for (n = 0, e = 0, a = t.length; a > e; e++) {
            n += t[e].length;
          }for (s = new Uint8Array(n), r = 0, e = 0, a = t.length; a > e; e++) {
            i = t[e], s.set(i, r), r += i.length;
          }return s;
        } },
          i = { arraySet: function arraySet(t, e, a, n, r) {
          for (var i = 0; n > i; i++) {
            t[r + i] = e[a + i];
          }
        }, flattenChunks: function flattenChunks(t) {
          return [].concat.apply([], t);
        } };a.setTyped = function (t) {
        t ? (a.Buf8 = Uint8Array, a.Buf16 = Uint16Array, a.Buf32 = Int32Array, a.assign(a, r)) : (a.Buf8 = Array, a.Buf16 = Array, a.Buf32 = Array, a.assign(a, i));
      }, a.setTyped(n);
    }, {}], 2: [function (t, e, a) {
      "use strict";
      function n(t, e) {
        if (65537 > e && (t.subarray && s || !t.subarray && i)) return String.fromCharCode.apply(null, r.shrinkBuf(t, e));for (var a = "", n = 0; e > n; n++) {
          a += String.fromCharCode(t[n]);
        }return a;
      }var r = t("./common"),
          i = !0,
          s = !0;try {
        String.fromCharCode.apply(null, [0]);
      } catch (h) {
        i = !1;
      }try {
        String.fromCharCode.apply(null, new Uint8Array(1));
      } catch (h) {
        s = !1;
      }for (var l = new r.Buf8(256), o = 0; 256 > o; o++) {
        l[o] = o >= 252 ? 6 : o >= 248 ? 5 : o >= 240 ? 4 : o >= 224 ? 3 : o >= 192 ? 2 : 1;
      }l[254] = l[254] = 1, a.string2buf = function (t) {
        var e,
            a,
            n,
            i,
            s,
            h = t.length,
            l = 0;for (i = 0; h > i; i++) {
          a = t.charCodeAt(i), 55296 === (64512 & a) && h > i + 1 && (n = t.charCodeAt(i + 1), 56320 === (64512 & n) && (a = 65536 + (a - 55296 << 10) + (n - 56320), i++)), l += 128 > a ? 1 : 2048 > a ? 2 : 65536 > a ? 3 : 4;
        }for (e = new r.Buf8(l), s = 0, i = 0; l > s; i++) {
          a = t.charCodeAt(i), 55296 === (64512 & a) && h > i + 1 && (n = t.charCodeAt(i + 1), 56320 === (64512 & n) && (a = 65536 + (a - 55296 << 10) + (n - 56320), i++)), 128 > a ? e[s++] = a : 2048 > a ? (e[s++] = 192 | a >>> 6, e[s++] = 128 | 63 & a) : 65536 > a ? (e[s++] = 224 | a >>> 12, e[s++] = 128 | a >>> 6 & 63, e[s++] = 128 | 63 & a) : (e[s++] = 240 | a >>> 18, e[s++] = 128 | a >>> 12 & 63, e[s++] = 128 | a >>> 6 & 63, e[s++] = 128 | 63 & a);
        }return e;
      }, a.buf2binstring = function (t) {
        return n(t, t.length);
      }, a.binstring2buf = function (t) {
        for (var e = new r.Buf8(t.length), a = 0, n = e.length; n > a; a++) {
          e[a] = t.charCodeAt(a);
        }return e;
      }, a.buf2string = function (t, e) {
        var a,
            r,
            i,
            s,
            h = e || t.length,
            o = new Array(2 * h);for (r = 0, a = 0; h > a;) {
          if (i = t[a++], 128 > i) o[r++] = i;else if (s = l[i], s > 4) o[r++] = 65533, a += s - 1;else {
            for (i &= 2 === s ? 31 : 3 === s ? 15 : 7; s > 1 && h > a;) {
              i = i << 6 | 63 & t[a++], s--;
            }s > 1 ? o[r++] = 65533 : 65536 > i ? o[r++] = i : (i -= 65536, o[r++] = 55296 | i >> 10 & 1023, o[r++] = 56320 | 1023 & i);
          }
        }return n(o, r);
      }, a.utf8border = function (t, e) {
        var a;for (e = e || t.length, e > t.length && (e = t.length), a = e - 1; a >= 0 && 128 === (192 & t[a]);) {
          a--;
        }return 0 > a ? e : 0 === a ? e : a + l[t[a]] > e ? a : e;
      };
    }, { "./common": 1 }], 3: [function (t, e, a) {
      "use strict";
      function n(t, e, a, n) {
        for (var r = 65535 & t | 0, i = t >>> 16 & 65535 | 0, s = 0; 0 !== a;) {
          s = a > 2e3 ? 2e3 : a, a -= s;do {
            r = r + e[n++] | 0, i = i + r | 0;
          } while (--s);r %= 65521, i %= 65521;
        }return r | i << 16 | 0;
      }e.exports = n;
    }, {}], 4: [function (t, e, a) {
      "use strict";
      function n() {
        for (var t, e = [], a = 0; 256 > a; a++) {
          t = a;for (var n = 0; 8 > n; n++) {
            t = 1 & t ? 3988292384 ^ t >>> 1 : t >>> 1;
          }e[a] = t;
        }return e;
      }function r(t, e, a, n) {
        var r = i,
            s = n + a;t ^= -1;for (var h = n; s > h; h++) {
          t = t >>> 8 ^ r[255 & (t ^ e[h])];
        }return -1 ^ t;
      }var i = n();e.exports = r;
    }, {}], 5: [function (t, e, a) {
      "use strict";
      function n(t, e) {
        return t.msg = O[e], e;
      }function r(t) {
        return (t << 1) - (t > 4 ? 9 : 0);
      }function i(t) {
        for (var e = t.length; --e >= 0;) {
          t[e] = 0;
        }
      }function s(t) {
        var e = t.state,
            a = e.pending;a > t.avail_out && (a = t.avail_out), 0 !== a && (j.arraySet(t.output, e.pending_buf, e.pending_out, a, t.next_out), t.next_out += a, e.pending_out += a, t.total_out += a, t.avail_out -= a, e.pending -= a, 0 === e.pending && (e.pending_out = 0));
      }function h(t, e) {
        U._tr_flush_block(t, t.block_start >= 0 ? t.block_start : -1, t.strstart - t.block_start, e), t.block_start = t.strstart, s(t.strm);
      }function l(t, e) {
        t.pending_buf[t.pending++] = e;
      }function o(t, e) {
        t.pending_buf[t.pending++] = e >>> 8 & 255, t.pending_buf[t.pending++] = 255 & e;
      }function _(t, e, a, n) {
        var r = t.avail_in;return r > n && (r = n), 0 === r ? 0 : (t.avail_in -= r, j.arraySet(e, t.input, t.next_in, r, a), 1 === t.state.wrap ? t.adler = D(t.adler, e, r, a) : 2 === t.state.wrap && (t.adler = I(t.adler, e, r, a)), t.next_in += r, t.total_in += r, r);
      }function d(t, e) {
        var a,
            n,
            r = t.max_chain_length,
            i = t.strstart,
            s = t.prev_length,
            h = t.nice_match,
            l = t.strstart > t.w_size - dt ? t.strstart - (t.w_size - dt) : 0,
            o = t.window,
            _ = t.w_mask,
            d = t.prev,
            u = t.strstart + _t,
            f = o[i + s - 1],
            c = o[i + s];t.prev_length >= t.good_match && (r >>= 2), h > t.lookahead && (h = t.lookahead);do {
          if (a = e, o[a + s] === c && o[a + s - 1] === f && o[a] === o[i] && o[++a] === o[i + 1]) {
            i += 2, a++;do {} while (o[++i] === o[++a] && o[++i] === o[++a] && o[++i] === o[++a] && o[++i] === o[++a] && o[++i] === o[++a] && o[++i] === o[++a] && o[++i] === o[++a] && o[++i] === o[++a] && u > i);if (n = _t - (u - i), i = u - _t, n > s) {
              if (t.match_start = e, s = n, n >= h) break;f = o[i + s - 1], c = o[i + s];
            }
          }
        } while ((e = d[e & _]) > l && 0 !== --r);return s <= t.lookahead ? s : t.lookahead;
      }function u(t) {
        var e,
            a,
            n,
            r,
            i,
            s = t.w_size;do {
          if (r = t.window_size - t.lookahead - t.strstart, t.strstart >= s + (s - dt)) {
            j.arraySet(t.window, t.window, s, s, 0), t.match_start -= s, t.strstart -= s, t.block_start -= s, a = t.hash_size, e = a;do {
              n = t.head[--e], t.head[e] = n >= s ? n - s : 0;
            } while (--a);a = s, e = a;do {
              n = t.prev[--e], t.prev[e] = n >= s ? n - s : 0;
            } while (--a);r += s;
          }if (0 === t.strm.avail_in) break;if (a = _(t.strm, t.window, t.strstart + t.lookahead, r), t.lookahead += a, t.lookahead + t.insert >= ot) for (i = t.strstart - t.insert, t.ins_h = t.window[i], t.ins_h = (t.ins_h << t.hash_shift ^ t.window[i + 1]) & t.hash_mask; t.insert && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[i + ot - 1]) & t.hash_mask, t.prev[i & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = i, i++, t.insert--, !(t.lookahead + t.insert < ot));) {}
        } while (t.lookahead < dt && 0 !== t.strm.avail_in);
      }function f(t, e) {
        var a = 65535;for (a > t.pending_buf_size - 5 && (a = t.pending_buf_size - 5);;) {
          if (t.lookahead <= 1) {
            if (u(t), 0 === t.lookahead && e === q) return vt;if (0 === t.lookahead) break;
          }t.strstart += t.lookahead, t.lookahead = 0;var n = t.block_start + a;if ((0 === t.strstart || t.strstart >= n) && (t.lookahead = t.strstart - n, t.strstart = n, h(t, !1), 0 === t.strm.avail_out)) return vt;if (t.strstart - t.block_start >= t.w_size - dt && (h(t, !1), 0 === t.strm.avail_out)) return vt;
        }return t.insert = 0, e === N ? (h(t, !0), 0 === t.strm.avail_out ? kt : zt) : t.strstart > t.block_start && (h(t, !1), 0 === t.strm.avail_out) ? vt : vt;
      }function c(t, e) {
        for (var a, n;;) {
          if (t.lookahead < dt) {
            if (u(t), t.lookahead < dt && e === q) return vt;if (0 === t.lookahead) break;
          }if (a = 0, t.lookahead >= ot && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + ot - 1]) & t.hash_mask, a = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart), 0 !== a && t.strstart - a <= t.w_size - dt && (t.match_length = d(t, a)), t.match_length >= ot) {
            if (n = U._tr_tally(t, t.strstart - t.match_start, t.match_length - ot), t.lookahead -= t.match_length, t.match_length <= t.max_lazy_match && t.lookahead >= ot) {
              t.match_length--;do {
                t.strstart++, t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + ot - 1]) & t.hash_mask, a = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart;
              } while (0 !== --t.match_length);t.strstart++;
            } else t.strstart += t.match_length, t.match_length = 0, t.ins_h = t.window[t.strstart], t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + 1]) & t.hash_mask;
          } else n = U._tr_tally(t, 0, t.window[t.strstart]), t.lookahead--, t.strstart++;if (n && (h(t, !1), 0 === t.strm.avail_out)) return vt;
        }return t.insert = t.strstart < ot - 1 ? t.strstart : ot - 1, e === N ? (h(t, !0), 0 === t.strm.avail_out ? kt : zt) : t.last_lit && (h(t, !1), 0 === t.strm.avail_out) ? vt : yt;
      }function p(t, e) {
        for (var a, n, r;;) {
          if (t.lookahead < dt) {
            if (u(t), t.lookahead < dt && e === q) return vt;if (0 === t.lookahead) break;
          }if (a = 0, t.lookahead >= ot && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + ot - 1]) & t.hash_mask, a = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart), t.prev_length = t.match_length, t.prev_match = t.match_start, t.match_length = ot - 1, 0 !== a && t.prev_length < t.max_lazy_match && t.strstart - a <= t.w_size - dt && (t.match_length = d(t, a), t.match_length <= 5 && (t.strategy === J || t.match_length === ot && t.strstart - t.match_start > 4096) && (t.match_length = ot - 1)), t.prev_length >= ot && t.match_length <= t.prev_length) {
            r = t.strstart + t.lookahead - ot, n = U._tr_tally(t, t.strstart - 1 - t.prev_match, t.prev_length - ot), t.lookahead -= t.prev_length - 1, t.prev_length -= 2;do {
              ++t.strstart <= r && (t.ins_h = (t.ins_h << t.hash_shift ^ t.window[t.strstart + ot - 1]) & t.hash_mask, a = t.prev[t.strstart & t.w_mask] = t.head[t.ins_h], t.head[t.ins_h] = t.strstart);
            } while (0 !== --t.prev_length);if (t.match_available = 0, t.match_length = ot - 1, t.strstart++, n && (h(t, !1), 0 === t.strm.avail_out)) return vt;
          } else if (t.match_available) {
            if (n = U._tr_tally(t, 0, t.window[t.strstart - 1]), n && h(t, !1), t.strstart++, t.lookahead--, 0 === t.strm.avail_out) return vt;
          } else t.match_available = 1, t.strstart++, t.lookahead--;
        }return t.match_available && (n = U._tr_tally(t, 0, t.window[t.strstart - 1]), t.match_available = 0), t.insert = t.strstart < ot - 1 ? t.strstart : ot - 1, e === N ? (h(t, !0), 0 === t.strm.avail_out ? kt : zt) : t.last_lit && (h(t, !1), 0 === t.strm.avail_out) ? vt : yt;
      }function g(t, e) {
        for (var a, n, r, i, s = t.window;;) {
          if (t.lookahead <= _t) {
            if (u(t), t.lookahead <= _t && e === q) return vt;if (0 === t.lookahead) break;
          }if (t.match_length = 0, t.lookahead >= ot && t.strstart > 0 && (r = t.strstart - 1, n = s[r], n === s[++r] && n === s[++r] && n === s[++r])) {
            i = t.strstart + _t;do {} while (n === s[++r] && n === s[++r] && n === s[++r] && n === s[++r] && n === s[++r] && n === s[++r] && n === s[++r] && n === s[++r] && i > r);t.match_length = _t - (i - r), t.match_length > t.lookahead && (t.match_length = t.lookahead);
          }if (t.match_length >= ot ? (a = U._tr_tally(t, 1, t.match_length - ot), t.lookahead -= t.match_length, t.strstart += t.match_length, t.match_length = 0) : (a = U._tr_tally(t, 0, t.window[t.strstart]), t.lookahead--, t.strstart++), a && (h(t, !1), 0 === t.strm.avail_out)) return vt;
        }return t.insert = 0, e === N ? (h(t, !0), 0 === t.strm.avail_out ? kt : zt) : t.last_lit && (h(t, !1), 0 === t.strm.avail_out) ? vt : yt;
      }function m(t, e) {
        for (var a;;) {
          if (0 === t.lookahead && (u(t), 0 === t.lookahead)) {
            if (e === q) return vt;break;
          }if (t.match_length = 0, a = U._tr_tally(t, 0, t.window[t.strstart]), t.lookahead--, t.strstart++, a && (h(t, !1), 0 === t.strm.avail_out)) return vt;
        }return t.insert = 0, e === N ? (h(t, !0), 0 === t.strm.avail_out ? kt : zt) : t.last_lit && (h(t, !1), 0 === t.strm.avail_out) ? vt : yt;
      }function b(t, e, a, n, r) {
        this.good_length = t, this.max_lazy = e, this.nice_length = a, this.max_chain = n, this.func = r;
      }function w(t) {
        t.window_size = 2 * t.w_size, i(t.head), t.max_lazy_match = E[t.level].max_lazy, t.good_match = E[t.level].good_length, t.nice_match = E[t.level].nice_length, t.max_chain_length = E[t.level].max_chain, t.strstart = 0, t.block_start = 0, t.lookahead = 0, t.insert = 0, t.match_length = t.prev_length = ot - 1, t.match_available = 0, t.ins_h = 0;
      }function v() {
        this.strm = null, this.status = 0, this.pending_buf = null, this.pending_buf_size = 0, this.pending_out = 0, this.pending = 0, this.wrap = 0, this.gzhead = null, this.gzindex = 0, this.method = Z, this.last_flush = -1, this.w_size = 0, this.w_bits = 0, this.w_mask = 0, this.window = null, this.window_size = 0, this.prev = null, this.head = null, this.ins_h = 0, this.hash_size = 0, this.hash_bits = 0, this.hash_mask = 0, this.hash_shift = 0, this.block_start = 0, this.match_length = 0, this.prev_match = 0, this.match_available = 0, this.strstart = 0, this.match_start = 0, this.lookahead = 0, this.prev_length = 0, this.max_chain_length = 0, this.max_lazy_match = 0, this.level = 0, this.strategy = 0, this.good_match = 0, this.nice_match = 0, this.dyn_ltree = new j.Buf16(2 * ht), this.dyn_dtree = new j.Buf16(2 * (2 * it + 1)), this.bl_tree = new j.Buf16(2 * (2 * st + 1)), i(this.dyn_ltree), i(this.dyn_dtree), i(this.bl_tree), this.l_desc = null, this.d_desc = null, this.bl_desc = null, this.bl_count = new j.Buf16(lt + 1), this.heap = new j.Buf16(2 * rt + 1), i(this.heap), this.heap_len = 0, this.heap_max = 0, this.depth = new j.Buf16(2 * rt + 1), i(this.depth), this.l_buf = 0, this.lit_bufsize = 0, this.last_lit = 0, this.d_buf = 0, this.opt_len = 0, this.static_len = 0, this.matches = 0, this.insert = 0, this.bi_buf = 0, this.bi_valid = 0;
      }function y(t) {
        var e;return t && t.state ? (t.total_in = t.total_out = 0, t.data_type = Y, e = t.state, e.pending = 0, e.pending_out = 0, e.wrap < 0 && (e.wrap = -e.wrap), e.status = e.wrap ? ft : bt, t.adler = 2 === e.wrap ? 0 : 1, e.last_flush = q, U._tr_init(e), H) : n(t, K);
      }function k(t) {
        var e = y(t);return e === H && w(t.state), e;
      }function z(t, e) {
        return t && t.state ? 2 !== t.state.wrap ? K : (t.state.gzhead = e, H) : K;
      }function x(t, e, a, r, i, s) {
        if (!t) return K;var h = 1;if (e === G && (e = 6), 0 > r ? (h = 0, r = -r) : r > 15 && (h = 2, r -= 16), 1 > i || i > $ || a !== Z || 8 > r || r > 15 || 0 > e || e > 9 || 0 > s || s > W) return n(t, K);8 === r && (r = 9);var l = new v();return t.state = l, l.strm = t, l.wrap = h, l.gzhead = null, l.w_bits = r, l.w_size = 1 << l.w_bits, l.w_mask = l.w_size - 1, l.hash_bits = i + 7, l.hash_size = 1 << l.hash_bits, l.hash_mask = l.hash_size - 1, l.hash_shift = ~~((l.hash_bits + ot - 1) / ot), l.window = new j.Buf8(2 * l.w_size), l.head = new j.Buf16(l.hash_size), l.prev = new j.Buf16(l.w_size), l.lit_bufsize = 1 << i + 6, l.pending_buf_size = 4 * l.lit_bufsize, l.pending_buf = new j.Buf8(l.pending_buf_size), l.d_buf = l.lit_bufsize >> 1, l.l_buf = 3 * l.lit_bufsize, l.level = e, l.strategy = s, l.method = a, k(t);
      }function B(t, e) {
        return x(t, e, Z, tt, et, X);
      }function A(t, e) {
        var a, h, _, d;if (!t || !t.state || e > R || 0 > e) return t ? n(t, K) : K;if (h = t.state, !t.output || !t.input && 0 !== t.avail_in || h.status === wt && e !== N) return n(t, 0 === t.avail_out ? P : K);if (h.strm = t, a = h.last_flush, h.last_flush = e, h.status === ft) if (2 === h.wrap) t.adler = 0, l(h, 31), l(h, 139), l(h, 8), h.gzhead ? (l(h, (h.gzhead.text ? 1 : 0) + (h.gzhead.hcrc ? 2 : 0) + (h.gzhead.extra ? 4 : 0) + (h.gzhead.name ? 8 : 0) + (h.gzhead.comment ? 16 : 0)), l(h, 255 & h.gzhead.time), l(h, h.gzhead.time >> 8 & 255), l(h, h.gzhead.time >> 16 & 255), l(h, h.gzhead.time >> 24 & 255), l(h, 9 === h.level ? 2 : h.strategy >= Q || h.level < 2 ? 4 : 0), l(h, 255 & h.gzhead.os), h.gzhead.extra && h.gzhead.extra.length && (l(h, 255 & h.gzhead.extra.length), l(h, h.gzhead.extra.length >> 8 & 255)), h.gzhead.hcrc && (t.adler = I(t.adler, h.pending_buf, h.pending, 0)), h.gzindex = 0, h.status = ct) : (l(h, 0), l(h, 0), l(h, 0), l(h, 0), l(h, 0), l(h, 9 === h.level ? 2 : h.strategy >= Q || h.level < 2 ? 4 : 0), l(h, xt), h.status = bt);else {
          var u = Z + (h.w_bits - 8 << 4) << 8,
              f = -1;f = h.strategy >= Q || h.level < 2 ? 0 : h.level < 6 ? 1 : 6 === h.level ? 2 : 3, u |= f << 6, 0 !== h.strstart && (u |= ut), u += 31 - u % 31, h.status = bt, o(h, u), 0 !== h.strstart && (o(h, t.adler >>> 16), o(h, 65535 & t.adler)), t.adler = 1;
        }if (h.status === ct) if (h.gzhead.extra) {
          for (_ = h.pending; h.gzindex < (65535 & h.gzhead.extra.length) && (h.pending !== h.pending_buf_size || (h.gzhead.hcrc && h.pending > _ && (t.adler = I(t.adler, h.pending_buf, h.pending - _, _)), s(t), _ = h.pending, h.pending !== h.pending_buf_size));) {
            l(h, 255 & h.gzhead.extra[h.gzindex]), h.gzindex++;
          }h.gzhead.hcrc && h.pending > _ && (t.adler = I(t.adler, h.pending_buf, h.pending - _, _)), h.gzindex === h.gzhead.extra.length && (h.gzindex = 0, h.status = pt);
        } else h.status = pt;if (h.status === pt) if (h.gzhead.name) {
          _ = h.pending;do {
            if (h.pending === h.pending_buf_size && (h.gzhead.hcrc && h.pending > _ && (t.adler = I(t.adler, h.pending_buf, h.pending - _, _)), s(t), _ = h.pending, h.pending === h.pending_buf_size)) {
              d = 1;break;
            }d = h.gzindex < h.gzhead.name.length ? 255 & h.gzhead.name.charCodeAt(h.gzindex++) : 0, l(h, d);
          } while (0 !== d);h.gzhead.hcrc && h.pending > _ && (t.adler = I(t.adler, h.pending_buf, h.pending - _, _)), 0 === d && (h.gzindex = 0, h.status = gt);
        } else h.status = gt;if (h.status === gt) if (h.gzhead.comment) {
          _ = h.pending;do {
            if (h.pending === h.pending_buf_size && (h.gzhead.hcrc && h.pending > _ && (t.adler = I(t.adler, h.pending_buf, h.pending - _, _)), s(t), _ = h.pending, h.pending === h.pending_buf_size)) {
              d = 1;break;
            }d = h.gzindex < h.gzhead.comment.length ? 255 & h.gzhead.comment.charCodeAt(h.gzindex++) : 0, l(h, d);
          } while (0 !== d);h.gzhead.hcrc && h.pending > _ && (t.adler = I(t.adler, h.pending_buf, h.pending - _, _)), 0 === d && (h.status = mt);
        } else h.status = mt;if (h.status === mt && (h.gzhead.hcrc ? (h.pending + 2 > h.pending_buf_size && s(t), h.pending + 2 <= h.pending_buf_size && (l(h, 255 & t.adler), l(h, t.adler >> 8 & 255), t.adler = 0, h.status = bt)) : h.status = bt), 0 !== h.pending) {
          if (s(t), 0 === t.avail_out) return h.last_flush = -1, H;
        } else if (0 === t.avail_in && r(e) <= r(a) && e !== N) return n(t, P);if (h.status === wt && 0 !== t.avail_in) return n(t, P);if (0 !== t.avail_in || 0 !== h.lookahead || e !== q && h.status !== wt) {
          var c = h.strategy === Q ? m(h, e) : h.strategy === V ? g(h, e) : E[h.level].func(h, e);if (c !== kt && c !== zt || (h.status = wt), c === vt || c === kt) return 0 === t.avail_out && (h.last_flush = -1), H;if (c === yt && (e === T ? U._tr_align(h) : e !== R && (U._tr_stored_block(h, 0, 0, !1), e === L && (i(h.head), 0 === h.lookahead && (h.strstart = 0, h.block_start = 0, h.insert = 0))), s(t), 0 === t.avail_out)) return h.last_flush = -1, H;
        }return e !== N ? H : h.wrap <= 0 ? F : (2 === h.wrap ? (l(h, 255 & t.adler), l(h, t.adler >> 8 & 255), l(h, t.adler >> 16 & 255), l(h, t.adler >> 24 & 255), l(h, 255 & t.total_in), l(h, t.total_in >> 8 & 255), l(h, t.total_in >> 16 & 255), l(h, t.total_in >> 24 & 255)) : (o(h, t.adler >>> 16), o(h, 65535 & t.adler)), s(t), h.wrap > 0 && (h.wrap = -h.wrap), 0 !== h.pending ? H : F);
      }function C(t) {
        var e;return t && t.state ? (e = t.state.status, e !== ft && e !== ct && e !== pt && e !== gt && e !== mt && e !== bt && e !== wt ? n(t, K) : (t.state = null, e === bt ? n(t, M) : H)) : K;
      }function S(t, e) {
        var a,
            n,
            r,
            s,
            h,
            l,
            o,
            _,
            d = e.length;if (!t || !t.state) return K;if (a = t.state, s = a.wrap, 2 === s || 1 === s && a.status !== ft || a.lookahead) return K;for (1 === s && (t.adler = D(t.adler, e, d, 0)), a.wrap = 0, d >= a.w_size && (0 === s && (i(a.head), a.strstart = 0, a.block_start = 0, a.insert = 0), _ = new j.Buf8(a.w_size), j.arraySet(_, e, d - a.w_size, a.w_size, 0), e = _, d = a.w_size), h = t.avail_in, l = t.next_in, o = t.input, t.avail_in = d, t.next_in = 0, t.input = e, u(a); a.lookahead >= ot;) {
          n = a.strstart, r = a.lookahead - (ot - 1);do {
            a.ins_h = (a.ins_h << a.hash_shift ^ a.window[n + ot - 1]) & a.hash_mask, a.prev[n & a.w_mask] = a.head[a.ins_h], a.head[a.ins_h] = n, n++;
          } while (--r);a.strstart = n, a.lookahead = ot - 1, u(a);
        }return a.strstart += a.lookahead, a.block_start = a.strstart, a.insert = a.lookahead, a.lookahead = 0, a.match_length = a.prev_length = ot - 1, a.match_available = 0, t.next_in = l, t.input = o, t.avail_in = h, a.wrap = s, H;
      }var E,
          j = t("../utils/common"),
          U = t("./trees"),
          D = t("./adler32"),
          I = t("./crc32"),
          O = t("./messages"),
          q = 0,
          T = 1,
          L = 3,
          N = 4,
          R = 5,
          H = 0,
          F = 1,
          K = -2,
          M = -3,
          P = -5,
          G = -1,
          J = 1,
          Q = 2,
          V = 3,
          W = 4,
          X = 0,
          Y = 2,
          Z = 8,
          $ = 9,
          tt = 15,
          et = 8,
          at = 29,
          nt = 256,
          rt = nt + 1 + at,
          it = 30,
          st = 19,
          ht = 2 * rt + 1,
          lt = 15,
          ot = 3,
          _t = 258,
          dt = _t + ot + 1,
          ut = 32,
          ft = 42,
          ct = 69,
          pt = 73,
          gt = 91,
          mt = 103,
          bt = 113,
          wt = 666,
          vt = 1,
          yt = 2,
          kt = 3,
          zt = 4,
          xt = 3;E = [new b(0, 0, 0, 0, f), new b(4, 4, 8, 4, c), new b(4, 5, 16, 8, c), new b(4, 6, 32, 32, c), new b(4, 4, 16, 16, p), new b(8, 16, 32, 32, p), new b(8, 16, 128, 128, p), new b(8, 32, 128, 256, p), new b(32, 128, 258, 1024, p), new b(32, 258, 258, 4096, p)], a.deflateInit = B, a.deflateInit2 = x, a.deflateReset = k, a.deflateResetKeep = y, a.deflateSetHeader = z, a.deflate = A, a.deflateEnd = C, a.deflateSetDictionary = S, a.deflateInfo = "pako deflate (from Nodeca project)";
    }, { "../utils/common": 1, "./adler32": 3, "./crc32": 4, "./messages": 6, "./trees": 7 }], 6: [function (t, e, a) {
      "use strict";
      e.exports = { 2: "need dictionary", 1: "stream end", 0: "", "-1": "file error", "-2": "stream error", "-3": "data error", "-4": "insufficient memory", "-5": "buffer error", "-6": "incompatible version" };
    }, {}], 7: [function (t, e, a) {
      "use strict";
      function n(t) {
        for (var e = t.length; --e >= 0;) {
          t[e] = 0;
        }
      }function r(t, e, a, n, r) {
        this.static_tree = t, this.extra_bits = e, this.extra_base = a, this.elems = n, this.max_length = r, this.has_stree = t && t.length;
      }function i(t, e) {
        this.dyn_tree = t, this.max_code = 0, this.stat_desc = e;
      }function s(t) {
        return 256 > t ? lt[t] : lt[256 + (t >>> 7)];
      }function h(t, e) {
        t.pending_buf[t.pending++] = 255 & e, t.pending_buf[t.pending++] = e >>> 8 & 255;
      }function l(t, e, a) {
        t.bi_valid > W - a ? (t.bi_buf |= e << t.bi_valid & 65535, h(t, t.bi_buf), t.bi_buf = e >> W - t.bi_valid, t.bi_valid += a - W) : (t.bi_buf |= e << t.bi_valid & 65535, t.bi_valid += a);
      }function o(t, e, a) {
        l(t, a[2 * e], a[2 * e + 1]);
      }function _(t, e) {
        var a = 0;do {
          a |= 1 & t, t >>>= 1, a <<= 1;
        } while (--e > 0);return a >>> 1;
      }function d(t) {
        16 === t.bi_valid ? (h(t, t.bi_buf), t.bi_buf = 0, t.bi_valid = 0) : t.bi_valid >= 8 && (t.pending_buf[t.pending++] = 255 & t.bi_buf, t.bi_buf >>= 8, t.bi_valid -= 8);
      }function u(t, e) {
        var a,
            n,
            r,
            i,
            s,
            h,
            l = e.dyn_tree,
            o = e.max_code,
            _ = e.stat_desc.static_tree,
            d = e.stat_desc.has_stree,
            u = e.stat_desc.extra_bits,
            f = e.stat_desc.extra_base,
            c = e.stat_desc.max_length,
            p = 0;for (i = 0; V >= i; i++) {
          t.bl_count[i] = 0;
        }for (l[2 * t.heap[t.heap_max] + 1] = 0, a = t.heap_max + 1; Q > a; a++) {
          n = t.heap[a], i = l[2 * l[2 * n + 1] + 1] + 1, i > c && (i = c, p++), l[2 * n + 1] = i, n > o || (t.bl_count[i]++, s = 0, n >= f && (s = u[n - f]), h = l[2 * n], t.opt_len += h * (i + s), d && (t.static_len += h * (_[2 * n + 1] + s)));
        }if (0 !== p) {
          do {
            for (i = c - 1; 0 === t.bl_count[i];) {
              i--;
            }t.bl_count[i]--, t.bl_count[i + 1] += 2, t.bl_count[c]--, p -= 2;
          } while (p > 0);for (i = c; 0 !== i; i--) {
            for (n = t.bl_count[i]; 0 !== n;) {
              r = t.heap[--a], r > o || (l[2 * r + 1] !== i && (t.opt_len += (i - l[2 * r + 1]) * l[2 * r], l[2 * r + 1] = i), n--);
            }
          }
        }
      }function f(t, e, a) {
        var n,
            r,
            i = new Array(V + 1),
            s = 0;for (n = 1; V >= n; n++) {
          i[n] = s = s + a[n - 1] << 1;
        }for (r = 0; e >= r; r++) {
          var h = t[2 * r + 1];0 !== h && (t[2 * r] = _(i[h]++, h));
        }
      }function c() {
        var t,
            e,
            a,
            n,
            i,
            s = new Array(V + 1);for (a = 0, n = 0; K - 1 > n; n++) {
          for (_t[n] = a, t = 0; t < 1 << et[n]; t++) {
            ot[a++] = n;
          }
        }for (ot[a - 1] = n, i = 0, n = 0; 16 > n; n++) {
          for (dt[n] = i, t = 0; t < 1 << at[n]; t++) {
            lt[i++] = n;
          }
        }for (i >>= 7; G > n; n++) {
          for (dt[n] = i << 7, t = 0; t < 1 << at[n] - 7; t++) {
            lt[256 + i++] = n;
          }
        }for (e = 0; V >= e; e++) {
          s[e] = 0;
        }for (t = 0; 143 >= t;) {
          st[2 * t + 1] = 8, t++, s[8]++;
        }for (; 255 >= t;) {
          st[2 * t + 1] = 9, t++, s[9]++;
        }for (; 279 >= t;) {
          st[2 * t + 1] = 7, t++, s[7]++;
        }for (; 287 >= t;) {
          st[2 * t + 1] = 8, t++, s[8]++;
        }for (f(st, P + 1, s), t = 0; G > t; t++) {
          ht[2 * t + 1] = 5, ht[2 * t] = _(t, 5);
        }ut = new r(st, et, M + 1, P, V), ft = new r(ht, at, 0, G, V), ct = new r(new Array(0), nt, 0, J, X);
      }function p(t) {
        var e;for (e = 0; P > e; e++) {
          t.dyn_ltree[2 * e] = 0;
        }for (e = 0; G > e; e++) {
          t.dyn_dtree[2 * e] = 0;
        }for (e = 0; J > e; e++) {
          t.bl_tree[2 * e] = 0;
        }t.dyn_ltree[2 * Y] = 1, t.opt_len = t.static_len = 0, t.last_lit = t.matches = 0;
      }function g(t) {
        t.bi_valid > 8 ? h(t, t.bi_buf) : t.bi_valid > 0 && (t.pending_buf[t.pending++] = t.bi_buf), t.bi_buf = 0, t.bi_valid = 0;
      }function m(t, e, a, n) {
        g(t), n && (h(t, a), h(t, ~a)), D.arraySet(t.pending_buf, t.window, e, a, t.pending), t.pending += a;
      }function b(t, e, a, n) {
        var r = 2 * e,
            i = 2 * a;return t[r] < t[i] || t[r] === t[i] && n[e] <= n[a];
      }function w(t, e, a) {
        for (var n = t.heap[a], r = a << 1; r <= t.heap_len && (r < t.heap_len && b(e, t.heap[r + 1], t.heap[r], t.depth) && r++, !b(e, n, t.heap[r], t.depth));) {
          t.heap[a] = t.heap[r], a = r, r <<= 1;
        }t.heap[a] = n;
      }function v(t, e, a) {
        var n,
            r,
            i,
            h,
            _ = 0;if (0 !== t.last_lit) do {
          n = t.pending_buf[t.d_buf + 2 * _] << 8 | t.pending_buf[t.d_buf + 2 * _ + 1], r = t.pending_buf[t.l_buf + _], _++, 0 === n ? o(t, r, e) : (i = ot[r], o(t, i + M + 1, e), h = et[i], 0 !== h && (r -= _t[i], l(t, r, h)), n--, i = s(n), o(t, i, a), h = at[i], 0 !== h && (n -= dt[i], l(t, n, h)));
        } while (_ < t.last_lit);o(t, Y, e);
      }function y(t, e) {
        var a,
            n,
            r,
            i = e.dyn_tree,
            s = e.stat_desc.static_tree,
            h = e.stat_desc.has_stree,
            l = e.stat_desc.elems,
            o = -1;for (t.heap_len = 0, t.heap_max = Q, a = 0; l > a; a++) {
          0 !== i[2 * a] ? (t.heap[++t.heap_len] = o = a, t.depth[a] = 0) : i[2 * a + 1] = 0;
        }for (; t.heap_len < 2;) {
          r = t.heap[++t.heap_len] = 2 > o ? ++o : 0, i[2 * r] = 1, t.depth[r] = 0, t.opt_len--, h && (t.static_len -= s[2 * r + 1]);
        }for (e.max_code = o, a = t.heap_len >> 1; a >= 1; a--) {
          w(t, i, a);
        }r = l;do {
          a = t.heap[1], t.heap[1] = t.heap[t.heap_len--], w(t, i, 1), n = t.heap[1], t.heap[--t.heap_max] = a, t.heap[--t.heap_max] = n, i[2 * r] = i[2 * a] + i[2 * n], t.depth[r] = (t.depth[a] >= t.depth[n] ? t.depth[a] : t.depth[n]) + 1, i[2 * a + 1] = i[2 * n + 1] = r, t.heap[1] = r++, w(t, i, 1);
        } while (t.heap_len >= 2);t.heap[--t.heap_max] = t.heap[1], u(t, e), f(i, o, t.bl_count);
      }function k(t, e, a) {
        var n,
            r,
            i = -1,
            s = e[1],
            h = 0,
            l = 7,
            o = 4;for (0 === s && (l = 138, o = 3), e[2 * (a + 1) + 1] = 65535, n = 0; a >= n; n++) {
          r = s, s = e[2 * (n + 1) + 1], ++h < l && r === s || (o > h ? t.bl_tree[2 * r] += h : 0 !== r ? (r !== i && t.bl_tree[2 * r]++, t.bl_tree[2 * Z]++) : 10 >= h ? t.bl_tree[2 * $]++ : t.bl_tree[2 * tt]++, h = 0, i = r, 0 === s ? (l = 138, o = 3) : r === s ? (l = 6, o = 3) : (l = 7, o = 4));
        }
      }function z(t, e, a) {
        var n,
            r,
            i = -1,
            s = e[1],
            h = 0,
            _ = 7,
            d = 4;for (0 === s && (_ = 138, d = 3), n = 0; a >= n; n++) {
          if (r = s, s = e[2 * (n + 1) + 1], !(++h < _ && r === s)) {
            if (d > h) {
              do {
                o(t, r, t.bl_tree);
              } while (0 !== --h);
            } else 0 !== r ? (r !== i && (o(t, r, t.bl_tree), h--), o(t, Z, t.bl_tree), l(t, h - 3, 2)) : 10 >= h ? (o(t, $, t.bl_tree), l(t, h - 3, 3)) : (o(t, tt, t.bl_tree), l(t, h - 11, 7));h = 0, i = r, 0 === s ? (_ = 138, d = 3) : r === s ? (_ = 6, d = 3) : (_ = 7, d = 4);
          }
        }
      }function x(t) {
        var e;for (k(t, t.dyn_ltree, t.l_desc.max_code), k(t, t.dyn_dtree, t.d_desc.max_code), y(t, t.bl_desc), e = J - 1; e >= 3 && 0 === t.bl_tree[2 * rt[e] + 1]; e--) {}return t.opt_len += 3 * (e + 1) + 5 + 5 + 4, e;
      }function B(t, e, a, n) {
        var r;for (l(t, e - 257, 5), l(t, a - 1, 5), l(t, n - 4, 4), r = 0; n > r; r++) {
          l(t, t.bl_tree[2 * rt[r] + 1], 3);
        }z(t, t.dyn_ltree, e - 1), z(t, t.dyn_dtree, a - 1);
      }function A(t) {
        var e,
            a = 4093624447;for (e = 0; 31 >= e; e++, a >>>= 1) {
          if (1 & a && 0 !== t.dyn_ltree[2 * e]) return O;
        }if (0 !== t.dyn_ltree[18] || 0 !== t.dyn_ltree[20] || 0 !== t.dyn_ltree[26]) return q;for (e = 32; M > e; e++) {
          if (0 !== t.dyn_ltree[2 * e]) return q;
        }return O;
      }function C(t) {
        pt || (c(), pt = !0), t.l_desc = new i(t.dyn_ltree, ut), t.d_desc = new i(t.dyn_dtree, ft), t.bl_desc = new i(t.bl_tree, ct), t.bi_buf = 0, t.bi_valid = 0, p(t);
      }function S(t, e, a, n) {
        l(t, (L << 1) + (n ? 1 : 0), 3), m(t, e, a, !0);
      }function E(t) {
        l(t, N << 1, 3), o(t, Y, st), d(t);
      }function j(t, e, a, n) {
        var r,
            i,
            s = 0;t.level > 0 ? (t.strm.data_type === T && (t.strm.data_type = A(t)), y(t, t.l_desc), y(t, t.d_desc), s = x(t), r = t.opt_len + 3 + 7 >>> 3, i = t.static_len + 3 + 7 >>> 3, r >= i && (r = i)) : r = i = a + 5, r >= a + 4 && -1 !== e ? S(t, e, a, n) : t.strategy === I || i === r ? (l(t, (N << 1) + (n ? 1 : 0), 3), v(t, st, ht)) : (l(t, (R << 1) + (n ? 1 : 0), 3), B(t, t.l_desc.max_code + 1, t.d_desc.max_code + 1, s + 1), v(t, t.dyn_ltree, t.dyn_dtree)), p(t), n && g(t);
      }function U(t, e, a) {
        return t.pending_buf[t.d_buf + 2 * t.last_lit] = e >>> 8 & 255, t.pending_buf[t.d_buf + 2 * t.last_lit + 1] = 255 & e, t.pending_buf[t.l_buf + t.last_lit] = 255 & a, t.last_lit++, 0 === e ? t.dyn_ltree[2 * a]++ : (t.matches++, e--, t.dyn_ltree[2 * (ot[a] + M + 1)]++, t.dyn_dtree[2 * s(e)]++), t.last_lit === t.lit_bufsize - 1;
      }var D = t("../utils/common"),
          I = 4,
          O = 0,
          q = 1,
          T = 2,
          L = 0,
          N = 1,
          R = 2,
          H = 3,
          F = 258,
          K = 29,
          M = 256,
          P = M + 1 + K,
          G = 30,
          J = 19,
          Q = 2 * P + 1,
          V = 15,
          W = 16,
          X = 7,
          Y = 256,
          Z = 16,
          $ = 17,
          tt = 18,
          et = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0],
          at = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13],
          nt = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7],
          rt = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15],
          it = 512,
          st = new Array(2 * (P + 2));n(st);var ht = new Array(2 * G);n(ht);var lt = new Array(it);n(lt);var ot = new Array(F - H + 1);n(ot);var _t = new Array(K);n(_t);var dt = new Array(G);n(dt);var ut,
          ft,
          ct,
          pt = !1;a._tr_init = C, a._tr_stored_block = S, a._tr_flush_block = j, a._tr_tally = U, a._tr_align = E;
    }, { "../utils/common": 1 }], 8: [function (t, e, a) {
      "use strict";
      function n() {
        this.input = null, this.next_in = 0, this.avail_in = 0, this.total_in = 0, this.output = null, this.next_out = 0, this.avail_out = 0, this.total_out = 0, this.msg = "", this.state = null, this.data_type = 2, this.adler = 0;
      }e.exports = n;
    }, {}], "/lib/deflate.js": [function (t, e, a) {
      "use strict";
      function n(t) {
        if (!(this instanceof n)) return new n(t);this.options = l.assign({ level: b, method: v, chunkSize: 16384, windowBits: 15, memLevel: 8, strategy: w, to: "" }, t || {});var e = this.options;e.raw && e.windowBits > 0 ? e.windowBits = -e.windowBits : e.gzip && e.windowBits > 0 && e.windowBits < 16 && (e.windowBits += 16), this.err = 0, this.msg = "", this.ended = !1, this.chunks = [], this.strm = new d(), this.strm.avail_out = 0;var a = h.deflateInit2(this.strm, e.level, e.method, e.windowBits, e.memLevel, e.strategy);if (a !== p) throw new Error(_[a]);if (e.header && h.deflateSetHeader(this.strm, e.header), e.dictionary) {
          var r;if (r = "string" == typeof e.dictionary ? o.string2buf(e.dictionary) : "[object ArrayBuffer]" === u.call(e.dictionary) ? new Uint8Array(e.dictionary) : e.dictionary, a = h.deflateSetDictionary(this.strm, r), a !== p) throw new Error(_[a]);this._dict_set = !0;
        }
      }function r(t, e) {
        var a = new n(e);if (a.push(t, !0), a.err) throw a.msg;return a.result;
      }function i(t, e) {
        return e = e || {}, e.raw = !0, r(t, e);
      }function s(t, e) {
        return e = e || {}, e.gzip = !0, r(t, e);
      }var h = t("./zlib/deflate"),
          l = t("./utils/common"),
          o = t("./utils/strings"),
          _ = t("./zlib/messages"),
          d = t("./zlib/zstream"),
          u = Object.prototype.toString,
          f = 0,
          c = 4,
          p = 0,
          g = 1,
          m = 2,
          b = -1,
          w = 0,
          v = 8;n.prototype.push = function (t, e) {
        var a,
            n,
            r = this.strm,
            i = this.options.chunkSize;if (this.ended) return !1;n = e === ~~e ? e : e === !0 ? c : f, "string" == typeof t ? r.input = o.string2buf(t) : "[object ArrayBuffer]" === u.call(t) ? r.input = new Uint8Array(t) : r.input = t, r.next_in = 0, r.avail_in = r.input.length;do {
          if (0 === r.avail_out && (r.output = new l.Buf8(i), r.next_out = 0, r.avail_out = i), a = h.deflate(r, n), a !== g && a !== p) return this.onEnd(a), this.ended = !0, !1;0 !== r.avail_out && (0 !== r.avail_in || n !== c && n !== m) || ("string" === this.options.to ? this.onData(o.buf2binstring(l.shrinkBuf(r.output, r.next_out))) : this.onData(l.shrinkBuf(r.output, r.next_out)));
        } while ((r.avail_in > 0 || 0 === r.avail_out) && a !== g);return n === c ? (a = h.deflateEnd(this.strm), this.onEnd(a), this.ended = !0, a === p) : n === m ? (this.onEnd(p), r.avail_out = 0, !0) : !0;
      }, n.prototype.onData = function (t) {
        this.chunks.push(t);
      }, n.prototype.onEnd = function (t) {
        t === p && ("string" === this.options.to ? this.result = this.chunks.join("") : this.result = l.flattenChunks(this.chunks)), this.chunks = [], this.err = t, this.msg = this.strm.msg;
      }, a.Deflate = n, a.deflate = r, a.deflateRaw = i, a.gzip = s;
    }, { "./utils/common": 1, "./utils/strings": 2, "./zlib/deflate": 5, "./zlib/messages": 6, "./zlib/zstream": 8 }] }, {}, [])("/lib/deflate.js");
});
//# sourceMappingURL=pako_deflate.min.js.map

'use strict';

(function () {
	'use strict';

	angular.module('mediaboxApp').controller('LeftMenuController', LeftMenuController);

	LeftMenuController.$inject = ['Auth', '$mdSidenav', '$log', '$timeout', '$scope', 'Settings', '$mdMedia'];

	function LeftMenuController(Auth, $mdSidenav, $log, $timeout, $scope, Settings, $mdMedia) {
		var vm = this;
		// $scope.$watch(function() { return $mdMedia('lg'); }, function(big) {
		//   vm.bigScreen = big;
		// });

		vm.logout = Auth.logout;
		vm.isLoggedIn = Auth.isLoggedIn;
		vm.currentUser = Auth.getCurrentUser();
		vm.hasRole = Auth.hasRole;
		vm.menu = Settings.menu;
		vm.toggleLeft = buildDelayedToggler('left');
		vm.toggleRight = buildToggler('right');
		vm.isOpenLeft = function () {
			return $mdSidenav('left').isOpen();
		};
		vm.isOpenRight = function () {
			return $mdSidenav('right').isOpen();
		};
		/**
   * Supplies a function that will continue to operate until the
   * time is up.
   */
		function debounce(func, wait, context) {
			var timer;
			return function debounced() {
				var context = $scope,
				    args = Array.prototype.slice.call(arguments);
				$timeout.cancel(timer);
				timer = $timeout(function () {
					timer = undefined;
					func.apply(context, args);
				}, wait || 10);
			};
		}
		/**
   * Build handler to open/close a SideNav; when animation finishes
   * report completion in console
   */
		function buildDelayedToggler(navID) {
			return debounce(function () {
				$mdSidenav(navID).toggle().then(function () {
					$log.debug('toggle ' + navID + ' is done');
				});
			}, 200);
		}
		function buildToggler(navID) {
			return function () {
				$mdSidenav(navID).toggle().then(function () {
					$log.debug('toggle ' + navID + ' is done');
				});
			};
		}
	}
})();
//# sourceMappingURL=left-menu.controller.js.map

'use strict';

angular.module('mediaboxApp').directive('leftMenu', function () {
  return {
    templateUrl: 'components/left-menu/left-menu.html',
    restrict: 'EA',
    controller: 'LeftMenuController as left',
    link: function link(scope, element, attrs) {}
  };
});
//# sourceMappingURL=left-menu.directive.js.map

'use strict';

(function () {
	'use strict';

	angular.module('mediaboxApp').factory('PageOptions', PageOptions);

	function PageOptions() {
		var obj = {};
		obj.leftmenu = false;
		return obj;
	}
})();
//# sourceMappingURL=left-menu.service.js.map

'use strict';

(function () {
	'use strict';

	angular.module('mediaboxApp').factory('AlphabetColor', function AlphabetColor() {
		var colors = ['#f9a43e', '#59a2be', '#67bf74', '#f58559', '#e4c62e', '#f16364', '#2093cd', '#ad62a7'];
		var numberOfColors = colors.length;

		return getColor;

		function hashCode(str) {
			var hash = 0,
			    length = str.length,
			    i,
			    chr;

			if (length === 0) {
				return hash;
			}

			for (i = 0; i < length; i++) {
				chr = str.charCodeAt(i);
				hash = (hash << 5) - hash + chr;
				hash |= 0; // Convert to 32bit integer
			}

			return hash;
		}

		function getColor(string) {
			var color = Math.abs(hashCode(string.charAt(0))) % numberOfColors;
			return colors[color];
		}
	}).directive('listImage', listImage);

	// AlphabetColor.$inject = ['_'];


	listImage.$inject = ['$mdTheming', 'AlphabetColor'];

	function listImage($mdTheming, AlphabetColor) {
		var templateString = ['<div ng-style="{background: bgColor}">', '<span>{{::firstLetter}}</span>', '</div>'].join('');

		return {
			restrict: 'E',

			template: templateString,

			link: function link($scope, element, attrs) {
				$mdTheming(element);
				$scope.firstLetter = attrs.string.charAt(0);
				$scope.bgColor = AlphabetColor($scope.firstLetter);
			}
		};
	}
})();
//# sourceMappingURL=list-image.directive.js.map

'use strict';

angular.module('mediaboxApp').factory('lodash', function () {

  // add LodashService dependencies to inject
  LodashService.$inject = ['$window'];

  /**
  	 * LodashService constructor
   *
   * @param $window
   * @returns {exports._|*}
   * @constructor
   */
  function LodashService($window) {
    // remove lodash from global object
    var _ = $window._;
    delete $window._;

    // mixin functions
    _.mixin({ 'groupFilter': groupFilter });

    return _;

    /**
     * Group an array of objects into several arrays by the given
     * criteria, each group sorted by groupSort, each group consists
     * of items named groupItemsName.
     *
     * @param data
     * @param criteria
     * @param groupSort
     * @param groupItemsName
     * @returns {*}
     */
    function groupFilter(data, criteria, groupSort, groupItemsName) {
      if (!data || !data.length) {
        return data;
      }

      groupItemsName = groupItemsName || 'items';

      return _.chain(data).sortBy(groupSort).groupBy(criteria).pairs().map(function (currentItem) {
        return _.object(_.zip(['key', groupItemsName], currentItem));
      }).sortBy('key').value();
    }
  }
});
//# sourceMappingURL=lodash.service.js.map

'use strict';

(function () {
    'use strict';

    angular.module('mediaboxApp').factory('LoginModal', LoginModal).factory('CpModal', CpModal).controller('LoginModalController', LoginModalController).controller('SignUpModalController', SignUpModalController).controller('CpModalController', CpModalController).controller('tabsCtrl', tabsCtrl);

    function tabsCtrl($scope) {
        this.onTabSelected = function (tab) {
            this.tab = tab;
        };
    }
    function CpModal($mdDialog) {
        var obj = {};
        obj.show = function () {
            $mdDialog.show({
                controller: 'CpModalController as cp',
                templateUrl: 'components/login-modal/cp.html',
                clickOutsideToClose: false,
                parent: angular.element(document.body)
            }).then(function (answer) {
                // this.status = 'You closed the dialog.';
            }, function () {
                // this.status = 'You cancelled the dialog.';
            });
        };
        return obj;
    }

    function LoginModal($mdDialog, $state) {
        var obj = {};
        obj.show = function (nextRoute, reload) {
            $mdDialog.show({
                // controller: 'LoginModalController as login',
                templateUrl: 'components/login-modal/index.html',
                clickOutsideToClose: false,
                parent: angular.element(document.body),
                openFrom: { top: 500, width: 30, height: 80 },
                closeTo: { left: 1500 }
            }).then(function (answer) {
                $state.go(nextRoute, null, { reload: reload }); // Should be refreshed, else the user info will not be attached
            }, function () {
                // $scope.status = 'You cancelled the dialog.';
            });
        };
        return obj;
    }

    function CpModalController($mdDialog, Toast, Auth, Settings) {
        this.errors = {};
        this.submitted = false;
        this.Settings = Settings;
        this.Toast = Toast;
        this.Auth = Auth;
        this.close = function () {
            $mdDialog.cancel();
        };
        this.changePassword = function (form) {
            var _this = this;

            var vm = this;
            this.loading = true;
            this.submitted = true;
            if (form.$valid) {
                this.Auth.changePassword(this.user.oldPassword, this.user.newPassword).then(function () {
                    _this.message = 'Password successfully changed.';
                    $mdDialog.hide();
                    _this.loading = false;
                }).catch(function () {
                    form.password.$setValidity('mongoose', false);
                    _this.errors.other = 'Incorrect password';
                    _this.message = '';
                    _this.loading = false;
                });
            } else {
                this.Toast.show({ type: 'error', text: 'Error occured while changing password' });
            }
        };
    }
    function SignUpModalController($mdDialog, Auth) {
        this.errors = {};
        this.signupSelected = true;
        this.submitted = false;
        this.Auth = Auth;
        this.close = close;
        this.register = register;
        function close() {
            $mdDialog.cancel();
        }
        function register(form) {
            var _this2 = this;

            this.submitted = true;
            if (form.$valid) {
                this.loading = true;
                this.Auth.createUser({
                    name: this.user.name,
                    email: this.user.email,
                    phone: this.user.phone,
                    company: this.user.company,
                    website: this.user.website,
                    role: this.user.role,
                    password: this.user.password
                }).then(function () {
                    _this2.loading = false;
                    $mdDialog.hide();
                }).catch(function (err) {
                    err = err.data;
                    _this2.errors = {};
                    _this2.loading = false;
                    // Update validity of form fields that match the sequelize errors
                    if (err.name) {
                        angular.forEach(err.errors, function (field) {
                            form[field.path].$setValidity('mongoose', false);
                            _this2.errors[field.path] = field.message;
                        });
                    }
                });
            }
        }
    }
    function LoginModalController($mdDialog, Auth, $state) {
        var vm = this;
        vm.create = createUser;
        vm.login = login;
        vm.close = close;
        vm.goForgot = goForgot;
        vm.user = {};
        vm.errors = {};
        vm.submitted = false;
        vm.Auth = Auth;

        function goForgot(params) {
            close();
            $state.go('forgot', params);
        }
        function close() {
            $mdDialog.cancel();
        }
        function createUser(form) {}
        function login(form) {
            var _this3 = this;

            this.submitted = true;
            if (form.$valid) {
                this.loading = true;
                this.Auth.login({
                    email: this.user.email,
                    password: this.user.password
                }).then(function () {
                    _this3.loading = false;
                    $mdDialog.hide();
                }).catch(function (err) {
                    _this3.errors.other = err.message;
                    _this3.loading = false;
                });
            }
        }
    }
})();
//# sourceMappingURL=modal.service.js.map

"use strict";

(function () {
    "use strict";
    /* global moment, angular */

    var module = angular.module("mdPickers", ["ngMaterial", "ngAnimate", "ngAria"]);

    module.config(["$mdIconProvider", "mdpIconsRegistry", function ($mdIconProvider, mdpIconsRegistry) {
        angular.forEach(mdpIconsRegistry, function (icon, index) {
            $mdIconProvider.icon(icon.id, icon.url);
        });
    }]);

    module.run(["$templateCache", "mdpIconsRegistry", function ($templateCache, mdpIconsRegistry) {
        angular.forEach(mdpIconsRegistry, function (icon, index) {
            $templateCache.put(icon.url, icon.svg);
        });
    }]);
    module.constant("mdpIconsRegistry", [{
        id: 'mdp-chevron-left',
        url: 'mdp-chevron-left.svg',
        svg: '<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/><path d="M0 0h24v24H0z" fill="none"/></svg>'
    }, {
        id: 'mdp-chevron-right',
        url: 'mdp-chevron-right.svg',
        svg: '<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/><path d="M0 0h24v24H0z" fill="none"/></svg>'
    }, {
        id: 'mdp-access-time',
        url: 'mdp-access-time.svg',
        svg: '<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/><path d="M0 0h24v24H0z" fill="none"/><path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>'
    }, {
        id: 'mdp-event',
        url: 'mdp-event.svg',
        svg: '<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/><path d="M0 0h24v24H0z" fill="none"/></svg>'
    }]);
    module.directive("ngMessage", ["$mdUtil", function ($mdUtil) {
        return {
            restrict: "EA",
            priority: 101,
            compile: function compile(element) {
                var inputContainer = $mdUtil.getClosest(element, "mdp-time-picker", true) || $mdUtil.getClosest(element, "mdp-date-picker", true);

                // If we are not a child of an input container, don't do anything
                if (!inputContainer) return;

                // Add our animation class
                element.toggleClass('md-input-message-animation', true);

                return {};
            }
        };
    }]);
    /* global moment, angular */

    function DatePickerCtrl($scope, $mdDialog, $mdMedia, $timeout, currentDate, options) {
        var self = this;

        this.date = moment(currentDate);
        this.minDate = options.minDate && moment(options.minDate).isValid() ? moment(options.minDate) : null;
        this.maxDate = options.maxDate && moment(options.maxDate).isValid() ? moment(options.maxDate) : null;
        this.displayFormat = options.displayFormat || "ddd, MMM DD";
        this.dateFilter = angular.isFunction(options.dateFilter) ? options.dateFilter : null;
        this.selectingYear = false;

        // validate min and max date
        if (this.minDate && this.maxDate) {
            if (this.maxDate.isBefore(this.minDate)) {
                this.maxDate = moment(this.minDate).add(1, 'days');
            }
        }

        if (this.date) {
            // check min date
            if (this.minDate && this.date.isBefore(this.minDate)) {
                this.date = moment(this.minDate);
            }

            // check max date
            if (this.maxDate && this.date.isAfter(this.maxDate)) {
                this.date = moment(this.maxDate);
            }
        }

        this.yearItems = {
            currentIndex_: 0,
            PAGE_SIZE: 5,
            START: self.minDate ? self.minDate.year() : 1900,
            END: self.maxDate ? self.maxDate.year() : 0,
            getItemAtIndex: function getItemAtIndex(index) {
                if (this.currentIndex_ < index) this.currentIndex_ = index;

                return this.START + index;
            },
            getLength: function getLength() {
                return Math.min(this.currentIndex_ + Math.floor(this.PAGE_SIZE / 2), Math.abs(this.START - this.END) + 1);
            }
        };

        $scope.$mdMedia = $mdMedia;
        $scope.year = this.date.year();

        this.selectYear = function (year) {
            self.date.year(year);
            $scope.year = year;
            self.selectingYear = false;
            self.animate();
        };

        this.showYear = function () {
            self.yearTopIndex = self.date.year() - self.yearItems.START + Math.floor(self.yearItems.PAGE_SIZE / 2);
            self.yearItems.currentIndex_ = self.date.year() - self.yearItems.START + 1;
            self.selectingYear = true;
        };

        this.showCalendar = function () {
            self.selectingYear = false;
        };

        this.cancel = function () {
            $mdDialog.cancel();
        };

        this.confirm = function () {
            var date = this.date;

            if (this.minDate && this.date.isBefore(this.minDate)) {
                date = moment(this.minDate);
            }

            if (this.maxDate && this.date.isAfter(this.maxDate)) {
                date = moment(this.maxDate);
            }

            $mdDialog.hide(date.toDate());
        };

        this.animate = function () {
            self.animating = true;
            $timeout(angular.noop).then(function () {
                self.animating = false;
            });
        };
    }

    module.provider("$mdpDatePicker", function () {
        var LABEL_OK = "OK",
            LABEL_CANCEL = "Cancel",
            DISPLAY_FORMAT = "ddd, MMM DD";

        this.setDisplayFormat = function (format) {
            DISPLAY_FORMAT = format;
        };

        this.setOKButtonLabel = function (label) {
            LABEL_OK = label;
        };

        this.setCancelButtonLabel = function (label) {
            LABEL_CANCEL = label;
        };

        this.$get = ["$mdDialog", function ($mdDialog) {
            var datePicker = function datePicker(currentDate, options) {
                if (!angular.isDate(currentDate)) currentDate = Date.now();
                if (!angular.isObject(options)) options = {};

                options.displayFormat = DISPLAY_FORMAT;

                return $mdDialog.show({
                    controller: ['$scope', '$mdDialog', '$mdMedia', '$timeout', 'currentDate', 'options', DatePickerCtrl],
                    controllerAs: 'datepicker',
                    clickOutsideToClose: true,
                    template: '<md-dialog aria-label="" class="mdp-datepicker" ng-class="{ \'portrait\': !$mdMedia(\'gt-xs\') }">' + '<md-dialog-content layout="row" layout-wrap>' + '<div layout="column" layout-align="start center">' + '<md-toolbar layout-align="start start" flex class="mdp-datepicker-date-wrapper md-hue-1 md-primary" layout="column">' + '<span class="mdp-datepicker-year" ng-click="datepicker.showYear()" ng-class="{ \'active\': datepicker.selectingYear }">{{ datepicker.date.format(\'YYYY\') }}</span>' + '<span class="mdp-datepicker-date" ng-click="datepicker.showCalendar()" ng-class="{ \'active\': !datepicker.selectingYear }">{{ datepicker.date.format(datepicker.displayFormat) }}</span> ' + '</md-toolbar>' + '</div>' + '<div>' + '<div class="mdp-datepicker-select-year mdp-animation-zoom" layout="column" layout-align="center start" ng-if="datepicker.selectingYear">' + '<md-virtual-repeat-container md-auto-shrink md-top-index="datepicker.yearTopIndex">' + '<div flex md-virtual-repeat="item in datepicker.yearItems" md-on-demand class="repeated-year">' + '<span class="md-button" ng-click="datepicker.selectYear(item)" md-ink-ripple ng-class="{ \'md-primary current\': item == year }">{{ item }}</span>' + '</div>' + '</md-virtual-repeat-container>' + '</div>' + '<mdp-calendar ng-if="!datepicker.selectingYear" class="mdp-animation-zoom" date="datepicker.date" min-date="datepicker.minDate" date-filter="datepicker.dateFilter" max-date="datepicker.maxDate"></mdp-calendar>' + '<md-dialog-actions layout="row">' + '<span flex></span>' + '<md-button ng-click="datepicker.cancel()" aria-label="' + LABEL_CANCEL + '">' + LABEL_CANCEL + '</md-button>' + '<md-button ng-click="datepicker.confirm()" class="md-primary" aria-label="' + LABEL_OK + '">' + LABEL_OK + '</md-button>' + '</md-dialog-actions>' + '</div>' + '</md-dialog-content>' + '</md-dialog>',
                    targetEvent: options.targetEvent,
                    locals: {
                        currentDate: currentDate,
                        options: options
                    },
                    skipHide: true
                });
            };

            return datePicker;
        }];
    });

    function CalendarCtrl($scope) {
        var self = this;
        this.dow = moment.localeData().firstDayOfWeek();

        this.weekDays = [].concat(moment.weekdaysMin().slice(this.dow), moment.weekdaysMin().slice(0, this.dow));

        this.daysInMonth = [];

        this.getDaysInMonth = function () {
            var days = self.date.daysInMonth(),
                firstDay = moment(self.date).date(1).day() - this.dow;

            if (firstDay < 0) firstDay = this.weekDays.length - 1;

            var arr = [];
            for (var i = 1; i <= firstDay + days; i++) {
                var day = null;
                if (i > firstDay) {
                    day = {
                        value: i - firstDay,
                        enabled: self.isDayEnabled(moment(self.date).date(i - firstDay).toDate())
                    };
                }
                arr.push(day);
            }

            return arr;
        };

        this.isDayEnabled = function (day) {
            return (!this.minDate || this.minDate <= day) && (!this.maxDate || this.maxDate >= day) && (!self.dateFilter || !self.dateFilter(day));
        };

        this.selectDate = function (dom) {
            self.date.date(dom);
        };

        this.nextMonth = function () {
            self.date.add(1, 'months');
        };

        this.prevMonth = function () {
            self.date.subtract(1, 'months');
        };

        this.updateDaysInMonth = function () {
            self.daysInMonth = self.getDaysInMonth();
        };

        $scope.$watch(function () {
            return self.date.unix();
        }, function (newValue, oldValue) {
            if (newValue && newValue !== oldValue) self.updateDaysInMonth();
        });

        self.updateDaysInMonth();
    }

    module.directive("mdpCalendar", ["$animate", function ($animate) {
        return {
            restrict: 'E',
            bindToController: {
                "date": "=",
                "minDate": "=",
                "maxDate": "=",
                "dateFilter": "="
            },
            template: '<div class="mdp-calendar">' + '<div layout="row" layout-align="space-between center">' + '<md-button aria-label="previous month" class="md-icon-button" ng-click="calendar.prevMonth()"><md-icon md-svg-icon="mdp-chevron-left"></md-icon></md-button>' + '<div class="mdp-calendar-monthyear" ng-show="!calendar.animating">{{ calendar.date.format("MMMM YYYY") }}</div>' + '<md-button aria-label="next month" class="md-icon-button" ng-click="calendar.nextMonth()"><md-icon md-svg-icon="mdp-chevron-right"></md-icon></md-button>' + '</div>' + '<div layout="row" layout-align="space-around center" class="mdp-calendar-week-days" ng-show="!calendar.animating">' + '<div layout layout-align="center center" ng-repeat="d in calendar.weekDays track by $index">{{ d }}</div>' + '</div>' + '<div layout="row" layout-align="start center" layout-wrap class="mdp-calendar-days" ng-class="{ \'mdp-animate-next\': calendar.animating }" ng-show="!calendar.animating" md-swipe-left="calendar.nextMonth()" md-swipe-right="calendar.prevMonth()">' + '<div layout layout-align="center center" ng-repeat-start="day in calendar.daysInMonth track by $index" ng-class="{ \'mdp-day-placeholder\': !day }">' + '<md-button class="md-icon-button md-raised" aria-label="Select day" ng-if="day" ng-class="{ \'md-accent\': calendar.date.date() == day.value }" ng-click="calendar.selectDate(day.value)" ng-disabled="!day.enabled">{{ day.value }}</md-button>' + '</div>' + '<div flex="100" ng-if="($index + 1) % 7 == 0" ng-repeat-end></div>' + '</div>' + '</div>',
            controller: ["$scope", CalendarCtrl],
            controllerAs: "calendar",
            link: function link(scope, element, attrs, ctrl) {
                var animElements = [element[0].querySelector(".mdp-calendar-week-days"), element[0].querySelector('.mdp-calendar-days'), element[0].querySelector('.mdp-calendar-monthyear')].map(function (a) {
                    return angular.element(a);
                });

                scope.$watch(function () {
                    return ctrl.date.format("YYYYMM");
                }, function (newValue, oldValue) {
                    var direction = null;

                    if (newValue > oldValue) direction = "mdp-animate-next";else if (newValue < oldValue) direction = "mdp-animate-prev";

                    if (direction) {
                        for (var i in animElements) {
                            animElements[i].addClass(direction);
                            $animate.removeClass(animElements[i], direction);
                        }
                    }
                });
            }
        };
    }]);

    function formatValidator(value, format) {
        return !value || angular.isDate(value) || moment(value, format, true).isValid();
    }

    function minDateValidator(value, format, minDate) {
        var minDate = moment(minDate, "YYYY-MM-DD", true);
        var date = angular.isDate(value) ? moment(value) : moment(value, format, true);

        return !value || angular.isDate(value) || !minDate.isValid() || date.isSameOrAfter(minDate);
    }

    function maxDateValidator(value, format, maxDate) {
        var maxDate = moment(maxDate, "YYYY-MM-DD", true);
        var date = angular.isDate(value) ? moment(value) : moment(value, format, true);

        return !value || angular.isDate(value) || !maxDate.isValid() || date.isSameOrBefore(maxDate);
    }

    function filterValidator(value, format, filter) {
        var date = angular.isDate(value) ? moment(value) : moment(value, format, true);

        return !value || angular.isDate(value) || !angular.isFunction(filter) || !filter(date);
    }

    function requiredValidator(value, ngModel) {
        return value;
    }

    module.directive("mdpDatePicker", ["$mdpDatePicker", "$timeout", function ($mdpDatePicker, $timeout) {
        return {
            restrict: 'E',
            require: 'ngModel',
            transclude: true,
            template: function template(element, attrs) {
                var noFloat = angular.isDefined(attrs.mdpNoFloat),
                    placeholder = angular.isDefined(attrs.mdpPlaceholder) ? attrs.mdpPlaceholder : "",
                    openOnClick = angular.isDefined(attrs.mdpOpenOnClick) ? true : false;

                return '<div layout layout-align="start start">' + '<md-button' + (angular.isDefined(attrs.mdpDisabled) ? ' ng-disabled="disabled"' : '') + ' class="md-icon-button" ng-click="showPicker($event)">' + '<md-icon md-svg-icon="mdp-event"></md-icon>' + '</md-button>' + '<md-input-container' + (noFloat ? ' md-no-float' : '') + ' md-is-error="isError()">' + '<input type="{{ ::type }}"' + (angular.isDefined(attrs.mdpDisabled) ? ' ng-disabled="disabled"' : '') + ' aria-label="' + placeholder + '" placeholder="' + placeholder + '"' + (openOnClick ? ' ng-click="showPicker($event)" ' : '') + ' />' + '</md-input-container>' + '</div>';
            },
            scope: {
                "minDate": "=mdpMinDate",
                "maxDate": "=mdpMaxDate",
                "dateFilter": "=mdpDateFilter",
                "dateFormat": "@mdpFormat",
                "placeholder": "@mdpPlaceholder",
                "noFloat": "=mdpNoFloat",
                "openOnClick": "=mdpOpenOnClick",
                "disabled": "=?mdpDisabled"
            },
            link: {
                pre: function pre(scope, element, attrs, ngModel, $transclude) {},
                post: function post(scope, element, attrs, ngModel, $transclude) {
                    var inputElement = angular.element(element[0].querySelector('input')),
                        inputContainer = angular.element(element[0].querySelector('md-input-container')),
                        inputContainerCtrl = inputContainer.controller("mdInputContainer");

                    $transclude(function (clone) {
                        inputContainer.append(clone);
                    });

                    var messages = angular.element(inputContainer[0].querySelector("[ng-messages]"));

                    scope.type = scope.dateFormat ? "text" : "date";
                    scope.dateFormat = scope.dateFormat || "YYYY-MM-DD";
                    scope.model = ngModel;

                    scope.isError = function () {
                        return !ngModel.$pristine && !!ngModel.$invalid;
                    };

                    // update input element if model has changed
                    ngModel.$formatters.unshift(function (value) {
                        var date = angular.isDate(value) && moment(value);
                        if (date && date.isValid()) updateInputElement(date.format(scope.dateFormat));else updateInputElement(null);
                    });

                    ngModel.$validators.format = function (modelValue, viewValue) {
                        return formatValidator(viewValue, scope.dateFormat);
                    };

                    ngModel.$validators.minDate = function (modelValue, viewValue) {
                        return minDateValidator(viewValue, scope.dateFormat, scope.minDate);
                    };

                    ngModel.$validators.maxDate = function (modelValue, viewValue) {
                        return maxDateValidator(viewValue, scope.dateFormat, scope.maxDate);
                    };

                    ngModel.$validators.filter = function (modelValue, viewValue) {
                        return filterValidator(viewValue, scope.dateFormat, scope.dateFilter);
                    };

                    ngModel.$validators.required = function (modelValue, viewValue) {
                        return angular.isUndefined(attrs.required) || !ngModel.$isEmpty(modelValue) || !ngModel.$isEmpty(viewValue);
                    };

                    ngModel.$parsers.unshift(function (value) {
                        var parsed = moment(value, scope.dateFormat, true);
                        if (parsed.isValid()) {
                            if (angular.isDate(ngModel.$modelValue)) {
                                var originalModel = moment(ngModel.$modelValue);
                                originalModel.year(parsed.year());
                                originalModel.month(parsed.month());
                                originalModel.date(parsed.date());

                                parsed = originalModel;
                            }
                            return parsed.toDate();
                        } else return null;
                    });

                    // update input element value
                    function updateInputElement(value) {
                        inputElement[0].value = value;
                        inputContainerCtrl.setHasValue(!ngModel.$isEmpty(value));
                    }

                    function updateDate(date) {
                        var value = moment(date, angular.isDate(date) ? null : scope.dateFormat, true),
                            strValue = value.format(scope.dateFormat);

                        if (value.isValid()) {
                            updateInputElement(strValue);
                            ngModel.$setViewValue(strValue);
                        } else {
                            updateInputElement(date);
                            ngModel.$setViewValue(date);
                        }

                        if (!ngModel.$pristine && messages.hasClass("md-auto-hide") && inputContainer.hasClass("md-input-invalid")) messages.removeClass("md-auto-hide");

                        ngModel.$render();
                    }

                    scope.showPicker = function (ev) {
                        $mdpDatePicker(ngModel.$modelValue, {
                            minDate: scope.minDate,
                            maxDate: scope.maxDate,
                            dateFilter: scope.dateFilter,
                            targetEvent: ev
                        }).then(updateDate);
                    };

                    function onInputElementEvents(event) {
                        if (event.target.value !== ngModel.$viewVaue) updateDate(event.target.value);
                    }

                    inputElement.on("reset input blur", onInputElementEvents);

                    scope.$on("$destroy", function () {
                        inputElement.off("reset input blur", onInputElementEvents);
                    });
                }
            }
        };
    }]);

    module.directive("mdpDatePicker", ["$mdpDatePicker", "$timeout", function ($mdpDatePicker, $timeout) {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                "minDate": "@min",
                "maxDate": "@max",
                "dateFilter": "=mdpDateFilter",
                "dateFormat": "@mdpFormat"
            },
            link: function link(scope, element, attrs, ngModel, $transclude) {
                scope.dateFormat = scope.dateFormat || "YYYY-MM-DD";

                ngModel.$validators.format = function (modelValue, viewValue) {
                    return formatValidator(viewValue, scope.format);
                };

                ngModel.$validators.minDate = function (modelValue, viewValue) {
                    return minDateValidator(viewValue, scope.format, scope.minDate);
                };

                ngModel.$validators.maxDate = function (modelValue, viewValue) {
                    return maxDateValidator(viewValue, scope.format, scope.maxDate);
                };

                ngModel.$validators.filter = function (modelValue, viewValue) {
                    return filterValidator(viewValue, scope.format, scope.dateFilter);
                };

                function showPicker(ev) {
                    $mdpDatePicker(ngModel.$modelValue, {
                        minDate: scope.minDate,
                        maxDate: scope.maxDate,
                        dateFilter: scope.dateFilter,
                        targetEvent: ev
                    }).then(function (time) {
                        ngModel.$setViewValue(moment(time).format(scope.format));
                        ngModel.$render();
                    });
                };

                element.on("click", showPicker);

                scope.$on("$destroy", function () {
                    element.off("click", showPicker);
                });
            }
        };
    }]);
    /* global moment, angular */

    function TimePickerCtrl($scope, $mdDialog, time, autoSwitch, $mdMedia) {
        var self = this;
        this.VIEW_HOURS = 1;
        this.VIEW_MINUTES = 2;
        this.currentView = this.VIEW_HOURS;
        this.time = moment(time);
        this.autoSwitch = !!autoSwitch;

        this.clockHours = parseInt(this.time.format("h"));
        this.clockMinutes = parseInt(this.time.minutes());

        $scope.$mdMedia = $mdMedia;

        this.switchView = function () {
            self.currentView = self.currentView == self.VIEW_HOURS ? self.VIEW_MINUTES : self.VIEW_HOURS;
        };

        this.setAM = function () {
            if (self.time.hours() >= 12) self.time.hour(self.time.hour() - 12);
        };

        this.setPM = function () {
            if (self.time.hours() < 12) self.time.hour(self.time.hour() + 12);
        };

        this.cancel = function () {
            $mdDialog.cancel();
        };

        this.confirm = function () {
            $mdDialog.hide(this.time.toDate());
        };
    }

    function ClockCtrl($scope) {
        var TYPE_HOURS = "hours";
        var TYPE_MINUTES = "minutes";
        var self = this;

        this.STEP_DEG = 360 / 12;
        this.steps = [];

        this.CLOCK_TYPES = {
            "hours": {
                range: 12
            },
            "minutes": {
                range: 60
            }
        };

        this.getPointerStyle = function () {
            var divider = 1;
            switch (self.type) {
                case TYPE_HOURS:
                    divider = 12;
                    break;
                case TYPE_MINUTES:
                    divider = 60;
                    break;
            }
            var degrees = Math.round(self.selected * (360 / divider)) - 180;
            return {
                "-webkit-transform": "rotate(" + degrees + "deg)",
                "-ms-transform": "rotate(" + degrees + "deg)",
                "transform": "rotate(" + degrees + "deg)"
            };
        };

        this.setTimeByDeg = function (deg) {
            deg = deg >= 360 ? 0 : deg;
            var divider = 0;
            switch (self.type) {
                case TYPE_HOURS:
                    divider = 12;
                    break;
                case TYPE_MINUTES:
                    divider = 60;
                    break;
            }

            self.setTime(Math.round(divider / 360 * deg));
        };

        this.setTime = function (time, type) {
            this.selected = time;

            switch (self.type) {
                case TYPE_HOURS:
                    if (self.time.format("A") == "PM") time += 12;
                    this.time.hours(time);
                    break;
                case TYPE_MINUTES:
                    if (time > 59) time -= 60;
                    this.time.minutes(time);
                    break;
            }
        };

        this.init = function () {
            self.type = self.type || "hours";
            switch (self.type) {
                case TYPE_HOURS:
                    for (var i = 1; i <= 12; i++) {
                        self.steps.push(i);
                    }self.selected = self.time.hours() || 0;
                    if (self.selected > 12) self.selected -= 12;

                    break;
                case TYPE_MINUTES:
                    for (var i = 5; i <= 55; i += 5) {
                        self.steps.push(i);
                    }self.steps.push(0);
                    self.selected = self.time.minutes() || 0;

                    break;
            }
        };

        this.init();
    }

    module.directive("mdpClock", ["$animate", "$timeout", function ($animate, $timeout) {
        return {
            restrict: 'E',
            bindToController: {
                'type': '@?',
                'time': '=',
                'autoSwitch': '=?'
            },
            replace: true,
            template: '<div class="mdp-clock">' + '<div class="mdp-clock-container">' + '<md-toolbar class="mdp-clock-center md-primary"></md-toolbar>' + '<md-toolbar ng-style="clock.getPointerStyle()" class="mdp-pointer md-primary">' + '<span class="mdp-clock-selected md-button md-raised md-primary"></span>' + '</md-toolbar>' + '<md-button ng-class="{ \'md-primary\': clock.selected == step }" class="md-icon-button md-raised mdp-clock-deg{{ ::(clock.STEP_DEG * ($index + 1)) }}" ng-repeat="step in clock.steps" ng-click="clock.setTime(step)">{{ step }}</md-button>' + '</div>' + '</div>',
            controller: ["$scope", ClockCtrl],
            controllerAs: "clock",
            link: function link(scope, element, attrs, ctrl) {
                var pointer = angular.element(element[0].querySelector(".mdp-pointer")),
                    timepickerCtrl = scope.$parent.timepicker;

                var onEvent = function onEvent(event) {
                    var containerCoords = event.currentTarget.getClientRects()[0];
                    var x = event.currentTarget.offsetWidth / 2 - (event.pageX - containerCoords.left),
                        y = event.pageY - containerCoords.top - event.currentTarget.offsetHeight / 2;

                    var deg = Math.round(Math.atan2(x, y) * (180 / Math.PI));
                    $timeout(function () {
                        ctrl.setTimeByDeg(deg + 180);
                        if (ctrl.autoSwitch && ["mouseup", "click"].indexOf(event.type) !== -1 && timepickerCtrl) timepickerCtrl.switchView();
                    });
                };

                element.on("mousedown", function () {
                    element.on("mousemove", onEvent);
                });

                element.on("mouseup", function (e) {
                    element.off("mousemove");
                });

                element.on("click", onEvent);
                scope.$on("$destroy", function () {
                    element.off("click", onEvent);
                    element.off("mousemove", onEvent);
                });
            }
        };
    }]);

    module.provider("$mdpTimePicker", function () {
        var LABEL_OK = "OK",
            LABEL_CANCEL = "Cancel";

        this.setOKButtonLabel = function (label) {
            LABEL_OK = label;
        };

        this.setCancelButtonLabel = function (label) {
            LABEL_CANCEL = label;
        };

        this.$get = ["$mdDialog", function ($mdDialog) {
            var timePicker = function timePicker(time, options) {
                if (!angular.isDate(time)) time = Date.now();
                if (!angular.isObject(options)) options = {};

                return $mdDialog.show({
                    controller: ['$scope', '$mdDialog', 'time', 'autoSwitch', '$mdMedia', TimePickerCtrl],
                    controllerAs: 'timepicker',
                    clickOutsideToClose: true,
                    template: '<md-dialog aria-label="" class="mdp-timepicker" ng-class="{ \'portrait\': !$mdMedia(\'gt-xs\') }">' + '<md-dialog-content layout-gt-xs="row" layout-wrap>' + '<md-toolbar layout-gt-xs="column" layout-xs="row" layout-align="center center" flex class="mdp-timepicker-time md-hue-1 md-primary">' + '<div class="mdp-timepicker-selected-time">' + '<span ng-class="{ \'active\': timepicker.currentView == timepicker.VIEW_HOURS }" ng-click="timepicker.currentView = timepicker.VIEW_HOURS">{{ timepicker.time.format("h") }}</span>:' + '<span ng-class="{ \'active\': timepicker.currentView == timepicker.VIEW_MINUTES }" ng-click="timepicker.currentView = timepicker.VIEW_MINUTES">{{ timepicker.time.format("mm") }}</span>' + '</div>' + '<div layout="column" class="mdp-timepicker-selected-ampm">' + '<span ng-click="timepicker.setAM()" ng-class="{ \'active\': timepicker.time.hours() < 12 }">AM</span>' + '<span ng-click="timepicker.setPM()" ng-class="{ \'active\': timepicker.time.hours() >= 12 }">PM</span>' + '</div>' + '</md-toolbar>' + '<div>' + '<div class="mdp-clock-switch-container" ng-switch="timepicker.currentView" layout layout-align="center center">' + '<mdp-clock class="mdp-animation-zoom" auto-switch="timepicker.autoSwitch" time="timepicker.time" type="hours" ng-switch-when="1"></mdp-clock>' + '<mdp-clock class="mdp-animation-zoom" auto-switch="timepicker.autoSwitch" time="timepicker.time" type="minutes" ng-switch-when="2"></mdp-clock>' + '</div>' + '<md-dialog-actions layout="row">' + '<span flex></span>' + '<md-button ng-click="timepicker.cancel()" aria-label="' + LABEL_CANCEL + '">' + LABEL_CANCEL + '</md-button>' + '<md-button ng-click="timepicker.confirm()" class="md-primary" aria-label="' + LABEL_OK + '">' + LABEL_OK + '</md-button>' + '</md-dialog-actions>' + '</div>' + '</md-dialog-content>' + '</md-dialog>',
                    targetEvent: options.targetEvent,
                    locals: {
                        time: time,
                        autoSwitch: options.autoSwitch
                    },
                    skipHide: true
                });
            };

            return timePicker;
        }];
    });

    module.directive("mdpTimePicker", ["$mdpTimePicker", "$timeout", function ($mdpTimePicker, $timeout) {
        return {
            restrict: 'E',
            require: 'ngModel',
            transclude: true,
            template: function template(element, attrs) {
                var noFloat = angular.isDefined(attrs.mdpNoFloat),
                    placeholder = angular.isDefined(attrs.mdpPlaceholder) ? attrs.mdpPlaceholder : "",
                    openOnClick = angular.isDefined(attrs.mdpOpenOnClick) ? true : false;

                return '<div layout layout-align="start start">' + '<md-button class="md-icon-button" ng-click="showPicker($event)"' + (angular.isDefined(attrs.mdpDisabled) ? ' ng-disabled="disabled"' : '') + '>' + '<md-icon md-svg-icon="mdp-access-time"></md-icon>' + '</md-button>' + '<md-input-container' + (noFloat ? ' md-no-float' : '') + ' md-is-error="isError()">' + '<input type="{{ ::type }}"' + (angular.isDefined(attrs.mdpDisabled) ? ' ng-disabled="disabled"' : '') + ' aria-label="' + placeholder + '" placeholder="' + placeholder + '"' + (openOnClick ? ' ng-click="showPicker($event)" ' : '') + ' />' + '</md-input-container>' + '</div>';
            },
            scope: {
                "timeFormat": "@mdpFormat",
                "placeholder": "@mdpPlaceholder",
                "autoSwitch": "=?mdpAutoSwitch",
                "disabled": "=?mdpDisabled"
            },
            link: function link(scope, element, attrs, ngModel, $transclude) {
                var inputElement = angular.element(element[0].querySelector('input')),
                    inputContainer = angular.element(element[0].querySelector('md-input-container')),
                    inputContainerCtrl = inputContainer.controller("mdInputContainer");

                $transclude(function (clone) {
                    inputContainer.append(clone);
                });

                var messages = angular.element(inputContainer[0].querySelector("[ng-messages]"));

                scope.type = scope.timeFormat ? "text" : "time";
                scope.timeFormat = scope.timeFormat || "HH:mm";
                scope.autoSwitch = scope.autoSwitch || false;

                scope.$watch(function () {
                    return ngModel.$error;
                }, function (newValue, oldValue) {
                    inputContainerCtrl.setInvalid(!ngModel.$pristine && !!Object.keys(ngModel.$error).length);
                }, true);

                // update input element if model has changed
                ngModel.$formatters.unshift(function (value) {
                    var time = angular.isDate(value) && moment(value);
                    if (time && time.isValid()) updateInputElement(time.format(scope.timeFormat));else updateInputElement(null);
                });

                ngModel.$validators.format = function (modelValue, viewValue) {
                    return !viewValue || angular.isDate(viewValue) || moment(viewValue, scope.timeFormat, true).isValid();
                };

                ngModel.$validators.required = function (modelValue, viewValue) {
                    return angular.isUndefined(attrs.required) || !ngModel.$isEmpty(modelValue) || !ngModel.$isEmpty(viewValue);
                };

                ngModel.$parsers.unshift(function (value) {
                    var parsed = moment(value, scope.timeFormat, true);
                    if (parsed.isValid()) {
                        if (angular.isDate(ngModel.$modelValue)) {
                            var originalModel = moment(ngModel.$modelValue);
                            originalModel.minutes(parsed.minutes());
                            originalModel.hours(parsed.hours());
                            originalModel.seconds(parsed.seconds());

                            parsed = originalModel;
                        }
                        return parsed.toDate();
                    } else return null;
                });

                // update input element value
                function updateInputElement(value) {
                    inputElement[0].value = value;
                    inputContainerCtrl.setHasValue(!ngModel.$isEmpty(value));
                }

                function updateTime(time) {
                    var value = moment(time, angular.isDate(time) ? null : scope.timeFormat, true),
                        strValue = value.format(scope.timeFormat);

                    if (value.isValid()) {
                        updateInputElement(strValue);
                        ngModel.$setViewValue(strValue);
                    } else {
                        updateInputElement(time);
                        ngModel.$setViewValue(time);
                    }

                    if (!ngModel.$pristine && messages.hasClass("md-auto-hide") && inputContainer.hasClass("md-input-invalid")) messages.removeClass("md-auto-hide");

                    ngModel.$render();
                }

                scope.showPicker = function (ev) {
                    $mdpTimePicker(ngModel.$modelValue, {
                        targetEvent: ev,
                        autoSwitch: scope.autoSwitch
                    }).then(function (time) {
                        updateTime(time, true);
                    });
                };

                function onInputElementEvents(event) {
                    if (event.target.value !== ngModel.$viewVaue) updateTime(event.target.value);
                }

                inputElement.on("reset input blur", onInputElementEvents);

                scope.$on("$destroy", function () {
                    inputElement.off("reset input blur", onInputElementEvents);
                });
            }
        };
    }]);

    module.directive("mdpTimePicker", ["$mdpTimePicker", "$timeout", function ($mdpTimePicker, $timeout) {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                "timeFormat": "@mdpFormat",
                "autoSwitch": "=?mdpAutoSwitch"
            },
            link: function link(scope, element, attrs, ngModel, $transclude) {
                scope.format = scope.format || "HH:mm";
                function showPicker(ev) {
                    $mdpTimePicker(ngModel.$modelValue, {
                        targetEvent: ev,
                        autoSwitch: scope.autoSwitch
                    }).then(function (time) {
                        ngModel.$setViewValue(moment(time).format(scope.format));
                        ngModel.$render();
                    });
                };

                element.on("click", showPicker);

                scope.$on("$destroy", function () {
                    element.off("click", showPicker);
                });
            }
        };
    }]);
})();
//# sourceMappingURL=mdPickers.js.map

"use strict";

!function () {
  "use strict";
  function t(t, e, a, i, n, r) {
    var o = this;this.date = moment(n), this.minDate = r.minDate && moment(r.minDate).isValid() ? moment(r.minDate) : null, this.maxDate = r.maxDate && moment(r.maxDate).isValid() ? moment(r.maxDate) : null, this.displayFormat = r.displayFormat || "ddd, MMM DD", this.dateFilter = angular.isFunction(r.dateFilter) ? r.dateFilter : null, this.selectingYear = !1, this.minDate && this.maxDate && this.maxDate.isBefore(this.minDate) && (this.maxDate = moment(this.minDate).add(1, "days")), this.date && (this.minDate && this.date.isBefore(this.minDate) && (this.date = moment(this.minDate)), this.maxDate && this.date.isAfter(this.maxDate) && (this.date = moment(this.maxDate))), this.yearItems = { currentIndex_: 0, PAGE_SIZE: 5, START: o.minDate ? o.minDate.year() : 1900, END: o.maxDate ? o.maxDate.year() : 0, getItemAtIndex: function getItemAtIndex(t) {
        return this.currentIndex_ < t && (this.currentIndex_ = t), this.START + t;
      }, getLength: function getLength() {
        return Math.min(this.currentIndex_ + Math.floor(this.PAGE_SIZE / 2), Math.abs(this.START - this.END) + 1);
      } }, t.$mdMedia = a, t.year = this.date.year(), this.selectYear = function (e) {
      o.date.year(e), t.year = e, o.selectingYear = !1, o.animate();
    }, this.showYear = function () {
      o.yearTopIndex = o.date.year() - o.yearItems.START + Math.floor(o.yearItems.PAGE_SIZE / 2), o.yearItems.currentIndex_ = o.date.year() - o.yearItems.START + 1, o.selectingYear = !0;
    }, this.showCalendar = function () {
      o.selectingYear = !1;
    }, this.cancel = function () {
      e.cancel();
    }, this.confirm = function () {
      var t = this.date;this.minDate && this.date.isBefore(this.minDate) && (t = moment(this.minDate)), this.maxDate && this.date.isAfter(this.maxDate) && (t = moment(this.maxDate)), e.hide(t.toDate());
    }, this.animate = function () {
      o.animating = !0, i(angular.noop).then(function () {
        o.animating = !1;
      });
    };
  }function e(t) {
    var e = this;this.dow = moment.localeData().firstDayOfWeek(), this.weekDays = [].concat(moment.weekdaysMin().slice(this.dow), moment.weekdaysMin().slice(0, this.dow)), this.daysInMonth = [], this.getDaysInMonth = function () {
      var t = e.date.daysInMonth(),
          a = moment(e.date).date(1).day() - this.dow;0 > a && (a = this.weekDays.length - 1);for (var i = [], n = 1; a + t >= n; n++) {
        var r = null;n > a && (r = { value: n - a, enabled: e.isDayEnabled(moment(e.date).date(n - a).toDate()) }), i.push(r);
      }return i;
    }, this.isDayEnabled = function (t) {
      return !(this.minDate && !(this.minDate <= t) || this.maxDate && !(this.maxDate >= t) || e.dateFilter && e.dateFilter(t));
    }, this.selectDate = function (t) {
      e.date.date(t);
    }, this.nextMonth = function () {
      e.date.add(1, "months");
    }, this.prevMonth = function () {
      e.date.subtract(1, "months");
    }, this.updateDaysInMonth = function () {
      e.daysInMonth = e.getDaysInMonth();
    }, t.$watch(function () {
      return e.date.unix();
    }, function (t, a) {
      t && t !== a && e.updateDaysInMonth();
    }), e.updateDaysInMonth();
  }function a(t, e) {
    return !t || angular.isDate(t) || moment(t, e, !0).isValid();
  }function i(t, e, a) {
    var a = moment(a, "YYYY-MM-DD", !0),
        i = angular.isDate(t) ? moment(t) : moment(t, e, !0);return !t || angular.isDate(t) || !a.isValid() || i.isSameOrAfter(a);
  }function n(t, e, a) {
    var a = moment(a, "YYYY-MM-DD", !0),
        i = angular.isDate(t) ? moment(t) : moment(t, e, !0);return !t || angular.isDate(t) || !a.isValid() || i.isSameOrBefore(a);
  }function r(t, e, a) {
    var i = angular.isDate(t) ? moment(t) : moment(t, e, !0);return !t || angular.isDate(t) || !angular.isFunction(a) || !a(i);
  }function o(t, e, a, i, n) {
    var r = this;this.VIEW_HOURS = 1, this.VIEW_MINUTES = 2, this.currentView = this.VIEW_HOURS, this.time = moment(a), this.autoSwitch = !!i, this.clockHours = parseInt(this.time.format("h")), this.clockMinutes = parseInt(this.time.minutes()), t.$mdMedia = n, this.switchView = function () {
      r.currentView = r.currentView == r.VIEW_HOURS ? r.VIEW_MINUTES : r.VIEW_HOURS;
    }, this.setAM = function () {
      r.time.hours() >= 12 && r.time.hour(r.time.hour() - 12);
    }, this.setPM = function () {
      r.time.hours() < 12 && r.time.hour(r.time.hour() + 12);
    }, this.cancel = function () {
      e.cancel();
    }, this.confirm = function () {
      e.hide(this.time.toDate());
    };
  }function s(t) {
    var e = "hours",
        a = "minutes",
        i = this;this.STEP_DEG = 30, this.steps = [], this.CLOCK_TYPES = { hours: { range: 12 }, minutes: { range: 60 } }, this.getPointerStyle = function () {
      var t = 1;switch (i.type) {case e:
          t = 12;break;case a:
          t = 60;}var n = Math.round(i.selected * (360 / t)) - 180;return { "-webkit-transform": "rotate(" + n + "deg)", "-ms-transform": "rotate(" + n + "deg)", transform: "rotate(" + n + "deg)" };
    }, this.setTimeByDeg = function (t) {
      t = t >= 360 ? 0 : t;var n = 0;switch (i.type) {case e:
          n = 12;break;case a:
          n = 60;}i.setTime(Math.round(n / 360 * t));
    }, this.setTime = function (t, n) {
      switch (this.selected = t, i.type) {case e:
          "PM" == i.time.format("A") && (t += 12), this.time.hours(t);break;case a:
          t > 59 && (t -= 60), this.time.minutes(t);}
    }, this.init = function () {
      switch (i.type = i.type || "hours", i.type) {case e:
          for (var t = 1; 12 >= t; t++) {
            i.steps.push(t);
          }i.selected = i.time.hours() || 0, i.selected > 12 && (i.selected -= 12);break;case a:
          for (var t = 5; 55 >= t; t += 5) {
            i.steps.push(t);
          }i.steps.push(0), i.selected = i.time.minutes() || 0;}
    }, this.init();
  }var d = angular.module("mdPickers", ["ngMaterial", "ngAnimate", "ngAria"]);d.config(["$mdIconProvider", "mdpIconsRegistry", function (t, e) {
    angular.forEach(e, function (e, a) {
      t.icon(e.id, e.url);
    });
  }]), d.run(["$templateCache", "mdpIconsRegistry", function (t, e) {
    angular.forEach(e, function (e, a) {
      t.put(e.url, e.svg);
    });
  }]), d.constant("mdpIconsRegistry", [{ id: "mdp-chevron-left", url: "mdp-chevron-left.svg", svg: '<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/><path d="M0 0h24v24H0z" fill="none"/></svg>' }, { id: "mdp-chevron-right", url: "mdp-chevron-right.svg", svg: '<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/><path d="M0 0h24v24H0z" fill="none"/></svg>' }, { id: "mdp-access-time", url: "mdp-access-time.svg", svg: '<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/><path d="M0 0h24v24H0z" fill="none"/><path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>' }, { id: "mdp-event", url: "mdp-event.svg", svg: '<svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/><path d="M0 0h24v24H0z" fill="none"/></svg>' }]), d.directive("ngMessage", ["$mdUtil", function (t) {
    return { restrict: "EA", priority: 101, compile: function compile(e) {
        var a = t.getClosest(e, "mdp-time-picker", !0) || t.getClosest(e, "mdp-date-picker", !0);if (a) return e.toggleClass("md-input-message-animation", !0), {};
      } };
  }]), d.provider("$mdpDatePicker", function () {
    var e = "OK",
        a = "Cancel",
        i = "ddd, MMM DD";this.setDisplayFormat = function (t) {
      i = t;
    }, this.setOKButtonLabel = function (t) {
      e = t;
    }, this.setCancelButtonLabel = function (t) {
      a = t;
    }, this.$get = ["$mdDialog", function (n) {
      var r = function r(_r, o) {
        return angular.isDate(_r) || (_r = Date.now()), angular.isObject(o) || (o = {}), o.displayFormat = i, n.show({ controller: ["$scope", "$mdDialog", "$mdMedia", "$timeout", "currentDate", "options", t], controllerAs: "datepicker", clickOutsideToClose: !0, template: '<md-dialog aria-label="" class="mdp-datepicker" ng-class="{ \'portrait\': !$mdMedia(\'gt-xs\') }"><md-dialog-content layout="row" layout-wrap><div layout="column" layout-align="start center"><md-toolbar layout-align="start start" flex class="mdp-datepicker-date-wrapper md-hue-1 md-primary" layout="column"><span class="mdp-datepicker-year" ng-click="datepicker.showYear()" ng-class="{ \'active\': datepicker.selectingYear }">{{ datepicker.date.format(\'YYYY\') }}</span><span class="mdp-datepicker-date" ng-click="datepicker.showCalendar()" ng-class="{ \'active\': !datepicker.selectingYear }">{{ datepicker.date.format(datepicker.displayFormat) }}</span> </md-toolbar></div><div><div class="mdp-datepicker-select-year mdp-animation-zoom" layout="column" layout-align="center start" ng-if="datepicker.selectingYear"><md-virtual-repeat-container md-auto-shrink md-top-index="datepicker.yearTopIndex"><div flex md-virtual-repeat="item in datepicker.yearItems" md-on-demand class="repeated-year"><span class="md-button" ng-click="datepicker.selectYear(item)" md-ink-ripple ng-class="{ \'md-primary current\': item == year }">{{ item }}</span></div></md-virtual-repeat-container></div><mdp-calendar ng-if="!datepicker.selectingYear" class="mdp-animation-zoom" date="datepicker.date" min-date="datepicker.minDate" date-filter="datepicker.dateFilter" max-date="datepicker.maxDate"></mdp-calendar><md-dialog-actions layout="row"><span flex></span><md-button ng-click="datepicker.cancel()" aria-label="' + a + '">' + a + '</md-button><md-button ng-click="datepicker.confirm()" class="md-primary" aria-label="' + e + '">' + e + "</md-button></md-dialog-actions></div></md-dialog-content></md-dialog>", targetEvent: o.targetEvent, locals: { currentDate: _r, options: o }, skipHide: !0 });
      };return r;
    }];
  }), d.directive("mdpCalendar", ["$animate", function (t) {
    return { restrict: "E", bindToController: { date: "=", minDate: "=", maxDate: "=", dateFilter: "=" }, template: '<div class="mdp-calendar"><div layout="row" layout-align="space-between center"><md-button aria-label="previous month" class="md-icon-button" ng-click="calendar.prevMonth()"><md-icon md-svg-icon="mdp-chevron-left"></md-icon></md-button><div class="mdp-calendar-monthyear" ng-show="!calendar.animating">{{ calendar.date.format("MMMM YYYY") }}</div><md-button aria-label="next month" class="md-icon-button" ng-click="calendar.nextMonth()"><md-icon md-svg-icon="mdp-chevron-right"></md-icon></md-button></div><div layout="row" layout-align="space-around center" class="mdp-calendar-week-days" ng-show="!calendar.animating"><div layout layout-align="center center" ng-repeat="d in calendar.weekDays track by $index">{{ d }}</div></div><div layout="row" layout-align="start center" layout-wrap class="mdp-calendar-days" ng-class="{ \'mdp-animate-next\': calendar.animating }" ng-show="!calendar.animating" md-swipe-left="calendar.nextMonth()" md-swipe-right="calendar.prevMonth()"><div layout layout-align="center center" ng-repeat-start="day in calendar.daysInMonth track by $index" ng-class="{ \'mdp-day-placeholder\': !day }"><md-button class="md-icon-button md-raised" aria-label="Select day" ng-if="day" ng-class="{ \'md-accent\': calendar.date.date() == day.value }" ng-click="calendar.selectDate(day.value)" ng-disabled="!day.enabled">{{ day.value }}</md-button></div><div flex="100" ng-if="($index + 1) % 7 == 0" ng-repeat-end></div></div></div>', controller: ["$scope", e], controllerAs: "calendar", link: function link(e, a, i, n) {
        var r = [a[0].querySelector(".mdp-calendar-week-days"), a[0].querySelector(".mdp-calendar-days"), a[0].querySelector(".mdp-calendar-monthyear")].map(function (t) {
          return angular.element(t);
        });e.$watch(function () {
          return n.date.format("YYYYMM");
        }, function (e, a) {
          var i = null;if (e > a ? i = "mdp-animate-next" : a > e && (i = "mdp-animate-prev"), i) for (var n in r) {
            r[n].addClass(i), t.removeClass(r[n], i);
          }
        });
      } };
  }]), d.directive("mdpDatePicker", ["$mdpDatePicker", "$timeout", function (t, e) {
    return { restrict: "E", require: "ngModel", transclude: !0, template: function template(t, e) {
        var a = angular.isDefined(e.mdpNoFloat),
            i = angular.isDefined(e.mdpPlaceholder) ? e.mdpPlaceholder : "",
            n = angular.isDefined(e.mdpOpenOnClick) ? !0 : !1;return '<div layout layout-align="start start"><md-button' + (angular.isDefined(e.mdpDisabled) ? ' ng-disabled="disabled"' : "") + ' class="md-icon-button" ng-click="showPicker($event)"><md-icon md-svg-icon="mdp-event"></md-icon></md-button><md-input-container' + (a ? " md-no-float" : "") + ' md-is-error="isError()"><input type="{{ ::type }}"' + (angular.isDefined(e.mdpDisabled) ? ' ng-disabled="disabled"' : "") + ' aria-label="' + i + '" placeholder="' + i + '"' + (n ? ' ng-click="showPicker($event)" ' : "") + " /></md-input-container></div>";
      }, scope: { minDate: "=mdpMinDate", maxDate: "=mdpMaxDate", dateFilter: "=mdpDateFilter", dateFormat: "@mdpFormat", placeholder: "@mdpPlaceholder", noFloat: "=mdpNoFloat", openOnClick: "=mdpOpenOnClick", disabled: "=?mdpDisabled" }, link: { pre: function pre(t, e, a, i, n) {}, post: function post(e, o, s, d, m) {
          function c(t) {
            p[0].value = t, g.setHasValue(!d.$isEmpty(t));
          }function l(t) {
            var a = moment(t, angular.isDate(t) ? null : e.dateFormat, !0),
                i = a.format(e.dateFormat);a.isValid() ? (c(i), d.$setViewValue(i)) : (c(t), d.$setViewValue(t)), !d.$pristine && f.hasClass("md-auto-hide") && h.hasClass("md-input-invalid") && f.removeClass("md-auto-hide"), d.$render();
          }function u(t) {
            t.target.value !== d.$viewVaue && l(t.target.value);
          }var p = angular.element(o[0].querySelector("input")),
              h = angular.element(o[0].querySelector("md-input-container")),
              g = h.controller("mdInputContainer");m(function (t) {
            h.append(t);
          });var f = angular.element(h[0].querySelector("[ng-messages]"));e.type = e.dateFormat ? "text" : "date", e.dateFormat = e.dateFormat || "YYYY-MM-DD", e.model = d, e.isError = function () {
            return !d.$pristine && !!d.$invalid;
          }, d.$formatters.unshift(function (t) {
            var a = angular.isDate(t) && moment(t);c(a && a.isValid() ? a.format(e.dateFormat) : null);
          }), d.$validators.format = function (t, i) {
            return a(i, e.dateFormat);
          }, d.$validators.minDate = function (t, a) {
            return i(a, e.dateFormat, e.minDate);
          }, d.$validators.maxDate = function (t, a) {
            return n(a, e.dateFormat, e.maxDate);
          }, d.$validators.filter = function (t, a) {
            return r(a, e.dateFormat, e.dateFilter);
          }, d.$validators.required = function (t, e) {
            return angular.isUndefined(s.required) || !d.$isEmpty(t) || !d.$isEmpty(e);
          }, d.$parsers.unshift(function (t) {
            var a = moment(t, e.dateFormat, !0);if (a.isValid()) {
              if (angular.isDate(d.$modelValue)) {
                var i = moment(d.$modelValue);i.year(a.year()), i.month(a.month()), i.date(a.date()), a = i;
              }return a.toDate();
            }return null;
          }), e.showPicker = function (a) {
            t(d.$modelValue, { minDate: e.minDate, maxDate: e.maxDate, dateFilter: e.dateFilter, targetEvent: a }).then(l);
          }, p.on("reset input blur", u), e.$on("$destroy", function () {
            p.off("reset input blur", u);
          });
        } } };
  }]), d.directive("mdpDatePicker", ["$mdpDatePicker", "$timeout", function (t, e) {
    return { restrict: "A", require: "ngModel", scope: { minDate: "@min", maxDate: "@max", dateFilter: "=mdpDateFilter", dateFormat: "@mdpFormat" }, link: function link(e, o, s, d, m) {
        function c(a) {
          t(d.$modelValue, { minDate: e.minDate, maxDate: e.maxDate, dateFilter: e.dateFilter, targetEvent: a }).then(function (t) {
            d.$setViewValue(moment(t).format(e.format)), d.$render();
          });
        }e.dateFormat = e.dateFormat || "YYYY-MM-DD", d.$validators.format = function (t, i) {
          return a(i, e.format);
        }, d.$validators.minDate = function (t, a) {
          return i(a, e.format, e.minDate);
        }, d.$validators.maxDate = function (t, a) {
          return n(a, e.format, e.maxDate);
        }, d.$validators.filter = function (t, a) {
          return r(a, e.format, e.dateFilter);
        }, o.on("click", c), e.$on("$destroy", function () {
          o.off("click", c);
        });
      } };
  }]), d.directive("mdpClock", ["$animate", "$timeout", function (t, e) {
    return { restrict: "E", bindToController: { type: "@?", time: "=", autoSwitch: "=?" }, replace: !0, template: '<div class="mdp-clock"><div class="mdp-clock-container"><md-toolbar class="mdp-clock-center md-primary"></md-toolbar><md-toolbar ng-style="clock.getPointerStyle()" class="mdp-pointer md-primary"><span class="mdp-clock-selected md-button md-raised md-primary"></span></md-toolbar><md-button ng-class="{ \'md-primary\': clock.selected == step }" class="md-icon-button md-raised mdp-clock-deg{{ ::(clock.STEP_DEG * ($index + 1)) }}" ng-repeat="step in clock.steps" ng-click="clock.setTime(step)">{{ step }}</md-button></div></div>', controller: ["$scope", s], controllerAs: "clock", link: function link(t, a, i, n) {
        var r = (angular.element(a[0].querySelector(".mdp-pointer")), t.$parent.timepicker),
            o = function o(t) {
          var a = t.currentTarget.getClientRects()[0],
              i = t.currentTarget.offsetWidth / 2 - (t.pageX - a.left),
              o = t.pageY - a.top - t.currentTarget.offsetHeight / 2,
              s = Math.round(Math.atan2(i, o) * (180 / Math.PI));e(function () {
            n.setTimeByDeg(s + 180), n.autoSwitch && -1 !== ["mouseup", "click"].indexOf(t.type) && r && r.switchView();
          });
        };a.on("mousedown", function () {
          a.on("mousemove", o);
        }), a.on("mouseup", function (t) {
          a.off("mousemove");
        }), a.on("click", o), t.$on("$destroy", function () {
          a.off("click", o), a.off("mousemove", o);
        });
      } };
  }]), d.provider("$mdpTimePicker", function () {
    var t = "OK",
        e = "Cancel";this.setOKButtonLabel = function (e) {
      t = e;
    }, this.setCancelButtonLabel = function (t) {
      e = t;
    }, this.$get = ["$mdDialog", function (a) {
      var i = function i(_i, n) {
        return angular.isDate(_i) || (_i = Date.now()), angular.isObject(n) || (n = {}), a.show({ controller: ["$scope", "$mdDialog", "time", "autoSwitch", "$mdMedia", o], controllerAs: "timepicker", clickOutsideToClose: !0, template: '<md-dialog aria-label="" class="mdp-timepicker" ng-class="{ \'portrait\': !$mdMedia(\'gt-xs\') }"><md-dialog-content layout-gt-xs="row" layout-wrap><md-toolbar layout-gt-xs="column" layout-xs="row" layout-align="center center" flex class="mdp-timepicker-time md-hue-1 md-primary"><div class="mdp-timepicker-selected-time"><span ng-class="{ \'active\': timepicker.currentView == timepicker.VIEW_HOURS }" ng-click="timepicker.currentView = timepicker.VIEW_HOURS">{{ timepicker.time.format("h") }}</span>:<span ng-class="{ \'active\': timepicker.currentView == timepicker.VIEW_MINUTES }" ng-click="timepicker.currentView = timepicker.VIEW_MINUTES">{{ timepicker.time.format("mm") }}</span></div><div layout="column" class="mdp-timepicker-selected-ampm"><span ng-click="timepicker.setAM()" ng-class="{ \'active\': timepicker.time.hours() < 12 }">AM</span><span ng-click="timepicker.setPM()" ng-class="{ \'active\': timepicker.time.hours() >= 12 }">PM</span></div></md-toolbar><div><div class="mdp-clock-switch-container" ng-switch="timepicker.currentView" layout layout-align="center center"><mdp-clock class="mdp-animation-zoom" auto-switch="timepicker.autoSwitch" time="timepicker.time" type="hours" ng-switch-when="1"></mdp-clock><mdp-clock class="mdp-animation-zoom" auto-switch="timepicker.autoSwitch" time="timepicker.time" type="minutes" ng-switch-when="2"></mdp-clock></div><md-dialog-actions layout="row"><span flex></span><md-button ng-click="timepicker.cancel()" aria-label="' + e + '">' + e + '</md-button><md-button ng-click="timepicker.confirm()" class="md-primary" aria-label="' + t + '">' + t + "</md-button></md-dialog-actions></div></md-dialog-content></md-dialog>", targetEvent: n.targetEvent, locals: { time: _i, autoSwitch: n.autoSwitch }, skipHide: !0 });
      };return i;
    }];
  }), d.directive("mdpTimePicker", ["$mdpTimePicker", "$timeout", function (t, e) {
    return { restrict: "E", require: "ngModel", transclude: !0, template: function template(t, e) {
        var a = angular.isDefined(e.mdpNoFloat),
            i = angular.isDefined(e.mdpPlaceholder) ? e.mdpPlaceholder : "",
            n = angular.isDefined(e.mdpOpenOnClick) ? !0 : !1;return '<div layout layout-align="start start"><md-button class="md-icon-button" ng-click="showPicker($event)"' + (angular.isDefined(e.mdpDisabled) ? ' ng-disabled="disabled"' : "") + '><md-icon md-svg-icon="mdp-access-time"></md-icon></md-button><md-input-container' + (a ? " md-no-float" : "") + ' md-is-error="isError()"><input type="{{ ::type }}"' + (angular.isDefined(e.mdpDisabled) ? ' ng-disabled="disabled"' : "") + ' aria-label="' + i + '" placeholder="' + i + '"' + (n ? ' ng-click="showPicker($event)" ' : "") + " /></md-input-container></div>";
      }, scope: { timeFormat: "@mdpFormat", placeholder: "@mdpPlaceholder", autoSwitch: "=?mdpAutoSwitch", disabled: "=?mdpDisabled" }, link: function link(e, a, i, n, r) {
        function o(t) {
          m[0].value = t, l.setHasValue(!n.$isEmpty(t));
        }function s(t) {
          var a = moment(t, angular.isDate(t) ? null : e.timeFormat, !0),
              i = a.format(e.timeFormat);a.isValid() ? (o(i), n.$setViewValue(i)) : (o(t), n.$setViewValue(t)), !n.$pristine && u.hasClass("md-auto-hide") && c.hasClass("md-input-invalid") && u.removeClass("md-auto-hide"), n.$render();
        }function d(t) {
          t.target.value !== n.$viewVaue && s(t.target.value);
        }var m = angular.element(a[0].querySelector("input")),
            c = angular.element(a[0].querySelector("md-input-container")),
            l = c.controller("mdInputContainer");r(function (t) {
          c.append(t);
        });var u = angular.element(c[0].querySelector("[ng-messages]"));e.type = e.timeFormat ? "text" : "time", e.timeFormat = e.timeFormat || "HH:mm", e.autoSwitch = e.autoSwitch || !1, e.$watch(function () {
          return n.$error;
        }, function (t, e) {
          l.setInvalid(!n.$pristine && !!Object.keys(n.$error).length);
        }, !0), n.$formatters.unshift(function (t) {
          var a = angular.isDate(t) && moment(t);o(a && a.isValid() ? a.format(e.timeFormat) : null);
        }), n.$validators.format = function (t, a) {
          return !a || angular.isDate(a) || moment(a, e.timeFormat, !0).isValid();
        }, n.$validators.required = function (t, e) {
          return angular.isUndefined(i.required) || !n.$isEmpty(t) || !n.$isEmpty(e);
        }, n.$parsers.unshift(function (t) {
          var a = moment(t, e.timeFormat, !0);if (a.isValid()) {
            if (angular.isDate(n.$modelValue)) {
              var i = moment(n.$modelValue);i.minutes(a.minutes()), i.hours(a.hours()), i.seconds(a.seconds()), a = i;
            }return a.toDate();
          }return null;
        }), e.showPicker = function (a) {
          t(n.$modelValue, { targetEvent: a, autoSwitch: e.autoSwitch }).then(function (t) {
            s(t, !0);
          });
        }, m.on("reset input blur", d), e.$on("$destroy", function () {
          m.off("reset input blur", d);
        });
      } };
  }]), d.directive("mdpTimePicker", ["$mdpTimePicker", "$timeout", function (t, e) {
    return { restrict: "A", require: "ngModel", scope: { timeFormat: "@mdpFormat", autoSwitch: "=?mdpAutoSwitch" }, link: function link(e, a, i, n, r) {
        function o(a) {
          t(n.$modelValue, { targetEvent: a, autoSwitch: e.autoSwitch }).then(function (t) {
            n.$setViewValue(moment(t).format(e.format)), n.$render();
          });
        }e.format = e.format || "HH:mm", a.on("click", o), e.$on("$destroy", function () {
          a.off("click", o);
        });
      } };
  }]);
}();
//# sourceMappingURL=mdPickers.min.js.map
//# sourceMappingURL=mdPickers.min.js.map

'use strict';

(function () {
	'use strict';

	angular.module('mediaboxApp').factory('Modal', Modal).controller('ModalController', ModalController);

	// Modal.$inject = ['$mdDialog', '$state'];
	// ModalController.$inject = ['$mdDialog', 'Toast', '$http', 'options', 'cols', 'Settings', '$filter'];

	function Modal($mdDialog, $state) {

		var obj = {};
		obj.show = function (cols, options) {
			$mdDialog.show({
				controller: 'ModalController as create',
				templateUrl: 'components/modal/create.html',
				clickOutsideToClose: false,
				locals: { cols: cols, options: options }
			}).then(transitionTo, transitionTo);
		};

		return obj;
	}

	function transitionTo(answer) {
		// return $state.go('detail', { location: false });
	}

	function ModalController($mdDialog, Toast, $http, options, cols, Settings, $filter) {
		var vm = this;
		vm.create = createUser;
		vm.close = hideDialog;
		vm.cancel = cancelDialog;
		vm.options = options;
		vm.options.columns = cols;
		vm.title = options.api;
		function createUser(form) {
			// refuse to work with invalid cols
			if (vm.item._id || form && !form.$valid) {
				return;
			}
			// 
			// $http.post('/api/sendmail', {
			// 	from: 'Biri.in <codenxg@gmail.com>',
			//   to: '2lessons@gmail.com',
			//   subject: 'Message from Biri.in',
			//   text: vm.item.title
			// });

			$http.post('/api/' + $filter('pluralize')(options.api), vm.item).then(createUserSuccess).catch(createUserCatch);
			function createUserSuccess(response) {
				var item = vm.item = response.data;
				Toast.show({
					type: 'success',
					text: 'New ' + options.api + ' saved successfully.'
				});
				vm.close();
			}

			function createUserCatch(err) {
				// if (form && err) {
				// 	form.setResponseErrors(err);
				// }

				Toast.show({
					type: 'warn',
					text: 'Error while creating new ' + options.api
				});
			}
		}

		function hideDialog() {
			$mdDialog.hide();
		}

		function cancelDialog() {
			$mdDialog.cancel();
		}
	}
})();
//# sourceMappingURL=modal.service.js.map

'use strict';

/**
 * Removes server error when user updates input
 */

angular.module('mediaboxApp').directive('mongooseError', function () {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function link(scope, element, attrs, ngModel) {
      element.on('keydown', function () {
        return ngModel.$setValidity('mongoose', true);
      });
    }
  };
});
//# sourceMappingURL=mongoose-error.directive.js.map

'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NavbarPublicController = function NavbarPublicController(ToggleComponent, Auth, $attrs, Settings, $scope, $rootScope, $location, Cart, Category, Brand, $q, Product, $state, $timeout, $log) {
  _classCallCheck(this, NavbarPublicController);

  var vm = this;

  /* autocomplete */
  vm.simulateQuery = true;
  vm.isDisabled = false;
  vm.products = [];
  vm.querySearch = querySearch;
  vm.selectedItemChange = selectedItemChange;
  vm.searchTextChange = searchTextChange;
  vm.cart = Cart.cart;

  // ******************************
  // Internal methods
  // ******************************
  /**
   * Search for products... use $timeout to simulate
   * remote dataservice call.
   */
  vm.categories = Category();
  vm.Settings = Settings;
  vm.cart.getBestShipper(Settings.country).$promise.then(function (data) {
    vm.shipping = data[0];
    vm.totalPriceAfterShipping = vm.cartTotal + data[0].charge;
  });

  function querySearch(input) {
    var data = [];
    if (input) {
      input = input.toLowerCase();
      data = Product.query({ where: { nameLower: { '$regex': input }, active: true }, limit: 10, skip: 0, select: { id: 1, name: 1, slug: 1 } });
    }
    return data;
  }
  function searchTextChange(text) {
    //   $log.info('Text changed to ' + text);
  }

  function selectedItemChange(item) {
    $state.go('single-product', { id: item._id, slug: item.slug }, { reload: false });
  }

  /**
   * Create filter function for a query string
   */

  vm.isLoggedIn = Auth.isLoggedIn;
  vm.openFilter = function () {
    ToggleComponent('filtermenu').open();
  };
  vm.openCart = function () {
    ToggleComponent('cart').open();
  };
  var originatorEv;
  vm.openMenu = function ($mdOpenMenu, ev) {
    originatorEv = ev;
    $mdOpenMenu(ev);
  };

  vm.menu = [{
    'title': 'Home',
    'link': '/'
  }];

  vm.brands = Brand.query({ active: true });

  vm.isCollapsed = true;
  vm.isCollapsed1 = true;
  vm.getCurrentUser = Auth.getCurrentUser;

  vm.getQuantity = function (sku) {
    for (var i = 0; i < vm.cart.items.length; i++) {
      if (vm.cart.items[i].sku === sku) {
        return vm.cart.items[i].quantity;
      }
    }
  };

  vm.getQuantity = function (sku) {
    for (var i = 0; i < vm.cart.items.length; i++) {
      if (vm.cart.items[i].sku === sku) {
        return vm.cart.items[i].quantity;
      }
    }
  };
  vm.toggle = function (item, list) {
    if (angular.isUndefined(list)) list = [];
    var idx = list.indexOf(item);
    if (idx > -1) list.splice(idx, 1);else list.push(item);
    vm.filter();
  };

  vm.categories = Category.query();

  vm.close = function () {
    ToggleComponent('cart').close();
  };
};

angular.module('mediaboxApp').controller('NavbarPublicController', NavbarPublicController);
//# sourceMappingURL=navbar-public.controller.js.map

'use strict';

angular.module('mediaboxApp').directive('navbarPublic', function () {
  return {
    templateUrl: 'components/navbar-public/navbar-public.html',
    restrict: 'E',
    controller: 'NavbarPublicController',
    controllerAs: 'vm'
  };
});
//# sourceMappingURL=navbar-public.directive.js.map

'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NavbarController = function NavbarController(ToggleComponent, Auth, Settings, Cart, Category, Brand, Product, $state, $stateParams, $mdMedia) {
  _classCallCheck(this, NavbarController);

  var vm = this;

  /* autocomplete */
  vm.simulateQuery = true;
  vm.querySearch = querySearch;
  vm.selectedItemChange = selectedItemChange;
  vm.searchTextChange = searchTextChange;
  vm.products = [];
  vm.cart = Cart.cart;
  vm.Settings = Settings;
  vm.$mdMedia = $mdMedia;

  //console.log(vm.cart);
  // var productId = localStorage !== null ? localStorage.productId : null;

  if ($stateParams.search) // When searched print the search text inside search textbox 
    vm.searchText = $stateParams.name;

  vm.cart.getBestShipper().$promise.then(function (data) {
    vm.shipping = data[0];
    vm.totalPriceAfterShipping = vm.cartTotal + data[0].charge;
  });
  function querySearch(input) {
    var data = [];
    if (input) {
      input = input.toLowerCase();
      data = Product.query({ where: { nameLower: { '$regex': input }, active: true }, limit: 10, skip: 0, select: { id: 1, name: 1, slug: 1, 'variants.image': 1, logo: 1 } });
    }
    return data;
  }

  function selectedItemChange(item) {
    $state.go('single-product', { id: item._id, slug: item.slug, search: true, name: item.name }, { reload: false });
  }
  function searchTextChange() {}
  /**
   * Create filter function for a query string
   */

  vm.isLoggedIn = Auth.isLoggedIn;
  vm.openFilter = function () {
    ToggleComponent('filtermenu').open();
  };
  vm.openCart = function () {
    ToggleComponent('cart').open();
    vm.cart.getBestShipper().$promise.then(function (data) {
      vm.shipping = data[0];
      vm.totalPriceAfterShipping = vm.cartTotal + data[0].charge;
    });
  };
  var originatorEv;
  vm.openMenu = function ($mdOpenMenu, ev) {
    originatorEv = ev;
    $mdOpenMenu(ev);
  };

  vm.menu = [{
    'title': 'Home',
    'link': '/'
  }];

  vm.brands = Brand.query({ active: true });

  vm.isCollapsed = true;
  vm.isCollapsed1 = true;
  vm.getCurrentUser = Auth.getCurrentUser;

  vm.gotoDetail = function (params) {
    $state.go('single-product', { id: params.sku, slug: params.slug }, { reload: false });
  };

  vm.getQuantity = function (sku) {
    for (var i = 0; i < vm.cart.items.length; i++) {
      if (vm.cart.items[i].sku === sku) {
        return vm.cart.items[i].quantity;
      }
    }
  };

  vm.getQuantity = function (sku) {
    for (var i = 0; i < vm.cart.items.length; i++) {
      if (vm.cart.items[i].sku === sku) {
        return vm.cart.items[i].quantity;
      }
    }
  };
  vm.toggle = function (item, list) {
    //   console.log(item,list);
    if (angular.isUndefined(list)) list = [];
    var idx = list.indexOf(item);
    if (idx > -1) list.splice(idx, 1);else list.push(item);
    vm.filter();
  };

  vm.categories = Category.loaded.query();

  console.log(vm.categories);

  vm.close = function () {
    ToggleComponent('cart').close();
  };
};

angular.module('mediaboxApp').controller('NavbarController', NavbarController);
//# sourceMappingURL=navbar.controller.js.map

'use strict';

angular.module('mediaboxApp').directive('navbar', function () {
  return {
    templateUrl: 'components/navbar/navbar.html',
    restrict: 'E',
    controller: 'NavbarController',
    controllerAs: 'vm'
  };
});
//# sourceMappingURL=navbar.directive.js.map

'use strict';

angular.module('mediaboxApp').controller('OauthButtonsCtrl', function ($window) {
  this.loginOauth = function (provider) {
    if (provider === 'facebook') this.facebookLoading = true;
    if (provider === 'google') this.googleLoading = true;
    if (provider === 'twitter') this.twitterLoading = true;
    $window.location.href = '/auth/' + provider;
  };
});
//# sourceMappingURL=oauth-buttons.controller.js.map

'use strict';

angular.module('mediaboxApp').directive('oauthButtons', function () {
  return {
    templateUrl: 'components/oauth-buttons/oauth-buttons.html',
    restrict: 'EA',
    controller: 'OauthButtonsCtrl',
    controllerAs: 'OauthButtons',
    scope: {
      classes: '@'
    }
  };
});
//# sourceMappingURL=oauth-buttons.directive.js.map

'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var ratingComponent =
  /*@ngInject*/
  function ratingComponent($timeout) {
    _classCallCheck(this, ratingComponent);

    var vm = this;
    // if (vm.readOnly === undefined) vm.readOnly = false
    var starsArray = [];
    // Initialize to 5 stars 
    for (var index = 0; index < 5; index++) {
      var starItem = {
        index: index,
        class: 'star-off'
      };
      starsArray.push(starItem);
    }
    vm.starsArray = starsArray;

    // On mousover
    vm.setMouseOverRating = function (rating) {
      if (vm.readOnly) {
        return;
      }
      vm.validateStars(rating);
    };
    // Highlight stars
    vm.validateStars = function (rating) {
      if (!vm.starsArray || vm.starsArray.length === 0) {
        return;
      }
      for (var index = 0; index < vm.starsArray.length; index++) {
        var starItem = vm.starsArray[index];
        if (index <= rating - 1) {
          starItem.class = 'star-on';
        } else {
          starItem.class = 'star-off';
        }
      }
    };

    // On click select star
    vm.setRating = function (rating) {
      if (vm.readOnly) return;
      vm.rating = rating;
      vm.validateStars(vm.rating);
      $timeout(function () {
        vm.onRating({
          rating: vm.rating
        });
      });
    };
  };

  angular.module('mediaboxApp').component('rating', {
    template: '\n    <div class="angular-material-rating" layout="row">  \n      <a class="button star-button" ng-class="item.class"    ng-mouseover="$ctrl.setMouseOverRating($index + 1)"    ng-mouseleave="$ctrl.setMouseOverRating($ctrl.rating)"    ng-click="$ctrl.setRating($index + 1)" ng-repeat="item in $ctrl.starsArray">\n        <ng-md-icon icon="star"></ng-md-icon>  \n      </a>\n    </div>\n    ',
    bindings: {
      message: '<', // Read only
      max: '@?', // String
      rating: '=?', // 2way
      readOnly: '=?', // 2way
      onRating: '&' // Callback
    },
    controller: ratingComponent
  });
})();
//# sourceMappingURL=rating.component.js.map

'use strict';

angular.module('mediaboxApp').directive('remoteUnique', function () {
  return {
    template: '<div></div>',
    restrict: 'EA',
    link: function link(scope, element, attrs) {
      element.text('this is the remoteUnique directive');
    }
  };
});
//# sourceMappingURL=remote-unique.directive.js.map

'use strict';

(function () {
	'use strict';

	// register the service as RepeatInput

	angular.module('mediaboxApp').directive('repeatInput', RepeatInput);

	// add RepeatInput dependencies to inject
	// RepeatInput.$inject = [''];

	/**
  * RepeatInput directive
  */
	function RepeatInput() {
		// directive definition members
		var directive = {
			link: link,
			restrict: 'A',
			require: 'ngModel'
		};

		return directive;

		// directives link definition
		function link(scope, elem, attrs, model) {
			if (!attrs.repeatInput) {
				console.error('repeatInput expects a model as an argument!');
				return;
			}

			scope.$watch(attrs.repeatInput, function (value) {
				// Only compare values if the second ctrl has a value.
				if (model.$viewValue !== undefined && model.$viewValue !== '') {
					model.$setValidity('repeat-input', value === model.$viewValue);
				}
			});

			model.$parsers.push(function (value) {
				// Mute the repeatInput error if the second ctrl is empty.
				if (value === undefined || value === '') {
					model.$setValidity('repeat-input', true);
					return value;
				}

				var isValid = value === scope.$eval(attrs.repeatInput);
				model.$setValidity('repeat-input', isValid);
				return isValid ? value : undefined;
			});
		}
	}
})();
//# sourceMappingURL=repeat-input.directive.js.map

'use strict';

angular.module('mediaboxApp').controller('RightMenuCtrl', function () {});
//# sourceMappingURL=right-menu.controller.js.map

'use strict';

angular.module('mediaboxApp').config(function ($stateProvider) {
  $stateProvider.state('right-menu', {
    url: '/right-menu',
    templateUrl: 'components/right-menu/right-menu.html',
    controller: 'RightMenuCtrl'
  });
});
//# sourceMappingURL=right-menu.js.map

/* global io */
'use strict';

angular.module('mediaboxApp').factory('socket', function (socketFactory) {
  // socket.io now auto-configures its connection when we ommit a connection url
  var ioSocket = io('', {
    // Send auth token on connection, you will need to DI the Auth service above
    // 'query': 'token=' + Auth.getToken()
    path: '/socket.io-client'
  });

  var socket = socketFactory({ ioSocket: ioSocket });

  return {
    socket: socket,

    /**
     * Register listeners to sync an array with updates on a model
     *
     * Takes the array we want to sync, the model name that socket updates are sent from,
     * and an optional callback function after new items are updated.
     *
     * @param {String} modelName
     * @param {Array} array
     * @param {Function} cb
     */
    syncUpdates: function syncUpdates(modelName, array, cb) {
      cb = cb || angular.noop;

      /**
       * Syncs item creation/updates on 'model:save'
       */
      socket.on(modelName + ':save', function (item) {
        var oldItem = _.find(array, { _id: item._id });
        var index = array.indexOf(oldItem);
        var event = 'created';

        // replace oldItem if it exists
        // otherwise just add item to the collection
        if (oldItem) {
          array.splice(index, 1, item);
          event = 'updated';
        } else {
          array.push(item);
        }

        cb(event, item, array);
      });

      /**
       * Syncs removed items on 'model:remove'
       */
      socket.on(modelName + ':remove', function (item) {
        var event = 'deleted';
        _.remove(array, { _id: item._id });
        cb(event, item, array);
      });
    },


    /**
     * Removes listeners for a models updates on the socket
     *
     * @param modelName
     */
    unsyncUpdates: function unsyncUpdates(modelName) {
      socket.removeAllListeners(modelName + ':save');
      socket.removeAllListeners(modelName + ':remove');
    }
  };
});
//# sourceMappingURL=socket.service.js.map

'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var submitButtonComponent =
  /*@ngInject*/
  function submitButtonComponent($timeout) {
    _classCallCheck(this, submitButtonComponent);
  };

  angular.module('mediaboxApp').component('submitButton', {
    template: '\n    <div layout="column" layout-align="center stretch">\n\t    <md-button type="submit" class="md-raised circular-progress-button md-primary" ng-disabled="!$ctrl.form.$valid || $ctrl.loading" aria-label="{{$ctrl.text}}">\n\t\t\t\t<span  layout="row" layout-align="center center">\n\t\t\t\t\t<ng-md-icon icon="lock" ng-hide="$ctrl.loading"></ng-md-icon>\n\t\t\t\t\t<md-progress-circular md-mode="indeterminate" md-diameter="25" ng-show="$ctrl.loading" class="md-accent md-hue-1"></md-progress-circular>\n\t\t\t\t\t<span flex>{{$ctrl.text}}</span>\n\t\t\t\t</span>\n\t    </md-button>\n\t\t</div>\n    ',
    bindings: {
      loading: '<', // Read only
      form: '<', // String
      text: '@?' // 2way
    },
    controller: submitButtonComponent
  });
})();
//# sourceMappingURL=submit-button.component.js.map

'use strict';

/**
 * @ngdoc overview
 * @name toast
 * @requires ui.router
 * @requires ngMaterial
 * @description
 * The materialApp.toast module
 */

/**
 * @ngdoc service
 * @name toast.service:Toast
 * @description
 * Service which wraps $mdToast to simplify usage thereof
 */

(function () {
	'use strict';

	angular.module('mediaboxApp').service('Toast', ToastService).controller('ToastController', ToastController);

	/**
  * @ngdoc function
  * @name toast.service:ToastService
  * @description
  * Provider for the {@link toast.service:Toast Toast-service}
  *
  * AngularJS will instantiate a singleton by calling "new" on this function
  *
  * @param {$mdToast} $mdToast The toast service to use
  * @returns {Object} The service definition for the Toast Service
  */

	ToastService.$inject = ['$mdToast'];

	function ToastService($mdToast) {

		return {
			show: showToast,
			hide: hideToast
		};

		/**
   * @ngdoc function
   * @name showToast
   * @methodOf toast.service:Toast
   * @description
   * Display a toast with the given content. If the content is falsy
   * use vm.message.text instead.
   *
   * @param {String|Object} content The toasts content or message object.
   * If an object, the text property will be used as the toast content.
   *
   * @param {Object} [options] Options object passed to the toast service
   * @returns {Promise} The mdToast promise
   */
		function showToast(content, options) {
			if (!options) {
				options = {
					hideDelay: 3000,
					parent: '.toast-container',
					position: 'bottom',
					controller: 'ToastController',
					controllerAs: 'vm',
					templateUrl: 'components/toast/toast.html',
					locals: {
						type: content.type || 'info',
						text: content.text || content,
						link: content.link || false
					}
				};

				// set defaults for content.type warn
				if (content.type && content.type === 'warn') {
					options.hideDelay = 0;
				} else if (content.type && content.type === 'success') {
					options.hideDelay = 5000;
				}
			}

			return $mdToast.show(options);
		}

		/**
   * @ngdoc function
   * @name hideToast
   * @methodOf toast.service:Toast
   * @description
   * Hide the current toast
   * @returns {Promise} The mdToast promise
   */
		function hideToast() {
			return $mdToast.hide();
		}
	}

	/**
  * @ngdoc controller
  * @name toast.controller:ToastController
  * @description
  * ToastController
  *
  * Controller for the custom toast template
  *
  * @param {$mdToast} $mdToast - The toast service to use
  * @param {$state} $state - The state service to use
  * @param {String} type - Type of the information
  * @param {String} text - The toast message
  * @param {String|Object} link - The link or state config object to navigate to
  * @returns {Object} The service definition for the Toast Service
  */

	ToastController.$inject = ['$mdToast', '$state', 'type', 'text', 'link'];

	function ToastController($mdToast, $state, type, text, link) {
		var vm = this;

		/**
   * @ngdoc property
   * @name text
   * @description
   * Some awesome text
   * @propertyOf toast.controller:ToastController
   */
		vm.text = text;

		/**
   * @ngdoc property
   * @name link
   * @description
   * Some awesome link
   * @propertyOf toast.controller:ToastController
   */
		vm.link = link;

		/**
   * @ngdoc property
   * @name type
   * @description
   * Some awesome type
   * @propertyOf toast.controller:ToastController
   */
		vm.type = type;

		// functions (documented below)
		vm.showItem = showItem;
		vm.close = closeToast;

		/**
   * @ngdoc function
   * @name showItem
   * @description
   * Navigate to the injected state
   * @methodOf toast.controller:ToastController
   * @api private
   */
		function showItem() {
			vm.close();
			$state.go(vm.link.state, vm.link.params);
		}

		/**
   * @ngdoc function
   * @name closeToast
   * @description
   * Close the current toast
   * @methodOf toast.controller:ToastController
   * @api private
   */
		function closeToast() {
			$mdToast.hide();
		}
	}
})();
//# sourceMappingURL=toast.service.js.map

'use strict';

(function () {
	'use strict';

	/**
  * Register the ToggleComponentDirective directive as toggleComponent.
  * Register the directive controller as ToggleComponentController
  * @module materialApp.toggleComponent
  * @name ToggleComponent
  */

	angular.module('mediaboxApp').directive('toggleComponent', ToggleComponentDirective).controller('ToggleComponentController', ToggleComponentController);

	// inject dependencies for the ToggleComponentDirective
	ToggleComponentDirective.$inject = ['$timeout', '$animate', '$parse', '$mdMedia', '$mdConstant', '$q', '$document'];

	/**
  * Directive for components that can be toggled.
  *
  * @ngdoc directive
  * @name ToggleComponentDirective
  * @module materialApp.toggleComponent
  *
  * @param $timeout
  * @param $animate
  * @param $parse
  * @param $mdMedia
  * @param $mdConstant
  * @param $q
  * @param $document
  * @returns {{restrict: string, scope: {isOpen: string}, controller: string, compile: Function}}
  * @constructor
  */
	function ToggleComponentDirective($timeout, $animate, $parse, $mdMedia, $mdConstant, $q, $document) {
		return {
			restrict: 'A',

			scope: {
				isOpen: '=?toggleComponentIsOpen',
				keyDown: '=?toggleComponentOnKeydown'
			},

			controller: 'ToggleComponentController',

			compile: function compile(element) {
				element.addClass('toggle-component-closed');
				element.attr('tabIndex', '-1');
				return postLink;
			}
		};

		/**
   * Directive Post Link function
   */
		function postLink(scope, element, attr, toggleComponentCtrl) {
			var triggeringElement = null;
			var promise = $q.when(true);
			var isLockedOpenParsed = $parse(attr.toggleComponentIsOpen);
			var isLocked = function isLocked() {
				return isLockedOpenParsed(scope.$parent, { $media: $mdMedia });
			};

			element.on('$destroy', toggleComponentCtrl.destroy);
			scope.$watch(isLocked, updateIsLocked);
			scope.$watch('isOpen', updateIsOpen);

			// Publish special accessor for the Controller instance
			toggleComponentCtrl.$toggleOpen = toggleOpen;

			/**
    * Toggle the DOM classes to indicate `locked`
    * @param isLocked
    */
			function updateIsLocked(isLocked, oldValue) {
				if (isLocked === oldValue) {
					element.toggleClass('toggle-component-locked-open', !!isLocked);
				} else {
					$animate[isLocked ? 'addClass' : 'removeClass'](element, 'toggle-component-locked-open');
				}
			}

			/**
    * Toggle the toggleComponent view and attach/detach listeners
    * @param isOpen
    */
			function updateIsOpen(isOpen) {
				var parent = element.parent();

				if (scope.keyDown) {
					parent[isOpen ? 'on' : 'off']('keydown', onKeyDown);
				}

				if (isOpen) {
					triggeringElement = $document[0].activeElement;
				}

				return promise = $q.all([$animate[isOpen ? 'removeClass' : 'addClass'](element, 'toggle-component-closed').then(function setElementFocus() {
					if (scope.isOpen) {
						element.focus();
					}
				})]);
			}

			/**
    * Toggle the toggleComponent view and publish a promise to be resolved when
    * the view animation finishes.
    *
    * @param isOpen
    * @returns {*}
    */
			function toggleOpen(isOpen) {
				if (scope.isOpen === isOpen) {
					return $q.when(true);
				}
				var deferred = $q.defer();
				// Toggle value to force an async `updateIsOpen()` to run
				scope.isOpen = isOpen;
				$timeout(setElementFocus, 0, false);

				return deferred.promise;

				function setElementFocus() {
					// When the current `updateIsOpen()` animation finishes
					promise.then(function (result) {
						if (!scope.isOpen) {
							// reset focus to originating element (if available) upon close
							triggeringElement && triggeringElement.focus();
							triggeringElement = null;
						}

						deferred.resolve(result);
					});
				}
			}

			/**
    * Auto-close toggleComponent when the `escape` key is pressed.
    * @param evt
    */
			function onKeyDown(ev) {
				var isEscape = ev.keyCode === $mdConstant.KEY_CODE.ESCAPE;
				return isEscape ? close(ev) : $q.when(true);
			}

			/**
    * With backdrop `clicks` or `escape` key-press, immediately
    * apply the CSS close transition... Then notify the controller
    * to close() and perform its own actions.
   function close(ev) {
   	ev.preventDefault();
   	ev.stopPropagation();
   	return toggleComponentCtrl.close();
   }
    */
		}
	}

	// inject dependencies for the ToggleComponentController
	ToggleComponentController.$inject = ['$scope', '$element', '$attrs', '$q', '$mdComponentRegistry'];

	/**
  * @private
  * @ngdoc controller
  * @name ToggleComponentController
  * @module materialApp.toggleComponent
  *
  */
	function ToggleComponentController($scope, $element, $attrs, $q, $mdComponentRegistry) {
		var self = this;

		// Use Default internal method until overridden by directive postLink

		self.toggleOpen = function () {
			return $q.when($scope.isOpen);
		};

		self.isOpen = function () {
			return !!$scope.isOpen;
		};

		self.open = function () {
			return self.$toggleOpen(true);
		};

		self.close = function () {
			return self.$toggleOpen(false);
		};

		self.toggle = function () {
			return self.$toggleOpen(!$scope.isOpen);
		};

		self.destroy = $mdComponentRegistry.register(self, $attrs.mdComponentId);
	}
})();
//# sourceMappingURL=toggle-component.directive.js.map

'use strict';

(function () {
	'use strict';

	/**
  * Register the service as ToggleComponent
  * @module materialApp.toggleComponent
  * @name ToggleComponent
  */

	angular.module('mediaboxApp').service('ToggleComponent', ToggleComponentService);

	// add ToggleComponent dependencies to inject
	ToggleComponentService.$inject = ['$mdComponentRegistry', '$log', '$q'];

	/**
  * ToggleComponent constructor
  * AngularJS will instantiate a singleton by calling "new" on this function
  *
  * @ngdoc controller
  * @name ToggleComponentService
  * @module materialApp.toggleComponent
  * @returns {Object} The service definition for the ToggleComponent Service
  */
	function ToggleComponentService($mdComponentRegistry, $log, $q) {
		return function (contentHandle) {
			var errorMsg = "ToggleComponent '" + contentHandle + "' is not available!";
			var instance = $mdComponentRegistry.get(contentHandle);

			if (!instance) {
				$log.error('No content-switch found for handle ' + contentHandle);
			}

			return {
				isOpen: isOpen,
				toggle: toggle,
				open: open,
				close: close
			};

			function isOpen() {
				return instance && instance.isOpen();
			}

			function toggle() {
				return instance ? instance.toggle() : $q.reject(errorMsg);
			}

			function open() {
				return instance ? instance.open() : $q.reject(errorMsg);
			}

			function close() {
				return instance ? instance.close() : $q.reject(errorMsg);
			}
		};
	}
})();
//# sourceMappingURL=toggle-component.service.js.map

'use strict';

angular.module('mediaboxApp').directive('topMenu', function () {
  return {
    templateUrl: 'components/top-menu/top-menu.html',
    restrict: 'E',
    controller: 'TopMenuController',
    controllerAs: 'topmenu'
  };
});
//# sourceMappingURL=top-menu.directive.js.map

'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TopMenuController = function TopMenuController(ToggleComponent, Auth, $attrs, Settings, Category, LoginModal, CpModal, $state, $scope, $mdMedia) {
  _classCallCheck(this, TopMenuController);

  var vm = this;
  vm.Auth = Auth;
  vm.showDropdownMenu = false;
  vm.hasRole = Auth.hasRole;
  vm.isLoggedIn = Auth.isLoggedIn;
  vm.isAdmin = Auth.isAdmin;
  vm.$mdMedia = $mdMedia;
  vm.menu = Settings.menu;
  vm.categories = Category();
  var originatorEv;
  vm.openMenu = function ($mdOpenMenu, ev) {
    originatorEv = ev;
    $mdOpenMenu(ev);
  };
  vm.showLogin = function () {
    LoginModal.show($state.current.name);
  };
  vm.showCp = function () {
    CpModal.show();
  };
};

angular.module('mediaboxApp').controller('TopMenuController', TopMenuController);
//# sourceMappingURL=topmenu.controller.js.map

'use strict';

angular.module('mediaboxApp').directive('userAvatar', function () {
  return {
    replace: true,
    template: '<svg class="user-avatar" viewBox="0 0 128 128" height="64" width="64" pointer-events="none" display="block" > <path fill="#FF8A80" d="M0 0h128v128H0z"/> <path fill="#FFE0B2" d="M36.3 94.8c6.4 7.3 16.2 12.1 27.3 12.4 10.7-.3 20.3-4.7 26.7-11.6l.2.1c-17-13.3-12.9-23.4-8.5-28.6 1.3-1.2 2.8-2.5 4.4-3.9l13.1-11c1.5-1.2 2.6-3 2.9-5.1.6-4.4-2.5-8.4-6.9-9.1-1.5-.2-3 0-4.3.6-.3-1.3-.4-2.7-1.6-3.5-1.4-.9-2.8-1.7-4.2-2.5-7.1-3.9-14.9-6.6-23-7.9-5.4-.9-11-1.2-16.1.7-3.3 1.2-6.1 3.2-8.7 5.6-1.3 1.2-2.5 2.4-3.7 3.7l-1.8 1.9c-.3.3-.5.6-.8.8-.1.1-.2 0-.4.2.1.2.1.5.1.6-1-.3-2.1-.4-3.2-.2-4.4.6-7.5 4.7-6.9 9.1.3 2.1 1.3 3.8 2.8 5.1l11 9.3c1.8 1.5 3.3 3.8 4.6 5.7 1.5 2.3 2.8 4.9 3.5 7.6 1.7 6.8-.8 13.4-5.4 18.4-.5.6-1.1 1-1.4 1.7-.2.6-.4 1.3-.6 2-.4 1.5-.5 3.1-.3 4.6.4 3.1 1.8 6.1 4.1 8.2 3.3 3 8 4 12.4 4.5 5.2.6 10.5.7 15.7.2 4.5-.4 9.1-1.2 13-3.4 5.6-3.1 9.6-8.9 10.5-15.2M76.4 46c.9 0 1.6.7 1.6 1.6 0 .9-.7 1.6-1.6 1.6-.9 0-1.6-.7-1.6-1.6-.1-.9.7-1.6 1.6-1.6zm-25.7 0c.9 0 1.6.7 1.6 1.6 0 .9-.7 1.6-1.6 1.6-.9 0-1.6-.7-1.6-1.6-.1-.9.7-1.6 1.6-1.6z"/> <path fill="#E0F7FA" d="M105.3 106.1c-.9-1.3-1.3-1.9-1.3-1.9l-.2-.3c-.6-.9-1.2-1.7-1.9-2.4-3.2-3.5-7.3-5.4-11.4-5.7 0 0 .1 0 .1.1l-.2-.1c-6.4 6.9-16 11.3-26.7 11.6-11.2-.3-21.1-5.1-27.5-12.6-.1.2-.2.4-.2.5-3.1.9-6 2.7-8.4 5.4l-.2.2s-.5.6-1.5 1.7c-.9 1.1-2.2 2.6-3.7 4.5-3.1 3.9-7.2 9.5-11.7 16.6-.9 1.4-1.7 2.8-2.6 4.3h109.6c-3.4-7.1-6.5-12.8-8.9-16.9-1.5-2.2-2.6-3.8-3.3-5z"/> <circle fill="#444" cx="76.3" cy="47.5" r="2"/> <circle fill="#444" cx="50.7" cy="47.6" r="2"/> <path fill="#444" d="M48.1 27.4c4.5 5.9 15.5 12.1 42.4 8.4-2.2-6.9-6.8-12.6-12.6-16.4C95.1 20.9 92 10 92 10c-1.4 5.5-11.1 4.4-11.1 4.4H62.1c-1.7-.1-3.4 0-5.2.3-12.8 1.8-22.6 11.1-25.7 22.9 10.6-1.9 15.3-7.6 16.9-10.2z"/> </svg>'
  };
});
//# sourceMappingURL=user-avatar.directive.js.map

'use strict';

(function () {

  /**
   * The Util service is for thin, globally reusable, utility functions
   */
  function UtilService($window) {
    var Util = {
      /**
       * Return a callback or noop function
       *
       * @param  {Function|*} cb - a 'potential' function
       * @return {Function}
       */
      safeCb: function safeCb(cb) {
        return angular.isFunction(cb) ? cb : angular.noop;
      },


      /**
       * Parse a given url with the use of an anchor element
       *
       * @param  {String} url - the url to parse
       * @return {Object}     - the parsed url, anchor element
       */
      urlParse: function urlParse(url) {
        var a = document.createElement('a');
        a.href = url;

        // Special treatment for IE, see http://stackoverflow.com/a/13405933 for details
        if (a.host === '') {
          a.href = a.href;
        }

        return a;
      },


      /**
       * Test whether or not a given url is same origin
       *
       * @param  {String}           url       - url to test
       * @param  {String|String[]}  [origins] - additional origins to test against
       * @return {Boolean}                    - true if url is same origin
       */
      isSameOrigin: function isSameOrigin(url, origins) {
        url = Util.urlParse(url);
        origins = origins && [].concat(origins) || [];
        origins = origins.map(Util.urlParse);
        origins.push($window.location);
        origins = origins.filter(function (o) {
          return url.hostname === o.hostname && url.port === o.port && url.protocol === o.protocol;
        });
        return origins.length >= 1;
      }
    };

    return Util;
  }

  angular.module('mediaboxApp.util').factory('Util', UtilService);
})();
//# sourceMappingURL=util.service.js.map

'use strict';

/*! Backstretch - v2.0.4 - 2013-06-19
* http://srobbin.com/jquery-plugins/backstretch/
* Copyright (c) 2013 Scott Robbin; Licensed MIT */

;(function ($, window, undefined) {
  'use strict';

  /* PLUGIN DEFINITION
   * ========================= */

  $.fn.backstretch = function (images, options) {
    // We need at least one image or method name
    if (images === undefined || images.length === 0) {
      $.error("No images were supplied for Backstretch");
    }

    /*
     * Scroll the page one pixel to get the right window height on iOS
     * Pretty harmless for everyone else
    */
    if ($(window).scrollTop() === 0) {
      window.scrollTo(0, 0);
    }

    return this.each(function () {
      var $this = $(this),
          obj = $this.data('backstretch');

      // Do we already have an instance attached to this element?
      if (obj) {

        // Is this a method they're trying to execute?
        if (typeof images == 'string' && typeof obj[images] == 'function') {
          // Call the method
          obj[images](options);

          // No need to do anything further
          return;
        }

        // Merge the old options with the new
        options = $.extend(obj.options, options);

        // Remove the old instance
        obj.destroy(true);
      }

      obj = new Backstretch(this, images, options);
      $this.data('backstretch', obj);
    });
  };

  // If no element is supplied, we'll attach to body
  $.backstretch = function (images, options) {
    // Return the instance
    return $('body').backstretch(images, options).data('backstretch');
  };

  // Custom selector
  $.expr[':'].backstretch = function (elem) {
    return $(elem).data('backstretch') !== undefined;
  };

  /* DEFAULTS
   * ========================= */

  $.fn.backstretch.defaults = {
    centeredX: true // Should we center the image on the X axis?
    , centeredY: true // Should we center the image on the Y axis?
    , duration: 5000 // Amount of time in between slides (if slideshow)
    , fade: 0 // Speed of fade transition between slides
  };

  /* STYLES
   * 
   * Baked-in styles that we'll apply to our elements.
   * In an effort to keep the plugin simple, these are not exposed as options.
   * That said, anyone can override these in their own stylesheet.
   * ========================= */
  var styles = {
    wrap: {
      left: 0,
      top: 0,
      overflow: 'hidden',
      margin: 0,
      padding: 0,
      height: '100%',
      width: '100%',
      zIndex: -999999
    },
    img: {
      position: 'absolute',
      display: 'none',
      margin: 0,
      padding: 0,
      border: 'none',
      width: 'auto',
      height: 'auto',
      maxHeight: 'none',
      maxWidth: 'none',
      zIndex: -999999
    }
  };

  /* CLASS DEFINITION
   * ========================= */
  var Backstretch = function Backstretch(container, images, options) {
    this.options = $.extend({}, $.fn.backstretch.defaults, options || {});

    /* In its simplest form, we allow Backstretch to be called on an image path.
     * e.g. $.backstretch('/path/to/image-f6a7d67423.jpg')
     * So, we need to turn this back into an array.
     */
    this.images = $.isArray(images) ? images : [images];

    // Preload images
    $.each(this.images, function () {
      $('<img />')[0].src = this;
    });

    // Convenience reference to know if the container is body.
    this.isBody = container === document.body;

    /* We're keeping track of a few different elements
     *
     * Container: the element that Backstretch was called on.
     * Wrap: a DIV that we place the image into, so we can hide the overflow.
     * Root: Convenience reference to help calculate the correct height.
     */
    this.$container = $(container);
    this.$root = this.isBody ? supportsFixedPosition ? $(window) : $(document) : this.$container;

    // Don't create a new wrap if one already exists (from a previous instance of Backstretch)
    var $existing = this.$container.children(".backstretch").first();
    this.$wrap = $existing.length ? $existing : $('<div class="backstretch"></div>').css(styles.wrap).appendTo(this.$container);

    // Non-body elements need some style adjustments
    if (!this.isBody) {
      // If the container is statically positioned, we need to make it relative,
      // and if no zIndex is defined, we should set it to zero.
      var position = this.$container.css('position'),
          zIndex = this.$container.css('zIndex');

      this.$container.css({
        position: position === 'static' ? 'relative' : position,
        zIndex: zIndex === 'auto' ? 0 : zIndex,
        background: 'none'
      });

      // Needs a higher z-index
      this.$wrap.css({ zIndex: -999998 });
    }

    // Fixed or absolute positioning?
    this.$wrap.css({
      position: this.isBody && supportsFixedPosition ? 'fixed' : 'absolute'
    });

    // Set the first image
    this.index = 0;
    this.show(this.index);

    // Listen for resize
    $(window).on('resize.backstretch', $.proxy(this.resize, this)).on('orientationchange.backstretch', $.proxy(function () {
      // Need to do this in order to get the right window height
      if (this.isBody && window.pageYOffset === 0) {
        window.scrollTo(0, 1);
        this.resize();
      }
    }, this));
  };

  /* PUBLIC METHODS
   * ========================= */
  Backstretch.prototype = {
    resize: function resize() {
      try {
        var bgCSS = { left: 0, top: 0 },
            rootWidth = this.isBody ? this.$root.width() : this.$root.innerWidth(),
            bgWidth = rootWidth,
            rootHeight = this.isBody ? window.innerHeight ? window.innerHeight : this.$root.height() : this.$root.innerHeight(),
            bgHeight = bgWidth / this.$img.data('ratio'),
            bgOffset;

        // Make adjustments based on image ratio
        if (bgHeight >= rootHeight) {
          bgOffset = (bgHeight - rootHeight) / 2;
          if (this.options.centeredY) {
            bgCSS.top = '-' + bgOffset + 'px';
          }
        } else {
          bgHeight = rootHeight;
          bgWidth = bgHeight * this.$img.data('ratio');
          bgOffset = (bgWidth - rootWidth) / 2;
          if (this.options.centeredX) {
            bgCSS.left = '-' + bgOffset + 'px';
          }
        }

        this.$wrap.css({ width: rootWidth, height: rootHeight }).find('img:not(.deleteable)').css({ width: bgWidth, height: bgHeight }).css(bgCSS);
      } catch (err) {
        // IE7 seems to trigger resize before the image is loaded.
        // This try/catch block is a hack to let it fail gracefully.
      }

      return this;
    }

    // Show the slide at a certain position
    , show: function show(newIndex) {

      // Validate index
      if (Math.abs(newIndex) > this.images.length - 1) {
        return;
      }

      // Vars
      var self = this,
          oldImage = self.$wrap.find('img').addClass('deleteable'),
          evtOptions = { relatedTarget: self.$container[0] };

      // Trigger the "before" event
      self.$container.trigger($.Event('backstretch.before', evtOptions), [self, newIndex]);

      // Set the new index
      this.index = newIndex;

      // Pause the slideshow
      clearInterval(self.interval);

      // New image
      self.$img = $('<img />').css(styles.img).bind('load', function (e) {
        var imgWidth = this.width || $(e.target).width(),
            imgHeight = this.height || $(e.target).height();

        // Save the ratio
        $(this).data('ratio', imgWidth / imgHeight);

        // Show the image, then delete the old one
        // "speed" option has been deprecated, but we want backwards compatibilty
        $(this).fadeIn(self.options.speed || self.options.fade, function () {
          oldImage.remove();

          // Resume the slideshow
          if (!self.paused) {
            self.cycle();
          }

          // Trigger the "after" and "show" events
          // "show" is being deprecated
          $(['after', 'show']).each(function () {
            self.$container.trigger($.Event('backstretch.' + this, evtOptions), [self, newIndex]);
          });
        });

        // Resize
        self.resize();
      }).appendTo(self.$wrap);

      // Hack for IE img onload event
      self.$img.attr('src', self.images[newIndex]);
      return self;
    },

    next: function next() {
      // Next slide
      return this.show(this.index < this.images.length - 1 ? this.index + 1 : 0);
    },

    prev: function prev() {
      // Previous slide
      return this.show(this.index === 0 ? this.images.length - 1 : this.index - 1);
    },

    pause: function pause() {
      // Pause the slideshow
      this.paused = true;
      return this;
    },

    resume: function resume() {
      // Resume the slideshow
      this.paused = false;
      this.next();
      return this;
    },

    cycle: function cycle() {
      // Start/resume the slideshow
      if (this.images.length > 1) {
        // Clear the interval, just in case
        clearInterval(this.interval);

        this.interval = setInterval($.proxy(function () {
          // Check for paused slideshow
          if (!this.paused) {
            this.next();
          }
        }, this), this.options.duration);
      }
      return this;
    },

    destroy: function destroy(preserveBackground) {
      // Stop the resize events
      $(window).off('resize.backstretch orientationchange.backstretch');

      // Clear the interval
      clearInterval(this.interval);

      // Remove Backstretch
      if (!preserveBackground) {
        this.$wrap.remove();
      }
      this.$container.removeData('backstretch');
    }
  };

  /* SUPPORTS FIXED POSITION?
   *
   * Based on code from jQuery Mobile 1.1.0
   * http://jquerymobile.com/
   *
   * In a nutshell, we need to figure out if fixed positioning is supported.
   * Unfortunately, this is very difficult to do on iOS, and usually involves
   * injecting content, scrolling the page, etc.. It's ugly.
   * jQuery Mobile uses this workaround. It's not ideal, but works.
   *
   * Modified to detect IE6
   * ========================= */

  var supportsFixedPosition = function () {
    var ua = navigator.userAgent,
        platform = navigator.platform
    // Rendering engine is Webkit, and capture major version
    ,
        wkmatch = ua.match(/AppleWebKit\/([0-9]+)/),
        wkversion = !!wkmatch && wkmatch[1],
        ffmatch = ua.match(/Fennec\/([0-9]+)/),
        ffversion = !!ffmatch && ffmatch[1],
        operammobilematch = ua.match(/Opera Mobi\/([0-9]+)/),
        omversion = !!operammobilematch && operammobilematch[1],
        iematch = ua.match(/MSIE ([0-9]+)/),
        ieversion = !!iematch && iematch[1];

    return !(
    // iOS 4.3 and older : Platform is iPhone/Pad/Touch and Webkit version is less than 534 (ios5)
    (platform.indexOf("iPhone") > -1 || platform.indexOf("iPad") > -1 || platform.indexOf("iPod") > -1) && wkversion && wkversion < 534 ||

    // Opera Mini
    window.operamini && {}.toString.call(window.operamini) === "[object OperaMini]" || operammobilematch && omversion < 7458 ||

    //Android lte 2.1: Platform is Android and Webkit version is less than 533 (Android 2.2)
    ua.indexOf("Android") > -1 && wkversion && wkversion < 533 ||

    // Firefox Mobile before 6.0 -
    ffversion && ffversion < 6 ||

    // WebOS less than 3
    "palmGetResource" in window && wkversion && wkversion < 534 ||

    // MeeGo
    ua.indexOf("MeeGo") > -1 && ua.indexOf("NokiaBrowser/8.5.0") > -1 ||

    // IE6
    ieversion && ieversion <= 6);
  }();
})(jQuery, window);
//# sourceMappingURL=jquery.backstretch.js.map

"use strict";

/*! Backstretch - v2.0.4 - 2013-06-19
* http://srobbin.com/jquery-plugins/backstretch/
* Copyright (c) 2013 Scott Robbin; Licensed MIT */
(function (a, d, p) {
  a.fn.backstretch = function (c, b) {
    (c === p || 0 === c.length) && a.error("No images were supplied for Backstretch");0 === a(d).scrollTop() && d.scrollTo(0, 0);return this.each(function () {
      var d = a(this),
          g = d.data("backstretch");if (g) {
        if ("string" == typeof c && "function" == typeof g[c]) {
          g[c](b);return;
        }b = a.extend(g.options, b);g.destroy(!0);
      }g = new q(this, c, b);d.data("backstretch", g);
    });
  };a.backstretch = function (c, b) {
    return a("body").backstretch(c, b).data("backstretch");
  };a.expr[":"].backstretch = function (c) {
    return a(c).data("backstretch") !== p;
  };a.fn.backstretch.defaults = { centeredX: !0, centeredY: !0, duration: 5E3, fade: 0 };var r = { left: 0, top: 0, overflow: "hidden", margin: 0, padding: 0, height: "100%", width: "100%", zIndex: -999999 },
      s = { position: "absolute", display: "none", margin: 0, padding: 0, border: "none", width: "auto", height: "auto", maxHeight: "none", maxWidth: "none", zIndex: -999999 },
      q = function q(c, b, e) {
    this.options = a.extend({}, a.fn.backstretch.defaults, e || {});this.images = a.isArray(b) ? b : [b];a.each(this.images, function () {
      a("<img />")[0].src = this;
    });this.isBody = c === document.body;this.$container = a(c);this.$root = this.isBody ? l ? a(d) : a(document) : this.$container;c = this.$container.children(".backstretch").first();this.$wrap = c.length ? c : a('<div class="backstretch"></div>').css(r).appendTo(this.$container);this.isBody || (c = this.$container.css("position"), b = this.$container.css("zIndex"), this.$container.css({ position: "static" === c ? "relative" : c, zIndex: "auto" === b ? 0 : b, background: "none" }), this.$wrap.css({ zIndex: -999998 }));this.$wrap.css({ position: this.isBody && l ? "fixed" : "absolute" });this.index = 0;this.show(this.index);a(d).on("resize.backstretch", a.proxy(this.resize, this)).on("orientationchange.backstretch", a.proxy(function () {
      this.isBody && 0 === d.pageYOffset && (d.scrollTo(0, 1), this.resize());
    }, this));
  };q.prototype = { resize: function resize() {
      try {
        var a = { left: 0, top: 0 },
            b = this.isBody ? this.$root.width() : this.$root.innerWidth(),
            e = b,
            g = this.isBody ? d.innerHeight ? d.innerHeight : this.$root.height() : this.$root.innerHeight(),
            j = e / this.$img.data("ratio"),
            f;j >= g ? (f = (j - g) / 2, this.options.centeredY && (a.top = "-" + f + "px")) : (j = g, e = j * this.$img.data("ratio"), f = (e - b) / 2, this.options.centeredX && (a.left = "-" + f + "px"));this.$wrap.css({ width: b, height: g }).find("img:not(.deleteable)").css({ width: e, height: j }).css(a);
      } catch (h) {}return this;
    }, show: function show(c) {
      if (!(Math.abs(c) > this.images.length - 1)) {
        var b = this,
            e = b.$wrap.find("img").addClass("deleteable"),
            d = { relatedTarget: b.$container[0] };b.$container.trigger(a.Event("backstretch.before", d), [b, c]);this.index = c;clearInterval(b.interval);b.$img = a("<img />").css(s).bind("load", function (f) {
          var h = this.width || a(f.target).width();f = this.height || a(f.target).height();a(this).data("ratio", h / f);a(this).fadeIn(b.options.speed || b.options.fade, function () {
            e.remove();b.paused || b.cycle();a(["after", "show"]).each(function () {
              b.$container.trigger(a.Event("backstretch." + this, d), [b, c]);
            });
          });b.resize();
        }).appendTo(b.$wrap);b.$img.attr("src", b.images[c]);return b;
      }
    }, next: function next() {
      return this.show(this.index < this.images.length - 1 ? this.index + 1 : 0);
    }, prev: function prev() {
      return this.show(0 === this.index ? this.images.length - 1 : this.index - 1);
    }, pause: function pause() {
      this.paused = !0;return this;
    }, resume: function resume() {
      this.paused = !1;this.next();return this;
    }, cycle: function cycle() {
      1 < this.images.length && (clearInterval(this.interval), this.interval = setInterval(a.proxy(function () {
        this.paused || this.next();
      }, this), this.options.duration));return this;
    }, destroy: function destroy(c) {
      a(d).off("resize.backstretch orientationchange.backstretch");clearInterval(this.interval);c || this.$wrap.remove();this.$container.removeData("backstretch");
    } };var l,
      f = navigator.userAgent,
      m = navigator.platform,
      e = f.match(/AppleWebKit\/([0-9]+)/),
      e = !!e && e[1],
      h = f.match(/Fennec\/([0-9]+)/),
      h = !!h && h[1],
      n = f.match(/Opera Mobi\/([0-9]+)/),
      t = !!n && n[1],
      k = f.match(/MSIE ([0-9]+)/),
      k = !!k && k[1];l = !((-1 < m.indexOf("iPhone") || -1 < m.indexOf("iPad") || -1 < m.indexOf("iPod")) && e && 534 > e || d.operamini && "[object OperaMini]" === {}.toString.call(d.operamini) || n && 7458 > t || -1 < f.indexOf("Android") && e && 533 > e || h && 6 > h || "palmGetResource" in d && e && 534 > e || -1 < f.indexOf("MeeGo") && -1 < f.indexOf("NokiaBrowser/8.5.0") || k && 6 >= k);
})(jQuery, window);
//# sourceMappingURL=jquery.backstretch.min.js.map

"use strict";
//# sourceMappingURL=scripts.js.map

'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var wishComponent =
  /*@ngInject*/
  function wishComponent(Wishlist, Toast, Auth, LoginModal) {
    _classCallCheck(this, wishComponent);

    var vm = this;
    var product = {};
    var variant = {};
    vm.$onChanges = function (changesObj) {
      if (changesObj.product) product = changesObj.product.currentValue;
      if (changesObj.variant) variant = changesObj.variant.currentValue;else variant = '~~~~~~~~~~~~~~~';
      if (product && variant) {
        var q = { where: { 'product._id': product._id, 'variant._id': variant._id } };
        vm.cls = 'md-primary';
        var wishlist = Wishlist.my.query(q, function (data) {
          if (data[0]) vm.cls = 'md-accent';
        });
      }
    };

    // On click select star
    vm.toggleWishlist = function () {
      if (vm.readOnly) return;
      if (!Auth.getCurrentUser().name) {
        LoginModal.show('single-product', true); // Reload = true
        return;
      }
      var p = { product: this.product, variant: this.variant };
      // pid: vm.product._id,
      // pname: vm.product.name,
      // slug: vm.product.slug,
      // image:vm.product.variants[0].image,
      // price:vm.product.variants[0].price,
      // mrp:vm.product.variants[0].mrp,
      // keyFeatures: vm.product.keyFeatures
      // }
      Wishlist.save(p, function (data) {
        if (data._id) {
          Toast.show({ type: 'success', text: 'Added to your wishlist' });
          vm.cls = 'md-accent';
        } else vm.cls = 'md-primary';
      });
    };
  };

  angular.module('mediaboxApp').component('wish', {
    template: '\n    <md-button class="wishlist-component md-mini" aria-label="Add to wishlist" ng-class="$ctrl.cls"\n    ng-click="$ctrl.toggleWishlist()">\n        <ng-md-icon icon="favorite"></ng-md-icon>&nbsp;<span ng-if="$ctrl.cls === \'md-accent\'">Wished</span><span ng-if="$ctrl.cls !== \'md-accent\'">Add To Wishlist</span>\n    </md-button>\n    ',
    bindings: {
      product: '<', // Read only
      variant: '<', // Read only
      pid: '<', // Product ID passed because initially the whole product object will not be ready
      readOnly: '@?' // String value
    },
    controller: wishComponent
  });
})();
//# sourceMappingURL=wish.component.js.map

angular.module("mediaboxApp").run(["$templateCache", function($templateCache) {$templateCache.put("app/admin/admin.html","<crud-table api=\'user\' options=\'admin.options\' noAdd noCopy></crud-table>\n");
$templateCache.put("app/address/address.html","<navbar></navbar>\n<div flex layout=\"column\" layout-gt-xs=\"row\" layout-align=\"center stretch\">\n\n<div layout=\"column\" layout-gt-sm=\"<column></column>\">\n<!--Address box-->\n<md-card ng-show=\"address.showAddressForm\">\n    <md-card-content>\n	<p ng-show=\"address.error\" class=\"md-warn\">{{address.error.message}}</p>\n	<h3>SELECTED ADDRESS</h3>\n	<form name=\"form\" ng-submit=\"address.saveAddress(address.addr);new.address=false;address.addr = address.address[0];\" novalidate layout=\"column\">\n		<md-input-container md-is-error=\"(form.name.$error.required || form.name.$error.name) && form.name.$dirty\">\n			<label>Name</label>\n			<input name=\"name\" type=\"name\" ng-model=\"address.addr.name\" required autofocus>\n			<div ng-messages=\"form.name.$error\" ng-if=\"form.name.$dirty\">\n				<div ng-message=\"required\">Name is required</div>\n			</div>\n		</md-input-container>\n        \n        <md-input-container md-is-error=\"(form.addr.$error.required || form.addr.$error.addr) && form.addr.$dirty\">\n			<label>Address</label>\n			<input name=\"address\" type=\"address\" ng-model=\"address.addr.address\" required/>\n			<div ng-messages=\"form.address.$error\" ng-if=\"form.address.$dirty\">\n				<div ng-message=\"required\">Address is required</div>\n			</div>\n		</md-input-container>\n        \n        <md-input-container md-is-error=\"(form.city.$error.required || form.city.$error.city) && form.city.$dirty\">\n			<label>City</label>\n			<input name=\"city\" type=\"city\" ng-model=\"address.addr.city\" required/>\n			<div ng-messages=\"form.city.$error\" ng-if=\"form.city.$dirty\">\n				<div ng-message=\"required\">City is required</div>\n			</div>\n		</md-input-container>\n\n        <md-input-container md-is-error=\"(form.zip.$error.required || form.zip.$error.zip) && form.zip.$dirty\">\n			<label>Zip</label>\n			<input name=\"zip\" type=\"zip\" ng-model=\"address.addr.zip\" required only-numbers/>\n			<div ng-messages=\"form.zip.$error\" ng-if=\"form.zip.$dirty\">\n				<div ng-message=\"required\">Zip code is required</div>\n			</div>\n		</md-input-container>\n        \n        <md-input-container md-is-error=\"(form.state.$error.required || form.state.$error.state) && form.state.$dirty\">\n			<label>State</label>\n			<input name=\"state\" type=\"state\" ng-model=\"address.addr.state\" required/>\n			<div ng-messages=\"form.state.$error\" ng-if=\"form.state.$dirty\">\n				<div ng-message=\"required\">State is required</div>\n			</div>\n		</md-input-container>\n        \n        <md-input-container md-is-error=\"(form.phone.$error.required || form.phone.$error.phone) && form.phone.$dirty\">\n			<label>Phone</label>\n			<input name=\"phone\" type=\"phone\" ng-model=\"address.addr.phone\" required/>\n			<div ng-messages=\"form.phone.$error\" ng-if=\"form.phone.$dirty\">\n				<div ng-message=\"required\">Phone number is required</div>\n			</div>\n		</md-input-container>\n\n        <!--<md-input-container md-is-error=\"(form.country.$error.required || form.country.$error.country) && form.country.$dirty\">\n            <label>Country</label>\n            <input ng-model=\"address.addr.country\" ng-value=\"address.Settings.country.name\" disabled/>\n            <div ng-messages=\"form.country.$error\" ng-if=\"form.country.$dirty\">\n				<div ng-message=\"required\">Country required</div>\n			</div>\n		</md-input-container>-->\n\n        <div layout=\"row\">\n            <md-button type=\"submit\" class=\"md-raised md-primary\" \n            ng-disabled=\"!form.$valid || address.loadingAddress\" aria-label=\"Save Address\" layout=\"row\">\n                <ng-md-icon icon=\"save\" ng-hide=\"address.loadingAddress\"></ng-md-icon>\n                <md-progress-circular md-mode=\"indeterminate\" md-diameter=\"25\" ng-show=\"address.loadingAddress\" class=\"md-accent md-hue-1\"></md-progress-circular>\n                Save <span hide show-gt-xs>as Primary Address</span>\n            </md-button>\n            <md-button ng-click=\"address.cancelForm(address.addr);new.address=false;\">Cancel</md-button>\n	   </div>\n       </form>\n    </md-card-content>\n</md-card>\n<div layout=\"column\">\n<md-button class=\"md-raised\" ng-click=\"address.addressForm(true);address.new.address=true; address.addr={country: address.Settings.country.name}\">\n    <ng-md-icon icon=\"location_on\"></ng-md-icon>Add New Address\n</md-button>\n<div layout=\"row\" layout-align=\"start start\" layout-wrap>\n\n<md-card  \nng-repeat=\"a in address.address\" \nng-click=\"new.address=false; address.addressForm(true);address.switchAddress(a)\" \nstyle=\"min-width:300px\" \nng-class=\"{\'selected\':(a==address.addr)} \"\n>\n      <md-card-header layout=\"row\" layout-align=\"space-between start\">\n          <md-card-header-text>\n            <h3>ADDRESS - {{$index+1}}</h3>\n          </md-card-header-text>\n          	<div>\n				  <md-button ng-click=\"address.delete(a)\" aria-label=\"Delete Address\"><ng-md-icon icon=\"delete\"></ng-md-icon></md-button>  \n			</div>				  \n      </md-card-header>\n	  \n      <md-card-content layout=\"column\" layout-align=\"start start\">\n			{{a.name}}<br/>\n            {{a.address}}<br/>\n            {{a.city}}<br/>\n            {{a.state}}<br/>\n            {{a.zip}}<br/>\n            {{a.phone}}\n      </md-card-content>\n      \n</md-card>\n</div><!--Address box-->\n</div>\n</div>\n\n</div>\n<footer></footer>\n");
$templateCache.put("app/book/book.html","<crud-table api=\'book\' options=\'options\'></crud-table>\n");
$templateCache.put("app/brand/brand.html","<crud-table api=\'brand\' options=\'options\'></crud-table>\n");
$templateCache.put("app/brandmg/brandmg.html","<crud-table api=\'BrandMG\' options=\'options\'></crud-table>\n");
$templateCache.put("app/brandtv/brandtv.html","<crud-table api=\'BrandTV\' options=\'options\'></crud-table>\n");
$templateCache.put("app/campaign/campaign.html","<navbar leftmenu=\"true\"></navbar>\n<left-menu></left-menu>\n\n<link rel=\"stylesheet\" href=\"bower_components/angular-loading/angular-loading.css\"/>\n\n\n<div ng-cloak>\n<div class=\"container\" >\n<div class=\"row\">\n  <div class=\"col-md-4\"><h3>Campaigns</h3> </div>\n\n  <div class=\"col-md-8\"><!-- <div   class=\"alert alert-danger\" >New Requests/ Proposals will expire in 7 days if not responded to</div> -->\n\n  </div>\n</div>\n\n <!--When No Campaigns-->\n      <section ng-if=\"campaign.campaigns.totalCampaign.length===0\" class=\"header\" layout=\"column\" layout-align=\"center stretch\">\n        <h1>You have not purchased anything yet</h1>\n        <md-button ui-sref=\"/\" class=\"md-primary md-raised\">\n        <ng-md-icon icon=\"shopping_cart\"></ng-md-icon>Shop Now\n\n        </md-buton>\n      </section>\n\n  <div class=\"box\" ng-controller=\"CampaignController as vm\">\n        <div class=\"row\">\n        \n              <div class=\"col-sm-2\" style=\"border-right: bold\">\n                <h3 >Total :<br> &nbsp;<br><div  style=\"margin-left:30px;color:red\">{{vm.campaignsAll.totalCampaign}}</div></h3>\n              </div>\n              <div class=\"col-sm-2\"><h3>Pending<br> &nbsp;<br><div  style=\"margin-left:30px;color:red\">{{vm.campaignsPending.totalCampaign}}</div></h3></div>\n              <div class=\"col-sm-2\"><h3>Scheduled<br> &nbsp;<br><div  style=\"margin-left:30px;color:red\">{{vm.campaignsScheduled.totalCampaign}}</div></h3></div>\n               <div class=\"col-sm-2\"><h3>Running<br> &nbsp;<br><div  style=\"margin-left:30px;color:red\">{{vm.campaignsRunning.totalCampaign}}</div></h3></div>\n               <div class=\"col-sm-2\"><h3>Completed<br> &nbsp;<br><div  style=\"margin-left:30px;color:red\">{{vm.campaignsCompleted.totalCampaign}}</div></h3></div>\n               <div class=\"col-sm-2\"></div>\n          \n        </div>\n </div>\n\n\n   \n</div>\n\n   <md-content class=\"container\" layout=\"column\">\n    <md-tabs md-dynamic-height md-border-bottom>\n      <md-tab label=\"PENDING\">\n        <md-content >\n          \n            <section >\n   \n          <md-content >\n            <div >\n              <div class=\"col-md-12\" ng-controller=\"CampaignController as vm\">\n                  \n            <!-- <h3  class=\"bg-info well text-center\">Total Spent: {{campaigns.total | currency}}</h3> -->\n               <div style=\"margin-top:20px\" class=\"small\" dw-loading=\"campaigns\" dw-loading-options=\"{active: true, text: \'\', className: \'custom-loading\', spinnerOptions: {lines: 12, length: 20, width: 6, radius: 20, color: \'#d9534f\', direction: -1, speed: 3}}\"></div>\n\n               <kendo-grid options=\"vm.mainGridOptions\">\n\n                <div k-detail-template>\n\n\n                    <kendo-tab-strip>\n                    <ul>\n                        <li class=\"k-state-active\">PRODUCTS/SITES</li>\n                        <li>PUBLISHER DETAILS </li>\n                    </ul>\n                    <div>\n                        <div kendo-grid k-options=\"vm.detailGridOptions(dataItem)\"></div>\n                    </div>\n                    <div>\n                        <ul class=\"contact-info-form\">\n                    \n                            <li><label>Name:</label> {{dataItem.items[0].publisher}}</li>\n                           \n                        </ul>\n                    </div>\n                    </kendo-tab-strip>\n                </div>\n            </kendo-grid>\n\n          </div>\n          \n              \n            </div>\n\n            <div flex></div>\n          </md-content>\n            <md-sidenav class=\"md-sidenav-right md-whiteframe-4dp\" md-component-id=\"right\">\n              <md-toolbar style= \"background-color:#555555\">\n                <h1 class=\"md-toolbar-tools\">Edit Request</h1>\n              </md-toolbar>\n            \n            </md-sidenav>\n        </section>\n        </p>\n      </md-content>\n      </md-tab>\n       <md-tab label=\"SCHEDULED\">\n        <md-content >\n           <section >\n   \n            <md-content >\n            <div >\n              <div class=\"col-md-12\" ng-controller=\"CampaignScheduledController as vm\">\n                  \n            <!-- <h3  class=\"bg-info well text-center\">Total Spent: {{campaigns.total | currency}}</h3> -->\n               <div style=\"margin-top:20px\" class=\"small\" dw-loading=\"campaigns\" dw-loading-options=\"{active: true, text: \'\', className: \'custom-loading\', spinnerOptions: {lines: 12, length: 20, width: 6, radius: 20, color: \'#d9534f\', direction: -1, speed: 3}}\"></div>\n\n               <kendo-grid options=\"vm.mainGridOptions\">\n\n                <div k-detail-template>\n\n\n                    <kendo-tab-strip>\n                    <ul>\n                        <li class=\"k-state-active\">PRODUCTS/SITES</li>\n                        <li>PUBLISHER </li>\n                    </ul>\n                    <div>\n                        <div kendo-grid k-options=\"vm.detailGridOptions(dataItem)\"></div>\n                    </div>\n                    <div>\n                        <ul class=\"contact-info-form\">\n                    \n                            <li><label>Name:</label> {{dataItem.items[0].publisher}}</li>\n                            \n                        </ul>\n                    </div>\n                    </kendo-tab-strip>\n                </div>\n            </kendo-grid>\n\n          </div>\n          \n              \n            </div>\n\n            <div flex></div>\n          </md-content>\n                <md-sidenav class=\"md-sidenav-right md-whiteframe-4dp\" md-component-id=\"right\">\n                  <md-toolbar style= \"background-color:#555555\">\n                    <h1 class=\"md-toolbar-tools\">Preview Request</h1>\n                  </md-toolbar>\n                  \n                </md-sidenav>\n        </section>\n        </md-content>\n      </md-tab>\n\n         <md-tab label=\"RUNNING\">\n        <md-content >\n          \n            <section >\n   \n          <md-content >\n            <div >\n              <div class=\"col-md-12\" ng-controller=\"CampaignRunningController as vm\">\n                  \n            <!-- <h3  class=\"bg-info well text-center\">Total Spent: {{campaigns.total | currency}}</h3> -->\n               <div style=\"margin-top:20px\" class=\"small\" dw-loading=\"campaigns\" dw-loading-options=\"{active: true, text: \'\', className: \'custom-loading\', spinnerOptions: {lines: 12, length: 20, width: 6, radius: 20, color: \'#d9534f\', direction: -1, speed: 3}}\"></div>\n\n               <kendo-grid options=\"vm.mainGridOptions\">\n\n                <div k-detail-template>\n\n\n                <kendo-tab-strip>\n                    <ul>\n                        <li class=\"k-state-active\">PRODUCTS/SITES</li>\n                        <li>PUBLISHER </li>\n                    </ul>\n                    <div>\n                        <div kendo-grid k-options=\"vm.detailGridOptions(dataItem)\"></div>\n                    </div>\n                    <div>\n                        <ul class=\"contact-info-form\">\n                    \n                            <li><label>Name:</label> {{dataItem.items[0].publisher}}</li>\n                            \n                        </ul>\n                    </div>\n                    </kendo-tab-strip>                </div>\n            </kendo-grid>\n\n          </div>\n          \n              \n            </div>\n\n            <div flex></div>\n          </md-content>\n            <md-sidenav class=\"md-sidenav-right md-whiteframe-4dp\" md-component-id=\"right\">\n              <md-toolbar style= \"background-color:#555555\">\n                <h1 class=\"md-toolbar-tools\">Edit Request</h1>\n              </md-toolbar>\n              \n            </md-sidenav>\n        </section>\n        </p>\n      </md-content>\n      </md-tab>\n      <!--running to be inseterd gere-->\n      <md-tab label=\"COMPLETED\">\n        <md-content >\n            <div >\n              <div class=\"col-md-12\" ng-controller=\"CampaignCompletedController as vm\">\n                  \n            <!-- <h3  class=\"bg-info well text-center\">Total Spent: {{campaigns.total | currency}}</h3> -->\n               <div style=\"margin-top:20px\" class=\"small\" dw-loading=\"campaigns\" dw-loading-options=\"{active: true, text: \'\', className: \'custom-loading\', spinnerOptions: {lines: 12, length: 20, width: 6, radius: 20, color: \'#d9534f\', direction: -1, speed: 3}}\"></div>\n\n               <kendo-grid options=\"vm.mainGridOptions\">\n\n                <div k-detail-template>\n\n\n                    <kendo-tab-strip>\n                    <ul>\n                        <li class=\"k-state-active\">PRODUCTS/SITES</li>\n                        <li>PUBLISHER </li>\n                    </ul>\n                    <div>\n                        <div kendo-grid k-options=\"vm.detailGridOptions(dataItem)\"></div>\n                    </div>\n                    <div>\n                        <ul class=\"contact-info-form\">\n                    \n                            <li><label>Name:</label> {{dataItem.items[0].publisher}}</li>\n                            \n                        </ul>\n                    </div>\n                    </kendo-tab-strip>\n                </div>\n            </kendo-grid>\n\n          </div>\n          \n              \n            </div>\n\n            <div flex></div>\n          </md-content>\n              <md-sidenav class=\"md-sidenav-right md-whiteframe-4dp\" md-component-id=\"right\">\n                <md-toolbar style= \"background-color:#555555\">\n                  <h1 class=\"md-toolbar-tools\">Preview Request</h1>\n                </md-toolbar>\n                \n              </md-sidenav>\n          </section>\n        </md-content>\n      </md-tab>\n    </md-tabs>\n  </md-content>\n</div>\n<footer></footer>\n<script>\n        /*\n            This demo renders the grid in \"DejaVu Sans\" font family, which is\n            declared in kendo.common.css. It also declares the paths to the\n            fonts below using <tt>kendo.pdf.defineFont</tt>, because the\n            stylesheet is hosted on a different domain.\n        */\n        kendo.pdf.defineFont({\n            \"DejaVu Sans\"             : \"//kendo.cdn.telerik.com/2016.2.607/styles/fonts/DejaVu/DejaVuSans.ttf\",\n            \"DejaVu Sans|Bold\"        : \"//kendo.cdn.telerik.com/2016.2.607/styles/fonts/DejaVu/DejaVuSans-Bold.ttf\",\n            \"DejaVu Sans|Bold|Italic\" : \"//kendo.cdn.telerik.com/2016.2.607/styles/fonts/DejaVu/DejaVuSans-Oblique.ttf\",\n            \"DejaVu Sans|Italic\"      : \"//kendo.cdn.telerik.com/2016.2.607/styles/fonts/DejaVu/DejaVuSans-Oblique.ttf\"\n        });\n    </script>\n    <script type=\"text/x-kendo-template\" id=\"template\">\n        <div class=\"toolbar\">\n            <label class=\"category-label\" for=\"category\">Show products by category:</label>\n            <input type=\"search\" id=\"category\" style=\"width: 150px\"/>\n        </div>\n    </script>\n\n    <script type=\"x/kendo-template\" id=\"page-template\">\n      <div class=\"page-template\">\n        <div class=\"header\">\n          <div style=\"float: right\">Page #: pageNum # of #: totalPages #</div>\n          Bringing Back Life To The Advertising Industry\n        </div>\n        <div class=\"watermark\">MEDIABOX</div>\n        <div class=\"footer\">\n          Page #: pageNum # of #: totalPages #\n        </div>\n      </div>\n    </script>\n");
$templateCache.put("app/campaigns/campaigns.html","<navbar leftmenu=\"true\"></navbar>\n<left-menu></left-menu>\n\n<link rel=\"stylesheet\" href=\"bower_components/angular-loading/angular-loading.css\"/>\n\n\n<div ng-cloak>\n<div class=\"container\" >\n<div class=\"row\">\n  <div class=\"col-md-4\"><h3>Campaigns</h3> </div>\n\n  <div class=\"col-md-8\"><div   class=\"alert alert-danger\" >New Requests/ Proposals will expire in 7 days if not responded to</div>\n\n  </div>\n</div>\n  <div class=\"box\" ng-controller=\"CampaignsController as vm\">\n        <div class=\"row\">\n        \n              <div class=\"col-sm-2\" style=\"border-right: bold\">\n                <h3 >Total :<br> &nbsp;<br><div  style=\"margin-left:30px;color:red\">{{vm.campaigns.totalCampaign}}</div></h3>\n              </div>\n              <div class=\"col-sm-2\"><h3>Pending<br> &nbsp;<br><div  style=\"margin-left:30px;color:red\">{{vm.campaignsPending.totalCampaign}}</div></h3></div>\n              <div class=\"col-sm-2\"><h3>Scheduled<br> &nbsp;<br><div  style=\"margin-left:30px;color:red\">{{vm.campaignsScheduled.totalCampaign}}</div></h3></div>\n               <div class=\"col-sm-2\"><h3>Running<br> &nbsp;<br><div  style=\"margin-left:30px;color:red\">{{vm.campaignsRunning.totalCampaign}}</div></h3></div>\n               <div class=\"col-sm-2\"><h3>Completed<br> &nbsp;<br><div  style=\"margin-left:30px;color:red\">{{vm.campaignsCompleted.totalCampaign}}</div></h3></div>\n               <div class=\"col-sm-2\"></div>\n          \n        </div>\n </div>\n\n   \n</div>\n\n  <md-content class=\"container\" layout=\"column\">\n    <md-tabs md-dynamic-height md-border-bottom>\n      <md-tab label=\"PENDING\">\n        <md-content >\n          \n            <section >\n   \n          <md-content >\n            <div >\n              <div class=\"col-md-12\" ng-controller=\"CampaignsController as vm\">\n                  \n            <!-- <h3  class=\"bg-info well text-center\">Total Spent: {{campaigns.total | currency}}</h3> -->\n               <div style=\"margin-top:20px\" class=\"small\" dw-loading=\"campaigns\" dw-loading-options=\"{active: true, text: \'\', className: \'custom-loading\', spinnerOptions: {lines: 12, length: 20, width: 6, radius: 20, color: \'#d9534f\', direction: -1, speed: 3}}\"></div>\n\n               <kendo-grid options=\"vm.mainGridOptions\">\n\n                <div k-detail-template>\n\n\n                    <kendo-tab-strip>\n                    <ul>\n                        <li class=\"k-state-active\">PRODUCTS/SITES</li>\n                        <li>ADVERTISER DETAILS </li>\n                    </ul>\n                    <div>\n                        <div kendo-grid k-options=\"vm.detailGridOptions(dataItem)\"></div>\n                    </div>\n                    <div>\n                        <ul class=\"contact-info-form\">\n                    \n                            <li><label>Name:</label> {{dataItem.items[0].advertiser.company}}</li>\n                            <!--<li><label>Address:</label>{{dataItem.items[0].advertiser.address}}</li>-->\n                            <li><label>Email:</label> {{dataItem.items[0].advertiser.email}}</li>\n                            <li><label>Phone:</label> {{dataItem.items[0].advertiser.phone}}</li>\n                        </ul>\n                    </div>\n                    </kendo-tab-strip>\n                </div>\n            </kendo-grid>\n\n          </div>\n          \n              \n            </div>\n\n            <div flex></div>\n          </md-content>\n       \n        </section>\n        </p>\n      </md-content>\n      </md-tab>\n       <md-tab label=\"SCHEDULED\">\n        <md-content >\n           <section >\n   \n            <md-content >\n            <div >\n              <div class=\"col-md-12\" ng-controller=\"CampaignsScheduledController as vm\">\n                  \n            <!-- <h3  class=\"bg-info well text-center\">Total Spent: {{campaigns.total | currency}}</h3> -->\n               <div style=\"margin-top:20px\" class=\"small\" dw-loading=\"campaigns\" dw-loading-options=\"{active: true, text: \'\', className: \'custom-loading\', spinnerOptions: {lines: 12, length: 20, width: 6, radius: 20, color: \'#d9534f\', direction: -1, speed: 3}}\"></div>\n\n               <kendo-grid options=\"vm.mainGridOptions\">\n\n                <div k-detail-template>\n\n\n                    <kendo-tab-strip>\n                    <ul>\n                        <li class=\"k-state-active\">PRODUCTS/SITES</li>\n                        <li>ADVERTISER DETAILS </li>\n                    </ul>\n                    <div>\n                        <div kendo-grid k-options=\"vm.detailGridOptions(dataItem)\"></div>\n                    </div>\n                    <div>\n                        <u++l class=\"contact-info-form\">\n                    \n                            <li><label>Name:</label> {{dataItem.items[0].advertiser.company}}</li>\n                             <li><label>Email:</label> {{dataItem.items[0].advertiser.email}}</li>\n                            <li><label>Phone:</label> {{dataItem.items[0].advertiser.phone}}</li>\n                        </ul>\n                    </div>\n                    </kendo-tab-strip>\n                </div>\n            </kendo-grid>\n\n          </div>\n          \n              \n            </div>\n\n            <div flex></div>\n          </md-content>\n            \n        </section>\n        </md-content>\n      </md-tab>\n\n         <md-tab label=\"RUNNING\">\n        <md-content >\n          \n            <section >\n   \n          <md-content >\n            <div >\n              <div class=\"col-md-12\" ng-controller=\"CampaignsRunningController as vm\">\n                  \n            <!-- <h3  class=\"bg-info well text-center\">Total Spent: {{campaigns.total | currency}}</h3> -->\n               <div style=\"margin-top:20px\" class=\"small\" dw-loading=\"campaigns\" dw-loading-options=\"{active: true, text: \'\', className: \'custom-loading\', spinnerOptions: {lines: 12, length: 20, width: 6, radius: 20, color: \'#d9534f\', direction: -1, speed: 3}}\"></div>\n\n               <kendo-grid options=\"vm.mainGridOptions\">\n\n                <div k-detail-template>\n\n\n                    <kendo-tab-strip>\n                    <ul>\n                        <li class=\"k-state-active\">PRODUCTS/SITES</li>\n                        <li>ADVERTISER DETAILS </li>\n                    </ul>\n                    <div>\n                        <div kendo-grid k-options=\"vm.detailGridOptions(dataItem)\"></div>\n                    </div>\n                    <div>\n                        <ul class=\"contact-info-form\">\n                    \n                            <li><label>Name:</label> {{dataItem.items[0].advertiser.company}}</li>\n                             <li><label>Email:</label> {{dataItem.items[0].advertiser.email}}</li>\n                            <li><label>Phone:</label> {{dataItem.items[0].advertiser.phone}}</li>\n                        </ul>\n                    </div>\n                    </kendo-tab-strip>\n                </div>\n            </kendo-grid>\n\n          </div>\n          \n              \n            </div>\n\n            <div flex></div>\n          </md-content>\n            \n        </section>\n        </p>\n      </md-content>\n      </md-tab>\n      <!--running to be inseterd gere-->\n      <md-tab label=\"COMPLETED\">\n        <md-content >\n            <div >\n              <div class=\"col-md-12\" ng-controller=\"CampaignsCompletedController as vm\">\n                  \n            <!-- <h3  class=\"bg-info well text-center\">Total Spent: {{campaigns.total | currency}}</h3> -->\n               <div style=\"margin-top:20px\" class=\"small\" dw-loading=\"campaigns\" dw-loading-options=\"{active: true, text: \'\', className: \'custom-loading\', spinnerOptions: {lines: 12, length: 20, width: 6, radius: 20, color: \'#d9534f\', direction: -1, speed: 3}}\"></div>\n\n               <kendo-grid options=\"vm.mainGridOptions\">\n\n                <div k-detail-template>\n\n\n                    <kendo-tab-strip>\n                    <ul>\n                        <li class=\"k-state-active\">PRODUCTS/SITES</li>\n                        <li>ADVERTISER DETAILS </li>\n                    </ul>\n                    <div>\n                        <div kendo-grid k-options=\"vm.detailGridOptions(dataItem)\"></div>\n                    </div>\n                    <div>\n                        <ul class=\"contact-info-form\">\n                    \n                            <li><label>Name:</label> {{dataItem.items[0].advertiser.company}}</li>\n                            <!--<li><label>Address:</label>{{dataItem.items[0].advertiser.address}}</li>-->\n                            <li><label>Email:</label> {{dataItem.items[0].advertiser.email}}</li>\n                            <li><label>Phone:</label> {{dataItem.items[0].advertiser.phone}}</li>\n                        </ul>\n                    </div>\n                    </kendo-tab-strip>\n                </div>\n            </kendo-grid>\n\n          </div>\n          \n              \n            </div>\n\n            <div flex></div>\n          </md-content>\n              </section>\n        </md-content>\n      </md-tab>\n    </md-tabs>\n  </md-content>\n</div>\n<footer></footer>\n<script>\n        /*\n            This demo renders the grid in \"DejaVu Sans\" font family, which is\n            declared in kendo.common.css. It also declares the paths to the\n            fonts below using <tt>kendo.pdf.defineFont</tt>, because the\n            stylesheet is hosted on a different domain.\n        */\n        kendo.pdf.defineFont({\n            \"DejaVu Sans\"             : \"//kendo.cdn.telerik.com/2016.2.607/styles/fonts/DejaVu/DejaVuSans.ttf\",\n            \"DejaVu Sans|Bold\"        : \"//kendo.cdn.telerik.com/2016.2.607/styles/fonts/DejaVu/DejaVuSans-Bold.ttf\",\n            \"DejaVu Sans|Bold|Italic\" : \"//kendo.cdn.telerik.com/2016.2.607/styles/fonts/DejaVu/DejaVuSans-Oblique.ttf\",\n            \"DejaVu Sans|Italic\"      : \"//kendo.cdn.telerik.com/2016.2.607/styles/fonts/DejaVu/DejaVuSans-Oblique.ttf\"\n        });\n    </script>\n    <script type=\"text/x-kendo-template\" id=\"template\">\n        <div class=\"toolbar\">\n            <label class=\"category-label\" for=\"category\">Show products by category:</label>\n            <input type=\"search\" id=\"category\" style=\"width: 150px\"/>\n        </div>\n    </script>\n\n    <script type=\"x/kendo-template\" id=\"page-template\">\n      <div class=\"page-template\">\n        <div class=\"header\">\n          <div style=\"float: right\">Page #: pageNum # of #: totalPages #</div>\n          Bringing Back Life To The Advertising Industry\n        </div>\n        <div class=\"watermark\">MEDIABOX</div>\n        <div class=\"footer\">\n          Page #: pageNum # of #: totalPages #\n        </div>\n      </div>\n    </script>\n\n<script type=\"text/javascript\">\n$(function() {\n    $(\'input[name=\"daterange2\"]\').daterange2picker();\n});\n</script>\n");
$templateCache.put("app/cart/cart.html","<navbar leftmenu=\"true\"></navbar>\n<left-menu></left-menu>\n<md-content  class=\"container \" layout=\"column\">\n<section class=\"header\" layout=\"column\" >\n<div class=\"col-sm-12 \">\n<div class=\"box\">\n<div class=\"row\">\n  <div  class=\"col-xs-3 stats-graph\">\n   <md-input-container>\n    <label>Campaign Name</label>\n     <input   value=\"{{vm.cart.campaignName}}\" ng-model= \"vm.cart.campaignName\"\\>\n      </md-input-container>\n  \n  </div>\n  <div  class=\"col-xs-6 stats-graph\">\n  <h4 class=\"section-header\"></h4>\n      <div class=\"row\">\n        <div class\"col-md-12\">\n          <md-input-container>\n              <label>Campaign Objective</label>\n              <textarea name=\"objectives\" cols=\"50\" rows=\"2\" ng-model=\"vm.cart.objectives\" md-maxlength=\"150\"></textarea>\n              <div ng-messages=\"userForm.bio.$error\" ng-show=\"userForm.bio.$dirty\">\n                <div ng-message=\"required\">This is required!</div>\n                <div ng-message=\"md-maxlength\">That\'s too long!</div>\n              </div>\n            </md-input-container>\n        </div>\n       \n      </div>\n  \n  </div>\n \n  <div id=\"totalContainer\" class=\"col-xs-3 stats-graph\">\n      <h4 class=\"section-header\">Total Spend</h4>\n        {{vm.cart.getTotalPrice() | currency}} - ({{vm.cart.getTotalCount()}} items)\n</div>\n     \n  </div>\n</div>\n\n</div>\n</section>\n  <section class=\"header\" layout=\"column\" padding>\n   \n   <div>\n              <p>\n\n                    <div >\n                    <div class=\"actions-continue\">                   \n\n                        <input type=\"text\" placeholder=\"Filter ...\" class=\"form-control col-md-4\" style=\"width:250px;margin-left:20px;\" ng-model=\"filterCart\" autofocus/>\n\n                         <button value=\"Proceed to Checkout →\" name=\"proceed\" class=\"btn btn-danger pull-right\" ng-click=\"cart.createCampaign(vm.cart);\" ng-disabled=\"vm.cart.getTotalCount() <= 0\" >Create Campaign →</button>\n\n          \n\n                        <div class=\"clearfix\"></div>\n                    </div><br/>\n\n                    <table class=\"cart table table-striped\">\n                        <thead>\n                            <tr>\n                                <th>#</th>\n                                <th>Publisher</th>\n                                <th>Media Option </th>\n                                <th>Start and End Date</th>\n                                <th style=\"width: 150px\">Upload Advert</th>\n                                <th>Price</th>\n                                <th >Inserts</th>\n                                <th>Total</th>\n                                <th>Remove</th>\n                            </tr>\n                        </thead>\n                        <tbody>\n                            <!-- empty cart message -->\n                            <tr ng-hide=\"vm.cart.getTotalCount() > 0\" >\n                                <td class=\"tdCenter\" colspan=\"7\">\n                                    Your MediaCart is empty. &nbsp;&nbsp;<a class=\"btn btn-primary\" href=\"/\" ng-click=\"vm.cancel();\">Build Campaign</a>\n                                </td>\n                            </tr>\n\n                            <tr ng-repeat=\"item in vm.cart.items track by $index \">\n                                <td>{{$index+1}}</td>\n                                <td class=\"product-thumbnail\">\n                                       {{item.publisher}}<br>\n                                    <a>\n                                        <img data-ng-src=\"data:image/png;base64,{{item.image}}\"  alt=\"{{item.publisher}}\" style=\"width: 100px;\">\n                                    </a>\n\n\n                                </td>\n\n                                                                \n                                  <td class=\"product-name\">\n                                  {{item.name}}\n                                </td>\n                                <td class=\"product-name\">\n                                  \n                                <div class=\"col-md-12 demo\">\n                                  \n                                  <div class=\"form-group has-feedback\">\n                                    <label class=\"control-label\">&nbsp;</label>\n                                    <input type=\"text\" class=\"form-control\"  id=\"config-demo\" name=\"daterange\" value=\"\" ng-model=\"item.category\" placeholder=\"Start and End Date\" />\n                                    <i class=\"glyphicon glyphicon-calendar form-control-feedback\"></i>\n                                  </div>\n                                 \n                                </td>\n                                <td>\n                                <md-input-container flex>\n                                <img  style=\"width: 100px;\" ng-src=\"{{item.creative}}\"  err-SRC=\"/assets/images/material-shop-e3ca5c21c4.jpg\">\n                               </md-input-container>\n                                <div ng-hide=\"item.creative\">\n                                 <button  class=\"btn btn-danger\" ng-hide=\"isAdmin()\" ng-click=\"cart.mediaLibrary($index)\"><i class=\"fa fa-image\"></i><span class=\"glyphicon glyphicon-upload\"></span></button>\n\n                                </div>\n\n                                <div ng-show=\"item.creative\">\n                                   <button  class=\"btn btn-success\" ng-hide=\"isAdmin()\" ng-click=\"cart.mediaLibrary($index)\"><i class=\"fa fa-image\"></i><span class=\"glyphicon glyphicon-upload\"></span></button>\n                                </div>\n\n                                  \n                                 \n                                  \n                                </td>\n\n                                <td>{{item.price | currency}}</td>\n\n                                <td >\n                                   \n                                \n                                \n                                <md-button class=\"md-raised md-primary small-button md-icon-button\" ng-click=\"vm.cart.addItem({sku:item.sku, name:item.name, slug:item.slug, mrp:item.mrp, price:item.price, weight:item.weight, vid:item.vid}, +1)\" aria-label=\"Add to cart\">\n                                          <ng-md-icon icon=\"add\"></ng-md-icon>\n                                </md-button>\n                                <div class=\"md-raised\"  ng-disabled=\"true\" aria-label=\"Cart quantity\">{{vm.cart.getQuantity(item.sku, item.vid)}}</div>\n                                 <md-button class=\"md-raised md-primary small-button md-icon-button\" \n                                      ng-click=\"vm.cart.addItem({sku:item.sku, name:item.name, slug:item.slug, mrp:item.mrp, price:item.price, weight:item.weight, vid:item.vid}, -1)\" \n                                      aria-label=\"Remove from cart\">\n                                          <ng-md-icon icon=\"remove\"></ng-md-icon>\n                                          </md-button>\n                                </td>\n\n                                <td><span><strong>{{item.price * item.quantity | currency}}</strong></span></td>\n\n                                <td class=\"product-actions\">\n                                    <a aria-label=\"Remove {{item.name}} from cart\" ng-click=\"vm.cart.addItem({sku:item.sku, vid: item.vid}, -10000000);\">\n                <ng-md-icon icon=\"close\" aria-label=\"Close dialog\"></ng-md-icon>\n            </a>\n                                </td>\n                            </tr>\n                        </tbody>\n                    </table>\n                </div>\n\n                  <hr>\n               \n          </div>\n   \n  </md-content>\n  </section>\n</md-content>\n<footer></footer>\n\n<script type=\"text/javascript\">\n$(function() {\n    $(\'input[name=\"daterange\"]\').daterangepicker();\n});\n</script>");
$templateCache.put("app/cart/media-library.html","<md-dialog aria-label=\"Media Library\" ng-cloak flex=\"95\">\n  <md-toolbar class=\"md-warn\">\n    <div class=\"md-toolbar-tools\">\n      <h2>Media Library</h2>\n      <span flex></span>\n      <md-button class=\"md-icon-button\" ng-click=\"cancel()\">\n        <ng-md-icon icon=\"close\" aria-label=\"Close dialog\"></ng-md-icon>\n      </md-button>\n    </div>\n  </md-toolbar>\n\n  <md-dialog-content>\n      <div class=\"md-dialog-content\"  class=\"md-whiteframe-z2\">\n          <md-grid-list class=\"media-list\" md-cols-xs =\"3\" md-cols-sm=\"4\" md-cols-md=\"5\" md-cols-lg=\"7\" md-cols-gt-lg=\"10\" md-row-height-gt-md=\"1:1\" md-row-height=\"4:3\" md-gutter=\"12px\" md-gutter-gt-sm=\"8px\" layout=\"row\" layout-align=\"center center\">\n            <md-grid-tile ng-repeat=\"i in media\" class=\"md-whiteframe-z2\" ng-click=\"ok(i.path)\">\n          		<div class=\"thumbnail\">\n          				<img ng-src=\"{{i.path}}\" draggable=\"false\" alt=\"{{i.name}}\">\n          		</div>\n              <md-grid-tile-footer><h3>{{i.name}}</h3></md-grid-tile-footer>\n            </md-grid-tile>\n          </md-grid-list>\n    </div>\n  </md-dialog-content>\n  <md-dialog-actions layout=\"row\">\n    <span flex></span>\n    <md-button ng-click=\"addNewImage()\" class=\"md-warn md-raised\">\n     Add new Image\n    </md-button>\n  </md-dialog-actions>\n</md-dialog>\n");
$templateCache.put("app/category/detail.html","<md-toolbar class=\"md-hue-1\" id=\"user-detail-toolbar\">\n	<span layout=\"row\" layout-align=\"space-between\" class=\"md-toolbar-tools md-toolbar-tools-top\">\n		<md-button ng-click=\"detail.goBack();\" aria-label=\"Close detail view\">\n			<ng-md-icon icon=\"close\" aria-label=\"Close dialog\"></ng-md-icon>\n		</md-button>\n		<h3>Edit {{detail.header | labelCase}} - {{detail.category._id}}</h3>\n		<md-button aria-label=\"-\">\n		</md-button>\n	</span>\n</md-toolbar>\n\n<md-content class=\"md-padding\" flex layout-fill ng-cloak id=\"user-detail-content\">\n  <section layout=\"column\">\n      <span layout=\"row\">\n        <md-input-container flex>\n          <label>Name</label>\n          <input name=\"name\" ng-model=\"detail.category.name\" md-autofocus>\n        </md-input-container>\n\n        <md-input-container flex>\n          <label>Slug</label>\n          <input name=\"slug\" ng-model=\"detail.category.slug\"/>\n        </md-input-container>\n        <md-input-container flex>\n          <label>Category</label>\n          <input name=\"category\" ng-model=\"detail.category.category\"/>\n        </md-input-container>\n      </span>\n  </section>\n	<section class=\"section\" layout=\"row\">\n<form name=\"form\" layout=\"column\" layout-fill layout-align=\"space-between\" ng-submit=\"detail.save(detail.cat);\" novalidate autocomplete=\"off\">\n		<span layout=\"column\" layout-sm=\"column\">\n		  <md-content>\n			    <section>\n			      <md-subheader class=\"md-accent\">Sub Categories </md-subheader>\n\n						<table md-colresize=\"md-colresize\" class=\"md-table\" id=\"exportable\">\n							<thead>\n								<tr class=\"md-table-headers-row\">\n									<th class=\"md-table-header\">#</th>\n									<th class=\"md-table-header\">Name</th>\n									<th class=\"md-table-header\">Active</th>\n									<th class=\"md-table-header\"></th>\n								</tr>\n							</thead>\n\n							<tbody>\n								<tr ng-repeat=\"v in detail.category.child track by $index\" id=\"{{v._id}}\"\n										class=\"md-table-content-row\"\n										ng-class=\"{\'selected\': detail.isSelected(v)}\">\n									<td>{{$index+1}}</td>\n									<td>\n										<md-input-container flex>\n											<input name=\"name\" ng-model=\"v.name\" aria-label=\"Name\"/>\n										</md-input-container>\n									</td>\n                  <td>\n										<md-input-container flex>\n											<md-switch class=\"md-secondary\" ng-model=\"v.active\" aria-label=\"Activate Category\"></md-switch>\n										</md-input-container>\n									</td>\n									<td>\n										<md-button class=\"md-icon-button\" aria-label=\"Delete Feature\"   ng-click=\"detail.deleteVariants($index,cat);\"><ng-md-icon icon=\"delete\"></ng-md-icon></md-button>\n									</td>\n								</tr>\n								<tr class=\"md-table-content-row\"\n										ng-class=\"{\'selected\': detail.isSelected(p)}\">\n									<td>{{$index}}</td>\n									<td>\n										<md-input-container flex>\n											<input name=\"name\" ng-model=\"detail.category.newSubCat.name\" aria-label=\"Variant Weight\" placeholder=\"New Name\"/>\n										</md-input-container>\n									</td>\n									<td>\n									</td>\n								</tr>\n							</tbody>\n			      </table>\n			    </section>\n\n			  </md-content>\n\n		<md-dialog-actions layout=\"row\">\n			<span flex></span>\n			<md-button ng-disabled=\"detailForm.$invalid\" type=\"submit\" class=\"md-primary md-raised\" aria-label=\"Save changes\">Save</md-button>\n		</md-dialog-actions>\n		</form>\n\n	</section>\n\n	<section class=\"section\" layout=\"column\" ng-hide=\"detail.isRoot\">\n\n		<span class=\"section-title\">Record Information</span>\n		<span layout=\"row\" layout-sm=\"column\" class=\"detail-info\">\n			<span flex=\"45\">Modified</span>\n			<span flex ng-show=\"detail.category.updatedAt\" class=\"subtitle\">\n				<span am-time-ago=\"detail.category.updatedAt\"></span>\n				<md-tooltip>{{detail.category.updatedAt | date:\'dd. MMMM yyyy H:mm\'}}</md-tooltip>\n				{{detail.category.modifiedBy && \'by \' + detail.category.modifiedBy}}\n			</span>\n		</span>\n\n		<span layout=\"row\" layout-sm=\"column\" class=\"detail-info\">\n			<span flex=\"45\">Created</span>\n			<span flex ng-show=\"detail.category.createdAt\" class=\"subtitle\">{{detail.category.createdAt | date:\'dd. MMMM yyyy H:mm\'}}</span>\n		</span>\n\n	</section>\n\n</md-content>\n\n<md-button class=\"md-fab md-accent md-fab-bottom-right fab-overlap md-button ng-scope md-blue-theme\" aria-label=\"Save Category\" ng-if=\"form.$dirty\" ng-click=\"detail.save(detail.cat);\">\n	<ng-md-icon icon=\"save\"></ng-md-icon>\n</md-button>\n");
$templateCache.put("app/category/list.html","<style>\n	.b { flex: 1; text-align: center; }\n	.pull-right{\n		margin-left:auto;\n	}\n</style>\n<md-progress-linear md-mode=\"indeterminate\" ng-show=\"list.loading\"></md-progress-linear>\n\n<!-- Nested node template -->\n<script type=\"text/ng-template\" id=\"nodes_renderer.html\">\n  <div ui-tree-handle class=\"tree-node tree-node-content\" layout=\"row\">\n    <a class=\"btn btn-success btn-xs\" ng-if=\"node.child && node.child.length > 0\" data-nodrag ng-click=\"list.toggle(this)\">\n      <ng-md-icon icon=\"chevron_right\" ng-if=\"collapsed\"></ng-md-icon>\n      <ng-md-icon icon=\"expand_more\" ng-if=\"!collapsed\"></ng-md-icon>\n    </a>\n    <div flex>{{node.name}}</div>\n		<a class=\"pull-right btn btn-danger btn-xs\" data-nodrag ng-click=\"list.remove(this,node)\">\n			<ng-md-icon icon=\"delete\"></ng-md-icon>\n		</a>\n  </div>\n  <ol ui-tree-nodes=\"\" ng-model=\"node.child\" ng-class=\"{hidden: collapsed}\">\n    <li ng-repeat=\"node in node.child\" ui-tree-node ng-include=\"\'nodes_renderer.html\'\" ng-show=\"visible(node)\">\n    </li>\n  </ol>\n</script>\n\n\n <!-- Add div For infinite scroll -->\n	<md-card infinite-scroll=\'list.loadMore()\' infinite-scroll-disabled=\'list.busy\' infinite-scroll-distance=\'1\'>\n		<md-toolbar class=\"md-table-toolbar md-default\" aria-hidden=\"false\"\n		ng-hide=\"list.selected.length || filter.show || list.data.search\">\n      <div class=\"md-toolbar-tools\">\n				<h2 class=\"md-title\">List of Categories</h2>\n			  <div flex></div>\n\n\n				<form layout layout-align=\"center\" layout-padding ng-submit=\"list.addTab(category)\" class=\"categoryAddForm\">\n					<div layout=\"row\" flex>\n							<md-input-container class=\"md-block\" layout=\"row\" layout-align=\"center end\">\n							<label >Add New Category</label>\n							<input type=\"text\" ng-model=\"category.name\">\n						</md-input-container>\n							<div>\n								<md-button class=\"md-primary md-raised\" ng-disabled=\"!category\" type=\"submit\">Add</md-button>\n							</div>\n					</div>  \n			</form>\n\n			  <md-button tabindex=\"0\" ng-click=\"filter.show = true;\" class=\"md-icon-button md-button md-default-theme\" ng-show=\"!list.no.filter\"\n				aria-label=\"Open filter box for {{list.header}}s table\">\n			    <ng-md-icon icon=\"filter_list\"></ng-md-icon>\n			  </md-button>\n				<md-menu md-position-mode=\"target-right target\" ng-if=\"!list.no.export\">\n	      <md-button aria-label=\"Open options menu\" class=\"md-icon-button\" ng-click=\"list.openMenu($mdOpenMenu, $event)\">\n	        <ng-md-icon icon=\"inbox\"></ng-md-icon>\n	      </md-button>\n	      <md-menu-content width=\"4\">\n	        <md-menu-item>\n	          <md-button\n							ng-click=\"list.exportData(\'xls\');\"\n							aria-label=\"Export {{list.header}}s table as Excel\">\n	            <ng-md-icon icon=\"receipt\"></ng-md-icon>\n	            Excel\n	          </md-button>\n	        </md-menu-item>\n					<md-menu-divider></md-menu-divider>\n	        <md-menu-item>\n	          <md-button ng-click=\"list.exportData(\'json\');\" aria-label=\"Export {{list.header}}s table in JSON format\">\n	            <ng-md-icon icon=\"account_balance_wallet\"></ng-md-icon>\n	            JSON\n	          </md-button>\n	        </md-menu-item>\n	        <md-menu-divider></md-menu-divider>\n	        <md-menu-item>\n	          <md-button ng-click=\"list.exportData(\'txt\');\" aria-label=\"Export {{list.header}}s table in Text format\">\n	            <ng-md-icon icon=\"text_format\"></ng-md-icon>\n	            Text\n	          </md-button>\n	        </md-menu-item>\n	        <md-menu-divider></md-menu-divider>\n\n	      </md-menu-content>\n	    </md-menu>\n      </div>\n    </md-toolbar>\n\n		<md-toolbar class=\"md-table-toolbar md-default\"\n			ng-show=\"filter.show || list.data.search\"\n			aria-hidden=\"false\">\n      <div class=\"md-toolbar-tools\">\n				<ng-md-icon icon=\"search\"></ng-md-icon>\n				<md-input-container flex class=\"mgt30\">\n		      <label>Filter {{list.header}}</label>\n		      <input ng-model=\"list.data.search\" focus-me=\"filter.show\" ng-change=\"findNodes()\">\n		    </md-input-container>\n				<ng-md-icon icon=\"close\" ng-click=\"filter.show = false; list.data.search = \'\';\" class=\"link\"></ng-md-icon>\n			</div>\n		</md-toolbar>\n\n<div layout=\"row\">\n    <div ui-tree=\"treeOptions\" id=\"tree-root\" flex>\n      <ol ui-tree-nodes=\"\" ng-model=\"list.data\">\n        <li ng-repeat=\"node in list.data\" ui-tree-node ng-include=\"\'nodes_renderer.html\'\" ng-show=\"visible(node)\">{{node}}</li>\n      </ol>\n    </div>\n</div>\n\n<a id=\"bottom\"></a><!--When a new category added, page should scroll to this point-->\n \n <div class=\"md-table-pagination\">\n		<span>Filtered {{filtered.length}} of {{list.data.length}} {{list.header}}s</span>\n	</div>\n</md-card>\n\n<md-card ng-if=\"!list.data.length && !list.loading\">\n	  <md-card-content>\n	    <h2>No {{list.header | labelCase}}s found</h2>\n	    <p class=\"mgl\" hide-xs>\n				There are no {{list.header | labelCase}}s!\n	      <a ng-click=\"main.create();\" href=\"\">Create one!</a>\n	    </p>\n	    <p hide-gt-xs>\n				There are no {{list.header | labelCase}}s!\n	      <a ng-click=\"main.create();\" href=\"\">Create one!</a>\n	    </p>\n	  </md-card-content>\n	</md-card>\n");
$templateCache.put("app/category/main.html","<navbar leftmenu=\"true\"></navbar>\n<left-menu></left-menu>\n<md-content flex layout=\"column\" class=\"content\">\n<section layout=\"row\">\n\n		<div ui-view=\"content\" layout=\"column\" flex></div>\n\n		<md-content\n			ui-view=\"detail\"\n			id=\"detail-content\"\n			toggle-component\n			md-component-id=\"categories.detailView\"\n			layout=\"column\"\n			flex-xs=\"100\"\n			flex-sm = \"90\"\n			flex-md=\"90\"\n			flex-lg=\"50\"\n			flex-gt-lg=\"50\"\n			class=\"md-whiteframe-z1\">\n		</md-content>\n</section>\n</md-content>\n<footer></footer>\n");
$templateCache.put("app/checkout/checkout.html","<navbar></navbar>\n<md-card ng-if=\"checkout.payment.msg\">\n      <md-card-header style=\"background:pink\">\n          <md-card-header-text>\n            <h3 ng-if=\"\">Payment Failed </h3>\n            <span class=\"md-subhead\" >\n                <div ng-if=\"checkout.payment.id\">ID: {{checkout.payment.id}}</div>\n                <b>Error:</b> \n                    <div ng-repeat=\"m in checkout.payment.msg\">{{m.field}} {{m.issue}} </div>\n            </span>\n          </md-card-header-text>\n          \n      </md-card-header>\n</md-card>\n\n<div flex layout=\"column\" layout-gt-xs=\"row\" layout-align=\"center stretch\" class=\"checkout\">\n\n<md-card>\n      <md-card-header>\n          <md-card-header-text>\n            <h3>PROCESS ORDER</h3>\n            \n            <span class=\"md-subhead\" ></span>\n          </md-card-header-text>\n          \n      </md-card-header>\n      <md-card-content>\n  <div class=\"md-table-container\">\n      <form name=\"orderForm\" ng-submit=\"checkout.checkout(checkout.addr,checkout.options,true);\" novalidate>\n      \n	<table md-colresize=\"md-colresize\" class=\"md-table\" id=\"exportable\">\n		<tbody>\n\n			<tr class=\"md-table-content-row\" >\n				<td>Order Total:</td>\n			    <td>{{checkout.Cart.cart.getTotalPrice() | currency : checkout.Settings.currency.symbol}}</td>\n			</tr>\n            <tr class=\"md-table-content-row\">\n				<td>Handling Fee: </td>\n			    <td >\n                    {{checkout.Cart.cart.getHandlingFee()| currency : checkout.Settings.currency.symbol}}\n                </td>\n			</tr>\n            <tr class=\"md-table-content-row\">\n				<td>Total Amount:&nbsp;&nbsp;&nbsp;</td>\n			    <td>{{checkout.Cart.cart.getTotalPrice() + checkout.Cart.cart.getHandlingFee() - checkout.coupon.amount | currency : checkout.Settings.currency.symbol}}</td>\n			</tr>\n            <tr>\n                <td>&nbsp;</td>\n                <td>&nbsp;</td>\n            </tr>\n            <tr class=\"md-table-content-row\">\n\n				\n			    <td colspan=\"2\"><h4>Select Payment Method</h4>\n                       <div class=\"row\">\n                            <div class=\"col-md-6 short\">\n                                <div class=\"payment-logo\">\n                                  <img width=\"200px\"  height=\"60px\" data-ng-src=\"./assets/images/paypal-e9dccdb656.png\" alt=\"\">\n                                </div>\n                                <label class=\"payment-label\" for=\"r1\">\n                                                          \n                                    <div class=\"payment-selector\" id=\"isNotMasterCard\">\n                                        <input type=\"radio\" name=\"payment_method_id\"   ng-model=\"checkout.options.paymentMethod.name\" value=\"PayPal\" id=\"r1\"> \n                                    </div>\n                                    <span class=\"payment-type-name\">PayPal</span>\n                                                  \n                                                          \n                                </label>\n\n                            </div>\n                        <div class=\"col-md-6 short\">\n                            <div class=\"payment-logo\">\n                              <img width=\"200px\"  height=\"60px\" data-ng-src=\"./assets/images/paynow-e7bc602c34.png\" alt=\"\">\n                            </div>\n                              <label class=\"payment-label\" for=\"r1\">\n                                                          \n                                  <div class=\"payment-selector\" id=\"isNotMasterCard\">\n                                      <input type=\"radio\" name=\"payment_method_id\"   ng-model=\"checkout.options.paymentMethod.name\" value=\"PayNow\" id=\"r1\"> \n                                  </div>\n                                  <span class=\"payment-type-name\">PayNow</span>\n                                                  \n                                                          \n                             </label>\n                        </div>\n                       </div>\n                        <div class=\"row\">\n                        <div class=\"col-md-6 short\">\n                            <div class=\"payment-logo\">\n                              <img width=\"200px\"  height=\"60px\" data-ng-src=\"./assets/images/flocash-943b9bd0fd.png\" alt=\"\">\n                            </div>\n                           <label class=\"payment-label\" for=\"r1\">\n                                                      \n                                <div class=\"payment-selector\" id=\"isNotMasterCard\">\n                                    <!--<input type=\"radio\" name=\"payment_method_id\"   ng-model=\"checkout.options.paymentMethod.name\" value=\"FloCash\" id=\"r1\">--> \n                                </div>\n                                <span class=\"payment-type-name\">FloCash(coming soon)</span>\n                                              \n                                                      \n                              </label>\n                        </div>\n                        <div class=\"col-md-6 short\">\n                            <div class=\"payment-logo\">\n                              <img width=\"200px\"  height=\"60px\" data-ng-src=\"./assets/images/Stripe-33041b7f3a.png\" alt=\"\">\n                            </div>\n                            <label class=\"payment-label\" for=\"r1\">\n                                                        \n                                <div class=\"payment-selector\" id=\"isNotMasterCard\">\n                                   <!-- <input type=\"radio\" name=\"payment_method_id\"  ng-model=\"checkout.options.paymentMethod.name\"  value=\"Stripe\" id=\"r1\">--> \n                                </div>\n                                <span class=\"payment-type-name\">Stripe(coming soon)</span>\n                                                \n                                                        \n                            </label>\n                        </div>\n                       </div>\n                \n                    </div><div ng-messages=\"orderForm.paymentMethod.name.$error\" ng-if=\"orderForm.paymentMethod.name.$dirty\">\n                        <div ng-message=\"required\">Payment Method is required</div>\n                    </div>\n</td>\n			</tr>\n            <tr class=\"md-table-content-row\" ng-if=\"checkout.options.paymentMethod.name===\'Stripe\'\">\n				<td>Card No:</td>\n			    <td>\n                    <md-input-container md-is-error=\"(form.number.$error.required || form.number.$error.number) && form.number.$dirty\" md-no-float>\n                        <input name=\"number\" type=\"text\" ng-model=\"checkout.stripeToken.number\"\n                        placeholder=\"Credit Card Number\"\n                        autocomplete=\"off\"\n                        ng-minlength=\"16\"\n                        ng-maxlength=\"16\"/>\n                        <small class=\"errorMessage\" ng-show=\"orderForm.number.$dirty && orderForm.number.$invalid\"> Credit Card number is invalid.\n                        </small>\n                        <div ng-messages=\"orderForm.number.$error\" ng-if=\"orderForm.number.$dirty\">\n                            <div ng-message=\"required\">Number is required</div>\n                        </div>\n                    </md-input-container>\n                </td>\n			</tr>\n            <tr class=\"md-table-content-row\" ng-if=\"checkout.options.paymentMethod.name===\'Stripe\'\">\n				<td>CVC:</td>\n			    <td>\n                    <md-input-container md-is-error=\"(form.cvc.$error.required || form.cvc.$error.cvc) && form.cvc.$dirty\" md-no-float>\n                        <input name=\"cvc\" type=\"text\" ng-model=\"checkout.stripeToken.cvc\"\n                        placeholder=\"Credit Card CVC\"\n                        autocomplete=\"off\"\n                        ng-minlength=\"3\"\n                        ng-maxlength=\"3\"/>\n                        <small class=\"errorMessage\" ng-show=\"orderForm.cvc.$dirty && orderForm.cvc.$invalid\"> Credit Card cvc is invalid.\n                        </small>\n                        <div ng-messages=\"orderForm.cvc.$error\" ng-if=\"orderForm.cvc.$dirty\">\n                            <div ng-message=\"required\">CVC is required</div>\n                        </div>\n                    </md-input-container>\n                </td>\n			</tr>\n            <tr class=\"md-table-content-row\" ng-if=\"checkout.options.paymentMethod.name===\'Stripe\'\">\n				<td>Expiry Month:</td>\n			    <td>\n                    <md-input-container md-is-error=\"(form.exp_month.$error.required || form.exp_month.$error.exp_month) && form.exp_month.$dirty\" md-no-float>\n                        <input name=\"exp_month\" type=\"text\" ng-model=\"checkout.stripeToken.exp_month\"\n                        placeholder=\"Credit Card Expiry Month\"\n                        autocomplete=\"off\"\n                        ng-pattern=\"\'(0[1-9]|1[012])\'\" />\n                        <small class=\"errorMessage\" ng-show=\"orderForm.exp_month.$dirty && orderForm.exp_month.$invalid\"> Credit Card exp_month is invalid.\n                        </small>\n                        <div ng-messages=\"orderForm.exp_month.$error\" ng-if=\"orderForm.exp_month.$dirty\">\n                            <div ng-message=\"required\">Expiry Month is required</div>\n                        </div>\n                    </md-input-container>\n                </td>\n			</tr>\n            <tr class=\"md-table-content-row\" ng-if=\"checkout.options.paymentMethod.name===\'Stripe\'\">\n				<td>Expiry Year:</td>\n			    <td>\n                    <md-input-container md-is-error=\"(form.exp_year.$error.required || form.exp_year.$error.exp_year) && form.exp_year.$dirty\" md-no-float>\n                        <input name=\"exp_year\" type=\"text\" ng-model=\"checkout.stripeToken.exp_year\"\n                        placeholder=\"Credit Card Expiry Month\"\n                        autocomplete=\"off\"\n                        ng-pattern=\"\'^(20)\\\\d{2}$\'\"/>\n                        <small class=\"errorMessage\" ng-show=\"orderForm.exp_year.$dirty && orderForm.exp_year.$invalid\"> Credit Card exp_year is invalid.\n                        </small>\n                        <div ng-messages=\"orderForm.exp_year.$error\" ng-if=\"orderForm.exp_year.$dirty\">\n                            <div ng-message=\"required\">Expiry Year is required</div>\n                        </div>\n                    </md-input-container>\n                </td>\n			</tr>\n            <tr class=\"md-table-content-row\">\n	\n				<td><h3>Discount Coupon:</h3></td>\n			    <td>\n                    <md-input-container md-is-error=\"(form.name.$error.required || form.name.$error.name) && form.name.$dirty\" md-no-float>\n                        <input name=\"coupon\" type=\"text\" ng-model=\"checkout.options.coupon\" ng-change=\"checkout.checkCoupon(checkout.options.coupon, checkout.Cart.cart.getTotalPrice())\"\n                        placeholder=\"Discount Coupon\"\n                        autocomplete=\"off\"/>\n                        <span class=\"text-muted text-success\" ng-if=\"checkout.coupon.code\">{{checkout.coupon.type}} of {{checkout.coupon.amount | currency : checkout.Settings.currency.symbol}} was applied to the cart</span>\n                        <small class=\"errorMessage\" ng-show=\"orderForm.coupon.$dirty && orderForm.coupon.$invalid\"> Discount coupon was expired.\n                        </small>\n                        <div ng-messages=\"orderForm.coupon.$error\" ng-if=\"orderForm.coupon.$dirty\">\n                            <div ng-message=\"required\">Coupon is expired</div>\n                        </div>\n                    </md-input-container>\n                    <input type=\"hidden\" ng-model=\"checkout.cartValid\" validate-cart>\n                    <div class=\"hidden\">{{orderForm.$valid = !(vm.shipping.best[\'charge\'] === undefined)}}</div>\n                </td>\n			</tr>\n		</tbody>\n\n	</table>\n      <br/>\n\n    <div layout=\"column\" layout-align=\"center stretch\">\n        <md-button type=\"submit\" class=\"md-raised circular-progress-button md-primary\" \n        ng-disabled=\"orderForm.number.$invalid || orderForm.exp_month.$invalid || orderForm.exp_year.$invalid || orderForm.cvc.$invalid || checkout.loading || checkout.Cart.cart.getTotalPrice()===0 || !checkout.addr\" aria-label=\"Place Order\" layout=\"row\" layout-align=\"center center\"> \n            <div flex></div>\n            <ng-md-icon icon=\"local_shipping\" ng-hide=\"checkout.loading\"></ng-md-icon>\n            <md-progress-circular md-mode=\"indeterminate\" md-diameter=\"25\" ng-show=\"checkout.loading\" class=\"md-accent md-hue-1\"></md-progress-circular>\n            <span>&nbsp;Place Order</span>\n            <div flex></div>\n        </md-button>\n    </div>\n\n	</form>\n</div>\n</md-card-content>\n</md-card>\n\n<div layout=\"column\" layout-gt-sm=\"row\">\n<!--Address box-->\n\n<md-card ng-show=\"checkout.showAddressForm\">\n    <md-card-content>\n	<p ng-show=\"checkout.error\" class=\"md-warn\">{{checkout.error.message}}</p>\n	<h3>SELECTED ADDRESS</h3>\n	<form name=\"form\" ng-submit=\"checkout.saveAddress(checkout.addr);new.address=false;checkout.addr = checkout.address[0];\" novalidate layout=\"column\">\n		<md-input-container md-is-error=\"(form.name.$error.required || form.name.$error.name) && form.name.$dirty\">\n			<label>Company Name</label>\n			<input name=\"name\" type=\"name\" ng-model=\"checkout.addr.name\" required autofocus>\n			<div ng-messages=\"form.name.$error\" ng-if=\"form.name.$dirty\">\n				<div ng-message=\"required\">Company Name is required</div>\n			</div>\n		</md-input-container>\n        \n        <md-input-container md-is-error=\"(form.addr.$error.required || form.addr.$error.addr) && form.addr.$dirty\">\n			<label>Company Address</label>\n			<input name=\"address\" type=\"address\" ng-model=\"checkout.addr.address\" required/>\n			<div ng-messages=\"form.address.$error\" ng-if=\"form.address.$dirty\">\n				<div ng-message=\"required\">Address is required</div>\n			</div>\n		</md-input-container>\n        \n        <md-input-container md-is-error=\"(form.city.$error.required || form.city.$error.city) && form.city.$dirty\">\n			<label>City</label>\n			<input name=\"city\" type=\"city\" ng-model=\"checkout.addr.city\" required/>\n			<div ng-messages=\"form.city.$error\" ng-if=\"form.city.$dirty\">\n				<div ng-message=\"required\">City is required</div>\n			</div>\n		</md-input-container>\n\n        <md-input-container md-is-error=\"(form.zip.$error.required || form.zip.$error.zip) && form.zip.$dirty\">\n			<label>Zip</label>\n			<input name=\"zip\" type=\"zip\" ng-model=\"checkout.addr.zip\" required only-numbers/>\n			<div ng-messages=\"form.zip.$error\" ng-if=\"form.zip.$dirty\">\n				<div ng-message=\"required\">Zip code is required</div>\n			</div>\n		</md-input-container>\n        \n        <md-input-container md-is-error=\"(form.state.$error.required || form.state.$error.state) && form.state.$dirty\">\n			<label>State</label>\n			<input name=\"state\" type=\"state\" ng-model=\"checkout.addr.state\" required/>\n			<div ng-messages=\"form.state.$error\" ng-if=\"form.state.$dirty\">\n				<div ng-message=\"required\">State is required</div>\n			</div>\n		</md-input-container>\n        \n        <md-input-container md-is-error=\"(form.phone.$error.required || form.phone.$error.phone) && form.phone.$dirty\">\n			<label>Phone</label>\n			<input name=\"phone\" type=\"phone\" ng-model=\"checkout.addr.phone\" required/>\n			<div ng-messages=\"form.phone.$error\" ng-if=\"form.phone.$dirty\">\n				<div ng-message=\"required\">Phone number is required</div>\n			</div>\n		</md-input-container>\n\n        <!--<md-input-container md-is-error=\"(form.country.$error.required || form.country.$error.country) && form.country.$dirty\">\n            <label>Country</label>\n            <input ng-model=\"checkout.addr.country\" ng-value=\"checkout.Settings.country.name\" disabled/>\n            <div ng-messages=\"form.country.$error\" ng-if=\"form.country.$dirty\">\n				<div ng-message=\"required\">Country required</div>\n			</div>\n		</md-input-container>-->\n        <div layout=\"row\">\n            <md-button type=\"submit\" class=\"md-raised md-primary\" \n            ng-disabled=\"!form.$valid || checkout.loadingAddress\" aria-label=\"Save Address\" layout=\"row\">\n                <ng-md-icon icon=\"save\" ng-hide=\"checkout.loadingAddress\"></ng-md-icon>\n                <md-progress-circular md-mode=\"indeterminate\" md-diameter=\"25\" ng-show=\"checkout.loadingAddress\" class=\"md-accent md-hue-1\"></md-progress-circular>\n                Save <span hide show-gt-xs>as Primary Address</span>\n            </md-button>\n            <md-button ng-click=\"checkout.cancelForm(checkout.addr);new.address=false;\">Cancel</md-button>\n	   </div>\n       </form>\n    </md-card-content>\n</md-card>\n<div layout=\"column\">\n<md-button class=\"md-raised\" ng-click=\"checkout.addressForm(true);checkout.new.address=true; checkout.addr={country: checkout.Settings.country.name}\">\n    <ng-md-icon icon=\"location_on\"></ng-md-icon>Add New Address\n</md-button>\n\n<md-card  \nng-repeat=\"a in checkout.address\" \nng-click=\"new.address=false; checkout.addressForm(true);checkout.switchAddress(a)\" \nstyle=\"min-width:300px\" \nng-class=\"{\'selected\':(a==checkout.addr)} \"\n>\n      <md-card-header layout=\"row\" layout-align=\"space-between start\">\n          <md-card-header-text>\n            <h3>BILLING ADDRESS - {{$index+1}}</h3>\n          </md-card-header-text>\n          	<div>\n				  <md-button ng-click=\"checkout.delete(a)\" aria-label=\"Delete Address\"><ng-md-icon icon=\"delete\"></ng-md-icon></md-button>  \n			</div>				  \n      </md-card-header>\n	  \n      <md-card-content layout=\"column\" layout-align=\"start start\">\n			{{a.name}}<br/>\n            {{a.address}}<br/>\n            {{a.city}}<br/>\n            {{a.state}}<br/>\n            {{a.zip}}<br/>\n            {{a.phone}}\n      </md-card-content>\n      \n</md-card>\n</div><!--Address box-->\n</div>\n\n\n</div>\n<footer></footer>\n");
$templateCache.put("app/contact/contact.html","<crud-table api=\'contact\' options=\'options\'></crud-table>\n");
$templateCache.put("app/country/country.html","<crud-table api=\'country\' options=\'options\'></crud-table>\n");
$templateCache.put("app/coupon/coupon.html","<crud-table api=\'coupon\' options=\'options\'></crud-table>\n");
$templateCache.put("app/customer/customer.html","<crud-table api=\'customer\' options=\'options\'></crud-table>\n");
$templateCache.put("app/dashboard/dashboard.html","<navbar leftmenu=\"true\"></navbar>\n<left-menu></left-menu>\n<div layout-align=\"start center\" layout=\"column\">\n<h2 class=\"md-title\">Examples</h2>\n</div>\n<md-grid-list class=\"things-list\" md-cols-xs =\"1\" md-cols-sm=\"2\" md-cols-md=\"3\" md-cols-lg=\"5\" md-cols-gt-lg=\"5\" md-row-height-gt-md=\"1:1\" md-row-height=\"4:3\" md-gutter=\"12px\" md-gutter-gt-sm=\"8px\" layout=\"row\" layout-align=\"center center\">\n  <md-grid-tile ng-repeat=\"p in dashboard.pages\" ng-class=\"dashboard.getColor($index)\" class=\"md-whiteframe-z2\" ui-sref=\"{{p.url}}\">\n    <ng-md-icon icon=\"{{p.icon}}\" size=\"128\"></ng-md-icon>\n    <md-grid-tile-footer><h3>{{p.text}}</h3></md-grid-tile-footer>\n  </md-grid-tile>\n</md-grid-list>\n<footer></footer>\n");
$templateCache.put("app/documentation/back.html","<doc-menu></doc-menu>\n\n<md-content flex layout-padding layout=\"row\">\n<section class=\"doc\" flex>\n\n<h3>::::::::::::::: Store Administration ::::::::::::::</h3>\n<blockquote>\n  <em>Only administrators, managers can access the pages</em>\n</blockquote>\n    <div class=\"post\">\n    <h2 id=\"add-brands\">Manage Brands</h2>\n    <p>Administrators can add, edit, delete, filter brands of their store from this view</p>\n    <div class=\"image\"><a><img src=\"/assets/img/brands.jpg\" class=\"img-responsive\" alt=\"Manage Brands\"></a></div>\n    <hr>\n    </div>\n\n    <div class=\"post\">\n    <h2 id=\"add-categories\">Manage Categories</h2>\n    <p>\n      <ul>\n        <li>Categories are presented in Parent-Child manner in this store for better organisation of products.</li>\n        <li>Store\'s navigation bar at top contains all the categories arranged in parent-child fashion.</li>\n        <div class=\"image\"><a><img src=\"/assets/img/navbar.jpg\" class=\"img-responsive\" alt=\"Manage Categories\"></a></div>\n\n        <li>This view provides facility to add both parent and child categories, edit them, re-arrange category association according to their requirement.</li>\n      </ul>\n     </p>\n    <div class=\"image\"><a><img src=\"/assets/img/categories.jpg\" class=\"img-responsive\" alt=\"Manage Categories\"></a></div>\n    <hr>\n    </div>\n\n    <div class=\"post\">\n    <h2 id=\"add-products\">Manage Products</h2>\n    <p><em>This is the main page for administrators to manage products at store.</em>\n    <ul>\n      <li>The right sidebar lists all the available products with a search box to filter the list.</li>\n      <li>Clicking on a product at the product list will populate the details of the product at the left sidebar</li>\n      <li>The left sidebar has option to change product name, details, brand, category</li>\n      <li>This left sidebar also contains a module to manage product variants which has facility for Size, MRP, Price and Image for that perticular variant</li>\n    </ul>\n    </p>\n    <div class=\"image\"><a><img src=\"/assets/img/products.jpg\" class=\"img-responsive\" alt=\"Add Products\"></a></div>\n    <hr>\n    </div>\n\n    <div class=\"post\">\n    <h2 id=\"manage-users\">Manage Users (Customers)</h2>\n    <p>Using this view administrators can add, remove or edit users of their shopping web application</p>\n    <div class=\"image\"><a><img src=\"/assets/img/customers.jpg\" class=\"img-responsive\" alt=\"Manage customers\"></a></div>\n    <hr>\n    </div>\n</section>\n</md-content>");
$templateCache.put("app/documentation/features.html","<navbar leftmenu=\"true\"></navbar>\n<left-menu></left-menu>\n<div class=\"col-md-12\">\n    <ul class=\"breadcrumb\">\n        <li><a href=\"/\">Home</a>\n        </li>\n        <li>FAQ\'s</li>\n       \n    </ul>\n</div>\n<div class=\"row\">\n<div class=\"col-md-2\">\n\n</div>\n\n<div class=\"col-md-8\">\n\n\n    <div class=\"box\" id=\"contact\">\n\n<h1>Top 10 Questions </h1>\n\n<h3>How do I get started </h3>\n<p>What should I do after I register? Once you sign up as an advertiser, you can immediately start building and launching campaigns with any publisher  that is set up in the system.</p>\n\n\n<h3>How does MediaBox make money?</h3>\n <p>MediaBox charges advertisers a 20%, 10%, or 5% service fee depending on the total amount they’ve billed with a publisher. We also offer publishers optional premium memberships and subscription services.</p>\n <h3>How do payments work ,how are payments and invoices handled? </h3> \n <p>Using our automated billing system, Once you review and approve your campaigns and both parties have engaged Mediabox charges your payment method or per transaction  and releases funds to the publisher  .</p>\n\n<h3>What methods of payment do you accept and what do they cost? </h3>\n<p>You can pay using MasterCard, Visa,PayNow, or PayPal. Any payments are subject to a 2.75% processing fee. Or 3 % for PayNow</p>\n\n<h3>How do i benefit from using Mediabox</h3>\n<p>We provide you with the technology that will help you in managing your advertising content\nThis automation translates to significant benefits for both advertisers and publishers in the form of<br>\nREDUCTION IN OPERATION COSTS<br>\nPublishers can free their sales teams to spend more time establishing high value relationships, whilst advertisers can access a market of known publishers, known price and known availability, further more to advertise with any publisher on Mediabox you need not have to visit their offices as everything is done through the platform from creative submission to payments </p>\n\n<h3>How do I find the best publisher for my advertising campaign?</h3>\n<p>Our Smart filters will also help you discover the best publishers that match your budget and or campaign objectives. Advertisers can filter publishers based on location (region and country),budget ,target audience(income levels ,age group ,gender) ,reach ,platform (newspapers ,magazines fliers ,newsletters ,websites ,social media ,billboards ,inflight ,in-store ,cinema ).</p>\n\n<h3>Does Mediabox screen publishers  </h3>\n<p>At MediaBox we strive to provide a fair and trusted marketplace. This includes working diligently to verify that publishers are representing themselves correctly. We begin by authenticating the email address of registered users. We then provide many forms of screening for publishers  to use. Ultimately however, it is your responsibility to do the final screening to help ensure that the Publisher is a great match for you and your advertising requirements. We do have features in place to help facilitate the screening process, from MediaBox Messages  for real-time communication with publishers to custom screening questions to assist you in identifying the best matches.</p>\n\n<h3>What publishers can I find on Mediabox</h3>\n<p>Anywhere you can put your product  or service to be seen by your potential customers from traditional publishers (Magazines ,Newspapers ,Billboards ) to unorthodox methods such as  Vehicle in Transit ,Air advertising .Big or small   you will find best ways to advertise your products or services on Mediabox</p>\n\n\n</div>\n\n\n</div>\n\n<!-- /.col-md-8 -->\n<div class=\"col-md-2\">\n\n</div>\n</div>\n<footer></footer>\n\n");
$templateCache.put("app/documentation/index.html","<style type=\"text/css\">\n\n\n/*\nBootstrap Image Carousel Slider with Animate.css\nCode snippet by Hashif (http://hashif.com) for Bootsnipp.com\nImage credits: unsplash.com\n*/\n@import url(https://fonts.googleapis.com/css?family=Quicksand:400,700);\n\nbody {\n    font-family: \'Quicksand\', sans-serif;\n    font-weight:700;\n}\n\n\n\n\n\n/********************************/\n/*          Main CSS     */\n/********************************/\n\n\n#first-slider .main-container {\n  padding: 0;\n}\n\n\n#first-slider .slide1 h3, #first-slider .slide2 h3, #first-slider .slide3 h3, #first-slider .slide4 h3{\n    color: #fff;\n    font-size: 30px;\n      text-transform: uppercase;\n      font-weight:700;\n}\n\n#first-slider .slide1 h4,#first-slider .slide2 h4,#first-slider .slide3 h4,#first-slider .slide4 h4{\n    color: #fff;\n    font-size: 30px;\n      text-transform: uppercase;\n      font-weight:700;\n}\n#first-slider .slide1 .text-left ,#first-slider .slide3 .text-left{\n    padding-left: 40px;\n}\n\n\n#first-slider .carousel-indicators {\n  bottom: 0;\n}\n#first-slider .carousel-control.right,\n#first-slider .carousel-control.left {\n  background-image: none;\n}\n#first-slider .carousel .item {\n  min-height: 425px; \n  height: 100%;\n  width:100%;\n}\n\n.carousel-inner .item .container {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    position: absolute;\n    bottom: 0;\n    top: 0;\n    left: 0;\n    right: 0;\n}\n\n\n#first-slider h3{\n  animation-delay: 1s;\n}\n#first-slider h4 {\n  animation-delay: 2s;\n}\n#first-slider h2 {\n  animation-delay: 3s;\n}\n\n\n#first-slider .carousel-control {\n    width: 6%;\n        text-shadow: none;\n}\n\n\n#first-slider h1 {\n  text-align: center;  \n  margin-bottom: 30px;\n  font-size: 30px;\n  font-weight: bold;\n}\n\n#first-slider .p {\n  padding-top: 125px;\n  text-align: center;\n}\n\n#first-slider .p a {\n  text-decoration: underline;\n}\n#first-slider .carousel-indicators li {\n    width: 14px;\n    height: 14px;\n    background-color: rgba(255,255,255,.4);\n  border:none;\n}\n#first-slider .carousel-indicators .active{\n    width: 16px;\n    height: 16px;\n    background-color: #fff;\n  border:none;\n}\n\n\n.carousel-fade .carousel-inner .item {\n  -webkit-transition-property: opacity;\n  transition-property: opacity;\n}\n.carousel-fade .carousel-inner .item,\n.carousel-fade .carousel-inner .active.left,\n.carousel-fade .carousel-inner .active.right {\n  opacity: 0;\n}\n.carousel-fade .carousel-inner .active,\n.carousel-fade .carousel-inner .next.left,\n.carousel-fade .carousel-inner .prev.right {\n  opacity: 1;\n}\n.carousel-fade .carousel-inner .next,\n.carousel-fade .carousel-inner .prev,\n.carousel-fade .carousel-inner .active.left,\n.carousel-fade .carousel-inner .active.right {\n  left: 0;\n  -webkit-transform: translate3d(0, 0, 0);\n          transform: translate3d(0, 0, 0);\n}\n.carousel-fade .carousel-control {\n  z-index: 2;\n}\n\n.carousel-control .fa-angle-right, .carousel-control .fa-angle-left {\n    position: absolute;\n    top: 50%;\n    z-index: 5;\n    display: inline-block;\n}\n.carousel-control .fa-angle-left{\n    left: 50%;\n    width: 38px;\n    height: 38px;\n    margin-top: -15px;\n    font-size: 30px;\n    color: #fff;\n    border: 3px solid #ffffff;\n    -webkit-border-radius: 23px;\n    -moz-border-radius: 23px;\n    border-radius: 53px;\n}\n.carousel-control .fa-angle-right{\n    right: 50%;\n    width: 38px;\n    height: 38px;\n    margin-top: -15px;\n    font-size: 30px;\n    color: #fff;\n    border: 3px solid #ffffff;\n    -webkit-border-radius: 23px;\n    -moz-border-radius: 23px;\n    border-radius: 53px;\n}\n.carousel-control {\n    opacity: 1;\n    filter: alpha(opacity=100);\n}\n\n\n/********************************/\n/*       Slides backgrounds     */\n/********************************/\n#first-slider .slide1 {\n    background-image: url(\"../../assets/images/main-slider-3-b11ce1eff5.jpg\");\n      background-size: cover;\n    background-repeat: no-repeat;\n}\n#first-slider .slide2 {\n  background-image: url(\"../../assets/images/main-slider-3-b11ce1eff5.jpg\");\n      background-size: cover;\n    background-repeat: no-repeat;\n}\n#first-slider .slide3 {\n  background-image: url(\"../../assets/images/main-slider-3-b11ce1eff5.jpg\");\n      background-size: cover;\n    background-repeat: no-repeat;\n}\n#first-slider .slide4 {\n  background-image: url(\"../../assets/images/main-slider-3-b11ce1eff5.jpg\");\n      background-size: cover;\n    background-repeat: no-repeat;\n}\n\n\n\n\n/********************************/\n/*          Media Queries       */\n/********************************/\n@media screen and (min-width: 980px){\n      \n}\n@media screen and (max-width: 640px){\n      \n}\n\n    \n    body,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n    font-family: \"Lato\",\"Helvetica Neue\",Helvetica,Arial,sans-serif;\n    font-weight: 500;\n}\n.material-icons.md-18 { font-size: 18px; }\n.material-icons.md-24 { font-size: 24px; }\n.material-icons.md-36 { font-size: 36px; }\n.material-icons.md-48 { font-size: 48px; }\n.material-icons.md-96 { font-size: 96px; }\n.material-icons.orange600 {color: #d9534f}\n\n.topnav {\n    font-size: 14px; \n}\n\n.lead {\n    font-size: 16px;\n    font-weight: 400;\n}\n\n.intro-header {\n    padding-top: 50px; /* If you\'re making other pages, make sure there is 50px of padding to make sure the navbar doesn\'t overlap content! */\n    padding-bottom: 50px;\n    text-align: center;\n    color: #f8f8f8;\n   \n    background-size: cover;\n}\n\n.intro-message {\n    position: relative;\n    color: #333333;\n    padding-bottom: 5%;\n}\n\n.intro-message > h1 {\n    margin: 0;\n   \n    font-size: 5em;\n}\n\n.intro-divider {\n    width: 400px;\n    border-top: 1px solid #f8f8f8;\n    border-bottom: 1px solid rgba(0,0,0,0.2);\n}\n\n.intro-message > h3 {\n\n}\n\n@media(max-width:767px) {\n    .intro-message {\n        padding-bottom: 15%;\n    }\n\n    .intro-message > h1 {\n        font-size: 3em;\n    }\n\n    ul.intro-social-buttons > li {\n        display: block;\n        margin-bottom: 20px;\n        padding: 0;\n    }\n\n    ul.intro-social-buttons > li:last-child {\n        margin-bottom: 0;\n    }\n\n    .intro-divider {\n        width: 100%;\n    }\n}\n\n.network-name {\n    text-transform: uppercase;\n    font-size: 14px;\n    font-weight: 400;\n    letter-spacing: 2px;\n}\n\n.content-section-a {\n    padding: 50px 0;\n    background-color: #f8f8f8;\n}\n\n.content-section-b {\n    padding: 50px 0;\n    border-top: 1px solid #e7e7e7;\n    border-bottom: 1px solid #e7e7e7;\n}\n\n.section-heading {\n    margin-bottom: 30px;\n    font-weight: 700;\n}\n\n.section-heading-spacer {\n    float: left;\n    width: 200px;\n    border-top: 3px solid #e7e7e7;\n}\n\n.banner {\n    padding: 100px 0;\n    color: #f8f8f8;\n    background: url(../img/banner-bg.jpg) no-repeat center center;\n    background-size: cover;\n}\n\n.banner h2 {\n    margin: 0;\n    text-shadow: 2px 2px 3px rgba(0,0,0,0.6);\n    font-size: 3em;\n}\n\n.banner ul {\n    margin-bottom: 0;\n}\n\n.banner-social-buttons {\n    float: right;\n    margin-top: 0;\n}\n\n@media(max-width:1199px) {\n    ul.banner-social-buttons {\n        float: left;\n        margin-top: 15px;\n    }\n}\n\n@media(max-width:767px) {\n    .banner h2 {\n        margin: 0;\n        text-shadow: 2px 2px 3px rgba(0,0,0,0.6);\n        font-size: 3em;\n    }\n\n    ul.banner-social-buttons > li {\n        display: block;\n        margin-bottom: 20px;\n        padding: 0;\n    }\n\n    ul.banner-social-buttons > li:last-child {\n        margin-bottom: 0;\n    }\n}\n\n\nfooter {\n    padding: 50px 0;\n    background-color: #f8f8f8;\n}\n\np.copyright {\n    margin: 15px 0 0;\n} \n\n.white-bg {\n    background-color: #fff;\n}\n\n\n\n@media (max-width: 767px)\n.space-80, .space-100 {\n    padding-bottom: 50px;\n    padding-top: 50px;\n}\n@media (max-width: 767px)\n.video-bg {\n    min-height: auto;\n}\n\n@media (max-width: 1200px)\n.theme-container {\n    padding-left: 15px;\n    padding-right: 15px;\n}\n\n@media (max-width: 479px)\n.section-title, .caption-text .extra-bold-font {\n    font-size: 16px;\n    margin-bottom: 10px;\n}\n\n.mask-overlay {\n    background: rgba(0, 0, 0, 0.5) none repeat scroll 0 0;\n}\n.mask-overlay, .theme-color-mask, .white-mask {\n    bottom: 0;\n    left: 0;\n    position: absolute;\n    right: 0;\n    top: 0;\n    z-index: 0;\n}\n.theme-container {\n    padding-left: 0;\n    padding-right: 0;\n}\n\n.white-color {\n    color: #fff;\n}\n.title-wrap {\n    display: inline-block;\n    width: 100%;\n    vertical-align: middle;\n    text-align: center;\n}\n\n.relative-div {\n    position: relative;\n}\n.slider-title-1 {\n    text-transform: uppercase;\n    font-size: 14px;\n}\nsecondery-font, .section-title, .title-1, .title-2, .title-3, .article-title > h2, .comment-reply-title, .comment-author .fn, .comment-metadata a, .theme-btn, .theme-btn-1, .theme-btn-2, .form-submit > input[type=\"submit\"], .primary-navbar li a, .form-control, .countdown-amount, .countdown-period {\n    font-family: \'Montserrat\', sans-serif;\n}\nwhite-color .section-title, .white-color p {\n    color: #fff;\n}\n\n.space-top-15 {\n    padding-top: 15px;\n}\n.section-title {\n    font-size: 54px;\n}\n.section-title, .title-1, .title-2, .title-3, .article-title > h2, .comment-reply-title, .comment-author .fn, .comment-metadata a {\n    color: #3c3d41;\n    text-transform: capitalize;\n    letter-spacing: 1px;\n}\n.devices-wrap .fa {\n    font-size: 35px;\n    margin-bottom: 5px;\n}\n\n\n.space-50 {\n    padding-bottom: 50px;\n    padding-top: 50px;\n}\n.block-inline {\n    display: inline-block;\n    width: 100%;\n    vertical-align: middle;\n}\n\n.theme-color, .hover-color:hover, .hover-color:focus, .navigation .dropdown-menu li a:hover, .navigation .dropdown-menu li a:focus, .breadcrumb-menubar > li > a:hover, .breadcrumb-menubar > li > a:focus {\n    color: #d80018;\n}\n\n.slider-form .submit-btn, .video-icon.fa, .price-box:hover .theme-btn-2, .price-box:focus .theme-btn-2, .title-devider .line-1, .theme-btn-1:hover, .theme-btn-1:focus, .widget-wrap.tag-cloud a:hover, .widget-wrap.tag-cloud a:focus, .pagination > .active > a, .pagination > .active > a:focus, .pagination > .active > a:hover, .pagination > .active > span, .pagination > .active > span:focus, .pagination > .active > span:hover, .pagination > li > a:focus, .pagination > li > a:hover, .pagination > li > span:focus, .pagination > li > span:hover, .post-next:hover, .post-previous:hover, .post-next:focus, .post-previous:focus, .form-submit > input[type=\"submit\"] {\n    border-color: #d80018;\n}\ntrong { font-weight: 500; }\n\na, a:hover, a:focus {\n    color: #e89a3e;\n    text-decoration: none;\n    -o-transition: all .3s; -moz-transition: all .3s; -webkit-transition: all .3s; -ms-transition: all .3s; transition: all .3s;\n}\n\nh1 {\n    margin-top: 10px;\n    font-size: 38px;\n    font-weight: 100;\n    color: #555;\n    line-height: 50px;\n}\n\n.medium-paragraph {\n    font-size: 18px;\n    line-height: 32px;\n}\n\n::-moz-selection { background: #e89a3e; color: #fff; text-shadow: none; }\n::selection { background: #e89a3e; color: #fff; text-shadow: none; }\n\n\n/***** Modal *****/\n\n.modal-backdrop.in {\n    filter: alpha(opacity=7);\n    opacity: 0.7;\n}\n\n.modal-content {\n    background: none;\n    border: 0;\n    -moz-border-radius: 0; -webkit-border-radius: 0; border-radius: 0;\n    -moz-box-shadow: none; -webkit-box-shadow: none; box-shadow: none;\n}\n\n.modal-body {\n    padding: 0 25px 25px 25px;\n}\n\n.modal-header {\n    padding: 25px 25px 15px 25px;\n    text-align: right;\n}\n\n.modal-header, .modal-footer {\n    border: 0;\n}\n\n.modal-header .close {\n    float: none;\n    margin: 0;\n    font-size: 36px;\n    color: #fff;\n    font-weight: 300;\n    text-shadow: none;\n    opacity: 1;\n}\n\n\n/***** Top content *****/\n\n.top-content {\n    height: 100%;\n    min-height: 100%;\n    padding: 120px 0;\n}\n\n.top-content .text,\n.top-content .text h1 {\n    color: #fff;\n}\n\n.top-content .text p {\n    margin: 20px 0 10px 0;\n    opacity: 0.8;\n}\n\n.top-content .text p a {\n    color: #fff;\n    border-bottom: 1px dotted #fff;\n}\n\n.top-content .text p a:hover,\n.top-content .text p a:focus {\n    color: #fff;\n    border: 0;\n}\n\n.video-link {\n    padding-top: 70px;\n}\n\n.video-link a:hover,\n.video-link a:focus {\n    outline: 0;\n}\n\na .video-link-text {\n    color: #fff;\n    opacity: 0.8;\n    -o-transition: all .3s; -moz-transition: all .3s; -webkit-transition: all .3s; -ms-transition: all .3s; transition: all .3s;\n}\n\na:hover .video-link-text, \na:focus .video-link-text {\n    outline: 0;\n    color: #fff;\n    opacity: 1;\n    border-bottom: 1px dotted #fff;\n}\n\na .video-link-icon {\n    position: relative;\n    display: inline-block;\n    width: 50px;\n    height: 50px;\n    margin-right: 10px;\n    background: #e89a3e;\n    color: #fff;\n    line-height: 50px;\n    -moz-border-radius: 50%; -webkit-border-radius: 50%; border-radius: 50%;\n    -o-transition: all .3s; -moz-transition: all .3s; -webkit-transition: all .3s; -ms-transition: all .3s; transition: all .3s;\n}\na .video-link-icon:after {\n    position: absolute;\n    content: \"\";\n    top: -6px;\n    left: -6px;\n    width: 66px;\n    height: 66px;\n    background: #444;\n    background: rgba(0, 0, 0, 0.1);\n    z-index: -99;\n    -moz-border-radius: 50%; -webkit-border-radius: 50%; border-radius: 50%;\n}\n\na:hover .video-link-icon,\na:focus .video-link-icon {\n    outline: 0;\n    background: #fff;\n    color: #e89a3e;\n}\n\n.social {\n    padding-top: 100px;\n    font-size: 28px;\n    line-height: 38px;\n}\n\n.social a {\n    margin: 5px 15px;\n    color: #fff;\n    color: rgba(255, 255, 255, 0.6);\n    vertical-align: middle;\n}\n\n.social a:hover,\n.social a:focus {\n    outline: 0;\n    color: #fff;\n}\n\n.social .divider-2 {\n    display: inline-block;\n    width: 1px;\n    height: 14px;\n    background: #fff;\n    background: rgba(255, 255, 255, 0.4);\n    vertical-align: middle;\n}\n\n\n/***** Media Queries *****/\n\n@media (min-width: 992px) and (max-width: 1199px) { }\n\n@media (min-width: 768px) and (max-width: 991px) {\n    \n    .top-content { padding-top: 60px; }\n    .social { padding-top: 80px; }\n\n}\n\n@media (max-width: 767px) {\n\n    .top-content { padding: 20px 0 20px 0; }\n    .video-link { padding-top: 40px; }\n    .social { padding-top: 50px; }\n\n}\n\n@media (max-width: 415px) {\n    \n    h1 { font-size: 32px; }\n    \n    .social .divider-2 { display: none; }\n\n}\n</style>\n<link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css\">\n<link rel=\"stylesheet\" href=\"http://cdn.bootcss.com/animate.css/3.5.1/animate.min.css\">\n<div id=\"top\">\n    <div class=\"container\">\n        <div class=\"col-md-1\">\n            <a  href=\"index.html\">\n                <img src=\"/assets/img/logo.png\"  class=\"hidden-xs\">\n                <img src=\"/assets/img/logo.png\"  class=\"visible-xs\"><span class=\"sr-only\"></span>\n            </a>\n        </div>\n         <div class=\"col-md-9 offer\" style=\"padding-top:  15px\" data-animate=\"fadeInDown\">\n            \n             &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;We provide advertising inventory ? <a href=\"/\">Get it here .</a>\n        </div>\n        <div class=\"col-md-2 pull-right\" data-animate=\"fadeInDown\">\n           <top-menu ng-if=\"!search.show\"></top-menu> \n        </div>\n    </div>\n   </div>\n\n<div id=\"first-slider\">\n    <div id=\"carousel-example-generic\" class=\"carousel slide carousel-fade\">\n        <!-- Indicators -->\n        <ol class=\"carousel-indicators\">\n            <li data-target=\"#carousel-example-generic\" data-slide-to=\"0\" class=\"active\"></li>\n            <li data-target=\"#carousel-example-generic\" data-slide-to=\"1\"></li>\n            <li data-target=\"#carousel-example-generic\" data-slide-to=\"2\"></li>\n            <li data-target=\"#carousel-example-generic\" data-slide-to=\"3\"></li>\n        </ol>\n        <!-- Wrapper for slides -->\n        <div class=\"carousel-inner\" role=\"listbox\">\n            <!-- Item 1 -->\n            <div class=\"item active slide1\">\n                <div class=\"row\"><div class=\"container\">\n                    <div class=\"col-md-3 text-right\">\n                        <img style=\"max-width: 200px;\"  data-animation=\"animated zoomInLeft\" src=\"http://s20.postimg.org/pfmmo6qj1/window_domain.png\">\n                    </div>\n                    <div class=\"col-md-9 text-left\">\n                        <h3  style=\"color:#333333;\" data-animation=\"animated bounceInDown\">Africa\'s first Online Market Place For Advertising Media!</h3>\n                        <h4 data-animation=\"animated bounceInUp\"> </h4>             \n                     </div>\n                </div></div>\n             </div> \n            <!-- Item 2 -->\n            <div class=\"item slide2\">\n                <div class=\"row\"><div class=\"container\">\n                    <div class=\"col-md-7 text-left\">\n                        <h3 style=\"color:#333333;\"data-animation=\"animated bounceInDown\"> Our Smart filters and Recommendations help you choose the right media option for you.</h3>\n                        \n                     </div>\n                    <div class=\"col-md-5 text-right\">\n                        <img style=\"max-width: 200px;\"  data-animation=\"animated zoomInLeft\" src=\"http://s20.postimg.org/sp11uneml/rack_server_unlock.png\">\n                    </div>\n                </div></div>\n            </div>\n            <!-- Item 3 -->\n            <div class=\"item slide3\">\n                <div class=\"row\"><div class=\"container\">\n                    <div class=\"col-md-7 text-left\">\n                        <h3 style=\"color:#333333;\" data-animation=\"animated bounceInDown\">Access Global Publishers</h3>\n                        <h4 style=\"color:#333333;\" data-animation=\"animated bounceInUp\">Do not be limited by border boundaries advertise anywhere , any time with MediaBox</h4>\n                     </div>\n                    <div class=\"col-md-5 text-right\">\n                        <img style=\"max-width: 200px;\"  data-animation=\"animated zoomInLeft\" src=\"http://s20.postimg.org/eq8xvxeq5/globe_network.png\">\n                    </div>     \n                </div></div>\n            </div>\n            <!-- Item 4 -->\n            <div class=\"item slide4\">\n                <div class=\"row\"><div class=\"container\">\n                    <div class=\"col-md-7 text-left\">\n                        <h3 style=\"color:#333333;\" data-animation=\"animated bounceInDown\">Plan</h3>\n                        <h4 style=\"color:#333333;\" data-animation=\"animated bounceInUp\">Build </h4>\n                        <h4 style=\"color:#333333;\" data-animation=\"animated bounceInDown\">Launch advertising campaigns anywhere ,anytime with Mediabox</h4>\n                     </div>\n                    <div class=\"col-md-5 text-right\">\n                        <img style=\"max-width: 200px;\"  data-animation=\"animated zoomInLeft\" src=\"http://s20.postimg.org/9vf8xngel/internet_speed.png\">\n                    </div>  \n                </div></div>\n            </div>\n            <!-- End Item 4 -->\n    \n        </div>\n        <!-- End Wrapper for slides-->\n        <a class=\"left carousel-control\" href=\"#carousel-example-generic\" role=\"button\" data-slide=\"prev\">\n            <i class=\"fa fa-angle-left\"></i><span class=\"sr-only\">Previous</span>\n        </a>\n        <a class=\"right carousel-control\" href=\"#carousel-example-generic\" role=\"button\" data-slide=\"next\">\n            <i class=\"fa fa-angle-right\"></i><span class=\"sr-only\">Next</span>\n        </a>\n    </div>\n</div>\n\n<!--emd slider-->\n<div class=\"intro-header\">\n        <div class=\"container\">\n\n            <div class=\"row\">\n                <div class=\"col-lg-12\">\n                    <div class=\"intro-message\">\n                        <h2 class=\"section-heading\">We provide advertising inventory across Africa</h2>\n                        <h4 class=\"section-heading\">by bringing together Advertisers and Publishers</h4>\n                        <hr class=\"intro-divider\">\n                        <ul class=\"list-inline intro-social-buttons\">\n                            <li>\n                                <a href=\"/\" class=\"btn btn-danger btn-lg\"></i> <span class=\"network-name\">Start Using Mediabox -></span></a>\n                            </li>\n                            \n                        </ul>\n                    </div>\n                </div>\n            </div>\n\n        </div>\n        <!-- /.container -->\n\n    </div>\n    <!-- /.intro-header -->\n\n    <!-- Page Content -->\n\n    <a  name=\"services\"></a>\n    <div class=\"content-section-a\">\n\n        <div class=\"container\">\n            <div class=\"row\">\n                <div class=\"col-lg-12 col-sm-12\">\n                    <hr class=\"section-heading-spacer\">\n                    <div class=\"clearfix\"></div>\n                    <h2 class=\"section-heading\"><center>How Advertisers Benefit :</center></h2>\n                   <div class=\"row lead\">\n                                <div class=\"hidden-xs space-top-15\"></div>\n                                <div class=\"devices-wrap col-sm-6 space-top-30\">\n                                    <ng-md-icon icon=\"swap_horiz\" class=\"material-icons md-48 orange600\"></ng-md-icon>\n                                    <h3 class=\"title-2\">BUY DIRECTLY !</h3>\n                                    <p>Discover and buy advertising space through our platform .Orders and creative are submitted directly to publisher</p>\n                                </div>\n                                <div class=\"devices-wrap col-sm-6 space-top-30\">\n                                    <ng-md-icon icon=\"language\" class=\"material-icons md-48 orange600\" style=\"font-size: 48px\"></ng-md-icon>\n                                      <h3 class=\"title-2\">ACCESS GLOBAL PUBLISHERS!</h3>\n                                       <p> Do not be limited by border boundaries  advertise  anywhere , any time with MediaBox </p>\n                                 </div>\n                                <div class=\"devices-wrap col-sm-6 space-top-30\">\n                                       <ng-md-icon icon=\"alarm\" class=\"material-icons md-48 orange600\"></ng-md-icon>\n                                    <h3 class=\"title-2\">SAVE TIME!</h3>\n                              <p>Plan ,negotiate and buy advertising space  at the comfort of your home or workplace ,No Back and Fourth</p>\n                                </div>\n                                <div class=\"devices-wrap col-sm-6 space-top-30\">\n                                      <ng-md-icon icon=\"thump_up\" class=\"material-icons md-48 orange600\"></ng-md-icon>\n                                     <h3 class=\"title-2\">RECOMMENDATIONS </h3>\n                <p>Help you to plan by giving you appropriate publishers that match your campaign objectives or budget</p>\n                                </div>\n                            </div>\n                </div>\n               \n            </div>\n\n        </div>\n        <!-- /.container -->\n\n    </div>\n    <!-- /.content-section-a -->\n\n    <div class=\"content-section-b\">\n\n        <div class=\"container\">\n\n            <div class=\"row\">\n                <div >\n                    <hr class=\"section-heading-spacer\">\n                    <div class=\"clearfix\"></div>\n                    <h2 class=\"section-heading\"><center>How Publishers benefit</center></h2>\n                     <div class=\"row lead \">\n                                <div class=\"hidden-xs space-top-15\"></div>\n                                <div class=\"devices-wrap col-sm-6 space-top-30\">\n                                <ng-md-icon icon=\"monetization_on\" class=\"material-icons md-48 orange600\"></ng-md-icon>\n                                  \n                                         <h3 class=\"title-2\">INCREASE REVENUE !</h3>\n                                         <p>Access competition from around the globe</p>\n                                </div>\n                                <div class=\"devices-wrap col-sm-6 space-top-30\">\n        \n                                    <ng-md-icon icon=\"language\" class=\"material-icons md-48 orange600\"></ng-md-icon>\n                                    <h3 class=\"title-2\">ACCESS GLOBAL DEMAND!</h3>\n                                    <p>Do not be limited by border boundaries  advertise  anywhere any time with MediaBox </p>\n                                 </div>\n                                <div class=\"devices-wrap col-sm-6 space-top-30\">\n                                      <ng-md-icon icon=\"alarm\" class=\"material-icons md-48 orange600\"></ng-md-icon>\n                                <h3 class=\"title-2\">SAVE TIME!</h3>\n                                <p>Approve proposals and recieve orders directly from  advertisers through the platform\n</p>\n                                </div>\n                                <div class=\"devices-wrap col-sm-6 space-top-30\">\n                                        <ng-md-icon icon=\"trending_up\" class=\"material-icons md-48 orange600\"></ng-md-icon>\n                                        <h3 class=\"title-2\">EASY TRACKING AND REPORTING </h3>\n                                        <p>Analyzing sales and consumer data</p>\n                                </div>\n                            </div>\n                </div>\n             \n            </div>\n\n        </div>\n        <!-- /.container -->\n\n    </div>\n    <!-- /.content-section-b -->\n\n\n    \n    <div class=\"content-section-a\">\n\n               <section class=\"lead\" style=\"margin:20px\">\n                \n                    <div class=\"title-wrap space-bottom-45\">\n                        <h3 class=\"section-heading\">We provide you with the technology that will help you in managing your advertising content </h3><p>This automation translates to significant benefits for both advertisers and publishers in the form of </p>\n                    </div>\n                    <div class=\"row\">\n                        <div class=\"col-sm-4 col-xs-12 text-center feature-list\">\n                            <div class=\"feature-wrap space-bottom-30\">\n                                <i  style=\"font-size: 35px;\" class=\"fa fa-dollar theme-color\"></i>\n                    <h3 class=\"title-2\">REDUCTION IN OPERATION COSTS </h3>\n                    <p>Publishers can free their sales teams to spend more time establishing high value relationships, whilst buyers can access a market of known publishers, known price and known availability, </p>\n                            </div>\n                        </div>\n                        <div class=\"col-sm-4 col-xs-12 text-center feature-list\">\n                            <div class=\"feature-wrap space-bottom-30\">\n                                <i  style=\"font-size: 35px;\"  class=\"fa fa-calculator theme-color\"></i>\n                    <h3 class=\"title-2\">MATERIAL EFFICIENCY GAINS</h3>\n                    <p>Be a master of effiency with the all in one platform for all your advertising content.</p>\n                            </div>\n                        </div>\n                        <div class=\"col-sm-4 col-xs-12 text-center feature-list\">\n                            <div class=\"feature-wrap space-bottom-30\">\n                                 <i   style=\"font-size: 35px;\"  class=\"fa fa-clock-o theme-color\"></i>\n                    <h3 class=\"title-2\">CONVINIENCE!</h3>\n                    <p>The only platform that manages the full advertising cycle, end to end.Media trading at the click of a button.</p>\n                            </div>\n                        </div>                    \n                    </div>\n                    \n                \n            </section>\n     \n        <!-- /.container -->\n\n    </div>\n    <!-- /.content-section-a -->\n\n     </div>\n\n      <!--how it works video-->\n\n         <section id=\"work-video\" class=\"white-bg\">\n                 <div class=\"top-content\">\n            <div class=\"container\">\n            \n                <div class=\"row\">\n                    <div class=\"col-sm-8 col-sm-offset-2 text\">\n                        <h1><center>Mediabox How It Works</center></h1>\n                        <p>\n                            Find out how  Mediabox can help you discover where to put your ad \n                        </p>\n                    </div>\n                </div>\n                <div class=\"row\">\n                    <div class=\"col-sm-9 col-sm-offset-4 video-link medium-paragraph\">\n                        <a href=\"#\" class=\"launch-modal\" data-modal-id=\"modal-video\">\n                            <span class=\"video-link-icon\"><i class=\"fa fa-play\"></i></span>\n                            <span class=\"video-link-text\">Launch  video</span>\n                        </a>\n                    </div>\n                </div>\n                <div class=\"row\">\n                    <div class=\"col-sm-12 social\">\n                        <a href=\"http://www.facebook.com/mediaboxzw\"><i class=\"fa fa-facebook\"></i></a> <span class=\"divider-2\"></span>\n                        <a href=\"http://twitter.com/mediaboxzw\"><i class=\"fa fa-twitter\"></i></a> <span class=\"divider-2\"></span>\n                        <a href=\"https://plus.google.com/mediaboxzw\"><i class=\"fa fa-google-plus\"></i></a>\n                    </div>\n                </div>\n                \n            </div>\n        </div>\n            </section>\n    <!-- /.banner -->\n\n    <!-- Popup: Video Player -->\n           <!-- MODAL: How it works -->\n        <div class=\"modal fade\" id=\"modal-video\" tabindex=\"-1\" role=\"dialog\" aria-labelledby=\"modal-video-label\">\n            <div class=\"modal-dialog\" role=\"document\">\n                <div class=\"modal-content\">\n                  \n                    <div class=\"modal-body\">\n                        <div class=\"modal-video\">\n                            <div class=\"embed-responsive embed-responsive-16by9\">\n                                <iframe class=\"embed-responsive-item\" src=\"https://player.vimeo.com/video/196655771?title=0&amp;byline=0&amp;portrait=0&amp;badge=0&amp;color=e89a3e\" \n                                            webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n        \n\n<script type=\"text/javascript\">\n    \n\njQuery(document).ready(function() {\n    \n    /*\n        Background slideshow\n    */\n    $(\'.top-content\').backstretch(\"../../assets/images/1-e9b0d78203.jpg\");\n    \n    /*\n        Modals\n    */\n    $(\'.launch-modal\').on(\'click\', function(e){\n        e.preventDefault();\n        $( \'#\' + $(this).data(\'modal-id\') ).modal();\n    });\n    \n});\n\n\n(function( $ ) {\n\n    //Function to animate slider captions \n    function doAnimations( elems ) {\n        //Cache the animationend event in a variable\n        var animEndEv = \'webkitAnimationEnd animationend\';\n        \n        elems.each(function () {\n            var $this = $(this),\n                $animationType = $this.data(\'animation\');\n            $this.addClass($animationType).one(animEndEv, function () {\n                $this.removeClass($animationType);\n            });\n        });\n    }\n    \n    //Variables on page load \n    var $myCarousel = $(\'#carousel-example-generic\'),\n        $firstAnimatingElems = $myCarousel.find(\'.item:first\').find(\"[data-animation ^= \'animated\']\");\n        \n    //Initialize carousel \n    $myCarousel.carousel();\n    \n    //Animate captions in first slide on page load \n    doAnimations($firstAnimatingElems);\n    \n    //Pause carousel  \n    $myCarousel.carousel(\'pause\');\n    \n    \n    //Other slides to be animated on carousel slide event \n    $myCarousel.on(\'slide.bs.carousel\', function (e) {\n        var $animatingElems = $(e.relatedTarget).find(\"[data-animation ^= \'animated\']\");\n        doAnimations($animatingElems);\n    });  \n    $(\'#carousel-example-generic\').carousel({\n        interval:3000,\n        pause: \"false\"\n    });\n    \n})(jQuery); \n\n\n</script>\n\n\n    ");
$templateCache.put("app/documentation/install.html","<navbar leftmenu=\"true\"></navbar>\n<left-menu></left-menu>\n<div class=\"col-md-12\">\n    <ul class=\"breadcrumb\">\n        <li><a href=\"/\">Home</a>\n        </li>\n        <li>Legal</li>\n        <li>Terms</li>\n    </ul>\n</div>\n<div class=\"row\">\n<div class=\"col-md-2\">\n\n</div>\n\n<div class=\"col-md-8\">\n\n\n    <div class=\"box\" id=\"contact\">\n        <h1>Terms and Conditions</h1>\n        Effective Date: August 1, 2016</br>\nIn order to maintain a safe and trusted marketplace www.mediabox.co.zw and all related and affiliated websites (the “Site”) and to avoid use of the Site for unauthorized or unintended purposes, we require you and all other users of the Site (each, a “User”) to agree to and comply with these Terms of Use (the “Terms”). These Terms set forth the acceptable and prohibited uses of our Site .By accessing the Site or using any of the Site Services after the effective date, you agree to these Terms. You are also independently responsible for complying with all applicable laws related to your use of the Site or the Site Services whether or not covered by the Terms.</br>\n1. PROHIBITED SITE USE</br>\nThe uses described in these Terms are prohibited regardless of where on the Site they occur. For example, the activities are prohibited in campaign creation, proposals, in app messages, communications with customer service or disputes, the community forum, and Advertiser or Publisher feedback.</br>\n1.1 ILLEGAL, FRAUDULENT, HARMFUL, OR OFFENSIVE USES</br>\nYou may not use, or encourage, promote, facilitate, or instructor induce others to use, the Site or Services for any activities that violate any law, statute, ordinance or regulation; for any other illegal, fraudulent, harmful, or offensive purpose; or to transmit, store, trade ,display, distribute or otherwise make available content or material that is illegal, harmful, or offensive.\nExamples of prohibited uses of the Site or Site Services include:</br>\n• Seeking, offering, trading ,or approving illegal, obscene, or pornographic material (i) that would violate the intellectual property rights, including copyrights, of another person, entity, service, product, or website or \n(ii) that would involve the creation , review,  editing  and trading of pornographic, erotic, obscene, or sexually explicit material;</br>\n• Posting content/material that is offensive, defamatory, profane, vulgar, obscene, threatening, discriminatory, illegal, pornographic, obscene or sexually explicit in nature;</br>\n• Seeking, offering, or approving any material that would violate MediaBox’s Terms of Service or the terms of service of another website or any other contractual obligations;\n• Seeking, offering, or  approving any material that violate the academic policies of any educational institution;</br>\n• Fraudulently billing or attempting to fraudulently bill any advertiser, including by (i) falsifying or manipulating or attempting to falsify or manipulate the reach /statistics (ii) reporting, or otherwise billing advertisers for campaigns that was not actually worked</br>\n• Expressing a preference in a media or proposal or otherwise unlawfully discriminating on the basis of race, religion, color, national origin, ancestry, physical or mental disability, medical condition, genetic information, marital status, sex, gender, gender identity, gender expression, age, sexual orientation, military/veteran status or any basis protected by applicable law;</br>\n• Posting or exchanging material that is harassing towards another person or violates the rights of a third party;</br>\n• Posting identifying information concerning another person;</br>\n• Making or demanding bribes;</br>\n• Making or demanding payments without the intention of providing or receiving services in exchange for the payment; and</br>\n• Spamming other Users.</br>\n\n1.2 ILLEGAL, FRAUDULENT, HARMFUL, OR OFFENSIVE USES</br>\nMediaBox makes the Site and Services available for advertisers and publishers to find one another, enter into service relationships, make and receive payments, receive and perform Media Trading Services. Users are expected to use the Site and Services for their intended purposes and Users may not use the Site and Services in contravention of their intended purposes. The following are examples of prohibited use of the Site:\n• Posting the same product/site  multiple times so that more than one version remains active at a given time ;</br>\n• Duplicating or sharing accounts;</br>\n• Selling, trading, or giving an account to another person without  MediaBox’s consent;</br>\n• Soliciting or processing payment outside of MediaBox in violation of the Terms of Service;</br>\n• Listing products or services that are outside or beyond the scope of the MediaBox marketplace; </br>\n1.3 USING THE SITE TO POST FALSE OR MISLEADING CONTENT</br>\nAll profiles, proposals, and other content/material posted to the Site must be truthful and not misleading. Here are examples of uses that are prohibited:</br>\n• Misrepresenting a Publishers reach or statistics , or information;</br>\n• Allowing another person to use your account, which is misleading to other Users;</br>\n• Falsely stating or implying a relationship with MediaBox or with another company with whom you do not have a relationship;</br>\n• Falsely stating or implying a relationship with another User, including a user  continuing to use a MediaBox’s profile or information after the user no longer works with the Agency/Advertiser/Publisher; </br>\n2. ENFORCEMENT</br>\nWe reserve the right, but do not assume the obligation, to investigate any violation of these Terms. We may investigate violations and may remove, disable access to, or modify any content that violates these Terms.\nWe may report any activity that we suspect violates any law or regulation to appropriate law enforcement officials, regulators, or other appropriate third parties. Our reporting may include disclosing appropriate User information. We also may cooperate with appropriate law enforcement agencies, regulators, or other appropriate third parties to help with the investigation and prosecution of illegal conduct by providing network and systems information related to alleged violations of these Terms.</br>\n3. REPORTING AND CORRECTING VIOLATIONS</br>\nIf you become aware of any violation of these Terms, you must immediately report it to Customer Service. You agree to assist us with any investigation we undertake and to take any remedial steps we require in order to correct a violation of these Terms.</br>\n\n\n\n\n\n\n    </div>\n\n\n</div>\n\n<!-- /.col-md-8 -->\n<div class=\"col-md-2\">\n\n</div>\n</div>\n<footer></footer>\n");
$templateCache.put("app/documentation/use.html","<doc-menu></doc-menu>\n\n<div flex layout-padding layout=\"row\">\n<section class=\"doc\" flex>\n\n<h2>Home</h2>\n<hr>\nThis is the main page of our AngularJS e-commerce store.\nHere we get \n<ul>\n  <li>- List of all products</li>\n  <li>- Filter Products: based on `Price (Price Slider), Brand, Features (Color, Type, Fit, Fabric, Neck)`</li>\n  <li>- Sort: Based on Price and Name</li>\n</ul> \n\n\n\nEach product contains a add to cart button.\nOnce the product is added into the cart, we get the increase or decrease cart quantity option\n\nBy clicking each product we arrive at the product detail page\n\n<h2>Product Details</h2>\nThis page presents the complete details of the product\n<ol>\n  <li>Product name</li>\n  <li>Description</li>\n  <li>Price, MRP</li>\n  <li>Product Image (Including additional images)</li>\n  <li>Brand</li>\n  <li>Category</li>\n  <li>Quantity in cart</li>\n  <li>Size</li>\n  <li>Features</li>\n</ol>\n\n<h2>Search</h2>\n<hr>\n\nThe top navigation bar of the website has a search box which autocompletes with product info while user starts typing. By clicking a suggested item in the search bar, the page navigates to the product details page of the selected product.\n\n<h2>Category</h2>\n<hr>\n\nGet the current category name with all products under it<br/>\nThis page also has all the filter and sort options.\n\n    <h2 id=\"shopping-cart\">Shopping Cart</h2>\n    <p>This store is featured with a shopping cart facility which is easy to use and fast.\n    <ul>\n      <li>Get quick summary of what is there in Cart</li>\n      <li>Modify the cart quantity</li>\n      <li>Checkout using Paypal</li>\n    </ul>\n    </p>\n    <!--<div class=\"image\"><a><img src=\"/assets/images/cart.png\" class=\"img-responsive\" alt=\"Shopping Cart\"></a></div>-->\n    <hr>\n\n<h2>Login / Signup</h2>\n<hr>\n <p>Features like Signup / SignIn / Change Password / Logout is integrated into this application already with high level of security, so that you no longer need to be worry about implementing all those features into the application</p>\n\nA user need <b>not</b> have to navigate to a separate page to login or signup. It comes as a popup which is a huge ui improvement.\n\nThis login popup has a advantage of poping out for any route when a guest user tries to access a restricted page\n\nBoth the login and signup page has the option for connect using facebook, twitter, google as well\n\n<h2>Checkout</h2>\n<hr>\n<ul>\n  <li>The checkout page Displays the Order Amount + Shipping Charge</li>\n  <li>This also has an option discount coupons which is applied if valid.</li>\n  <li>Here the user can choose the Payment options (Cash On Delivery, Paypal)</li>\n  <li>This page automatically choose the best available Shipping Options based on the total order weight and the shipper availability.</li>\n  <li>While checkout the user can choose from any saved address.</li>\n</ul> \n\n\n\n\n\n<h2>Address Management</h2>\n<hr>\nThe address management is integrated into the checkout page to make the checkout experience single view and easy.\nHere the user can store and manage different addresses.\n\n<h2>Order Management</h2>\n<hr>\nThe user has the facility to view the order history.\nAdministrators can change order status + payment status\n<p><em>Users:</em> All the orders placed by the logged in user is available in this view. </p>\n      <p><em>Administrators:</em>  This view presents all orders placed by users with the option to change order status and shipping</p>\n    <!--<div class=\"image\"><a><img src=\"/assets/images/order.png\" class=\"img-responsive\" alt=\"Orders History\"></a></div>-->\n    <hr>\n\n<h2>User Management</h2>\n<hr>\n<em>Users: </em><br/>\nChange Password<br/>\nForgot Password<br/>\n<em>Administrators: </em>User role management \n\n<h2>Media Library</h2>\n<hr>\n<ul>\n  <li>Now the shop has a new media library where the shop managers can upload any image that is to be used in the shopping application</li>\n  <li>Clicking on each image displays the details about it as well as an option to delete it</li>\n</ul> \n\n\n<h2>Products (Role: Managers, Administrators)</h2>\n<hr>\nProduct details can be added, modified and deleted using this page. \nEach product can be associated into a single Brand, Category \nA product can have\n<ul>\n  <li>+ Multiple features</li>\n  <li>+ Multiple key features</li>\n  <li>+ Multiple product images</li>\n</ul>\n<ul>\n  <li>The list contains all the available products with a search box to filter the list.</li>\n  <li>Clicking on a product at the product list will populate the details of the product at the right sidebar</li>\n  <li>The right sidebar has option to change product name, details, brand, category</li>\n  <li>This sidebar also contains a module to manage product images</li>\n</ul>\n\n<h2>Manage Brands</h2>\n<p>Administrators can add, edit, delete, filter brands of their store from this view</p>\n\n<h2>Manage Categories</h2>\n<ul>\n  <li>Categories are presented in Parent-Child manner in this store for better organisation of products.</li>\n  <li>Store\'s navigation bar at top contains all the categories arranged in parent-child fashion.</li>\n  <li>This view provides facility to add both parent and child categories, re-arrange category association according to their requirement.</li>\n</ul>\n    <!--<div class=\"image\"><a><img src=\"/assets/images/store.png\" class=\"img-responsive\" alt=\"Store Front\"></a></div>-->\n    <hr>\n    </div>\n</section>\n</div>");
$templateCache.put("app/feature/feature.html","<crud-table api=\'feature\' options=\'options\'></crud-table>\n");
$templateCache.put("app/keyfeature/keyfeature.html","<crud-table api=\'keyfeature\' options=\'options\'></crud-table>\n");
$templateCache.put("app/main/campaign.html","<navbar leftmenu=\"true\"></navbar>\r\n<left-menu></left-menu>\r\n\r\n<md-content class=\"content md-padding\" layout=\"column\" layout-align=\"start center\">\r\n      <section ng-if=\"campaign.campaigns.length >0\" class=\"header\" layout=\"column\" layout-align=\"center center\">\r\n        <h1>Your Campaigns</h1>\r\n        <md-input-container flex>\r\n          <label>Search Campaigns</label>\r\n          <input name=\"search\" type=\"text\" ng-model=\"campaign.search\" md-autofocus/>\r\n        </md-input-container>\r\n      </section>\r\n\r\n      <!--When No Campaigns-->\r\n      <section ng-if=\"campaign.Campaigns.length===0\" class=\"header\" layout=\"column\" layout-align=\"center stretch\">\r\n        <h1>You have not run anything yet .Start using Mediabox to launch advertising campaigns anywhere .No back and forth</h1>\r\n        <md-button ui-sref=\"/\" class=\"md-primary md-raised\">\r\n        <ng-md-icon icon=\"shopping_cart\"></ng-md-icon>Start Now\r\n\r\n        </md-buton>\r\n      </section>\r\n\r\n  <section layout=\"column\" class=\"campaigns\">\r\n  <md-card ng-repeat=\"o in campaign.campaigns | orderBy : \'campaignDate\' : \'reverse\' | filter:order.search\">\r\n      <md-card-header>\r\n          <md-card-header-text>\r\n            <span class=\"\">Campaign PLACED</span>\r\n            <span class=\"md-subhead\">{{o.created_at | amCalendar}}</span>\r\n          </md-card-header-text>\r\n          <md-card-header-text>\r\n            <span class=\"\">TOTAL</span>\r\n            <span class=\"md-subhead\">{{o.amount.total | localPrice}}</span>\r\n          </md-card-header-text>\r\n          <md-card-header-text hide show-gt-sm>\r\n            <span class=\"\">SHIP TO</span>\r\n            <span class=\"md-subhead\">{{o.address.recipient_name}}</span>\r\n          </md-card-header-text>\r\n          <md-card-header-text>\r\n            <span class=\"\">Campaign # </span>\r\n            <span class=\"md-subhead\">{{o.campaignNo}}</span>\r\n          </md-card-header-text>\r\n      </md-card-header>\r\n      <md-card-content layout=\"column\" layout-gt-sm=\"row\" layout-align=\"space-between\">\r\n          <md-list flex=40>\r\n            <div layout=\"row\" ng-repeat=\"i in o.items\">\r\n              <md-card-avatar>\r\n                  <img ng-src=\"{{i.url}}\" err-SRC=\"/assets/images/150x150-02a04eb9d5.png\" alt=\"{{i.name}}\" width=\"100px\" hide show-gt-xs>\r\n              </md-card-avatar>\r\n              <div class=\"content\">\r\n              <a >{{i.name}}</a><br/><br/>\r\n              <b>Amount:&nbsp;&nbsp;</b> {{i.price | currency}} * {{i.quantity}}&nbsp;=&nbsp;{{i.price * i.quantity | currency}}\r\n              \r\n              <br/>\r\n                <cart-buttons variant=\"i\" product=\"o\">\r\n              </div>\r\n            </div>\r\n          </md-list>\r\n            <md-list class=\"campaign-address\" flex=30>\r\n                  <ng-md-icon icon=\"local_shipping\"></ng-md-icon>&nbsp;Status\r\n                  <hr>\r\n                \r\n                  <p class=\"md-subhead\">Campaign Status: &nbsp;{{o.status}}</p>\r\n                  \r\n           </md-list>\r\n      </md-card-content>\r\n  </md-card>\r\n  </section>\r\n</md-content>\r\n<footer></footer>\r\n");
$templateCache.put("app/main/filter-menu.html","<md-sidenav ng-cloak md-is-locked-open=\"$mdMedia(\'gt-md\')\" md-component-id=\"filtermenu\" class=\"filter-menu\">\n    <md-content>\n        <form>\n\n        <div layout-align=\"space-between top\" class=\"md-whiteframe-z1\" layout-padding>\n            <md-card >\n                <h4>Price Range</h4>\n            <md-content>\n                <rzslider \n                rz-slider-model=\"main.priceSlider.min\"\n                rz-slider-high=\"main.priceSlider.max\" \n                rz-slider-options=\"main.priceSlider.options\"\n                ></rzslider>\n\n            </md-content>\n            </md-card>\n            \n            <md-card style=\"height: 500px;\" ng-if=\"main.brands\">\n                <md-input-container>\n                    <input ng-model=\"filterBrands\" placeholder=\"Categories\"/>\n                </md-input-container>\n                <md-content style=\"height: 500px\">\n                <div   ng-repeat=\"item in main.brands | filter:filterBrands\">\n                <md-checkbox\n                    ng-checked=\"main.exists(item, main.fl.brands)\"\n                    ng-click=\"main.toggle(item, main.fl.brands)\">\n                    {{ item.name }}\n                </md-checkbox>\n                </div>\n                </md-content>\n            </md-card>\n                <md-card ng-repeat=\"k in main.features | filter:filterFeatures\">\n                    <md-input-container>\n                        <input ng-model=\"filterFeatures\" placeholder=\"{{k.key}}\"/>\n                    </md-input-container>\n            <md-content>\n                <input ng-init=\"main.fl.features[k.key] = []\" type=\"hidden\"/>\n                <div flex=\"50\" ng-repeat=\"f in k.v | filter:filterFeatures\">\n                    <md-checkbox\n                    ng-checked=\"main.exists(f, main.fl.features[k.key])\"\n                    ng-click=\"main.toggle(f, main.fl.features[k.key])\">\n                        {{ f }}\n                    </md-checkbox>\n                </div>\n            </md-content>\n            </md-card>\n        </div>\n        </form>\n    </md-content>\n  \n    \n    \n</md-sidenav>\n");
$templateCache.put("app/main/main.html","<navbar leftmenu=\"true\"></navbar>\n<div class=\"container\">\n<div layout=\"row\">\n  <div ng-include=\"\'app/main/filter-menu.html\'\"></div>\n  <!--<md-content flex layout=\"column\">-->\n  <section layout=\"column\" layout-fill flex>\n    <div class=\"sort-products md-whiteframe-z2\">\n        <div class=\"products-list-meta\" ng-if=\"main.$mdMedia(\'gt-md\')\" flex>\n            Showing {{main.products.items.length}} products of {{main.products.count}} in: {{vm.Settings.currency.symbol}}<strong>{{main.priceSlider.min}}</strong> &nbsp;-&nbsp; {{vm.Settings.currency.symbol}}<strong>{{main.priceSlider.max}}</strong>\n        </div>\n\n        <section layout=\"row\" layout-align=\"center center\">\n          <div>Sort: &nbsp;</div> \n          <md-button class=\"groupX left\" ng-click=\"main.sortNow(\'variants.price\')\">{{main.Settings.currency.symbol}}<ng-md-icon icon=\"arrow_downward\" style=\"fill:#888\"></ng-md-icon></md-button>\n          <md-button class=\"groupX middle\" ng-click=\"main.sortNow(\'-variants.price\')\">{{main.Settings.currency.symbol}}<ng-md-icon icon=\"arrow_upwards\" style=\"fill:#888\"></ng-md-icon></md-button>\n          <md-button class=\"groupX middle\" ng-click=\"main.sortNow(\'name\')\">A-Z<ng-md-icon icon=\"arrow_downward\" style=\"fill:#888\"></ng-md-icon></md-button>\n          <md-button class=\"groupX right\" ng-click=\"main.sortNow(\'-name\')\">Z-A<ng-md-icon icon=\"arrow_upwards\" style=\"fill:#888\"></ng-md-icon></md-button>\n        </section>\n\n\n    </div>\n\n    <div layout=\"row\">\n      <div ng-repeat=\"b in main.fl.brands\">\n        <md-button class=\"md-raised\" ng-click=\"main.removeBrand(b);\" aria-label=\"Remove Brand Filter\">\n          <ng-md-icon icon=\"verified_user\" md-menu-align-target></ng-md-icon>\n          {{b.name}}\n          <ng-md-icon icon=\"close\" aria-label=\"Close dialog\"></ng-md-icon>\n        </md-button>\n      </div>\n      <md-button ng-show=\"main.fl.categories.length > 0\" class=\"md-raised\">\n        <ng-md-icon icon=\"subject\" md-menu-align-target></ng-md-icon>\n        {{main.fl.categories[0].name}}\n      </md-button>\n    <div ng-repeat=\"(k,features) in main.fl.features\">\n      <md-button ng-show=\"features\" ng-repeat=\"f in features\" class=\"md-raised\" ng-click=\"main.removeFeatures(features,k,f);\" aria-label=\"Remove {{f}} Filter\">\n          <ng-md-icon icon=\"format_shapes\" md-menu-align-target></ng-md-icon>\n          {{f}}\n          <ng-md-icon icon=\"close\" aria-label=\"Close dialog\"></ng-md-icon>\n      </md-button>\n    </div>\n    </div>\n\n      <div style=\"margin-top: 10px\" infinite-scroll=\'main.scroll()\' infinite-scroll-disabled=\'main.products.busy\' infinite-scroll-distance=\'1\' layout-align=\"center center\">\n          <div dw-loading=\"products\" dw-loading-options=\"{text: \'\'}\"></div>\n          <div layout=\"row\" layout-wrap layout-align=\"start start\">\n            <div class=\"col-md-4 col-sm-6\" ng-repeat=\"product in main.products.items\" layout=\"column\" layout-align=\"space-between center\" >\n              <div class=\"product\" style=\"height: 400px\" >\n                   <div class=\"img-logo\"  style=\"margin: 15px\">\n                      <center>\n                  \n                            <img ng-click=\"main.gotoDetail(product)\"   width=\"150px\" height=\"130px\" data-ng-src=\"data:image/png;base64,{{product.logo[0].base64}}\" data-err-src=\"images/png/avatar.png\"/>\n                      \n\n                      </center>\n                   </div>\n                              \n                  <div class=\"text text-center\" style=\"margin-top: 10px;height: 250px\">\n                        <a  href=\"\" ng-click=\"main.gotoDetail(product)\"><h5>{{product.name}}</h5></a><br><a ng-href=\"http://{{product.website}}\"> {{product.website}}</a>\n                              <div style=\"margin: 7px\">\n                                <ol class=\"rounded-list\">\n                                     <li ng-repeat=\"f in product.stats\"><a href=\"#\">{{f.key}} : {{f.val}}</a></li>                    \n                                </ol>\n                              </div>\n                  </div>\n                  <div style=\"text-align:bottom;vertical-align: bottom;text-align: center;margin-bottom: 0px\">\n                     <span><small>Category:<a href=\"/Category/{{product.category.slug}}/{{product.category._id}}\">{{product.category.name}}</a></small>\n                      \n                     </span> \n\n                  </div>\n                                      <!-- /.text -->\n              </div>\n                            <!-- /.product -->\n              \n            </div>\n          </div>\n        </div>\n    </section>\n<!--</md-content>-->\n</div>\n</div>\n<footer></footer>\n");
$templateCache.put("app/main/review-form.html","<div layout=\"row\">\n<md-content flex layout=\"column\">\n<section layout=\"column\" flex layout-align=\"center center\">\n  <h1>Rating & Review</h1>\n  <form name=\"form\" ng-submit=\"save(review)\" novalidate>\n  <section class=\"section\" layout=\"column\">\n    <rating rating=\"review.rating\"></rating><br/>\n    <md-input-container md-is-error=\"(form.message.$error.required || form.message.$error.message) && form.message.$dirty\">\n      <label>Message</label>\n      <textarea name=\"review\" ng-model=\"review.message\" md-autofocus></textarea>\n      <div ng-messages=\"form.message.$error\" ng-if=\"form.message.$dirty\">\n        <div ng-message=\"required\">Message required</div>\n      </div>\n    </md-input-container>\n  </section>\n  <div class=\"md-dialog-actions\" layout=\"column\" layout-align=\"center center\">\n    <div class=\"error\" layout-align=\"center center\">{{message}}</div>\n    <div layout=\"row\">\n      <md-button type=\"submit\" class=\"md-raised circular-progress-button md-primary\" ng-disabled=\"!form.$valid || vm.loading\" aria-label=\"Save Review\">\n        <span ng-show=\"!vm.loading\"><ng-md-icon icon=\"save\"></ng-md-icon>Save</span>\n        <md-progress-circular md-mode=\"indeterminate\" md-diameter=\"25\" ng-show=\"vm.loading\" class=\"md-accent md-hue-1\"></md-progress-circular><span ng-show=\"vm.loading\">Loading...</span>\n      </md-button>\n      <md-button class=\"btn btn-default btn-lg btn-register\" ng-click=\"cancel()\" aria-label=\"Cancel Review\"> Cancel </md-button>\n    </div>\n  </div>\n  </form>\n</section>\n</md-content>\n</div>");
$templateCache.put("app/main/single-product.html","<navbar leftmenu=\"true\"></navbar>\n<div class=\"container\">\n<div layout=\"row\" class=\"wrapper\">\n  <div ng-include=\"\'components/navbar/cart.html\'\"></div>\n  <md-content flex layout=\"column\">\n  <section layout=\"column\" layout-fill flex>\n    <div class=\"sort-products md-whiteframe-z2\" style=\"margin-left: 10px;margin-right: 10px\">\n        <div>\n            Home > <a ui-sref=\"/\">Publishers</a> > {{single.product.name}}\n        </div>\n    </div>\n    \n    <div class=\"container\">\n    <div class=\"row\">\n      \n\n      <div class=\"col-md-12\" style=\"margin-top: 10px\">\n          <div class=\"row\" id=\"productMain\">\n              <div class=\"col-sm-3\">\n                  <div id=\"mainImage\" style=\"height: 60%\" class=\"md-whiteframe-z1\">\n                      <img  data-ng-src=\"data:image/png;base64,{{single.product.logo[0].base64}}\" err-SRC=\"/assets/images/486x325-fed2667202.png\" alt=\"{{single.product.name}}\" class=\"img-responsive\">\n                  </div>\n\n                  <md-divider md-inset></md-divider>\n\n                  <md-button ng-click=\"single.reviewForm()\" class=\"md-raised md-primary\">Review this publisher</md-button>\n                  <md-card ng-repeat=\"review in single.reviews | orderBy: \'-created\'|limitTo:\'1\'\">\n                  <md-card-header>\n                      <md-card-avatar>\n                          <list-image string=\"{{review.message || review.rating}}\"></list-image>\n                      </md-card-avatar>\n                      <md-card-header-text>\n                          <span class=\"md-subhead\" ng-if=\"review.rating\">\n                              <div class=\"rating-button\">{{review.rating}} <ng-md-icon icon=\"star\" size=\"20\"></ng-md-icon></div>\n                          </span>\n                          <span class=\"md-title\" style=\"white-space: pre;margin-left: 10px;\"><p>{{review.message}}</p></span>\n                      </md-card-header-text>\n                  </md-card-header>\n                  <!--<md-card-content>Good product within 7000</md-card-content>-->\n                  <md-card-actions layout=\"row\" layout-align=\"space-between center\">\n                      <span layout=\"row\" layout-align=\"start center\">\n                          <ng-md-icon icon=\"person\" size=\"15\"></ng-md-icon>&nbsp;{{review.reviewer}}&nbsp;\n                          <ng-md-icon icon=\"access_time\" size=\"15\"></ng-md-icon>&nbsp;{{review.created | amCalendar}}\n                      </span>\n                          <md-button ng-if=\"single.myReview(review)\" class=\"md-icon-button\" ng-click=\"single.deleteReview(review)\" aria-label=\"Delete Review\">\n                              <ng-md-icon icon=\"delete\" style=\"fill: #aaa\"></ng-md-icon>&nbsp;\n                          </md-button>\n                  </md-card-actions>\n              </md-card>\n\n                  \n\n              </div>\n              <div class=\"col-sm-9\" >\n                  <div class=\"box\" style=\"margin-right: 20px\">\n                      <h3 class=\"text-center\">{{single.product.name}} </h3>\n                     \n                    <div ng-if=\"single.product.info\">\n                     <h4>Details</h4>\n                     <blockquote>\n                    <p>{{single.product.info }}</p>\n                  </blockquote> \n                   \n                  <div ng-if=\"single.product.stats.length>0\">\n                 \n\n                  <div class=\"row\">\n                    <div class=\"col-xs-6 col-md-2\" ng-repeat=\"f in single.product.stats\">\n                      <div  class=\"mythumbnail\">\n                     <p><h6><center>{{f.key}}</h6></center>  <div><center><h4>{{f.val}}</h4></center></div></p>\n                    </div>\n                  </div>\n                  </div>\n                 \n                  </div>\n\n                  <div class=\"row\">\n                 <md-list layout-gt-xs=\"row\" layout=\"column\">\n                          <md-list-item class=\"md-2-line\" ng-if=\"single.product.brand\">\n                          <ng-md-icon icon=\"verified_user\" md-menu-align-target></ng-md-icon>\n                          <div class=\"md-list-item-text\">\n                          <h3> Category </h3>\n                          <p> {{single.product.brand.name}} </p>\n                          </div>\n                      </md-list-item>\n\n                      <md-list-item class=\"md-2-line\" ng-if=\"single.product.category\">\n                          <ng-md-icon icon=\"subject\" md-menu-align-target></ng-md-icon>\n                          <div class=\"md-list-item-text\">\n                          <h3> Platform </h3>\n                          <p> {{single.product.category.name}} </p>\n                          </div>\n                      </md-list-item>\n                      <md-list-item class=\"md-2-line\" ng-if=\"single.product.category\">\n                         \n                          <div class=\"md-list-item-text\">\n                          <h3>Contact Details</h3>\n                              <p style=\"margin: 10px\"><span > <ng-md-icon icon=\"email\" md-menu-align-target></ng-md-icon>{{single.product.email}}<br></span></p>\n                               <p style=\"margin: 10px\"><span > <ng-md-icon icon=\"perm_phone_msg\" md-menu-align-target></ng-md-icon></span>{{single.product.phone}}</p>\n                          </div>\n                      </md-list-item>\n\n                  </md-list>\n                   </div>\n                  </div>\n\n                   <div class=\"row\">\n                    <div class=\"col-xs-6 col-md-3\" ng-repeat=\"f in single.product.keyFeatures\">\n                      <div >\n                     <p><h6><center>{{f.key}}</h6></center>  <div><center><h6 style= \"color:red\">{{f.val}}</h6></center></div></p>\n                    </div>\n                  </div>\n                  </div>\n\n                      <p class=\"goToDescription\">\n                    <a href=\"#div\" class=\"scroll-to\">Scroll to publisher media options</a>\n                      </p>\n                      \n\n                  </div>\n\n              </div>\n\n          </div>\n\n\n          <div class=\"box\" id=\"div\" style=\"margin-right: 20px\">\n           <div class=\"row\">\n            <div class=\"col-md-5\">\n            <summary ng-if=\"single.name\"><small>{{single.name}} &nbsp; {{single.formart}} &nbsp;{{single.size}}</small></summary>\n            <div  style=\"height: 450px\">\n            <img ng-hide=\"single.image\" src=\"/assets/img/preview.png\" width=\"100%\" >\n            <div  ng-if=\"single.image\" style=\"height: 330px\">\n\n              <div ng-if=\"single.image.progress &amp;&amp; single.image.progress &lt; 1\" class=\"progress\">\n            <div role=\"progressbar\" aria-valuenow=\"{{single.image.progress}}\" aria-valuemin=\"0\" aria-valuemax=\"1\" style=\"width:{{single.image.progress*100}}%\" class=\"progress-bar\"></div>\n          </div>\n          <ng-pintura ngp-src=\"single.image.src\" ngp-scaling=\"single.image.scaling\" ngp-position=\"single.image.position\" ngp-max-scaling=\"single.image.maxScaling\" ngp-scale-step=\"single.image.scaleStep\" ngp-move-step=\"single.image.moveStep\" ngp-mw-scale-step=\"single.image.mwScaleStep\" ngp-fit-inview = \"single.image.fitInview\" ngp-fit-onload=\"single.image.fitOnload\" ngp-progress=\"single.image.progress\">\n            <div id=\"zoomslider\">\n              <input ng-model=\"slider.value\" ng-change=\"sliderChange()\" orient=\"vertical\" type=\"range\" min=\"0\" max=\"100\" step=\"1\" ng-disabled=\"scalingDisabled\">\n            </div>\n            <button id=\"zoomin\" ng-click=\"zoomIn()\" ng-disabled=\"scalingDisabled\" class=\"btn btn-default\"><span class=\"glyphicon glyphicon-plus\"></span></button>\n            <button id=\"zoomout\" ng-click=\"zoomOut()\" ng-disabled=\"scalingDisabled\" class=\"btn btn-default\"><span class=\"glyphicon glyphicon-minus\"></span></button>\n            <button id=\"moveup\" ng-click=\"moveUp()\" class=\"btn btn-default\"><span class=\"glyphicon glyphicon-chevron-up\"></span></button>\n            <button id=\"movedown\" ng-click=\"moveDown()\" class=\"btn btn-default\"><span class=\"glyphicon glyphicon-chevron-down\"></span></button>\n            <button id=\"moveleft\" ng-click=\"moveLeft()\" class=\"btn btn-default\"><span class=\"glyphicon glyphicon-chevron-left\"></span></button>\n            <button id=\"moveright\" ng-click=\"moveRight()\" class=\"btn btn-default\"><span class=\"glyphicon glyphicon-chevron-right\"></span></button>\n            <button id=\"movecenter\" ng-click =\"fitInView()\" class=\"btn btn-default\"><span class=\"glyphicon glyphicon-screenshot\"></span></button>\n          </ng-pintura>\n             </div><br>\n            <p><br/>\n            </p>\n\n            </div>\n            </div>\n            <div class=\"col-md-7\" style=\"height: 420px;overflow:scroll\">\n              <p>\n\n                  <table  class=\"table table-striped\">\n                              <thead>\n                              <tr> \n                                  <th></th>\n                                  <th>Media Options </th>\n                                  <th>Pricing</th>\n                                  <th></th>\n                                  \n                              </tr>\n                              </thead>\n                              <tbody>\n                              <tr data-ng-repeat=\"adspace in single.product.variants\"  ng-click=\"single.preview(adspace)\">\n                                  <td>{{$index+1}}</td>\n                                  <td>{{adspace.name}}<br><span><small>{{adspace.size}} &nbsp;{{adspace.maxSize}}<br/> &nbsp;{{adspace.formart}}</small></span></td>\n                                  <td> {{adspace.price | currency}}<br><small>{{adspace.model}}</small></td>\n                                  <td><small> \n                                  <div layout=\"row\" layout-align=\"start center\">\n                                  <cart-buttons variant=\"adspace\" product=\"single.product\"></cart-buttons>\n                                  \n                              </div>\n                         \n                        </small></td>\n                                  \n                              </tr>\n                              \n                              </tbody>\n                          </table>\n                 </p>\n            </div>\n           </div>\n              \n                  <hr>\n                  \n          </div>\n\n\n          <!--div-->\n          <div >\n          <div class=\"col-md-12\">\n          <div class=\"col-md-4\">\n            <div layout=\"rows\" layout-align=\"center center\" ng-if=\"single.reviews.length==0 \">\n            <br/><md-divider></md-divider><br/>\n            <md-button ng-click=\"single.reviewForm()\" class=\"md-raised md-primary\">Be the first to review this publisher</md-button>\n        </div>\n        <div class=\"reviews\" ng-if=\"single.reviews.length>0 \">\n            <!--<h3>Reviews</h3>-->\n            <div class=\"reviews-header\" layout=\"column\" >\n                <div layout=\"column\" >\n                    <div class=\"total-rating\" layout=\"column\"  layout-align=\"space-between\"> \n                        <p>\n                        <div layout=\"row\" layout-align=\"start start\" class=\"total\"> {{single.rating.avg}}<ng-md-icon icon=\"star\"></ng-md-icon></div>\n                        <div>{{single.rating.count}} Ratings</div>\n                        <div>{{single.reviewCount}} Reviews</div></p>\n                    </div>\n                    <div class=\"rating-signal\">\n                        <div layout=\"row\" layout-align=\"start center\">5&nbsp;<ng-md-icon icon=\"star\" style=\"fill:rgb(33,150,243)\"></ng-md-icon> <md-progress-linear md-mode=\"determinate\" value=\"{{single.rating.r5*100 / single.rating.count}}\"></md-progress-linear>{{single.rating.r5}}</div>\n                        <div layout=\"row\" layout-align=\"start center\">4&nbsp;<ng-md-icon icon=\"star\" style=\"fill:rgb(33,150,243)\"></ng-md-icon> <md-progress-linear md-mode=\"determinate\" value=\"{{single.rating.r4*100 / single.rating.count}}\"></md-progress-linear>{{single.rating.r4}}</div>\n                        <div layout=\"row\" layout-align=\"start center\">3&nbsp;<ng-md-icon icon=\"star\" style=\"fill:rgb(33,150,243)\"></ng-md-icon> <md-progress-linear md-mode=\"determinate\" value=\"{{single.rating.r3*100 / single.rating.count}}\"></md-progress-linear>{{single.rating.r3}}</div>\n                        <div layout=\"row\" layout-align=\"start center\">2&nbsp;<ng-md-icon icon=\"star\" style=\"fill:rgb(255,87,34)\"></ng-md-icon> <md-progress-linear class=\"md-warn\" md-mode=\"determinate\" value=\"{{single.rating.r2*100 / single.rating.count}}\"></md-progress-linear>{{single.rating.r2}}</div>\n                        <div layout=\"row\" layout-align=\"start center\">1&nbsp;<ng-md-icon icon=\"star\" style=\"fill:rgb(255,87,34)\"></ng-md-icon> <md-progress-linear class=\"md-warn\" md-mode=\"determinate\" value=\"{{single.rating.r1*100 / single.rating.count}}\"></md-progress-linear>{{single.rating.r1}}</div>\n                    </div>\n                </div>\n                <div flex layout=\"row\" layout-align=\"center center\">\n                    <md-button ng-click=\"single.reviewForm()\" class=\"md-primary md-raised\">Rate & Review</md-button>\n                </div>\n            </div>\n            \n              <md-card ng-repeat=\"review in single.reviews | orderBy: \'-created\'\">\n                  <md-card-header>\n                      <md-card-avatar>\n                          <list-image string=\"{{review.message || review.rating}}\"></list-image>\n                      </md-card-avatar>\n                      <md-card-header-text>\n                          <span class=\"md-subhead\" ng-if=\"review.rating\">\n                              <div class=\"rating-button\">{{review.rating}} <ng-md-icon icon=\"star\" size=\"15\"></ng-md-icon></div>\n                          </span>\n                          <span class=\"md-title\" style=\"white-space: pre;margin-left: 10px;\">{{review.message}}</span>\n                      </md-card-header-text>\n                  </md-card-header>\n                  <!--<md-card-content>Good product within 7000</md-card-content>-->\n                  <md-card-actions layout=\"row\" layout-align=\"space-between center\">\n                      <span layout=\"row\" layout-align=\"start center\">\n                          <ng-md-icon icon=\"person\" size=\"15\"></ng-md-icon>&nbsp;{{review.reviewer}}&nbsp;\n                          <ng-md-icon icon=\"access_time\" size=\"15\"></ng-md-icon>&nbsp;{{review.created | amCalendar}}\n                      </span>\n                          <md-button ng-if=\"single.myReview(review)\" class=\"md-icon-button\" ng-click=\"single.deleteReview(review)\" aria-label=\"Delete Review\">\n                              <ng-md-icon icon=\"delete\" style=\"fill: #aaa\"></ng-md-icon>&nbsp;\n                          </md-button>\n                  </md-card-actions>\n              </md-card>\n        </div>\n        </div>\n        <div class=\"col-md-8\">\n\n          <div class=\"row\">\n             <h3 class=\"col-md-2\">Learn</h3> <img style=\"width:150px;height:100px\" src=\"assets/img/learn.png\" class=\"responsive-img col-md-4\">\n          </div>\n         \n            <div ng-if=\"single.magazines\">\n              <div ng-include=\"\'components/messages/magazines.html\'\" ></div>\n             \n            </div>\n            <div ng-if=\"single.airline\">\n              <div ng-include=\"\'components/messages/airline.html\'\" ></div>\n             \n            </div>\n            <div ng-if=\"single.emailMarketing\">\n              <div ng-include=\"\'components/messages/email.html\'\" ></div>\n             \n            </div>\n            <div ng-if=\"single.cinema\">\n              <div ng-include=\"\'components/messages/cinema.html\'\" ></div>\n             \n            </div>\n            <div ng-if=\"single.newspapers\">\n              <div ng-include=\"\'components/messages/newspapers.html\'\" ></div>\n             \n            </div>\n            <div ng-if=\"single.radio\">\n              <div ng-include=\"\'components/messages/radio.html\'\" ></div>\n             \n            </div>\n\n            <div ng-if=\"single.television\">\n              <div ng-include=\"\'components/messages/tv.html\'\" ></div>\n             \n            </div>\n\n            <div ng-if=\"single.default\">\n              <div ng-include=\"\'components/messages/nontraditional.html\'\" ></div>\n             \n            </div>\n            <div ng-if=\"single.billboards\">\n              <div ng-include=\"\'components/messages/outdoor.html\'\" ></div>\n             \n            </div>\n            <div ng-if=\"single.banner\">\n              <div ng-include=\"\'components/messages/nontraditional.html\'\" ></div>\n             \n            </div>\n            <div ng-if=\"single.socialMedia\">\n              <div ng-include=\"\'components/messages/nontraditional.html\'\" ></div>\n             \n            </div>\n            </div>\n          </div>\n          </div>\n\n    </div>\n</div>\n\n</section>\n</md-content>\n</div>\n</div>\n<footer></footer>\n");
$templateCache.put("app/media/media.html","<navbar leftmenu=\"true\"></navbar>\n<left-menu></left-menu>\n<div class=\"container\">\n<div layout-align=\"start center\" layout=\"column\">\n<h2 class=\"md-title\">Media Library</h2>\n<md-progress-linear md-mode=\"determinate\" value=\"{{progress}}\" class=\"md-warn\" ng-show=\"progress >= 0\"></md-progress-linear>\n<!-- <span class=\"progress\">\n	<div style=\"width:{{progress}}%\" ng-bind=\"progress + \'%\'\"></div>\n</span> -->\n</div>\n<div layout=\"column\">\n	<div ngf-drop ngf-select ng-model=\"files\" class=\"drop-box\"\n			ngf-drag-over-class=\"\'dragover\'\" ngf-multiple=\"true\" ngf-allow-dir=\"true\"\n			accept=\"image/*\"\n			ngf-pattern=\"\'image/*\'\">Drop images here to upload<br/>\n			or <br/>\n		<md-button tabindex=\"0\"\n		class=\"md-button md-default-theme md-warn md-raised\"\n		ngf-multiple=\"true\"\n		aria-label=\"Open file select panel\"\n		ngf-select=\"upload($files)\">\n			<ng-md-icon icon=\"cloud\"></ng-md-icon> Select Files\n		</md-button>\n	</div>\n\n	<div ngf-no-file-drop>File Drag/Drop is not supported for this browser</div>\n\n	<md-grid-list md-cols-xs =\"1\" md-cols-sm=\"3\" md-cols-md=\"5\" md-cols-lg=\"6\" md-cols-gt-lg=\"10\" md-row-height-gt-md=\"1:1\" md-row-height=\"4:3\" md-gutter=\"12px\" md-gutter-gt-sm=\"8px\">\n\n		<md-grid-tile ng-repeat=\"i in data\" class=\"md-whiteframe-z2\" ng-click=\"imageDetails(i)\">\n\n			<div class=\"thumbnail\">\n					<img ng-src=\"{{i.path}}\" draggable=\"false\" alt=\"{{i.name}}\">\n			</div>\n			<md-grid-tile-footer><h3>{{i.name}}</h3></md-grid-tile-footer>\n		</md-grid-tile>\n	</md-grid-list>\n\n	<pre ng-if=\"files[0].$error\">Upload Log: {{f.$error}} {{f.$errorParam}}</pre>\n</div>\n</div>\n<footer></footer>\n");
$templateCache.put("app/medias/medias.html","<navbar leftmenu=\"true\"></navbar>\n<left-menu></left-menu>\n<div class=\"container\">\n<div layout-align=\"start center\" layout=\"column\">\n<h2 class=\"md-title\">Media Library</h2>\n<md-progress-linear md-mode=\"determinate\" value=\"{{progress}}\" class=\"md-warn\" ng-show=\"progress >= 0\"></md-progress-linear>\n<!-- <span class=\"progress\">\n	<div style=\"width:{{progress}}%\" ng-bind=\"progress + \'%\'\"></div>\n</span> -->\n</div>\n<div layout=\"column\">\n	<!-- <div ngf-drop ngf-select ng-model=\"files\" class=\"drop-box\"\n			ngf-drag-over-class=\"\'dragover\'\" ngf-multiple=\"true\" ngf-allow-dir=\"true\"\n			accept=\"image/*\"\n			ngf-pattern=\"\'image/*\'\">Drop images here to upload<br/>\n			or <br/>\n		<md-button tabindex=\"0\"\n		class=\"md-button md-default-theme md-warn md-raised\"\n		ngf-multiple=\"true\"\n		aria-label=\"Open file select panel\"\n		ngf-select=\"upload($files)\">\n			<ng-md-icon icon=\"cloud\"></ng-md-icon> Select Files\n		</md-button>\n	</div>\n\n	<div ngf-no-file-drop>File Drag/Drop is not supported for this browser</div> -->\n\n	<md-grid-list md-cols-xs =\"1\" md-cols-sm=\"3\" md-cols-md=\"5\" md-cols-lg=\"6\" md-cols-gt-lg=\"10\" md-row-height-gt-md=\"1:1\" md-row-height=\"4:3\" md-gutter=\"12px\" md-gutter-gt-sm=\"8px\">\n\n		<md-grid-tile ng-repeat=\"i in data\" class=\"md-whiteframe-z2\" ng-click=\"imageDetails(i)\">\n\n			<div class=\"thumbnail\">\n					<img ng-src=\"{{i.path}}\" draggable=\"false\" alt=\"{{i.name}}\">\n			</div>\n			<md-grid-tile-footer><h3>{{i.name}}</h3></md-grid-tile-footer>\n		</md-grid-tile>\n	</md-grid-list>\n\n	<pre ng-if=\"files[0].$error\">Upload Log: {{f.$error}} {{f.$errorParam}}</pre>\n</div>\n</div>\n<footer></footer>\n");
$templateCache.put("app/order/order.html","<navbar leftmenu=\"true\"></navbar>\n<left-menu></left-menu>\n<md-card>\n      <md-card-header style=\"background:#e2ee22\" ng-if=\"order.payment.id\">\n          <md-card-header-text>\n            <h3>Order placed successfully</h3>\n            <span class=\"md-subhead\" >\n                <span ng-if=\"order.payment.id\">Payment ID: {{order.payment.id}}</span><br/>\n            </span>\n          </md-card-header-text>\n          \n      </md-card-header>\n</md-card>\n<md-content class=\"content md-padding\" layout=\"column\" layout-align=\"start center\">\n     \n      <!--When No Orders-->\n      <section ng-if=\"order.orders.length===0\" class=\"header\" layout=\"column\" layout-align=\"center stretch\">\n        <h1>You have not purchased anything yet</h1>\n        <md-button ui-sref=\"/\" class=\"md-primary md-raised\">\n        <ng-md-icon icon=\"shopping_cart\"></ng-md-icon>Shop Now\n\n        </md-buton>\n      </section>\n\n \n      <div class=\"container\"  ng-if=\"order.orders.length >0\">\n<h3>Transaction History</h3>\n<div class=\"box\" >\n        <div class=\"row\">\n        \n              <div class=\"col-sm-4\" style=\"border-right: bold\">\n                <h3 >Total Spent:<br> &nbsp;<br>{{order.orders.total | currency}}</h3>\n              </div>\n              <div class=\"col-sm-4\"><h3>How you pay</h3><br><small>manage</small></div>\n              <div class=\"col-sm-4\"><h3><a href=\"/address\">Advertising Profile</a></h3><br><p>Company:{{order.Auth.getCurrentUser().company}}<br>Contact Name:{{order.Auth.getCurrentUser().name}}<b/><br>Phone :{{order.Auth.getCurrentUser().phone}}<br>Email: {{order.Auth.getCurrentUser().email}}</div>\n          \n        </div>\n </div>\n<div class=\"box\">\n  <div class=\"row\">\n<div class=\"col-md-12\">\n   <div style=\"margin-top:20px\" class=\"small\" dw-loading=\"orders\" dw-loading-options=\"{active: true, text: \'\', className: \'custom-loading\', spinnerOptions: {lines: 12, length: 20, width: 6, radius: 20, color: \'#d9534f\', direction: -1, speed: 3}}\"></div>\n  <div ng-controller = \"OrderController as vm\">\n    <kendo-grid options=\"vm.mainGridOptions\">\n\n    <div k-detail-template>\n\n\n        <kendo-tab-strip>\n        <ul>\n            <li class=\"k-state-active\">ORDER DETAILS</li>\n           <!-- <li>PUBLISHER </li>-->\n        </ul>\n        <div>\n            <div kendo-grid k-options=\"vm.detailGridOptions(dataItem)\"></div>\n        </div>\n        <div>\n            <ul class=\"contact-info-form\">\n               <li><label>Name:</label> {{dataItem.items[0].publisher}}</li>\n                <<!-- li><label>City:</label> {{dataItem.City}}</li>\n                <li><label>Email:</label> {{dataItem.Address}}</li>\n                <li><label>Home phone:</label> {{dataItem.HomePhone}}</li> -->\n            </ul>\n        </div>\n        </kendo-tab-strip>\n    </div>\n</kendo-grid>\n</div>\n</div>\n</div>\n</div>\n</div>\n\n</md-content>\n<footer></footer>\n\n<script>\n        /*\n            This demo renders the grid in \"DejaVu Sans\" font family, which is\n            declared in kendo.common.css. It also declares the paths to the\n            fonts below using <tt>kendo.pdf.defineFont</tt>, because the\n            stylesheet is hosted on a different domain.\n        */\n        kendo.pdf.defineFont({\n            \"DejaVu Sans\"             : \"//kendo.cdn.telerik.com/2016.2.607/styles/fonts/DejaVu/DejaVuSans.ttf\",\n            \"DejaVu Sans|Bold\"        : \"//kendo.cdn.telerik.com/2016.2.607/styles/fonts/DejaVu/DejaVuSans-Bold.ttf\",\n            \"DejaVu Sans|Bold|Italic\" : \"//kendo.cdn.telerik.com/2016.2.607/styles/fonts/DejaVu/DejaVuSans-Oblique.ttf\",\n            \"DejaVu Sans|Italic\"      : \"//kendo.cdn.telerik.com/2016.2.607/styles/fonts/DejaVu/DejaVuSans-Oblique.ttf\"\n        });\n    </script>\n    <script type=\"text/x-kendo-template\" id=\"template\">\n                <div class=\"toolbar\">\n                    <label class=\"category-label\" for=\"category\">Show products by category:</label>\n                    <input type=\"search\" id=\"category\" style=\"width: 150px\"/>\n                </div>\n            </script>\n\n    <script type=\"x/kendo-template\" id=\"page-template\">\n      <div class=\"page-template\">\n        <div class=\"header\">\n          <div style=\"float: right\">Page #: pageNum # of #: totalPages #</div>\n          A Taste for convinience\n        </div>\n        <div class=\"watermark\">MEDIABOX</div>\n        <div class=\"footer\">\n          Page #: pageNum # of #: totalPages #\n        </div>\n      </div>\n    </script>");
$templateCache.put("app/orders/orders.html","<navbar leftmenu=\"true\"></navbar>\n<left-menu></left-menu>\n<div class=\"container\">\n <!--When No Orders-->\n      <section ng-if=\"order.orders.total===0\" class=\"header\" layout=\"column\" layout-align=\"center stretch\">\n        <h1>You have not recieved any payments yet</h1>\n        <md-button ui-sref=\"/\" class=\"md-primary md-raised\">\n        <ng-md-icon icon=\"shopping_cart\"></ng-md-icon>Shop Now\n\n        </md-buton>\n      </section>\n<div class=\"box\">\n        <div class=\"row\">\n        \n              <div class=\"col-sm-4\" style=\"border-right: bold\">\n                <h3 >Orders Total :<br> &nbsp;<br>{{orders.orders.total | currency}}</h3>\n              </div>\n              <div class=\"col-sm-4\"><h3>How You get paid</h3><br><small><a href=\"/profile\">manage</a></small></div>\n               <div class=\"col-sm-4\"><h3><a href=\"/profile\">Advertising Profile</a></h3><br><p>Company:{{orders.Auth.getCurrentUser().company}}<br>Contact Name:{{user.name}}<b/><br>Phone :{{orders.Auth.getCurrentUser().phone}}<br>Email: {{orders.Auth.getCurrentUser().email}}</div>\n          \n        </div>\n </div>\n<div class=\"box\">\n  <div style=\"margin-top:20px\" class=\"small\" dw-loading=\"orders\" dw-loading-options=\"{active: true, text: \'\', className: \'custom-loading\', spinnerOptions: {lines: 12, length: 20, width: 6, radius: 20, color: \'#d9534f\', direction: -1, speed: 3}}\"></div>\n    \n      <div ng-controller = \"OrdersController as vm\">\n    <kendo-grid options=\"vm.mainGridOptions\">\n\n    <div k-detail-template>\n\n\n        <kendo-tab-strip>\n        <ul>\n            <li class=\"k-state-active\">ORDER DETAILS</li>\n            <li>ADVERTISER</li>\n        </ul>\n        <div>\n            <div kendo-grid k-options=\"vm.detailGridOptions(dataItem)\"></div>\n        </div>\n        <div>\n            <ul class=\"contact-info-form\">\n            <li><label>Name:</label> {{dataItem.address.recipient_name}}</li>\n                <li><label>Address:</label>{{dataItem.address.line1}}</li>\n                 <li><label>&nbsp;</label>{{dataItem.address.city}}</li>\n                 <li><label>&nbsp;</label>{{dataItem.address.country_code}}</li>\n                <li><label>Email:</label> {{dataItem.email}}</li>\n                <li><label>Phone:</label> {{dataItem.phone}}</li>\n                          \n            </ul>\n        </div>\n        </kendo-tab-strip>\n    </div>\n</kendo-grid>\n</div>\n\n \n</div>\n</div>\n\n\n<footer></footer>\n\n<script>\n        /*\n            This demo renders the grid in \"DejaVu Sans\" font family, which is\n            declared in kendo.common.css. It also declares the paths to the\n            fonts below using <tt>kendo.pdf.defineFont</tt>, because the\n            stylesheet is hosted on a different domain.\n        */\n        kendo.pdf.defineFont({\n            \"DejaVu Sans\"             : \"//kendo.cdn.telerik.com/2016.2.607/styles/fonts/DejaVu/DejaVuSans.ttf\",\n            \"DejaVu Sans|Bold\"        : \"//kendo.cdn.telerik.com/2016.2.607/styles/fonts/DejaVu/DejaVuSans-Bold.ttf\",\n            \"DejaVu Sans|Bold|Italic\" : \"//kendo.cdn.telerik.com/2016.2.607/styles/fonts/DejaVu/DejaVuSans-Oblique.ttf\",\n            \"DejaVu Sans|Italic\"      : \"//kendo.cdn.telerik.com/2016.2.607/styles/fonts/DejaVu/DejaVuSans-Oblique.ttf\"\n        });\n    </script>\n    <script type=\"text/x-kendo-template\" id=\"template\">\n                <div class=\"toolbar\">\n                    <label class=\"category-label\" for=\"category\">Show products by category:</label>\n                    <input type=\"search\" id=\"category\" style=\"width: 150px\"/>\n                </div>\n            </script>\n\n    <script type=\"x/kendo-template\" id=\"page-template\">\n      <div class=\"page-template\">\n        <div class=\"header\">\n          <div style=\"float: right\">Page #: pageNum # of #: totalPages #</div>\n          A Taste for convinience\n        </div>\n        <div class=\"watermark\">MEDIABOX</div>\n        <div class=\"footer\">\n          Page #: pageNum # of #: totalPages #\n        </div>\n      </div>\n    </script>\n\n");
$templateCache.put("app/payment/cancel.html","<navbar leftmenu=\"true\"></navbar>\n<left-menu></left-menu>\n<md-content flex class=\"content md-padding\" layout=\"column\" layout-align=\"start center\">\n      <section class=\"header\" layout=\"column\" layout-align=\"center center\">\n        <h2>Payment Process Cancelled</h2>\n      </section>\n</md-content>\n<footer></footer>\n");
$templateCache.put("app/payment/error.html","<navbar leftmenu=\"true\"></navbar>\n<left-menu></left-menu>\n<md-content flex class=\"content md-padding\" layout=\"column\" layout-align=\"start center\">\n      <section class=\"header\" layout=\"column\" layout-align=\"center center\">\n        <h2>Payment Error Occured</h2>\n          <label>Here is more details about the error</label>\n      </section>\n</md-content>\n<footer></footer>\n");
$templateCache.put("app/payment/success.html","<navbar leftmenu=\"true\"></navbar>\n<left-menu></left-menu>\n<md-content flex class=\"content md-padding\" layout=\"column\" layout-align=\"start center\">\n      <section class=\"header\" layout=\"column\" layout-align=\"center center\">\n        <h2>Payment Successful</h2>\n        <md-input-container flex>\n          <label>Search Payments</label>\n          <input name=\"search\" type=\"text\" ng-model=\"payment.search\" md-autofocus/>\n        </md-input-container>\n      </section>\n  <section layout=\"column\" class=\"orders\">\n  <md-card ng-repeat=\"o in payment.orders | orderBy : \'orderDate\' : \'reverse\' | filter:payment.search\">\n      <md-card-header>\n          <md-card-header-text>\n            <span class=\"\">ORDER PLACED</span>\n            <span class=\"md-subhead\">{{o.created_at | amCalendar}}</span>\n          </md-card-header-text>\n          <md-card-header-text>\n            <span class=\"\">TOTAL</span>\n            <span class=\"md-subhead\">{{o.total | currency}}</span>\n          </md-card-header-text>\n          <md-card-header-text>\n            <span class=\"\">SHIP TO</span>\n            <span class=\"md-subhead\">{{o.name}}</span>\n          </md-card-header-text>\n          <md-card-header-text>\n            <span class=\"\">Order # </span>\n            <span class=\"md-subhead\">{{o.orderNo}}</span>\n          </md-card-header-text>\n      </md-card-header>\n      <md-card-content layout=\"row\" layout-align=\"space-between\">\n          <div flex>\n            <div layout=\"row\" ng-repeat=\"i in o.items\">\n              <md-card-avatar>\n                  <img ng-src=\"{{i.image}}\" class=\"md-card-image\" alt=\"i.name\" width=\"100px\">\n              </md-card-avatar>\n              \n              <div class=\"content\">\n              <a ng-click=\"payment.navigate(i)\">{{i.name}}</a><br/>\n              Size: <b>{{i.size}}</b><br/>\n              Amount: <b>{{i.price}} * {{i.quantity}}&nbsp;=&nbsp;{{i.price * i.quantity | currency: payment.Settings.currency.symbol}}</b>\n              <del ng-if=\"i.price!=i.mrp\">{{i.mrp}}</del><br/>\n              <br/>\n                \n              </div>\n            </div>\n          </div>\n          <md-card-actions layout=\"column\" class=\"content\">\n            <md-list flex>\n              <md-list-item class=\"md-2-line\">\n                <div class=\"md-list-item-text\">\n                  <h2 class=\"md-subhead\"><ng-md-icon icon=\"local_shipping\"></ng-md-icon>&nbsp;Address</h2>\n                  <hr>\n                  {{o.address}}<br/>\n                  {{o.city}}<br/>\n                  {{o.zip}}<br/>\n                  {{o.phone}}<br/>\n                </div>\n              </md-list-item>\n\n              <!--<md-list-item>\n                <div class=\"md-list-item-text\">\n                  <p class=\"md-subhead\">Payment Status: &nbsp;</p>\n                </div>\n                  <md-select ng-model=\"o.payment\" placeholder=\"Payment Status\" ng-change=\"payment.changeStatus(o)\">\n                    <md-option ng-value=\"o\" ng-repeat=\"o in payment.Settings.paymentStatus\">{{o}}</md-option>\n                  </md-select>\n              </md-list-item>-->\n\n              <md-list-item>\n                <div class=\"md-list-item-text\">\n                  <p  class=\"md-subhead\">Order Status: &nbsp;</p>\n                </div>\n                  <md-select ng-model=\"o.status\" placeholder=\"Order Status\" ng-change=\"payment.changeStatus(o)\" flex>\n                    <md-option ng-value=\"o\" ng-repeat=\"o in payment.Settings.orderStatus\">{{o}}</md-option>\n                  </md-select>\n              </md-list-item>\n           </md-list>\n          </md-card-actions>\n      </md-card-content>\n  </md-card>\n  </section>\n</md-content>\n<footer></footer>\n");
$templateCache.put("app/payment-method/payment-method.html","<crud-table api=\'PaymentMethod\' options=\'options\'></crud-table>\n");
$templateCache.put("app/product/detail.html","<md-toolbar class=\"md-hue-1\" id=\"user-detail-toolbar\">\n	<span layout=\"row\" layout-align=\"space-between\" class=\"md-toolbar-tools md-toolbar-tools-top\">\n		<md-button ng-click=\"detail.goBack();\" aria-label=\"Close detail view\">\n			<ng-md-icon icon=\"close\" aria-label=\"Close dialog\"></ng-md-icon>\n		</md-button>\n		<h3 style=\"margin-top: 15px\">Edit {{ detail.product.name | labelCase}}</h3>\n		<md-button aria-label=\"-\">\n		</md-button>\n	</span>\n</md-toolbar>\n<md-content class=\"md-padding\" flex layout-fill ng-cloak id=\"user-detail-content\">\n	<section class=\"section\" layout=\"row\">\n    \n<form name=\"form\" layout=\"column\" layout-fill layout-align=\"space-between\" ng-submit=\"detail.save(detail.product);detail.goBack();\" novalidate autocomplete=\"off\">\n		<span layout=\"column\" layout-sm=\"column\">\n		  <!--<md-content>-->\n				<br/>\n			    <section layout=\"column\">\n							<span layout=\"row\">\n								<!--<md-input-container flex>\n									<label>SKU</label>\n									<input name=\"sku\" ng-model=\"detail.product.sku\" md-autofocus>\n								</md-input-container>-->\n\n								<md-input-container flex>\n									<label>Name</label>\n									<input name=\"name\" ng-model=\"detail.product.name\"/>\n								</md-input-container>\n							</span>\n								<md-input-container flex>\n									<label>Description</label>\n									<textarea name=\"description\" ng-model=\"detail.product.info\" rows=\"2\"></textarea>\n								</md-input-container>\n								<span layout=\"row\">\n									<md-input-container flex>\n										<label>Platform</label>\n										<md-select ng-model=\"detail.product.category\" ng-change=\"detail.changeCategory(o.name)\">\n											<md-option ng-repeat=\"o in detail.options.categories\" value=\"{{o._id}}\">\n												{{o.name}} - <b>{{o.parent.name}}</b>\n											</md-option>\n										</md-select>\n										<md-button ui-sref=\"category\"><ng-md-icon icon=\"subject\"></ng-md-icon>New Platform</md-button>\n									</md-input-container>\n									<md-input-container flex>\n										<label>Category</label>\n										<md-select ng-model=\"detail.product.brand\">\n											<md-option ng-repeat=\"o in detail.options.brands\" value=\"{{o._id}}\">\n												{{o.name}}\n											</md-option>\n										</md-select>\n										<md-button ui-sref=\"brand\"><ng-md-icon icon=\"verified_user\"></ng-md-icon>New Category</md-button>\n									</md-input-container>\n								</span>\n								\n\n							<span layout=\"row\">\n								<!-- <md-input-container flex>\n									<label>SKU</label>\n									<input name=\"sku\" ng-model=\"detail.product.sku\" md-autofocus>\n								</md-input-container> -->\n\n								<md-input-container flex>\n									<label>Website</label>\n									<input name=\"sku\" ng-model=\"detail.product.website\" md-autofocus>\n								\n								</md-input-container>\n\n								<md-input-container flex>\n									<label>Logo</label>\n									<input class=\"inputfile\" type=\"file\" ng-model=\"detail.product.logo\" name=\"inputFile\" base-sixty-four-input  maxsize=\"500\" accept=\"image/*\"/>\n											\n\n								</md-input-container>\n\n								<div class=\"product-thumbnail\">\n                                      \n	                           	   <a>\n	                                    <img data-ng-src=\"data:image/png;base64,{{detail.product.logo.base64}}\"  alt=\"{{item.publisher}}\" style=\"width: 50px;\">\n	                                </a>\n\n\n                                </div>\n								\n							</span>\n							<span layout=\"row\">\n								<md-input-container flex>\n									<label>Phone</label>\n									<input name=\"sku\" ng-model=\"detail.product.phone\" md-autofocus>\n								</md-input-container>\n\n								<md-input-container flex>\n									<label>Email</label>\n									<input name=\"sku\" ng-model=\"detail.product.email\" md-autofocus>\n								\n								</md-input-container>\n								\n							</span>\n\n							<md-input-container flex>\n									<label>Terms Of Use</label>\n									<textarea name=\"description\" ng-model=\"detail.product.terms\" rows=\"2\"></textarea>\n								</md-input-container>\n			    </section>\n			    <section>\n			      <md-subheader class=\"md-warn\">General Features</md-subheader> \n						<md-button ui-sref=\"feature\"><ng-md-icon icon=\"spellcheck\"></ng-md-icon>New Feature</md-button>\n						<table md-colresize=\"md-colresize\" class=\"md-table\" id=\"exportable\">\n							<thead>\n								<tr class=\"md-table-headers-row\">\n									<th class=\"md-table-header\">#</th>\n									<th class=\"md-table-header\">Key</th>\n									<th class=\"md-table-header\">Value</th>\n									<th class=\"md-table-header\"></th>\n								</tr>\n							</thead>\n\n							<tbody>\n\n								<tr ng-repeat=\"feature in detail.product.features track by $index\" id=\"{{feature._id}}\"\n										class=\"md-table-content-row\"\n										ng-class=\"{\'selected\': detail.isSelected(p)}\">\n									<td>{{$index+1}}</td>\n									<td>\n										<md-input-container flex>\n											<md-select ng-model=\"feature.key\" aria-label=\"Features Key\">\n												<md-option ng-repeat=\"o in detail.options.features | unique: \'key\'\" value=\"{{o.key}}\">\n													{{o.key}}\n												</md-option>\n											</md-select>\n										</md-input-container>\n									</td>\n									<td>\n										<md-input-container flex>\n											<md-select ng-model=\"feature.val\" aria-label=\"Features Value\">\n												<md-option ng-repeat=\"o in detail.options.features | filter: feature.key | unique: \'val\'\" value=\"{{o.val}}\">\n													{{o.val}}\n												</md-option>\n											</md-select>\n										</md-input-container>\n									</td>\n									<td>\n										<md-button class=\"md-icon-button\" aria-label=\"Delete Feature\" ng-click=\"detail.deleteFeature($index,detail.product);\"><ng-md-icon icon=\"delete\"></ng-md-icon></md-button>\n									</td>\n								</tr>\n								<tr>\n									<td></td>\n									<td>\n										<md-input-container flex>\n											<md-select ng-model=\"detail.product.features[detail.product.features.length].key\" aria-label=\"Features Key\">\n												<md-option ng-repeat=\"o in detail.options.features | unique: \'key\'\" value=\"{{o.key}}\">\n													{{o.key}}\n												</md-option>\n											</md-select>\n										</md-input-container>\n									</td>\n									<td>\n										<md-input-container flex>\n											<md-select ng-model=\"detail.product.features[detail.product.features.length].val\" aria-label=\"Features Value\">\n												<md-option ng-repeat=\"o in detail.options.features | filter: feature.key | unique: \'val\'\" value=\"{{o.val}}\">\n													{{o.val}}\n												</md-option>\n											</md-select>\n										</md-input-container>\n									</td>\n									<td></td>\n								</tr>\n							</tbody>\n			      </table>\n			    </section>\n			    <section>\n			      <md-subheader class=\"md-warn\">Key Features</md-subheader>\n						<a href=\"/keyfeature\" class=\"pull-right\">Create New</a>\n						<table md-colresize=\"md-colresize\" class=\"md-table\" id=\"exportable\">\n							<thead>\n								<tr class=\"md-table-headers-row\">\n									<th class=\"md-table-header\">#</th>\n									<th class=\"md-table-header\">Key</th>\n									<th class=\"md-table-header\">Value</th>\n									<th class=\"md-table-header\"></th>\n								</tr>\n							</thead>\n\n							<tbody>\n\n								<tr ng-repeat=\"keyfeature in detail.product.keyFeatures track by $index\" id=\"{{keyfeature._id}}\"\n										class=\"md-table-content-row\"\n										ng-class=\"{\'selected\': detail.isSelected(p)}\">\n									<td>{{$index+1}}</td>\n									<td>\n										<md-input-container flex>\n											<md-select ng-model=\"keyfeature.key\" aria-label=\"KeyFeatures Key\">\n												<md-option ng-repeat=\"o in detail.options.keyfeatures | unique: \'key\'\" value=\"{{o.key}}\">\n													{{o.key}}\n												</md-option>\n											</md-select>\n										</md-input-container>\n									</td>\n									<td>\n										<md-input-container flex>\n											<input name=\"size\" ng-model=\"keyfeature.val\"  aria-label=\"Features Value\"/>\n\n											\n										</md-input-container>\n									</td>\n									<td>\n										<md-button class=\"md-icon-button\" aria-label=\"Delete Key Feature\" ng-click=\"detail.deleteKeyFeature($index,detail.product);\"><ng-md-icon icon=\"delete\"></ng-md-icon></md-button>\n									</td>\n								</tr>\n								<tr>\n									<td></td>\n									<td>\n										<md-input-container flex>\n											<md-select ng-model=\"detail.product.keyFeatures[detail.product.keyFeatures.length].key\" aria-label=\"KeyFeatures Key\">\n												<md-option ng-repeat=\"o in detail.options.keyfeatures | unique: \'key\'\" value=\"{{o.key}}\">\n													{{o.key}}\n												</md-option>\n											</md-select>\n										</md-input-container>\n									</td>\n									<td>\n										<md-input-container flex>\n										<input name=\"size\" ng-model=\"detail.product.keyFeatures[detail.product.keyFeatures.length].val\"  aria-label=\"KeyFeatures Value\"/>\n											\n										</md-input-container>\n									</td>\n									<td></td>\n								</tr>\n							</tbody>\n			      </table>\n			    </section>\n\n			    <section>\n			      <md-subheader class=\"md-warn\">General Statistics</md-subheader> \n						<md-button ui-sref=\"stat\"><ng-md-icon icon=\"spellcheck\"></ng-md-icon>New entry</md-button>\n						<table md-colresize=\"md-colresize\" class=\"md-table\" id=\"exportable\">\n							<thead>\n								<tr class=\"md-table-headers-row\">\n									<th class=\"md-table-header\">#</th>\n									<th class=\"md-table-header\">Key</th>\n									<th class=\"md-table-header\">Value</th>\n									<th class=\"md-table-header\"></th>\n								</tr>\n							</thead>\n\n							<tbody>\n\n								<tr ng-repeat=\"stat in detail.product.stats track by $index\" id=\"{{stat._id}}\"\n										class=\"md-table-content-row\"\n										ng-class=\"{\'selected\': detail.isSelected(p)}\">\n									<td>{{$index+1}}</td>\n									<td>\n										<md-input-container flex>\n											<md-select ng-model=\"stat.key\" aria-label=\"stats Key\">\n												<md-option ng-repeat=\"o in detail.options.statistics | unique: \'key\'\" value=\"{{o.key}}\">\n													{{o.key}}\n												</md-option>\n											</md-select>\n										</md-input-container>\n									</td>\n									<td>\n										<md-input-container flex>\n										<input name=\"size\" ng-model=\"stat.val\" aria-label=\"Statistics\"/>\n											\n										</md-input-container>\n									</td>\n									<td>\n										<md-button class=\"md-icon-button\" aria-label=\"Delete stat\" ng-click=\"detail.deleteStat($index,detail.product);\"><ng-md-icon icon=\"delete\"></ng-md-icon></md-button>\n									</td>\n								</tr>\n								<tr>\n									<td></td>\n									<td>\n										<md-input-container flex>\n											<md-select ng-model=\"detail.product.stats[detail.product.stats.length].key\" aria-label=\"stats Key\">\n												<md-option ng-repeat=\"o in detail.options.statistics | unique: \'key\'\" value=\"{{o.key}}\">\n													{{o.key}}\n												</md-option>\n											</md-select>\n										</md-input-container>\n									</td>\n									<td>\n										<md-input-container flex>\n\n											<input name=\"statistics\"  ng-model=\"detail.product.stats[detail.product.statistics.length].val\" aria-label=\"Statistics\"/>\n											\n										</md-input-container>\n									</td>\n									<td></td>\n								</tr>\n							</tbody>\n			      </table>\n			    </section>\n			    <section>\n			      <md-subheader class=\"md-accent\">Media Options</md-subheader>\n\n			   						<table md-colresize=\"md-colresize\" class=\"md-table\" id=\"exportable\">\n							<thead>\n								<tr class=\"md-table-headers-row\">\n									<th class=\"md-table-header\">#</th>\n									<th class=\"md-table-header\">Preview</th>\n									<th class=\"md-table-header\">Name</th>\n									<th class=\"md-table-header\">Dimensions</th>\n									<th class=\"md-table-header\">Fomart</th>\n									<th class=\"md-table-header\">Model</th>\n									<th class=\"md-table-header\">Price</th>\n									<th class=\"md-table-header\" width=\"10px\">Image</th>\n									<th class=\"md-table-header\"></th>\n								</tr>\n							</thead>\n\n							<tbody>\n\n								<tr ng-repeat=\"v in detail.product.variants track by $index\" id=\"{{v._id}}\"\n										class=\"md-table-content-row\"\n										ng-class=\"{\'selected\': detail.isSelected(p)}\">\n									<td>{{$index+1}}</td>\n									<td>\n										<md-input-container flex>\n											<img ng-hide=\"v.image\" src=\"/assets/img/preview.png\" style=\"height:50px\" >\n											<img ng-if=\"v.image\" ng-src=\"{{v.image}}\" src=\"/assets/img/preview.png\" style=\"height:50px\">\n										</md-input-container>\n									</td>\n									<td>\n										<md-input-container flex>\n											<input name=\"size\" ng-model=\"v.name\" aria-label=\"Media Name\"/>\n\n										</md-input-container>\n									</td>\n									<td>\n										<md-input-container flex>\n											<input name=\"size\" ng-model=\"v.size\" aria-label=\"Dimensions\"/>\n										</md-input-container>\n									</td>\n									<td>\n										<md-input-container flex>\n											<input name=\"weight\" ng-model=\"v.formart\" aria-label=\"Media Formart\"/>\n										</md-input-container>\n									</td>\n									<td>\n										<md-input-container flex>\n											<input name=\"mrp\" ng-model=\"v.model\" aria-label=\"Pricing Model\" />\n										</md-input-container>\n									</td>\n									<td>\n										<md-input-container flex>\n											<input name=\"price\" ng-model=\"v.price\" aria-label=\"Media Selling Price\" only-numbers/>\n										</md-input-container>\n									</td>\n									<td>\n										<md-input-container flex>\n											<input name=\"image\" hidden ng-model=\"v.image\" aria-label=\"Media Preview\"/>\n											<ng-md-icon class=\"orange600\" ng-hide=\"v.image\" icon=\"insert_photo\" ng-click=\"detail.mediaLibrary($index)\"></ng-md-icon>\n											<ng-md-icon ng-show=\"v.image\" icon=\"insert_photo\" ng-click=\"detail.mediaLibrary($index)\"></ng-md-icon>\n										</md-input-container>\n									</td>\n									<td>\n										<md-button class=\"md-icon-button\" aria-label=\"Delete Feature\"   ng-click=\"detail.deleteVariants($index,product);\"><ng-md-icon icon=\"delete\"></ng-md-icon></md-button>\n									</td>\n								</tr>\n								<tr class=\"md-table-content-row\"\n										ng-class=\"{\'selected\': detail.isSelected(p)}\">\n									<td>&nbsp;</td>\n									<td>New</td>\n									<td>\n										<md-input-container flex>\n											<input name=\"size\" ng-model=\"detail.product.newVariant.name\" aria-label=\"Media Name\"/>\n										</md-input-container>\n									</td>\n									<td>\n										<md-input-container flex>\n											<input name=\"size\" ng-model=\"detail.product.newVariant.size\" aria-label=\"Media Dimensions\"/>\n										</md-input-container>\n									</td>\n									<td>\n										<md-input-container flex>\n											<input name=\"weight\" ng-model=\"detail.product.newVariant.formart\" aria-label=\"Media Formart\"/>\n										</md-input-container>\n									</td>\n									<td>\n										<md-input-container flex>\n											<input name=\"mrp\" ng-model=\"detail.product.newVariant.model\" aria-label=\"Pricing Model\"/>\n										</md-input-container>\n									</td>\n									<td>\n										<md-input-container flex>\n											<input name=\"price\" ng-model=\"detail.product.newVariant.price\" aria-label=\"Media Selling Price\" only-numbers/>\n										</md-input-container>\n									</td>\n									<td>\n										<md-input-container flex>\n											<input name=\"image\" hidden ng-model=\"detail.product.newVariant.image\"  width=\"10px\" aria-label=\"Variant Image\"/>\n											<ng-md-icon class=\"orange600\" ng-hide=\"v.image\" icon=\"insert_photo\" ng-click=\"detail.mediaLibrary(1000000)\"></ng-md-icon>\n											<ng-md-icon ng-show=\"v.image\" icon=\"insert_photo\" ng-click=\"detail.mediaLibrary(1000000)\"></ng-md-icon>\n										</md-input-container>\n									</td>\n									<td>\n									</td>\n								</tr>\n							</tbody>\n			      </table>\n			    </section>\n\n			  </md-content>\n\n		<md-dialog-actions layout=\"row\">\n			<span flex></span>\n			<md-button ng-disabled=\"detailForm.$invalid\" type=\"submit\" class=\"md-primary md-raised\" aria-label=\"Save changes\">Save</md-button>\n		</md-dialog-actions>\n		</form>\n\n	</section>\n\n	<section class=\"section\" layout=\"column\" ng-hide=\"detail.isRoot\">\n\n		<span class=\"section-title\">Record Information</span>\n		<span layout=\"row\" layout-sm=\"column\" class=\"detail-info\">\n			<span flex>Modified\n				<span am-time-ago=\"detail.product.updated_at\"></span>\n				{{detail.product.updated_at && \'by \' + detail.product.uid}}\n				<md-tooltip>{{detail.product.updated_at | date:\'dd. MMMM yyyy H:mm\'}}</md-tooltip>\n			</span>\n		</span>\n\n		<span layout=\"row\" layout-sm=\"column\" class=\"detail-info\" ng-show=\"detail.product.created_at\">\n			<span flex=\"25\">Created</span>\n			<span flex>{{detail.product.created_at | date:\'dd. MMMM yyyy H:mm\'}}</span>\n		</span>\n\n	</section>\n\n<!--</md-content>-->\n\n<md-button class=\"md-fab md-accent md-fab-bottom-right fab-overlap md-button ng-scope md-blue-theme\" aria-label=\"Save Product\" ng-if=\"form.$dirty\" ng-click=\"detail.save(detail.product);\">\n	<ng-md-icon icon=\"save\"></ng-md-icon>\n</md-button>\n<script type=\"text/javascript\">\n	var inputs = document.querySelectorAll( \'.inputfile\' );\nArray.prototype.forEach.call( inputs, function( input )\n{\n	var label	 = input.nextElementSibling,\n		labelVal = label.innerHTML;\n\n	input.addEventListener( \'change\', function( e )\n	{\n		var fileName = \'\';\n		if( this.files && this.files.length > 1 )\n			fileName = ( this.getAttribute( \'data-multiple-caption\' ) || \'\' ).replace( \'{count}\', this.files.length );\n		else\n			fileName = e.target.value.split( \'\\\\\' ).pop();\n\n		if( fileName )\n			label.querySelector( \'span\' ).innerHTML = fileName;\n		else\n			label.innerHTML = labelVal;\n	});\n});\n</script>\n");
$templateCache.put("app/product/list.html","<a ng-click=\"main.create();\">\n	<md-button  show-gt-xs class=\"md-fab md-accent md-fab-top-left fab-overlap md-button ng-scope md-blue-theme\" aria-label=\"Create a new  {{list.header}}\" ng-if=\"!list.no.add\">\n		<ng-md-icon icon=\"add\"></ng-md-icon>\n	</md-button>\n</a>\n<md-progress-linear md-mode=\"indeterminate\" ng-show=\"list.loading\"></md-progress-linear>\n\n <!-- Add div For infinite scroll -->\n <md-content class=\"scroll products\">\n	<md-card infinite-scroll=\'list.loadMore()\' infinite-scroll-disabled=\'list.busy\' infinite-scroll-distance=\'1\' ng-if=\"list.data.length\">\n		<md-toolbar class=\"md-table-toolbar md-default\" aria-hidden=\"false\"\n		ng-hide=\"list.selected.length || filter.show || list.data.search\">\n      <div class=\"md-toolbar-tools\">\n				<h2 class=\"md-title\">List of {{list.header | labelCase}}s</h2>\n			  <div flex></div>\n			  <md-button tabindex=\"0\" ng-click=\"filter.show = true;\" class=\"md-icon-button md-button md-default-theme\" ng-show=\"!list.no.filter\"\n				aria-label=\"Open filter box for {{list.header}}s table\">\n			    <ng-md-icon icon=\"filter_list\"></ng-md-icon>\n			  </md-button>\n				<md-menu md-position-mode=\"target-right target\" ng-if=\"!list.no.export\">\n	      <md-button aria-label=\"Open options menu\" class=\"md-icon-button\" ng-click=\"list.openMenu($mdOpenMenu, $event)\">\n	        <ng-md-icon icon=\"inbox\"></ng-md-icon>\n	      </md-button>\n	      <md-menu-content width=\"4\">\n	        <md-menu-item>\n	          <md-button\n							ng-click=\"list.exportData(\'xls\');\"\n							aria-label=\"Export {{list.header}}s table as Excel\">\n	            <ng-md-icon icon=\"receipt\"></ng-md-icon>\n	            Excel\n	          </md-button>\n	        </md-menu-item>\n					<md-menu-divider></md-menu-divider>\n	        <md-menu-item>\n	          <md-button ng-click=\"list.exportData(\'json\');\" aria-label=\"Export {{list.header}}s table in JSON format\">\n	            <ng-md-icon icon=\"account_balance_wallet\"></ng-md-icon>\n	            JSON\n	          </md-button>\n	        </md-menu-item>\n	        <md-menu-divider></md-menu-divider>\n	        <md-menu-item>\n	          <md-button ng-click=\"list.exportData(\'txt\');\" aria-label=\"Export {{list.header}}s table in Text format\">\n	            <ng-md-icon icon=\"text_format\"></ng-md-icon>\n	            Text\n	          </md-button>\n	        </md-menu-item>\n	        <md-menu-divider></md-menu-divider>\n\n	      </md-menu-content>\n	    </md-menu>\n      </div>\n    </md-toolbar>\n\n		<md-toolbar class=\"md-table-toolbar md-default\"\n			ng-show=\"filter.show || list.data.search\"\n			aria-hidden=\"false\">\n      <div class=\"md-toolbar-tools\">\n				<ng-md-icon icon=\"search\"></ng-md-icon>\n				<md-input-container flex class=\"mgt30\">\n		      <label>Filter {{list.header}}s</label>\n		      <input ng-model=\"list.data.search\" focus-me=\"filter.show\">\n		    </md-input-container>\n				<ng-md-icon icon=\"close\" ng-click=\"filter.show = false; list.data.search = \'\';\" class=\"link\"></ng-md-icon>\n			</div>\n		</md-toolbar>\n\n<div class=\"md-table-container\">\n	<table md-colresize=\"md-colresize\" class=\"md-table\" id=\"exportable\">\n		<thead>\n			<tr class=\"md-table-headers-row\">\n				<th class=\"md-table-header\"></th>\n				<th ng-repeat=\"h in list.cols track by $index\" class=\"md-table-header\">\n					<a href=\"#\" ng-click=\"reverse=!reverse;list.order(h.field)\" ng-if=\"!list.no.sort && !h.noSort\">\n						{{h.heading | labelCase}}\n<ng-md-icon 	icon=\"arrow_downward\"\n					options=\'{\"rotation\": \"counterclock\"}\'\n					ng-show=\"reverse && h.field === list.sort.predicate\"\n					class=\"s18\"></ng-md-icon>\n<ng-md-icon 	icon=\"arrow_upwards\"\n					ng-show=\"!reverse && h.field === list.sort.predicate\"\n					options=\'{\"rotation\": \"counterclock\"}\'></ng-md-icon>\n					</a>\n					<a href=\"#\" ng-if=\"list.no.sort || h.noSort\">\n						{{h.heading | labelCase}}\n					</a>\n				</th>\n				<th class=\"md-table-header\"></th>\n\n			</tr>\n\n		</thead>\n\n		<tbody>\n\n			<tr ng-repeat=\"p in filtered = ((list.data | orderBy:list.sort.predicate:list.sort.reverse) | filter:q | filter:list.data.search | limitTo: list.l) track by p._id\" id=\"{{p._id}}\"\n					class=\"md-table-content-row\"\n					ng-class=\"{\'selected\': list.isSelected(p)}\">\n				<td>\n					<md-button class=\"md-icon-button\" aria-label=\"More\" ng-click=\"list.showInDetails(p);\" ng-if=\"!list.no.edit\">\n	      	  <ng-md-icon icon=\"edit\"></ng-md-icon>\n	    	  </md-button>\n				</td>\n				<td>\n					<list-image ng-if=\"!p.logo.base64\" string=\"{{p.name}}\"></list-image>\n					<img ng-if=\"p.logo.base64\" data-ng-src=\"data:image/png;base64,{{p.logo.base64}}\" err-SRC=\"/assets/images/material-shop-e3ca5c21c4.jpg\" />\n				</td>\n				<td>\n					<a ng-click=\"list.gotoDetail(p)\">{{p.name}}</a>\n				</td>\n\n				<td>\n					<md-switch class=\"md-secondary\" ng-model=\"p.active\" ng-change=\"list.changeStatus(p)\" aria-label=\"p.active\"></md-switch>\n				</td>\n				<td>\n					<md-button class=\"md-icon-button\" aria-label=\"Delete\" ng-click=\"list.delete(p);\" ng-if=\"!list.no.delete\">\n	        	<ng-md-icon icon=\"delete\"></ng-md-icon>\n					</md-button>\n				</td>\n			</tr>\n		</tbody>\n\n	</table>\n</div>\n <div class=\"md-table-pagination\">\n		<span>Filtered {{filtered.length}} of {{list.data.length}} {{list.header}}s</span>\n	</div>\n</md-card>\n </md-content>\n\n<a ng-click=\"main.create();\" ng-if=\"!list.no.add\"> \n	<md-button hide-gt-xs ui-sref=\"list.create\" class=\"md-fab md-accent md-fab-bottom-left\" aria-label=\"Create a new {{list.header}}\" ng-if=\"!list.no.add\">\n		<ng-md-icon icon=\"add\"></ng-md-icon>\n	</md-button>\n</a>\n	<md-card ng-if=\"list.data.length===0 && !list.loading\">\n	  <md-card-content>\n	    <h2>No {{list.header | labelCase}}s found</h2>\n	    <p class=\"mgl\" hide-xs>\n				There are no {{list.header | labelCase}}s!\n	      <a ng-click=\"main.create();\" href=\"\">Create one!</a>\n	    </p>\n	    <p hide-gt-xs>\n				There are no {{list.header | labelCase}}s!\n	      <a ng-click=\"main.create();\" href=\"\">Create one!</a>\n	    </p>\n	  </md-card-content>\n	</md-card>\n");
$templateCache.put("app/product/main.html","<navbar leftmenu=\"true\"></navbar>\n<left-menu></left-menu>\n<md-content flex layout=\"column\" class=\"content\">\n<section layout=\"row\">\n\n		<div ui-view=\"content\" layout=\"column\" flex></div>\n\n		<md-content\n			ui-view=\"detail\"\n			id=\"detail-content\"\n			toggle-component\n			md-component-id=\"products.detailView\"\n			layout=\"column\"\n			flex-xs=\"100\"\n			flex-sm = \"90\"\n			flex-md=\"90\"\n			flex-lg=\"66\"\n			flex-gt-lg=\"66\"\n			class=\"md-whiteframe-z1\">\n		</md-content>\n</section>\n</md-content>\n<footer></footer>\n\n");
$templateCache.put("app/product/media-library.html","<md-dialog aria-label=\"Media Library\" ng-cloak flex=\"95\">\n  <md-toolbar class=\"md-warn\">\n    <div class=\"md-toolbar-tools\">\n      <h2>Media Library</h2>\n      <span flex></span>\n      <md-button class=\"md-icon-button\" ng-click=\"cancel()\">\n        <ng-md-icon icon=\"close\" aria-label=\"Close dialog\"></ng-md-icon>\n      </md-button>\n    </div>\n  </md-toolbar>\n\n  <md-dialog-content>\n      <div class=\"md-dialog-content\"  class=\"md-whiteframe-z2\">\n          <md-grid-list class=\"media-list\" md-cols-xs =\"3\" md-cols-sm=\"4\" md-cols-md=\"5\" md-cols-lg=\"7\" md-cols-gt-lg=\"10\" md-row-height-gt-md=\"1:1\" md-row-height=\"4:3\" md-gutter=\"12px\" md-gutter-gt-sm=\"8px\" layout=\"row\" layout-align=\"center center\">\n            <md-grid-tile ng-repeat=\"i in media\" class=\"md-whiteframe-z2\" ng-click=\"ok(i.path)\">\n          		<div class=\"thumbnail\">\n          				<img ng-src=\"{{i.path}}\" draggable=\"false\" alt=\"{{i.name}}\">\n          		</div>\n              <md-grid-tile-footer><h3>{{i.name}}</h3></md-grid-tile-footer>\n            </md-grid-tile>\n          </md-grid-list>\n    </div>\n  </md-dialog-content>\n  <md-dialog-actions layout=\"row\">\n    <span flex></span>\n    <md-button ng-click=\"addNewImage()\" class=\"md-warn md-raised\">\n     Add new Image\n    </md-button>\n  </md-dialog-actions>\n</md-dialog>\n");
$templateCache.put("app/product/product.html","<products api=\'product\' options=\'summary\' details=\'details\'></products>\n");
$templateCache.put("app/review/review.html","<crud-table api=\'review\' options=\'review.options\' sort=\"created\" noAdd noEdit noCopy></crud-table>\n\n");
$templateCache.put("app/reviews/reviews.html","<crud-table api=\'review\' options=\'reviews.options\' sort=\"created\"></crud-table>\n\n");
$templateCache.put("app/shipping/shipping.html","<crud-table api=\'shipping\' options=\'options\'></crud-table>\n");
$templateCache.put("app/statistic/statistic.html","<crud-table api=\'statistic\' options=\'options\'></crud-table>\n");
$templateCache.put("app/wish/wish.html","<navbar></navbar>\n<div layout=\"column\" layout-align=\"center center\">\n<div layout=\"column\" layout-align=\"center stretch\" flex-xs=\"100\" flex-gt-xs=\"75\" flex-gt-md=\"50\">\n<md-card ng-repeat=\"w in wish.wishes\" class=\"wishlist\" layout=\"row\" layout-align=\"space-between top\">\n    \n    <md-card-title>\n        <md-card-title-media>\n            <div class=\"md-media-lg card-media\">\n                <img src=\"{{w.variant.image}}\" alt=\"{{w.product.name}}\">\n            </div>\n        </md-card-title-media>\n        <md-card-title-text>\n            <div class=\"product-description\">\n                <h2 class=\"name\" ng-click=\"wish.gotoDetail(w)\">{{w.product.name}}</a></h2>\n                <md-divider></md-divider><br/>\n            </div>\n            <div layout=\"row\" class=\"wish-content\">\n                <div class=\"price\" flex=50>\n                    <div class=\"price\">Price: <span class=\"text-muted\">{{w.variant.price | currency : vm.Settings.currency.symbol}}</span></div>\n                    <del ng-if=\"w.variant.price!=w.variant.mrp\">\n                        MRP: {{w.variant.mrp | currency : vm.Settings.currency.symbol}}\n                    </del>   (Size: {{w.variant.size}})\n                    <br/>\n                    <div layout=\"row\" layout-align=\"start center\">    \n                        <cart-buttons pid= \"w.product._id\" variant=\"w.variant\" product=\"w.product\"></cart-buttons>\n                    </div>\n                </div>\n                <div flex>\n                    <div ng-if=\"w.product.keyFeatures.length>0\">\n                        <b>Key Features:</b>\n                        <ul>\n                            <li ng-repeat=\"k in w.product.keyFeatures\"><b>{{k.key}}</b> : {{k.val}}</li>\n                        </ul>\n                    </div>\n                </div>\n            </div>\n        </md-card-title-text>\n    </md-card-title>\n    <a aria-label=\"Remove {{w.product.name}} from wishlist\" ng-click=\"wish.remove(w)\">\n        <ng-md-icon icon=\"close\"></ng-md-icon>\n    </a>\n</md-card>\n</div>\n</div>\n<footer></footer>");
$templateCache.put("components/calendar/calendar.html","<script type=\"text/ng-template\" id=\"/modal.datepicker.html\">\n\n<md-dialog aria-label=\"\" class=\"md-datepicker\" ng-class=\"{ \'portrait\': !$mdMedia(\'gt-md\') }\">\n  <md-dialog-content layout=\"row\" layout-wrap>\n\n    <div layout=\"column\" layout-align=\"start center\">\n      <md-toolbar layout-align=\"center center\" class=\"md-datepicker-dow md-primary\"><span>{{ datepicker.currentMoment.format(\"dddd\") }}</span></md-toolbar>\n      <md-toolbar layout-align=\"center center\" class=\"md-datepicker-date md-hue-1 md-primary\" layout=\"column\">\n        <div class=\"md-datepicker-month\">{{ datepicker.currentMoment.format(\"MMM\") }}</div>\n        <div class=\"md-datepicker-day\">{{ datepicker.currentMoment.format(\"DD\") }}</div>\n        <md-select class=\"md-datepicker-year\" placeholder=\"{{ datepicker.currentMoment.format(\'YYYY\') }}\" ng-model=\"year\" ng-change=\"datepicker.setYear()\">\n          <md-option ng-value=\"year\" ng-repeat=\"year in yearsOptions\">{{ year }}</md-option>\n        </md-select>\n      </md-toolbar>\n    </div>\n\n    <div layout=\"column\" layout-align=\"start center\" class=\"md-datepicker-calendar\">\n      <div layout=\"row\" layout-align=\"space-between center\" class=\"md-datepicker-monthyear\">\n        <md-button aria-label=\"mese precedente\" class=\"md-icon-button\" ng-click=\"datepicker.prevMonth()\">\n          <ng-md-icon icon=\"chevron_left\"></ng-md-icon>\n        </md-button>\n        {{ datepicker.currentMoment.format(\"MMMM YYYY\") }}\n        <md-button aria-label=\"mese successivo\" class=\"md-icon-button\" ng-click=\"datepicker.nextMonth()\">\n          <ng-md-icon icon=\"chevron_right\"></ng-md-icon>\n        </md-button>\n      </div>\n      <div layout=\"row\" layout-align=\"space-around center\" class=\"md-datepicker-week-days\">\n        <div layout layout-align=\"center center\" ng-repeat=\"d in datepicker.weekDays track by $index\">{{ d }}</div>\n      </div>\n\n      <div layout=\"row\" layout-wrap class=\"md-datepicker-days\">\n        <div layout layout-align=\"center center\" ng-repeat-start=\"n in datepicker.getDaysInMonth() track by $index\">\n          <md-button aria-label=\"seleziona giorno\" ng-if=\"n !== false\" ng-class=\"{\'md-accent\': datepicker.currentMoment.date() == n}\" ng-click=\"datepicker.selectDate(n)\">{{ n }}</md-button>\n        </div>\n        <div flex ng-if=\"($index + 1) % 7 == 0\" ng-repeat-end></div>\n      </div>\n    </div>\n  </md-dialog-content>\n  <div class=\"md-actions\" layout=\"row\">\n    <md-button ng-click=\"datepicker.cancel()\" aria-label=\"cancel\">Cancel</md-button>\n    <md-button ng-click=\"datepicker.confirm()\" aria-label=\"ok\">Select</md-button>\n  </div>\n</md-dialog>\n</script>\n");
$templateCache.put("components/crud-table/detail.html","<md-toolbar class=\"md-hue-1\" id=\"user-detail-toolbar\">\n	<span layout=\"row\" layout-align=\"space-between\" class=\"md-toolbar-tools md-toolbar-tools-top\">\n		<md-button ng-click=\"detail.goBack();\" aria-label=\"Close detail view\">\n			<ng-md-icon icon=\"close\" aria-label=\"Close dialog\"></ng-md-icon>\n		</md-button>\n		<h3>Edit {{detail.header | labelCase}} - {{detail.item._id}}</h3>\n		<md-button aria-label=\"-\">\n		</md-button>\n	</span>\n</md-toolbar>\n<md-content class=\"md-padding\" flex id=\"user-detail-content\">\n	<section class=\"section\" layout=\"column\">\n\n		<span class=\"section-title\">Edit</span>\n\n<form name=\"detailForm\" layout=\"column\" layout-fill layout-align=\"space-between\" ng-submit=\"detail.edit(detail.item);detail.goBack();\" novalidate autocomplete=\"off\">\n		<span layout=\"row\" layout-sm=\"column\" ng-repeat=\"i in detail.columns\" ng-if=\"detail.columns\" ng-switch=\"i.dataType\">\n\n			<md-input-container flex ng-switch-when=\"parseFloat\">\n				<label>{{i.heading | labelCase}}</label>\n				<input name=\"{{i.field}}\" ng-model=\"detail.item[i.field]\" ng-disabled=\"i.noEdit\" only-numbers md-autofocus=\"$index === 0\">\n			</md-input-container>\n\n			<md-input-container md-no-float class=\"md-block\" flex ng-switch-when=\"image\">\n				<label>{{i.heading | labelCase}} URL</label>\n				<input name=\"{{i.field}}\" ng-model=\"detail.item[i.field]\" ng-disabled=\"i.noEdit\" md-autofocus=\"$index === 0\">\n				<ng-md-icon icon=\"insert_photo\" ng-click=\"detail.mediaLibrary()\"></ng-md-icon>\n			</md-input-container>\n\n			<md-input-container flex ng-switch-when=\"boolean\">\n				<section class=\"section slim\" layout=\"column\">\n					<span layout=\"row\" layout-align=\"start center\">\n						<span flex=\"33\"><label>{{i.heading | labelCase}}</label></span>\n						<md-switch name=\"{{i.field}}\" aria-label=\"active\" ng-model=\"detail.item[i.field]\"\n						ng-disabled=\"i.noEdit\"></md-switch>\n					</span>\n				</section>\n				<span flex=\"33\"></span>\n			</md-input-container>\n			<md-input-container flex ng-switch-when=\"date\">\n				<label>{{i.heading | labelCase}}</label>\n				<input name=\"{{i.field}}\" ng-model=\"detail.item[i.field]\" type=\'calendar\' ng-disabled=\"i.noEdit\"/>\n\n			</md-input-container>\n\n			<md-input-container flex ng-switch-when=\"dropdown\" class=\"dropdown\">\n        <label>{{i.heading | labelCase}}</label>\n        <md-select ng-model=\"detail.item[i.field]\">\n          <md-option ng-repeat=\"o in i.options\" value=\"{{o}}\">\n            {{o}}\n          </md-option>\n        </md-select>\n      </md-input-container>\n\n			<md-input-container flex ng-switch-when=\"textarea\">\n        <label>{{i.heading | labelCase}}</label>\n        <textarea name=\"{{i.field}}\" ng-model=\"detail.item[i.field]\" ng-disabled=\"i.field==\'_id\' || i.noEdit\" md-autofocus=\"$index === 0\"></textarea>\n      </md-input-container>\n\n			<md-input-container flex ng-switch-default>\n				<label>{{i.heading | labelCase}}</label>\n				<input name=\"{{i.field}}\" ng-model=\"detail.item[i.field]\" ng-disabled=\"i.field==\'_id\' || i.noEdit\" md-autofocus=\"$index === 0\">\n			</md-input-container>\n\n		</span>\n\n		<md-dialog-actions layout=\"row\">\n			<span flex></span>\n			<md-button ng-disabled=\"detailForm.$invalid\" type=\"submit\" class=\"md-primary md-raised\" aria-label=\"Save changes\">Save</md-button>\n		</md-dialog-actions>\n		</form>\n\n	</section>\n\n	<section class=\"section\" layout=\"column\" ng-hide=\"detail.isRoot\">\n\n		<span class=\"section-title\">Record Information</span>\n		<span layout=\"row\" layout-sm=\"column\" class=\"detail-info\">\n			<span flex=\"45\">Modified</span>\n			<span flex ng-show=\"detail.item.updatedAt\" class=\"subtitle\">\n				<span am-time-ago=\"detail.item.updatedAt\"></span>\n				<md-tooltip>{{detail.item.updatedAt | date:\'dd. MMMM yyyy H:mm\'}}</md-tooltip>\n				{{detail.item.modifiedBy && \'by \' + detail.item.modifiedBy}}\n			</span>\n		</span>\n\n		<span layout=\"row\" layout-sm=\"column\" class=\"detail-info\">\n			<span flex=\"45\">Created</span>\n			<span flex ng-show=\"detail.item.createdAt\" class=\"subtitle\">{{detail.item.createdAt | date:\'dd. MMMM yyyy H:mm\'}}</span>\n		</span>\n\n	</section>\n\n</md-content>\n");
$templateCache.put("components/crud-table/list.html","<a ng-click=\"main.create();\">\n	<md-button  show-gt-xs class=\"md-fab md-accent md-fab-top-left fab-overlap md-button ng-scope md-blue-theme\" aria-label=\"Create a new  {{list.header}}\" ng-if=\"!list.no.add\">\n		<md-tooltip>Add new {{list.header | labelCase}}</md-tooltip>\n        <ng-md-icon icon=\"add\"></ng-md-icon>\n	</md-button>\n</a>\n<md-progress-linear md-mode=\"indeterminate\" ng-show=\"list.loading\"></md-progress-linear>\n\n <!-- Add div For infinite scroll -->\n	<md-card infinite-scroll=\'list.loadMore()\' infinite-scroll-disabled=\'list.busy\' infinite-scroll-distance=\'1\' ng-if=\"list.data.length\">\n		<md-toolbar class=\"md-table-toolbar md-default\" aria-hidden=\"false\"\n		ng-hide=\"list.selected.length || filter.show || list.data.search\">\n      <div class=\"md-toolbar-tools\">\n				<h2 class=\"md-title\">List of {{list.header | labelCase | pluralize}}</h2>\n			  <div flex></div>\n			  <md-button tabindex=\"0\" ng-click=\"filter.show = true;\" class=\"md-icon-button md-button md-default-theme\" ng-show=\"!list.no.filter\"\n				aria-label=\"Open filter box for {{list.header | labelCase  | pluralize}} table\">\n		        <md-tooltip md-direction=\"left\">Filter {{list.header | labelCase | pluralize}}</md-tooltip>\n			    <ng-md-icon icon=\"filter_list\"></ng-md-icon>\n			  </md-button>\n				<md-menu md-position-mode=\"target-right target\" ng-if=\"!list.no.export\">\n	      <md-button aria-label=\"Open options menu\" class=\"md-icon-button\" ng-click=\"list.openMenu($mdOpenMenu, $event)\">\n		    <md-tooltip md-direction=\"left\">Export all {{list.header | labelCase | pluralize}}</md-tooltip>\n	        <ng-md-icon icon=\"inbox\"></ng-md-icon>\n	      </md-button>\n	      <md-menu-content width=\"4\">\n	        <md-menu-item>\n	          <md-button\n							ng-click=\"list.exportData(\'xls\');\"\n							aria-label=\"Export {{list.header | labelCase  | pluralize}} table as Excel\">\n	            <ng-md-icon icon=\"receipt\"></ng-md-icon>\n	            Excel\n	          </md-button>\n	        </md-menu-item>\n					<md-menu-divider></md-menu-divider>\n	        <md-menu-item>\n	          <md-button ng-click=\"list.exportData(\'json\');\" aria-label=\"Export {{list.header | labelCase  | pluralize}} table in JSON format\">\n	            <ng-md-icon icon=\"account_balance_wallet\"></ng-md-icon>\n	            JSON\n	          </md-button>\n	        </md-menu-item>\n	        <md-menu-divider></md-menu-divider>\n	        <md-menu-item>\n	          <md-button ng-click=\"list.exportData(\'txt\');\" aria-label=\"Export {{list.header | labelCase  | pluralize}} table in Text format\">\n	            <ng-md-icon icon=\"text_format\"></ng-md-icon>\n	            Text\n	          </md-button>\n	        </md-menu-item>\n	        <md-menu-divider></md-menu-divider>\n\n	      </md-menu-content>\n	    </md-menu>\n      </div>\n    </md-toolbar>\n\n		<md-toolbar class=\"md-table-toolbar md-default\"\n			ng-show=\"filter.show || list.data.search\"\n			aria-hidden=\"false\">\n      <div class=\"md-toolbar-tools\">\n				<ng-md-icon icon=\"search\"></ng-md-icon>\n				<md-input-container flex class=\"mgt30\">\n		      <label>Filter {{list.header | labelCase  | pluralize}}</label>\n		      <input ng-model=\"list.data.search\" focus-me=\"filter.show\">\n		    </md-input-container>\n				<ng-md-icon icon=\"close\" ng-click=\"filter.show = false; list.data.search = \'\';\" class=\"link\"></ng-md-icon>\n			</div>\n		</md-toolbar>\n\n<div class=\"md-table-container\">\n	<table md-colresize=\"md-colresize\" class=\"md-table\" id=\"exportable\">\n		<thead>\n			<tr class=\"md-table-headers-row\">\n				<th class=\"md-table-header\"></th>\n				<th ng-repeat=\"h in list.cols track by $index\" class=\"md-table-header\">\n					<a href=\"#\" ng-click=\"reverse=!reverse;list.order(h.field)\" ng-if=\"!list.no.sort && !h.noSort\">\n						{{h.heading | labelCase}}\n		    <md-tooltip md-direction=\"top\">Sort by {{h.field | labelCase | pluralize}}</md-tooltip>\n<ng-md-icon 	icon=\"arrow_downward\"\n					options=\'{\"rotation\": \"counterclock\"}\'\n					ng-show=\"reverse && h.field === list.sort.predicate\"\n					class=\"s18\"></ng-md-icon>\n<ng-md-icon 	icon=\"arrow_upwards\"\n					ng-show=\"!reverse && h.field === list.sort.predicate\"\n					options=\'{\"rotation\": \"counterclock\"}\'></ng-md-icon>\n					</a>\n					<a href=\"#\" ng-if=\"list.no.sort || h.noSort\">\n						{{h.heading | labelCase}}\n					</a>\n				</th>\n				<th class=\"md-table-header\"></th>\n				<th class=\"md-table-header\"></th>\n\n			</tr>\n\n		</thead>\n\n		<tbody>\n\n			<tr ng-repeat=\"p in filtered = ((list.data | orderBy:list.sort.predicate:list.sort.reverse) | filter:q | filter:list.data.search | limitTo: list.l) track by p._id\" id=\"{{p._id}}\"\n					class=\"md-table-content-row\"\n					ng-class=\"{\'selected\': list.isSelected(p)}\">\n				<td>\n                    <md-button class=\"md-icon-button\" aria-label=\"More\" ng-click=\"list.showInDetails(p);\" ng-if=\"!list.no.edit\">\n                            <md-tooltip>Edit {{list.header | labelCase}} info</md-tooltip>\n                            <ng-md-icon icon=\"edit\"></ng-md-icon>\n                    </md-button>\n				</td>\n				<td ng-repeat=\"c in list.cols track by $index\" ng-switch=\"c.dataType\">\n					{{c.sort}}\n				<span ng-switch-when=\"boolean\">\n					<md-switch class=\"md-secondary\" ng-model=\"p[c.field]\" ng-change=\"list.changeStatus(p)\" aria-label=\"p[c.field]\"></md-switch>\n				</span>\n				<span ng-switch-when=\"date\">\n					{{p[c.field] | date:\'mediumDate\'}}\n				</span>\n				<span ng-switch-when=\"currency\">\n					{{p[c.field] | currency}}\n				</span>\n				<span ng-switch-when=\"image\">\n					<span ng-if=\"!p[c.field]\"><list-image string=\"{{p.name}}\"></list-image></span>\n					<img ng-if=\"p[c.field]\" ng-src=\"{{p[c.field]}}\" err-SRC=\"/assets/images/material-shop-e3ca5c21c4.jpg\" />\n				</span>\n				<span ng-switch-default>\n					{{p[c.field]}}\n				</span>\n			</td>\n\n				<td></td>\n				<td>\n          <md-button class=\"md-icon-button\" aria-label=\"Copy Record\" ng-click=\"list.copy(p);\" ng-if=\"!list.no.copy\">\n          <md-tooltip>Duplicate this {{list.header | labelCase}}</md-tooltip>\n              <ng-md-icon icon=\"content_copy\"></ng-md-icon>\n					</md-button>\n					<md-button class=\"md-icon-button\" aria-label=\"Delete\" ng-click=\"list.delete(p);\" ng-if=\"!list.no.delete\">\n	        	      <md-tooltip>Delete this {{list.header | labelCase}}</md-tooltip>\n                      <ng-md-icon icon=\"delete\"></ng-md-icon>\n					</md-button>\n			</td>\n			</tr>\n		</tbody>\n\n	</table>\n</div>\n <div class=\"md-table-pagination\">\n		<span>Found {{filtered.length}} of {{list.data.length}} {{list.header | labelCase  | pluralize}}</span>\n	</div>\n</md-card>\n<a ng-click=\"main.create();\" ng-if=\"!list.no.add\">\n	<md-button hide-gt-xs ui-sref=\"list.create\" class=\"md-fab md-accent md-fab-bottom-right\" aria-label=\"Create a new {{list.header}}\" ng-if=\"!list.no.add\">\n		<md-tooltip md-direction=\"left\">Add new {{list.header | labelCase}}</md-tooltip>\n		<ng-md-icon icon=\"add\"></ng-md-icon>\n	</md-button>\n</a>\n	<md-card ng-if=\"list.data.length===0 && !list.loading\">\n	  <md-card-content>\n	    <h2>No {{list.header | labelCase}} found</h2>\n	    <p class=\"mgl\" hide-xs ng-if=\"!list.no.add\">\n				There is no {{list.header | labelCase}}!\n	      <a ng-click=\"main.create();\" href=\"\">Create one!</a>\n	    </p>\n	    <p hide-gt-xs ng-if=\"!list.no.add\">\n				There is no {{list.header | labelCase}}!\n	      <a ng-click=\"main.create();\" href=\"\">Create one!</a>\n	    </p>\n	  </md-card-content>\n	</md-card>\n");
$templateCache.put("components/crud-table/main.html","<navbar leftmenu=\"true\"></navbar>\n<left-menu></left-menu>\n<md-content flex layout=\"column\">\n<section layout=\"row\" layout-fill flex>\n\n		<div ui-view=\"content\" layout=\"column\" flex></div>\n\n		<md-content\n			ui-view=\"detail\"\n			id=\"detail-content\"\n			toggle-component\n			md-component-id=\"crud-table.detailView\"\n			layout=\"column\"\n			flex-xs=\"100\"\n			flex-sm = \"50\"\n			flex-md=\"50\"\n			flex-lg=\"33\"\n			flex-gt-lg=\"33\"\n			class=\"md-whiteframe-z1\">\n		</md-content>\n</section>\n\n</md-content>\n<footer></footer>\n");
$templateCache.put("components/crud-table/media-library.html","<md-dialog aria-label=\"Media Library\" ng-cloak flex=\"95\">\n  <md-toolbar class=\"md-warn\">\n    <div class=\"md-toolbar-tools\">\n      <h2>Media Library</h2>\n      <span flex></span>\n      <md-button class=\"md-icon-button\" ng-click=\"cancel()\">\n        <ng-md-icon icon=\"close\" aria-label=\"Close dialog\"></ng-md-icon>\n      </md-button>\n    </div>\n  </md-toolbar>\n\n  <md-dialog-content>\n      <div class=\"md-dialog-content\"  class=\"md-whiteframe-z2\">\n          <md-grid-list class=\"media-list\" md-cols-xs =\"3\" md-cols-sm=\"4\" md-cols-md=\"5\" md-cols-lg=\"7\" md-cols-gt-lg=\"10\" md-row-height-gt-md=\"1:1\" md-row-height=\"4:3\" md-gutter=\"12px\" md-gutter-gt-sm=\"8px\" layout=\"row\" layout-align=\"center center\">\n            <md-grid-tile ng-repeat=\"i in media\" class=\"md-whiteframe-z2\" ng-click=\"ok(i.path)\">\n          		<div class=\"thumbnail\">\n          				<img ng-src=\"{{i.path}}\" draggable=\"false\" alt=\"{{i.name}}\">\n          		</div>\n              <md-grid-tile-footer><h3>{{i.name}}</h3></md-grid-tile-footer>\n            </md-grid-tile>\n          </md-grid-list>\n    </div>\n  </md-dialog-content>\n  <md-dialog-actions layout=\"row\">\n    <span flex></span>\n    <md-button ng-click=\"addNewImage()\" class=\"md-warn md-raised\">\n     Add new Image\n    </md-button>\n  </md-dialog-actions>\n</md-dialog>\n");
$templateCache.put("components/footer/contact-form.html","<div layout=\"row\">\n<md-content flex layout=\"column\">\n<section layout=\"column\" flex layout-align=\"center center\">\n  <h1>Write to us</h1>\n  <form name=\"form\" ng-submit=\"send(contact)\" novalidate>\n  <section class=\"section\" layout=\"column\">\n    <md-input-container md-is-error=\"(form.message.$error.required || form.message.$error.message) && form.message.$dirty\">\n      <label>Message</label>\n      <textarea name=\"contact\" ng-model=\"contact.message\" required md-autofocus></textarea>\n      <div ng-messages=\"form.message.$error\" ng-if=\"form.message.$dirty\">\n        <div ng-message=\"required\">Message required</div>\n      </div>\n    </md-input-container>\n  </section>\n  <div class=\"md-dialog-actions\" layout=\"row\">\n    <md-button type=\"submit\" class=\"md-raised circular-progress-button md-primary\" ng-disabled=\"!form.$valid || vm.loading\" aria-label=\"Send Message\">\n      <span ng-show=\"!vm.loading\"><ng-md-icon icon=\"send\"></ng-md-icon>Send</span>\n      <md-progress-circular md-mode=\"indeterminate\" md-diameter=\"25\" ng-show=\"vm.loading\" class=\"md-accent md-hue-1\"></md-progress-circular><span ng-show=\"vm.loading\">Loading...</span>\n    </md-button>\n    <md-button class=\"btn btn-default btn-lg btn-register\" ng-click=\"cancel()\" aria-label=\"Cancel Send\"> Cancel </md-button>\n  </div>\n  </form>\n</section>\n</md-content>\n</div>\n");
$templateCache.put("components/footer/footer.html","<div  id=\"top\">\n<div class=\"footer site-footer\" >\n\n	<div  class=\"row\" style=\"padding-left:50px;padding-right: 50px\">\n		\n        	<div  class=\"col-xs-3 stats-graph\">\n        \n               <ul class=\"gd_col fw-1-5 md-1-1\">\n                <li>\n               &nbsp;\n              </li>\n              <li>\n                <a class=\"no-ajax ssl-radio-keepalive\" ng-click=\"topmenu.showLogin()\" ng-if=\"!topmenu.isLoggedIn()\" style=\"color:#fff\">Sign in</a>\n              </li>\n              <li>\n                <a class=\"no-ajax ssl-radio-keepalive\" href=\"/subscribe/\">Subscribe to our newsletter</a>\n              </li>\n              <li>\n                <a href=\"/about/jobs/\">Jobs</a>\n              </li>\n              <li>\n                <a href=\"/index\">About Us</a>\n              </li>\n                   \n                                  \n                                 \n                                \n    	</div>\n    	<div  class=\"col-xs-3 stats-graph\">\n        \n                \n               <ul class=\"gd_col fw-1-5 md-1-1\">\n          		 <li>\n               &nbsp;\n              </li>\n              <li>\n                <a href=\"/index/faq\">FAQs</a>\n              </li>\n              <li>\n                <a href=\"/contributors\">Verified Publishers</a>\n              </li>\n              <li>\n                <a href=\"/about/cookie-policy\">Cookie Policy</a>\n              </li>\n              <li>\n                <a href=\"/index/terms\">Terms &amp; Conditions</a>\n              </li>\n              <li>\n                <a href=\"/site-map/\">Site Map</a>\n              </li>\n            </ul>                          \n                                  \n                                 \n                                \n    	</div>\n\n    	<div  class=\"col-xs-3 stats-graph\">\n    	<h4>Find Us</h4>\n        	<address>8 Impala Road <br>Borrowdale West <br>Harare<br>Zimbabwe</address>    \n                                  \n                                 \n                                \n    	</div>\n\n\n    	<div  class=\"col-xs-3 stats-graph\">\n    	<h4>Contact Us</h4>\n        	<i>Phone:+263773 4392 46</i>   <br> \n        	<i>Email: info@mediabox.co.zw</i>  <br> \n        	<i> <a ng-click=\"addDialog()\" href=\"#\">Quick Contact</a></div></i>\n                                  \n                                 \n                                \n    	</div>\n\n		\n	</div>\n\n\n  <div class=\"footer-content\" layout=\"row\" layout-align=\"center center\">\n    <div layout-align=\"start center\">© 2016 <strong>MediaBox </strong>  <a href=\"\" target=\"_blank\"></a> \n    |\n  </div>\n</div>\n<!--Container for md-toast-->\n<div class=\"fixed-bottom\"> <div class=\"toast-container\" ng-if=\"screenIsBig\">&nbsp;</div> </div>\n</div>");
$templateCache.put("components/left-menu/left-menu.html","<md-sidenav layout=\"column\" class=\"md-sidenav-left md-whiteframe-z2\" md-component-id=\"left\" ng-cloak ng-if=\"nav.isLoggedIn()\">\n  <!-- md-is-locked-open=\"$mdMedia(\'gt-md\')\" -->\n      <md-toolbar class=\"md-tall md-hue-2 md-whiteframe-z2\">\n        <span flex></span>\n        <md-list>\n          <md-list-item class=\"md-2-line md-toolbar-tools-bottom\">\n            <user-avatar></user-avatar>\n            <div class=\"md-list-item-text\" layout=\"column\">\n              <span></span>\n              <div>{{left.currentUser.name}}</div>\n              <div>{{left.currentUser.email}}</div>\n            </div>\n          </md-list-item>\n        </md-list>\n      </md-toolbar>\n      <md-list>\n      </md-toolbar>\n      <md-list ng-if=\"left.menu\">\n      <md-item ng-repeat=\"item in left.menu.auth\" ui-sref-active=\"active\" ng-if=\"!left.isLoggedIn()\" ui-sref=\"{{item.url}}\" ng-click=\"left.toggleLeft();\" class=\" md-whiteframe-z2\">\n          <md-item-content md-ink-ripple layout=\"row\" layout-align=\"start center\" >\n            <div class=\"inset\">\n              <ng-md-icon icon=\"{{item.icon}}\"></ng-md-icon>\n            </div>\n            <div class=\"inset\">{{item.text}}</div>\n          </md-item-content>\n        <md-divider ng-if=\"!$last\"></md-divider>\n      </md-item>\n\n<!-- User Pages -->\n      <md-subheader ng-if=\"left.isLoggedIn()\">Pages</md-subheader>\n      <md-item ng-repeat=\"item in left.menu.pages\" ui-sref-active=\"active\" ng-if=\"left.isLoggedIn() && item.authenticate && left.hasRole(item.role)\" ui-sref=\"{{item.url}}\" class=\" md-whiteframe-z2\">\n          <md-item-content md-ink-ripple layout=\"row\" layout-align=\"start center\" >\n            <md-button>\n                <ng-md-icon icon=\"{{item.icon}}\"></ng-md-icon>\n                {{item.text}}\n            </md-button>\n          </md-item-content>\n        <md-divider ng-if=\"!$last || !$first\"></md-divider>\n      </md-item>\n\n<!-- Public Pages -->\n      <md-item ng-repeat=\"item in left.menu.pages\" ui-sref-active=\"active\" ng-if=\"!item.authenticate\" ui-sref=\"{{item.url}}\" class=\" md-whiteframe-z2\">\n          <md-item-content md-ink-ripple layout=\"row\" layout-align=\"start center\" >\n            <md-button>\n                <ng-md-icon icon=\"{{item.icon}}\"></ng-md-icon>\n                {{item.text}}\n            </md-button>\n          </md-item-content>\n        <md-divider ng-if=\"!$last || !$first\"></md-divider>\n      </md-item>\n\n      <md-subheader ng-if=\"left.isLoggedIn()\">Settings</md-subheader>\n      <md-item ng-repeat=\"item in left.menu.admin\" ui-sref-active=\"active\" ng-if=\"left.isLoggedIn()\" ui-sref=\"{{item.url}}\">\n          <md-item-content md-ink-ripple layout=\"row\" layout-align=\"start center\" >\n            <div class=\"inset\">\n              <ng-md-icon icon=\"{{item.icon}}\"></ng-md-icon>\n            </div>\n            <div class=\"inset\">{{item.text}}</div>\n          </md-item-content>\n        <md-divider ng-if=\"!$last\"></md-divider>\n      </md-item>\n    </md-list>\n    </md-sidenav>\n");
$templateCache.put("components/login-modal/cp.html","<md-dialog aria-label=\"Create a new user\" id=\"admin-user-create\" layout=\"column\" \nflex-xs=\"100\" \nflex-sm = \"75\" \nflex-md=\"50\" \nflex-lg=\"33\" \nflex-gt-lg=\"25\" \nmd-whiteframe=\"24\">\n    <md-toolbar class=\"md-accent\" layout=\"row\" layout-align=\"space-between center\">\n      <h3 class=\"md-toolbar-tools\">Change Password</h3>\n        <md-button class=\"md-icon-button\" ng-click=\"cp.close()\" aria-label=\"Close Change Password\"><ng-md-icon icon=\"close\" aria-label=\"Close dialog\"></ng-md-icon></md-button>\n    </md-toolbar>\n<md-content flex layout=\"row\" class=\"content\" layout-align=\"start center\">\n<section layout=\"column\" layout-align=\"start center\" flex>\n	<form name=\"form\" ng-submit=\"cp.changePassword(form)\" novalidate autocomplete=\"off\">\n		<section class=\"section\" layout=\"column\">\n			<md-input-container md-is-error=\"form.password.$error.required && form.password.$dirty\">\n				<label>Current Password</label>\n				<input name=\"password\" type=\"password\" ng-model=\"cp.user.oldPassword\" required md-autofocus mongoose-error ng-minlength=\"3\"/>\n				<div ng-messages=\"form.password.$error\" ng-if=\"form.password.$dirty\">\n					<div ng-message=\"required\">Password is required</div>\n					<div ng-message=\"mongoose\">Password is incorrect</div>\n					<div ng-message=\"minlength\">Password must be at least 3 characters.</div>\n				</div>\n			</md-input-container>\n\n			<md-input-container flex class=\"last\">\n				<label>New Password</label>\n				<input name=\"newPassword\" type=\"password\"  ng-model=\"cp.user.newPassword\" required ng-minlength=\"3\">\n				<div ng-messages=\"form.newPassword.$error\" ng-if=\"form.newPassword.$dirty\">\n					<div ng-message=\"required\">Please repeat the new password</div>\n					<div ng-message=\"minlength\">Password must be at least 3 characters.</div>\n				</div>\n			</md-input-container>\n\n			<p class=\"help-block\" ng-if=\"cp.submitted\"> {{cp.message}} </p>\n		</section>\n		<md-dialog-actions>\n			<submit-button loading=\"vm.loading\" form=\"form\" text=\"Change Password\"></submit-button>\n		</md-dialog-actions>\n\n	</form>\n  </section>\n </md-content>\n</md-dialog>");
$templateCache.put("components/login-modal/index.html","<md-dialog aria-label=\"Create a new user\" id=\"admin-user-create\" layout=\"column\" \nflex-xs=\"100\" \nflex-sm = \"75\" \nflex-md=\"75\" \nflex-lg=\"66\" \nflex-gt-lg=\"50\" \nmd-whiteframe=\"24\">\n<div ng-cloak ng-controller=\"tabsCtrl as tabs\">\n  <md-content layout=\"row\" layout-align=\"end start\">\n    <md-tabs md-dynamic-height md-border-bottom flex md-selected=\"selectedIndex\">\n      <md-tab label=\"Login\" ng-click=\"tabs.onTabSelected(\'login\')\">\n        <md-content ng-controller=\"LoginModalController as vm\" ng-include=\"\'components/login-modal/login.html\'\" class=\"md-padding\" flex></md-content>\n      </md-tab>\n      <md-tab label=\"Signup\" ng-click=\"tabs.onTabSelected(\'signup\')\">\n        <md-content ng-controller=\"SignUpModalController as signup\" class=\"md-padding\" flex> \n          <div ng-if=\"tabs.tab==\'signup\'\" ng-include=\"\'components/login-modal/signup.html\'\"></div>\n        </md-content>\n      </md-tab>\n      <md-tab></md-tab> <!--This is necessary to maintain the Login and Signup alignment-->\n    </md-tabs>\n    <a aria-label=\"Cancel Login\" ng-click=\"vm.close()\" ng-controller=\"LoginModalController as vm\">\n        <ng-md-icon icon=\"close\" aria-label=\"Close dialog\"></ng-md-icon>\n    </a>\n  </md-content>\n</div>\n<oauth-buttons></oauth-buttons>\n</md-dialog>");
$templateCache.put("components/login-modal/login.html","<section layout=\"column\" layout-align=\"start center\">\n	\n  <div class=\"row\">\n    <div class=\"col-md-6\">\n      <div class=\"box\">\n       <p class=\"lead\">Already our customer?</p>\n            <p class=\"text-muted\" translate>\n              Be a master of effiency with the all in one platform for all your advertising content.\n              </p>\n            </p>\n      </div>\n    </div>\n\n    \n    <div class=\"col-md-6\">\n        <div style=\"width: 80%\">\n\n           <p ng-show=\"vm.error\" class=\"md-warn\">{{vm.error.message}}</p>\n\n				<form name=\"form\" ng-submit=\"vm.login(form)\" autocomplete=\"off\" novalidate flex>\n				<section class=\"section\" layout=\"column\">\n					<md-input-container md-is-error=\"(form.email.$error.required || form.email.$error.email) && form.email.$dirty\">\n						<label>Email</label>\n						<input name=\"email\" type=\"email\" ng-model=\"vm.user.email\" required md-autofocus/>\n						<div ng-messages=\"form.email.$error\" ng-if=\"form.email.$dirty\">\n							<div ng-message=\"required\">Email ID is required</div>\n							<div ng-message=\"email\">Please enter valid email address.</div>\n						</div>\n					</md-input-container>\n\n					<md-input-container md-is-error=\"form.password.$error.required && form.password.$dirty\">\n						<label>Password</label>\n						<input name=\"password\" type=\"password\" ng-model=\"vm.user.password\" required/>\n						<div ng-messages=\"form.password.$error\">\n							<div ng-message=\"required\">Password is required</div>\n							\n						</div>\n					</md-input-container>\n\n			    <div class=\"form-group has-error\">\n			    <p class=\"help-block\" ng-show=\"form.email.$error.required && form.password.$error.required && vm.submitted\">\n			       Please enter your email and password.\n			    </p>\n\n			    </div>\n			</section>\n\n			<submit-button loading=\"vm.loading\" form=\"form\" text=\"Secure Login\"></submit-button>\n			<div class=\"err\">{{ vm.errors.other }}<br/>\n			+<a ng-click=\"vm.goForgot({ email: vm.user.email})\" href=\"#\">Forgot Password</a></div>\n				\n	</form>\n        </div>\n    </div>\n    \n  </div>\n\n</section>\n");
$templateCache.put("components/login-modal/signup.html","<section layout=\"column\" layout-align=\"start center\">\n	\n  <div class=\"row\">\n    <div class=\"col-md-6\">\n      <div class=\"box\">\n       <p class=\"lead\">Already our customer?</p>\n            <p class=\"text-muted\" translate>\n              Be a master of effiency with the all in one platform for all your advertising content.\n              </p>\n            </p>\n      </div>\n    </div>\n\n    \n    <div class=\"col-md-6\">\n        <div style=\"width: 80%\">\n<form name=\"form\" ng-submit=\"signup.register(form)\" autocomplete=\"off\" novalidate flex>\n\n			<section class=\"section\" layout=\"column\">\n				<md-input-container md-is-error=\"form.name.$error.required && form.name.$dirty\">\n					<label>Full Name</label>\n					<input name=\"name\" ng-model=\"signup.user.name\" required md-autofocus/>\n					<div ng-messages=\"form.name.$error\" ng-if=\"form.name.$dirty\">\n						<div ng-message=\"required\">Full Name is required</div>\n					</div>\n				</md-input-container>\n\n				<md-input-container flex md-is-error=\"(form.email.$error.email || form.email.$error.required || form.email.$error.mongoose || form.email.$error.remote-unique) && form.email.$dirty\">\n					<label>Email ID</label>\n					<input type=\"email\" name=\"email\" ng-model=\"signup.user.email\"\n								 ng-model-options=\"{updateOn: \'default blur\', debounce: {\'default\': 500, \'blur\': 0}}\"\n								 required mongoose-error>\n					<div ng-messages=\"form.email.$error\" ng-if=\"form.email.$dirty\">\n						<div ng-message=\"email\">Please enter a valid email address.</div>\n						<div ng-message=\"required\">Email is required</div>\n						<div ng-message=\"mongoose\">Email already in use</div>\n					</div>\n				</md-input-container>\n\n				<md-input-container md-is-error=\"form.phone.$error.required && form.phone.$dirty\">\n					<label>Phone</label>\n					<input name=\"phone\" ng-model=\"signup.user.phone\" required md-autofocus/>\n					<div ng-messages=\"form.phone.$error\" ng-if=\"form.phone.$dirty\">\n						<div ng-message=\"required\">Phone is required</div>\n					</div>\n				</md-input-container>\n\n				<md-input-container md-is-error=\"form.company.$error.required && form.company.$dirty\">\n					<label>Company</label>\n					<input name=\"company\" ng-model=\"signup.user.company\" required md-autofocus/>\n					<div ng-messages=\"form.company.$error\" ng-if=\"form.company.$dirty\">\n						<div ng-message=\"required\">Company is required</div>\n					</div>\n				</md-input-container>\n\n				<md-input-container md-is-error=\"form.website.$error.required && form.website.$dirty\">\n					<label>Website</label>\n					<input name=\"website\" ng-model=\"signup.user.website\" required md-autofocus/>\n					<div ng-messages=\"form.website.$error\" ng-if=\"form.website.$dirty\">\n						<div ng-message=\"required\">Website is required</div>\n					</div>\n				</md-input-container>\n				<md-input-container md-is-error=\"form.website.$error.required && form.website.$dirty\">\n				<md-checkbox value=\"user\">\n                    Advertiser\n                </md-checkbox>\n                <md-checkbox  value=\"admin\" ng-model=\"signup.user.role\">\n                    Publisher\n                </md-checkbox>\n				</md-input-container>\n \n\n				<md-input-container md-is-error=\"(form.password.$error.required ||  form.password.$error.mongoose || form.password.$error.minlength) && form.password.$dirty\">\n					<label>Password</label>\n					<input name=\"password\" type=\"password\" ng-model=\"signup.user.password\" required mongoose-error ng-minlength=\"3\"/>\n					<div ng-messages=\"form.password.$error\" ng-if=\"form.password.$dirty\">\n						<div ng-message=\"required\">Password is required</div>\n						<div ng-message=\"mongoose\">{{ errors.password }}</div>\n						<div ng-message=\"minlength\">Password must be at least 3 characters.</div>\n					</div>\n				</md-input-container>\n\n				<md-input-container flex class=\"last\" md-is-error=\"(form.passwordRepeat.$error.required ||  form.passwordRepeat.$error.minlength || form.passwordRepeat.$error.repeat-input) && form.passwordRepeat.$dirty\">\n					<label>Repeat Password</label>\n					<input name=\"passwordRepeat\" type=\"password\"  ng-model=\"signup.user.passwordRepeat\" required repeat-input=\"signup.user.password\" ng-minlength=\"3\">\n					<div ng-messages=\"form.passwordRepeat.$error\" ng-if=\"form.passwordRepeat.$dirty\">\n						<div ng-message=\"required\">Please repeat the new password</div>\n						<div ng-message=\"minlength\">Password must be at least 3 characters.</div>\n						<div ng-message=\"repeat-input\">The passwords do not match</div>\n					</div>\n				</md-input-container>\n\n			</section>\n		<submit-button loading=\"signup.loading\" form=\"form\" text=\"Create your account\"></submit-button>\n	</form>\n        </div>\n    </div>\n    \n  </div>\n\n</section>\n");
$templateCache.put("components/messages/airline.html","Airline Advertising\nTravelling inspires people and removes them from the distractions of their everyday routine. This is the perfect moment for brands to reach and engage with a real audience when they have the time, focus and mind-set to respond. Airline passengers tend to spend money and make decisions in their local community.  A high level of this highly desirable captive audience are the business decision makers because corporate executives often fly out regardless of the ticket cost – it is a matter of convenience because time is money!\nAirport Advertising\nAirport is positioned as a unique and unrivalled platform for advertisers to reach out to a premium audience. The MediaBox offers exciting advertising opportunities at prime locations across all terminals, including award-winning landmarks, digital networks, and dynamic static sites.\nAirport advertising delivers your message to business and leisure travelers. Whether you’re trying to raise awareness about your brand, product or service, or encourage point-of-sale, Airport ads are the way to go. Choose from a variety of traditional and experiential displays and locations that are best suited for your campaign.\nPlace your ad throughout terminals in arrival and departure areas, ticketing areas, baggage claim, gates, concourses and VIP lounges.\n\n");
$templateCache.put("components/messages/cinema.html","Cinema advertising is an excellent medium for premium audience targeting. Today, people are in full control of what they watch. As advertisers, you are constantly battling fragmented audience, declining reach, and ad-skipping technology. Who\'s even watching your ads anymore? That\'s where cinema comes in. Its audience is in full show me what you got mode - staring up at a giant screen in a dark, comfortable movie theater.\nRestaurants, bars and retail outlets surrounding cinema can appeal to consumers with special offers valid directly after the movie, and nearby service providers can connect with people who they know are active participants in the economy.\n\n");
$templateCache.put("components/messages/email.html","Non-traditional marketing strategies rely on new and unorthodox marketing methods. Anything that falls outside the categories of traditional marketing can be considered non-traditional, but the term has typically referred to a more specific range of marketing tactics.\nThe goal of non-traditional advertising is to create striking advertising experiences that capture interest through their creativity and unpredictably. Much of non-traditional marketing involves putting ads in unusual places, or displaying ads in unusual ways, hoping to command the attention of unassuming viewers.\nNon traditional advertising can encompass a variety of efforts and methods of getting your message seen.  Non-traditional advertising works well for people with a limited budget and an audience that could be easily. It’s an effective method of displaying your message and making it more memorable because of the unusual way in which it may be shown. It is useful for a very targeted audience\n");
$templateCache.put("components/messages/magazines.html","Magazine advertising has a wide range of pricing. Smaller regional and local magazines charge less than national magazines with millions of subscribers and may be a better bet for your small business, depending on your industry\nMagazine advertising doesn\'t just vary in size, but also in type. It includes display ads, advertorials, classified and special promotions.\nWhy You Should Advertise In Magazines\n<ul>\n<li>Magazines and magazine ads capture focused attention: the focused process of magazine reading leads to less media multi-tasking, ensuring single minded attention to advertising.</li>\n<li>Magazine status: some magazine titles are well respected in their field, so an advertisement in these will increase your product/service’s prestige by association.</li>\n<li>Magazine advertising is targeted: magazines engage readers in very personal ways. There’s a magazine for every passion and a passion for every magazine. Use magazines to reach your target audience in a meaningful way.</li>\n<li>Magazine advertising is relevant and welcomed: consumers value magazine advertising, reading it almost as much as the editorial itself. The ads are accepted as an essential part of the magazine mix.</li>\n<li>Magazines are credible: consumers trust magazines so much that they are the leading sources of information that readers recommend by word-of-mouth to others.</li>\n<li>Magazines offer a lasting message: ads keep working 24/7. They provide a lasting, durable message with time to study a brand’s benefits. Consumers clip and save magazine ads for future reference.</li>\n<li>Tell The Entire Brand Story - Magazines allow in-depth, detailed communication of the entire brand story.</li>\n<li>Flexibility - Magazines provide opportunities for inserts, supplements, advertorials and a variety of size and positioning options to meet any advertiser‘s specific creative needs.\nWays In Which Magazines Deliver Engagement</li>\n<li>The intimacy between reader and Magazines benefits advertisers. Also the strong positive brand values of the Magazines can transfer onto the advertisements.</li>\n<li>Because advertisements are relevant and valued, ad clutter is not a problem in Magazines.</li>\n<li>Readers take action as a result of seeing advertising in Magazines.</li>\n<li>Targeting with precision and without wastage is a key strength of Magazines.</li>\n<li>Creative formats such as gatefolds, textures, special papers, samples, sponsorship, advertisement features (‘advertorials’), and so on can create additional impact and interaction.</li>\n<li>Advertising in Magazines is a great, cost-effective way to reach an exclusive group of affluent and highly educated managers, owners, professionals and executives.</li>\nEffectiveness Of Magazine Advertising<br>\nThe effectiveness of magazine advertising depends on your advertising and promotion objectives, as well as the budget you have for advertising. Magazine advertising has strengths and weaknesses relative to other ad media. In general, you want to use media that reach your target audience and allow you to present effective messages affordably.\n\n");
$templateCache.put("components/messages/newspapers.html","<p>Advertising in Newspapers gives you an opportunity to reach out to your target audience. In order to get your brand’s advertising message out, you need to reach your consumers a number of times (i.e. frequency). Too little exposure and audiences will fail to notice the advertising. Too much, and recipients will be saturated. The Media Box is uniquely positioned to help you grow your business with highly effective, targeted print media buying.\nNewspapers are the top traditional media source to influence purchase decisions. Newspapers advertising can span across multiple columns - and can even cover full page, half page, quarter page or other custom sizes. They are designed in high resolution colored and black/white formats providing higher visibility for the mass audiences of Newspapers.</p>\n<p>The Journal of Advertising Research found “sound experimental evidence that newspaper advertising can stimulate an immediate response observable in purchasing terms.” In a study of 1200, one and a half days after ads for various brands ran in the newspaper:\n<ul>\n<li>14% more purchases of the brands advertised in the newspaper<li>\n<li>10% greater brand share for the brands advertised in the newspaper</li>\n</ul>\n	\n	\n");
$templateCache.put("components/messages/nontraditional.html","Non-traditional marketing strategies rely on new and unorthodox marketing methods. Anything that falls outside the categories of traditional marketing can be considered non-traditional, but the term has typically referred to a more specific range of marketing tactics.\nThe goal of non-traditional advertising is to create striking advertising experiences that capture interest through their creativity and unpredictably. Much of non-traditional marketing involves putting ads in unusual places, or displaying ads in unusual ways, hoping to command the attention of unassuming viewers.\nNon traditional advertising can encompass a variety of efforts and methods of getting your message seen.  Non-traditional advertising works well for people with a limited budget and an audience that could be easily. It’s an effective method of displaying your message and making it more memorable because of the unusual way in which it may be shown. It is useful for a very targeted audience\n");
$templateCache.put("components/messages/outdoor.html","If you need to make a big impact in your local area, outdoor advertising can raise your company\'s profile and deliver results. Outdoor ads put your message right in front of your potential customers.<nr>\nWhy Outdoor Advertising Works<br>\nOutdoor advertising is highly prominent and does not require the consumer to do anything to access it. You don\'t have to tune in or click onto it or turn a page. At the same time, most people regard it as less intrusive than other methods of advertising. Indeed, a lot of outdoor advertising engages the consumer, providing colour, humour and insight. In locations where it sits in front of a captive audience — on public transport or at waiting places, for instance — it can even be seen as a welcome distraction.<br>\nWhere To Advertise Outdoors<br>\nOutdoor promotion is not just about massive hoardings, pole kiosks, bus shelters etc on the side of the road. There are poster sites and sizes to suit all budgets. Your choice will be driven by how well you understand your target market. If your target market is largely defined by geographical location, a few well-chosen spots and advertising signs in your area could raise your company\'s profile and drive sales.\nOutdoor advertising on the high street catches your potential customers while they are in shopping mode. A good poster campaign can prompt shoppers to buy your products there and then, especially if you are running a promotion as an incentive.\n");
$templateCache.put("components/messages/radio.html","Busy, people are particularly strong radio listeners because of its accessibility while they are on the go – at work, driving, relaxing at home or using the internet.\nAdvantages Of Using Radio Advertising \n<ul><li>Radio’s cost-efficiency allows advertisers to be heard every day and multiple times throughout the day.</li>\n<li>	This average frequency is critically important for delivering rapid advertising response, such as – web visits, store traffic, sales, brand recall and intent-to-purchase.</li>\n<li>	Radio has strong reach across reions and each week attracts a large number of engaged listeners.</li>\n<li>	Busy, mobile people are particularly strong radio listeners because of its accessibility while they are on the go – at work, driving, walking, relaxing at home or using the internet.</li>\n<li>	Radio’s reach provides advertisers’ with cut through, campaign extension, frequency and message reinforcement.</li>\n\n\n");
$templateCache.put("components/messages/tv.html","When Should You Use TV Advertising\n<ul>\n<li>	Repositioning Your Brand: changing perceptions about a brand is a difficult task.  A strong branding effort is required to change the current association, beliefs and feelings about a brand </li>\n<li>	Changing Behavior: not all advertising is about consumption.  Sometimes it’s about trying to persuade people to change what they do. </li>\n<li>	Generate Response: your Brands can use TV\'s ability to drive people to buy directly online or offline.</li>\n<li>	Demonstration: one of TV’s greatest strength is its ability to demonstrate. Sometimes a viewer needs to see a product in action in order to understand fully its benefits.  It is the power of the moving image accompanied by sound that makes TV advertising so powerful.  Demonstration shows viewers how to consume a new product.</li>\n<li>	Customer Retention: it is much easier to retain existing customers than to find new customers. Therefore, it is really important to remind your existing customers why they love your brand. A television campaign is capable of making a customer feel proud of ‘their’ brand, remind them why they bought into the brand in the first place and of all the positive elements of the brand and keep them feeling positive and warm about their choice of brand.  Most of all it protects them against the advances of all those other brands who want to get their hands on your customers.<li>\n<li>	Launching Brands: TV is without doubt the most effective medium for launching brands.  It combines the scale and reach that a new brand needs with impact and persuasiveness.  No other medium can offer both these qualities.</li>\nWhat Environment Should Your TV Ad Be In?<br>\nPart of the planning process is determining which channels give you access to the right programmes and, ultimately, are most effective at reaching your audience.\nIn order to meet your communication objectives efficiently, it is essential that the right mix of channels is bought.\nThere are three measures that are used to describe a channel’s profile:\n<ul><li>	Age</li>\n<li>	Gender</li>\n<li>	Class</li>\nThese can be compared to either the population as a whole, or the overall profile of commercial TV\n\n");
$templateCache.put("components/modal/create.html","<md-dialog aria-label=\"Create a new user\" id=\"admin-user-create\" layout=\"column\" \nflex-xs=\"100\" \nflex-sm = \"50\" \nflex-md=\"50\" \nflex-lg=\"33\" \nflex-gt-lg=\"33\" \nclass=\"md-whiteframe-z1\">\n\n	<md-toolbar class=\"md-accent\">\n		<h3 class=\"md-toolbar-tools\">\n			Create a new {{create.title}}\n		</h3>\n	</md-toolbar>\n		<form name=\"createForm\" layout=\"column\" layout-fill layout-align=\"space-between\" ng-submit=\"create.create(createForm)\" novalidate  autocomplete=\"off\">\n\n	<md-content layout-padding class=\"md-blue-theme\">\n			<section class=\"section\" layout=\"column\">\n				<span layout=\"row\" layout-sm=\"column\" ng-repeat=\"i in create.options.columns\" ng-if=\"create.options.columns\" ng-switch=\"i.dataType\" >\n					<!-- When the field is Integer type restrict it only to float values -->\n					<md-input-container ng-cloak flex ng-switch-when=\"parseFloat\" >\n						<label>{{i.heading | labelCase}}</label>\n						<input name=\"{{i.field}}\" ng-model=\"create.item[i.field]\" ng-disabled=\"i.noAdd\" only-numbers md-autofocus=\"$index===0\">\n					</md-input-container>\n\n					<!-- When the field is Image type add URL postfix to labels -->\n					<md-input-container ng-cloak flex ng-switch-when=\"image\" >\n						<label>{{i.heading | labelCase}} URL</label>\n						<input name=\"{{i.field}}\" ng-model=\"create.item[i.field]\" ng-disabled=\"i.noAdd\" md-autofocus=\"$index===0\">\n					</md-input-container>\n\n					<!-- When boolean type add an switch -->\n					<md-input-container ng-cloak flex ng-switch-when=\"boolean\">\n							<section class=\"section slim\" layout=\"column\">\n								<span layout=\"row\" layout-align=\"start center\">\n									<span flex=\"33\"><label>{{i.heading | labelCase}}</label></span>\n									<md-switch name=\"{{i.field}}\" aria-label=\"active\" ng-model=\"create.item[i.field]\"\n									ng-disabled=\"i.noAdd\"\n									class=\"no-label\"></md-switch>\n								</span>\n							</section>\n							<span flex=\"33\"></span>\n\n					</md-input-container>\n\n					<!-- When datatype is date, integrate an calendar into it -->\n					<div ng-switch-when=\"date\" ng-cloak class=\"full-width\">\n						<mb-datepicker element-id=\'date1\'\n										 input-class=\"testClass\"\n										 input-name=\"testName\"\n										 arrows=\"arrows\"\n										 calendar-header=\"header\"\n										 date=\"date\"\n										 date-format=\"YYYY-MM-DD\"\n										 placeholder=\"{{i.heading | labelCase}}\"\n										 ></mb-datepicker>\n					</div>\n\n					<!-- When the required type is dropdown, add an dropdown menu with select options -->\n					<md-input-container ng-cloak flex ng-switch-when=\"dropdown\" class=\"dropdown\">\n		        <label>{{i.heading | labelCase}}</label>\n		        <md-select ng-model=\"create.item[i.field]\">\n		          <md-option ng-repeat=\"o in i.options\" value=\"{{o}}\">\n		            {{o}}\n		          </md-option>\n		        </md-select>\n		      </md-input-container>\n\n					<!-- When textarea type add an multiline input -->\n					<md-input-container ng-cloak flex ng-switch-when=\"textarea\">\n						<label>{{i.heading | labelCase}}</label>\n						<textarea name=\"{{i.field}}\" ng-model=\"create.item[i.field]\" ng-disabled=\"i.field==\'_id\' || i.noAdd\" md-autofocus=\"$index === 0\"></textarea>\n					</md-input-container>\n\n					<!-- When datatype of field is not defined add textbox instead -->\n					<md-input-container ng-cloak flex ng-switch-default>\n						<label>{{i.heading | labelCase}}</label>\n						<input name=\"{{i.field}}\" ng-model=\"create.item[i.field]\" ng-disabled=\"i.field==\'_id\' || i.noAdd\" md-autofocus=\"$index === 0\">\n					</md-input-container>\n\n			</span>\n			</section>\n	</md-content>\n\n	<md-dialog-actions layout=\"row\">\n		<md-button ng-click=\"create.close()\" aria-label=\"Close Add Modal\">Cancel</md-button>\n		<md-button ng-disabled=\"createForm.$invalid\" type=\"submit\" class=\"md-primary md-raised\" aria-label=\"Insert a new {{create.title}}\"> Create </md-button>\n	</md-dialog-actions>\n		</form>\n\n</md-dialog>\n");
$templateCache.put("components/navbar/cart.html","<md-sidenav class=\"md-sidenav-right md-whiteframe-z2\" md-component-id=\"cart\" style=\"width: 500px\">\n  <md-toolbar class=\"md-theme-light\">\n    <h1 class=\"md-toolbar-tools\">Cart Details</h1>\n  </md-toolbar>\n  <md-content class=\"cart-content\">\n    <form>\n      <div layout=\"row\" layout-align=\"space-between start\" ng-repeat=\"item in vm.cart.items\" class=\"cart-item md-whiteframe-z1\">\n            <img  class=\"md-whiteframe-z1\" width=\"80px\" height=\"100%\" data-ng-src=\"data:image/png;base64,{{item.image}}\" err-SRC=\"/assets/images/50x50-1ed563a3dc.png\"  alt=\"{{item.name}}\" />\n            <div layout=\"column\" flex style=\"margin: 7px\">\n                <div >{{ item.name }} <span ng-if=\"item.size\">(Size: {{item.size}})</span></div>\n                <div ng-if=\"item.price\">{{ item.price | currency:vm.Settings.currency.symbol }} * {{item.quantity}} = \n                <strong>{{item.price * item.quantity | currency:vm.Settings.currency.symbol}}</strong></div>\n                <div layout=\"row\" layout-align=\"center center\">\n <!--Cart buttons-->\n        <md-button class=\"md-raised md-primary small-button md-icon-button\" \n              ng-click=\"vm.cart.addItem({sku:item.sku, name:item.name, slug:item.slug, mrp:item.mrp, price:item.price, weight:item.weight, vid:item.vid}, -1)\" \n              aria-label=\"Remove from cart\">\n                  <ng-md-icon icon=\"remove\"></ng-md-icon>\n        </md-button>\n        <div class=\"md-raised\"  ng-disabled=\"true\" aria-label=\"Cart quantity\">{{vm.cart.getQuantity(item.sku, item.vid)}}</div>\n        <md-button class=\"md-raised md-primary small-button md-icon-button\" ng-click=\"vm.cart.addItem({sku:item.sku, name:item.name, slug:item.slug, mrp:item.mrp, price:item.price, weight:item.weight, vid:item.vid}, +1)\" aria-label=\"Add to cart\">\n                  <ng-md-icon icon=\"add\"></ng-md-icon>\n        </md-button>\n <!--Cart buttons-->\n\n      </div>\n            </div>\n            <a aria-label=\"Remove {{item.name}} from cart\" ng-click=\"vm.cart.addItem({sku:item.sku, vid: item.vid}, -10000000);vm.openCart()\">\n                <ng-md-icon icon=\"close\" aria-label=\"Close dialog\"></ng-md-icon>\n            </a>\n      </div>\n    </form>\n    <div layout=\"column\" flex style=\"margin: 7px\" ng-if=\"vm.cart.getTotalPrice()>0\"><b>Handling Fee:</b> \n      \n      <span >{{vm.cart.getHandlingFee() | currency:vm.Settings.currency.symbol}}</span>\n    </div>\n    <div layout=\"column\" flex style=\"margin: 7px\" ng-if=\"vm.cart.getTotalPrice()>0\"><b>Sub Total:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</b> {{vm.cart.getTotalPrice()  | currency:vm.Settings.currency.symbol}}</div>\n    <div class=\"md-dialog-actions\" layout=\"row\" layout-align=\"space-between center\">\n        <md-button  ng-hide=\"vm.cart.flag\" ui-sref=\"cart\" class=\"md-raised circular-progress-button md-primary\" aria-label=\"Checkout\" ng-disabled=\"vm.cart.items.length <= 0\">\n            <span ng-show=\"!vm.loading\"><ng-md-icon icon=\"local_grocery_store\" hide-xs></ng-md-icon>Configure Campaign →</span>\n            <md-progress-circular md-mode=\"indeterminate\" md-diameter=\"25\" ng-show=\"vm.loading\" class=\"md-accent md-hue-1\"></md-progress-circular><span ng-show=\"vm.loading\">Loading...</span>\n        </md-button>\n        <md-button  ng-show=\"vm.cart.flag\" ui-sref=\"checkout\" class=\"md-raised circular-progress-button md-primary\" aria-label=\"Checkout\" ng-disabled=\"vm.cart.items.length <= 0\">\n            <span ng-show=\"!vm.loading\"><ng-md-icon icon=\"local_grocery_store\" hide-xs></ng-md-icon>Proceed To Payment →</span>\n            <md-progress-circular md-mode=\"indeterminate\" md-diameter=\"25\" ng-show=\"vm.loading\" class=\"md-accent md-hue-1\"></md-progress-circular><span ng-show=\"vm.loading\">Loading...</span>\n        </md-button>\n        <md-button class=\"btn btn-default btn-lg btn-register\" ng-click=\"vm.close()\"  aria-label=\"Cancel Cart Menu\"> Close </md-button>\n    </div>\n  </md-content>\n</md-sidenav>\n\n\n");
$templateCache.put("components/navbar/navbar.html","<div ng-include=\"\'components/navbar/cart.html\'\"></div>\n<div >\n<!-- *** TOPBAR ***\n_________________________________________________________ -->\n<div id=\"top\">\n    <div class=\"container\">\n        <div class=\"col-md-1\">\n            <a  href=\"index.html\">\n                <img src=\"/assets/img/logo.png\"  class=\"hidden-xs\">\n                <img src=\"/assets/img/logo.png\"  class=\"visible-xs\"><span class=\"sr-only\"></span>\n            </a>\n        </div>\n         <div class=\"col-md-9 offer\" style=\"padding-top:  10px\" data-animate=\"fadeInDown\">\n            \n             Choose from hundreds of media options listed on Mediabox. Smart filters and Recommendations help you choose the right media option for you.</a>\n        </div>\n        <div class=\"col-md-2 pull-right\" data-animate=\"fadeInDown\">\n           <top-menu ng-if=\"!search.show\"></top-menu> \n        </div>\n    </div>\n   </div>\n\n<!-- *** TOP BAR END *** -->\n\n<!-- *** NAVBAR ***\n_________________________________________________________ -->\n\n<div class=\"navbar navbar-default yamm\" role=\"navigation\" id=\"navbar\">\n    <div class=\"container\">\n  <div class=\"col-md-12\">\n        <div class=\"navbar-header\">\n\n            \n            <div class=\"navbar-buttons\">\n                <button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\"#navigation\" ng-click=\"isCollapsed1 = !isCollapsed1\">\n                    <span class=\"sr-only\">Toggle navigation</span>\n                    <i class=\"fa fa-align-justify\"></i>\n                </button>\n                \n               \n\n            </div>\n        </div>\n        <!--/.navbar-header -->\n\n        <div class=\"navbar-collapse collapse navbar-static-top megamenu pull-left\" id=\"navigation\">\n          <div collapse=\"isCollapsed1\" class=\"navbar-collapse collapse\" id=\"navbar-main2\">\n            <ul class=\"nav navbar-nav navbar-left pull-right\" ng-hide=\"isAdmin()\">\n                <li class=\"dropdown yamm-fw\"><a href=\"/\"><ng-md-icon icon=\"home\" md-menu-align-target></ng-md-icon></a></li>\n                <li class=\"dropdown yamm-fw\" ng-repeat=\"p in vm.categories\">\n                    <a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\" data-hover=\"dropdown\" data-delay=\"200\">{{p.name}} <b class=\"caret\"></b></a>\n                    <ul class=\"dropdown-menu\">\n                        <li>\n                            <div class=\"yamm-content\">\n                                <div class=\"row\">\n                                    <div class=\"col-sm-3\" ng-repeat=\"h in p.child\">\n                                        <!-- <h5>All</h5> -->\n                                        <ul>\n                                            <div>\n                                                 <li ><a href=\"/Category/{{h.slug}}/{{h._id}}\"><ng-md-icon icon=\"{{h.icon}}\" md-menu-align-target></ng-md-icon>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{h.name}}</a>\n                                                 </li>  \n                                            </div>\n                                      \n\n                                        </ul>\n                                    </div>\n                                </div>\n                            </div>\n                            <!-- /.yamm-content -->\n                        </li>\n                    </ul>\n                </li>\n            </ul>\n\n          </div>\n        </div>\n        <!--/.nav-collapse -->\n\n        <div class=\"navbar-buttons pull-right\">\n             <md-button ng-click=\"vm.openCart()\" class=\"md-raised cart\" ng-if=\"!search.show\">\n                    <ng-md-icon icon=\"shopping_cart\"></ng-md-icon>\n                    <span  show-gt-sm>Cart {{vm.cart.getTotalCount()}} Items  </span>\n                    <span hide show-gt-sm odometer=\"vm.cart.getTotalPrice()\">\n                  </md-button>\n            <!--/.nav-collapse -->\n\n            <div class=\"navbar-collapse collapse right\" id=\"search-not-mobile\">\n                <button type=\"button\" class=\"btn navbar-btn btn-danger\" data-toggle=\"collapse\" data-target=\"#search\">\n                    <span class=\"sr-only\">Toggle search</span>\n                     <ng-md-icon icon=\"search\"></ng-md-icon>\n                </button>\n            </div>\n\n        </div>\n\n        <div class=\"collapse clearfix\" id=\"search\">\n           <div class=\"search\" layout=\"row\" layout-align=\"center center\" flex ng-if=\"search.show || vm.$mdMedia(\'gt-xs\')\">\n        <div class=\"searchbox\" layout=\"row\" layout-align=\"center center\" flex>\n            <form ng-submit=\"$event.preventDefault()\" flex>\n                <md-autocomplete\n                    ng-cloak\n                    md-selected-item=\"vm.selectedItem\"\n                    md-search-text-change=\"vm.searchTextChange(vm.searchText)\"\n                    md-search-text=\"vm.searchText\"\n                    md-selected-item-change=\"vm.selectedItemChange(item)\"\n                    md-items=\"item in vm.querySearch(vm.searchText)\"\n                    md-item-text=\"item.name\"\n                    md-min-length=\"1\"\n                    placeholder=\"Search for publishers here\"\n                    md-menu-class=\"navbar-autocomplete\">\n                    <md-item-template>\n                        <img ng-if=\"item.logo[0].base64\" width=\"50px\" height=\"50px\" \n                         data-ng-src=\"data:image/png;base64,{{item.logo[0].base64}}\" err-SRC=\"/assets/images/material-shop-e3ca5c21c4.jpg\"/>\n            <span md-highlight-text=\"vm.searchText\">{{item.name}}</span>\n                    </md-item-template>\n          <md-not-found>\n            No item matching \"{{vm.searchText}}\" were found.\n          </md-not-found>\n                </md-autocomplete>\n            </form>\n\n        </div>\n    </div>\n        </div>\n        <!--/.nav-collapse -->\n\n    </div>\n    <!-- /.container -->\n</div>\n<!-- /#navbar -->\n</div>\n<!-- *** NAVBAR END *** -->\n</div>\n");
$templateCache.put("components/navbar-public/navbar-public.html","<div ng-include=\"\'components/navbar/cart.html\'\"></div>\n<md-toolbar ng-show=\"!showSearch\" class=\"md-whiteframe-2dp\">\n  <div class=\"md-toolbar-tools navbar\" layout=\"row\" layout-align=\"space-between center\">\n    <md-button ng-click=\"vm.openFilter()\" aria-label=\"Left Menu\" ng-hide=\"vm.hideLeftMenu\" hide-gt-md>\n      <ng-md-icon icon=\"menu\"></ng-md-icon>\n    </md-button>\n    <h3><a ui-sref=\"/\">Mediabox</a></h3>\n    <div class=\"search\" hide-xs>\n        <div class=\"searchbox\">\n            <form ng-submit=\"$event.preventDefault()\" flex>\n                <md-autocomplete\n                    md-selected-item=\"vm.selectedItem\"\n                    md-search-text-change=\"vm.searchTextChange(vm.searchText)\"\n                    md-search-text=\"vm.searchText\"\n                    md-selected-item-change=\"vm.selectedItemChange(item)\"\n                    md-items=\"item in vm.querySearch(vm.searchText)\"\n                    md-item-text=\"item.name\"\n                    md-min-length=\"1\"\n                    placeholder=\"Search for anything here\"\n                    md-menu-class=\"navbar-autocomplete\">\n                    <md-item-template>\n                        <img ng-if=\"item.variants[0].image\" \n                        ng-src=\"{{item.variants[0].image}}\" err-SRC=\"/assets/images/material-shop-e3ca5c21c4.jpg\"/>\n						<span md-highlight-text=\"ctrl.searchText\" md-highlight-flags=\"^i\">{{item.name}}</span>\n                    </md-item-template>\n					<md-not-found>\n						No item matching \"{{vm.searchText}}\" were found.\n					</md-not-found>\n                </md-autocomplete>\n            </form>\n\n            <md-button aria-label=\"Search\" ng-click=\"showSearch = !showSearch\" class=\"md-raised md-warn\">\n                <ng-md-icon icon=\"search\"></ng-md-icon> Search\n            </md-button>\n        </div>\n    </div>\n    <md-button ng-click=\"vm.openCart()\" aria-label=\"Left Menu\" class=\"md-raised cart\">\n      <ng-md-icon icon=\"shopping_cart\"></ng-md-icon>\n      <span hide-xs>Cart ({{vm.cart.getTotalCount()}}) -</span> {{vm.cart.getTotalPrice() | currency:vm.Settings.currency.symbol}}  \n    </md-button>\n <top-menu></top-menu> \n  </div>\n</md-toolbar>\n\n<div id=\"wrapper\">\n\n	<!-- begin nav -->\n	<nav>\n		<ul id=\"menu\">\n			<li ng-repeat=\"c in vm.categories\"><a href=\"#\">{{c.name}}</a>\n				<div id=\"mega\" style=\"z-index:10000\">\n					\n					<ul ng-repeat=\"h in c.child\">\n						<li><a href=\"/Category/{{h.slug}}/{{h._id}}\" class=\"header\">{{h.name}}</a>\n							\n							<ul>\n								<li ng-repeat=\"i in h.child\"><a href=\"/Category/{{i.slug}}/{{i._id}}\">{{i.name}}</a></li>\n							</ul>\n						\n						</li>\n						<!--<li ng-repeat=\"i in h.subcat\"><a href=\"#\">{{i.name}}</a></li>-->\n						\n					</ul>\n				\n				</div>\n			</li>\n		</ul>\n\n	</nav><!-- /nav -->\n	\n</div><!-- /wrapper -->\n");
$templateCache.put("components/oauth-buttons/oauth-buttons.html","<div flex layout=\"row\" layout-align=\"center\">\n<md-button class=\"md-raised md-primary md-hue-2\" aria-label=\"Connect with Facebook\" ng-click=\"OauthButtons.loginOauth(\'facebook\')\" ng-disabled=\"OauthButtons.facebookLoading\">\n    <span  layout=\"row\" layout-align=\"center center\">\n        <ng-md-icon icon=\"facebook\" ng-hide=\"OauthButtons.facebookLoading\"></ng-md-icon> \n        <md-progress-circular md-mode=\"indeterminate\" md-diameter=\"25\" ng-show=\"OauthButtons.facebookLoading\" class=\"md-accent md-hue-1\"></md-progress-circular>\n        <span hide show-gt-sm>&nbsp;Connect with Facebook</span>\n    </span>\n</md-button>\n<md-button class=\"md-raised md-warn md-hue-2\" aria-label=\"Connect with Google\" ng-click=\"OauthButtons.loginOauth(\'google\')\" ng-disabled=\"OauthButtons.googleLoading\">\n    <span  layout=\"row\" layout-align=\"center center\">\n        <ng-md-icon icon=\"google-plus\" ng-hide=\"OauthButtons.googleLoading\"></ng-md-icon> \n        <md-progress-circular md-mode=\"indeterminate\" md-diameter=\"25\" ng-show=\"OauthButtons.googleLoading\" class=\"md-accent md-hue-1\"></md-progress-circular>\n        <span hide show-gt-sm>&nbsp;Connect with Google</span>\n    </span>\n</md-button>\n<md-button class=\"md-raised md-primary\" aria-label=\"Connect with Twitter\" ng-click=\"OauthButtons.loginOauth(\'twitter\')\" ng-disabled=\"OauthButtons.twitterLoading\">\n    <span  layout=\"row\" layout-align=\"center center\">\n        <ng-md-icon icon=\"twitter\" ng-hide=\"OauthButtons.twitterLoading\"></ng-md-icon>\n        <md-progress-circular md-mode=\"indeterminate\" md-diameter=\"25\" ng-show=\"OauthButtons.twitterLoading\" class=\"md-accent md-hue-1\"></md-progress-circular>\n        <span hide show-gt-sm>&nbsp;Connect with Twitter</span>\n    </span>\n</md-button>\n</div>\n");
$templateCache.put("components/repeat-input/repeat-input.html","<div>this is the repeatInput directive</div>\n");
$templateCache.put("components/right-menu/right-menu.html","<md-sidenav class=\"md-sidenav-right md-whiteframe-z2\" md-component-id=\"right\">\n  <md-toolbar class=\"md-theme-light\">\n    <h1 class=\"md-toolbar-tools\">Sidenav Right</h1>\n  </md-toolbar>\n  <md-content layout-padding>\n    <form>\n      <md-input-container>\n        <label for=\"testInput\">Test input</label>\n        <input type=\"text\" id=\"testInput\"\n               ng-model=\"data\" md-autofocus>\n      </md-input-container>\n    </form>\n    <md-button ng-click=\"close()\" class=\"md-primary\" aria-label=\"Right Menu\">\n      Close Sidenav Right\n    </md-button>\n  </md-content>\n</md-sidenav>\n");
$templateCache.put("components/toast/toast.html","<md-toast>\n	<span flex>{{::vm.text}}</span>\n\n	<md-button class=\"md-primary\"\n						 ng-class=\"{\'md-accent\': vm.type === \'warn\'}\"\n						 ng-if=\"::vm.link\"\n						 ng-click=\"vm.showItem()\"\n						 aria-label=\"{{::vm.text}}\">\n		Show\n	</md-button>\n\n	<span ng-if=\"::vm.link\">|</span>\n\n	<md-button ng-click=\"vm.close()\" aria-label=\"OK\">OK</md-button>\n</md-toast>\n");
$templateCache.put("components/top-menu/top-menu.html","<md-button aria-label=\"Login / Signup\" ng-click=\"topmenu.showLogin()\" ng-if=\"!topmenu.isLoggedIn()\" style=\"color:#fff\">\n    <ng-md-icon icon=\"person\" md-menu-align-target></ng-md-icon>\n    <span hide-xs>Login / Signup</span>\n</md-button>\n\n<!-- Dropdown Menu Starts here -->\n   <md-menu style=\"color:#fff\">\n    <md-button ng-click=\"topmenu.openMenu($mdOpenMenu, $event)\"  ng-show=\"topmenu.isLoggedIn()\">\n      <ng-md-icon icon=\"face\" md-menu-align-target></ng-md-icon>\n      <!--<md-icon class=\"avatar-icon\" md-svg-icon=\"avatar:svg-{{ (0 + 1) % 11 }}\"></md-icon>-->\n      <span hide-xs>{{topmenu.Auth.getCurrentUser().name | labelCase}}</span>\n      <ng-md-icon icon=\"more_vert\"></ng-md-icon>\n    </md-button>\n    <md-menu-content width=\"4\" class=\"navMenu\" ng-show=\"topmenu.menu\">\n<!-- // Auth items -->\n      <md-menu-item ng-repeat=\"item in topmenu.menu.auth\" ui-sref-active=\"active\" ng-if=\"!topmenu.isLoggedIn()\" ui-sref=\"{{item.url}}\">\n        <md-button aria-label=\"{{item.text}}\">\n          <ng-md-icon icon=\"{{item.icon}}\" md-menu-align-target></ng-md-icon>\n          {{item.text}}\n        </md-button>\n      </md-menu-item>\n\n<!-- // Admin Pages -->\n      <md-subheader ng-if=\"topmenu.isLoggedIn()\">Pages</md-subheader>\n      <md-menu-item ng-repeat=\"item in topmenu.menu.pages\" ui-sref-active=\"active\" ng-if=\"topmenu.isLoggedIn() && item.authenticate && topmenu.hasRole(item.role)\" ui-sref=\"{{item.url}}\">\n        <md-button aria-label=\"{{item.text}}\">\n          <ng-md-icon icon=\"{{item.icon}}\" md-menu-align-target></ng-md-icon>\n          {{item.text}}\n        </md-button>\n      </md-menu-item>\n\n<!-- // Public Pages -->\n      <md-menu-item ng-repeat=\"item in topmenu.menu.pages\" ui-sref-active=\"active\" ng-if=\"!item.authenticate\" ui-sref=\"{{item.url}}\">\n        <md-button aria-label=\"{{item.text}}\">\n          <ng-md-icon icon=\"{{item.icon}}\" md-menu-align-target></ng-md-icon>\n          {{item.text}}\n        </md-button>\n      </md-menu-item>\n\n<!-- // User Management -->\n      <md-subheader ng-if=\"topmenu.isLoggedIn()\"> User</md-subheader>\n      <md-menu-item ng-repeat=\"item in topmenu.menu.user\" ui-sref-active=\"active\" ng-if=\"topmenu.isLoggedIn() && topmenu.hasRole(item.role)\" ui-sref=\"{{item.url}}\">\n        <md-button aria-label=\"{{item.text}}\">\n          <ng-md-icon icon=\"{{item.icon}}\" md-menu-align-target></ng-md-icon>\n          {{item.text}}\n        </md-button>\n      </md-menu-item>\n\n    </md-menu-content>\n  </md-menu>\n");
$templateCache.put("components/user-avatar/user-avatar.html","<div>this is the userAvatar directive</div>\n");
$templateCache.put("app/account/cp/cp.html","<navbar leftmenu=\"true\"></navbar>\n<left-menu></left-menu>\n<md-content flex layout=\"column\" class=\"content\" layout-align=\"start center\">\n<section layout=\"column\" layout-align=\"start center\">\n	<h1>Change Password</h1>\n	<form name=\"form\" ng-submit=\"cp.changePassword(form)\" novalidate autocomplete=\"off\" autocomplete=\"off\">\n		<section class=\"section\" layout=\"column\">\n			<md-input-container md-is-error=\"form.password.$error.required && form.password.$dirty\">\n				<label>Current Password</label>\n				<input name=\"password\" type=\"password\" ng-model=\"cp.user.oldPassword\" required md-autofocus mongoose-error ng-minlength=\"3\"/>\n				<div ng-if=\"form.password.$error.mongoose\" class=\"err\">Password is incorrect</div>\n				<div ng-messages=\"form.password.$error\" ng-if=\"form.password.$dirty\">\n					<div ng-message=\"required\">Password is required</div>\n					<div ng-message=\"mongoose\">Password is incorrect</div>\n					<div ng-message=\"minlength\">Password must be at least 3 characters.</div>\n				</div>\n			</md-input-container>\n\n			<md-input-container flex class=\"last\">\n				<label>New Password</label>\n				<input name=\"newPassword\" type=\"password\"  ng-model=\"cp.user.newPassword\" required ng-minlength=\"3\">\n				<div ng-messages=\"form.newPassword.$error\" ng-if=\"form.newPassword.$dirty\">\n					<div ng-message=\"required\">Please repeat the new password</div>\n					<div ng-message=\"minlength\">Password must be at least 3 characters.</div>\n				</div>\n			</md-input-container>\n\n			<p class=\"help-block success\" ng-if=\"cp.submitted && cp.message\"> {{cp.message}} </p>\n		</section>\n		<submit-button loading=\"cp.loading\" form=\"form\" text=\"Change Password\"></submit-button>\n	</form>\n</section>\n</md-content>\n<footer></footer>");
$templateCache.put("app/account/login/login.html","<navbar></navbar>\n<md-content flex layout=\"column\" class=\"content\" layout-align=\"start center\">\n<section layout=\"column\" layout-align=\"start center\">\n\n	<h1>Login</h1>\n\n	<p ng-show=\"login.error\" class=\"md-warn\">{{login.error.message}}</p>\n\n	<form name=\"form\" ng-submit=\"login.login(form)\" novalidate>\n	<section class=\"section\" layout=\"column\">\n		<md-input-container md-is-error=\"(form.email.$error.required || form.email.$error.email) && form.email.$dirty\">\n			<label>Email</label>\n			<input name=\"email\" type=\"email\" ng-model=\"login.user.email\" required md-autofocus/>\n			<div ng-messages=\"form.email.$error\" ng-if=\"form.email.$dirty\">\n				<div ng-message=\"required\">Email ID is required</div>\n				<div ng-message=\"email\">Please enter valid email address.</div>\n			</div>\n		</md-input-container>\n\n		<md-input-container md-is-error=\"form.password.$error.required && form.password.$dirty\">\n			<label>Password</label>\n			<input name=\"password\" type=\"password\" ng-model=\"login.user.password\" required/>\n			<div ng-messages=\"form.password.$error\">\n				<div ng-message=\"required\">Password is required</div>\n				<div class=\"err\">{{ login.errors.other }}<br/>\n+					<a ui-sref=\"forgot({ email: login.user.email})\" href=\"#\">Forgot Password</a></div>\n			</div>\n		</md-input-container>\n\n    <div class=\"form-group has-error\">\n    <p class=\"help-block\" ng-show=\"form.email.$error.required && form.password.$error.required && login.submitted\">\n       Please enter your email and password.\n    </p>\n\n    </div>\n</section>\n		<div class=\"md-dialog-actions\" layout=\"row\">\n	    <md-button type=\"submit\" class=\"md-raised circular-progress-button md-primary\" ng-disabled=\"!form.$valid || login.loading\" aria-label=\"Login\">\n	      <span ng-show=\"!login.loading\"><ng-md-icon icon=\"perm_identity\"></ng-md-icon>Login</span>\n	      <md-progress-circular md-mode=\"indeterminate\" md-diameter=\"25\" ng-show=\"login.loading\" class=\"md-accent md-hue-1\"></md-progress-circular><span ng-show=\"login.loading\">Loading...</span>\n	    </md-button>\n			<md-button class=\"btn btn-default btn-lg btn-register\" ui-sref=\"signup\" aria-label=\"SignUp\"> Signup </md-button>\n	  </div>\n\n	</form>\n\n</section>\n</md-content>\n<footer></footer>");
$templateCache.put("app/account/password/forgot.html","<navbar></navbar>\n<md-content flex layout=\"column\">\n<section layout=\"column\" flex layout-align=\"center center\">\n	<h1>Forgot Password</h1>\n\n	<p class=\"md-warn message\" ng-show=\"forgot.errors.message\">{{forgot.errors.message}}</p>\n\n	<form name=\"form\" ng-submit=\"forgot.forgot(form)\" novalidate>\n		<section class=\"section\" layout=\"column\">\n			<md-input-container md-is-error=\"(form.email.$error.required || form.email.$error.email || forgot.errors.other) && form.email.$dirty\">\n				<label>Email</label>\n				<input name=\"email\" type=\"email\" ng-model=\"forgot.user.email\" required md-autofocus/>\n				<div ng-messages=\"form.email.$error\" ng-if=\"form.email.$dirty\">\n					<div ng-message=\"required\">Email ID is required</div>\n					<div ng-message=\"email\">Please enter valid email address.</div>\n					<div ng-if=\"forgot.errors.email\">{{forgot.errors.email}}</div>\n				</div>\n			</md-input-container>\n		</section>\n		<div layout=\"column\" layout-align=\"center center\">\n			<md-button type=\"submit\" class=\"md-raised circular-progress-button md-primary\" ng-disabled=\"forgot.loading\" aria-label=\"Forgot password\" layout=\"row\" layout-align=\"center center\">\n				<ng-md-icon icon=\"email\" ng-hide=\"forgot.loading\"></ng-md-icon> \n				<md-progress-circular md-mode=\"indeterminate\" md-diameter=\"25\" ng-show=\"forgot.loading\" class=\"md-accent md-hue-1\"></md-progress-circular>\n				<span>&nbsp;Reset Password</span>\n			</md-button>\n		</div>\n	</form>\n\n</section>\n</md-content>\n<footer></footer>\n");
$templateCache.put("app/account/password/reset.html","<navbar></navbar>\n<md-content flex layout=\"column\">\n<section layout=\"column\" flex layout-align=\"center center\">\n	<h1>Enter New Password</h1>\n\n	<p class=\"md-warn message\" ng-show=\"reset.errors.message\">{{reset.errors.message}}</p>\n\n	<form name=\"form\" ng-submit=\"reset.reset(form)\" novalidate flex>\n	<section class=\"section\" layout=\"column\">\n\n		<md-input-container md-is-error=\"(form.password.$error.required ||  form.password.$error.mongoose || form.password.$error.minlength) && form.password.$dirty\">\n			<label>Password</label>\n			<input name=\"password\" type=\"password\" ng-model=\"reset.user.password\" required mongoose-error ng-minlength=\"3\"/>\n			<div ng-messages=\"form.password.$error\" ng-if=\"form.password.$dirty\">\n				<div ng-message=\"required\">Password is required</div>\n				<div ng-message=\"mongoose\">{{ errors.password }}</div>\n				<div ng-message=\"minlength\">Password must be at least 3 characters.</div>\n			</div>\n		</md-input-container>\n\n		<md-input-container flex class=\"last\" md-is-error=\"(form.passwordRepeat.$error.required ||  form.passwordRepeat.$error.minlength || form.passwordRepeat.$error.repeat-input) && form.passwordRepeat.$dirty\">\n			<label>Repeat Password</label>\n			<input name=\"passwordRepeat\" type=\"password\"  ng-model=\"reset.user.passwordRepeat\" required repeat-input=\"reset.user.password\" ng-minlength=\"3\">\n			<div ng-messages=\"form.passwordRepeat.$error\" ng-if=\"form.passwordRepeat.$dirty\">\n				<div ng-message=\"required\">Please repeat the new password</div>\n				<div ng-message=\"minlength\">Password must be at least 3 characters.</div>\n				<div ng-message=\"repeat-input\">The passwords do not match</div>\n				<div ng-if=\"reset.errors.email\">{{reset.errors.email}}</div>\n			</div>\n		</md-input-container>\n\n    <div class=\"form-group has-error\">\n    <p class=\"help-block\" ng-show=\"form.password.$error.required && form.password.$error.required && reset.submitted\">\n       Please enter your password.\n    </p>\n\n    </div>\n</section>\n\n		<div layout=\"column\" layout-align=\"center center\">\n	    <md-button type=\"submit\" class=\"md-raised circular-progress-button md-primary\" ng-disabled=\"!form.$valid || reset.loading\" aria-label=\"Login\" layout=\"row\" layout-align=\"center center\">\n	      <ng-md-icon icon=\"lock\" ng-show=\"!reset.loading\"></ng-md-icon>\n	      <md-progress-circular md-mode=\"indeterminate\" md-diameter=\"25\" ng-show=\"reset.loading\" class=\"md-accent md-hue-1\"></md-progress-circular>\n		  &nbsp;Save New Password\n	    </md-button>\n	  </div>\n\n	</form>\n\n</section>\n</md-content>\n<footer></footer>\n");
$templateCache.put("app/account/signup/signup.html","<navbar></navbar>\n<md-content flex layout=\"column\" class=\"content\" layout-align=\"start center\">\n<section layout=\"column\" layout-align=\"start center\">\n<h1>Signup</h1>\n\n		<form name=\"form\" ng-submit=\"signup.register(form)\" novalidate>\n\n			<section class=\"section\" layout=\"column\">\n				<md-input-container md-is-error=\"form.name.$error.required && form.name.$dirty\">\n					<label>Name</label>\n					<input name=\"name\" ng-model=\"signup.user.name\" required md-autofocus/>\n					<div ng-messages=\"form.name.$error\" ng-if=\"form.name.$dirty\">\n						<div ng-message=\"required\">Name is required</div>\n					</div>\n				</md-input-container>\n\n				<md-input-container flex md-is-error=\"(form.email.$error.email || form.email.$error.required || form.email.$error.mongoose || form.email.$error.remote-unique) && form.email.$dirty\">\n					<label>Email ID</label>\n					<input type=\"email\" name=\"email\" ng-model=\"signup.user.email\"\n								 ng-model-options=\"{updateOn: \'default blur\', debounce: {\'default\': 500, \'blur\': 0}}\"\n								 required mongoose-error>\n					<div ng-messages=\"form.email.$error\" ng-if=\"form.email.$dirty\">\n						<div ng-message=\"email\">Please enter a valid email address.</div>\n						<div ng-message=\"required\">Email is required</div>\n						<div ng-message=\"mongoose\">Email already in use</div>\n					</div>\n				</md-input-container>\n\n\n				<md-input-container md-is-error=\"(form.password.$error.required ||  form.password.$error.mongoose || form.password.$error.minlength) && form.password.$dirty\">\n					<label>Password</label>\n					<input name=\"password\" type=\"password\" ng-model=\"signup.user.password\" required mongoose-error ng-minlength=\"3\"/>\n					<div ng-messages=\"form.password.$error\" ng-if=\"form.password.$dirty\">\n						<div ng-message=\"required\">Password is required</div>\n						<div ng-message=\"mongoose\">{{ errors.password }}</div>\n						<div ng-message=\"minlength\">Password must be at least 3 characters.</div>\n					</div>\n				</md-input-container>\n\n				<md-input-container flex class=\"last\" md-is-error=\"(form.passwordRepeat.$error.required ||  form.passwordRepeat.$error.minlength || form.passwordRepeat.$error.repeat-input) && form.passwordRepeat.$dirty\">\n					<label>Repeat Password</label>\n					<input name=\"passwordRepeat\" type=\"password\"  ng-model=\"signup.user.passwordRepeat\" required repeat-input=\"signup.user.password\" ng-minlength=\"3\">\n					<div ng-messages=\"form.passwordRepeat.$error\" ng-if=\"form.passwordRepeat.$dirty\">\n						<div ng-message=\"required\">Please repeat the new password</div>\n						<div ng-message=\"minlength\">Password must be at least 3 characters.</div>\n						<div ng-message=\"repeat-input\">The passwords do not match</div>\n					</div>\n				</md-input-container>\n\n			</section>\n\n\n			<div class=\"md-dialog-actions\" layout=\"row\">\n				<span flex></span>\n				<md-button ng-disabled=\"form.$invalid || signup.loading\" class=\"md-primary md-raised circular-progress-button\" type=\"submit\" aria-label=\"SignUp\">\n					<span ng-show=\"!signup.loading\"><ng-md-icon icon=\"input\"></ng-md-icon> Signup</span>\n					<md-progress-circular md-mode=\"indeterminate\" md-diameter=\"25\" ng-show=\"signup.loading\" class=\"md-accent md-hue-1\"></md-progress-circular><span ng-show=\"signup.loading\">Loading...</span>\n				</md-button>\n				<md-button ng-click=\"signup.cancel();\" aria-label=\"Cancel SignUp\">Cancel</md-button>\n			</div>\n</form>\n</section>\n<oauth-buttons></oauth-buttons>\n</md-content>\n<footer></footer>");}]);