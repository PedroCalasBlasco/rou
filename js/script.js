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

    var rouIn = false
    
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
                    <div class="close"> 
                        <p onClick=closeSidebar()><strong>X</strong></p>
                    </div>
                    <div><h4>ROU (${data.features[0].properties.layer})</h4></div>
                    <div style="margin-top: 20px;"> 
                        <label><strong>Descripción: </strong>${data.features[0].properties.descripcion}</label>
                    </div> 
                    <div style="margin-top: 15px"> 
                        <label><strong>Observación: </strong>${data.features[0].properties.observacion}</label>
                    </div> 
                    <div style="margin-top: 15px"> 
                        <label><strong>Altura Máxima: </strong>${!data.features[0].properties.alt_max ? 'Sin Especificar' :  data.features[0].properties.alt_max }</label>
                    </div> 
                    <div style="margin-top: 15px"> 
                        <label><strong>Altura Mínima: </strong>${!data.features[0].properties.alt_min ? 'Sin Especificar' :  data.features[0].properties.alt_min }</label>
                    </div> 
                    <div style="margin-top: 15px"> 
                        <label><strong>FIS: </strong>${!data.features[0].properties.fid_adm ? 'Sin Especificar' :  data.features[0].properties.fid_adm }</label>
                    </div> 
                    <div style="margin-top: 15px"> 
                        <label><strong>FOE: </strong>${!data.features[0].properties.foe ? 'Sin Especificar' :  data.features[0].properties.foe }</label>
                    </div> 
                    <div style="margin-top: 15px"> 
                        <label><strong>FOS: </strong>${!data.features[0].properties.fos_adm ? 'Sin Especificar' :  data.features[0].properties.fos_adm }</label>
                    </div>
                    <div style="margin-top: 15px"> 
                        <label><strong>FOT: </strong>${!data.features[0].properties.fot_adm ? 'Sin Especificar' :  data.features[0].properties.fot_adm }</label>
                    </div>
                    <div style="margin-top: 15px"> 
                        <label><strong>FOT MÁX: </strong>${!data.features[0].properties.fot_max ? 'Sin Especificar' :  data.features[0].properties.fot_max }</label>
                    </div>
                </div>`

                sidebar.innerHTML += `<div class="normativa-link"><a href="https://santafeciudad.gov.ar/secretaria-de-desarrollo-urbano/normativa-urbanistica/" target="_blank"> Ver Normativa Urbanística </a></div> ` 

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
              if(rouIn){
                console.log("PPPEEEEEEEEEEEPPPPPPPPPPPPP", data2)
                sidebar.innerHTML += afectacionesContentOutClose(data2) 
              }else{
                console.log("PPPEEEEEEEEEEEPPPPPPPPPPPPP", data2)
                openSidebar()
                sidebar.innerHTML = afectacionesContent(data2) 
                sidebar.innerHTML += `<div class="normativa-link"><a href="https://santafeciudad.gov.ar/secretaria-de-desarrollo-urbano/normativa-urbanistica/" target="_blank"> Ver Normativa Urbanística </a></div> `     
              }
     
            
              }
        })
        .catch(function (error) {
            console.error(error);
          });
    }
  })

  function afectacionesContentOutClose(data2){
     return   `<div class="popup" style="margin-top: 20px;margin-bottom: 20px">
                  <div><h4>AFECTACIÓN DE CALLE</h4></div>
                <div style="margin-top: 12px"> 
                  <label><strong>Nombre: </strong>${data2.features[0].properties.nombre_art}</label>
                </div>
                <div style="margin-top: 15px"> 
                  <label><strong>Tramo: </strong>${!data2.features[0].properties.tramo ? 'Sin Especificar' :  data2.features[0].properties.tramo }</label>
                </div>  
                <div style="margin-top: 15px"> 
                  <label><strong>Ordenanza: </strong>${!data2.features[0].properties.ordenanza ? 'Sin Especificar' :  data2.features[0].properties.ordenanza }</label>
                </div>
                <div style="margin-top: 15px"> 
                  <label><strong>Ancho: </strong> ${!data2.features[0].properties.ancho_ofic ? 'Sin Especificar' :  data2.features[0].properties.ancho_ofic }</label>
                </div>
              </div>`  
  }


  function afectacionesContent(data2){
    return   `<div class="close"> 
                <p onClick=closeSidebar()><strong>X</strong></p>
              </div>
              <div class="popup" style="margin-top: 20px;margin-bottom: 20px">
                 <div><h4>AFECTACIÓN DE CALLE</h4></div>
               <div style="margin-top: 12px"> 
                 <label><strong>Nombre: </strong>${data2.features[0].properties.nombre_art}</label>
               </div>
               <div style="margin-top: 15px"> 
                 <label><strong>Tramo: </strong>${!data2.features[0].properties.tramo ? 'Sin Especificar' :  data2.features[0].properties.tramo }</label>
               </div>  
               <div style="margin-top: 15px"> 
                 <label><strong>Ordenanza: </strong>${!data2.features[0].properties.ordenanza ? 'Sin Especificar' :  data2.features[0].properties.ordenanza }</label>
               </div>
               <div style="margin-top: 15px"> 
                 <label><strong>Ancho: </strong> ${!data2.features[0].properties.ancho_ofic ? 'Sin Especificar' :  data2.features[0].properties.ancho_ofic }</label>
               </div>
             </div>`  
 }


