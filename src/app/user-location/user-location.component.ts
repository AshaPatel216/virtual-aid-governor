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

    // From online: 20.412220, 72.878952
    // Location IQ: 22.30952, 73.173498
    // Opencage: not found
    let address4 = 'Aman Daredi B-225, Somnath Nagar, Near Sai Temple, Alwanaka, Manjalpur, Vadodara, Gujarat, India, 390011' // 

    // From online: 25.706090, 87.459120
    // Location IQ: 25.159457, 87.225384
    // Opencage: 25.78,87.47
    let address5 = 'Kajha, Purnia, 854301, Bihar, India';


    // From online:22.294790, 70.787300
    // Location IQ: 22.720466, 71.625768
    // Opencage: 22.72706, 71.64856

    let address6 = 'Plot no. 34, Sanghvipark Society, near Ramji temple, New 80 feet road, Surendranagar, Gujarat, India, 363035';

    // From online: 21.523910 73.240320
    // Location IQ: 22.687581, 79.370366
    // Opencage: 22.83282, 69.35237
    let address7 = 'Hala Faliya, Behind Hala Faliya Masjid, Near Rangchuli, Mandvi, Kachchh, Gujarat, India,370465'


    this.getMyAddress();
    //  this.onAddressSubmit(address5); // for openstrretmap nomination (Not working)
    this.getCoordinates(address6); // LocationIQ (Tried in free trial and working fine)
    //this.getMarkerUsingOpenCage(address6); // opencage
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
          marker(latlng).bindPopup(`${latlng}`)
        ];
        this.options.center = latlng; // Center the map on the user's location
        this.options.zoom = 10; // Adjust zoom level
      });
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }

  /**
   * Get address from lat-long using openstreetmap (Not accurate for all lat-long)
   */
  getMyAddress(): void {
    this.geocodingService.getAddress(21.716785, 73.031131).subscribe(
      data => {
        if (data) {
          console.log('Address:', data.display_name);
        } else {
          console.log('No address found');
        }
      },
      error => {
        console.error('Error fetching address: ', error);
      }
    );
  }

  /**
   * Get coordinates using openstreetmap (Not wokring)
   * @param address 
   */
  onAddressSubmit(address: string): void {
    this.geocodingService.getLatLng(address).subscribe(response => {
      console.log(response)
      if (response.length > 0) {
        const latLng = L.latLng(response[0].lat, response[0].lon);
        alert(latLng)
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
        console.log(latLng);
        this.layers = [
          marker(latLng).bindPopup(address)
        ];
        this.options.center = latLng; // Center the map on the user's location
      }, error => {
        console.error('Error:', error);
      });
  }

  getMarkerUsingOpenCage(address: string): void {
    this.geocodingService.geocodeAddress(address).subscribe(response => {
      console.log(response); // Handle the response here
    }, error => {
      console.error(error); // Handle errors here
    });
  }
}
