import { Client } from "cassandra-driver";
import { Database } from "../database/database";
import { IRoute } from "interfaces/IRoute";

export class RouteModel {

    client: Client

    constructor(
        private readonly database: Database
    ){
        this.client = this.database.client;
    }

    getByOffertId = (id: number): Promise<IRoute | null> => {
        return new Promise(async (res, rej) => {
            try {
                const query = 'SELECT * FROM routes_by_offert_id WHERE offert_id = ?';
                const values = [id.toString()];

                const result = await this.client.execute(query, values);
                const route = result.rows[0] as unknown as IRoute;
                res(route);
            } catch (error) {
                rej(error);
            }
        });
    };

    insert = (entity: IRoute): Promise<void> => {
        return new Promise(async (res, rej) => {
            try {
                const columns = Object.keys(entity).join(', ');
                const placeholders = Object.entries(entity).map((_) => `?`).join(', ');
                const values = Object.values(entity);

                const query = `INSERT INTO routes_by_offert_id (${columns}) VALUES (${placeholders})`;
                await this.client.execute(query, values, { prepare: true });
                res();
            } catch (error) {
                rej(error);
            }
        });
    };

}