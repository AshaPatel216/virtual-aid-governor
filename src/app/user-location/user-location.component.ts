import { AfterViewInit, Component, OnInit } from '@angular/core';
import { tileLayer, latLng, marker, Marker, icon, map } from 'leaflet';
import { GeocodingService } from './../services/geocoding.service';

import * as L from 'leaflet';

@Component({
  selector: 'app-user-location',
  templateUrl: './user-location.component.html',
  styleUrls: ['./user-location.component.scss']
})
export class UserLocationComponent implements OnInit {
  options!: L.MapOptions;
  layers!: L.Layer[];
  map!: L.Map;

  constructor(private geocodingService: GeocodingService) {
    const iconRetinaUrl = 'assets/marker-icon-2x.png';
    const iconUrl = 'assets/marker-icon.png';
    const shadowUrl = 'assets/marker-shadow.png';
    const iconDefault = icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
    Marker.prototype.options.icon = iconDefault;

    let address = '1600 Amphitheatre Parkway, Mountain View, CA, USA';
    let address1 = 'Abhishek Avenue, Bharuch, Gujarat, India, 392011';
    let address2 = 'Amin Street, Zadeshwar, Bharuch, Gujarat, India, 392011';
    let address3 = 'Ramkhamheang Road Sammakorn Village, Bangkok, 10240, Thailand';
    //  this.onAddressSubmit(address1); // for openstrretmap nomination (Not working)
    this.getCoordinates(address3);
  }

  ngOnInit(): void {
    this.options = {
      layers: [
        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '...'
        })
      ],
      zoom: 1,
      center: L.latLng(46.879966, -121.726909)
    };
    const marker = L.marker([46.879966, -121.726909]);
    this.layers = [marker];

  }

  /**
   * Function to get current location
   */
  locateMe() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const coords = position.coords;
        const latlng = latLng(coords.latitude, coords.longitude);
        console.log(latlng)
        this.layers = [
          marker(latlng).bindPopup('You are here!')
        ];
        this.options.center = latlng; // Center the map on the user's location
        this.options.zoom = 10; // Adjust zoom level
      });
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }

  /**
   * Get coordinates using openstreetmap (Not wokring)
   * @param address 
   */
  onAddressSubmit(address: string): void {
    this.geocodingService.getLatLng(address).subscribe(response => {
      if (response.length > 0) {
        const latLng = L.latLng(response[0].lat, response[0].lon);
        this.layers = [
          marker(latLng).bindPopup(address)
        ];
        this.options.center = latLng; // Center the map on the user's location
      }
    });
  }

  /**
   * get Coordinates using LocationIQ
   * @param address 
   */
  getCoordinates(address: string) {
    const apiKey = 'pk.66cd1dd14fdbc6fe248470b03defea34'; // Replace with your API key
    this.geocodingService.getLatLong(address, apiKey)
      .subscribe(data => {
        const latLng = L.latLng(data[0].lat, data[0].lon);
        this.layers = [
          marker(latLng).bindPopup(address)
        ];
        this.options.center = latLng; // Center the map on the user's location
      }, error => {
        console.error('Error:', error);
      });
  }






}
