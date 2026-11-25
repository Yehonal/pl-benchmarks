from libc.stdlib cimport calloc, free
from libc.stdint cimport uint16_t

cdef int first_triangle():
    cdef int size = 256, start = 1, d, n, i, half, odd
    cdef uint16_t* counts
    while True:
        counts = <uint16_t*>calloc(size + 1, sizeof(uint16_t))
        if counts == NULL:
            raise MemoryError()
        try:
            d = 1
            while d * d <= size:
                counts[d * d] += 1
                n = d * d + d
                while n <= size:
                    counts[n] += 2
                    n += d
                d += 1
            for i in range(start, size):
                half = (i + 1) >> 1
                odd = i | 1
                if counts[half] * counts[odd] > 1000:
                    return half * odd
        finally:
            free(counts)
        start, size = size, size * 2

print(first_triangle())
