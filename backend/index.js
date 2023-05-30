const  dotenv = require("dotenv");
const  express = require("express");
const  cors = require("cors");
const  mongoose = require("mongoose");
const  shortid = require("shortid");

const Url = require('./db/Url')
const  utils = require("./utils/util");


dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`Db Connected`);
  })
  .catch((err) => {
    console.log(err.message);
});


app.get("/all", async (req, res) => {
    let ipAddress = ''
    try{
        ipAddress = await fetchIpAddress()
    } catch (err) {
        res.status(500).json({ msg: 'Server Error' });
    }
  
    try {
      const data = await Url.find({ ipAddress });
      console.log(data);
      res.json(data);
    } catch (error) {
        res.status(500).json({ msg: 'Server Error' });
    }
});
  

app.post("/:base", async (req, res) => {
    if(process.env.AVAILABLE_BASES.split(',').includes(req.params.base)){
        let ipAddress = ''
        try{
            ipAddress = await fetchIpAddress()
        } catch (err) {
            res.status(500).json({ msg: 'Server Error' });
        }
        
        const { origUrl } = req.body;
        const base = `${process.env.DOMAIN_URL}/${req.params.base}`;
        
        const urlId = shortid.generate();
        if (utils.validateUrl(origUrl)) {
          try {
            let url = await Url.findOne({ origUrl });
            if (url) {
              res.json(url);
            } else {
              const shortUrl = `${base}/${urlId}`;
      
              url = new Url({
                origUrl,
                ipAddress,
                shortUrl,
                urlId,
                date: new Date(),
              });
      
              await url.save();
              res.json(url);
              
            }
          } catch (err) {
            console.log(err);
            res.status(500).json({ msg: 'Server Error' });
          }
        } else {
          res.status(400).json({ msg: 'Invalid Original Url' });
        }
    } else {
        res.status(503).json({ msg: 'Unavailabe Base Prompt' })
    }
});


app.get('/:base/:id', async (req, res) => {
  try {
    console.log(process.env.AVAILABLE_BASES.split(','))
    if(process.env.AVAILABLE_BASES.split(',').includes(req.params.base)){
        const url = await Url.findOne({ urlId: req.params.id });
        console.log(url);
        if (url) {
          url.clicks++;
          url.save();
          return res.redirect(url.origUrl);
        } else {
          res.status(404).json({ msg: 'Not Found' });
        }
    } else {
        res.status(503).json({ msg: 'Unavailable Base Prompt' })
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Server Error' });
  }
});

async function fetchIpAddress() {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error('Error fetching IP address:', error);
      throw error;
    }
}
  
app.listen(PORT, () => {
  console.log(`Server is running at PORT ${PORT}`);
});
  
  
