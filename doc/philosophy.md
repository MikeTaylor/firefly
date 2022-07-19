# Philosophy of the MAFIA project

<!-- md2toc -l 2 philosophy.md -->
* [Open to anyone to contribute](#open-to-anyone-to-contribute)
* [Open to anyone to benefit](#open-to-anyone-to-benefit)
* [A flexible toolkit](#a-flexible-toolkit)
* [A concrete use of the toolkit](#a-concrete-use-of-the-toolkit)


In accordance with [../README.md#manifesto](the project manifesto), our goal is to provide the necessary tooling and documentation to lower the barriers to participation in FOLIO, and to provide the means for a more varied and less monolithic ecosystem of available apps.

With this in mind, three principles govern our technical decisions.


## Open to anyone to contribute

We architecture that we create for app publication, discovery, installation, deployment and enabling should be available on an equal bases to anyone with the requisite technical skills. There should be no single point of control over any of these phases (although of course a given organization may exert control over its own deployments).

Since not all contributions are equal, doing this will entails certification. Each application will need to be digitally signed by the organization that vouches for it meeting whatever quality standards they find appropriate. (The FOLIO Technical Council could be one such organization; independent publishes such as Index Data could be others). Other agencies can offer additional certifications.


## A flexible toolkit

The tools used at various stages of the publication, discovery, installation and deployment processes should be furnished separately, with well-defined and documented interfaces, so that they can be used in accordance with whatever procedures an organization prefers. For example, [the FAM format for FOLIO application metadata](folio-app-metadata.md) does not assume that Docker containers are in Dockerhub or that NPM packages are in the the FOLIO NPM repository: it simply accepts URLs for these artifacts and leaves it to packagers to put the packaged materials weherever they wish. Similarly, the forthcoming Platform file format will not assume the use of Kubernetes for deployment.


## A concrete use of the toolkit

As the same time, we do not want to fall into the trap of dumping a set of pieces on the community and saying "Go play" with no actionable guidance. Instead, we will [dogfood](https://en.wikipedia.org/wiki/Eating_your_own_dog_food) the tools by wiring them together into Index Data's own pipeline, using Kubernetes for deployment. This is not intended to be interpreted as The Way to use the tools, but as an exemplar of how it _can_ be used.


