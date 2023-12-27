import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {

  private baseUrl = 'https://nominatim.openstreetmap.org/search?format=json&q=';
  private apiUrl = 'https://us1.locationiq.com/v1/search.php';
  private opencageUrl = 'https://api.opencagedata.com/geocode/v1/json?q=URI-ENCODED-PLACENAME&key=fbd391233ed74da690f82e9f105c4c9b';
  private reverseApiUrl = 'https://nominatim.openstreetmap.org/reverse';




  constructor(private http: HttpClient) { }

  /**
 * Using Nominatim API by OpenStreetMap (OSM) to get latitude longitude (Not feasible for all address)
   * @param address 
   * @returns 
   */
  getLatLng(address: string) {
    const url = `${this.baseUrl}${encodeURIComponent(address)}`;
    return this.http.get<any[]>(url);
  }

  // LocationIQ
  getLatLong(address: string, apiKey: string): Observable<any> {
    const params = {
      q: address,
      key: apiKey,
      format: 'json'
    };

    return this.http.get(this.apiUrl, { params });
  }

  /**
   * Get address from latitude, longitude
   * @param lat Latitude
   * @param lon Logitude
   * @returns the adress
   */
  getAddress(lat: number, lon: number): Observable<any> {
    const params = {
      lat: lat,
      lon: lon,
      format: 'json'
    };

    return this.http.get(this.reverseApiUrl, { params });
  }

  // opencage
  geocodeAddress(address: string) {
    const baseUrl = 'https://api.opencagedata.com/geocode/v1/json';
    const apiKey = 'fbd391233ed74da690f82e9f105c4c9b'; // Replace with your OpenCage API key
    const url = `${baseUrl}?q=${encodeURIComponent(address)}&key=${apiKey}`;
    return this.http.get(url);
  }

}
