import {useEffect} from 'react';
import {tweetsForMap} from '../App'
import {retweetedStatus, notRetweetedStatus} from './Helper';

let mymap;  // variabile che inizializza la mappa

function Map(){

  const L=window.L;

  function displayMap()
  {
    if (mymap !== undefined) {  // se mymap è già in uso ripulisco la mappa
      mymap.remove();
    }

    mymap = L.map('map').setView([41.9102415,12.3959112], 6);  //inizializzo mappa e la centro su Roma, poi fisso lo zoom

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoiYm9tYm9zaSIsImEiOiJja3Z6azJoMGhkMjk5Mm5zN253YmJuMTBmIn0.8ewmTrUzkQmtaQOL0Gk8Ag'
    }).addTo(mymap);

  }

  function displayMarkers()
  {
     for(let tweet in tweetsForMap) {
       //CREO IL CONTENUTO DEL POPUP METTENDOCI I DATI DEL TWEET
       let content = '';

       content += `<div>
       <a href='${tweetsForMap[tweet].user.profile_image_url}' target="_blank"><img src='${tweetsForMap[tweet].user.profile_image_url}'></a>
       <p><a href='https://twitter.com/${tweetsForMap[tweet].user.screen_name}' target="_blank">${tweetsForMap[tweet].user.screen_name}</a></p>`
       if (tweetsForMap[tweet].retweeted_status) {
         content += retweetedStatus(tweetsForMap[tweet]);
        }
       else {
         content += notRetweetedStatus(tweetsForMap[tweet]);
       }
       if (tweetsForMap[tweet].entities.media) {
         content += `<a href='${tweetsForMap[tweet].entities.media[0].media_url}' target="_blank">
         <img src='${tweetsForMap[tweet].entities.media[0].media_url}' style="max-height: 300px; max-width: 300px;" />
         </a>`
       }
       if (tweetsForMap[tweet].place) {
         content += `<p> ${tweetsForMap[tweet].created_at.substring(0,16)} at ${tweetsForMap[tweet].place.full_name} </p>`
       }
       else {
         content += `<p> ${tweetsForMap[tweet].created_at.substring(0,16)} at Unknown Place </p>`
       }
       content += `</div>`

       //CREO I MARKER
       var marker;
       if (tweetsForMap[tweet].geo) {
          //questo caso è facile, creo subito il marker
          marker = L.marker(tweetsForMap[tweet].geo.coordinates).addTo(mymap);
          marker.bindPopup(content);
       }
       else if (tweetsForMap[tweet].place) {
          //TWITTER MI PASSA LE COORDINATE AL CONTRARIO QUINDI LE INVERTO
          let reverse_coordinates = tweetsForMap[tweet].place.bounding_box.coordinates[0];
          for (let counter in reverse_coordinates) {
             //scambio le coordinate
             [reverse_coordinates[counter][0],reverse_coordinates[counter][1]] = [reverse_coordinates[counter][1],reverse_coordinates[counter][0]];
          }
          var polygon = L.polygon(reverse_coordinates).addTo(mymap);
          var center = polygon.getCenter();
          polygon.remove(); //rimuovo il perimetro del poligono, se serve lo teniamo

          //randomizzo un po' le coordinate o i marker vanno in overlap
          center.lat = center.lat + (2 * Math.random() - 1) * 0.05;
          center.lng = center.lng + (2 * Math.random() - 1) * 0.05;
          //creo finalmente il marker
          marker = L.marker(center).addTo(mymap);
          marker.bindPopup(content);

          //RISCAMBIO LE COORDINATE PER TORNARE ALLA SITUAZIONE DI PARTENZA OPPURE E' UN CASINO
          for (let counter in reverse_coordinates) {
             //scambio le coordinate
             [reverse_coordinates[counter][0],reverse_coordinates[counter][1]] = [reverse_coordinates[counter][1],reverse_coordinates[counter][0]];
          }

       }
     }
  }

  useEffect(() =>
  {
    displayMap();
    displayMarkers();
  })

    return (
      <div id="map">
      </div>
    );
}


export default Map;
