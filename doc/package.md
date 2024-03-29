# Thoughts on the Firefly package format


<!-- md2toc -l 2 package.md -->
* [Introduction](#introduction)
* [Motivating examples](#motivating-examples)
* [Requirements](#requirements)
* [Implementation issues](#implementation-issues)
    * [Foundational assumption](#foundational-assumption)
    * [Package inclusion](#package-inclusion)
    * [Prior art](#prior-art)
* [Candidate technologies](#candidate-technologies)
    * [Zip archives](#zip-archives)
    * [Structured text](#structured-text)
    * [Virtual packages](#virtual-packages)


## Introduction

One of our goals is to define an installation-archive format for modular applications in FOLIO. In the present document, we start to consider what it might look like.


## Motivating examples

We have several nice motivating examples for the kinds of things we want the Firefly format to support:

* The simplest example would be the eusage-reports work done for the SLUB consortium. This consists only of a UI module (an event-handling plugin, in fact, [`ui-plugin-eusage-reports`](https://github.com/folio-org/ui-plugin-eusage-reports); and a back-end module, [`mod-eusage-reports`](https://github.com/folio-org/mod-eusage-reports).

* The next simplest is FOLIO's interface to [the Library Data Platform](https://github.com/library-data-platform/ldp). This consists of a UI module and a back-end module, but the latter is dependent on software outside of FOLIO itself -- the LDP database that it interrogates. The Firefly package may be able to ease integration with LDP databases.

* A third example is provided by the resource-sharing application suite [ReShare](https://projectreshare.org/) which runs on the FOLIO platform of Okapi and Stripes. This consists of eight or so UI modules, together accessing a pair of back-end modules, but also integrating with other components such as ILSs' NCIP servers, ISO 18626-compliant ILL services, the ReShare shared index, the VuFind OPAC and ReShare's OpenURL listener. Representing all these components and the relationships between them is a significant challenge.

* A final example is the FOLIO ILS itself, or rather, various configurations of it that contain different subsets of modules. There are instititions that want to run a non-circulating library on FOLIO, for example, or electronic resource management but nothing else. Such FOLIO application suites should be representable in Firefly format.

These examples present numerous difficulties, and should suffice to shake out any weaknesses in proposed formats.


## Requirements

Some requirements are absolute. They include:

* An explicit package-format version, with [SemVer](https://semver.org/)-like behaviour as we move to new versions of the format, such that old packages can still be correctly interpreted by newer package-management software and ideally vice versa.

* The ability to specify one or more UI modules that are part of the application -- almost certainly in the form of existing Node modules, either released on NPM or built from specific GitHub snapshots,

* The ability to specify one or more back-end modules that are part of the application -- almost certainly in the form of existing release artifacts such as Docker containers. In some cases, a set of required back-end modules can be automatically determined from the dependencies declared by the UI modules. But this is not always sufficient, as dependencies are on interfaces rather than implementations, and a complete application may need to specify the use of a specific implementation of a given interface.

* Some metadata about the application -- at minimum, human-readable fields like a name and description, but also probably machine-readable fields. Should include an indication of who is responsible for building the package, for QA, etc.

Other requirements can be considered merely desirable, and could perhaps be omitted from early versions of a Firefly format, to be introduced in later versions. These include:

* Some way to talk about non-FOLIO components, such as the LDP database that is required for the LDP FOLIO app to work. This might also reasonably be used to convey information about FOLIO-based components that are hosted remotely, such as the Shared Inventory app used by (at least some configurations of) ReShare.

* Some way to facilitate installation of non-FOLIO components, such as the OpenURL listener that can be used by an OPAC to feed requests into ReShare.

* The ability to cryptographically sign packages in such a way that those installing them can be confident about their origin.

* The ability to include in the package relevant documentation, or pointers to it; and information about test results and coverage.

* A general extensibility mechanism, probably along the lines of the tagged-segments approach of TIFF files, allowing vendors to include information not foreseen in the design of the package file. If included, this mechanism will need to come with guidelines of how software should respond to unrecognisable segments.

There are no doubt many other requirements that could be added. Recognising and analysing these is an important aspect of the present work.


## Implementation issues

### Foundational assumption

Since a great deal of work goes into ensuring that the foundational components (Okapi, core modules for authentication and suchlike, the Stripes libraries and their dependencies) work together within a flower release, it makes sense to exploit that work. Accordingly, each Firefly package should be targeted to the core of a specific flower release; so there would be, for example, ReShare for Kiwi and ReShare for Lotus. It would be the responsiblity of Firefly-package maintainers to ensure they run on each new flower release.


### Package inclusion

Since Firefly packages will in some sense need to include existing front-end and back-end module packages, we will need to decide whether that is done by physical inclusion or by reference to packages maintained elsewhere. The former approach has drawbacks: increasing file size and redundancy. But it also has the advantages that a package is a complete and immutable object, not dependent on the continuing support of other repositories.

### Prior art

The world is full of package formats already, including RPMs, Debian packages, Node packages, and various attempts to unify these. Some effort should be made to survey these existing tools and see to what extent they can meet all the needs of Firefly packages. Rather than designing something from the ground up, it may be possible to adapt or extend an existing format -- or even to adopt one without change, adding only conventions on how it is used.


## Candidate technologies

### Zip archives

If we conclude that we need Firefly packages to physically include front-end and back-end package files (most likely NPMs and Docker containers), then we will need a format suitable for large files and capable of carrying binary payloads. In this case we would most likely follow the [OpenDocument format](https://en.wikipedia.org/wiki/OpenDocument)'s approach of using a ZIP archive or tarball from which individual files can be easily extracted, with a conventional layout of the contents of the archive.

### Structured text

If we conclude this is not necessary, then it may suffice to use a structured text-based format instead, based probably on JSON (as for Node package description files), XML, or YAML.

### Virtual packages

It may be possible to achieve at least part of what is required by using existing FOLIO-package technology to make virtual packages -- that is, packages with no contents, only dependencies. This is in effect what we already do on the front-end when we create a "platform" package such as [`platform-complete`](https://github.com/folio-org/platform-complete): the `package.json` lists dependencies but there is no platform-level code.

Front-end packages have `okapiInterfaces` and `optionalOkapiInterfaces` sections in their package file. As part of FOLIO build processes, package files are transformed into module-descriptors using [`stripes mod descriptor`](https://github.com/folio-org/stripes-cli/blob/master/doc/commands.md#mod-descriptor-command), and these dependencies are included in the generated module descriptor.

As a result, front-end packages -- like back-end packages -- depend not on back-end modules but back-end _interfaces_. For most purposes this is the right way to do things: `ui-inventory` itself does not need to access `mod-inventory` specifically, but any module that implements the relevant interfaces. But when specifying a complete FOLIO application suite, it's necessary to specify which implementations are included. For this reason it may be necessary to extend [the module-descriptor format](https://github.com/folio-org/okapi/blob/master/okapi-core/src/main/raml/ModuleDescriptor.json) so that it can depend on implementations as well as interfaces -- although making this possible will open the door to some bad behaviours that will need to be rigorously discouraged.


