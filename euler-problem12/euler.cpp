#include <cstdint>
#include <iostream>
#include <vector>

int main() {
    for (int size = 256; ; size *= 2) {
        std::vector<std::uint16_t> counts(size + 1);
        for (int d = 1; d * d <= size; ++d) {
            ++counts[d * d];
            for (int n = d * d + d; n <= size; n += d) counts[n] += 2;
        }
        for (int i = size == 256 ? 1 : size / 2; i < size; ++i) {
            int half = (i + 1) / 2;
            int odd = i | 1;
            if (counts[half] * counts[odd] > 1000) {
                std::cout << half * odd << '\n';
                return 0;
            }
        }
    }
}
