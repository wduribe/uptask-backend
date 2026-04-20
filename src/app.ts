import { envsAdapter } from './config';
import { MongodbInit } from './database/mongo';
import { AppRoutes } from './presentation/routes';
import { Server } from './presentation/server';


(() => {
    main();
})();

async function main() {

    await MongodbInit.connect({
        mongoUrl: envsAdapter.MONGO_URL,
        dbName: envsAdapter.MONGO_USER_NAME,
    });

    const server = new Server({
        port: envsAdapter.PORT,
    });

    server.setRoutes(AppRoutes.routes);

    server.start();
}