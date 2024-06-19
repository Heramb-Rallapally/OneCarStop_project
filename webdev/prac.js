const value=(a,b)=>
    {
        return (a+b);
    }

console.log(value(5,6));

console.log("started");

setTimeout(()=>
{
console.log("waited for 3s");
},3000);

console.log("ended");