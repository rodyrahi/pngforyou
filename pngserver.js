const express = require("express");
const app = express();
const { imagesdb } = require("./db.js");
const fs = require("fs");
const multer = require("multer");
app.set("view engine", "ejs");
app.use(express.static("public"));

const { removeBackground } = require('@imgly/background-removal-node');





// Add this middleware to parse the request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  const images = imagesdb.prepare("SELECT * FROM images ").all();

  console.log(images);
  res.render("index", { images: images });
});

app.get("/:category/:name/:id", (req, res) => {
  const id = req.params.id;
  const image = imagesdb.prepare("SELECT * FROM images WHERE id = ?").all(id);
  res.render("partials/imageview", { image: image[0] });
});

app.get("/admin", (req, res) => {
  const category = imagesdb.prepare("SELECT * FROM category ").all();
  console.log(category);
  res.render("partials/admin" , { category: category });
});

app.post("/uploadimage", upload.single("image"), async(req, res) => {
  const file = req.file;


  if (!file) {
    return res.status(400).send("No files were uploaded.");
  }

  const { filename, category, name, alttext, tags, style } = req.body;

  const writeStream = fs.createWriteStream(`public/images/${name}.png`);
  writeStream.write(file.buffer);

  const blob = await removeBackground(`public/images/${name}.png`);
  const buffer = Buffer.from(await blob.arrayBuffer());
  const dataURL = `data:image/png;base64,${buffer.toString("base64")}`;
  

  const writeStream2 = fs.createWriteStream(`public/images/${name}.png`);
  writeStream2.write(buffer);



  imagesdb.prepare(
    `INSERT INTO images (name, path, category, alt, tags, style) VALUES (?, ?, ?, ?, ?, ?)`).run(name, `/images/${name}.png`, category, alttext, tags, style)
 
      res.redirect("/admin");
    
});



app.post("/addcategory", (req, res) => {
  const { name } = req.body;
  imagesdb.prepare("INSERT INTO category (name) VALUES (?)").run(name);
  res.redirect("/admin");
});
app.get("/deletecategory/:id", (req, res) => {
  const id = req.params.id;
  imagesdb.prepare("DELETE FROM category WHERE id = ?").run(id);
  res.redirect("/admin");
});

app.listen(5000, () => {
  console.log("http://localhost:5000");
});
