#!/bin/bash

. config.sh || exit

#
# COMPILING PHASE
#

if $RUN_C ; then
    echo "compiling euler.c"
    gcc euler.c -lm -o "./bin/c"
fi

if $RUN_CPP ; then
    echo "compiling euler.cpp"
    g++ euler.c -o "./bin/cpp"
fi

if $RUN_JAVA ; then
    echo "compiling euler.java"
    javac euler.java -d ./build/ && cd ./build/ && jar cfe ../bin/java.jar euler ./euler.class && cd .. && chmod +x ./bin/java.jar
fi

if $RUN_CYTHON ; then
    echo "compiling euler.py"
    cython3 euler.py --embed -o ./build/python.c
    gcc -Os -I'/usr/include/python'$PYTHON_VERSION'm' -o ./bin/python ./build/python.c -l'python'$PYTHON_VERSION'm' -lpthread -lm -lutil -ldl
fi

if $RUN_C ; then
    echo "starting c benchmark (compiled)..."
    time ./bin/c
fi

echo ""
echo "==========================="
echo ""

if $RUN_CPP ; then
    echo "starting c++ benchmark (compiled)..."
    time ./bin/cpp
fi

echo ""
echo "==========================="
echo ""

if $RUN_CYTHON ; then
    cython3 --version
    echo "starting c-python benchmark (compiled)..."
    time ./bin/python
fi

echo ""
echo "==========================="
echo ""

if $RUN_JAVA ; then
    java --version
    echo "starting java benchmark (JIT)..."
    time java -jar ./bin/java.jar
fi

echo ""
echo "==========================="
echo ""


echo ""
echo "==========================="
echo ""

if $RUN_NODEJS ; then
    nodejs --version
    echo "starting nodejs (javascript) benchmark (JIT)..."
    time nodejs ./euler.js
fi

echo ""
echo "==========================="
echo ""

if $RUN_PHP ; then
    php --version
    echo "starting php benchmark (interpreted on 5, interpreted/opcache on 7, JIT if 8)..."
    time php ./euler.php
fi

echo ""
echo "==========================="
echo ""

if $RUN_PHP_HHVM ; then
    hhvm --version
    echo "starting php on hhvm benchmark (JIT)..."
    time hhvm ./euler.php
fi

echo ""
echo "==========================="
echo ""

if $RUN_PYTHON ; then
    python3 --version
    echo "starting python benchmark (interpreted)..."
    time python3 ./euler.py
fi

echo ""
echo "==========================="
echo ""

if $RUN_PYPY ; then
    pypy --version
    echo "starting pypy benchmark (JIT)..."
    time pypy ./euler.py
fi

echo ""
echo "==========================="
echo ""

if $RUN_PERL; then
    perl --version
    echo "starting perl benchmark (interpreted)..."
    time perl ./euler.perl
fi

echo ""
echo "==========================="
echo ""

#
# DONE
#

echo "benchmark terminated!"

