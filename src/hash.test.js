import { test, suite } from "uvu";
import { exec } from "child_process";
import * as assert from "uvu/assert";
import hash from "./hash.js";
import { roundTrip } from "./roundTrip.js";
import { tinj } from "./tinj.js";

hash.setHmacKey("hashscripttest");

let testModule = "Hash";

Array.prototype.testEach = function (name, test) {
  let s = suite(`Test ${this[0].t} [${testModule} Module] ${name}`);
  let testno = this[0].t;
  for (let i = 0; i < this.length; i++) {
    let testName = `Test ${testno}[${i}] [${testModule} Module] ${name}`;
    s(testName, () => {
      tinj(this[i].t, this[i].inj);
      test(this[i]);
    });
  }
  s.run();
};

[{ t: 0 /*test # 0*/, inj: null }].testEach("Hash exists", () => {
  assert.is(true, Boolean(hash));
});

[{ t: 1, inj: null }].testEach("Hash is string", () => {
  assert.is(true, typeof hash.hash("head", "text") === "string");
});

[{ t: 2, inj: null }].testEach("node run script", () => {
  exec(
    `"echo" "-n" '12AM$A in the morning, or $B, or $C. Even at $D or $E' | openssl sha256 -hmac "hashscripttest"`,
    (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      const processedHash = hash.hash(
        "12AM",
        "$A in the morning, or $B, or $C. Even at $D or $E",
      );
      const hashToCompare = stdout
        .replace("(stdin)= ", "")
        .replace("SHA256", "");
      assert.is(processedHash.trim(), hashToCompare.trim());
    },
  );
});

// HASH_SUBSTRS_FIX
[{ t: 3, inj: null }].testEach("hash substrings test", () => {
  var last = null;
  for (var i = 2; i < 10; i += 2) {
    var current = hash.hashToInt("1", "test", i);
    if (last != null) {
      assert.is(true, (current + "").indexOf(last + "") == 0);
    }
    last = current;
  }
});

// HASH_NODIGITS_FIX
[
  {
    // fix - text having no digits can hash
    t: 4,
    inj: null,
    expect: (val) => val == "6,8,3,8,4,11,3,8,11,2,11,2,10",
  },
  {
    // resurrect the bug: text having no digits can't hash
    t: 4,
    inj: 0,
    expect: (val) => isNaN(val),
  },
].testEach("without digits can hash", ({ t, inj, expect }) => {
  assert.ok(expect(hash.hashInferPluralDigitCsv("test", "test")));
});

testModule = "Round Trip";

// HASH_ROUNDTRIP_FIX
[
  { t: 5, inj: null, expect: "{test}10 or 11 or 6" },
  { t: 5, inj: 2, expect: "{test}2 or 2 or 2" }, //resurrect bug: no round trip
].testEach("hash round trip", ({ t, inj, expect }) => {
  let res = true;
  var hash = "10 11 6";
  var text = "{test}1 or 2 or 3";
  var actual = text;
  try {
    actual = roundTrip(/*text:*/ text, /*hash:*/ hash, /*dynVars:*/ false);
  } catch {}
  // var expected = "{test}10 or 11 or 6";

  //assert.is(actual, expected);
  assert.ok(actual == expect);
});

// HASH_ROUNDTRIP_LIT2VAR
[
  { t: 6, inj: null, expect: "{test}$A or $B" }, // literal N convert 2 $A+ feature
  { t: 6, inj: 2, expect: "{test}2 or 2" }, // disfeature literal N converted 2 $A+
].testEach("hash round trip literal to var", ({ t, inj, expect }) => {
  var hash = "2 5";
  var text = "{test}2 or 5";
  var actual = text;
  try {
    actual = roundTrip(/*text:*/ text, /*hash:*/ hash, /*dynVars:*/ true);
  } catch {}
  assert.is(actual, expect);
});

// HASH_ROUNDTRIP_VAR2LIT_FIX
[
  { t: 7, inj: null, expect: "{test}2 or 5" }, // $A+ convert to literal N feature
  { t: 7, inj: "2", expect: "{test}2 or 2" }, // disfeature $A+ convert 2 literal N
].testEach("hash round trip var to literal", ({ t, inj, expect }) => {
  var hash = "2 5";
  var text = "{test}$A or $B";
  var actual = text;
  try {
    actual = roundTrip(/*text:*/ text, /*hash:*/ hash, /*dynVars:*/ false);
  } catch {}
  assert.is(actual, expect);
});

// test.run();
