const express = require('express');
const router = express.Router();
const client = require('../server.js');
const fs = require('fs');

/* Get a trivia  by name */
router.get('/:name', async (req, res) => {
  let name = req.params.name;
  console.log('qquqququq', req.params);
  await client.client.get(`https://api.twitter.com/2/tweets/search/recent?query=%23${name}%20%23officialTrivia&tweet.fields=in_reply_to_user_id&max_results=100`, function(err, data, response) {
    if(err){
      console.log(err);
      res.status(404).json({message: "Trivia not found"});
    }else {
      console.log(data);
      res.status(200).json(data);
    }
})
})



module.exports = router;
