import crypto from "crypto";

const hash = {
  setHmac: function (hmac) {
    hash.secret = hmac;
  },
  hash: function (hd, t) {
    if (hash.secret == null) {
      console.warn(
        "WARNING: no hmac given to setHmac function, using empty string."
      );
    }
    return crypto
      .createHmac("sha256", hash?.secret ?? "")
      .update(hd + t)
      .digest("hex");
  },
  hashToInt: function (hd, t, digits) {
    // why was 13 chosen?
    // because the max number is 9007199254740992
    // which converts to hex number 20000000000000,
    // and while that hex is 14 digits long
    // we can't use 14 because there are digits exceeding it (ie: 3..,F..)
    // so instead we choose 13 to ensure it won't exceed
    // the max number when converted with parseInt.
    return parseInt(
      ("" + parseInt(hash.hash(hd, t).substring(0, 13), 16)).substring(
        0,
        digits
      )
    );
  },
  // PLURAL DIGITS
  // non-plural digits of 0 and 1 get mapped to a different
  // number (+10), so when these hashed digits replace the in-text
  // placeholders (ie: $A,$B,$C,$D,$E) they do not change the spelling
  // of the counted object (ie: 1 cars => 11 cars) and in the case of
  // 0 doesn't change the intended meaning of the dynamic text
  // (ie: he watched 0 horses arrive => he watched 10 horses arrive).
  hashToPluralDigitCsv: function (hd, t, digits) {
    let h = "" + hash.hashToInt(hd, t, digits);
    var csv = "";
    for (var i = 0; i < h.length; i++) {
      if (i > 0) csv += ",";
      if (h[i] == "0") csv += "10";
      else if (h[i] == "1") csv += "11";
      else csv += h[i];
    }
    return csv;
  },

  hashInferPluralDigitCsv: function (hd, val) {
    var varCount = val.match(/\$[A-Z]/g)?.length;
    if (varCount == null) varCount = 13;
    return hash.hashToPluralDigitCsv(hd, val, varCount);
  },
};

export default hash;
