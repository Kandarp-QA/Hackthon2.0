const fs = require('fs');
const data = JSON.parse(fs.readFileSync('Opus-Crm AID.postman_collection.json', 'utf8'));

// The format might be nested
function extractEndpoints(items, path = "") {
    let endpoints = [];
    for (let item of items) {
        if (item.item) {
            endpoints = endpoints.concat(extractEndpoints(item.item, path + item.name + "/"));
        } else if (item.request) {
            endpoints.push({
                name: path + item.name,
                method: item.request.method,
                url: item.request.url.raw || item.request.url
            });
        }
    }
    return endpoints;
}

const endpoints = extractEndpoints(data.item);
console.log(JSON.stringify(endpoints, null, 2));

