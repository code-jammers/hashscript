#!/usr/bin/env node

function getsec(text) {
  return text.split("}")[0] + "}";
}
function getmsg(text) {
  return text.split("}")[1];
}

function runmodule(name, cb) {
  const modulespec = { hash: "./hash.js", roundtrip: "./roundTrip.js" };
  import(modulespec[name]).then((module) => {
    cb(module);
  });
}

function main(args) {
  const cmdspec = {
    hash: "hash",
    scriptvars: "script-vars",
    scriptnums: "script-nums",
  };
  const subcmd = args.shift();
  var scriptVars = false;
  switch (subcmd) {
    case cmdspec.hash:
      runmodule(subcmd, (hashModule) => {
        console.log(
          hashModule.default
            .hashInferPluralDigitCsv(getsec(args[0]), getmsg(args[0]))
            .replace(/,/g, " ")
        );
      });
      break;
    case cmdspec.scriptvars:
      scriptVars = true;
    //fall-through
    case cmdspec.scriptnums:
      var hash = null;
      var text = args[0];
      if (!scriptVars) {
        args.shift(); // -h
        hash = args.shift();
        text = args.shift();
      }
      runmodule("roundtrip", (roundTripModule) => {
        console.log(
          roundTripModule.roundTrip(text, hash, scriptVars).split("}")[1]
        );
      });
      break;
  }
}

main(process.argv.slice(2));
