import mongoose  from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    
    product_name: { type: String, required: true },
    product_price: { type: Number, required: true },

    user_id: { type: mongoose.Schema.Types.ObjectId, ref:"user", required:true},
   stock:{ type: Number, required: true },
 
  },

  {
    timestamps: true,
  },
);

const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);

export default Product;
