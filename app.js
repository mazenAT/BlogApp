var express = require("express"),
    app = express(),
    mongoose = require("mongoose"),
    bodyParser=require("body-parser");
    methodOverride= require("method-override");
    expressSanitizer = require("express-sanitizer");
    mongoose.connect('mongodb://localhost/Blog_App', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    })
    .then(() => console.log('Connected to DB!'))
    .catch(error => console.log(error.message));

app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(express.static("public"));
app.set("view engine","ejs");
app.use(methodOverride("_method"));
var blogAppSchema =  mongoose.Schema({
  title:String,
  image:String,
  body:String,
  created:{type:Date , default:Date.now}
});
var blog= mongoose.model("blog",blogAppSchema);


app.get("/",function(req,res){
        res.redirect("/blogs");
});

app.get("/blogs",function(req,res){
  blog.find({},function(err,allBlogs){
    if(err){
      console.log(err);
    }else {
        res.render("Index",{Blogs:allBlogs});
    }
  });

});
app.get("/blogs/new",function(req,res){
  res.render("new");
});
app.post("/blogs",function(req,res){
  req.body.blog.body = req.sanitize(req.body.blog.body);
  blog.create(req.body.blog,function(err,newBlog){
    if (err) {
      res.render("new");
    }else {
      res.redirect("/blogs");
    }
  });
});

app.get("/blogs/:id",(req,res)=>{
  blog.findById(req.params.id,(err,foundBlog)=>{
    if (err) {
      res.redirect("/blogs");
    }else {
      res.render("show", {blog: foundBlog});
    }
  });
});

app.get("/blogs/:id/edit",(req,res)=>{
  blog.findById(req.params.id,(err,foundBlog)=>{
    if (err) {
      res.redirect("/blogs")
    }else {
      res.render("edit",{blog:foundBlog});
    }
  });
});
app.put("/blogs/:id",(req,res)=>{
    req.body.blog.body = req.sanitize(req.body.blog.body);
  blog.findByIdAndUpdate(req.params.id,req.body.blog,(err,updatedBlog)=>{
    if(err){
      res.redirect("/blogs");
    }else {
      res.redirect("/blogs/"+req.params.id);
    }
  });
});

app.delete("/blogs/:id", (req,res)=>{
  blog.findByIdAndRemove(req.params.id,req.body.blog,(err)=>{
    if(err){
      res.redirect("/blogs");
    }else {
      res.redirect("/blogs");
    }
  });
});


app.listen(3000,function(){
	console.log("Blog App server has started");
});
