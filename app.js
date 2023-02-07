
//Installing and setting up dependencies
const express = require("express");
const bodyPareser = require("body-parser");
const mongoose = require("mongoose");

//Connecting MongoDB and Creating a Schema
mongoose.connect("mongodb+srv://Rachit-Gupta:Key-14@cluster0.sqw7ija.mongodb.net/toDoListDB", {useNewUrlParser: true});

const itemsSchema = {
    itemName: String
};

const Item = mongoose.model("Item", itemsSchema);

const app = express();

app.set("view engine", "ejs");

app.use(bodyPareser.urlencoded({extended: true}));
app.use(express.static("public"));

//Creating default items to show in our list
const item1 = new Item({
    itemName: "Welcome to to-do list"
});

const item2 = new Item({
    itemName: "press the + button to add task"
})

const item3 = new Item({
    itemName: "check to remove a task"
})

const defaultItems = [item1, item2, item3];


//Get method

app.get("/", function(req, res){

    //for generating current date
    let today = new Date();

    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    let day = today.toLocaleDateString("en-US", options);

    //Checking if the list is empty in our DB , if yes then insert default items else render the items in DB

    Item.find({}, function(err, foundItems){
        if(foundItems.length === 0) {
            Item.insertMany(defaultItems, function(err){
                if(err){
                    console.log(err);
                }
                else{
                    console.log("Successfully inserted");
                }
            });
            res.redirect("/");
        }
        else{
            res.render("list", {dayName: day, items: foundItems});
        }
        
    });

    
});

//Post method for adding items in the list

app.post("/", function(req, res){
    const listItem = req.body.itemText;
    const item = new Item({
        itemName: listItem
    });
    item.save();
    res.redirect("/");
    console.log(listItem);
})

//Post method for removing items form the list

app.post("/delete", function(req, res){
    let checkedItemId = req.body.checkbox;
    if(checkedItemId){
        checkedItemId = checkedItemId.trim();
    }
    Item.findByIdAndRemove(checkedItemId, function(err){
        if (!err) {
            console.log("item deleted");
        }
        else{
            console.log(err);
        }
    });
    res.redirect("/");
});

//Port setup

app.listen("3000", function(){
    console.log("Server started at port 3000");
});