// Test-data factory for the ecom API client's specs: the parts of autofixture 1.1.0
// (MIT, (c) 2014 John Teague, https://github.com/jcteague/autofixture) that the fixtures use,
// ported unchanged in behaviour. The package is deprecated, and it added these helpers to
// String.prototype ('price'.asNumber()); here they are plain functions (asNumber('price')).
//
// A field is a name, which becomes `${name}${n}`, or one of the helpers below. `n` starts at 1
// and grows by one for every fixture created from the same definition.

const definitions = {};

const field = (name, value) => (incrementer) => ({ name, value: value(incrementer) });

export const asNumber = (name) => field(name, (incrementer) => incrementer);

export const asConstant = (name, value) => field(name, () => value);

export const asBoolean = (name) => field(name, () => !!Math.floor(Math.random() * 2));

export const pickFrom = (name, options = []) =>
  field(name, () => (options.length ? options[Math.floor(Math.random() * options.length)] : null));

export const asArray = (name, length) =>
  field(name, (incrementer) => {
    const values = [];
    for (let i = incrementer; i < incrementer + length; i++) {
      values.push(name + i);
    }
    return values;
  });

export const fromFixture = (name, fixtureName) => field(name, () => create(fixtureName));

export const asListOfFixtures = (name, fixtureName, length) =>
  field(name, () => Array.from({ length }, () => create(fixtureName)));

const build = (fields, incrementer) => {
  const fixture = {};
  for (const definition of fields) {
    if (typeof definition === 'string') {
      fixture[definition] = definition + incrementer;
    } else if (typeof definition === 'function') {
      const { name, value } = definition(incrementer);
      fixture[name] = value;
    }
  }
  return fixture;
};

// Overrides merge into nested objects and replace everything else, as autofixture did.
const applyOverrides = (target, override) => {
  if (typeof override === 'function') {
    override(target);
    return;
  }
  for (const key in override) {
    if (Array.isArray(target[key])) {
      target[key] = override[key];
    }
    if (typeof target[key] === 'object') {
      applyOverrides(target[key], override[key]);
    } else {
      target[key] = override[key];
    }
  }
};

export const define = (name, fields) => {
  definitions[name] = { fields, count: 0 };
};

export const create = (name, overrides) => {
  const definition = definitions[name];
  if (!definition) {
    throw new Error(`fixture "${name}" not defined`);
  }
  const incrementer = definition.count + 1;
  const fixture = build(definition.fields, incrementer);
  if (overrides) {
    applyOverrides(fixture, overrides);
  }
  definition.count = incrementer;
  return fixture;
};
