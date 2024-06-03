const mongoose = require('mongoose');
main().then(() => {
    console.log("db working!");
  }).catch(err => console.log(err));
  
  async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/carStop');
  }

  const Chat = require('./models/carinfo.js');
  const AllCars=[{
    Owner:"Surya",
    CarModel:"Ertiga ZXI",
    Aadhar_No:"5hbdgf",
    imageUrl:"pic",
    created_at:new Date(),
    CarPlate : "TS07HG2345",
    UserImage:"my_peronal_pic",
    License_Expiry:new Date('2024-12-29'),
    Puc_Expiry:new Date('2025-04-08'),
  },
  {
    Owner:"Srinivas Sharma",
    CarModel:"Logan 2007",
    Aadhar_No:"7jhyfnk",
    imageUrl:"pic",
    created_at:new Date(),
    CarPlate : "AP05AB9878",
    UserImage:"my_peronal_pic",
    License_Expiry:new Date('2024-12-29'),
    Puc_Expiry:new Date('2025-04-08')},

    {
      Owner:"Savitri Rallapally",
      CarModel:"Logan 2009",
      Aadhar_No:"78hdgfn",
      imageUrl:"pic",
      created_at:new Date(),
      CarPlate : "AP09AB2500",
      UserImage:"my_peronal_pic",
      License_Expiry:new Date('2024-12-29'),
      Puc_Expiry:new Date('2025-04-08')},

  
  ];

  const us=Chat.insertMany(AllCars).then((res)=>
  {
  console.log("users added");
  }).catch((err)=>
    {
    console.log(err);
    });
 /*const mongoose = require('mongoose');

 const carinfoSchema = new mongoose.Schema({
    Owner: {
     type: String,
     required: true
   },
    CarModel: {
     type: String,
     required: true
   },
    Aadhar_No: {
     type: String,
     required: true
   },
   imageUrl: {
     type: String, 
     required: true
 },
   created_at: {
     type: Date,
     required: true,
   },
   CarPlate : {
     type: String,
     required: true,
   },
   UserImage : {
     type: String, 
   },
   License_Expiry : {
     type: Date,
   },
   Puc_Expiry : {
     type: Date,
   }
 });
 
 const carinfo = mongoose.model("Carinfo", carinfoSchema);
 
 module.exports = carinfo;
 //db.carinfos.find()
*/ 