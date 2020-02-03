var Product = require('../models/product');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/shopping', { useNewUrlParser: true, useUnifiedTopology: true });


var products = [
 new Product({
  imagePath: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/5e/Gothiccover.png/220px-Gothiccover.png',
  title: 'Gothic Video Game',
  description: 'Awesome Game!!!!',
  price: 10
  }),
  new Product({
     imagePath: 'https://m.media-amazon.com/images/M/MV5BMWE1MGI0ZmItNzU2My00Mzk5LThkNTMtMmFiMjRiZDNlNzkwXkEyXkFqcGdeQXVyNjgyODQ1Mzk@._V1_UY268_CR15,0,182,268_AL_.jpg',
    title: 'Batman Video Game',
    description: 'Wooow Game!!!!',
    price: 30
  }),
  new Product({
    imagePath: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/52/Assassin%27s_Creed.jpg/220px-Assassin%27s_Creed.jpg',
    title: 'Assasins Video Game',
    description: 'wewewe Game!!!!',
    price: 50
  }),
  new Product({
    imagePath: 'https://m.media-amazon.com/images/M/MV5BMWE1MGI0ZmItNzU2My00Mzk5LThkNTMtMmFiMjRiZDNlNzkwXkEyXkFqcGdeQXVyNjgyODQ1Mzk@._V1_UY268_CR15,0,182,268_AL_.jpg',
    title: 'Batman Video Game',
    description: 'Wooow Game!!!!',
    price: 30
  }),
  new Product({
    imagePath: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/52/Assassin%27s_Creed.jpg/220px-Assassin%27s_Creed.jpg',
    title: 'Assasins Video Game',
    description: 'wewewe Game!!!!',
    price: 50
  }),
];

var done = 0;
for (var i = 0; i < products.length; i++) {
  products[i].save(function(err, result) {
    done++;
    if (done === products.length) {
      exit();
    }
  });
}

function exit() {
  mongoose.disconnect();
}
