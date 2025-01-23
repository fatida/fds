# FDS-Hello-World-Backend

# Note

The app is created for Demo purpose and it only works if you change the tenantName referred in the '/getUserInfo' and '/validateJWTTOken'. otherwise the app may return un-authorized.

and also the JKU urls and the issuer values are of EU region , if you want to test with other env please change accordingly. 


## Getting started
To get started run the below commands 


```
cd existing_repo
git remote add origin https://code.siemens.com/xamples/fds-hello-world/fds-hello-world-backend.git
git branch -M main
git push -uf origin main
```

To run the app simply run bellow commands

```
npm install
node ./server.js
```


## Additional Information
The project has multiple branches which are created for deploying to multiple Tenants of developer account .
The dev and integ tenant have the tenantName - 'devadvdev' . the 'preprod' branch have the tenantName - 'devadvpprod'

## pushing new changes to the docker image in harbor
This project pushed the docker image [Harbor](https://harbor.xcr.svcs01eu.prod.eu-central-1.kaas.sws.siemens.com) repository from EU region.

For pushing newer version of image please create a new tag and select respective branch.

for example for pushing the image for integ repo - create a tag with name 'integ-v(n)' where i n is the version number and select the branch integ.