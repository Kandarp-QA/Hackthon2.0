const fs = require('fs');
const data = JSON.parse(fs.readFileSync('Opus-Crm AID.postman_collection.json', 'utf8'));

const results = data.item[0].item.slice(0, 5).map(item => {
    return {
        name: item.name,
        method: item.request.method,
        url: item.request.url.raw,
        body: item.request.body ? item.request.body.raw : null,
        responses: item.response ? item.response.length : 0
    };
});

fs.writeFileSync('endpoints_data.json', JSON.stringify(results, null, 2));
console.log("Written to endpoints_data.json");
