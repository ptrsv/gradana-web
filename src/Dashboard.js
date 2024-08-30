import React, { useState, useEffect } from 'react';
const moment = require('moment')

const Dashboard = () => {
  const [name, setName] = useState('User');
  const [currBalance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const currencyFormating = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value);
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('http://localhost:9000/user/get-current-balance', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        if (response.ok) {
          setName(data.name);
          setBalance(data.currBalance);
        } else {
          console.error('Failed to fetch user info');
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    const fetchTransactions = async () => {
      try {
        const response = await fetch('http://localhost:9000/user/get-transaction', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const data = await response.json();
        if (response.ok) {
            setTransactions(data.transactions);
        } else {
          console.error('Failed to fetch transactions');
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchUserInfo();
    fetchTransactions();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Hello, {name}!</h2>
          <p className="text-lg text-gray-600 mt-2">Current Balance: <span className="font-bold">{currencyFormating(currBalance)}</span></p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Up History</h3>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b border-gray-200 text-left text-gray-600">Date</th>
                <th className="py-2 px-4 border-b border-gray-200 text-right text-gray-600">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((trn, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-b border-gray-200">{moment(trn.transaction_date).format('DD-MM-YYYY HH:mm:ss')}</td>
                  <td className={`py-2 px-4 border-b border-gray-200 text-right ${trn.amount < 0 ? 'text-red-500' : 'text-green-500'}`}>
                    {trn.amount < 0 ? '-' : '+'}{currencyFormating(trn.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
