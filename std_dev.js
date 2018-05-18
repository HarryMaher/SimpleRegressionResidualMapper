//Translated to JS from:
//https://www.mathsisfun.com/data/standard-deviation-formulas.html

myarr= [9, 2, 5, 4, 12, 7, 8, 11, 9, 3, 7, 4, 12, 999, 953]

// take an array, returns classifcations abcdef to create bins
function standard_dev(in_array){
    function add(a, b){
        return a + b;
    }
    my_avg = (in_array.reduce(add, 0)/in_array.length)

    // get sum of mean difference squares
    myarr_prime = 0
    for(i=0;i<in_array.length;i++){
        myarr_prime += ((in_array[i]-my_avg)**2);
    };
    mean_sum_square_diff = (myarr_prime/in_array.length);

    // One standard deviation:
    std_dev = Math.sqrt(mean_sum_square_diff);
    a = my_avg - (2.0 * std_dev);
    b = my_avg - (1.0 * std_dev);
    c = my_avg - (0.5 * std_dev);
    d = my_avg + (0.5 * std_dev);
    e = my_avg + (1.0 * std_dev);
    f = my_avg + (2.0 * std_dev);
    return [a,b,c,d,e,f]
}

// Classify each item in terms of the standard deviation bins
// I really need to learn JS OOP
function classify_it(num, abcdef){
    a = abcdef[0]
    b = abcdef[1]
    c = abcdef[2]
    d = abcdef[3]
    e = abcdef[4]
    f = abcdef[5]       
    if (num > c && num < d){
        return 0;
    }
    if(num < c && num > b){
        return -0.6;
    }
    if(num < a){
        return -2.1;
    }
    if(num < b){
        return -1.1;
    }        
    if(num < e){
        return 0.9;
    }
    if(num < f){
        return 1.9;
    }
    if(num > f){
        return 2.1;
    }
}

new_arr = []
st_dev_results = standard_dev(myarr)
for(i=0;i<myarr.length;i++){
    new_arr.push([myarr[i], classify_it(myarr[i], st_dev_results)])
}
