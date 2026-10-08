const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Student = require("./models/Student");
require("dotenv").config();

const app=express();
app.use(cors());
app.use(express.json());
let databaseConnection;

async function connectDatabase() {
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is required");
    }
    if (!databaseConnection) {
        databaseConnection = mongoose.connect(process.env.MONGO_URI).catch((error) => {
            databaseConnection = undefined;
            throw error;
        });
    }
    return databaseConnection;
}

app.get("/api/",(req,res)=> {
    res.send("Server is running");
});
app.use("/api/students", async (req, res, next) => {
    try {
        await connectDatabase();
        next();
    } catch {
        res.status(503).json({ message: "Database is unavailable" });
    }
});

app.get("/api/students",async(req,res)=> {
    const students = await Student.find();
    res.json(students);
});
app.post("/api/students",async(req,res)=> {
    const student = new Student({
        name: req.body.name,
        course: req.body.course,
        age: req.body.age
    });
    await student.save();
    res.json(student);
});
app.put("/api/students/:id",async(req,res)=> {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(student);
});
app.delete("/api/students/:id",async(req,res)=> {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "Student deleted" });
});
module.exports = app;

if (require.main === module) {
    const port = process.env.PORT || 5001;
    app.listen(port, () => {
        console.log("Server running on port " + port);
    });
}
