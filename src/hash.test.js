import { test } from "uvu";
import { exec } from "child_process";
import * as assert from "uvu/assert";
import hash from "./hash.js";

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

test.run();
