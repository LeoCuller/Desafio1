using Microsoft.AspNetCore.Mvc;
using ProductApi.Models;

namespace ProductApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private static readonly List<Product> Products = new();

    // GET: /api/products
    [HttpGet]
    public ActionResult<List<Product>> GetAll()
    {
        return Ok(Products);
    }

    // POST: /api/products
    [HttpPost]
    public ActionResult<Product> Create([FromBody] Product product)
    {
        product.Id = Products.Count + 1;
        Products.Add(product);
        return Ok(product);
    }
}