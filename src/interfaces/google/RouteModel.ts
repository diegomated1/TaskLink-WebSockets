export interface RouteModel {
    distanceMeters: number;
    duration: string;
    polyline: {
        encodedPolyline: string;
    };
}
