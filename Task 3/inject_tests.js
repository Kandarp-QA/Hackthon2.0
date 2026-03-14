const fs = require('fs');

const collectionFile = 'Opus-Crm AID.postman_collection.json';
const outputFile = 'Updated_Opus-Crm_AID.postman_collection.json';

const rawData = fs.readFileSync(collectionFile, 'utf8');
const collection = JSON.parse(rawData);

const targetAPIs = [
    "Create CRM Project",
    "Create CRM-Paint-Craft Project",
    "Create CRM-AID Project",
    "Create CRM Project phase 2",
    "Create CRM-AID lead"
];

function injectTests(item) {
    if (item.item) {
        item.item.forEach(injectTests);
    } else if (item.request && targetAPIs.includes(item.name)) {
        console.log("Injecting tests for: " + item.name);
        
        const testScript = [
            "// --- AUTO GENERATED TESTS ---",
            "pm.test('Response status code is one of expected values', function () {",
            "    pm.expect(pm.response.code).to.be.oneOf([200, 201, 400, 404, 422, 500]);",
            "});",
            "",
            "pm.test('Response time is acceptable (< 1500ms)', function () {",
            "    pm.expect(pm.response.responseTime).to.be.below(1500);",
            "});",
            "",
            "pm.test('Content-Type is present and application/json', function () {",
            "    pm.response.to.have.header('Content-Type');",
            "    pm.expect(pm.response.headers.get('Content-Type')).to.include('application/json');",
            "});",
            "",
            "let jsonData;",
            "try {",
            "    jsonData = pm.response.json();",
            "} catch(e) {",
            "    console.log('Response is not JSON format');",
            "}",
            "",
            "if (jsonData) {",
            "    if (pm.response.code === 200 || pm.response.code === 201) {",
            "        pm.test('Successful response contains required success structure', function () {",
            "            pm.expect(jsonData).to.have.property('success').that.is.a('boolean');",
            "            pm.expect(jsonData).to.have.property('message').that.is.a('string');",
            "            pm.expect(jsonData).to.have.property('error').that.is.a('boolean');",
            "        });",
            "    } else if (pm.response.code === 422) {",
            "        pm.test('Validation error structure is correct', function () {",
            "            pm.expect(jsonData).to.have.property('success', false);",
            "            pm.expect(jsonData).to.have.property('message').that.is.a('string');",
            "            pm.expect(jsonData).to.have.property('error', true);",
            "        });",
            "    } else {",
            "        pm.test('Error response structure contains message', function () {",
            "            pm.expect(jsonData).to.have.property('message');",
            "            pm.expect(jsonData).to.have.property('success', false);",
            "        });",
            "    }",
            "}"
        ];

        // Ensure events array exists
        item.event = item.event || [];
        
        let testEvent = item.event.find(e => e.listen === 'test');
        if (!testEvent) {
            testEvent = {
                listen: "test",
                script: {
                    type: "text/javascript",
                    exec: []
                }
            };
            item.event.push(testEvent);
        }
        
        // Append tests
        testEvent.script.exec = [
            ...testEvent.script.exec,
            "",
            ...testScript
        ];
    }
}

injectTests(collection);

fs.writeFileSync(outputFile, JSON.stringify(collection, null, 2), 'utf8');
console.log("Updated collection saved to " + outputFile);
