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

router.get('/', async(req, res) => {
    if(req.cookies['thana']){
      const thana = req.cookies['thana']
      const client = await pool.connect();
      const meatAdvertisements = await client.query("select * from (SELECT thana.name,users.user_id FROM thana join Users on thana.thana_id=users.thana_id)as c join (select * from advertisements JOIN meat_advertisement on advertisements.advertise_id=meat_advertisement.advertise_id) as a on c.user_id= a.seller_id where c.name=$1 AND a.verified=true",[thana]);
      const cattleAdvertisements = await client.query("select * from (SELECT thana.name,users.user_id FROM thana join Users on thana.thana_id=users.thana_id)as c join (SELECT * FROM advertisements Natural JOIN ( SELECT * FROM cattle_advertisement JOIN ( SELECT * FROM cattle WHERE cattle_id IN (SELECT MIN(cattle_id)  FROM cattle GROUP BY cattle_advertise_id) ) AS x ON x.cattle_advertise_id = cattle_advertisement.advertise_id ) AS y) as a on c.user_id= a.seller_id where c.name=$1 AND a.verified=true",[thana]);
      const rawhideAdvertisements = await client.query("select * from (SELECT thana.name,users.user_id FROM thana join Users on thana.thana_id=users.thana_id)as c join (SELECT * FROM advertisements Natural JOIN rawhide_advertisement) as a on c.user_id= a.seller_id where c.name=$1 AND a.verified=true",[thana]);
      const hornAdvertisements = await client.query("select * from (SELECT thana.name,users.user_id FROM thana join Users on thana.thana_id=users.thana_id)as c join (SELECT * FROM advertisements Natural JOIN horn_advertisement) as a on c.user_id= a.seller_id where c.name=$1 AND a.verified=true",[thana]);
      const hoofAdvertisements = await client.query("select * from (SELECT thana.name,users.user_id FROM thana join Users on thana.thana_id=users.thana_id)as c join (SELECT * FROM advertisements Natural JOIN hoof_advertisement) as a on c.user_id= a.seller_id where c.name=$1 AND a.verified=true",[thana]);
      var bestMeat = await client.query("select * from (SELECT thana.name,users.user_id FROM thana join Users on thana.thana_id=users.thana_id)as c join (select * from advertisements join (select * from Meat_advertisement natural join (select count(*) AS cnt,advertise_id from rating GROUP BY advertise_id)as x) as y on advertisements.advertise_id=y.advertise_id  ORDER BY cnt DESC) as a on c.user_id= a.seller_id where c.name=$1 AND a.verified=true",[thana]);
      if(bestMeat.rows.length!=0){
        bestMeat=bestMeat.rows[0];
        bestMeat.created_at=formatDate(JSON.stringify(bestMeat.created_at).split('T')[0].split('"')[1]);
        bestMeat.date_of_storage=formatDate(JSON.stringify(bestMeat.date_of_storage).split('T')[0].split('"')[1]);
      }
      else{
        bestMeat=undefined;
      }
      var bestCattle = await client.query("select * from (SELECT thana.name,users.user_id FROM thana join Users on thana.thana_id=users.thana_id)as c join (select * from cattle join (select *,advertisements.advertise_id as id from advertisements join (select * from cattle_advertisement natural join (select count(*) AS cnt,advertise_id from rating GROUP BY advertise_id)as x) as y on advertisements.advertise_id=y.advertise_id ORDER BY cnt DESC )as z on cattle.cattle_advertise_id=z.id) as a on c.user_id= a.seller_id where c.name=$1 AND a.verified=true",[thana]);
      if(bestCattle.rows.length!=0){
        bestCattle=bestCattle.rows[0];
        bestCattle.created_at=formatDate(JSON.stringify(bestCattle.created_at).split('T')[0].split('"')[1]);
      }
      else{
        bestCattle=undefined;
      }
      client.release(true);
      for(var i=0;i<meatAdvertisements.rows.length;i++){
          meatAdvertisements.rows[i].created_at=formatDate(JSON.stringify(meatAdvertisements.rows[i].created_at).split('T')[0].split('"')[1]);
      }
      for(var i=0;i<cattleAdvertisements.rows.length;i++){
          cattleAdvertisements.rows[i].created_at=formatDate(JSON.stringify(cattleAdvertisements.rows[i].created_at).split('T')[0].split('"')[1]);
      }
      for(var i=0;i<rawhideAdvertisements.rows.length;i++){
          rawhideAdvertisements.rows[i].created_at=formatDate(JSON.stringify(rawhideAdvertisements.rows[i].created_at).split('T')[0].split('"')[1]);
          rawhideAdvertisements.rows[i].date_of_storage=formatDate(JSON.stringify(rawhideAdvertisements.rows[i].date_of_storage).split('T')[0].split('"')[1]);
      }
      for(var i=0;i<hornAdvertisements.rows.length;i++){
          hornAdvertisements.rows[i].created_at=formatDate(JSON.stringify(hornAdvertisements.rows[i].created_at).split('T')[0].split('"')[1]);
          hornAdvertisements.rows[i].date_of_storage=formatDate(JSON.stringify(hornAdvertisements.rows[i].date_of_storage).split('T')[0].split('"')[1]);
      }
      for(var i=0;i<hoofAdvertisements.rows.length;i++){
          hoofAdvertisements.rows[i].created_at=formatDate(JSON.stringify(hoofAdvertisements.rows[i].created_at).split('T')[0].split('"')[1]);
          hoofAdvertisements.rows[i].date_of_storage=formatDate(JSON.stringify(hoofAdvertisements.rows[i].date_of_storage).split('T')[0].split('"')[1]);
      }
      res.render('homepage',{session:req.session.phone_number,thana:thana,type:req.session.type,meatAdvertisements:meatAdvertisements.rows,cattleAdvertisements:cattleAdvertisements.rows,rawhideAdvertisements:rawhideAdvertisements.rows,hornAdvertisements:hornAdvertisements.rows,hoofAdvertisements:hoofAdvertisements.rows,bestMeat:bestMeat,bestCattle:bestCattle}) 
    }
    else{
      res.redirect('/coordinates')
    }
})

router.get('/category/:category', async(req, res) => {
  if(req.cookies['thana']){
    const thana = req.cookies['thana']
    var meatAdvertisements,cattleAdvertisements,rawhideAdvertisements,hornAdvertisements,hoofAdvertisements;
    if(req.params.category=="meat"){
        const client = await pool.connect();
        meatAdvertisements = await client.query("select * from (SELECT thana.name,users.user_id FROM thana join Users on thana.thana_id=users.thana_id)as c join (select * from advertisements JOIN meat_advertisement on advertisements.advertise_id=meat_advertisement.advertise_id) as a on c.user_id= a.seller_id where c.name=$1 AND a.verified=true",[thana]);
        client.release(true);
        for(var i=0;i<meatAdvertisements.rows.length;i++){
          meatAdvertisements.rows[i].created_at=formatDate(JSON.stringify(meatAdvertisements.rows[i].created_at).split('T')[0].split('"')[1]);
        }
        res.render('homeByCategory',{session:req.session.phone_number,type:req.session.type,allAdvertisements:meatAdvertisements.rows}) 
    }
    else if(req.params.category=="cattle"){
        const client = await pool.connect();
        cattleAdvertisements = await client.query("select * from (SELECT thana.name,users.user_id FROM thana join Users on thana.thana_id=users.thana_id)as c join (SELECT * FROM advertisements Natural JOIN ( SELECT * FROM cattle_advertisement JOIN ( SELECT * FROM cattle WHERE cattle_id IN (SELECT MIN(cattle_id)  FROM cattle GROUP BY cattle_advertise_id) ) AS x ON x.cattle_advertise_id = cattle_advertisement.advertise_id where is_bid=false ) AS y) as a on c.user_id= a.seller_id where c.name=$1 AND a.verified=true",[thana]);
        client.release(true);
        for(var i=0;i<cattleAdvertisements.rows.length;i++){
          cattleAdvertisements.rows[i].created_at=formatDate(JSON.stringify(cattleAdvertisements.rows[i].created_at).split('T')[0].split('"')[1]);
        }
        res.render('homeByCategory',{session:req.session.phone_number,type:req.session.type,allAdvertisements:cattleAdvertisements.rows}) 
    }
    else if(req.params.category=="cattleBid"){
        const client = await pool.connect();
        cattleAdvertisements = await client.query("select * from (SELECT thana.name,users.user_id FROM thana join Users on thana.thana_id=users.thana_id)as c join (SELECT * FROM advertisements Natural JOIN ( SELECT * FROM cattle_advertisement JOIN ( SELECT * FROM cattle WHERE cattle_id IN (SELECT MIN(cattle_id)  FROM cattle GROUP BY cattle_advertise_id) ) AS x ON x.cattle_advertise_id = cattle_advertisement.advertise_id where is_bid=true ) AS y) as a on c.user_id= a.seller_id where c.name=$1 AND a.verified=true",[thana]);
        client.release(true);
        for(var i=0;i<cattleAdvertisements.rows.length;i++){
          cattleAdvertisements.rows[i].created_at=formatDate(JSON.stringify(cattleAdvertisements.rows[i].created_at).split('T')[0].split('"')[1]);
        }
        res.render('homeByCategory',{session:req.session.phone_number,type:req.session.type,allAdvertisements:cattleAdvertisements.rows}) 
    }
    else if(req.params.category=="rawhide"){
        const client = await pool.connect();
        rawhideAdvertisements = await client.query("select * from (SELECT thana.name,users.user_id FROM thana join Users on thana.thana_id=users.thana_id)as c join (SELECT * FROM advertisements Natural JOIN rawhide_advertisement) as a on c.user_id= a.seller_id where c.name=$1 AND a.verified=true",[thana]);
        client.release(true);
        for(var i=0;i<rawhideAdvertisements.rows.length;i++){
          rawhideAdvertisements.rows[i].created_at=formatDate(JSON.stringify(rawhideAdvertisements.rows[i].created_at).split('T')[0].split('"')[1]);
          rawhideAdvertisements.rows[i].date_of_storage=formatDate(JSON.stringify(rawhideAdvertisements.rows[i].date_of_storage).split('T')[0].split('"')[1]);
        }
        res.render('homeByCategory',{session:req.session.phone_number,type:req.session.type,allAdvertisements:rawhideAdvertisements.rows}) 
    }
    else if(req.params.category=="horn"){
        const client = await pool.connect();
        hornAdvertisements = await client.query("select * from (SELECT thana.name,users.user_id FROM thana join Users on thana.thana_id=users.thana_id)as c join (SELECT * FROM advertisements Natural JOIN horn_advertisement) as a on c.user_id= a.seller_id where c.name=$1 AND a.verified=true",[thana]);
        client.release(true);
        for(var i=0;i<hornAdvertisements.rows.length;i++){
          hornAdvertisements.rows[i].created_at=formatDate(JSON.stringify(hornAdvertisements.rows[i].created_at).split('T')[0].split('"')[1]);
          hornAdvertisements.rows[i].date_of_storage=formatDate(JSON.stringify(hornAdvertisements.rows[i].date_of_storage).split('T')[0].split('"')[1]);
        }
        res.render('homeByCategory',{session:req.session.phone_number,type:req.session.type,allAdvertisements:hornAdvertisements.rows}) 
    }
    else if(req.params.category=="hoof"){
        const client = await pool.connect();
        hoofAdvertisements = await client.query("select * from (SELECT thana.name,users.user_id FROM thana join Users on thana.thana_id=users.thana_id)as c join (SELECT * FROM advertisements Natural JOIN hoof_advertisement) as a on c.user_id= a.seller_id where c.name=$1 AND a.verified=true",[thana]);
        client.release(true);
        for(var i=0;i<hoofAdvertisements.rows.length;i++){
          hoofAdvertisements.rows[i].created_at=formatDate(JSON.stringify(hoofAdvertisements.rows[i].created_at).split('T')[0].split('"')[1]);
          hoofAdvertisements.rows[i].date_of_storage=formatDate(JSON.stringify(hoofAdvertisements.rows[i].date_of_storage).split('T')[0].split('"')[1]);
        }
        res.render('homeByCategory',{session:req.session.phone_number,type:req.session.type,allAdvertisements:hoofAdvertisements.rows}) 
    }
  }
  else{
    res.redirect('/coordinates')
  }
})

router.get('/updateSearchList/farmname', async(req, res) => {
  const client = await pool.connect();
  const r = await client.query('SELECT farm_name FROM Cattle_Advertisement');
  client.release(true);
  res.send(r.rows);
})

router.get('/updateSearchList/sellername', async(req, res) => {
const client = await pool.connect();
const r = await client.query('SELECT name FROM Users natural join Seller');
client.release(true);
res.send(r.rows);
})

router.post('/search/sellername', async(req, res) => {
  var {search} = req.body;
  if(req.cookies['thana']){
    const thana = req.cookies['thana']
    const client = await pool.connect();
    const seller_id = await client.query("SELECT user_id FROM Users where name=$1",[search]);
    if(seller_id.rows.length!=0){
      const meatAdvertisements = await client.query("select * from (SELECT thana.name,users.user_id FROM thana join Users on thana.thana_id=users.thana_id)as c join (select * from advertisements JOIN meat_advertisement on advertisements.advertise_id=meat_advertisement.advertise_id) as a on c.user_id= a.seller_id where a.seller_id IN(SELECT user_id FROM Users where name=$1) AND c.name=$2 AND a.verified=true",[search,thana]);
      const cattleAdvertisements = await client.query("select * from (SELECT thana.name,users.user_id FROM thana join Users on thana.thana_id=users.thana_id)as c join (SELECT * FROM advertisements Natural JOIN ( SELECT * FROM cattle_advertisement JOIN ( SELECT * FROM cattle WHERE cattle_id IN (SELECT MIN(cattle_id)  FROM cattle GROUP BY cattle_advertise_id) ) AS x ON x.cattle_advertise_id = cattle_advertisement.advertise_id ) AS y) as a on c.user_id= a.seller_id where a.seller_id IN(SELECT user_id FROM Users where name=$1) AND c.name=$2 AND a.verified=true",[search,thana]);
      const rawhideAdvertisements = await client.query("select * from (SELECT thana.name,users.user_id FROM thana join Users on thana.thana_id=users.thana_id)as c join (SELECT * FROM advertisements Natural JOIN rawhide_advertisement) as a on c.user_id= a.seller_id where a.seller_id IN(SELECT user_id FROM Users where name=$1) AND c.name=$2 AND a.verified=true",[search,thana]);
      const hornAdvertisements = await client.query("select * from (SELECT thana.name,users.user_id FROM thana join Users on thana.thana_id=users.thana_id)as c join (SELECT * FROM advertisements Natural JOIN horn_advertisement) as a on c.user_id= a.seller_id where a.seller_id IN(SELECT user_id FROM Users where name=$1) AND c.name=$2 AND a.verified=true",[search,thana]);
      const hoofAdvertisements = await client.query("select * from (SELECT thana.name,users.user_id FROM thana join Users on thana.thana_id=users.thana_id)as c join (SELECT * FROM advertisements Natural JOIN hoof_advertisement) as a on c.user_id= a.seller_id where a.seller_id IN(SELECT user_id FROM Users where name=$1) AND c.name=$2 AND a.verified=true",[search,thana]);
      client.release(true);
      var bestMeat = undefined;
      var bestCattle = undefined;
      for(var i=0;i<meatAdvertisements.rows.length;i++){
          meatAdvertisements.rows[i].created_at=formatDate(JSON.stringify(meatAdvertisements.rows[i].created_at).split('T')[0].split('"')[1]);
      }
      console.log(meatAdvertisements.rows)
      for(var i=0;i<cattleAdvertisements.rows.length;i++){
          cattleAdvertisements.rows[i].created_at=formatDate(JSON.stringify(cattleAdvertisements.rows[i].created_at).split('T')[0].split('"')[1]);
      }
      for(var i=0;i<rawhideAdvertisements.rows.length;i++){
          rawhideAdvertisements.rows[i].created_at=formatDate(JSON.stringify(rawhideAdvertisements.rows[i].created_at).split('T')[0].split('"')[1]);
          rawhideAdvertisements.rows[i].date_of_storage=formatDate(JSON.stringify(rawhideAdvertisements.rows[i].date_of_storage).split('T')[0].split('"')[1]);
      }
      for(var i=0;i<hornAdvertisements.rows.length;i++){
          hornAdvertisements.rows[i].created_at=formatDate(JSON.stringify(hornAdvertisements.rows[i].created_at).split('T')[0].split('"')[1]);
          hornAdvertisements.rows[i].date_of_storage=formatDate(JSON.stringify(hornAdvertisements.rows[i].date_of_storage).split('T')[0].split('"')[1]);
      }
      for(var i=0;i<hoofAdvertisements.rows.length;i++){
          hoofAdvertisements.rows[i].created_at=formatDate(JSON.stringify(hoofAdvertisements.rows[i].created_at).split('T')[0].split('"')[1]);
          hoofAdvertisements.rows[i].date_of_storage=formatDate(JSON.stringify(hoofAdvertisements.rows[i].date_of_storage).split('T')[0].split('"')[1]);
      }
      res.render('homepage',{session:req.session.phone_number,thana:thana,type:req.session.type,meatAdvertisements:meatAdvertisements.rows,cattleAdvertisements:cattleAdvertisements.rows,rawhideAdvertisements:rawhideAdvertisements.rows,hornAdvertisements:hornAdvertisements.rows,hoofAdvertisements:hoofAdvertisements.rows,bestMeat:bestMeat,bestCattle:bestCattle,msg:"Showing search results"}) 
    }
    else{
      res.render('homepage',{session:req.session.phone_number,thana:thana,type:req.session.type,meatAdvertisements:[],cattleAdvertisements:[],rawhideAdvertisements:[],hornAdvertisements:[],hoofAdvertisements:[],bestMeat:undefined,bestCattle:undefined,msg:"Nothing found during search"})
    }
  }
  else{
    res.redirect('/coordinates')
  }
})

router.post('/search/farmname', async(req, res) => {
  var {search} = req.body;
  if(req.cookies['thana']){
    const thana = req.cookies['thana']
    const client = await pool.connect();
    const cattleAdvertisements = await client.query("select * from (SELECT thana.name,users.user_id FROM thana join Users on thana.thana_id=users.thana_id)as c join (SELECT * FROM advertisements Natural JOIN ( SELECT * FROM cattle_advertisement JOIN ( SELECT * FROM cattle WHERE cattle_id IN (SELECT MIN(cattle_id)  FROM cattle GROUP BY cattle_advertise_id) ) AS x ON x.cattle_advertise_id = cattle_advertisement.advertise_id WHERE cattle_advertisement.farm_name=$1 ) AS y) as a on c.user_id= a.seller_id where c.name=$2 AND a.verified=true",[search,thana]);
    client.release(true);
    for(var i=0;i<cattleAdvertisements.rows.length;i++){
      cattleAdvertisements.rows[i].created_at=formatDate(JSON.stringify(cattleAdvertisements.rows[i].created_at).split('T')[0].split('"')[1]);
    }
    
    res.render('homeByCategory',{session:req.session.phone_number,type:req.session.type,allAdvertisements:cattleAdvertisements.rows}) 
  }
  else{
    res.redirect('/coordinates')
  }
})

router.post('/search/meatsubtype', async(req, res) => {
  var {search} = req.body;
  if(req.cookies['thana']){
      const thana = req.cookies['thana']
      const client = await pool.connect();
      const meatAdvertisements = await client.query("select * from (SELECT thana.name,users.user_id FROM thana join Users on thana.thana_id=users.thana_id)as c join (select * from advertisements JOIN meat_advertisement on advertisements.advertise_id=meat_advertisement.advertise_id where meat_advertisement.type=$1) as a on c.user_id= a.seller_id where c.name=$2 AND a.verified=true",[search,thana]);
      client.release(true);
      for(var i=0;i<meatAdvertisements.rows.length;i++){
        meatAdvertisements.rows[i].created_at=formatDate(JSON.stringify(meatAdvertisements.rows[i].created_at).split('T')[0].split('"')[1]);
      }
      console.log(meatAdvertisements.rows)
      res.render('homeByCategory',{session:req.session.phone_number,type:req.session.type,allAdvertisements:meatAdvertisements.rows}) 
  }
  else{
    res.redirect('/coordinates')
  }
})

router.get('/search', async(req, res) => {
  res.render('singleAdd', {type1:"1", type2:"5"})
})

module.exports = router;