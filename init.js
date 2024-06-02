const mongoose = require('mongoose');
main().then(() => {
    console.log("db working!");
  }).catch(err => console.log(err));
  
  async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/carStop');
  }

  const Chat = require('./models/carinfo.js');

  const allCars=[{
    Owner: "neha",
    CarModel: "Ertiga",
    Aadhar_No: "4ahdgtjkf",
    imageUrl : "pic",
    created_at: new Date(),
    CarPlate :"MH04"
},
];
 Chat.insertMany(allCars);console.log("hello");

 