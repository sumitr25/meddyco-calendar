;(function() {


	/**
	 * Place to store API URL or any other constants
	 * Usage:
	 *
	 * Inject CONSTANTS service as a dependency and then use like this:
	 * CONSTANTS.API_URL
	 */
  angular
  	.module('reservation-calendar')
    .constant('CONSTANTS', {
      'API_URL': 'http://localhost:4000/'
    });


})();
