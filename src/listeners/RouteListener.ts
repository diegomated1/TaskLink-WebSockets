import { Server, Socket } from "socket.io";
import { IRoute } from "../interfaces/IRoute";
import { LatLng } from "../interfaces/LatLng";
import { RouteModel } from "../models/RouterModel";
import { Google } from "../utils/services/googleService";
import { TaskLink } from "../utils/services/taskLinkService";

export default class RouteListener {

    constructor(
        private readonly routeModel: RouteModel,
        private readonly io: Server,
        private readonly socket: Socket
    ) {
        this.listeners();
    }

    private getRouteByOffertId = async (offert_id: number, cb: (err: Error | null, route: IRoute | null) => void) => {
        try{
            console.log(offert_id);
            const route = await this.routeModel.getByOffertId(offert_id);

            cb(null, route);
            this.io.to(`route::${offert_id}`).emit("route:get_by_offert_id", route);
        }catch(err){
            cb(err as Error, null);
            //this.socket.emit('error', 'Error al obtener la ruta');
        }
    }

    private insert = async (offert_id: number, cb: (err: Error | null, route: IRoute | null) => void) => {
        try{
            // Get the token that was used for the socket
            const { Authorization } = this.socket.handshake.query;
            if(!Authorization || typeof Authorization != "string")
                throw "No hay un token"

            // Get the offer by ID to obtain the locations of each of the users
            const offertResponse = await TaskLink.getOffertById(offert_id, Authorization);

            if(!offertResponse.success)
                throw offertResponse.errors
            
            // Verify that the offert and locations exist
            if(!offertResponse.value)
                throw "No se econtro la oferta"

            const offert = offertResponse.value;

            if(!offert.user_location?.x || !offert.user_location.y || 
                !offert.user_provider_location?.x || !offert.user_provider_location.y
            ) throw "No se encontro la geolocalizacion de uno de los usuarios"
                

            // Map users location to origin and destination models
            const origin: LatLng = {
                lat: offert.user_location.x,
                lng: offert.user_location.y
            }
            const destination: LatLng = {
                lat: offert.user_provider_location.x,
                lng: offert.user_provider_location.y
            }

            // Use Google API to get the route through locations
            const response = await Google.getRoute(origin, destination);
            
            // Verify that the route has been created
            if(response == null)
                throw "No se pudo generar la ruta."

            // Map the route obtained from Google's API to a model to save in the database
            const route: IRoute = {
                distance_meters: response.distanceMeters,
                duration: response.duration,
                encoded_polyline: response.polyline.encodedPolyline,
                offert_id
            }

            // Insert the route to database
            await this.routeModel.insert(route);

            // response with the route

            cb(null, route);
            this.io.to(`route::${offert_id}`).emit("route:get_by_offert_id", route);
        }catch(err){
            cb(err as Error, null);
        }
    }

    private test = async (offert_id: number, cb: (err: Error | null, route: IRoute | null) => void) => {
        try{
            const route = {
                distance_meters: 123,
                duration: "19s",
                encoded_polyline: "123",
                offert_id
            }
            await this.routeModel.insert(route);
            cb(null, route);
        }catch(err){
            cb(err as Error, null);
        }
    }

    listeners(){
        this.socket.on("route:test", this.test);
        this.socket.on("route:insert", this.insert);
        this.socket.on("route:get_by_offert_id", this.getRouteByOffertId);
    }
}