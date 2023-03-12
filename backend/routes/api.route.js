const router = require('express').Router();
const needle= require('needle')
const fetch = (...args) =>
	import('node-fetch').then(({default: fetch}) => fetch(...args));
const token = process.env.TWITTER_BEARER_TOKEN;
const endpointURL = "https://api.twitter.com/2/tweets?ids=";
//const userId = "2244994945";
const nId="1581645386719977473";
router.get('/', async (req, res, next) => {
  res.send({ message: 'Ok api is working 🚀' });
});
router.get('/tweets', async (req, res, next) => {
  const userId=req.query.tweeterid
  const url = `https://api.twitter.com/2/users/${userId}/tweets`;
  let params = {
    "max_results": 10,
    "tweet.fields": "created_at",
    "expansions": "author_id",
    "exclude":'replies',
}

  const result = await needle('get',url, params, {
    headers: {
        "User-Agent": "v2TweetLookupJS",
        "authorization": `Bearer ${token}`
    }
  })
  if (result.body) {
      res.send(result.body)
  } else {
      throw new Error('Unsuccessful request');
  }
});
router.get('/tweet', async (req, res, next) => {
  let params = {
    "ids":req.query.id,
    "tweet.fields": "created_at",
    "expansions": "author_id"
}

  const result = await needle('get',endpointURL, params, {
    headers: {
        "User-Agent": "v2TweetLookupJS",
        "authorization": `Bearer ${token}`
    }
  })
  if (result.body) {
      res.send(result.body)
  } else {
      throw new Error('Unsuccessful request');
  }
});
router.get('/text',async(req,res,next)=>{
  let url=req.query.link
  fetch(url)
  .then(function(response) {
    response.text().then(function(text) {
      res.send(text)
    });
  });


})
router.get('/getuser',async(req,res,next)=>{
  let n=req.query.id
  let purl="https://api.twitter.com/1.1/users/show.json?user_id="+n;
  const result = await needle('get',purl, {
    headers: {
        "User-Agent": "v2TweetLookupJS",
        "authorization": `Bearer ${token}`
    }
  })
  if (result.body) {
      res.send(result.body)
  } else {
      throw new Error('Unsuccessful request');
  }
})
module.exports = router;
