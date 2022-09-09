# Defining platforms for Okapi

<!-- md2toc -l 2 okapi-platforms.md -->
* [Notes](#notes)
* [Example of multiple module offering same interface](#example-of-multiple-module-offering-same-interface)
* [Enabling with parameters](#enabling-with-parameters)
    * [What exactly do `loadReference` and `loadSample` mean?](#what-exactly-do-loadreference-and-loadsample-mean)


## Notes

* existing dependency resolution mechanism
* throws error if underspecified
* get transcript from Adam
* https://issues.folio.org/browse/OKAPI-1002


## Example of multiple module offering same interface

We have three modules.

The first module requires interface `int`. This could be user interface
module.

```
cat > module-a-1.0.0.json <<END
{
  "id": "module-a-1.0.0",
  "requires": [
    {
      "id": "int",
      "version": "1.0"
    }
  ]
}
END
```

First of two modules that provides this interface:

```
cat > module-b-1.0.0.json <<END
{
  "id": "module-b-1.0.0",
  "provides": [
    {
      "id": "int",
      "version": "1.0"
    }
  ],
  "requires": []
}
END
```

Second module that provides this interface:

```
cat > module-c-1.0.0.json <<END
{
  "id": "module-c-1.0.0",
  "provides": [
    {
      "id": "int",
      "version": "1.0"
    }
  ],
  "requires": []
}
END
```


Register first module fails as `int` is not generally known to okapi.
This is a dependency check that is NOT tenant specific.

```
curl -d@module-a-1.0.0.json http://localhost:9130/_/proxy/modules
Missing dependency: module-a-1.0.0 requires int: 1.0
```

So we have to register the providers first, and `module-a` last.
This is what expected to be the case when publish modules in general.

```
curl -d@module-b-1.0.0.json http://localhost:9130/_/proxy/modules
curl -d@module-c-1.0.0.json http://localhost:9130/_/proxy/modules
curl -d@module-a-1.0.0.json http://localhost:9130/_/proxy/modules
```

Create a tenant `testlib`, so we can play with enabling modules for it.

```
curl -d'{"id":"testlib"}'  http://localhost:9130/_/proxy/tenants
```

Enable `module-a`. Since we don't provide a version okapi picks the
latest version.  The operation fails - as expected.

```
curl -d[{"id":"module-a","action":"enable"}]' \
    http://localhost:9130/_/proxy/tenants/testlib/install
interface int required by module module-a-1.0.0 is provided by multiple products: module-c, module-b
```

Let's pick module-c for this.

```
curl -d'[{"id":"module-a","action":"enable"},{"id":"module-c","action":"enable"}] \
    http://localhost:9130/_/proxy/tenants/testlib/install
[ {
  "id" : "module-c-1.0.0",
  "action" : "enable"
}, {
  "id" : "module-a-1.0.0",
  "action" : "enable"
} ]

```

The install operation succeeds. Observe that install okapi mentions
`module-c-1.0.0` before `module-a-1.0.0` in this list. The response can
be *reposted* to install again. If that is desired. 



## Enabling with parameters

It does not seem to be possible to pass tenant parameters through to a module when enabling it via POST to `/_/proxy/tenants/TENANT/modules`. Instead, the higher-level "install" operation must be used, and the parameters are provided as a single parameter in the URL query string:
```
$ curl --fail-with-body -d'[{"id":"mod-app-manager-1.2.0", "action":"enable"}]' http://localhost:9130/_/proxy/tenants/diku/install?tenantParameters=loadReference%3Dtrue%2CloadSample%3Dtrue
[ {
  "id" : "mod-app-manager-1.2.0",
  "action" : "enable"
} ]
```
and `mod-app-manager` logs:
```
record {
  "module_to" : "mod-app-manager-1.2.0",
  "purge" : false,
  "parameters" : [ {
    "key" : "loadReference",
    "value" : "true"
  }, {
    "key" : "loadSample",
    "value" : "true"
  } ]
}
```
Repeating this is a no-op, as the module is already enabled. It is not reported as an error, presumably because in general `install` is used with multiple modules and it's considered OK to re-enable some of a set.

Then the module can be disabled in the same way:
```
curl --fail-with-body -d'[{"id":"mod-app-manager-1.2.0", "action":"disable"}]' http://localhost:9130/_/proxy/tenants/diku/install?tenantParameters=loadReference%3Dtrue%2CloadSample%3Dtrue
```
The tenant parameters are passed to the module in the same way as for enabling.


### What exactly do `loadReference` and `loadSample` mean?

These parameters tell the enabled module to load "reference data" and "sample data" respectively, but there are no very useful definitions of these terms. [The Tech Council review document _Defining data types in FOLIO for automatic upgrades_](https://wiki.folio.org/display/TC/Defining+data+types+in+FOLIO+for+automatic+upgrades) says only
 
> * **Reference data** --
> Data that are referred to by other records in the system, which may be optionally loaded on module initialization using the loadReference tenant parameter.
> * **User/sample data** --
> Data that are created by the user, or loaded using the loadSample tenant parameter.

At present, the reference/sample data distinction is a grey area. Wayne Schneider thinks of reference data as optional default data (records) that are "referred to" by other record types, e.g. possible values for the "contributor type" of an inventory instance. In some cases, you can't create the larger record without having some reference data records, whether system-supplied or user-created. Sample data are samples of the larger records, and are meant to be used for demo or testing purposes, such as the example bibliographic records in [the Inventory app on `folio-snapshot`](https://folio-snapshot.dev.folio.org/inventory?sort=title).

Generally speaking, we use the `loadReference=true` tenant parameter when enabling modules for tenants for a release, and do the same for a release upgrade, but not for a hot fix. This is necessary to pick up new reference data record types that might have been introduced, or new values that a SIG asked to be added to the existing types.

Here is where we run into trouble with the vagueness of the definition, however, because some system-supplied reference data records are editable by the user, and can be overwritten by the upgrade. This happens in particular with staff slips in circulation. Also, there is no internationalization of the labels for most of the records, so libraries that don't want to use US English labels will find that the labels are overwritten with the upgrade.

Modules that have reference data or sample data must take some care to be idempotent, so that we don't end up with (for example) multiple copies of the identifier-type that defines how ISBNs are represented in FOLIO. The code in [RMB](https://github.com/folio-org/raml-module-builder/) attempts to POST each reference record, and if it fails because it already exists, it PUTs it to overwrites with the new version. (We think the Spring-based modules mimic this behavior, but we have not verified this).

It is also possible for modules to have absolutely necessary records. In this case, it is reasonable for them insert these whenever a tenant is enabled irrespective of whether any tenant parameters are sent.

[The Tech Council review document _Improved Handling of Reference Data During Upgrades_](https://wiki.folio.org/display/TC/Improved+Handling+of+Reference+Data+During+Upgrades) is the outcome of six months of meetings between half a dozen architects, developers and operations people, and attempts to define upgrade semantics more precisely, but it has not been formally adopted -- in part because of the complexity of dealing with "read-mostly" records which are in some conceptual sense read-only but in fact subject to editing. (Opinion: FOLIO should have a way to enforce the read-onliness of certain records.)


