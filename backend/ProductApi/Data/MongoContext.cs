using MongoDB.Driver;
using ProductApi.Models;

namespace ProductApi.Data;

public class MongoContext
{
    public IMongoCollection<Product> Products { get; }

    public MongoContext(IConfiguration config)
    {
        var connectionString = config["Mongo:ConnectionString"];
        var databaseName = config["Mongo:Database"];
        var collectionName = config["Mongo:ProductsCollection"];

        var client = new MongoClient(connectionString);
        var database = client.GetDatabase(databaseName);

        Products = database.GetCollection<Product>(collectionName);
    }
}