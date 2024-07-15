const mongoose = require('mongoose');
const mcq = require('./models/mcq.js');
const mongodb_atlas = "mongodb+srv://heramb3112:xYat794RruxmdR4M@cluster0.2bhxsf0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const MONGO_URL = mongodb_atlas;

// Connect to MongoDB Atlas
mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000 // 30 seconds
});
const question2=new mcq({
    question:"How far ahead should you signal before making a turn?",
        option1:"50 feet",
        option2:"100 feet",
        option3:"200 feet",
        option4:"500 feet",
        answer:"B",
});
question2.save();

const question3=new mcq({
    question:"What is the minimum safe following distance between vehicles in good weather conditions?",
    option1:"One car length",
    option2:"Two seconds",
    option3:"Three seconds",
    option4:"Four seconds",
    answer:"C",
});
question3.save();
/*const allquestions=[
    {
        question:"What does a red traffic light indicate?",
        option1:"Stop",
        option2:"slow down",
        option3:"yield",
        option4:"Go if the way is clear",
        answer:"A",
    },
    {
        question:"When are you allowed to pass another vehicle on a two-lane road?",
        option1:"When you are in a designated passing zone",
        option2:"When you are driving faster than the speed limit",
        option3:"When the vehicle ahead is driving below the speed limit",
        option4:"Anytime",
        answer:"A",
    },
    {
        question:"What is the legal blood alcohol concentration (BAC) limit for drivers over 21 in most states?",
        option1:"0.02",
        option2:"0.04",
        option3:"0.08",
        option4:"0.10",
        answer:"C",
    },
    {
        question:"What should you do if you see a school bus stopped with its red lights flashing?",
        option1:"pass the bus quickly",
        option2:" Stop, regardless of your direction of travel",
        option3:"Slow down and proceed with caution",
        option4:"Continue driving if there are no children in sight",
        answer:"B",
    },
    {
        question:"What is the purpose of the Yield sign?",
        option1:"To give the right of way to other road users",
        option2:"To stop completely and then proceed",
        option3:"To indicate a pedestrian crossing",
        option4:"To notify of a nearby school zone",
        answer:"A",
    },
    {
      question:"When is it permissible to turn right on a red light?",
      option1:"When there is no sign prohibiting it and the way is clear",
      option2:"When you are in a hurry",
      option3:"After slowing down and checking for traffic",
      option4:"only at night",
      answer:"A",
    },
    {
        question:"What should you do if you miss your exit on the highway?",
        option1:" Stop and reverse to the exit",
        option2:"Make a U-turn at the next median",
        option3:"Continue to the next exit and adjust your route",
        option4:" Pull over and ask for directions",
        answer:"C",
    },
    {
        question:"How far ahead should you signal before making a turn?",
        option1:"50 feet",
        option2:"100 feet",
        option3:"200 feet",
        option4:"500 feet",
        answer:"B",
    },
    {
        question:"What is the minimum safe following distance between vehicles in good weather conditions?",
        option1:"One car length",
        option2:"Two seconds",
        option3:"Three seconds",
        option4:"Four seconds",
        answer:"C",
    }
];

mcq.insertMany(allquestions).then((res)=>
{
console.log(res);
}).catch((err)=>
{
console.log(err);
});*/
