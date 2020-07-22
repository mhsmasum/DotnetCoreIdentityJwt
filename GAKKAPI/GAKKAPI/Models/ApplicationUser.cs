using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace GAKKAPI.Models
{
    public class ApplicationUser:IdentityUser
    {
        [Column(TypeName ="Nvarchar(150)")]
        public string FullName { get; set; }
    }
}
