function firstTriangle() {
    for (let size = 256; ; size *= 2) {
        const counts = new Uint16Array(size + 1);
        for (let d = 1; d * d <= size; ++d) {
            ++counts[d * d];
            for (let n = d * d + d; n <= size; n += d) counts[n] += 2;
        }
        for (let i = size === 256 ? 1 : size / 2; i < size; ++i) {
            const half = (i + 1) >> 1;
            const odd = i | 1;
            if (counts[half] * counts[odd] > 1000) return half * odd;
        }
    }
}

console.log(firstTriangle());
