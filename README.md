# uber-eats-prototype

## Steps to run

### Backend
- Install node and npm: https://nodejs.org/en/download/
- Create config folder inside /server
- Create config.js file inside config folder
``` 
module.exports = {
    HOST: <MYSQL RDS LINK>,
    PORT: <PORT>,
    USER: <USERNAME>,
    PASSWORD: <PASSWORD>,
    DB: <DATABASE NAME>,
    SERVER_IP: <LOCALHOST or SERVER IP>
};
```
- Install dependencies
```
npm install
```
- Run server
```
npm run dev
```

### Frontend
- Create config folder inside /client/src/
- Create server.config.js file inside config folder:
```
const server_IP = <LOCALHOST or SERVER IP>
module.exports = server_IP
```
- Create s3.config.js inside config folder:
```
const s3_config = {
    bucketName: <BUCKET NAME>,
    region: <AWS REGION>,
    accessKeyId: <AWS ACCESS KEY>,
    secretAccessKey: <AWS SECRET ACCESS KEY>
}

module.exports = s3_config
```
- Install dependencies:
```
npm install
```
- Run client
```
npm start
```
