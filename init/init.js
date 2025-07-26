const initData=require('./data.js');
const mongoose=require('mongoose');
main().then(()=>{
    console.log("db connected");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/snugspot');

  
}
const listing=require('../models/listing.js');
const initdb=async()=>{
    await listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:'LGm7BfDehkYcqgg_FSO82_rXwQ85biZL'}))
    await listing.insertMany(initData.data);
    console.log('added');
}
 initdb();