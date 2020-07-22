using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GAKKAPI.ViewModel
{
    public class OrderVM
    {

        public int OrderId { get; set; }
        public string FullName { get; set; }
        public string UserName { get; set; }
        public DateTime OrderDate { get; set; }
        public decimal OrderAmount { get; set; }
        public int OrderItems { get; set; }
        
    }
}
