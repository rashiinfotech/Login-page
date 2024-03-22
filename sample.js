// function add(num1, num2,callback){
//     let err= false;

//     if (num1===0||num2===0){
//         err=true
//     }
//   callback (num1+num2,err);

// }
// add(10,20,mainfun)

// function mainfun(sum,err){

//         if(err){
//             console.log("its zero")
//         }
//         else{
//             console.log(sum);
//             multi(sum,sum,(product)=>{
//                 console.log(product)
//             })

//         }
//     };

// function multi(num1,num2, callback){
//     callback(num1*num2)

// }
promis eg:

function add (num1, num2){

    return new Promise((resolve, reject)=>{
        if (num1===0){

            reject("error massag")
        }

        resolve(num1+num2)
    })

}

add(0,90).then((sum)=>{
    console.log(sum)
}).catch((err)=>{

    console.log(err)
})

function getName(){
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve("rashi")

        },3000)
        })

}

function getNum(){
    return new Promise((resolve, reject)=>{
        setTimeout(()=>{
            resolve("9809774403")

        },3000)
        })

}
getName().then((res)=>{

    console.log(res)
// })

async function getuser(){

    let name= await getName()
    console.log(name)
}
getuser()

// Promise.all([getName(),getNum()]).then((result)=>{
//     console.log(result)

// }
// )



// const promise = new Promise((resolve, reject) => {
//     // Simulate an asynchronous operation
//     setTimeout(() => {
//       resolve("Success!");
//     }, 2000);
//   });

// promise
//   .then(() => {
//     // Simulate another asynchronous operation
//     return new Promise((resolve, reject) => {
//       setTimeout(() => {
//         resolve("Second operation also succeeded!");
//       }, 1000);
//     });
//   })
//   .then((value) => {
//     console.log("Second operation success:", value);
//   })
//   .catch((error) => {
//     console.error("Any failure will be caught:", error);
//   });

// const http = require("http")
// const fs = require("fs")

// const server=http.createServer((req,res )=>{

//     const log= `requst on: ${Date.now()}\n`
//     fs.appendFile("text.txt", log, (err)=>{})

//     console.log(log)
//     res.end("ended")
// console.log("hello server2")

// })

// server.listen(8000,()=>{console.log("server started")})

// const http = require("http");
// const fs = require("fs");
// const myurl= url.parse(req.url, true)

// const server = http.createServer((req, res) => {
//   const log = `request on: ${Date.now()}\n`;

//  switch(myurl.pathname){

//     case "/":
//         if (req.method==="GET") res.end("this home")
        

//         break;
    
//  }

//   fs.appendFile("text.txt", log, (err) => {
//     if (err) {
//       console.error("Error appending to file:", err);
//       res.end("Error occurred");
//     } else {
//       console.log(log);
//       res.end("ended");
//       console.log("hello server2");
//     }
//   });
// });

// server.listen(8000, () => {
//   console.log("server started");
// });

// let a =0;

// do{
//     console.log(a)
//     a++

// }
// while(a<10);
// let a =0;

// while(a<10){

//     console.log(a)
//   a++
// }
// let num = 9;

// switch (num) {
//   case 1:
//     console.log("its one");
//     break;
//   case 2:
//     console.log("its 2");
//     break;
//   case 3:
//     console.log("its 3");
//     break;
//   case 4:
//     console.log("its 4");
//     break;
//   default:
//     console.log("its not selected number");
//     break;
// }
// (function add(a,b){
//     console.log(a+b)


// })(30,20)


//HOF

// // Higher-Order Function: takes a function as an argument
// function multiplyBy(factor) {
//     return function (number) {
//       return number * factor;
//     };
//   }
  
//   // Usage of Higher-Order Function
//   const double = multiplyBy(2);
//   console.log(double(5)); // Output: 10
  
// const express= require ("express")

// const app = express();






// app.get('/',(req,res)=>{

//    res.send("home page")
//   })

// app.listen (8000,()=>{console.log("server working")})

// const numbers = [10, 5, 8, 20, 15, 25];

// const large=numbers.reduce((acc, curr)=>{
//   return (curr>acc)? curr:acc;



// },0)
// console.log(large)

const numbers = [1, 2, 3, 4, 5];

const someGreaterThanThree = numbers.some(num => num > 3);
console.log(someGreaterThanThree); // Output: true

const someEven = numbers.some(num => num % 2 === 0);
console.log(someEven); // Output: true
