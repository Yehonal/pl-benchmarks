# BENCHMARKS

## Why benchmark Euler 12?

How long does each runtime take to do the same computation, and how does that time change between releases? The workload is small enough to inspect: every implementation visits the same triangular numbers and tries the same divisors in the same order. Most of the work is a loop over integers with a remainder operation and a branch. A sieve could find the answer faster, but it would change the amount of work and break the comparison with earlier runs.

Keeping that work fixed makes runtime differences easier to investigate. For example, CPython, PyPy and RustPython execute the same Python file. Comparing PyPy with its JIT enabled and disabled also lets us change one runtime setting while keeping the source and input fixed. The timer measures elapsed time from process launch through exit, including startup and any JIT warm-up during the search.

An I/O benchmark answers a different question. If a request spends most of its time waiting for a database, its latency depends heavily on the database, caches and network. Two runtimes could finish that request at nearly the same time while taking very different times to execute this loop. Use the same-run ranking to compare this CPU-bound workload. Use application-level measurements to choose a runtime for a service.

[Benchmark implementations](euler-problem12/)

## Daily release benchmarks

[Published measurements](https://yehonal.github.io/pl-benchmarks/) · [Workflow runs](https://github.com/Yehonal/pl-benchmarks/actions/workflows/benchmarks.yml)

At 04:23 UTC daily, the workflow checks the Docker Official Images manifests for stable GCC (C/C++), Go, Rust, Node.js, CPython, PyPy, PHP CLI, Perl and Eclipse Temurin JDK versions, plus Cython releases on PyPI and stable, non-yanked RustPython releases on crates.io. It waits for an installable official image on the tracked Linux variant. The first successful run and the addition of a new runtime establish a complete baseline with one version per family. Later runs test newly observed versions, including maintenance releases, and retest an earlier measured version on the same runner when available. A check with no new versions skips measurement and publication. Manual runs use the same rules.

Each sample starts a fresh process and must print 842161320. Downloads and compilation are outside the timed interval. RustPython builds the exact crate release with its lockfile and embedded standard library, then runs the same euler.py as CPython and PyPy. C and C++ use GCC at -O3, PHP uses CLI without an INI file, PyPy runs with and without JIT, and Cython embeds a typed implementation compiled at -O3 on a fixed CPython image. HHVM is outside this PHP benchmark. Raw samples record the image digest, CPU, commit and runner image version. The benchmark-results branch stores validated samples and serves as the GitHub Pages source. The workflow requests a Pages build and verifies the public report against the saved JSON.

The benchmark preserves the original Euler 12 algorithm in every implementation. Visit triangular numbers in sequence. For each one, test every candidate from 1 through the integer part of its square root using remainder, count each divisor pair, and count a square root once. Stop at the first number with over 1000 divisors. The native trial-division series uses 32-bit loop operands in C, C++, Go, Rust, Java and Cython. The public history includes only trial-division runs.
