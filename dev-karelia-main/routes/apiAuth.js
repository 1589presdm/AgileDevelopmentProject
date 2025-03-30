// ref: https://blog.logrocket.com/understanding-api-key-authentication-node-js/

//const users = [] // for example see: require('./initialUserData').users; 
//var db = require('./db')

//const config = require("./config");

//const { MAXUSAGE, FREEUSAGEHOURS, MAXUSERS } = config

const genAPIKey = () => {
  //create a base-36 string that contains 60 chars in a-z,0-9
  return [...Array(60)]
    .map((e) => ((Math.random() * 36) | 0).toString(36))
    .join('')
}

const addHours = (date, hours) => {
    const hoursToAdd = hours * 60 * 60 * 1000;
    date.setTime(date.getTime() + hoursToAdd);
    return date;
}

const createUser = async (key, req) => {
    const userCount = await(db.userCount())
    if (userCount >= MAXUSERS)
        throw Error("Up to " + MAXUSERS + " simultaneous users allowed.")

    let today = new Date()
    let user = {
        id: key,
        api_key: genAPIKey(),
        usage: 0,
        validUntil: addHours( today, FREEUSAGEHOURS ),
        emailConfirmed: true    // TODO: finalize to be confirmed with the email
    }
    result = await db.createUser(user)
    return user
}

const authenticateKey = async (req, res, next) => {
    let api_key = req.header("api_key") //Add API key to headers
    let account = await db.getUserByApiKey(api_key)
    // find() returns an object or undefined
    if (account) {
      //If API key matches
      //check the number of times the API has been used in a particular day
      account.usage++
      if (account.usage >= 0) {
        //If API is already used today
        if (account.usage >= MAXUSAGE) {
          //stop if the usage exceeds max API calls
          res.status(429).send({
            error: {
              code: 429,
              message: "Max API calls exceeded.",
            },
          })
        } else {
          //have not hit max usage
          await db.upgradeUsageByUserId(account.id)
          console.log("Good API call nr ", account.usage, " by user " + account._id)
          next()
        }
      } else {
        //
        await db.upgradeUsageByUserId(account.id)
        //ok to use again
        next()
      }
    } else {
      //Reject request if API key doesn't match
      res.status(403).send({ error: { code: 403, message: "Not allowed." } })
    }
  };
  module.exports = { createUser, authenticateKey, login }
