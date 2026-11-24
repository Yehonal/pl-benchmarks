// Time only the benchmark process inside its container, excluding setup and pulls.
#include <stdio.h>
#include <sys/resource.h>
#include <sys/wait.h>
#include <time.h>
#include <unistd.h>

int main(int argc, char **argv) {
    if (argc < 2) return 2;
    struct timespec start, end;
    struct rusage usage;
    int status;
    clock_gettime(CLOCK_MONOTONIC, &start);
    pid_t pid = fork();
    if (pid < 0) return 1;
    if (pid == 0) {
        execvp(argv[1], argv + 1);
        _exit(127);
    }
    if (wait4(pid, &status, 0, &usage) < 0 || !WIFEXITED(status) || WEXITSTATUS(status)) return 1;
    clock_gettime(CLOCK_MONOTONIC, &end);
    fprintf(stderr, "MEASURE %.6f %ld\n", end.tv_sec - start.tv_sec + (end.tv_nsec - start.tv_nsec) / 1e9, usage.ru_maxrss);
    return 0;
}
