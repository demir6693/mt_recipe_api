const express = require('express');
const router = express.Router();
const mysql = require('mysql');

const db = mysql.createConnection({
    host: '*',
    user: '*',
    password: '*',
    database: '*'
});

db.connect((err => {
    if(err)
    {
        throw err;
    }
    console.log('MySql Connected...');
}));

/*
router.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'GET req racuni'
    });
}); */

router.get('/', (req, res) => {
    let sql = "SELECT * FROM racuni";
    let query = db.query(sql, (err, result) => {
        if(err) throw err;
        
        res.send(result);
    });
});

//dnevni
router.get('/getdnevni', (req, res) => {
    var datetime = new Date();
    var current_day = datetime.getDate();
    var current_month = datetime.getMonth() + 1;
    var current_year = datetime.getFullYear();
    let sql = `SELECT * FROM racuni WHERE ( (DAY(datum_izdavanja)) = ${current_day}
    AND (MONTH(datum_izdavanja)) = ${current_month}) 
    AND (YEAR(datum_izdavanja) = ${current_year})`;
    let query = db.query(sql, (err, result) => {
        if(err) throw err;
        res.send(result);
    });
});

//mesecni
router.get('/getmesecni', (req, res) => {
    var datetime = new Date();
    var current_month = datetime.getMonth() + 1;
    var current_year = datetime.getFullYear();
    let sql = `SELECT (SUM(iznos)- SUM(iznos_nabavna)), SUM(iznos) FROM racuni WHERE ((MONTH(datum_izdavanja)) = ${current_month}) 
    AND (YEAR(datum_izdavanja) = ${current_year})`;
    let query = db.query(sql, (err, result) => {
        if(err) throw err;
        res.send(result);
    });
});

//godisnji
router.get('/getgodisnji', (req, res) => {
    var datetime = new Date();
    var current_year = datetime.getFullYear();
    let sql = `SELECT (SUM(iznos)- SUM(iznos_nabavna)), SUM(iznos) FROM racuni WHERE (YEAR(datum_izdavanja) = ${current_year})`;
    let query = db.query(sql, (err, result) => {
        if(err) throw err;
        res.send(result);
    });
});

module.exports = router;
