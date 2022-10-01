const express = require('express');
const path = require('path');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
var cors = require('cors');
app.use(cors());

let db;
const MongoClient = require('mongodb').MongoClient;
MongoClient.connect("mongodb+srv://gunhee94:PLhDAwXia2G7pzpC@cluster0.tzu3kwr.mongodb.net/?retryWrites=true&w=majority", (error,client) => {
    if (error) return console.log(error);

    app.listen(8080, () => {
        db = client.db('question');    
        console.log('listening on 8080')
    });
});

app.get('/list', (req, res) => {
    db.collection("questions").find().toArray((error, result) => {
        if(error) {return console.log(error)}
        res.json({questions : result})
    });
})

app.get('/count', (req, res) => {
    db.collection("count").findOne({name : "게시물갯수"}, (error, result) => {
        if(error) {return console.log(error)}
        res.json({count : result.totalPost})
    });
})


app.get('/list/:id', (req, res) => {

    db.collection("questions").find().toArray((error, result) => {
        if(error) {return console.log(error)}

        let id = Number(req.params.id) === 0 ? 
            Math.min(...result.map((data) => data._id)) : req.params.id;

        db.collection("questions").findOne({_id : Number(id)}, (error, result) => {
            if(error) {return console.log(error)}
            res.json({question : result})
        })
    });

})

app.post('/add', (req, res) => {
    console.log(req.body.question, "바디")

    db.collection("count").findOne({name : "게시물갯수"}, (error, result) => {

        req.body.question._id = result.totalPost + 1;

        db.collection("questions").insertOne(req.body.question, (error, result) => {

            // $set : 바꿀값
            // $inc : 기존값에 더해줄 값 
            // $min : 기존값보다 적을 때만 변경
            // $ rename : key값 이름변경
            db.collection("count").updateOne({name : "게시물갯수"}, { $inc : {totalPost : 1}}, (error, result) => {
                if(error) {return console.log(error)}
                res.send("success");
            }) 
        })

    }) 

})

app.put('/update', (req,res) => {
    db.collection("questions").updateOne({_id : req.body.question._id}, {$set : {
        title : req.body.question.title,
        content : req.body.question.content,
        answer : req.body.question.answer
    }}, (error, result) => {
        if(error) {return console.log(error)}
        res.send("success");
    })
})

app.delete('/delete/:id', (req, res) => {
    db.collection("questions").deleteOne({_id : Number(req.params.id)}, (error, result) => {
        if(error) {return console.log(error)}

        db.collection("count").updateOne({name : "게시물갯수"}, { $inc : {totalPost : -1}}, (error, result) => {
            if(error) {return console.log(error)}
            res.send("success");
        }) 
    })
})

app.use(express.static(path.join(__dirname, 'client/build'))); //특정폴더의 파일들 전송가능

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

//리액트 라우터 쓰는경우 최하단에 추가해놓기
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build/index.html'));
})