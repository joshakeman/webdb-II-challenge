const knex = require('knex');
const router = require('express').Router();

const knexConfig = {
  client: 'sqlite3',
  connection: {
    filename: './data/lambda.sqlite3', // from the root folder
  },
  useNullAsDefault: true,
  //debug: true,
};

const db = knex(knexConfig);

router.get('/', (req, res) => {
    // select * from roles
    db('zoos') //<< return a promise with all the rows
      .then(zoos => {
        res.status(200).json(zoos);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });
  
  // select * from roles where id = :id
  router.get('/:id', (req, res) => {
    db('zoos')
      .where({ id: req.params.id })
      .first()
      .then(zoo => {
        if (zoo) {
          res.status(200).json(zoo);
        } else {
          res.status(404).json({ message: 'zoo not found' });
        }
      })
      .catch(err => {
        res.status(500).json(err);
      });
  });
  
  router.post('/', (req, res) => {
    // insert into roles () values (req.body)
    if (!req.body.name) {
      res.status(400).json({ message: 'please provide a name' });
    } else {
      db('zoos')
        .insert(req.body, 'id')
        .then(ids => {
          db('zoos')
            .where({ id: ids[0] })
            .first()
            .then(role => {
              res.status(200).json(role);
            })
            .catch(err => {
              res.status(500).json(err);
            });
        })
        .catch(err => {
          res.status(500).json(err);
        });
    }
  });
  
  router.put('/:id', (req, res) => {
    db('zoos')
      .where({ id: req.params.id })
      .update(req.body)
      .then(count => {
        if (count > 0) {
          res.status(200).json({
            message: `${count} ${count > 1 ? 'records' : 'record'} updated`,
          });
        } else {
          res.status(404).json({ message: 'Zoo does not exist' });
        }
      })
      .catch(err => {
        res.status(500).json(err);
      });
  });
  
  router.delete('/:id', (req, res) => {
    db('zoos')
      .where({ id: req.params.id })
      .del()
      .then(count => {
        if (count > 0) {
          res.status(200).json({
            message: `${count} ${count > 1 ? 'records' : 'record'} deleted`,
          });
        } else {
          res.status(404).json({ message: 'Zoo does not exist' });
        }
      })
      .catch(err => {
        res.status(500).json(err);
      });
  });
  
  module.exports = router;