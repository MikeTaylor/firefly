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
$ curl --fail-with-body -d'[{"id":"mod-app-manager-1.2.0", "action":"enable"}]' http://localhost:9130/_/proxy/tenants/diku/install?tenantParameters=foo=1%2Cbar=42
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
    "key" : "foo",
    "value" : "1"
  }, {
    "key" : "bar",
    "value" : "42"
  } ]
}
```
Repeating this is a no-op, as the module is already enabled. It is not reported as an error, presumably because in general `install` is used with multiple modules and it's considered OK to re-enable some of a set.

Then the module can be disabled in the same way:
```
curl --fail-with-body -d'[{"id":"mod-app-manager-1.2.0", "action":"disable"}]' http://localhost:9130/_/proxy/tenants/diku/install?tenantParameters=foo=1%2Cbar=42
```
The tenant parameters are passed to the module in the same way as for enabling.


### What exactly do `loadReference` and `loadSample` mean?

These parameters tell the enabled module to load "reference data" and "sample data" respectively, but there are no very useful definitions of these terms. [The Tech Council review document _Defining data types in FOLIO for automatic upgrades_](https://wiki.folio.org/display/TC/Defining+data+types+in+FOLIO+for+automatic+upgrades) says only
 
> * **Reference data** --
> Data that are referred to by other records in the system, which may be optionally loaded on module initialization using the loadReference tenant parameter.
> * **User/sample data** --
> Data that are created by the user, or loaded using the loadSample tenant parameter.

XXX incorporate further discussion from Slack: https://indexdata.slack.com/archives/C011TJ91SV8/p1662732092796999?thread_ts=1662724894.870039&cid=C011TJ91SV8



