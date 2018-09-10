const request = require('request');
const fs = require('fs-extra');
const path = require('path');
const CITY_DATA = require('./data/city.json');
const PATH_CACHE = path.join(__dirname, 'cache');
const PATH_RESULT = path.join(PATH_CACHE, 'result.json');

fs.mkdirpSync(PATH_CACHE);

let cache = {};
CITY_DATA.areas_get_response.areas.area.forEach(v => {
    if (v.parent_id > 0 && v.name != '海外') {
        cache[v.id] = v;
    }
});

function _getAddressById(id) {
    let address = '';
    let info = null;
    while((info = cache[id])) {
        address = info.name + address;
        id = info.parent_id;
    }

    return address;
}

function _getCityInfoById(id) {
    let address = _getAddressById(id);
    let url = 'https://restapi.amap.com/v3/geocode/geo?key=79aeffe11def147fe70125f9cf25457b&address='+encodeURIComponent(address)+'&city=';

    return new Promise(resolve => {
        request(url, (err, res, data) => {
            try {
                data = JSON.parse(data);
            }catch(e){
                console.log(e)
            }

            if (data && data.geocodes && data.geocodes.length > 0) {
                let a = data.geocodes[0].location.split(',');
                let geo = [parseFloat(a[0]), parseFloat(a[1])];;
                cache[id].geo = geo;
                len_finished++
                console.log(len_finished+'/'+len_total, address, geo);
            }
            resolve();
        });
    });
}

let keys = Object.keys(cache);
let len_total = keys.length;
let len_finished = 0;
function run() {
    let arr = keys.splice(0, 10).map(v => {
        return _getCityInfoById(v);
    });
    if (arr && arr.length > 0) {
        Promise.all(arr).then(() => {
            fs.writeFileSync(PATH_RESULT, JSON.stringify(cache));
            
            run();
        });
    } else {
        console.log('all down') 
    }
}
run();