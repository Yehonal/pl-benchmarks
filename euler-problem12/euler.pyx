from libc.math cimport sqrt
cimport cython


@cython.cdivision(True)
cdef int factor_count(int n) noexcept:
    cdef double square = sqrt(n)
    cdef int limit = <int>square
    cdef int count = -1 if limit == square else 0
    cdef int candidate
    for candidate in range(1, limit + 1):
        if n % candidate == 0:
            count += 2
    return count


cdef int first_triangle():
    cdef int triangle = 1, index = 1
    while factor_count(triangle) < 1001:
        index += 1
        triangle += index
    return triangle


print(first_triangle())
