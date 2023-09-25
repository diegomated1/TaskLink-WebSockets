import { LatLng } from "../../interfaces/LatLng";
import axios from "axios";
import { RouteModel } from "interfaces/google/RouteModel";

const GOOGLE_API_ROUTE_URL = process.env.GOOGLE_API_ROUTE_URL!;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY!;

export class Google {

    static getRoute = (
        origin: LatLng,
        destination: LatLng,
        travelModel: "DRIVE"
    ): Promise<RouteModel | null> => {
        return new Promise(async (res, rej) => {
            try {
                var headers = {
                    "Content-type": "application/json",
                    "X-Goog-Api-Key": GOOGLE_API_KEY,
                    "X-Goog-FieldMask": "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline"
                };

                var body = {
                    "origin": {
                        "location": {
                            "latLng": {
                                "latitude": origin.lat,
                                "longitude": origin.lng
                            }
                        }
                    },
                    "destination": {
                        "location": {
                            "latLng": {
                                "latitude": destination.lat,
                                "longitude": destination.lng
                            }
                        }
                    },
                    "travelMode": travelModel,
                    "computeAlternativeRoutes": false,
                    "languageCode": "es-419"
                };

                var { data } = await axios.post<RouteModel>(`${GOOGLE_API_ROUTE_URL}/directions/v2:computeRoutes`, body, {headers});

                res(data);
            } catch (err) {
                res(null);
            }
        });
    }

}

