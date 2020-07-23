using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GAKKAPI.IRepository;
using GAKKAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace GAKKAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ProductSettingController : ControllerBase
    {
        private readonly IGRepository _repository;
        public ProductSettingController(AuthenticationContext context, IGRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        [Route("getproducts")]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            var products = await _repository.FindAll<Product>();
            return products;
        }
        [HttpPost]
        [Route("saveproduct")]
        public async Task<ActionResult<Product>> PostPost(Product product)
        {
            await _repository.CreateAsync<Product>(product);
            return product;
        }

        [HttpPost]
        [Route("updateproduct")]
        public async Task<ActionResult<Product>> UpdateProduct( Product product)
        {
            

            await _repository.UpdateAsync<Product>(product);

           return product; ;
        }

        [HttpDelete]
        [Route("deleteproduct")]
        public async Task<ActionResult<Product>> DeleteProduct(int id)
        {
            try
            {
                var product = await _repository.FindById<Product>(id);

                if (product == null)
                {
                    return NotFound();
                }

                await _repository.DeleteAsync<Product>(product);

                return product;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
    }
}
