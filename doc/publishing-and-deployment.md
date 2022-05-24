# Publishing and Deployment

Notes from meeting of 2022-05-24


## Devops

Two separate processes:
* Org A builds modules A1 and A2 and reposits them in Org B's repositories
* Org C installs and deploys modules from Org B's repositories

And or all of A, B and C might be, but need not be the same organisation.
* Current model: A and B are both @folio, C can be anyone
* Harvester model: A, B and C are all IndexData
* Generalised model: A is MikeTaylor, B is IndexData, C is Duke

Wayne will sketch document explaining how to be org A, B and/or C. (Mike can polish.)

David may rework snapshot-build workflow to autogenerate version numbers

But how we do the workflows right now is matter of policy, not mechanism

Since the Harvester Admin modules are not going to move into @folio, why do we use a FOLIO Jira? Ask Charlotte


## Stripes

Three processes are involved in building a bundle:
1. Transpilation of some (not all) included packages. (JS ecosystem generally expects modules to be distributed in already-transpiled form)
2. Stripesification of some (not all) included packages (gather translation, provide icons, etc.)
3. Bundling the result

XXX Babel does #1, WebPack does #3; what does #2?

The `stripes.config.js` file specifies which Stripes modules exist, all of which need #1 and #2.

The `stripesDep` entry in e.g. `ui-rs/package.json` tells the build process which included packages need to be transpiled and stripesified.

JS ecosystem may be moving towards more sophisticated and configurable approaches to transpilation, bundling and distribution which, had they existed five years ago, would have been useful to us. but we had to roll our own. We may in future be able to throw away some parts of what we've built.


