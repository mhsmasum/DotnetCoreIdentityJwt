using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GAKKAPI.IRepository;
using GAKKAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace GAKKAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserOrderController : ControllerBase
    {
        private readonly IOrderRepository _orderRepository;
        private UserManager<ApplicationUser> _userManager;
        public UserOrderController(IOrderRepository orderRepository, UserManager<ApplicationUser> userManager)
        {
            _orderRepository = orderRepository;
            _userManager = userManager;
        }

        [Route("GetProducts")]
        [HttpGet]
       
        public async Task<Object> GetAllProduct()
        {
            string userId = User.Claims.First(c => c.Type == "UserID").Value;
            var user = await _userManager.FindByIdAsync(userId);
            return new ObjectResult(_orderRepository.GetProducts());
        }

        [Route("saveorder")]
        [HttpPost]
        
        public IActionResult SaveOrder(Order order)
        {
            string userId = User.Claims.First(c => c.Type == "UserID").Value;
            
            return new ObjectResult(_orderRepository.SaveOrder(order , userId));
        }

        [Route("getorders")]
        [HttpGet]
       
        public IActionResult GetOrders()
        {
            string userId = User.Claims.First(c => c.Type == "UserID").Value;
            return new ObjectResult(_orderRepository.OrderListSP(userId));
        }
    }
}
