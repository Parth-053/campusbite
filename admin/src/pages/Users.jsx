import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Users as UsersIcon, CheckCircle } from 'lucide-react';
import { fetchCustomers } from '../store/customerSlice'; // 🚀 FIXED: Imported new slice
import StatCard from '../components/dashboard/StatCard';
import Skeleton from '../components/common/Skeleton';
import UserFilters from '../components/users/UserFilters';
import UsersTable from '../components/users/UsersTable';

const Users = () => {
  const dispatch = useDispatch();
  // 🚀 FIXED: Using customer state instead of user state
  const { customers, isLoading } = useSelector(state => state.customer);
  const [filters, setFilters] = useState({ college: '', status: 'All' });

  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

  // Filter Logic
  const filteredCustomers = customers.filter(c => {
    // Note: c.college is an object now, so we check c.college.name
    if (filters.college && c.college?.name !== filters.college) return false;
    
    if (filters.status !== 'All') {
      const isBlocked = c.isDeleted; // DB flag
      if (filters.status === 'Active' && isBlocked) return false;
      if (filters.status === 'Inactive' && !isBlocked) return false;
    }
    return true;
  });

  // Extract unique colleges dynamically for the dropdown filter
  const uniqueColleges = [...new Set(customers.map(c => c.college?.name).filter(Boolean))];
  const activeUsersCount = customers.filter(c => !c.isDeleted).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <h1 className="text-2xl font-bold text-gray-800">Students Directory</h1>

      <UserFilters colleges={uniqueColleges} filters={filters} setFilters={setFilters} />

      <div className="grid grid-cols-2 gap-3 md:gap-6">
        {isLoading ? (
          <>
            <Skeleton className="h-20 sm:h-24 w-full rounded-xl" />
            <Skeleton className="h-20 sm:h-24 w-full rounded-xl" />
          </>
        ) : (
          <>
            <StatCard title="Total Students" value={customers.length} icon={UsersIcon} color="bg-blue-500" />
            <StatCard title="Active Students" value={activeUsersCount} icon={CheckCircle} color="bg-green-500" />
          </>
        )}
      </div>

      <UsersTable users={filteredCustomers} isLoading={isLoading} />
    </div>
  );
};

export default Users;