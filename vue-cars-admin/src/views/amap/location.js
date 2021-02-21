export function addressSetMapCenter (address,map) {
    console.log(address,'ad');
    let geocoder = new AMap.Geocoder()
    geocoder.getLocation(address, function(status, result) {
        if (status === 'complete'&&result.info == "OK") {
            var lat = result.geocodes[0].location.lat
            var lng = result.geocodes[0].location.lng
            map.setCenter([lng, lat]); //设置地图中心点
        }else{
            log.error('根据地址查询位置失败');
        }
    });
}