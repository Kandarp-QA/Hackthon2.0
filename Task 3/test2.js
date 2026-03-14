const fs = require('fs');
const data = JSON.parse(fs.readFileSync('Opus-Crm AID.postman_collection.json', 'utf8'));

const results = data.item[0].item.slice(5).map(item => {
    return {
        name: item.name,
        body: item.request.body ? item.request.body.raw : null
    };
});

fs.writeFileSync('endpoints_data_2.json', JSON.stringify(results, null, 2));
console.log("Written to endpoints_data_2.json");
