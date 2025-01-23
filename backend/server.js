const express = require("express");
const app = express();
app.use(express.json());
const jwt = require("jsonwebtoken");
const fs = require("node:fs");
const jwkClient = require("jwks-rsa");

// handling CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});

app.get("/healthCheck", async (req, res) => {
  res.status(200).send("I am alive");
});

// route for handling requests from the Angular client
app.get("/getUserInfo", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(400).send("Token is missing or invalid");
  }

  console.log("the tenant is " + process.env.tenantName);
  const decodedToken = jwt.decode(authHeader.replace("Bearer ", ""), {
    complete: true,
  });

  console.log(decodedToken);

  var token = await validateJWTTOken(authHeader.replace("Bearer ", ""));
  console.log(token);
  if (token.active == true) {
    var role;
    for (var key in decodedToken.payload.scope) {
      if (decodedToken.payload.scope[key].includes("Admin")) {
        role = "Admin";
        break;
      } else if (decodedToken.payload.scope[key].includes("engineer")) {
        role = "Engineer";
        break;
      } else {
        role = "invalidUser";
      }
    }
    res.json({
      email: decodedToken.payload.email,
      tenant: decodedToken.payload["sws.samauth.ten"],
      role: decodedToken.payload["sws.samauth.role"],
      tier: decodedToken.payload["sws.samauth.tiers"][0].tier,
      env: decodedToken.payload.env,
    });
  } else {
    res.status(401).send("Invalid Token ==>" + token.error);
  }
});

//Function  for getting public Key
async function getPublicKey(tokenKeyIdentifier) {
  var myKey;
  const client = jwkClient({
    jwksUri: "https://devadvpprod.eu1.sws.siemens.com/token_keys", // Note - this URL contains a set of Keys , you need to pick the correct Key in order to get teh relevant public key.
  });
  await client.getSigningKey(tokenKeyIdentifier, (err, key) => {
    if (err) {
      return reject(err);
    }
    myKey = key.publicKey;
  });
  var promise = client.getSigningKey(tokenKeyIdentifier);
  await Promise.resolve(promise);
  return myKey;
}

//Functions for Validating token
async function validateJWTTOken(token) {
  const decodedToken = jwt.decode(token, { complete: true });
  const publicKey = await getPublicKey(decodedToken.header.kid);
  var issuer = "https://devadvpprod.eu1.sws.siemens.com/oauth/token";
  var response;
  response = { active: false, error: "" }; // default response in case of error
  try {
    const options = {
      ignoreExpiration: false, // check token expiration
      ignoreNotBefore: false, // check token issued at
      issuer: issuer, // The issuer should be validated with the store value in this case `var issuer`
    };
    const tokenPayload = jwt.verify(token, publicKey, options);
    console.log(tokenPayload);
    response.active = true;
  } catch (err) {
    console.log(err.message);
    response.error = err;
  }
  return response;
}
