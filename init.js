const mongoose = require('mongoose');

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/carStop');
}

main().then(() => {
    console.log("db working!");
}).catch(err => console.log(err));

const Carinfo = require('./models/carinfo.js');

const allCars = [{
    Owner: "Surya",
    CarModel: "Ertiga ZXI",
    Aadhar_No: "5hbdgf",
    imageUrl: "https://imgd.aeplcdn.com/1280x720/cw/ec/31422/Maruti-Suzuki-Ertiga-Right-Front-Three-Quarter-153025.jpg",
    created_at: new Date(),
    CarPlate: "TS07HG2345",
    UserImage: "https://imgd.aeplcdn.com/1280x720/cw/ec/31422/Maruti-Suzuki-Ertiga-Right-Front-Three-Quarter-153025.jpg",
    License_Expiry: new Date('2024-12-29'),
    Puc_Expiry: new Date('2025-04-08')
}];

/*Carinfo.insertMany(allCars).then((res) => {
    console.log("users added");
}).catch((err) => {
    console.log(err);
});*/

db.carinfos.updateOne(
  { Owner: "Surya" },
  { $set: { imageUrl: "https://stimg.cardekho.com/images/carexteriorimages/930x620/Maruti/Ertiga/9538/1677834015185/front-left-side-47.jpg" } }
)

