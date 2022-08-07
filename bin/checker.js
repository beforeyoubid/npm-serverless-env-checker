#!/usr/bin/env node

require = require('esm')(module /*, options*/);
require('../checker').envChecker(process.argv);