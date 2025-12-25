for (let i = 0; i < 5; i++) {
    setTimeout(async () => {
        // await console.log(i)
    }, 3000)
}

function createCount() {
    let count = 0;

    return () => {
        count++;
        console.log(count);
    }
}

const counter = createCount();
counter();
counter();

let a = [1,2,3]
let b = [2,3,4]
// console.log(a.concat(b))

let aa = "dep" + 1 + 20 + "deepak"
// console.log(aa)

let obj1 = {
    name: "deepak",
    age: 23
}
let obj2 = {
    name: "guru",
    age: 25
}

console.log({...obj1, ...obj2})
