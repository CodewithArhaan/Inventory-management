import "dotenv/config";
import express from "express";
import dbconnect from "./lib/mongodb.js";
import Product from "./models/product.js";
import jwt from "jsonwebtoken";
import User from "./models/user.js";

const app = express();
const port = 3000;

app.use(express.json());

app.post("/login", async (req, res) => {
  await dbconnect();
  const { Name } = req.body;
  const { email } = req.body;
  const { password } = req.body;

  let user = await User.findOne({ email: email });

  // if (user) {
  //   return res.json("User with the email already exsist")
  // }

  if (!user) {
    user = await User.create({ Name, email, password });
  }

  const acesstoken = jwt.sign(
    {
      Name: user.Name,
      email: user.email,
      id: user._id.toString(),
    },
    process.env.ACCESS_TOKEN_SECRET,
    
  );



  res.json({ acesstoken });
});




function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    req.user = user;

    next();
  });
}

app.use(authenticateToken);

// getting all products 
app.get("/", async (req, res) => {
  await dbconnect();

  const product = await Product.find({ user_id: req.user.id });

  res.json(product);
});



// adding products
app.post("/", async (req, res) => {
  await dbconnect();
  const data = req.body;

  const exists=await Product.findOne({product_name:data.product_name,user_id:req.user.id})
  
  if(exists) return res.json({duplicate:true,message:"Product with the name already exists"})

  const product = await Product.create({
    product_id: data.product_id,
    product_name: data.product_name,
    product_price: data.product_price,
    stock: data.stock,
    user_id: req.user.id,
  });

  res.send(product);
});


app.patch("/", async (req, res) => {
  

  res.send("hello");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
