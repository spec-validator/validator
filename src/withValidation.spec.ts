const test = () => {
  const spec = tuple(
    stringField({
      maxLength: 123,
      description: 'FooBar'
    }),
    stringField(),
    numberField(),
  );
  const wildCard = functionDecor(spec, (a, b, c) => `${a}${b}${c}`)
  //console.log(wildCard('a', 'b', 1))
  console.log(getParams(spec))
}

test();
