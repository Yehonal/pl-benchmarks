def first_triangle():
    size = 256
    start = 1
    while True:
        counts = [0] * (size + 1)
        d = 1
        while d * d <= size:
            square = d * d
            counts[square] += 1
            for n in range(square + d, size + 1, d):
                counts[n] += 2
            d += 1
        for i in range(start, size):
            half = (i + 1) >> 1
            odd = i | 1
            if counts[half] * counts[odd] > 1000:
                return half * odd
        start, size = size, size * 2


print(first_triangle())
