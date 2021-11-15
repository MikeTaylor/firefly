# Thoughts on the MAFIA package format


## Introduction

One of our goals is to define an installation-archiver format for modular applications in FOLIO. This is the "Modular Application for FOLIO: Installation Archive" format, or MAFIA for short. In the present document, we start to consider what it might look like.


## Motivating examples

We have several nice motivating examples for the kinds of things we want the MAFIA format to support:

* The simplest example would be the eusage-reports work done for the SLUB consortium. This consists only of a UI module (ab event-handling plugin, in fact, [`ui-plugin-eusage-reports`](https://github.com/folio-org/ui-plugin-eusage-reports); and a back-end module, [`mod-eusage-reports`](https://github.com/folio-org/mod-eusage-reports).

* The next simplest is FOLIO's interface to [the Library Data Platform](https://github.com/library-data-platform/ldp). This consists of a UI module and a back-end module, but the latter is dependent on software outside of FOLIO itself -- the LDP database that it interrogates. The MAFIA package may be able to ease integration with LDP databases.

* A third example is provided by the resource-sharing application suite [ReShare](https://projectreshare.org/) which runs on the FOLIO platform of Okapi and Stripes. This consists of eight or so UI modules, together accessing a pair of back-end modules, but also integrating with other components such as ILSs' NCIP servers, ISO 18626-compliant ILL services, the ReShare shared index, the VuFind OPAC and ReShare's OpenURL listener. Representing all these components and the relationships between them is a significant challenge.

* A final example is the FOLIO ILS itself, or rather, various configurations of it that contain different subsets of modules. There are instititions that want to run a non-circulating library on FOLIO, for example, or electronic resource management but nothing else. Such FOLIO application suites should be representable in MAFIA format.

These examples present numerous difficulties, and should suffice to shake out any weaknesses in proposed formats.


## Requirements

xxx


## Prior art

xxx


## Candidate technologies

xxx


