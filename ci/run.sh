#!/usr/bin/env bash
set -euo pipefail
cd /tmp
name=$1
version=$2
case "$name" in
  gcc) gcc -O3 /src/euler.c -lm -o c; g++ -O3 /src/euler.cpp -o cpp ;;
  eclipse-temurin) javac -d . /src/euler.java ;;
  rustpython) cargo install --locked --version "=$version" --features freeze-stdlib --jobs 2 rustpython ;;
  cython)
    pip install --disable-pip-version-check --no-cache-dir "Cython==$version"
    cython --embed -3 /src/euler.pyx -o euler.c
    gcc -O3 $(python3-config --includes) euler.c $(python3-config --embed --ldflags) -o cython-bench ;;
esac
run() {
  local variant=$1
  shift
  for trial in 1 2 3; do
    /bench-time "$@" >answer 2>metrics || { cat metrics >&2; exit 1; }
    [[ $(cat answer) == 842161320 ]] || { echo "Wrong answer for $variant" >&2; exit 1; }
    read -r tag seconds rss < <(grep '^MEASURE ' metrics)
    printf 'SAMPLE %s %s %s\n' "$variant" "$seconds" "$rss"
  done
}
case "$name" in
  gcc) run C ./c; run C++ ./cpp ;;
  node) run Node node /src/euler.js ;;
  rustpython) run RustPython rustpython /src/euler.py ;;
  python) run CPython python3 /src/euler.py ;;
  pypy) run PyPy pypy3 /src/euler.py; run PyPy-noJIT pypy3 --jit off /src/euler.py ;;
  eclipse-temurin) run Java java -cp . euler ;;
  php) run PHP php -n /src/euler.php ;;
  perl) run Perl perl /src/euler.perl ;;
  cython) run Cython ./cython-bench ;;
  *) exit 2 ;;
esac
