var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var session = require('express-session');

var con=null;
if (!con) {
    con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "movies"
    });
}
con.connect((err) => {
    if (!err) console.log("Database connected")
});

/* GET users listing. */
router.get('/films', function (req, res) {
    con.query('Select * from movie where movie_id = ANY(Select distinct(movie_id) from shows)', (err, result) => {
        //console.log(result);
        res.render('films',{result:result});
    });
});

router.get('/home',function(req,res){
    res.render('index');
});

router.post('/films/place', function (req, res) {
    //console.log(req.body);
    req.session.movie_id=req.body.movie_id;
    con.query('select * from theater where theater_id = ANY(Select theater_id from shows where movie_id ='+req.body.movie_id+')', (err, result1) => {
        con.query('select * from movies where movie_id =' + req.body.movie_id, (err, result) => {
            res.render('place', { result: result1, movie: result });
        });
    });
});

router.post('/films/shows', function (req, res) {
    //console.log(req.body);
    con.query('Select * from shows where movie_id ='+req.session.movie_id+' and theater_id = '+req.body.theater_id, (err, result) => {
        res.render('shows', { result: result });
    });
});

router.post('/films/seat', function (req, res) {
    //console.log(req.body);
    req.session.show_id=req.body.show_id
    con.query('Select * from booked where show_id =' + req.body.show_id, (err, result) => {
        res.render('seat', { result: result, show_id: req.body.show_id});
    });
});



router.post('/films/book', function (req, res,next) {
    console.log(req.body)
    if(typeof req.body.seats != 'string'){
        for (var i = 0; i < req.body.seats.length;i++){
            con.query('INSERT INTO booked(order_id, show_id, seat_no) VALUES (NULL,'+req.session.show_id+','+req.body.seats[i]+')', (err, result) => {
                if(err){
                    console.log(err);
                }else{
                    con.query('UPDATE shows SET seats=seats-1 where show_id='+req.session.show_id,(err,result1)=>{
                        if(err){
                            console.log(err);
                        }else{
                            con.query('Delete from shows where seats= 0',(err,result)=>{
                                if(err){
                                    console.log(err);
                                }
                            });
                        }
                    });
                }
            });
        }
    }
    else{
        con.query('INSERT INTO booked(order_id, show_id, seat_no) VALUES (NULL,'+req.session.show_id+','+req.body.seats+')', (err, result) => {
                if(err){
                    console.log(err);
                }else{
                    con.query('UPDATE shows SET seats=seats-1 where show_id='+req.session.show_id,(err,result1)=>{
                        if(err){
                            console.log(err);
                        }else{
                            con.query('Delete from shows where seats= 0',(err,result)=>{
                                if(err){
                                    console.log(err);
                                }
                            });
                        }
                    });
                }
            });
    }
    res.render('index');
    
});



module.exports = router;
