fn factor_count(n: i32) -> i32 {
    let root = f64::from(n).sqrt();
    let limit = root as i32;
    let mut count = if f64::from(limit) == root { -1 } else { 0 };
    for candidate in 1..=limit {
        if n % candidate == 0 {
            count += 2;
        }
    }
    count
}

fn main() {
    let mut triangle = 1;
    let mut index = 1;
    while factor_count(triangle) < 1001 {
        index += 1;
        triangle += index;
    }
    println!("{triangle}");
}
