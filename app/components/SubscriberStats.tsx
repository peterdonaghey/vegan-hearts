import { Users, UserCheck, UserX, Globe } from 'lucide-react';

interface SubscriberStatsProps {
  stats: {
    total: number;
    active: number;
    unsubscribed: number;
    bySource: {
      'landing-page': number;
      'ebook-download': number;
      manual: number;
    };
  };
}

export default function SubscriberStats({ stats }: SubscriberStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Subscribers */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-vh-green/20">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-vh-green/10 rounded-xl">
            <Users className="h-6 w-6 text-vh-green" />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Subscribers</p>
            <p className="text-3xl font-bold text-vh-green">{stats.total}</p>
          </div>
        </div>
      </div>

      {/* Active Subscribers */}
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

      {/* Unsubscribed */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-gray-300/20">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gray-200 rounded-xl">
            <UserX className="h-6 w-6 text-gray-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Unsubscribed</p>
            <p className="text-3xl font-bold text-gray-600">{stats.unsubscribed}</p>
          </div>
        </div>
      </div>

      {/* By Source Breakdown */}
      <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-vh-orange/20">
        <div className="flex items-center gap-4 mb-3">
          <div className="p-3 bg-vh-orange/10 rounded-xl">
            <Globe className="h-6 w-6 text-vh-orange" />
          </div>
          <div>
            <p className="text-sm text-gray-600">By Source</p>
          </div>
        </div>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Landing Page:</span>
            <span className="font-semibold">{stats.bySource['landing-page']}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Ebook:</span>
            <span className="font-semibold">{stats.bySource['ebook-download']}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Manual:</span>
            <span className="font-semibold">{stats.bySource.manual}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

