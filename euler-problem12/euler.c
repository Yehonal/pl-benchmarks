#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    for (int size = 256; ; size *= 2) {
        uint16_t *counts = calloc(size + 1, sizeof(*counts));
        if (!counts) return 1;
        for (int d = 1; d * d <= size; ++d) {
            ++counts[d * d];
            for (int n = d * d + d; n <= size; n += d) counts[n] += 2;
        }
        for (int i = size == 256 ? 1 : size / 2; i < size; ++i) {
            int half = (i + 1) / 2;
            int odd = i | 1;
            if (counts[half] * counts[odd] > 1000) {
                printf("%d\n", half * odd);
                free(counts);
                return 0;
            }
        }
        free(counts);
    }
}
