
public class euler {

    public static int factorCount(long n) {
        double square = Math.sqrt(n);
        int isquare = (int) square;
        int count = isquare == square ? -1 : 0;
        long candidate;
        for (candidate = 1; candidate <= isquare; candidate++) {
            if (0 == n % candidate) {
                count += 2;
            }
        }
        return count;
    }

    public static void main(String args[]) {
        long triangle = 1;
        int index = 1;
        while (euler.factorCount(triangle) < 1001) {
            index++;
            triangle += index;
        }

        System.out.println(triangle);
    }
}
