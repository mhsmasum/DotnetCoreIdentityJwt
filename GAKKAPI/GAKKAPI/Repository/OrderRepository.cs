using GAKKAPI.IRepository;
using GAKKAPI.Models;
using GAKKAPI.ViewModel;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GAKKAPI.Repository
{
    public class OrderRepository : IOrderRepository
    {
        private readonly AuthenticationContext _dbContext;
        private readonly ISqlService _sqlConnService;

        public OrderRepository(AuthenticationContext dbContext, ISqlService sqlConnService)
        {
            _dbContext = dbContext;
            _sqlConnService = sqlConnService;

        }

        public List<Product> GetProducts()
        {
            return _dbContext.Products.ToList();
        }

        public List<Order> OrderList(string customerId)
        {
            try
            {
                return _dbContext.Orders.Where(a => a.Customer.Id == customerId).ToList();
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public List<OrderVM> OrderListSP(string customerId)
        {
            try
            {
                List<OrderVM> aList = new List<OrderVM>();
                var dbConnection = _sqlConnService.OpenConnection();
                List<SqlParameter> parameters = new List<SqlParameter>();
                parameters.Add(new SqlParameter("@userId", customerId));
                SqlDataReader dataReader = _sqlConnService.GetSqlDataReader("sp_Get_OrderByUserId" , parameters);
                while (dataReader.Read())
                {
                    OrderVM orderVM = new OrderVM();
                    orderVM.OrderId = Convert.ToInt32(dataReader["OrderId"]);
                    orderVM.FullName = dataReader["FullName"].ToString();
                    orderVM.UserName = dataReader["UserName"].ToString();
                    orderVM.OrderDate = Convert.ToDateTime(dataReader["OrderDate"]) ;
                    orderVM.OrderAmount = Convert.ToDecimal(dataReader["OrderAmount"]);
                    orderVM.OrderItems = Convert.ToInt32(dataReader["OrderItems"]);
                    aList.Add(orderVM);
                }
                return aList;


            }
            catch (Exception ex)
            {

                throw;

            }
            finally
            {
                _sqlConnService.CloseConnection();
            }
        }

        public bool SaveOrder(Order order , string userId)
        {
            bool result = false;
            using (var transaction = _dbContext.Database.BeginTransaction())
            {
                try
                {
                    var customer = _dbContext.ApplicationUsers.Where(a => a.Id == userId).FirstOrDefault();
                    order.Customer = customer;
                    order.OrderDate = DateTime.UtcNow;
                    _dbContext.Orders.Add(order);

                    _dbContext.AddRange(order.OrderDetails);
                    _dbContext.SaveChanges();
                    transaction.Commit();
                    if (order.OrderId > 0)
                    {
                        result = true;
                    }

                }
                catch (Exception)
                {
                    transaction.Rollback();
                }
            }
            return result;
        }
    }
}
