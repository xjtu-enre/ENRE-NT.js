## Args

Functions are passed as arguments to other functions that call them.

### Supported Patterns

```yaml
name: Advanced args
```

#### Semantic: Args

##### Examples

###### Call + Assigned call

```js
function paramFunc() {
    /* Empty */
}

function func(a) {
    a()
}

func(paramFunc); 

const b = paramFunc;
func(b);
```

```yaml
relation:
    type: call
    implicit: true
    items:
        -   from: function:'func'
            to: function:'paramFunc'
            loc: 6:5:1
```

###### Nested call

```js
function nestedFunc() {
    /* Empty */
}

function paramFunc(a) {
    a()
}

function func(a) {
    a(nestedFunc)
}

const b = paramFunc;
const c = func;
c(b);
```

```yaml
relation:
    type: call
    implicit: true
    items:
        -   from: function:'func'
            to: function:'paramFunc'
            loc: 10:5:1
        -   from: function:'paramFunc'
            to: function:'nestedFunc'
            loc: 6:5:1
```

###### Param call

```js
function func(a) {
    a()
}

function func2() {
    return func3
}

function func3() {
    /* Empty */
}

func(func2());
```

```yaml
relation:
    type: call
    items:
        -   from: file:'<File file0.js>'
            to: function:'func'
            loc: 13:1
        -   from: file:'<File file0.js>'
            to: function:'func2'
            loc: 13:6
        -   from: function:'func'
            to: function:'func3'
            loc: 2:5:1
            implicit: true
```
