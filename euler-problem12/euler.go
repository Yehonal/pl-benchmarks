package main

import (
	"fmt"
	"math"
)

func factorCount(n int32) int32 {
	root := math.Sqrt(float64(n))
	limit := int32(root)
	var count int32
	if float64(limit) == root {
		count = -1
	}
	for candidate := int32(1); candidate <= limit; candidate++ {
		if n%candidate == 0 {
			count += 2
		}
	}
	return count
}

func main() {
	triangle, index := int32(1), int32(1)
	for factorCount(triangle) < 1001 {
		index++
		triangle += index
	}
	fmt.Println(triangle)
}
