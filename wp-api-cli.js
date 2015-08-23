#!/usr/bin/env node

var	fs       = require( 'fs'                  ),
	cli      = require( 'cli'                 ),
	readline = require( 'readline'            ),
	open     = require( 'open'                ),
	WpApi    = require( './lib/wp-api'        ),
	cliPosts = require( './lib/modules/posts' ),

	options  = buildOptions(),
	commands = buildCommands();

function buildOptions() {
	var	key,
		options = {
			site:  [ 's', '(Required) Set base URL to use', 'STRING' ],
			debug: [ 'd', 'Turns on debugging mode, will output interactions with server' ],

			/* Support HTTPS with self signed certificate. */
			insecure: [ 'k', 'Allow connections to SSL sites without certs' ],

			/* HTTP Basic-Auth */
			user: [ 'u', 'Set username to use for HTTP Basic Authentication', 'STRING' ],
			pass: [ 'p', 'Set password to use for HTTP Basic Authentication', 'STRING' ],

			/* OAuth */
			oauth_key:    [ false, 'OAuth Consumer Key', 'STRING' ],
			oauth_secret: [ false, 'OAuth Consumer Secret', 'STRING' ],
			oauth_file:   [ 'o', 'OAuth authorization file created by "authenticate" command', 'FILE', 'oauth.json' ],

			/*
			 * Page schema
			 *
			 * Helpers: 'page_json', 'page_content_file'.
			 */
			page_json:           [ false, 'Content of FILE will be used as the entire request, other "page_*" options are ignored.', 'FILE' ],
			page_date:           [ false, 'The date the object was published.', 'STRING' ],
			page_date_gmt:       [ false, 'The date the object was published, as GMT.', 'STRING' ],
			page_guid:           [ false, 'The globally unique identifier for the object.', 'STRING' ],
			page_id:             [ false, 'Unique identifier for the object.', 'STRING' ],
			page_link:           [ false, 'URL to the object.', 'STRING' ],
			page_modified:       [ false, 'The date the object was last modified.', 'STRING' ],
			page_modified_gmt:   [ false, 'The date the object was last modified, as GMT.', 'STRING' ],
			page_password:       [ false, 'A password to protect access to the post.', 'STRING' ],
			page_slug:           [ false, 'An alphanumeric identifier for the object unique to its type.', 'STRING' ],
			page_status:         [ false, 'A named status for the object.', 'STRING' ],
			page_type:           [ false, 'Type of Post for the object.', 'STRING' ],
			page_parent:         [ false, 'The ID for the parent of the object.', 'STRING' ],
			page_title:          [ false, 'The title for the object.', 'STRING' ],
			page_content:        [ false, 'The content for the object.', 'STRING' ],
			page_content_file:   [ false, 'Content of FILE will be used as content of page, use "stdin" to load from STDIN.', 'FILE' ],
			page_author:         [ false, 'The ID for the author of the object.', 'STRING' ],
			page_excerpt:        [ false, 'The excerpt for the object.', 'STRING' ],
			page_featured_image: [ false, 'ID of the featured image for the object.', 'STRING' ],
			page_comment_status: [ false, 'Whether or not comments are open on the object.', 'STRING' ],
			page_ping_status:    [ false, 'Whether or not the object can be pinged.', 'STRING' ],
			page_menu_order:     [ false, 'The order of the object in relation to other object of its type.', 'STRING' ],
			page_template:       [ false, 'The theme file to use to display the object.', 'STRING' ],

			/*
			 * Media schema
			 *
			 * Helpers: 'media_json', 'media_file', 'media_file_name', 'media_file_type'
			 */
			media_json:           [ false, 'Content of FILE will be used as the entire request, other "media_*" options are ignored, except for "media_file" and "media_file_name".', 'FILE' ],
			media_file:           [ false, 'FILE will be used as the media to be created.', 'FILE' ],
			media_file_name:      [ false, 'File name of the attachment. If using this, also set "media_file_type".', 'STRING' ],
			media_file_type:      [ false, 'Content-Type of the attachment. If using this, also set "media_file_name".', 'STRING' ],
			media_date:           [ false, 'The date the object was published.', 'STRING' ],
			media_date_gmt:       [ false, 'The date the object was published, as GMT.', 'STRING' ],
			media_guid:           [ false, 'The globally unique identifier for the object.', 'STRING' ],
			media_id:             [ false, 'Unique identifier for the object.', 'STRING' ],
			media_link:           [ false, 'URL to the object.', 'STRING' ],
			media_modified:       [ false, 'The date the object was last modified.', 'STRING' ],
			media_modified_gmt:   [ false, 'The date the object was last modified, as GMT.', 'STRING' ],
			media_password:       [ false, 'A password to protect access to the post.', 'STRING' ],
			media_slug:           [ false, 'An alphanumeric identifier for the object unique to its type.', 'STRING' ],
			media_status:         [ false, 'A named status for the object.', 'STRING' ],
			media_type:           [ false, 'Type of Post for the object.', 'STRING' ],
			media_title:          [ false, 'The title for the object.', 'STRING' ],
			media_author:         [ false, 'The ID for the author of the object.', 'STRING' ],
			media_comment_status: [ false, 'Whether or not comments are open on the object.', 'STRING' ],
			media_ping_status:    [ false, 'Whether or not the object can be pinged.', 'STRING' ],
			media_alt_text:       [ false, 'Alternative text to display when attachment is not displayed.', 'STRING' ],
			media_caption:        [ false, 'The caption for the attachment.', 'STRING' ],
			media_description:    [ false, 'The description for the attachment.', 'STRING' ],
			media_media_type:     [ false, 'Type of attachment.', 'STRING' ],
			media_media_details:  [ false, 'Details about the attachment file, specific to its type.', 'STRING' ],
			media_post:           [ false, 'The ID for the associated post of the attachment.', 'STRING' ],
			media_source_url:     [ false, 'URL to the original attachment file.', 'STRING' ],
		};

	/* Load all options from Posts module. */
	for ( key in cliPosts.options ) {
		if ( cliPosts.options.hasOwnProperty( key ) ) {
			options[ key ] = cliPosts.options[ key ];
		}
	}

	return options;
}

function buildCommands() {
	var commands = {
			authenticate: 'Authenticate with site, will issue OAuth tokens',

			/* Page */
			page_list:    'List all Pages',
			page_create:  'Create a Page, use "page_*" options',
			page_get:     'Retrieve a Page, use "page_id" option',
			page_update:  'Update a Page, use "page_*" options',
			page_delete:  'Delete a Page, use "page_id" option',

			/* Media */
			media_list:   'List all Medias',
			media_create: 'Create a Media, use "media_*" options',
			media_get:    'Retrieve a Media, use "media_id" option',
			media_update: 'Update a Media, use "media_*" options',
			media_delete: 'Delete a Media, use "media_id" option',
		};

	/* Load all commands from Posts module. */
	for ( key in cliPosts.commands ) {
		if ( cliPosts.commands.hasOwnProperty( key ) ) {
			commands[ key ] = cliPosts.commands[ key ].label;
		}
	}

	return commands;
}

cli.setUsage( 'wp-api-cli [OPTIONS] <COMMAND>' );

cli.option_width = 38;

cli.parse( options, commands );

cli.main( function ( args, options ) {
	var	config,
		wpApi;

	validateAndSanitize( options );

	/* Allow connections to SSL sites without certs */
	if ( options.insecure ) {
		process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
	}

	if ( ( ! options.user || ! options.pass ) && cli.command !== 'authenticate' ) {
		cli.info( 'Using OAuth authentication.' );
		fs.readFile( options.oauth_file, 'utf8', function ( error, content ) {
			var oauthConfig;

			if ( error ) {
				cli.fatal( error );
			}

			oauthConfig = JSON.parse( content );

			config = {
				site:  options.site,
				debug: options.debug,
				oauth: oauthConfig
			};

			wpApi = new WpApi( config );

			processCommand( args, options, wpApi );
		});
	} else {
		cli.info( 'Using HTTP Basic authentication.' );
		config = {
			site:  options.site,
			user:  options.user,
			pass:  options.pass,
			debug: options.debug
		};

		wpApi = new WpApi( config );

		processCommand( args, options, wpApi );
	}
});

/**
 * Validate and sanitize user input.
 */
function validateAndSanitize( options ) {
	if ( ! options.site ) {
		cli.fatal( 'Missing base URL. Please, set a base URL by using `-s` or `--site`.' );
	}
	if ( options.site[-1] !== '/' ) {
		options.site = options.site + '/';
	}
}

function processCommand( args, options, wpApi ) {
	var key;

	/* Handle Posts module commands */
	for ( key in cliPosts.commands ) {
		if ( cliPosts.commands.hasOwnProperty( key ) ) {
			if ( cli.command === key ) {
				cliPosts.commands[ key ].handler( cli, args, options, wpApi );
				return;
			}
		}
	}

	switch ( cli.command ) {
		case 'authenticate':
			authenticate( args, options, wpApi );
			break;

		/*
		 * Page
		 */

		case 'page_list':
			wpApi.listPages( function ( error, data ) {
				if ( error ) {
					cli.fatal( error );
				}
				console.log( data );
			});
			break;

		case 'page_get':
			wpApi.getPage( options.page_id, function ( error, thePage ) {
				if ( error ) {
					cli.fatal( error );
				}
				console.log( thePage );
			});
			break;

		case 'page_create':
			createPage( args, options, wpApi );
			break;

		case 'page_update':
			updatePage( args, options, wpApi );
			break;

		case 'page_delete':
			wpApi.deletePage( options.page_id, function ( error ) {
				if ( error ) {
					cli.fatal( error );
				}
				cli.ok('Page deleted.');
			});
			break;

		/*
		 * Media
		 */

		case 'media_list':
			wpApi.listMedias( function ( error, data ) {
				if ( error ) {
					cli.fatal( error );
				}
				console.log( data );
			});
			break;

		case 'media_get':
			wpApi.getMedia( options.media_id, function ( error, theMedia ) {
				if ( error ) {
					cli.fatal( error );
				}
				console.log( theMedia );
			});
			break;

		case 'media_create':
			createMedia( args, options, wpApi );
			break;

		case 'media_update':
			updateMedia( args, options, wpApi );
			break;

		case 'media_delete':
			wpApi.deleteMedia( options.media_id, function ( error ) {
				if ( error ) {
					cli.fatal( error );
				}
				cli.ok('Media deleted.');
			});
			break;
	}
}

function authenticate( args, options, wpApi ) {
	var oauthConfig = {
		oauth_consumer_key:    options.oauth_key,
		oauth_consumer_secret: options.oauth_secret
	};

	if ( ! oauthConfig.oauth_consumer_key || ! oauthConfig.oauth_consumer_secret ) {
		cli.fatal( 'Missing OAuth consumer key and secret.' );
	}

	wpApi.fetchOauthRequestToken( oauthConfig, function ( error, response ) {
		var rl;
		if ( error ) {
			cli.fatal( error );
		}

		oauthConfig.oauth_token = response.oauth_token;
		oauthConfig.oauth_token_secret = response.oauth_token_secret;

		cli.info( 'Follow authorization process on browser.' );
		open( response.authorizeUrl );

		rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout
		});

		rl.question( 'Enter your verification token: ', function ( verificationToken ) {
			if ( ! verificationToken ) {
				return;
			}

			oauthConfig.oauth_verifier = verificationToken;

			wpApi.fetchOauthAccessToken( oauthConfig, function ( error, response ) {
				if ( error ) {
					cli.fatal( error );
				}

				var oauthCredentials = {
					oauth_consumer_key:    oauthConfig.oauth_consumer_key,
					oauth_consumer_secret: oauthConfig.oauth_consumer_secret,
					oauth_token:           response.oauth_token,
					oauth_token_secret:    response.oauth_token_secret
				};

				fs.writeFile( 'oauth.json', JSON.stringify( oauthCredentials ), function ( error ) {
					if ( error ) {
						cli.fatal( error );
					}
					cli.ok( 'Credentials saved as "oauth.json". This is a sensitive file, make sure to protect it.');
					rl.close();
				});
			});
		});
	});
}

/*
 * Page
 */

function createPage( args, options, wpApi, callback ) {
	resolvePage( args, options, function ( error, thePage ) {
		if ( error ) {
			callback( error );
			return;
		}

		wpApi.createPage( thePage, function ( error, createdPage ) {
			if ( error ) {
				cli.fatal( error );
			}
			cli.ok( 'Page created.' );
			console.log( createdPage );
		});
	});
}

function updatePage( args, options, wpApi, callback ) {
	resolvePage( args, options, function ( error, thePage ) {
		if ( error ) {
			callback( error );
			return;
		}

		wpApi.updatePage( thePage, function ( error, createdPage ) {
			if ( error ) {
				cli.fatal( error );
			}
			cli.ok( 'Page updated.' );
			console.log( createdPage );
		});
	});
}

function resolvePage( args, options, callback ) {
	if ( options.page_json !== null ) {
		fs.readFile( options.page_json, 'utf8', function ( error, fileContent ) {
			if ( error ) {
				callback( error );
				return;
			}
			callback( false, fileContent );
		});
	} else {
		resolvePageContent( args, options, function ( error, pageContent ) {
			var	thePage = {};

			if ( error ) {
				callback( error );
				return;
			}

			if ( pageContent !== null ) {
				thePage.content = pageContent;
			}
			if ( options.page_date !== null ) {
				thePage.date = options.page_date;
			}
			if ( options.page_date_gmt !== null ) {
				thePage.date_gmt = options.page_date_gmt;
			}
			if ( options.page_guid !== null ) {
				thePage.guid = options.page_guid;
			}
			if ( options.page_id !== null ) {
				thePage.id = options.page_id;
			}
			if ( options.page_link !== null ) {
				thePage.link = options.page_link;
			}
			if ( options.page_modified !== null ) {
				thePage.modified = options.page_modified;
			}
			if ( options.page_modified_gmt !== null ) {
				thePage.modified_gmt = options.page_modified_gmt;
			}
			if ( options.page_password !== null ) {
				thePage.password = options.page_password;
			}
			if ( options.page_slug !== null ) {
				thePage.slug = options.page_slug;
			}
			if ( options.page_status !== null ) {
				thePage.status = options.page_status;
			}
			if ( options.page_type !== null ) {
				thePage.type = options.page_type;
			}
			if ( options.page_parent !== null ) {
				thePage.parent = options.page_parent;
			}
			if ( options.page_title !== null ) {
				thePage.title = options.page_title;
			}
			if ( options.page_author !== null ) {
				thePage.author = options.page_author;
			}
			if ( options.page_excerpt !== null ) {
				thePage.excerpt = options.page_excerpt;
			}
			if ( options.page_featured_image !== null ) {
				thePage.featured_image = options.page_featured_image;
			}
			if ( options.page_comment_status !== null ) {
				thePage.comment_status = options.page_comment_status;
			}
			if ( options.page_ping_status !== null ) {
				thePage.ping_status = options.page_ping_status;
			}
			if ( options.page_menu_order !== null ) {
				thePage.menu_order = options.page_menu_order;
			}
			if ( options.page_template !== null ) {
				thePage.template = options.page_template;
			}

			callback( false, thePage );
		});
	}
}

function resolvePageContent( args, options, callback ) {
	if ( options.page_content_file !== null ) {
		if ( options.page_content_file === 'stdin' ) {
			cli.info( 'Loading page content from STDIN.' );
			cli.withStdin( function ( stdin ) {
				callback( false, stdin );
			});
		} else {
			cli.info( 'Loading page content from file "' + options.page_content_file + '".' );
			fs.readFile( options.page_content_file, 'utf8', function ( error, fileContent ) {
				if ( error ) {
					callback( 'Error while loading page content from file "' + options.page_content_file + '": ' + error );
				}
				callback( false, fileContent );
			});
		}
	} else {
		callback( false, options.page_content );
	}
}


/*
 * Media
 */

function createMedia( args, options, wpApi, callback ) {
	resolveMedia( args, options, function ( error, theMedia ) {
		if ( error ) {
			callback( error );
			return;
		}

		wpApi.createMedia( theMedia, function ( error, createdMedia ) {
			if ( error ) {
				cli.fatal( error );
			}
			cli.ok( 'Media created.' );
			console.log( createdMedia );
		});
	});
}

function updateMedia( args, options, wpApi, callback ) {
	resolveMedia( args, options, function ( error, theMedia ) {
		if ( error ) {
			callback( error );
			return;
		}

		wpApi.updateMedia( theMedia, function ( error, createdMedia ) {
			if ( error ) {
				cli.fatal( error );
			}
			cli.ok( 'Media updated.' );
			console.log( createdMedia );
		});
	});
}

function resolveMedia( args, options, callback ) {
	if ( options.media_json !== null ) {
		fs.readFile( options.media_json, 'utf8', function ( error, fileContent ) {
			var theMedia;

			if ( error ) {
				callback( error );
				return;
			}

			theMedia = fileContent;

			loadMediaFile( args, options, theMedia );

			callback( false, theMedia );
		});
	} else {
		var	theMedia = {};

		loadMediaFile( args, options, theMedia );

		if ( options.media_date !== null ) {
			theMedia.date = options.media_date;
		}
		if ( options.media_date_gmt !== null ) {
			theMedia.date_gmt = options.media_date_gmt;
		}
		if ( options.media_guid !== null ) {
			theMedia.guid = options.media_guid;
		}
		if ( options.media_id !== null ) {
			theMedia.id = options.media_id;
		}
		if ( options.media_link !== null ) {
			theMedia.link = options.media_link;
		}
		if ( options.media_modified !== null ) {
			theMedia.modified = options.media_modified;
		}
		if ( options.media_modified_gmt !== null ) {
			theMedia.modified_gmt = options.media_modified_gmt;
		}
		if ( options.media_password !== null ) {
			theMedia.password = options.media_password;
		}
		if ( options.media_slug !== null ) {
			theMedia.slug = options.media_slug;
		}
		if ( options.media_status !== null ) {
			theMedia.status = options.media_status;
		}
		if ( options.media_type !== null ) {
			theMedia.type = options.media_type;
		}
		if ( options.media_title !== null ) {
			theMedia.title = options.media_title;
		}
		if ( options.media_author !== null ) {
			theMedia.author = options.media_author;
		}
		if ( options.media_comment_status !== null ) {
			theMedia.comment_status = options.media_comment_status;
		}
		if ( options.media_ping_status !== null ) {
			theMedia.ping_status = options.media_ping_status;
		}
		if ( options.media_alt_text !== null ) {
			theMedia.alt_text = options.media_alt_text;
		}
		if ( options.media_caption !== null ) {
			theMedia.caption = options.media_caption;
		}
		if ( options.media_description !== null ) {
			theMedia.description = options.media_description;
		}
		if ( options.media_media_type !== null ) {
			theMedia.media_type = options.media_media_type;
		}
		if ( options.media_media_details !== null ) {
			theMedia.media_details = options.media_media_details;
		}
		if ( options.media_post !== null ) {
			theMedia.post = options.media_post;
		}
		if ( options.media_source_url !== null ) {
			theMedia.source_url = options.media_source_url;
		}

		callback( false, theMedia );
	}
}

function loadMediaFile( args, options, theMedia ) {
	if ( options.media_file !== null ) {
		if ( options.media_file_name !== null || options.media_file_type !== null ) {
			theMedia.file = {
				value: fs.createReadStream( options.media_file ),
				options: {
					filename:    options.media_file_name,
					contentType: options.media_file_type
				}
			};
		} else {
			theMedia.file = fs.createReadStream( options.media_file );
		}
	}
}