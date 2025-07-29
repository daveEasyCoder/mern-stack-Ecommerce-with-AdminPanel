import Product from "../Models/productModel.js";
import fs from 'fs'
import path from "path";
// add product
export const addProduct = async (req, res) => {
  try {
    const {
      name,
      originalPrice,
      discountedPrice,
      rating,
      description,
      category,
      subCategory
    } = req.body;

    if (
      !name ||
      !originalPrice ||
      !discountedPrice ||
      !rating ||
      !description ||
      !category ||
      !subCategory
    ) {
      console.log("all fields are required");
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const files = req.files;
    if (!files || files.length === 0) {
      console.log("image required");
      return res
        .status(400)
        .json({ success: false, message: "image is required" });
    }

    let sizes = [];
    try {
      sizes = JSON.parse(req.body.sizes);
      if (!Array.isArray(sizes)) throw new Error();
    } catch {
      return res
        .status(400)
        .json({ success: false, message: "Sizes must be a valid JSON array" });
    }
   
    const origPrice = Number(originalPrice);
    const discPrice = Number(discountedPrice);
    const prodRating = Number(rating);

         if (
            isNaN(origPrice) ||
            isNaN(discPrice) ||
            isNaN(prodRating) ||
            origPrice < 0 ||
            discPrice < 0 ||
            prodRating < 0 ||
            prodRating > 5
        ) {
            return res.status(400).json({ success: false, message: "Numeric fields must be valid and non-negative" });
        }

    const imagesUrl = files.map((file) => file.filename);
    const discount = originalPrice - discountedPrice;
    const newProduct = new Product({
      name,
      originalPrice,
      discountedPrice,
      discount,
      description,
      image: imagesUrl,
      sizes,
      rating,
      category,
      subCategory,
    });
    await newProduct.save();
    return res
      .status(200)
      .json({
        success: true,
        product: newProduct,
        message: "product added successfully",
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// get all product

export const getProduct = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, products });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// get each product
export const getIndividualProduct = async (req, res) => {
  const id = req.params.id
  try {
    const product = await Product.findById(id)
    if(!product){
      console.log("product not found")
      return res.status(404).json({success:false,message:"product not found"})
    }
    const productCategory = product.category
    
     const relatedProducts = await Product.find({category:productCategory})
     
   
    return res.status(200).json({ success: true, product,relatedProducts });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};


// edit product
export const editProduct = async(req,res) => {
try {
    const {name,originalPrice,discountedPrice,description,rating,category,subCategory,existingImages,newImageIndexes,existingImageIndex} = req.body
    if(!name || !originalPrice || !discountedPrice || !description || !subCategory){
      console.log("all fields are required");
      return res.status(400).json({success:false,message:"all field are required"})
    } 
    let sizes = JSON.parse(req.body.sizes)
    sizes = Array.isArray(sizes) ? sizes : [sizes]
    const {id} = req.params
    const files = req.files
    const product = await Product.findById(id)
    if(!product){
      console.log("product not found")
      return res.status(404).json({success:false,message:"product not found"})
    }

    let existing = Array.isArray(existingImages) ? existingImages : [existingImages]
    let index = Array.isArray(newImageIndexes) ? newImageIndexes.map(i => Number(i)) : [Number(newImageIndexes)] 
    let prevImageIndex = Array.isArray(existingImageIndex) ? existingImageIndex.map(i => Number(i)) : [Number(existingImageIndex)] 

    let newImage = Array(4).fill(null) // [null,image434.png,image353.png,null]

   prevImageIndex.forEach((idx,i) => {
      newImage[idx] = existing[i] || null    
   })
   
  
    if(files && files.length > 0){
        files.forEach((file,idx) => {
             const i = index[idx]
             newImage[i] = file.filename
        })
    }
    
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        originalPrice,
        discountedPrice,
        discount:originalPrice-discountedPrice,
        description,
        image:newImage,
        rating,
        sizes,
        category,
        subCategory: subCategory || ""
      },
      { new: true }
    )
   if(!updatedProduct){
    console.log("product not found");
    return res.status(404).json({success:false,message:"product not found"}) 
   }
   // delete old images
    if(files && files.length > 0){
      files.forEach((file, idx) => {
          const i = index[idx];
          const oldFilename = product.image[i];
          if (oldFilename) {
            const oldImagePath = path.join("uploads", "productImage", oldFilename);
            if (fs.existsSync(oldImagePath)) {
              fs.unlinkSync(oldImagePath);
            }
          }
        });
    }

   return res.status(200).json({success:true,product:updatedProduct,message:"updated successfully"})

    } catch (error) {
      console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
     
}

export const getProductByCategory = async (req,res) => {
  try {
    const {category} = req.params
    const products = await Product.find({category})
    return res.status(200).json({success:true,products})
  } catch (error) {
     console.log(error);
     return res.status(500).json({ success: false, message: "Internal server error" });
  }
}