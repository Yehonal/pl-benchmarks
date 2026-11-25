public class euler {
    public static void main(String[] args) {
        for (int size = 256; ; size *= 2) {
            short[] counts = new short[size + 1];
            for (int d = 1; d * d <= size; ++d) {
                ++counts[d * d];
                for (int n = d * d + d; n <= size; n += d) counts[n] += 2;
            }
            for (int i = size == 256 ? 1 : size / 2; i < size; ++i) {
                int half = (i + 1) >>> 1;
                int odd = i | 1;
                if (counts[half] * counts[odd] > 1000) {
                    System.out.println(half * odd);
                    return;
                }
            }
        }
    }
}
