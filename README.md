# hashscript
A hash for use in written text. Read [Software Design Document](docs/sdd/Software-Design-Document.pdf).

## command line examples

todo: break out into a js file instead of writing escaped js into the shell

### command line example - hash notation
```sh
secret="CaptainJackSparrow"
vartext="First, I counted to \$A, then \$B, and then \$C."

hash=$( \
{
    echo import\(\'./src/hash.js\'\).then\(hm\ =\>\ \{\
        console.log\(hm.default.hashInferPluralDigitCsv\(\'\{"${secret}"\}\',\'"${vartext}"\'\)\)\;\ \
    \}\)\;;

} | node \
)
h1=$(echo "$hash" | cut -d ',' -f1)
h2=$(echo "$hash" | cut -d ',' -f2)
h3=$(echo "$hash" | cut -d ',' -f3)

echo "(hash = "$(echo "$hash" | sed 's/,/ /g')")"

{
    echo import\(\'./src/roundTrip.js\'\).then\(rtm\ =\>\ \{\
        console.log\(rtm.roundTrip\(\'\{"${secret}"\}"${vartext}"\',\ \'${h1}\ ${h2}\ ${h3}\',\ false\)\)\;\ \
    \}\)\;;
} | node | cut -d '}' -f2
```

```
WARNING: no hmac given to setHmac function, using empty string.
(hash = 4 2 10)
First, I counted to 4, then 2, and then 10.
```

### command-line example - without hash notation

```sh
secret="CaptainJackSparrow"
text="First, I counted to 10, then 8, and then 3."

h1=4
h2=2
h3=10

{
    echo import\(\'./src/roundTrip.js\'\).then\(rtm\ =\>\ \{\
        console.log\(rtm.roundTrip\(\'\{"${secret}"\}"${text}"\',\ \'${h1}\ ${h2}\ ${h3}\',\ false\)\)\;\ \
    \}\)\;;
} | node | cut -d '}' -f2
```

```
First, I counted to 4, then 2, and then 10.
```

### command-line example - reset to hash notation

```sh
secret="CaptainJackSparrow"
text="First, I counted to 10, then 8, and then 3."

h1=4
h2=2
h3=10

{
    echo import\(\'./src/roundTrip.js\'\).then\(rtm\ =\>\ \{\
        console.log\(rtm.roundTrip\(\'\{"${secret}"\}"${text}"\',\ \'${h1}\ ${h2}\ ${h3}\',\ true\)\)\;\ \
    \}\)\;;
} | node | cut -d '}' -f2
```

```
First, I counted to $A, then $B, and then $C.
```


## generate SDD
```sh
cd docs/sdd
pdflatex -shell-escape Software-Design-Document.tex
```

## run code format
npm run format:prettier
