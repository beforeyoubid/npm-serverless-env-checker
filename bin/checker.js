#!/usr/bin/env node

require = require('esm')(module /*, options*/);
require('../src/checker').envChecker(process.argv);