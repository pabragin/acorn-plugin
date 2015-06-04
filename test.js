'use strict';

var acorn = require('./inject')(require('acorn'));

var parsed,  tokens = [], options = {}, compact = false, tokenize = false;

options.plugins = {myplugin: true};
options.ecmaVersion = 6;

var code = 'var odds = evens.map(v ~> v + 1);';

parsed = acorn.parse(code, options);

console.log(JSON.stringify(tokenize ? tokens : parsed, null, compact ? null : 2));

