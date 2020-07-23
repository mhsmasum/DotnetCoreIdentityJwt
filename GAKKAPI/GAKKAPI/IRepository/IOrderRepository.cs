using GAKKAPI.Models;
using GAKKAPI.ViewModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GAKKAPI.IRepository
{
   public interface IOrderRepository
    {
        bool SaveOrder(Order order ,string userId);
        List<Product> GetProducts();

        List<Order> OrderList(string customerId);
        Order OrderById(int orderId);
        List<OrderVM> OrderListSP(string customerId);
    }
}
