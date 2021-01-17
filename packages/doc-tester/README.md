# @spec-validator/doc-tester

Internally extracts typescript code from '`ts/typescript`' code
blocks and feeds those to `ts-node`. Line mapping is done accordingly
to indicate the locations of the errors within the source
Markdown files.

To denote a code block just write

<code>

\```ts

const foo = 'On a separate line'

\```

</code>

The blocks can be additionally labeled to avoid definition collisions:

<code>

\```ts label-one

const foo = 'One'

\```

\```ts label-two

const foo = 'Another'

\```

\```ts label-three

const foo = 'Yet Another'

\```

</code>

this notifies the tool that definition scopes should be different thus
`const` collision will not takes place.

In case if the block should not be executed - mark it with a label
starting with `#` (useful if execution will yield side-effects).

<code>

\```ts #ignore

server.serve()

\```

</code>

## Known limitiations

1. By design ignores any non typescript blocks.
1. By design ignores any non-multiline blocks (i.e. triple quotes must live on their own lines).
1. Works only with triple quote blocks. `<code>` blocks are ignored.
