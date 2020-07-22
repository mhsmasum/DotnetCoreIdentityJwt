using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GAKKAPI.IRepository
{
   public interface ISqlService
    {
        SqlConnection GetConnection();
        SqlConnection OpenConnection();
        void CloseConnection();
        SqlTransaction BeginTransaction();
        void CommitTransaction();
        void RollBackTransaction();
        SqlDataReader GetSqlDataReader(string StoreProcedure, bool IsBigData = false);
        SqlDataReader GetSqlDataReader(string StoreProcedure, List<SqlParameter> SqlParameterList, bool IsBigData = false);
    }
}
