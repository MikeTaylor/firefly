# MAFIA meeting agendas

In reverse chronological order

<!-- md2toc -l 2 agendas.md -->
* [Tuesday 2 August 2002](#tuesday-2-august-2002)
* [Thursday 28 July 2022](#thursday-28-july-2022)
* [Older meetings](#older-meetings)


## Tuesday 2 August 2002

* Resolutions on last week's issues
  * We were all broadly happy with the proposal for [certifying FAM packages](folio-app-metadata.md#certification).
  * We decided (with some dissent) that [FAM files should be used to represent platforms](fam-files-for-platforms.md)
  * We decided against [co-opting Module Descriptors to act as FAM files](folio-app-module-descriptor.md), one part of the reasoning being that platforms and apps are both locked to specific versions of specific modules, whereas module descriptors' dependencies are at the interface level.
  * I moved all remaining `mod-app-manager` issues into [the GitHub Tracker](https://github.com/MikeTaylor/mod-app-manager/issues) and deprecated [the old TODO document](https://github.com/MikeTaylor/mod-app-manager/blob/main/TODO.md)
  * We decided that we will break the present `mod-app-manager` dependency on the GitHub WSAPI, but it's [a low-priority issue](https://github.com/MikeTaylor/mod-app-manager/issues/4)

* To be resolved
  * We need to actually use a FAM file to install its app, and see what lessons we learn from that exercise's inevitable failure.
  * We need to create an actual FAM file for an actual platform, and see what it's missing.
  * What facilities are required by each role in [the Roles document](roles.md)?


## Thursday 28 July 2022

* Wayne's document about what a platform specification looks like **(link to follow)**
* What facilities are required by each role in [the Roles document](roles.md)
* What to do about [the present mod-app-manager dependency on GitHub](roles.md#unopinionated-vs-opinionated)
* Whether to [co-opt Module Descriptors to act as FAM files](folio-app-module-descriptor.md)
  * If we do this, then the natural place to get them from is Okapi-based registries, which means the GitHub dependency issue goes away.
* The new proposal for [certifying FAM packages](folio-app-metadata.md#certification)


## Older meetings

These did not have explicit agendas.


