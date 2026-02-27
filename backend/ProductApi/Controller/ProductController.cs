using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using ProductApi.Data;
using ProductApi.Models;

namespace ProductApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IMongoCollection<Product> _products;

    public ProductsController(MongoContext context)
    {
        _products = context.Products;
    }

    [HttpGet]
    public async Task<ActionResult<List<Product>>> GetAll()
    {
        var list = await _products.Find(_ => true).ToListAsync();
        return Ok(list);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Product>> GetById(string id)
    {
        var product = await _products.Find(p => p.Id == id).FirstOrDefaultAsync();
        if (product is null) return NotFound();
        return Ok(product);
    }

    [HttpPost]
    public async Task<ActionResult<Product>> Create(Product product)
    {   
        product.Id = null;
        await _products.InsertOneAsync(product);
        return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, Product updated)
    {
        updated.Id = id;
        var result = await _products.ReplaceOneAsync(p => p.Id == id, updated);

        if (result.MatchedCount == 0) return NotFound();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var result = await _products.DeleteOneAsync(p => p.Id == id);
        if (result.DeletedCount == 0) return NotFound();
        return NoContent();
    }
}