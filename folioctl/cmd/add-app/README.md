# add-app-to-platform

<!-- md2toc -l 2 README.md -->
* [Overview](#overview)
* [Deployment plugins](#deployment-plugins)
    * [Deployment plugin API](#deployment-plugin-api)
        * [`async deploy(logger, element)`](#async-deploylogger-element)
    * [Specific deployment plugins](#specific-deployment-plugins)
        * [The `okapi` deployment plugin](#the-okapi-deployment-plugin)
        * [The `flux` deployment plugin](#the-flux-deployment-plugin)
* [Templating](#templating)


## Overview

`add-app` is a [`folioctl`](..) command that adds an app to a FOLIO platform. It is driven by a single FAM file, which may be obtained via the WSAPI provided by [`mod-app-manager`](https://github.com/MikeTaylor/mod-app-manager) or by any other method.

While posting module descriptors to Okapi is always required, the details of how to deploy a module vary, and different organizations use different orchestration mechanisms. This step is therefore done using a plugin (see [below](#deployment-plugins)). The `okapi` plugin uses Okapi's built-in simple deployment mechanisms; others will be added, including `flux` to control Kubernetes.


## Deployment plugins

Deployment plugins are found in [the `deployment` subdirectory](deployment).


### Deployment plugin API

Each plugin must export the following functions (currently only one):

#### `async deploy(logger, element)`

This is an asynchronous function that performs deployment according to the approaching orchestration scheme. It is passed two arguments
* `logger` is the configured logger element (and is expected to use it to log with the `plugin` category).
* `element` represents the module to be deployed. This is one of the elements from the FAM file, representing a back-end module, enhanced by the addition of two extra members:
  * `md` is the downloaded module descriptor.
  * `caption` is a short human-readable caption representing the module, to be used in logging.

The `deploy` function must return (a promise yielding) an opaque identifier representing the deployed module, or throw an `Error` if something goes wrong.

The function may access additional information from the environment: for example, the `okapi` plugin uses the environment variables documented [above](#okapi-access) (`OKAPI_URL`, `OKAPI_TENANT`, `OKAPI_TOKEN`) that are also used in posting the module descriptor.



### Specific deployment plugins

The following plugins are supported (currently only one):

#### The `okapi` deployment plugin

This plugin uses [Okapi's own deployment mechanisms](https://github.com/folio-org/okapi/blob/master/doc/guide.md#deployment-and-discovery) to start modules by posting a suitable deployment descriptor to `_/discovery/modules`.

In general, we want to be able to add apps whose backend elements' Docker images are hosted anywhere -- DockerHub, GitHub Packages, FOLIO's own Docker registry, or elsewhere. Depending on how Okapi is configured, this may not be supported: for example, the Okapi included in FOLIO Vagrant boxes for development is configured onloy to fetch Docker images from the FOLIO registry, which caches images from DockerHub, so as to prevent over-use of DockerHub that would trigger its rate-limiting. If this is the case for the Okapi that you are working with, attempts to deploy Docker containers from sources other than those configured will fail with messages like

> Error: POST _/discovery/modules failed with status 400: getImage HTTP error 404
> No such image: docker.ci.folio.org/ghcr.io/miketaylor/mod-app-store:v1.1.0

The giveaway here is the double hostname at the start: the Docker image URL `ghcr.io/miketaylor/mod-app-store:v1.1.0` supplied as part of the FAM file has been prepended with the configured hostname `docker.ci.folio.org`.

To resolve this problem, it's necessary to change your [Okapi configuration](https://github.com/folio-org/okapi/blob/master/doc/guide.md#okapi-configuration), modifying the `dockerRegistries` setting. This is an array of objects, each representing a supported registry: to the end of this array, add an entry with `registry` set to the empty string.

Making this change to a running Okapi can be troublesome. Here is one approach that is known to work:

1. Edit `/etc/folio/okapi/okapi.json`. Set the `dockerRegistries` key to `[{"username":"indexdata","password":"[REDACTED]"},{}]`
2. Stop Okapi with `docker stop okapi`. Make sure all the containers are down. `docker ps` should only show containers for Stripes, edge modules, Elasticsearch, Kafka, and Zookeeper. If there are any regular module containers (`mod-xxx`), you’ll need to remove them with `docker rm -f`. Yes, this is a pain. Sorry.
3. Start Okapi with `docker start okapi`. This will read in the new config file and start up all the containers. It will take the usual amount of time (5 minutes? Something like that).

It should then be possible to deploy Docker-based modules from any source.

#### The `flux` deployment plugin

[Flux](https://fluxcd.io/) watches git repositories that contain Kubernetes configuration, notices when changes are pushed, and instructs Kubernetes to make the necessary changes. It is the way Index Data manages its Kubernetes deployment of FOLIO. The `flux` deployment plugin works by pushing files to a configured git repository for Flux to notice.



## Templating

XXX Use https://github.com/cykerway/jinja-cli


