// following line can be useful to test the script inside a browser
typeof module === 'undefined' && console.time('main');

function main() {

    function factorCount (n)
    {
        var square = Math.sqrt(n);
        var isquare = ~~square;
        var count = isquare == square ? -1 : 0;
        var candidate;
        for (candidate = 1; candidate <= isquare; candidate ++)
            if (0 == n % candidate) count += 2;
        
        return count;
    }


    triangle = 1;
    index = 1;
    while (factorCount (triangle) < 1001)
    {
        index ++;
        triangle += index;
    }
    console.log(triangle);

}

main();

typeof module === 'undefined' && console.timeEnd('main');
