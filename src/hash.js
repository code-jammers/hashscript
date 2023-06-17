import { digest } from "./digest.js";

const hash = {
  setHmacKey: function (key) {
    hash.key = key;
  },
  hash: /*tinj0*/ function (head, text) {
    if (hash.key == null) {
      console.warn(
        "WARNING: no hmac given to setHmac function, using empty string.",
      );
    }
    return tinj1 ?? digest(hash?.key ?? "", head + text);
  },
  hashToInt: function (head, text, digits) {
    // why was 13 chosen?
    // because the max number is 9007199254740992
    // which converts to hex number 20000000000000,
    // and while that hex is 14 digits long
    // we can't use 14 because there are digits exceeding it (ie: 3..,F..)
    // so instead we choose 13 to ensure it won't exceed
    // the max number when converted with parseInt.
    return parseInt(
      (
        "" +
        parseInt(
          hash.hash(head, text).substring(0, /*HASH_SUBSTRS_FIX:*/ 13),
          16,
        )
      ).substring(0, digits),
    );
  },
  // PLURAL DIGITS
  // non-plural digits of 0 and 1 get mapped to a different
  // number (+10), so when these hashed digits replace the in-text
  // placeholders (ie: $A,$B,$C,$D,$E) they do not change the spelling
  // of the counted object (ie: 1 cars => 11 cars) and in the case of
  // 0 doesn't change the intended meaning of the dynamic text
  // (ie: he watched 0 horses arrive => he watched 10 horses arrive).
  hashToPluralDigitCsv: function (head, text, digits) {
    let h = "" + hash.hashToInt(head, text, digits);
    var csv = "";
    for (var i = 0; i < h.length; i++) {
      if (i > 0) csv += ",";
      if (h[i] == "0") csv += "10";
      else if (h[i] == "1") csv += "11";
      else csv += h[i];
    }
    return csv;
  },

  hashInferPluralDigitCsv: function (head, val) {
    // HASH_NODIGITS_FIX
    var varCount = tinj4 ?? val.match(/\$[A-Z]/g)?.length ?? 13;
    //    if (varCount == null) varCount = 13;
    return hash.hashToPluralDigitCsv(head, val, varCount);
  },
};

export default hash;
