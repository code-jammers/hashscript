export function getHashDigit(hash, placeholder) {
  // HASH_ROUNDTRIP_VAR2LIT_FIX
  var varLetter = placeholder.charAt(1); // without preceding $
  var index = varLetter.charCodeAt() - "A".charCodeAt();
  return hash.split(" ")[index];
}
