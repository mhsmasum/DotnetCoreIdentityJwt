using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace GAKKAPI.Models
{
    public class Order
    {
        [Key]
        public int OrderId { get; set; }
        public int CustomerId { get; set; }
        public decimal OrderAmount { get; set; }
        public DateTime OrderDate { get; set; }
        public string OrderNo { get; set; }

        public ApplicationUser Customer { get; set; }
        public ICollection<OrderDetail> OrderDetails { get; set; }
    }
}
