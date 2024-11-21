import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { getDistance } from 'geolib';

@Injectable()
export class LocationService {
    async findNearest(latitude: number, longitude: number) {
        // OpenStreetMap Nominatim API URL
        const apiUrl = 'https://nominatim.openstreetmap.org/search';
        
        try {
            // Fetch radiologists from OpenStreetMap
            const radiologistsResponse = await axios.get(apiUrl, {
                params: {
                    q: 'radiologist',
                    format: 'json',
                    lat: latitude,
                    lon: longitude,
                    radius: 28000, // Search radius in meters
                    addressdetails: 1,
                },
            });

            // Fetch clinics from OpenStreetMap
            const clinicsResponse = await axios.get(apiUrl, {
                params: {
                    q: 'clinic',
                    format: 'json',
                    lat: latitude,
                    lon: longitude,
                    radius: 28000, // Search radius in meters
                    addressdetails: 1,
                },
            });

            // Extract and process the radiologists' data
            const radiologists = radiologistsResponse.data.map((place) => ({
                ...place,
                distance: getDistance(
                    { latitude, longitude },
                    { latitude: parseFloat(place.lat), longitude: parseFloat(place.lon) }
                ),
            }));

            // Extract and process the clinics' data
            const clinics = clinicsResponse.data.map((place) => ({
                ...place,
                distance: getDistance(
                    { latitude, longitude },
                    { latitude: parseFloat(place.lat), longitude: parseFloat(place.lon) }
                ),
            }));

            // Return both lists
            return { radiologists, clinics };
        } catch (error) {
            console.error('Error fetching data from OpenStreetMap:', error);
            throw new Error('Unable to fetch location data');
        }
    }
}
