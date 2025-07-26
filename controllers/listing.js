const listing=require("../models/listing.js")

module.exports.index=async (req,res,)=>{
    const alllisting=await listing.find({});
    res.render('./listings/index.ejs',{alllisting});
}
module.exports.newRender= (req,res,next)=>{
    
    res.render('./listings/new.ejs');
  
}

module.exports.createNew=async (req,res)=>{
   const { location } = req.body.listings;
  const { path, filename } = req.file;
  
  const newlisting = new listing(req.body.listings);
  newlisting.owner = req.user._id;
  newlisting.image.url = path;
  newlisting.image.filename = filename;

  try {
    const response = await fetch(`https://us1.locationiq.com/v1/search?key=${process.env.LOCATIONIQ_API_KEY}&q=${encodeURIComponent(location)}&format=json`);
    const geoData = await response.json();

    if (geoData && geoData.length > 0) {
      newlisting.geometry = {
        type: "Point",
        coordinates: [parseFloat(geoData[0].lon), parseFloat(geoData[0].lat)]
      };
    } else {
      console.warn("No coordinates found for location:", location);
    }
  } catch (err) {
    console.error("Failed to fetch coordinates:", err.message);
  }

  await newlisting.save();
  req.flash("success", "New listing created !");
  res.redirect('/listings');
};



module.exports.showPage=async (req,res)=>{
    let{id}=req.params;
    let listings= await listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("owner");
    if(!listings){
        req.flash("error","Listing You requested for doesn't exist!");
        return res.redirect('/listings');
    }
    res.render("./listings/show.ejs",{listings});

}
module.exports.editRender=async (req,res)=>{

    let{id}=req.params;
    let list= await listing.findById(id);
      if(!list){
        req.flash("error","Listing You requeested for doesn't exist!");
        return res.redirect('/listings');
    }
    let originalurl=list.image.url;
    originalurl=originalurl.replace("/upload","/upload/w_250");
    res.render("./listings/correct.ejs",{list,originalurl});
}

module.exports.editListing=async (req,res)=>{
 
    let{id}=req.params;
    let updatedListing=await listing.findByIdAndUpdate(id,{...req.body.listings});
    if(typeof(req.file)!=="undefined"){
        let{path,filename}=req.file;
        updatedListing.image.url=path;
        updatedListing.image.filename=filename;
        await updatedListing.save();
    }
    req.flash("success"," listing updated!");
    res.redirect(`/listings/${id}`)
}

module.exports.destroyListing=async (req,res)=>{
    let{id}=req.params;
    let deletedlisting=await listing.findByIdAndDelete(id);
     req.flash("success"," listing deleted!");
    res.redirect(`/listings`)
}
module.exports.searchListings=async(req,res)=>{
    let {search}=req.query;
 
    let alllisting=await listing.find({country:`${search}`})
    if (!search || search.trim() === "") {
        req.flash("error", "Please enter a country to search.");
        return res.redirect("/listings");
    }

    if(!alllisting || alllisting.length==0){
        req.flash("error","No listings found for this search")
        return res.redirect("/listings")
    }

    return res.render('./listings/index.ejs',{alllisting});

}