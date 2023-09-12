const express = require("express");
const router = express.Router();

const { pool } = require("../db");

function formatDate(inputDate) {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
  
    const dateParts = inputDate.split('-');
    const year = dateParts[0];
    const month = months[parseInt(dateParts[1], 10) - 1];
    const day = parseInt(dateParts[2], 10);
  
    // Function to add the "st", "nd", "rd", or "th" suffix to the day
    function getDayWithSuffix(day) {
      if (day >= 11 && day <= 13) {
        return day + 'th';
      }
      switch (day % 10) {
        case 1:
          return day + 'st';
        case 2:
          return day + 'nd';
        case 3:
          return day + 'rd';
        default:
          return day + 'th';
      }
    }
  
    const formattedDate = `${getDayWithSuffix(day)} ${month}, ${year}`;
    return formattedDate;
  }

router.get('/buyer/:id', async(req, res) => {
    var advertisement,cattle;
    const client = await pool.connect();
    const seller = await client.query("SELECT * FROM advertisements join users on seller_id=user_id WHERE advertise_id=$1", [req.params.id]);
    const type = await client.query("SELECT type FROM advertisements WHERE advertise_id=$1", [req.params.id]);

    const rating = await client.query("SELECT avg(rating) FROM advertisements join rating on advertisements.advertise_id=rating.advertise_id WHERE rating.advertise_id=$1", [req.params.id]);
    if(type.rows.length==0){
        res.render('output',{session:req.session.phone_number,type:req.session.type,msg:"Advertisement not found"})
        return;
    }
    if(type.rows[0].type=="meat"){
        advertisement = await client.query("SELECT  *, meat_advertisement.type AS meatType FROM meat_advertisement JOIN advertisements  ON advertisements.advertise_id=meat_advertisement.advertise_id WHERE advertisements.advertise_id=$1 AND advertisements.verified=true", [req.params.id]);
        advertisement.rows[0].created_at=formatDate(JSON.stringify(advertisement.rows[0].created_at).split('T')[0].split('"')[1]);
    }
    else if(type.rows[0].type=="cattle"){
        advertisement = await client.query("SELECT * FROM advertisements Natural JOIN cattle_advertisement WHERE advertise_id=$1 AND advertisements.verified=true", [req.params.id]);
        cattle = await client.query("SELECT * FROM cattle WHERE cattle_advertise_id=$1", [req.params.id]);
        advertisement.rows[0].created_at=formatDate(JSON.stringify(advertisement.rows[0].created_at).split('T')[0].split('"')[1]);
    }
    else if(type.rows[0].type=="rawhide"){
        advertisement = await client.query("SELECT * FROM advertisements Natural JOIN rawhide_advertisement WHERE advertise_id=$1 AND advertisements.verified=true", [req.params.id]);
        advertisement.rows[0].created_at=formatDate(JSON.stringify(advertisement.rows[0].created_at).split('T')[0].split('"')[1]);
        advertisement.rows[0].date_of_storage=formatDate(JSON.stringify(advertisement.rows[0].date_of_storage).split('T')[0].split('"')[1]);
    }
    else if(type.rows[0].type=="horn"){
        advertisement = await client.query("SELECT * FROM advertisements Natural JOIN horn_advertisement WHERE advertise_id=$1 AND advertisements.verified=true", [req.params.id]);
        advertisement.rows[0].created_at=formatDate(JSON.stringify(advertisement.rows[0].created_at).split('T')[0].split('"')[1]);
        advertisement.rows[0].date_of_storage=formatDate(JSON.stringify(advertisement.rows[0].date_of_storage).split('T')[0].split('"')[1]);
    }
    else if(type.rows[0].type=="hoof"){
        advertisement = await client.query("SELECT * FROM advertisements Natural JOIN hoof_advertisement WHERE advertise_id=$1 AND advertisements.verified=true", [req.params.id]);
        advertisement.rows[0].created_at=formatDate(JSON.stringify(advertisement.rows[0].created_at).split('T')[0].split('"')[1]);
        advertisement.rows[0].date_of_storage=formatDate(JSON.stringify(advertisement.rows[0].date_of_storage).split('T')[0].split('"')[1]);
    }
    client.release(true);
    console.log(advertisement.rows);
    if(advertisement.rows.length==0){
        res.render('output',{session:req.session.phone_number,type:req.session.type,msg:"Advertisement not found"})
        return;
    }
    if( type.rows[0].type=="cattle" ){
        res.render('singleAdvertisementBuyer',{session:req.session.phone_number,type:req.session.type,advertisement:advertisement.rows[0],advType:type.rows[0].type,cattle:cattle.rows,seller:seller.rows[0],rating:rating.rows})
    }
    else{
        res.render('singleAdvertisementBuyer',{session:req.session.phone_number,type:req.session.type,advertisement:advertisement.rows[0],advType:type.rows[0].type,seller:seller.rows[0],rating:rating.rows})
    }
})

router.get('/seller/:id', async(req, res) => {
    var advertisement;
    const client = await pool.connect();
    const type = await client.query("SELECT type FROM advertisements WHERE advertise_id=$1", [req.params.id]);
    if(type.rows.length==0){
        res.render('output',{session:req.session.phone_number,type:req.session.type,msg:"Advertisement not found"})
        return;
    }
    if(type.rows[0].type=="meat"){
        advertisement = await client.query("SELECT  *, meat_advertisement.type AS meatType FROM meat_advertisement JOIN advertisements  ON advertisements.advertise_id=meat_advertisement.advertise_id WHERE advertisements.advertise_id=$1", [req.params.id]);
    }
    else if(type.rows[0].type=="cattle"){
        advertisement = await client.query("SELECT * FROM advertisements Natural JOIN (cattle_advertisement JOIN cattle ON advertise_id=cattle_advertise_id) WHERE advertise_id=$1", [req.params.id]);
    }
    else if(type.rows[0].type=="rawhide"){
        advertisement = await client.query("SELECT * FROM advertisements Natural JOIN rawhide_advertisement WHERE advertise_id=$1", [req.params.id]);
    }
    else if(type.rows[0].type=="horn"){
        advertisement = await client.query("SELECT * FROM advertisements Natural JOIN horn_advertisement WHERE advertise_id=$1", [req.params.id]);
    }
    else if(type.rows[0].type=="hoof"){
        advertisement = await client.query("SELECT * FROM advertisements Natural JOIN hoof_advertisement WHERE advertise_id=$1", [req.params.id]);
    }
    client.release(true);
    res.render('singleAdvertisementSeller',{session:req.session.phone_number,advertisement:advertisement.rows[0]})
})

router.get('/seller/delete/:id', async(req, res) => {
    if(req.session.phone_number){
        if(req.session.type=="seller"){
            const client = await pool.connect();
            const advertisementSeller = await client.query("SELECT seller_id FROM advertisements WHERE advertise_id=$1 ", [req.params.id]);
            if( advertisementSeller.rows.length == 0 ){
                res.render('output',{session:req.session.phone_number,type:req.session.type,msg:"request rejected!"})
            }
            const SellerID = await client.query("SELECT user_id FROM users WHERE phone_number=$1 ", [req.session.phone_number]);
            // console.log(advertisementSeller.rows);
            // console.log(SellerID.rows);
            if( SellerID.rows[0].user_id != advertisementSeller.rows[0].seller_id ){
                res.render('output',{session:req.session.phone_number,type:req.session.type,msg:"request rejected!"})
            }

            const type = await client.query("SELECT type FROM advertisements WHERE advertise_id=$1", [req.params.id]);
            // console.log(type.rows);
            if(type.rows[0].type=="meat"){
                await client.query("DELETE FROM meat_advertisement WHERE advertise_id=$1", [req.params.id]);
            }
            else if(type.rows[0].type=="cattle"){
                await client.query("DELETE FROM cattle WHERE cattle_advertise_id=$1", [req.params.id]);
                await client.query("DELETE FROM cattle_advertisement WHERE advertise_id=$1", [req.params.id]);
            }
            else if(type.rows[0].type=="rawhide"){
                await client.query("DELETE FROM rawhide_advertisement WHERE advertise_id=$1", [req.params.id]);
            }
            else if(type.rows[0].type=="horn"){
                await client.query("DELETE FROM horn_advertisement WHERE advertise_id=$1", [req.params.id]);
            }
            else if(type.rows[0].type=="hoof"){
                await client.query("DELETE FROM hoof_advertisement WHERE advertise_id=$1", [req.params.id]);
            }
            await client.query("DELETE FROM advertisements WHERE advertise_id=$1", [req.params.id]);
            client.release(true);
            res.redirect('/seller/myAdvertisements/')
        }
        else{
            res.render('output',{session:req.session.phone_number,type:req.session.type,msg:"You are not admin"})
        }
    }
    else{
        res.redirect('/login');
    }
})


//Do not change...modified by ruhan
router.get('/admin/:id', async(req, res) => {

    if(req.session.phone_number){
        if(req.session.type=="admin"){
            var advertisement,cattle;
            const client = await pool.connect();
            const type = await client.query("SELECT type FROM advertisements WHERE advertise_id=$1", [req.params.id]);
            if(type.rows.length==0){
                res.render('output',{session:req.session.phone_number,type:req.session.type,msg:"Advertisement not found"})
                return;
            }
            if(type.rows[0].type=="meat"){
                advertisement = await client.query("SELECT  *, meat_advertisement.type AS meatType FROM meat_advertisement JOIN advertisements  ON advertisements.advertise_id=meat_advertisement.advertise_id WHERE advertisements.advertise_id=$1", [req.params.id]);
            }
            else if(type.rows[0].type=="cattle"){
                advertisement = await client.query("SELECT * FROM advertisements Natural JOIN cattle_advertisement WHERE advertise_id=$1", [req.params.id]);
                cattle = await client.query("SELECT * FROM cattle WHERE cattle_advertise_id=$1", [req.params.id]);
                
            }
            else if(type.rows[0].type=="rawhide"){
                advertisement = await client.query("SELECT * FROM advertisements Natural JOIN rawhide_advertisement WHERE advertise_id=$1", [req.params.id]);
            }
            else if(type.rows[0].type=="horn"){
                advertisement = await client.query("SELECT * FROM advertisements Natural JOIN horn_advertisement WHERE advertise_id=$1", [req.params.id]);
            }
            else if(type.rows[0].type=="hoof"){
                advertisement = await client.query("SELECT * FROM advertisements Natural JOIN hoof_advertisement WHERE advertise_id=$1", [req.params.id]);
            }
            client.release(true);
            //console.log(advertisement.rows);

            if(advertisement.rows.length==0){
                res.render('output',{session:req.session.phone_number,type:req.session.type,msg:"Advertisement not found"})
                return;
            }

            if( type.rows[0].type=="cattle" ){
                //console.log(cattle.rows);
                res.render('singleAdvertisementAdmin',{session:req.session.phone_number,advertisement:advertisement.rows[0],type:type.rows[0].type,cattle:cattle.rows})
            }
            else{
                res.render('singleAdvertisementAdmin',{session:req.session.phone_number,advertisement:advertisement.rows[0],type:type.rows[0].type})
            }
        }
        else{
            res.render('output',{session:req.session.phone_number,type:req.session.type,msg:"You are not admin"})
        }
    }
    else{
        res.redirect('/login');
    }
})
//modified by ruhan
router.get('/admin/reject/:id', async(req, res) => {
    if(req.session.phone_number){
        if(req.session.type=="admin"){
            const client = await pool.connect();
            const type = await client.query("SELECT type FROM advertisements WHERE advertise_id=$1", [req.params.id]);
            if(type.rows[0].type=="meat"){
                await client.query("DELETE FROM meat_advertisement WHERE advertise_id=$1", [req.params.id]);
            }
            else if(type.rows[0].type=="cattle"){
                await client.query("DELETE FROM cattle WHERE cattle_advertise_id=$1", [req.params.id]);
                await client.query("DELETE FROM cattle_advertisement WHERE advertise_id=$1", [req.params.id]);
            }
            else if(type.rows[0].type=="rawhide"){
                await client.query("DELETE FROM rawhide_advertisement WHERE advertise_id=$1", [req.params.id]);
            }
            else if(type.rows[0].type=="horn"){
                await client.query("DELETE FROM horn_advertisement WHERE advertise_id=$1", [req.params.id]);
            }
            else if(type.rows[0].type=="hoof"){
                await client.query("DELETE FROM hoof_advertisement WHERE advertise_id=$1", [req.params.id]);
            }
            await client.query("DELETE FROM advertisements WHERE advertise_id=$1", [req.params.id]);
            client.release(true);
            res.render('output',{session:req.session.phone_number,type:req.session.type,msg:"Advertisement Rejected"})
        }
        else{
            res.render('output',{session:req.session.phone_number,type:req.session.type,msg:"You are not admin"})
        }
    }
    else{
        res.redirect('/login');
    }
})

router.get('/admin/accept/:id', async(req, res) => {
    if(req.session.phone_number){
        if(req.session.type=="admin"){
            const client = await pool.connect();
            await client.query("UPDATE advertisements set verified=true WHERE advertise_id=$1", [req.params.id]);
            client.release(true);
            res.render('output',{session:req.session.phone_number,type:req.session.type,msg:"Advertisement accepted"})
        }
        else{
            res.render('output',{session:req.session.phone_number,type:req.session.type,msg:"You are not admin"})
        }
    }
    else{
        res.redirect('/login');
    }
})

module.exports = router;