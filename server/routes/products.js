const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const categoryQuery = req.query.category;
    let query = {};
    if (categoryQuery) {
      if (categoryQuery === 'gift-pack') {
        query.isGiftPack = true;
      } else {
        query.category = categoryQuery;
      }
    }
    const products = await Product.find(query);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if(!product) return res.status(404).json({message: 'Not Found'});
        res.json(product);
    } catch(err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Setup Initial Seed Route (for development)
router.post('/seed', async (req, res) => {
  try {
    await Product.deleteMany({});
    
    const mockProducts = [
      {
        name: 'Royal Saffron Barfi',
        description: 'Gold leaf decorated royal saffron barfi',
        basePrice: 24,
        category: 'sweet',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJRoDrS9nA93uOVKVlpegnU-Q5Dtrq-9_EkdLcNb-9JqeVRXJXgP4qYnUgHYkP4G2JA1U44BCOrXUQ5nWWA9TxoOLl6QwKgwEs5mHavtGYr5Zq0G-TY4mNd59hI77HVzkQh3C6bVDhrikI639H10yv3iBHGLM2ckXuBLb31sGAOq-H-SSuDR24b8IZE5tIPcFCOgywj__MLm7wXIqoJGdkYNP8DQBRP49GZOAHCobyOSBkp4S2ec97Q6kTXuzI0w8HcNa535uLOgIR',
        weights: [
          { weight: '250g', multiplier: 1 },
          { weight: '500g', multiplier: 2 },
          { weight: '1kg', multiplier: 4 },
        ]
      },
      {
        name: 'Pistachio Rose Delight',
        description: 'Premium pistachio and rose petal sweets',
        basePrice: 18,
        category: 'sweet',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4RNJX7F0fpY-EHcBMwjAtSC5nQypEGfsukiZR-6hYmhdja_SoT1MSPZyTKkRBU-qJdRuDM1KDYD1fV7amRqa3cUR_1tj28dFvQB6_wXyRx5IkuBVICf-nfgfUyvVFgwEb0L9KO8YiFr1Xr3y_05x-QCSSCB2pjzy_96BUCVGEZ6pbqIkPJy6_U0R5-Iw1QmLyzdH_uftlI73NsqRK6bjKqu6B7m7vLjLWVuQpLBRBpFZw7CIGCjuuZKuS3r7-LMdyOx6dXzkQkSom',
        weights: [
          { weight: '250g', multiplier: 1 },
          { weight: '500g', multiplier: 2 },
          { weight: '1kg', multiplier: 4 },
        ]
      },
      {
        name: 'Belgian Truffle Box',
        description: 'Luxury chocolate truffles assortment',
        basePrice: 32,
        category: 'international',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtdlp4muSAoR27TLz6fVQ6X2fMFOv0Sd15enKJMwOx1xR01DtQYXOoz1Ltj_uqqxbkx7OoGMCcuG-z3lC4oq4AAoHDGZz6lX-SQh0AeibyKMhoLc5G0rLCVPRFNCpx-VyC5NkQOE_0oHHwdo3XDqMTPyk3MplouIHhyoONlr_gnj0DYe404yvE5eP8aOv9wpBlOk79fQ8dd-kIc365rjwzkYSd6jW55GgMhD81Pq7eyq3NLFJI2epx25H_hptzNck6j0rdEdkUWQLc',
        weights: [
           { weight: 'Box of 6', multiplier: 1 },
           { weight: 'Box of 12', multiplier: 2 },
        ]
      },
      {
        name: 'Honey Glazed Baklava',
        description: 'Middle eastern baklava with honey and nuts',
        basePrice: 21,
        category: 'international',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZipGkKjumZoW57gT4787-Nje4CxDfSa8Ntoco-Ye3oNSE8RyQoBVfm8qIoZnDryd6hzE0bpKcSd1hywwTXmLVzKl7eQKtgTgivyxs3Ono-lf53QThgziAP9MG-S-ZXBy2dS0rzqFtZ4_cbvQNOkeB_geM3SJ2QGKE5AAtXrava4G94b4J55QIf3tyyI89t6ziyUZ88ySZQLcjI27Khth_V1ZM5mestxNYu3LttvLwJLDTVN-D4xGmWcm-qnbW6emq461VSKQm6iXx',
        weights: [
          { weight: '250g', multiplier: 1 },
          { weight: '500g', multiplier: 2 },
        ]
      },
      {
        name: 'Royal Velvet Wedding Box',
        description: 'Elegant velvet wedding gift box with sweets',
        basePrice: 150,
        category: 'gift-pack',
        isGiftPack: true,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgEdznE7CmJdB2p3PGB3rsyj1mq4YtyzNtXNWMt8eCGPdbm99mRGIRlll13faWwp97P2ifVs_SDLXJR6R1mlNvQqKmoylKnavqvC6DFZIEdTuv-Oi_svT67iDsPD7W-261HplYNjh8sODMRAYzrmlSO5eXYuFqwIi1Ikd6n4N-KItxQI74tMPZqjYBj56erN4OhUU017n8nbsYtnWWvGef_B9Rkt5lIsh88gKUbp0mifHG5wN-FRPwQR6lqGtYJSi2rr5LGApw8Dcz',
        weights: [{ weight: 'Standard Box', multiplier: 1 }]
      },
      {
        name: 'Gourmet Tea Hamper',
        description: 'Gourmet hamper with sweets and tea',
        basePrice: 85,
        category: 'gift-pack',
        isGiftPack: true,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJyql2sP5DT5_ee8gxkyfsfG0B7T69GyTnN6pY6iHA1z1CIFtWxKxupXKkoLgdnT-xV1nqO0Jdn73-qSsUC4wlBY6GAqq0E476-4Ev215hjHvpwrBawwu9Yry_8c_be1DbSUf3kRr0AQj1lQycdPjEN2ApIj5Nzv8nvwiGgo4YJ2l9ypn2j-XC-T7WcM4kDhIWh8S6xPp_JoTC3r2pANvVThphRSIYy_OFljNNMuHckiALitvJejrCPwJ_KqFSof4Z3uv_wcBD6MCJ',
        weights: [{ weight: 'Standard Box', multiplier: 1 }]
      }
    ];
    
    await Product.insertMany(mockProducts);
    res.json({ message: 'Seed successful' });
  } catch (err) {
    res.status(500).json({ message: 'Seed Error' });
  }
});

module.exports = router;
