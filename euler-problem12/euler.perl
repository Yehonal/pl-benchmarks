use strict;
use warnings;
use integer;

sub first_triangle {
    for (my $size = 256; ; $size *= 2) {
        my @counts = (0) x ($size + 1);
        for (my $d = 1; $d * $d <= $size; ++$d) {
            ++$counts[$d * $d];
            for (my $n = $d * $d + $d; $n <= $size; $n += $d) {
                $counts[$n] += 2;
            }
        }
        for (my $i = $size == 256 ? 1 : $size / 2; $i < $size; ++$i) {
            my $half = ($i + 1) >> 1;
            my $odd = $i | 1;
            return $half * $odd if $counts[$half] * $counts[$odd] > 1000;
        }
    }
}

print first_triangle(), "\n";
