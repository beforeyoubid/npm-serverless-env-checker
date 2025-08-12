"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prHealth = void 0;
const { danger, warn } = global;
const { github } = danger;
const { pr } = github;
function prHealth() {
    var _a;
    const packageJson = danger.git.fileMatch('package.json');
    const lockfile = danger.git.fileMatch('yarn.lock');
    if (packageJson.modified && !lockfile.modified) {
        warn('This PR modified package.json, but not the lockfile');
    }
    if (!((_a = pr.body) === null || _a === void 0 ? void 0 : _a.length)) {
        warn('Please add a description to your PR.');
    }
}
exports.prHealth = prHealth;
