import axios from "axios";
import { OffertGet } from "interfaces/Offert";

import dotenv from "dotenv";
import { IResponse } from "interfaces/IResponse";
dotenv.config();

const TASKLINK_API_URL = process.env.TASKLINK_API_URL!;

export class TaskLink {

    static getOffertById = (
        offert_id: number,
        authorization: string
    ): Promise<IResponse<OffertGet>> => {
        return new Promise(async (res, rej) => {
            try {
                var headers = {
                    "Authorization": authorization
                };

                var { data } = await axios.get<IResponse<OffertGet>>(`${TASKLINK_API_URL}/offert/${offert_id}`, {headers});

                res(data);
            } catch (err) {
                rej(err);
            }
        });
    }

}

