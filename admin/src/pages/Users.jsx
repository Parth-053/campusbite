import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Users as UsersIcon, CheckCircle } from 'lucide-react';
import { fetchUsers, fetchUserFilters } from '../store/userSlice';
import StatCard from '../components/dashboard/StatCard';
import Skeleton from '../components/common/Skeleton';
import UserFilters from '../components/users/UserFilters';
import UsersTable from '../components/users/UsersTable';

const Users = () => {
  const dispatch = useDispatch();
  const { users, filterData, totalUsers, activeUsers, isLoading } = useSelector(state => state.user);
  const [filters, setFilters] = useState({ college: '', status: 'All' });

  useEffect(() => {
    dispatch(fetchUserFilters());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchUsers(filters));
  }, [dispatch, filters]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <h1 className="text-2xl font-bold text-gray-800">Students Directory</h1>

      <UserFilters filterData={filterData} filters={filters} setFilters={setFilters} />

      <div className="grid grid-cols-2 gap-3 md:gap-6">
        {isLoading ? (
          <>
            <Skeleton className="h-20 sm:h-24 w-full rounded-xl" />
            <Skeleton className="h-20 sm:h-24 w-full rounded-xl" />
          </>
        ) : (
          <>
            <StatCard title="Total Students" value={totalUsers} icon={UsersIcon} color="bg-blue-500" />
            <StatCard title="Active Students" value={activeUsers} icon={CheckCircle} color="bg-green-500" />
          </>
        )}
      </div>

      <UsersTable users={users} isLoading={isLoading} />
    </div>
  );
};

export default Users;