'use strict';

/**
 * Exports all CLI modules.
 */
module.exports = [
	require( './modules/site'             ),
	require( './modules/insecure'         ),
	require( './modules/describe'         ),
	require( './modules/update'           ),
	require( './modules/auth'             ),
	require( './modules/routes'           ),
	require( './modules/attachment'       ),
	require( './modules/method'           ),
	require( './modules/bool-loader'      ),
	require( './modules/file-loader'      ),
	require( './modules/dict-loader'      ),
	require( './modules/text-loader'      ),
	require( './modules/output-formatter' ),
];
