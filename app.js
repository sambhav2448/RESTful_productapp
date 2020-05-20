var bodyParser = require("body-parser");
methodOverride = require("method-override");
expressSanitizer=require("express-sanitizer");
mongoose       = require("mongoose");
express        = require("express");
app            = express();

//APP CONFIG
mongoose.connect("*add local storage fr mongo*", {useNewUrlParser: true, useUnifiedTopology: true});
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));


//MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
    title:String,
    image:String,
    body:String,
    created:{ type:Date,default:Date.now }
});
var Blog = mongoose.model("Blog" , blogSchema);


//RESTFUL ROUTES

app.get("/",function(req,res){
    res.redirect("/product");
})

app.get("/product",function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log(err);
        }
        else{
            res.render("index",{blg :blogs});
        }
    });
});


//NEW ROUTES

app.get("/blogs/new",function(req,res){
    res.render("new");
});

//CREATE ROUTE

app.post("/blogs",function(req,res){

   
    req.body.blog.body=  req.sanitize(req.body.blog.body);
    
    Blog.create(req.body.blog,function(err,newblog){
        if(err){
            res.render("new");
        }else{
            res.redirect("/blogs"); 
        }
    });
});


//SHOW ROUTE

app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,foundblog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("show",{blog:foundblog});
        }
    })
});


//EDIT ROUTE

app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,foundblog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("edit",{blog:foundblog});
        }
    })
});


//UPDATE ROUTE

app.put("/blogs/:id",function(req,res){
    // res.send("UPDATED");
    req.body.blog.body=  req.sanitize(req.body.blog.body);

    Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedblog){
        if(err){
            res.redirect("blogs");
        }else{
            res.redirect("/blogs/"+ req.params.id);
        }
    });
});

//DELETE ROUTE

app.delete("/blogs/:id",function(req,res){
    // res.send("deelte route");
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.redirect("/blogs");
        }
    }); 
});

app.listen(3000,function(){
    console.log("The Blog App server has started!!");
});
