# hashscript
A hash for use in written text. Read [Software Design Document](docs/sdd/Software-Design-Document.pdf).

## command line examples

### command line example - hash notation
```sh
secret='CaptainJackSparrow'
message='First, I counted to $A, then $B, and then $C.'

# display script with dynamic vars
src/hashscript-cli.js script-vars "{$secret}$message"

# hash it
hash=$(src/hashscript-cli.js hash "{$secret}$message" 2>>/dev/null)
echo "$hash"

# display script with encoded digits
src/hashscript-cli.js script-nums -h "$hash" "{$secret}$message"
```

```
First, I counted to $A, then $B, and then $C.
4 2 10
First, I counted to 4, then 2, and then 10.
```

## generate SDD
```sh
cd docs/sdd
pdflatex -shell-escape Software-Design-Document.tex
```

## run code format
npm run format:prettier
