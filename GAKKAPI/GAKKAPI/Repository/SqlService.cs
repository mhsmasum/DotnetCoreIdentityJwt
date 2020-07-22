using GAKKAPI.IRepository;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GAKKAPI.Repository
{
    public class SqlService: ISqlService
    {
        private readonly IConfiguration _configuration;

        public SqlConnection _sqlConnection;
        public SqlTransaction _sqlTransaction;
        private SqlCommand _sqlCommand = null;
        private const int _commandTimeout = 180000; // (3 min *60000)=  milliseconds 
        private SqlDataReader _sqlDataReader = null;
        private bool hasException;
        private bool _disposed;
       
        
        public SqlService(IConfiguration configuration)
        {
            _configuration = configuration;
            string connString = Microsoft
           .Extensions
           .Configuration
           .ConfigurationExtensions
           .GetConnectionString(this._configuration, "DefaultConnection");
            _sqlConnection = new SqlConnection(connString);

        }

        public SqlConnection OpenConnection()
        {
            if (_sqlConnection.State == System.Data.ConnectionState.Closed)
            {
                _sqlConnection.Open();
            }
            return _sqlConnection;
        }

        public void CloseConnection()
        {
            if (_sqlConnection.State == System.Data.ConnectionState.Open)
            {
                _sqlConnection.Close();
            }
        }

        public SqlConnection GetConnection()
        {
            return _sqlConnection;
        }
        public SqlTransaction BeginTransaction()
        {
            _sqlTransaction = _sqlConnection.BeginTransaction();

            return _sqlTransaction;
        }

        public void CommitTransaction()
        {
            _sqlTransaction.Commit();
        }
        public void RollBackTransaction()
        {
            _sqlTransaction.Rollback();
        }
        public SqlDataReader GetSqlDataReader(string StoreProcedure, bool IsBigData = false)
        {
            try
            {
                _sqlCommand = new SqlCommand
                {
                    Connection = _sqlConnection,
                    CommandType = System.Data.CommandType.StoredProcedure,
                    CommandText = StoreProcedure,
                    Transaction = _sqlTransaction
                };
                if (IsBigData)
                {
                    _sqlCommand.CommandTimeout = _commandTimeout;
                }

                _sqlDataReader = _sqlCommand.ExecuteReader();
            }
            catch (SqlException sqlException)
            {
                hasException = true;
                _sqlDataReader = null;
                throw sqlException;
            }
            finally
            {
                if (hasException)
                {
                    CloseConnection();
                }

            }
            return _sqlDataReader;
        }
        public SqlDataReader GetSqlDataReader(string StoreProcedure, List<SqlParameter> SqlParameterList, bool IsBigData = false)
        {
            try
            {
                _sqlCommand = new SqlCommand
                {
                    Connection = _sqlConnection,
                    CommandType = System.Data.CommandType.StoredProcedure,
                    CommandText = StoreProcedure,
                    Transaction = _sqlTransaction
                };

                _sqlCommand.Parameters.Clear();
                _sqlCommand.Parameters.AddRange(SqlParameterList.ToArray());
                if (IsBigData)
                {
                    _sqlCommand.CommandTimeout = _commandTimeout;
                }



                _sqlDataReader = _sqlCommand.ExecuteReader();
                _sqlCommand.Parameters.Clear();
            }
            catch (SqlException sqlException)
            {
                hasException = true;
                _sqlDataReader = null;
                throw sqlException;
            }
            finally
            {
                _sqlCommand.Parameters.Clear();
                _sqlCommand.Dispose();
                if (hasException)
                {
                    CloseConnection();
                }

            }
            return _sqlDataReader;
        }
        protected virtual void Dispose(bool disposing)
        {
            if (!_disposed)
            {
                if (disposing)
                {
                    _sqlConnection.Dispose();
                }
            }
            _disposed = true;
        }

       



        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
    }
}
