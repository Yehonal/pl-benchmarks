# BENCHMARKS

## Why benchmark Euler 12?

I care about what happens after the data arrives. Even a service built around I/O has to do something with the records it reads: compare values, apply rules, update totals. Asynchronous I/O lets the service do useful work while a read is pending. Once the records are in memory, the CPU time needed to process each one still matters. When I choose a runtime, I want to know the cost of expressing that work directly in the language.

Euler 12 gives me one small computation I can follow from source to result. Every implementation visits the same triangular numbers and tests the same divisors in the same order. That fixes the loop, integer remainder and branch being compared across runtimes and releases. CPython, PyPy and RustPython even execute the same file. The timer includes process startup and any JIT warm-up during the search.

The ranking is specific to that loop. Sorting strings, multiplying matrices in a native library and serving concurrent network requests exercise different code paths and deserve their own measurements.

[Benchmark implementations](euler-problem12/)

## Daily release benchmarks

[Published measurements](https://yehonal.github.io/pl-benchmarks/) · [Workflow runs](https://github.com/Yehonal/pl-benchmarks/actions/workflows/benchmarks.yml)

At 04:23 UTC daily, the workflow checks the Docker Official Images manifests for stable GCC (C/C++), Go, Rust, Node.js, CPython, PyPy, PHP CLI, Perl and Eclipse Temurin JDK versions, plus Cython releases on PyPI and stable, non-yanked RustPython releases on crates.io. It waits for an installable official image on the tracked Linux variant. The first successful run and the addition of a new runtime establish a complete baseline with one version per family. Later runs test newly observed versions, including maintenance releases, and retest an earlier measured version on the same runner when available. A check with no new versions skips measurement and publication. Manual runs use the same rules.

Each sample starts a fresh process and must print 842161320. Downloads and compilation are outside the timed interval. RustPython builds the exact crate release with its lockfile and embedded standard library, then runs the same euler.py as CPython and PyPy. C and C++ use GCC at -O3, PHP uses CLI without an INI file, PyPy runs with and without JIT, and Cython embeds a typed implementation compiled at -O3 on a fixed CPython image. HHVM is outside this PHP benchmark. Raw samples record the image digest, CPU, commit and runner image version. The benchmark-results branch stores validated samples and serves as the GitHub Pages source. The workflow requests a Pages build and verifies the public report against the saved JSON.

The benchmark preserves the original Euler 12 algorithm in every implementation. Visit triangular numbers in sequence. For each one, test every candidate from 1 through the integer part of its square root using remainder, count each divisor pair, and count a square root once. Stop at the first number with over 1000 divisors. The native trial-division series uses 32-bit loop operands in C, C++, Go, Rust, Java and Cython. The public history includes only trial-division runs.
