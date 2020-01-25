function display(data) {
  //displaying data in the div with id container
  container.innerHTML += data;
}

function rm() {
  //removing old info div from the page
  if (document.getElementById("info")) {
    info.parentNode.removeChild(info);
  }
}

var datainfo = {}; //empty object to store data after api call

function data(p) {
  datainfo = p; //storing data in the global datainfo object
  //formatting data so we can display it
  return `<div id="info"><ul>
  <li><strong>Name: </strong>${p.name}</li>
  <li><strong>Address: </strong>${p.formatted_address}</li>
  <li><strong>website: </strong>${p.website}</li>
  <li><strong>Phone: </strong>${p.formatted_phone_number}</li>
  <li><button class="se" onclick="hubspot();">Add to hubspot</button><li>
  <ul></div>`;
}

//sending data to local api
async function postApi(data) {
  let resp = await fetch("/hubspot", {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    redirect: "follow",
    referrer: "no-referrer",
    body: JSON.stringify(data)
  });
  return await resp.json();
}

//displaying done message
function final(c, i) {
  swal(`${c} is added to hubspot :)`, `vid:${i}`, "success");
  rm();
}

//hubspot create contact api
function hubspot() {
  let [address, phone, company, website] = Object.values(datainfo);
  let payload = { properties: [] };
  payload.properties.push(
    { property: "address", value: address },
    { property: "phone", value: phone },
    { property: "company", value: company },
    { property: "website", value: website }
  );
  postApi(payload).then(x => final(company, x.vid));
}

//google maps api
function api() {
  //calling the api and getting data
  let map;
  let rabat = new google.maps.LatLng(34.01325, -6.83255);
  map = new google.maps.Map(document.getElementById("map"), {
    center: rabat,
    zoom: 8
  });

  let request = {
    query: search.value,
    fields: ["place_id"]
  };

  let service = new google.maps.places.PlacesService(map);

  service.findPlaceFromQuery(request, function(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      let request2 = {
        placeId: results[0].place_id,
        fields: [
          "name",
          "formatted_address",
          "website",
          "formatted_phone_number"
        ]
      };
      service.getDetails(request2, function(place, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          display(data(place));
        }
      });
    }
  });
}
