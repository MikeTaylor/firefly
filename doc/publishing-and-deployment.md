# Publishing and deployment

Notes from meeting of 2022-05-24


## Separation of roles in module publishing and deployment

We are FOLIO developers who have mostly been writing Node packages in the `@folio` workspace, storing the code in the `folio-org` GitHub space and publishing to the FOLIO repositories (for module descriptors, docker containers and NPM packages) and then deploying from these sources to FOLIO instances such as [snapshot](https://folio-snapshot.dev.folio.org/). Because of this, we have tended to overlook the separation that exists between different stages of this pipeline, and the different organization that can be in control of the different parts.

(For this discussion, we assume all code is held in GitHub, as we are using GitHub Actions for automation.)

Using UI modules for this example (though the same applies for back-end modules), four entities (A-D) are involved in the most general case:

* A developer works on a Stripes module `@gbv/room-booking` in namespace `@gbv` (Node namespace A) ...
* ... held in the GitHub repository `folio-de/room-booking` in namespace `folio-de` (GitHub namespace B) ...
* ... and whose module descriptor is published in FOLIO registry run by Index Data (publisher C)
* That module is installed and deployed by Duke University (deployer D)

Organization D need not know or care anything about Node namespace A (except as part of the module name) or GitHub namespace B. All they need to know is that the Stripes module `@gbv/room-booking` can be had from the Index Data registry.

> **TODO.**
> At present, organization D also needs to know what NPM registry to fetch the Node package from (for a UI module) or what container registry to fetch the Docker container from. Either these links should be contained in the module descriptor fetched from the registry, or a higher-level "FOLIO app" package file should include links into the FOLIO registry, the NPM registry and the Docker registry. XXX file a Jira.

Any or all of A, B, C and D might be, but need not be, the same organization. For example consider the case of any Flower Release app, such as `ui-inventory`, being deployed on snapshot:
* `@folio/inventory` is in FOLIO's Node namespace
* `folio-org/ui-inventory` is the home of the source code
* FOLIO's module registry receives the published module descriptor
* FOLIO's snapshot service retrieves this and deploys the app

This monolithic approach relies on the FOLIO organization at every step; we don't need to do this.

For the Harvester Admin app, the Node package `@indexdata/harvester-admin` is in Index Data's NPM space, the source code is in Index Data's GitHub area as `indexdata/ui-harvester-admin` and the module descriptor is published to Index Data's registry. We need to be careful that we don't end up just building a parallel Index Data monolith. It's important that we allow organizations to take whichever of the roles A-D that they want, and not require the whole stack to be provided in one place.

> **TODO.**
> We need documentation explaining how to function in each of the roles A, B, C and D. Wayne will sketch our this document; Mike can polish it if necessary. XXX file a Jira

> **TODO.**
> Since the Harvester Admin modules are not going to move into @folio, why do we use a FOLIO Jira? Ask Charlotte

David plans to rework the snapshot-build workflows to autogenerate version numbers rather than requiring the developer to manually push a tag that contains the snapshot number. But note that how we do the workflows right now is matter of policy, not mechanism: nothing in the details of how they presently run ties us to anything in future, or constrains how other organizations might do things.


## Note on building Stripes bundles

Three processes are involved in building a bundle:
1. Transpilation of some (not all) included packages. (JS ecosystem generally expects modules to be distributed in already-transpiled form)
2. Stripesification of some (not all) included packages (gather translation, provide icons, etc.)
3. Bundling the result

It is WebPack's job to do the last of these; in the process, it invokes Babel to do the first, and the WebPack plugin [`stripes-webpack`](https://github.com/folio-org/stripes-webpack) to do the second.

How does the plugin know which packages need to be Stripesified?
* The `stripes.config.js` file specifies which Stripes modules exist, all of which need to be Stripesified.
* The `stripesDep` entry in an app's package file (e.g., in [`ui-rs/package.json`](https://github.com/openlibraryenvironment/ui-rs/blob/593b2d2491707b8b82c05cb5e4a42aac86b0ff30/package.json#L60-L65)) tells the build process which additional included packages need to be transpiled and stripesified.

This part of the stripes-webpack code currently privileges the `@folio` namespace in various ways: we will fix this in [STRWEB-49](https://issues.folio.org/browse/STRWEB-49). Similarly, the Stripes CLI has special-case code for the `@folio` namespace, which we will fix in [STCLI-204](https://issues.folio.org/browse/STCLI-204).

The JavaScript ecosystem may be moving towards more sophisticated and configurable approaches to transpilation, bundling and distribution which, had they existed five years ago, would have been useful to us. but we had to roll our own. We may in future be able to throw away some parts of what we've built.


