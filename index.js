const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/Date.js");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();
const items = ["Buy food", "Study", "Get Groceries"];
// app.use(express.json());
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"))
mongoose.connect("mongodb+srv://naiduabhay1:naiduabhay%1345@cluster0.llkl16k.mongodb.net//todo");

const tdo = new mongoose.Schema({
n});
const Tdo = mongoose.model("item", tdo);

const todo1 = new Tdo({
    task: "Welcome "
})

const todo2 = new Tdo({
    task: "Hit + to add a task "
})
const todo3 = new Tdo({
    task: "<--Hit to delete item "
})

const tod = [todo1, todo2, todo3];

const customl = new mongoose.Schema({
    name: String,
    Items: [tdo]
});

const Custom = mongoose.model("newlist", customl)



app.get("/", function (req, res) {



    Tdo.find({}, (err, found) => {

        if (found.length === 0) {
            Tdo.insertMany(tod, (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Data Saved");
                }
            });
            res.redirect("/");
        }
        else {

            res.render("list", { kindofday: "Today", newtask: found });
        }


    })

    // var day = date.getDate()

})





app.post("/delete", (req, res) => {
    const checker = req.body.check;
    const listName=req.body.listName;
    if(listName==="Today"){
        Tdo.findByIdAndDelete(checker, (err) => {
        if (!err) {
            console.log("Deleted");
        }
        else {
            console.log(err);
        }
    })
    res.redirect("/");
    }else{
        Custom.findOneAndUpdate(
            {name :listName},
            {$pull:{Items:{_id :checker}}},
            function(err,foundList){
                if(!err){
                    res.redirect("/"+listName)
                }
            }
        )
    }
    
})

app.get("/:listName", (req, res) => {
    const newh =_.capitalize( req.params.listName);

    Custom.findOne({ name: newh }, (err, founded) => {
        if (!err) {
            if (founded) {
                res.render("list", { kindofday: founded.name, newtask: founded.Items });
            }
            else {
                const newList = new Custom({
                    name: newh,
                    Items: tod
                });
                newList.save();
                res.redirect("/" + newh);
            }
        }
    })



})
app.post("/", (req, res) => {
    const item = req.body.newItem;
    const listName = req.params.listname;

    
    const newt = new Tdo({
        task: item
    });

    if (listName === "Today") {

        newt.save();

        res.redirect("/");

    }
    else {
        
        Custom.findOne({ name: listName},function (err, found){
            found.Items.push(item);
            
            found.save();
            res.redirect("/" +listName);
        })
    }


});
app.get("/about", (req, res) => {
    res.render("about");
})


app.listen(3000, function () {
    console.log("start");
})