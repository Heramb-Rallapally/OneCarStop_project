const mongoose = require('mongoose');

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/carStop');
}

main().then(() => {
    console.log("db working!");
}).catch(err => console.log(err));

const Carinfo = require('./models/carinfo.js');

/*const allCars = [{
    Owner: "Surya2",
    CarModel: "Ertiga ZXI",
    Aadhar_No: "5hbdgf",
    imageUrl: "https://imgd.aeplcdn.com/1280x720/cw/ec/31422/Maruti-Suzuki-Ertiga-Right-Front-Three-Quarter-153025.jpg",
    created_at: new Date(),
    CarPlate: "TS07HG2345",
    UserImage: "https://imgd.aeplcdn.com/1280x720/cw/ec/31422/Maruti-Suzuki-Ertiga-Right-Front-Three-Quarter-153025.jpg",
    License_Expiry: new Date('2024-12-29'),
    Puc_Expiry: new Date('2025-04-08'),
    address:"THANE",
}];
Carinfo.insertMany(allCars);*/
Carinfo.updateOne({Owner:'Somnath'},{address:'Jamnagar'}).then((res)=>
{
    console.log(res);
}).catch((err)=>{
    console.log(err);
});
Carinfo.updateOne({Owner:'Heramb'},{address:'Thane'}).then((res)=>
{
    console.log(res);
}).catch((err)=>
{
console.log(err);
});
Carinfo.updateOne({Owner:'Gautam Rallapally'},{address:'Vijayawada'}).then((res)=>
    {
        console.log(res);
    }).catch((err)=>
    {
    console.log(err);
    });

    Carinfo.updateOne({Owner:'Rani_Rallapally'},{address:'Razole'}).then((res)=>
        {
            console.log(res);
        }).catch((err)=>
        {
        console.log(err);
        });
    




