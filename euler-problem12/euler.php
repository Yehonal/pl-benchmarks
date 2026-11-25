<?php
function firstTriangle(): int {
    for ($size = 256; ; $size *= 2) {
        $counts = array_fill(0, $size + 1, 0);
        for ($d = 1; $d * $d <= $size; ++$d) {
            ++$counts[$d * $d];
            for ($n = $d * $d + $d; $n <= $size; $n += $d) $counts[$n] += 2;
        }
        for ($i = $size === 256 ? 1 : $size >> 1; $i < $size; ++$i) {
            $half = ($i + 1) >> 1;
            $odd = $i | 1;
            if ($counts[$half] * $counts[$odd] > 1000) return $half * $odd;
        }
    }
}

echo firstTriangle(), "\n";
