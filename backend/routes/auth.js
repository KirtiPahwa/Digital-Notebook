const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator"); //to validate name ,email,passwd
const bcrypt = require("bcryptjs"); //to encypt the passwd
var jwt = require("jsonwebtoken"); //Jwt facilitates the secure communication between client and the server. Whenever a user authenticates from server that its valid user then we give user a token from jwt and next time whenever user sign in json token should be send along with it. Payload data that is username passwd and all should not be change else signature/token will also change. Using this token we don't have to sign in again and again .Means this will help in maintaining session is on the client-side instead of storing sessions on the server.
const JWT_SECRET = "I am a good girl"; //jwtsecret is used to check that if anybody changed the data. Its used to encode the token. Whenever there is modification in data token gets changed.For eg: Shreya is a user and she is having a token . so if she change the name from shreya to manil to try to fetch data of manil.So at that time token get changed and she will not able to steal manil's data. So this token is appended with jwtsecret in encoded form .
const fetchuser = require("../middleware/fetchuser");

// ROUTE1: Create a User using: POST "/api/auth/createUser". No login required
router.post(
  "/createUser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Password must be of atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    // If there are errors,return bad request and the errors
    const errors = validationResult(req);
    let success = false;
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Check whether the user with this email exists already
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ success, error: "User already exists with this email" });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      console.log(req.body.name, " ", req.body.email, " ", req.body.password);
      // create a new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      const data = {
        user: {
          id: user.id, // id is best to search the user in db so for token we are using id as data
        },
      };
      console.log("siginig");

      const authtoken = jwt.sign(data, JWT_SECRET);
      success = true;
      res.json({ success, authtoken });
    } catch (error) {
      console.log(error);
      res.status(500).send("Some error occured");
    }
  }
);

//ROUTE2: Authenticate a user using :POST "api/auth/login".No login required
router.post(
  "/login",
  [
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    // If there are errors then return error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ error: "Please try to login with correct credentials" });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({
          success,
          error: "Please try to login with correct credentials",
        });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(payload, JWT_SECRET);
      success = true;
      res.json({ success, authtoken });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// ROUTE3: Get logged in user details using:POST "/api/auth/getuser". Login required

router.post("/getuser", fetchuser, async (req, res) => {
  //2nd argument: Middle ware is used whenever there is need of (user logged in) required in any endpoint.Foreg:in getUser endpoint user logged in required so there we will use middleware

  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.log(error.messsage);
    res.status(500).send("Internal server error");
  }
});

module.exports = router;
