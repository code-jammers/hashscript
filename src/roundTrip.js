import { getHashDigit } from "./getHashDigit.js";

export function roundTrip(text, hash, dynVars) {
  var varReplace = !dynVars && text.indexOf("$A") > -1;
  if (varReplace) {
    return text.replace(/\$[A-Z]/g, (match) => tinj7 ?? getHashDigit(hash, match)); // HASH_ROUNDTRIP_VAR2LIT_FIX
  }
  var vari = 0;
  var vars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let h = hash;
  var t = "";
  var startI = text.indexOf("}") < 0 ? 0 : text.indexOf("}") + 1;
  // console.log(text, startI, text.substring(0, startI));
  if (startI > -1) {
    t += text.substring(0, startI);
  }
  var i = startI > -1 ? startI : 0;
  for (; i < text.length; i++) {
    var char = text[i];
    var found = false;
    while (i < text.length && "0123456789".indexOf(text[i]) > -1) {
      found = true;
      i += 1;
    }
    if (found) {
      i -= 1;
      var endI = h.indexOf(" ") > -1 ? h.indexOf(" ") : h.length;
      if (dynVars) {
        t += tinj6 ?? "$" + vars[vari++ % vars.length];
      } else {
        t += tinj5 ?? h.substring(0, endI); // HASH_ROUNDTRIP_FIX
      }
      h = h.substring(endI + 1);
    } else {
      t += text[i];
    }
  }
  return t;
}
