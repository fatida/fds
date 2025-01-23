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

// // route for handling requests from the Angular client
app.get("/getUserInfo", async (req, res) => {
  const authHeader = req.headers.authorization;
  console.log("AuthHeader", authHeader);
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(400).send("Token is missing or invalid");
  }

  console.log("the tenant is " + process.env.tenantName);
  const decodedToken = jwt.decode(authHeader.replace("Bearer ", ""), {
    complete: true,
  });

  console.log("DecodedToken", decodedToken);

  var token = await validateJWTTOken(authHeader.replace("Bearer ", ""));
  console.log("TOKEN", token);
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
    jwksUri: "https://xcdev.us1.sws.siemens.com/token_keys", // Note - this URL contains a set of Keys , you need to pick the correct Key in order to get teh relevant public key.
  });
  await client.getSigningKey(tokenKeyIdentifier, (err, key) => {
    if (err) {
      return err;
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
  var issuer = "https://xcdev.us1.sws.siemens.com/oauth/token";
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

// validateJWTTOken(
//   "eyJqa3UiOiJodHRwczovL3hjZGV2LnVzMS5zd3Muc2llbWVucy5jb20vdG9rZW5fa2V5cyIsImtpZCI6ImtleS1pZC0xIiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJ4Y2Rldi1sbW9tLXYxLjAuMF8zMDYiLCJzd3Muc2FtYXV0aC50ZW4iOiJ4Y2RldiIsInN3cy5zYW1hdXRoLnRlbi5leHRJZCI6InAxOCIsImlzcyI6Imh0dHBzOi8veGNkZXYudXMxLnN3cy5zaWVtZW5zLmNvbS9vYXV0aC90b2tlbiIsImVudiI6IkRFViIsImNsaWVudF9pZCI6InhjZGV2LWxtb20tdjEuMC4wXzMwNiIsImF1ZCI6WyJpYW0tYWN0aW9uLmNsaWVudF9jcmVkZW50aWFscyIsInhjZGV2LWxtb20tdjEuMC4wXzMwNiIsImxtb20iXSwib3JpZ190ZW4iOiJ4Y2RldiIsInppZCI6InhjZGV2IiwiZ3JhbnRfdHlwZSI6ImNsaWVudF9jcmVkZW50aWFscyIsImF6cCI6InhjZGV2LWxtb20tdjEuMC4wXzMwNiIsInNjb3BlIjpbImxtb20uZGVmYXVsdCIsImxpY2Vuc2VzcnYucmVhZC5saWNlbnNlIiwiaWFtLWFjdGlvbi5jbGllbnRfY3JlZGVudGlhbHMudGVuYW50LWltcGVyc29uYXRpb24iXSwic3dzLnNhbWF1dGgudGVuLm5hbWUiOiJ4Y2RldiIsInNjaGVtYXMiOlsidXJuOnNpZW1lbnM6eGY6aWFtOnYxIl0sImNhdCI6ImNsaWVudC10b2tlbjphcGktYXBwOnYxIiwiZXhwIjoxNzM3NjQ5ODAyLCJyZWdpb24iOiJ1cy1lYXN0LTEiLCJpYXQiOjE3Mzc2NDgwMDIsImp0aSI6IjZlYjNjMWJmMGRhYzQ0ZTk5NDZlYTFlNjkyNjk1YjMzIiwicmV2X3NpZyI6ImNmZjRiYjU1IiwiY2lkIjoieGNkZXYtbG1vbS12MS4wLjBfMzA2In0.Mk_7jDiOQRQOLGPnnXlSZsDME3KUi_Q8A3zxBzIIbpUmIflZsynaZ11G2E-B0r8yeSVGJbrGpB4cRRJeTsH9YPLqYU8CeIhlehfKNvIQqT_2wcpWKrt6SQThVp9e3LVyIozsiWzxxO0y--uAu2HsnKa8_Blfch5K_GkoAFR8KL6XnbyZVnuycy40cTPnysSs6cwQ826k1Mz50istGjQSLjzIdSqWcAMZTYu54ckheOZkZRjOtLtZU3UBTV8ClFgzAY89L40xodZ19anm_9-aXQNa6RDAuDGsVvALIPwWlE3DjkFx4ib0f9CsKX41IytjyO5vgWQQHprL7TLcznjNrQ"
// ).then((res) => {
//   console.log("Response: ", res);
// });
