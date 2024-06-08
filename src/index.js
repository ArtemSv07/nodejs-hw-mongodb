import { setupServer } from './server.js'
// import { initMongoDB } from "./db/initMongoConnection";


const bootstrap = async () => {
// await initMongoDB();
    setupServer();
}

bootstrap();

