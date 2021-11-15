# mafia - Modular Application for FOLIO: Installation Archive

This is a project to put FOLIO's foundational modularity to work, enabling a FOLIO installation in practice to support modular use of applications provided by third parties rather than being limited to the modules provided as part of a flower release. Getting this to happen involves both technical and social/political work. This project represents work on the technical aspect.


## Manifesto

Quoting from the abstract of _Modularity in FOLIO: principles, techniques and tools_ ([available as a preprint from Zenodo](https://zenodo.org/record/5703010): and submitted to the forthcoming FOLIO-themed special issue of the _International Journal of Librarianship_):

> From its earliest inception, FOLIO was conceived not as an ILS (Integrated Library System), but as a true Services Platform, composed of many independent but interdependent modules, and forming a foundation on which an ILS or other library software could be built out of relevant modules. This vision of modularity is crucial to FOLIO’s appeal to the library community, because it lowers the bar to participation: individual libraries may create modules that meet their needs, or hire developers to do so, or contribute to funding modules that will be of use to a broader community — all without needing “permission” from a central authority.

But at the time of writing, organizational issues mean that it is not straightforward in practice for organizations running FOLIO to install modules provided by sources other than their vendor, most often as a part of a ["flower release"](https://wiki.folio.org/display/REL/Flower+Release+Names). Module inclusion in flower releases is governed by [the FOLIO Technical Council](https://wiki.folio.org/display/TC/Technical+Council), whose remit is to emphasize maintaining quality in a curated set of modules. While this emphasis in some respects serves the community well, it does have the unwelcome side-effect of discouraging the creation of experimental modules, or making experimental deployments of works in progress.

The present project aims to remove technical barriers to easier packaging and deployment of FOLIO applications. In doing so, our hope is to make it easier for software developers to deliver FOLIO applications, and for system administrators to install those applications.


## Practical steps

There are several technical and social facilities that would need to be provided for a fully general FOLIO ecosysem to come into being. These include but may not be limited to the following:

* Defining a FOLIO-app "package" format -— a single concrete thing, broadly analogous to a Debian package, that a vendor can create and deliver, and that a FOLIO implementor can install. This may end up simply being a structured metadata file that points to other release-artifacts packages and includes information about how to deploy them.
* Some notion of module certificaton and assessment, so FOLIO implementors who want to install an app can have a degree of confidence in it. This will likely entail cryptographic signing, but also perhaps some form of independent QA, reviews, scores, etc.
* A simple UI to basic Okapi operations such as enabling and disabling modules. This might initially just be a page in [`ui-developer`](https://github.com/folio-org/ui-developer/), and might eventually develop in to an "app store" that can be used to install packages.


## Related work

* Mike Gorrell's draft document [_OLF Release/Package/App Store_](https://docs.google.com/document/d/1eaCwFLydFIviMiVrDBhJmTO_wuRgAMNsK2QEmQqMcZU/edit?pli=1#heading=h.7430ujqzdamg).


