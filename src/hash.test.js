import { test } from "uvu";
import { exec } from "child_process";
import * as assert from "uvu/assert";
import hash from "./hash.js";
import { roundTrip } from "./roundTrip.js";

hash.setHmacKey("hashscripttest");

test("Hash exists", async () => {
  assert.is(true, Boolean(hash));
});

test("Hash is string", () => {
  assert.is(true, typeof hash.hash("head", "text") === "string");
});

test("node run script", () => {
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
        "$A in the morning, or $B, or $C. Even at $D or $E"
      );
      const hashToCompare = stdout
        .replace("(stdin)= ", "")
        .replace("SHA256", "");
      assert.is(processedHash.trim(), hashToCompare.trim());
    }
  );
});

// HASH_SUBSTRS_FIX
test("hash substrings test", () => {
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
test("without digits can hash", () => {
  assert.ok(hash.hashInferPluralDigitCsv("test", "test") != null);
});

// HASH_ROUNDTRIP_FIX
test("hash round trip", () => {
  var hash = "10 11 6";
  var text = "{test}1 or 2 or 3";
  var actual = text;
  try {
    actual = roundTrip(/*text:*/ text, /*hash:*/ hash, /*dynVars:*/ false);
  } catch {}
  var expected = "{test}10 or 11 or 6";
  assert.is(actual, expected);
});

// HASH_ROUNDTRIP_LIT2VAR
test("hash round trip literal to var", () => {
  var hash = "2 5";
  var text = "{test}2 or 5";
  var actual = text;
  try {
    actual = roundTrip(/*text:*/ text, /*hash:*/ hash, /*dynVars:*/ true);
  } catch {}
  var expected = "{test}$A or $B";
  assert.is(actual, expected);
});

// HASH_ROUNDTRIP_VAR2LIT_FIX
test("hash round trip var to literal", () => {
  var hash = "2 5";
  var text = "{test}$A or $B";
  var actual = text;
  try {
    actual = roundTrip(/*text:*/ text, /*hash:*/ hash, /*dynVars:*/ false);
  } catch {}
  var expected = "{test}2 or 5";
  assert.is(actual, expected);
});

test.run();
