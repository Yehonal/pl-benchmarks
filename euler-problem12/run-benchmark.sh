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

#
# TESTING COMPILED LANGUAGES
#

if $RUN_C ; then
    echo "starting compiled c benchmark..."
    time ./bin/c
fi

if $RUN_CPP ; then
    echo "starting compiled c++ benchmark..."
    time ./bin/cpp
fi

if $RUN_JAVA ; then
    echo "starting compiled java benchmark..."
    time java -jar ./bin/java.jar
fi

if $RUN_CYTHON ; then
    echo "starting compiled python benchmark ( don't worry , it can take some minutes )..."
    time ./bin/python
fi

#
# TESTING INTERPRETED LANGUAGES
#

if $RUN_NODEJS ; then
    echo "starting interpreted nodejs ( javascript ) benchmark..."
    time nodejs ./euler.js
fi

if $RUN_PHP ; then
    echo "starting interpreted php benchmark ( don't worry , it can take some minutes )..."
    time php ./euler.php
fi

if $RUN_PYTHON ; then
    echo "starting interpreted python benchmark ( don't worry , it can take some minutes )..."
    time python3 ./euler.py
fi

if $RUN_PYPY ; then
    echo "starting interpreted pypy benchmark..."
    time pypy ./euler.py
fi

if $RUN_PERL; then
    echo "starting interpreted perl benchmark ( don't worry , it can take some minutes )..."
    time perl ./euler.perl
fi

#
# DONE
#

echo "benchmark terminated!"

