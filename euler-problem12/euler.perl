#!/usr/bin/perl

use Math::Complex;

sub factorCount{
	my ($n) = @_;
	$square = sqrt($n);
	$isquare = int($square);
    
    $count=0;
	if ($square == $isquare){
		$count = -1;
	}

	for ($candidate = 1; $candidate <= $isquare; $candidate++) {
		if ($n % $candidate == 0){
			$count +=2;
		}
	}

	return $count;
}

$triangle = 1;
$index = 1;
while (factorCount($triangle) < 1001) {
	$index++;
	$triangle += $index;
}

print $triangle . "\n";
