const path = require('path');
const fs = require('fs-extra');
const PATH_CACHE = path.join(__dirname, 'cache');
const PATH_RESULT = path.join(PATH_CACHE, 'result.json');

if (!fs.existsSync(PATH_RESULT)) {
    console.log('['+PATH_RESULT+'] not exists');
    process.exit();
}

fs.mkdirpSync(PATH_CACHE);

const data = require(PATH_RESULT);
let arr_prov = [];
let arr_city = [];
let arr_county = [];

for (let i in data) {
    let val = data[i];
    let arr = [];
    let type = val.type;
    if (type == 2) {
        arr = arr_prov;
    } else if (type == 3) {
        arr = arr_city;
    } else if (type == 4) {
        arr = arr_county;
    }

    arr.push(val);
}

fs.writeFileSync(path.join(PATH_CACHE, 'prov.json'), JSON.stringify(arr_prov));
fs.writeFileSync(path.join(PATH_CACHE, 'city.json'), JSON.stringify(arr_city));
fs.writeFileSync(path.join(PATH_CACHE, 'county.json'), JSON.stringify(arr_county));