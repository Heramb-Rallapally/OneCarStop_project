const mongoose = require('mongoose');

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
