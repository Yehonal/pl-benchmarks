<?php

function factorCount ($n)
{
    $square = sqrt ($n);
    $isquare = (int) $square;
    $count = $isquare == $square ? -1 : 0;
    for ($candidate = 1; $candidate <= $isquare; $candidate ++)
        if (0 == $n % $candidate) $count += 2;
    return $count;
}


$triangle = 1;
$index = 1;
while (factorCount ($triangle) < 1001)
{
    $index ++;
    $triangle += $index;
}
echo ($triangle);
