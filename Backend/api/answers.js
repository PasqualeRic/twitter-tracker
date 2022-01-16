const express = require('express');
const router = express.Router();
const fs = require('fs');

/* Get the json file with the given name */
router.get('/:name', (req, res) => {

  fs.readFile(`${req.params.name}.json`, 'utf8' , (err, data) => {
  if (err) {
    console.error(err)
    res.status(500).json({message: "Internal server error"});
  }
  console.log(data)
  res.status(200).json(data);
})
})

/* Create the json file or override it*/
router.post('/:name', (req, res) => {
console.log(req.body);
console.log(req.params);
console.log(req.params.name);
let prova = 'ciao';
  fs.writeFile(`${req.params.name}.json`, JSON.stringify(req.body), err => {
    if (err) {
      console.log(err);
      res.status(500).json({message: "Internal server error"});
    }
    //Qui viene scritto il file
    res.status(200).json({message: "Succesful operation"});
  })
})



module.exports = router;
