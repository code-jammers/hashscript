#!/usr/bin/python3
import re

def main(str):
    # print(re.sub(r'import ([-_a-zA-Z]+) ', 'import \\textcolor{lblue}{\1} ', str))
    s = re.sub(r'import} ([-_a-zA-Z]+)', 'import} \\\\textcolor{lblue}{\\1} ', str)
    s = re.sub(r'([_a-zA-Z0-9(){}\\]+)\.([_a-zA-Z0-9]+)\b', '\\1.\\\\textcolor{ltcol}{\\2}', s) 
    print(s)

if __name__ == '__main__':
    import fileinput
    str = ""
    for line in fileinput.input():
        str += line
    main(str)
