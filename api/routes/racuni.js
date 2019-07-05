const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const empty = require('is-empty');

const db = mysql.createConnection({
    host: '80.241.218.76',
    user: 'root',
    password: 'Agovicetf6693',
    database: 'mobile_town',
    socketPath: '/run/mysqld/mysqld.sock'
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
}); 

router.get('/', (req, res) => {
    let sql = "SELECT * FROM racuni";
    let query = db.query(sql, (err, result) => {
        if(err) throw err;
        
        res.send(result);
    });
}); */

//dnevni
router.get('/getdnevni', verifyToken, (req, res) => {

    jwt.verify(req.token, 'mobiletown', (err, authData) => {
        if(err)
        {
            res.sendStatus(403);
        }
        else
        {
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
        }
    });

});

//mesecni
router.get('/getmesecni', verifyToken, (req, res) => {
    
    jwt.verify(req.token, 'mobiletown', (err, authData) =>{
        if(err)
        {
            res.sendStatus(403);
        }
        else
        {
            var datetime = new Date();
            var current_month = datetime.getMonth() + 1;
            var current_year = datetime.getFullYear();
            let sql = `SELECT (SUM(iznos)- SUM(iznos_nabavna)), SUM(iznos) FROM racuni WHERE ((MONTH(datum_izdavanja)) = ${current_month}) 
            AND (YEAR(datum_izdavanja) = ${current_year})`;
            let query = db.query(sql, (err, result) => {
            if(err) throw err;
            res.send(result);
            });
        }
    });

});

//godisnji
router.get('/getgodisnji', verifyToken, (req, res) => {

    jwt.verify(req.token, 'mobiletown', (err, authData) => {
        if(err)
        {
            res.sendStatus(403);
        }
        else
        {
            var datetime = new Date();
            var current_year = datetime.getFullYear();
            let sql = `SELECT (SUM(iznos)- SUM(iznos_nabavna)), SUM(iznos) FROM racuni WHERE (YEAR(datum_izdavanja) = ${current_year})`;
            let query = db.query(sql, (err, result) => {
                if(err) throw err;
                res.send(result);
            });
        }
    });
    
});

//post korisnik 
/*
router.post('/postbonus', (req, res) => {

    let product = req.body;
    let sql = "INSERT INTO korisnici(ime, prezime, korisnicko_ime, sifra, nivo, bonus)"
    + "VALUES('" + product.name + "', '" + product.lastname + "', '" + product.username + "', '" + product.pasw + "', '" + product.level + "', '" + product.bonus + "');";
    let query = db.query(sql, (err, result) => {
        if(err) throw err;
        res.send(result);
    })
}); */



//http put bonus
router.put('/postbonus/:id', verifyToken, (req, res) => {

    jwt.verify(req.token, 'mobiletown', (err, authData) =>{
        
        if(err)
        {   
            res.sendStatus(403);
        }
        else
        {
            const id = req.params.id; 
            let bonus = req.body;
            let sql = "UPDATE korisnici SET bonus = " + bonus.bonus + " WHERE id_korisnika = " + id + ";";
            let query = db.query(sql, (err, result) => {
            if(err) throw err;
            res.send(result);
            })
        }
    });
    
});

router.get('/getkorisnici', verifyToken, (req, res) => {

    jwt.verify(req.token, 'mobiletown', (err, authData) => {
        if(err)
        {
            res.sendStatus(403);
        }
        else
        {
            let sql = "SELECT * FROM korisnici";
            let query = db.query(sql, (err, result) => {
            if(err) throw err;
            res.send(result);
            });
        }
    });
    
});


router.post('/getToken', (req, res) => {

    const user = {
        username: 'user',
        pasword: 'user123'
    }

    jwt.sign({user: user}, 'mobiletown', (err, token) => {
        res.json({
            token
        });
    });
});

router.post('/login', verifyToken, (req, res) => {

    let user = req.body;



    jwt.verify(req.token, 'mobiletown', (err, authData) => {
        if(err)
        {
            res.sendStatus(403);
        }
        else
        {
            let sql = "SELECT * FROM korisnici WHERE korisnicko_ime = '" + user.username + "' AND sifra = '" + user.password + "';";
            let query = db.query(sql, (err, result) => {
                
                if(err) throw err;

                if(!empty(result))
                {
                    res.send(result);   
                }
                else
                {
                    res.send(false);
                }
        
            });
        }
    });

});


function verifyToken(req, res, next)
{
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined')
    {
        const bearer = bearerHeader.split(' ');

        const bearerToken = bearer[1];

        req.token = bearerToken;

        next();
    }
    else
    {
        res.sendStatus(403);
    }
}

module.exports = router;
