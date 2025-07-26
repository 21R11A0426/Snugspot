const express=require('express');
const router=express.Router();
const wrapAsync=require('../utils/wrapAsync.js');
const controller=require("../controllers/listing.js");


const flash=require('connect-flash');
const {loggedIn,isOwner,validateListing,savedUrl,countries}=require("../middleware.js");
const multer  = require('multer')
const {storage}=require("../config.js");
const upload = multer({storage})

//index route
router.get('/', wrapAsync(controller.index))

// new route
router.get('/new',loggedIn,controller.newRender);
//search Route
router.get("/search",wrapAsync(controller.searchListings));
//create route
router.post('/',loggedIn,validateListing,upload.single('listings[image]'),wrapAsync(controller.createNew));

//show route
router.get('/:id',wrapAsync(controller.showPage))

//edit get route
router.get('/:id/edit',loggedIn,isOwner,wrapAsync(controller.editRender))

//update route
router.put('/:id',loggedIn,isOwner,upload.single('listings[image]'),validateListing,wrapAsync(controller.editListing));

//delete route
router.delete('/:id',loggedIn,isOwner,wrapAsync(controller.destroyListing));



module.exports=router;