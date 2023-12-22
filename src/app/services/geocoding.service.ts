import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeocodingService {

  private baseUrl = 'https://nominatim.openstreetmap.org/search?format=json&q=';
  private apiUrl = 'https://us1.locationiq.com/v1/search.php';

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

}
