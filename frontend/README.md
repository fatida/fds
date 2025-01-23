# XampleAppEx

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.1.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

This project is created for demo purpose this works together with [FDS_Hello-World-Backend](https://code.siemens.com/xamples/fds-hello-world/webapp/fds-hello-world-backend) project

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## to run the project use bellow commands

```
npm install
ng serve 
```

## Additional Information
The project has multiple branches which are created for deploying to multiple Tenants of developer account .
The dev and integ tenant have the tenantName - 'devadvdev' . the 'preprod' branch have the tenantName - 'devadvpprod'

## pushing new changes to the docker image in harbor
This project pushed the docker image [Harbor](https://harbor.xcr.svcs01eu.prod.eu-central-1.kaas.sws.siemens.com) repository from EU region.

For pushing newer version of image please create a new tag and select respective branch.

for example for pushing the image for integ repo - create a tag with name 'integ-v(n)' where i n is the version number and select the branch integ.
