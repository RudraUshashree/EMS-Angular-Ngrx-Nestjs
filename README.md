
# Employee Management System Application

#### The first step to clone the repository:
```bash
$ https://github.com/sonirathore01/sonirathore01-Employee_Management_System_Nestjs_Angular.git
$ cd Employee_Management_System_Demo
```

## Backend Setup

#### Node Version
```bash
v18.13.0
```

#### For connecting with database add these credentials to .env file
```bash
DATABASE_USER=(Your Username)
DATABASE_PASSWORD=(Your Password)
DATABASE_HOST=(Your Host).mongodb.net
DATABASE_PORT=(Your Port)
DATABASE_NAME=(Your Database Name)
SALT=10
ACCESS_TOKEN_SECRET=('Your Secret Token')
ACCESS_TOKEN_EXPRIE_TIME=24h
```

#### Navigate to the backend_nestjs and install the dependencies
```bash
$ npm install
```

#### Development server
```bash
$ npm run start:dev
```


## Frontend Setup

#### Angular CLI Version
```bash
^17.3.7
```

#### Navigate to the angular_frontend and install the dependencies
```bash
$ npm install
```

#### Development server
```bash
$ ng serve
```
Run for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

#### Build
```bash
 $ ng build
```
Run to build the project. The build artifacts will be stored in the `dist/` directory.

#### Running unit tests
```bash
$ ng test
```
Run to execute the unit tests via [ jasmine ]
