# Example of multiple module offering same interface

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



