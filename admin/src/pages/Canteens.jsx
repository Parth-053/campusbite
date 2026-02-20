import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Coffee, CheckCircle } from 'lucide-react';

import { fetchCanteens, fetchCanteenFilters, deleteCanteen } from '../store/canteenSlice';
import StatCard from '../components/dashboard/StatCard';
import Skeleton from '../components/common/Skeleton';
import CanteenFilters from '../components/canteens/CanteenFilters';
import CanteensTable from '../components/canteens/CanteensTable';

const Canteens = () => {
  const dispatch = useDispatch();
  
  const { 
    canteens, filterData, totalCanteens, activeCanteens, isLoading 
  } = useSelector((state) => state.canteen);

  // Removed 'college' from the initial state
  const [filters, setFilters] = useState({ state: '', district: '', status: 'All' });

  useEffect(() => {
    dispatch(fetchCanteenFilters());
    dispatch(fetchCanteens(filters));
  }, [dispatch, filters]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to permanently delete this canteen?")) {
      dispatch(deleteCanteen(id));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <h1 className="text-2xl font-bold text-gray-800">Canteens Directory</h1>

      <CanteenFilters filterData={filterData} filters={filters} setFilters={setFilters} />

      <div className="grid grid-cols-2 gap-3 md:gap-6">
        {isLoading ? (
          <>
            <Skeleton className="h-20 sm:h-24 w-full rounded-xl" />
            <Skeleton className="h-20 sm:h-24 w-full rounded-xl" />
          </>
        ) : (
          <>
            <StatCard title="Total Canteens" value={totalCanteens} icon={Coffee} color="bg-orange-500" />
            <StatCard title="Active Canteens" value={activeCanteens} icon={CheckCircle} color="bg-green-500" />
          </>
        )}
      </div>

      <CanteensTable canteens={canteens} isLoading={isLoading} onDelete={handleDelete} />
    </div>
  );
};

export default Canteens;