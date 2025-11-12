import { Users, UserCheck, UserX, Clock } from 'lucide-react';

interface UserStatsProps {
  stats: {
    total: number;
    active: number;
    disabled: number;
    recentlyAdded: number;
  };
}

export default function UserStats({ stats }: UserStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Users */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-vh-green/20">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-vh-green/10 rounded-xl">
            <Users className="h-6 w-6 text-vh-green" />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Admins</p>
            <p className="text-3xl font-bold text-vh-green">{stats.total}</p>
          </div>
        </div>
      </div>

      {/* Active Users */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-green-500/20">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-500/10 rounded-xl">
            <UserCheck className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Active</p>
            <p className="text-3xl font-bold text-green-600">{stats.active}</p>
          </div>
        </div>
      </div>

      {/* Disabled Users */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-gray-300/20">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gray-200 rounded-xl">
            <UserX className="h-6 w-6 text-gray-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Disabled</p>
            <p className="text-3xl font-bold text-gray-600">{stats.disabled}</p>
          </div>
        </div>
      </div>

      {/* Recently Added */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-vh-orange/20">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-vh-orange/10 rounded-xl">
            <Clock className="h-6 w-6 text-vh-orange" />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Added (30d)</p>
            <p className="text-3xl font-bold text-vh-orange">{stats.recentlyAdded}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

