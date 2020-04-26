console.log("start");


for (i = 1; i <= 10; ++i) {
    setTimeout(function() {
        console.log("sleep " + i);
    }, 1000);
}

setTimeout(function(){
    console.log("sleep1000");
},1000);
console.log("end");
