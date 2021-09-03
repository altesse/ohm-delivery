const serverUrl = 'http://localhost:3000';
angular
    .module("ohm-delivery", ['pascalprecht.translate'])
    .config(["$translateProvider", function ($translateProvider) {
        $translateProvider.useStaticFilesLoader({
          prefix: 'locales/locale-',
          suffix: '.json'
        });
        $translateProvider.useSanitizeValueStrategy('escape');
        $translateProvider.determinePreferredLanguage();
        $translateProvider.fallbackLanguage('en');
    }])
    .controller("tracking", function($scope, $http, $translate) {
        const clearScope = function() {
            $scope.ohmStatus = undefined;
            $scope.ohmComment = '';
            $scope.ohmStatusMsg = '';
            $scope.ohmStatusI18n = '';
            $scope.ohmDescription = undefined;
        }

        $scope.queryTrackingId = function() {
            $http.get(`${serverUrl}/trackedOhms/${this.trackingId}`)
            .then((result) => {
                $scope.errorMessage = '';
                $scope.ohmStatus = result.data.status;
                $scope.ohmDescription = result.data.description;
                $scope.ohmComment = result.data.comment;
                $scope.ohmStatusOptions = getStatusOptions($scope.ohmStatus, $translate);
                $scope.ohmStatusMsg = $translate.instant('ORDER_STATUS_IS', { id: $scope.trackingId });
                $scope.ohmStatusI18n = $translate.instant(getStatusI18nKey($scope.ohmStatus));
            }, (error) => {
                clearScope();
                if (error.status === 404) {
                    $scope.errorMessage = $translate.instant('ORDER_NOT_FOUND', { id: $scope.trackingId });
                } else {
                    $scope.errorMessage = $translate.instant('REQUEST_ERROR');
                }
            });
        };

        $scope.queryStatusByTrackingId = function() {
            $http.get(`${serverUrl}/trackedOhms/status/${this.trackingId}`)
            .then((result) => {
                $scope.errorMessage = '';
                $scope.ohmStatus = result.data.status;
                $scope.ohmComment = result.data.comment;
                $scope.ohmStatusOptions = getStatusOptions($scope.ohmStatus, $translate);
                $scope.ohmStatusSelected = ($scope.ohmStatusOptions && $scope.ohmStatusOptions.length && $scope.ohmStatusOptions[0]) || undefined;
                $scope.ohmStatusMsg = $translate.instant('ORDER_STATUS_IS', { id: $scope.trackingId });
                $scope.ohmStatusI18n = $translate.instant(getStatusI18nKey($scope.ohmStatus));
            }, (error) => {
                clearScope();
                if (error.status === 404) {
                    $scope.errorMessage = $translate.instant('ORDER_NOT_FOUND', { id: $scope.trackingId });
                } else {
                    $scope.errorMessage = $translate.instant('REQUEST_ERROR');
                }
            });
        };

        $scope.isFinal = isFinal;

        $scope.updateOhmStatus = function() {
            if (!$scope.refReason && $scope.ohmStatusSelected && $scope.ohmStatusSelected.value === 'REFUSED') {
               $scope.updChckErrorMessage = $translate.instant('MANDATORY_FIELD');
               return;
            }
            $scope.updChckErrorMessage = '';
            $http.post(`${serverUrl}/trackedOhms/status/${this.trackingId}`, { ...$scope.ohmStatusSelected, comment: $scope.refReason })
            .then((result) => {
                $scope.refReason = '';
                $scope.errorMessage = '';
                $scope.ohmStatus = $scope.ohmStatusSelected.value;
                $scope.ohmStatusOptions = getStatusOptions($scope.ohmStatus, $translate);
                $scope.ohmStatusSelected = ($scope.ohmStatusOptions && $scope.ohmStatusOptions.length && $scope.ohmStatusOptions[0]) || undefined;
                $scope.ohmStatusMsg = $translate.instant('ORDER_STATUS_IS', { id: $scope.trackingId });
                $scope.ohmStatusI18n = $translate.instant(getStatusI18nKey($scope.ohmStatus));
            }, (error) => {
                clearScope();
                if (error.status === 404) {
                    $scope.errorMessage = $translate.instant('ORDER_NOT_FOUND', { id: $scope.trackingId });
                } else {
                    $scope.errorMessage = $translate.instant('REQUEST_ERROR');
                }
            });
        };
    });