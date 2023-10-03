import { LatLng } from "../interfaces/LatLng";

export const getDistance = (point1: LatLng, point2: LatLng): number => {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(point1.lat - point2.lat);  // deg2rad below
    var dLon = deg2rad(point2.lng - point1.lng);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(point2.lat)) * Math.cos(deg2rad(point1.lat)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
}

export const deg2rad = (deg: number): number => deg * (Math.PI / 180);