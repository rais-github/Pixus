if (process.env.NODE_ENV != "production") {
  const dotenv = require("dotenv").config();
}
const express = require("express");
const mongoose = require("mongoose");
const path=require('path');
const eMate = require('ejs-mate');
const methodOverride=require('method-override');


const listingSchema=require('./models/listing')

const app = express();
const MONGO_URL = "mongodb://127.0.0.1:27017/pixus";
const PORT = process.env.PORT || 3000;

app.engine('ejs',eMate);
app.set('views',path.join(__dirname,"views"));
app.set('view engine',"ejs");

app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

main()
  .then((res) => {
    console.log("Connection to DB successful");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.get("/", (req, res) => {
  res.send("Root Route");
});


app.get('/pins',async(req,res)=>{
    const allPins= await listingSchema.find({});
    res.render('pins/index.ejs',{allPins})
})

app.get('/pins/new',async(req,res)=>{
    res.render('pins/new.ejs');
})

app.post('/pins',async(req,res)=>{
  const newPin = new listingSchema(req.body.pins);
  await newPin.save();
  res.redirect('/pins');

})

app.get('/pins/:id',async(req,res)=>{
    let {id}=req.params;
    const pin=await listingSchema.findById(id);
    res.render(`pins/show.ejs`,{pin});
})

app.get('/pins/:id/edit',async(req,res)=>{
  const pin = await listingSchema.findById(req.params.id);
  res.render('pins/edit.ejs',{pin});
})

app.put('/pins/:id',async(req,res)=>{
  let { id } = req.params;
  const pin = await listingSchema.findByIdAndUpdate(id, { ...req.body.pins });
  await pin.save();
  res.redirect(`/pins/${id}`);
})

app.delete('/pins/:id',async(req,res)=>{
  let{id}=req.params;
  const pin=await listingSchema.findByIdAndDelete(id);
  console.log(pin);
  res.redirect('/pins');
})

app.listen(PORT, function () {
  console.log(`Server Responding to port:${PORT}`);
});



// app.get('/testing',async(req,res)=>{
//     let sampleListing=new listingSchema({
//         title:'Palace Royale',
//         description:'A place of Royality',
//         board:'Temple',
//         taggedTopics:"Peace"
//     })

//     await sampleListing.save();
//     res.send('successfull')
//     console.log('Listing saved')
// })