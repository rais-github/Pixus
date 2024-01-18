const mongoose = require("mongoose");
const Comment =require('./comment');
const defaultImg =
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60";

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    filename: {
      type: String,
    },
    url: {
      type: String,
      default: defaultImg,
      set: function (v) {
        return v.trim() === "" ? defaultImg : v;
      },
    },
  },
  link: {
    type: String,
  },
  board: {
    type: String,
    required: true,
  },
  taggedTopics: {
    type: String,
    required: true,
  },
  comments:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Comment'
  }]
});







listingSchema.post("findOneAndDelete",async(listingData)=>{
  if(listingData){
  await Comment.deleteMany({_id:{$in:listingData.comments}});
}
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
