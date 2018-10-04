import test from 'ava';

const StringUtils = require('./utils/StringUtils.js');
test("StringUtils.sanitizeMessage should censor a bad word", t => {
    const stringUtils = new StringUtils();
    let sanitizedMessage = stringUtils.sanitizeMessage("Test", ["Test", "Not Test"], new RegExp("Test", "gi"));
    t.is(sanitizedMessage, "[CENSORED]");
});

test("StringUtils.sanitizeMessage should not censor a good word", t => {
    const stringUtils = new StringUtils();
    let sanitizedMessage = stringUtils.sanitizeMessage("Good", ["Test"], new RegExp("Test", "gi"));
    t.is(sanitizedMessage, "Good");
});