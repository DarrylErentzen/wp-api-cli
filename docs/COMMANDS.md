Commands
========

See all available arguments and commands by reading the help.

```bash
wp-api-cli --help
```

Basic options
-------------

- `--insecure` or `-k` lets you connect to insecure sites (e.g. with self-signed certificates).
- `--debug` or `-d` will print each HTTP request issued to the server.
- `--site` or `-s` will set the site to connect to.
- `--method` or `-X` defines the HTTP verb to use in the request, defaults to `GET`.

Helpers
-------

These options are not in the API, they only exist in the CLI to help you.

- `--attachment` let you set a file to send as an attachment of the request, needed to create Media. See also `--attachment_type` and `--attachment_name`.

Prefixes
--------

All options allow the use of special prefixes to change how it's handled by the CLI.

### File Prefix

To set the content of an option as the content of a file, just prefix the file name with `file:`.
For example, to set the option "foo" to be the content of file "bar.txt":

```bash
wp-api-cli command --foo file:bar.txt
```

### Dict Prefix

To set an option as a dictionary, use prefix `dict:`.

A dictionary is handled as a named array in query parameters. For example:

```bash
wp-api-cli posts --filter dict:s=foo
# > GET https://example.com/wp-json/wp/v2/posts?filter[s]=foo
```

When sent as body, it will be an embedded JSON object.

### Text Prefix

To let you use a special prefix as the actual content of an option, you may prefix the option with `text:`.
For example, to set the option "foo" to "file:bar.txt":

```bash
wp-api-cli --foo text:file:bar.txt
```

Update CLI definitions
----------------------

The first command you should run is `update` to make sure you have the latest API description from your site.

```bash
wp-api-cli update --site https://example.com
```

After updating the CLI definitions, it will default to use the site from the API description, but you can change it
by passing `--site` or `-s` at each command.

Describe the API
----------------

Outputs a description of the API. As it is a big JSON, it is easier to see if you output it to a file.

```bash
wp-api-cli describe > api-description.txt
```

Get more info about a command
-----------------------------

Want to see arguments accepted by a command or the routes it maps to?

Easy, just ask for it:

```bash
wp-api-cli info posts
```

Example output:

```
INFO: Using OAuth authentication.
INFO:
INFO: Route: /wp/v2/posts
INFO:   Arguments for GET:
INFO:     --context.............: Defines which properties to project (Accepts view, embed, edit)
INFO:     --page................: Number of page to load
INFO:     --per_page............: Quantity of posts to fetch per page
INFO:     --filter..............: Filter to apply to the query
INFO:   Arguments for POST:
INFO:     --date................: The date the object was published.
INFO:     --date_gmt............: The date the object was published, as GMT.
INFO:     --modified............: The date the object was last modified.
INFO:     --modified_gmt........: The date the object was last modified, as GMT.
INFO:     --password............: A password to protect access to the post.
INFO:     --slug................: An alphanumeric identifier for the object unique to its type.
INFO:     --status..............: A named status for the object.
INFO:     --title...............: The title for the object.
INFO:     --content.............: The content for the object.
INFO:     --author..............: The ID for the author of the object.
INFO:     --excerpt.............: The excerpt for the object.
INFO:     --featured_image......: ID of the featured image for the object.
INFO:     --comment_status......: Whether or not comments are open on the object.
INFO:     --ping_status.........: Whether or not the object can be pinged.
INFO:     --format..............: The format for the object.
INFO:     --sticky..............: Whether or not the object should be treated as sticky.
INFO:
INFO: Route: /wp/v2/posts/(?P<id>[\d]+)
INFO:   Path arguments (required):
INFO:     --id
INFO:   Arguments for GET:
INFO:     --context
INFO:   Arguments for POST, PUT, PATCH:
INFO:     --date................: The date the object was published.
INFO:     --date_gmt............: The date the object was published, as GMT.
INFO:     --modified............: The date the object was last modified.
INFO:     --modified_gmt........: The date the object was last modified, as GMT.
INFO:     --password............: A password to protect access to the post.
INFO:     --slug................: An alphanumeric identifier for the object unique to its type.
INFO:     --status..............: A named status for the object.
INFO:     --title...............: The title for the object.
INFO:     --content.............: The content for the object.
INFO:     --author..............: The ID for the author of the object.
INFO:     --excerpt.............: The excerpt for the object.
INFO:     --featured_image......: ID of the featured image for the object.
INFO:     --comment_status......: Whether or not comments are open on the object.
INFO:     --ping_status.........: Whether or not the object can be pinged.
INFO:     --format..............: The format for the object.
INFO:     --sticky..............: Whether or not the object should be treated as sticky.
INFO:   Arguments for DELETE:
INFO:     --force
```

(!) This will only work with commands fetched from the API description.

Commands
--------

The standard WP-API endpoints are documented in separate files. Take a look at [standard-endpoints](standard-endpoints/) folder, each command has a file there.