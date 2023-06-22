const sidebar = document.getElementById("sidebar");

function openSidebar() {
    sidebar.classList.add("active");
}

function closeSidebar() {
    sidebar.classList.remove("active");
}

 urlRou = "https://geoserver.santafeciudad.gov.ar/geoserver/sitmax/wms"

  const layers = [
    
    new ol.layer.Image({
      source: new ol.source.ImageWMS({
        url: urlRou,
        params: {
          'LAYERS': 'sitmax:distritos_rou',
          'FORMAT': 'image/png'
        },
        ratio: 1,
        serverType: 'geoserver'
      })
  }),

    new ol.layer.Image({
        source: new ol.source.ImageWMS({
          url: urlRou,
          params: {
            'LAYERS': 'sitmax:afectaciones',
            'FORMAT': 'image/png'
          },
          ratio: 1,
          serverType: 'geoserver'
        })
    }),




    new ol.layer.Image({
        source: new ol.source.ImageWMS({
          url: urlRou,
          params: {
            'LAYERS': 'sitmax:padron',
            'FORMAT': 'image/png'
          },
          ratio: 1,
          serverType: 'geoserver'
        }),
        opacity: 0.2
    }),    
    new ol.layer.Image({
        source: new ol.source.ImageWMS({
          url: urlRou,
          params: {
            'LAYERS': 'sitmax:via_view',
            'FORMAT': 'image/png'
          },
          ratio: 1,
          serverType: 'geoserver'
        }),
        opacity: 0.8
      }),
  ];



  const map = new ol.Map({
    target: 'map',
    layers: layers,
    view: new ol.View({
      center: ol.proj.fromLonLat([-60.68049, -31.617462]),
      zoom: 13
    })
  });


  map.on('click', function (e) {
    closeSidebar() 
  

    let viewResolution = map.getView().getResolution();
      
   

    let urlDistritos = layers[0].getSource().getFeatureInfoUrl(
      e.coordinate,
      viewResolution,
      map.getView().getProjection(),
      { 'INFO_FORMAT': 'application/json', 'QUERY_LAYERS': 'sitmax:distritos_rou'}
    );

  
    let urlAfectaciones = layers[1].getSource() .getFeatureInfoUrl(
      e.coordinate,
      viewResolution,
      map.getView().getProjection(),
      { 'INFO_FORMAT': 'application/json', 'QUERY_LAYERS': 'sitmax:afectaciones' }
    );  

    
    let rouIn = false
    console.log(rouIn)

    if (urlDistritos) {
        fetch(urlDistritos)
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            if(data.features.length > 0) {

                openSidebar()
                rouIn = true

                sidebar.innerHTML = 
                `<div class="popup">
                    <div class="close" > 
                        <p onClick=closeSidebar()><strong>X</strong></p>
                    </div>
                    <div><h4>ROU</h4></div>
                    <div style="margin-top: 20px"> 
                        <label>Descripción:</label><p><strong>${data.features[0].properties.descripcion}</strong></p>
                    </div> 
                    <div style="margin-top: 10px"> 
                        <label>Observación:</label>
                        <p><strong>${data.features[0].properties.observacion}</strong></p>
                    </div> 
                    <div style="margin-top: 10px"> 
                        <label>Altura Máxima:</label>
                        <p><strong>${!data.features[0].properties.alt_max ? 'Sin Especificar' :  data.features[0].properties.alt_max }</strong></p>
                    </div> 
                    <div style="margin-top: 10px"> 
                        <label>Altura Mínima:</label>
                        <p><strong>${!data.features[0].properties.alt_min ? 'Sin Especificar' :  data.features[0].properties.alt_min }</strong></p>
                    </div> 
                    <div style="margin-top: 10px"> 
                        <label>FIS:</label>
                        <p><strong>${!data.features[0].properties.fid_adm ? 'Sin Especificar' :  data.features[0].properties.fid_adm }</strong></p>
                    </div> 
                    <div style="margin-top: 10px"> 
                        <label>FOE:</label>
                        <p><strong>${!data.features[0].properties.foe ? 'Sin Especificar' :  data.features[0].properties.foe }</strong></p>
                    </div> 
                    <div style="margin-top: 10px"> 
                        <label>FOS:</label>
                        <p><strong>${!data.features[0].properties.fos_adm ? 'Sin Especificar' :  data.features[0].properties.fos_adm }</strong></p>
                    </div>
                    <div style="margin-top: 10px"> 
                        <label>FOT:</label>
                        <p><strong>${!data.features[0].properties.fot_adm ? 'Sin Especificar' :  data.features[0].properties.fot_adm }</strong></p>
                    </div>
                    <div style="margin-top: 10px"> 
                        <label>FOT MÁX:</label>
                        <p><strong>${!data.features[0].properties.fot_max ? 'Sin Especificar' :  data.features[0].properties.fot_max }</strong></p>
                    </div>
                </div>`
            }
         
          })
          .catch(function (error) {
            console.error(error);
          });
      }

    if (urlAfectaciones) {
        fetch(urlAfectaciones)
        .then(function (response2) {
            return response2.json();
        })
        .then(function (data2) {
            if(data2.features.length > 0) {
              console.log(data2.features)
              if(rouIn){
                console.log("PPP")
                sidebar.innerHTML = 
                `<div class="popup" style="margin-top: 20px">
                    <div><h4>AFECTACIONES</h4></div>
                    <div style="margin-top: 12px"> 
                        <label>Nombre:</label><p><strong>${data2.features[0].properties.nombre_art}</strong></p>
                    </div>
                    <div style="margin-top: 10px"> 
                      <label>Tramo:</label>
                      <p><strong>${!data2.features[0].properties.tramo ? 'Sin Especificar' :  data2.features[0].properties.tramo }</strong></p>
                    </div>  
                    <div style="margin-top: 10px"> 
                      <label>Ordenanza:</label>
                      <p><strong>${!data2.features[0].properties.ordenanza ? 'Sin Especificar' :  data2.features[0].properties.ordenanza }</strong></p>
                    </div>
                    <div style="margin-top: 10px"> 
                      <label>Ancho:</label>
                      <p><strong>${!data2.features[0].properties.ancho_ofic ? 'Sin Especificar' :  data2.features[0].properties.ancho_ofic }</strong></p>
                    </div>
                  </div>
                `  
              
              }else{
                openSidebar()
                console.log("NNNNN")
                sidebar.innerHTML += 
                `<div class="popup" style="margin-top: 20px">
                    <div class="close" > 
                      <p onClick=closeSidebar()><strong>X</strong></p>
                    </div>
                    <div><h4>AFECTACIONES</h4></div>
                    <div style="margin-top: 12px"> 
                        <label>Nombre:</label><p><strong>${data2.features[0].properties.nombre_art}</strong></p>
                    </div>
                    <div style="margin-top: 10px"> 
                      <label>Tramo:</label>
                      <p><strong>${!data2.features[0].properties.tramo ? 'Sin Especificar' :  data2.features[0].properties.tramo }</strong></p>
                    </div>  
                    <div style="margin-top: 10px"> 
                      <label>Ordenanza:</label>
                      <p><strong>${!data2.features[0].properties.ordenanza ? 'Sin Especificar' :  data2.features[0].properties.ordenanza }</strong></p>
                    </div>
                    <div style="margin-top: 10px"> 
                      <label>Ancho:</label>
                      <p><strong>${!data2.features[0].properties.ancho_ofic ? 'Sin Especificar' :  data2.features[0].properties.ancho_ofic }</strong></p>
                    </div>
                  </div>
                `
                  
              }          
            }
        })
        .catch(function (error) {
            console.error(error);
          });
    }

  })

