import { useEffect, useState } from 'react';
import { Phone, TrendingUp, Users, XCircle } from 'lucide-react';
import { supabase, Booking, CallLog } from '../lib/supabase';
import StatusBadge from '../components/StatusBadge';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalCalls: 0,
    bookingSuccessRate: 0,
    handoffs: 0,
    cancellations: 0,
  });
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [recentCalls, setRecentCalls] = useState<CallLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: calls } = await supabase
        .from('call_logs')
        .select('*')
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('created_at', { ascending: false });

      const { data: bookings } = await supabase
        .from('bookings')
        .select('*, doctors(*)')
        .order('created_at', { ascending: false })
        .limit(5);

      const { data: recentCallData } = await supabase
        .from('call_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (calls) {
        const totalCalls = calls.length;
        const successfulBookings = calls.filter(c => c.outcome === 'sukces' && c.intent === 'book').length;
        const handoffs = calls.filter(c => c.outcome === 'przekazanie').length;
        const cancellations = calls.filter(c => c.intent === 'cancel').length;
        const bookingSuccessRate = totalCalls > 0 ? (successfulBookings / totalCalls) * 100 : 0;

        setStats({
          totalCalls,
          bookingSuccessRate: Math.round(bookingSuccessRate),
          handoffs,
          cancellations,
        });
      }

      if (bookings) setRecentBookings(bookings);
      if (recentCallData) setRecentCalls(recentCallData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const maskPhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length >= 9) {
      return `+48 *** *** ${cleaned.slice(-3)}`;
    }
    return phone;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Przegląd kluczowych wskaźników i aktywności</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Połączenia (7 dni)</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalCalls}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Phone className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Skuteczność rezerwacji</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.bookingSuccessRate}%</p>
            </div>
            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-teal-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Przekazania do człowieka</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.handoffs}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Anulowania</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.cancellations}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Ostatnie rezerwacje</h2>
          </div>
          <div className="p-6">
            {recentBookings.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Brak rezerwacji</p>
            ) : (
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{booking.patient_name}</p>
                      <p className="text-sm text-gray-600">{maskPhone(booking.patient_phone)}</p>
                    </div>
                    <div className="text-right">
                      <StatusBadge status={booking.status} type="booking" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Ostatnie połączenia</h2>
          </div>
          <div className="p-6">
            {recentCalls.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Brak połączeń</p>
            ) : (
              <div className="space-y-4">
                {recentCalls.map((call) => (
                  <div key={call.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{maskPhone(call.phone_number)}</p>
                      <p className="text-sm text-gray-600 capitalize">{call.intent}</p>
                    </div>
                    <div className="text-right">
                      <StatusBadge status={call.outcome} type="call" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
