# Rest API server

## The ideas behind

- autocompletion should work out of the box both for the server and for the client
- both server and client should reuse the same logic for:
    - validation
    - serialization
    - type transformation
- meanwhile server defines the pattern matcher, client introspects it

## What should be done for the server?

We actually want to have metatypes for each field
as a part of the interface to reflect the basic structural shape.
The meta types could be used to generate Open API.

## What should be done for the client?

There should be a mean of generating client side library with all the necessary field
types without the actual server side code.

I.e. we generate a client using webpack and tree shaking.

