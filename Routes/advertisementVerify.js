const express = require("express");
const router = express.Router();

const { pool } = require("../db");

router.get('/', async(req, res) => {
    if(req.session.phone_number){
        if(req.session.type=="admin"){
            const client = await pool.connect();
            const meatAdvertisements = await client.query("SELECT  *, meat_advertisement.type AS meatType FROM meat_advertisement JOIN advertisements  ON advertisements.advertise_id=meat_advertisement.advertise_id WHERE advertisements.verified=false");
            const cattleAdvertisements = await client.query("SELECT * FROM advertisements NATURAL JOIN ( SELECT * FROM cattle_advertisement JOIN ( SELECT * FROM cattle WHERE cattle_id IN (SELECT MIN(cattle_id)  FROM cattle GROUP BY cattle_advertise_id) ) AS x ON x.cattle_advertise_id = cattle_advertisement.advertise_id ) AS y WHERE advertisements.verified=false ")
            const rawhideAdvertisements = await client.query("SELECT * FROM advertisements Natural JOIN rawhide_advertisement WHERE advertisements.verified=false");
            const hornAdvertisements = await client.query("SELECT * FROM advertisements Natural JOIN horn_advertisement WHERE advertisements.verified=false");
            const hoofAdvertisements = await client.query("SELECT * FROM advertisements Natural JOIN hoof_advertisement WHERE advertisements.verified=false");
            client.release(true);
            // console.log(cattleAdvertisements.rows);
            const data = {session:req.session.phone_number,advertisements: meatAdvertisements.rows.concat( hoofAdvertisements.rows , hornAdvertisements.rows , cattleAdvertisements.rows , rawhideAdvertisements.rows ) }
            res.render('advertisementVerify',data)
        }
        else{
            res.render('output',{session:req.session.phone_number,type:req.session.type,session:req.session.phone_number,type:req.session.type,msg:"You are not admin"})
        }
    }
    else{
        res.redirect('/login');
    }
})

module.exports = router;