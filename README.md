# Simple Continuation Local Storage

When coding in Node it can involve a lot of parameter passing to enable sub
functions to keep track of all of the state being set elsewhere.  It can be
very difficult to do this if you are using 3rd party libraries or practicing
things like Inversion of Control with events.

What you want is:

* Something a bit like a global variable
* The equivalent of Thread Local Storage in many systems but that works

We call the resumption of a routine after an async call or promise chain a 
"Continuation" and hence continuation local storage allows you to set
some variables that will be retained through the lifetime of a request
dramatically simplifying your code.

There are a few things out there that do this, but they all require too
much boiler plate for me.

With simple-continuation-local-storage you just access anything you
like off a simple variable and it will be properly set up for every
different request being served by your server.

It does this by using a Proxy, available on Node > 6.0.0

## Installation

```bash
npm i --save simple-continuation-local-storage
```

## Usage

```js
const cls = require('simple-continuation-local-storage')
app.get('/request', async (request, response)=>{
    try {
        cls.$init()
        cls.request = request;
        cls.response = response;
        await getUserSecurity();
        await runSafeFunction();
        response.status(200).end()
    } catch(e) {
        console.error(e)
    }
 })

async function runSafeFunction() {
    if(cls.authenticated && cls.user && cls.user.permissions.includes('doit')) {
       cls.response.write("Secret stuff")
    }
}

async function getUserSecurity() {
    if(cls.request.url.searchParams.token==='magic') {
        cls.authenticated = true
        cls.user = {
            email: "mike@talbot.com",
            id: 1,
            permissions: ['doit']
        }
    }
    cls.response.status(401).send("Unauthorised")
    throw new Error("Unauthorised")
}

```


