const express = require("express");
const router = express.Router();

const { pool } = require("../db");

router.get('/', async(req, res) => {
    res.render('coordinates')
})

router.post('/', async(req, res) => {
    const {thana} = req.body;
    const client = await pool.connect();
    const thana_id = await client.query("SELECT thana_id FROM thana WHERE name=$1", [thana]);
    const coordinates = await client.query("SELECT * FROM coordinates WHERE thana_id=$1", [thana_id.rows[0].thana_id]);
    client.release(true);
    res.send(coordinates.rows)
})

router.post('/submit', async(req, res) => {
    const {thana} = req.body;
    res.cookie('thana',thana,{maxAge: 1*60*60*1000,httpOnly: true})
    res.redirect('/')
})

module.exports = router;