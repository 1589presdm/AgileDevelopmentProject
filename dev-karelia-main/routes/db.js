
const config = require("./config");

const { CosmosClient } = require("@azure/cosmos");
const { 
    connectionString,
    databaseId,
    userContainerId } = config


// Create client.
const client = new CosmosClient( connectionString );

// Define database and container.
const databaseid = databaseId;
const containerid = userContainerId;
const container = client.database(databaseid).container(containerid);


module.exports.getUserByUsername = async(username) => {
    
    try{
    
    const querySpec = {
        query: "SELECT * FROM user c WHERE c.username = @username",
        parameters: [{
            name: "@username",
            value: username
        }]
    };
    
    // Execute query and fetch user data.
    const { resources } = await container.items.query(querySpec).fetchAll();

    //console.log("USER RESOURCES: " + JSON.stringify(resources));
    const user = resources.length >= 1 ? resources[0] : null
    //console.log("USER RESULT: " + user)

    // Return user.
    return user;
     
    } catch (error) {
        console.log("Error while fetching users: ", error);
        throw error; 
    }
}

module.exports.updateUserApiKey = async(username, apiKeyValue) => {
    
    try{
    
    const querySpec = {
        query: "SELECT * FROM user c WHERE c.username = @username",
        parameters: [{
            name: "@username",
            value: username
        }]
    };
    
    // Execute query and fetch user data.
    const { resources } = await container.items.query(querySpec).fetchAll();

    //console.log("USER RESOURCES: " + JSON.stringify(resources));
    const user = resources.length >= 1 ? resources[0] : null
    //console.log("USER RESULT: " + user)
    
    // Set a new values in the api_key and usage fields.
    user["api_key"] = apiKeyValue;
    user["usage"] = 0;

    // Perform replace update (replace the entire document, but only the updated field)
    await container.item(user.id, user.username).replace(user); 

    console.log("API key updated successfully");
     
    } catch (error) {
        console.log("Error while updating user: ", error);
        throw error; 
    }
}