# BENCHMARKS

Here you can find various sources to benchmark multiple programming languages


* [Euler problem #12](https://github.com/Yehonal/pl-benchmarks/blob/master/euler-problem12/README.md)

## Daily release benchmarks

[Published measurements](https://yehonal.github.io/pl-benchmarks/) · [Workflow runs](https://github.com/Yehonal/pl-benchmarks/actions/workflows/benchmarks.yml)

At 04:23 UTC daily, the workflow checks the Docker Official Images manifests for stable GCC (C/C++), Node.js, CPython, PyPy, PHP CLI, Perl and Eclipse Temurin JDK versions, plus Cython releases on PyPI. It waits for an installable official image on the tracked Linux variant. The first successful run establishes a baseline with one version per family. Later runs test newly observed versions, including maintenance releases, and retest an earlier measured version on the same runner when available. A check with no new versions skips measurement and publication. Manual runs use the same rules.

Each sample starts a fresh process and must print 842161320. Downloads and compilation are outside the timed interval. C and C++ use GCC at -O3, PHP uses CLI without an INI file, PyPy runs with and without JIT, and Cython embeds a typed implementation compiled at -O3 on a fixed CPython image. HHVM is outside this PHP benchmark. Raw samples record the image digest, CPU, commit and runner image version. The benchmark-results branch stores validated samples and serves as the GitHub Pages source. The workflow requests a Pages build and verifies the public report against the saved JSON.

The optimized suite counts divisors by adding each factor pair once (one divisor for a square, two otherwise). It doubles its search range from 256 until the first match. Consecutive integers are coprime, so the divisor count of each triangular number is the product of the counts for the odd term and half the even term. All runtimes perform the same search, without an answer-derived bound. Measurements include startup, which matters for this shorter workload. Changing the suite establishes a new complete baseline. Earlier trial-division runs remain in the labeled history.
