const express = require("express");
const router = express.Router();

const { pool } = require("../db");

router.get('/', async(req, res) => {
    if(req.session.phone_number){
        if(req.session.type=="seller"){
            const client = await pool.connect();
            const meatAdvertisements = await client.query("SELECT *, meat_advertisement.type AS meatType FROM meat_advertisement JOIN advertisements on advertisements.advertise_id=meat_advertisement.advertise_id WHERE seller_id=((select user_id from Users where phone_number=$1))", [req.session.phone_number]);
            const cattleAdvertisements = await client.query("SELECT * FROM advertisements Natural JOIN ( SELECT * FROM cattle_advertisement JOIN ( SELECT * FROM cattle WHERE cattle_id IN (SELECT MIN(cattle_id)  FROM cattle GROUP BY cattle_advertise_id) ) AS x ON x.cattle_advertise_id = cattle_advertisement.advertise_id ) AS y WHERE seller_id=((select user_id from Users where phone_number=$1))", [req.session.phone_number]);
            const rawhideAdvertisements = await client.query("SELECT * FROM advertisements Natural JOIN rawhide_advertisement WHERE seller_id=((select user_id from Users where phone_number=$1))", [req.session.phone_number]);
            const hornAdvertisements = await client.query("SELECT * FROM advertisements Natural JOIN horn_advertisement WHERE seller_id=((select user_id from Users where phone_number=$1))", [req.session.phone_number]);
            const hoofAdvertisements = await client.query("SELECT * FROM advertisements Natural JOIN hoof_advertisement WHERE seller_id=((select user_id from Users where phone_number=$1))", [req.session.phone_number]);
            client.release(true);
            
            const data = {session:req.session.phone_number,advertisements: meatAdvertisements.rows.concat( hoofAdvertisements.rows , hornAdvertisements.rows , cattleAdvertisements.rows , rawhideAdvertisements.rows ) }
            // console.log(data);
            res.render('myAdvertisements',data) 
        }
        else{
            res.render('output',{session:req.session.phone_number,type:req.session.type,msg:"You are not a seller"})
        }
    }
    else{
        res.redirect('/login');
    }
})

module.exports = router;