import { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import { supabase, Booking, Doctor } from '../lib/supabase';
import StatusBadge from '../components/StatusBadge';

interface BookingsProps {
  onShowToast: (message: string, type: 'success' | 'error') => void;
}

export default function Bookings({ onShowToast }: BookingsProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [rescheduleData, setRescheduleData] = useState({ date: '', time: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [bookingsRes, doctorsRes] = await Promise.all([
        supabase
          .from('bookings')
          .select('*, doctors(*)')
          .order('booking_date', { ascending: true })
          .order('booking_time', { ascending: true }),
        supabase
          .from('doctors')
          .select('*')
          .order('name'),
      ]);

      if (bookingsRes.error) throw bookingsRes.error;
      if (doctorsRes.error) throw doctorsRes.error;

      if (bookingsRes.data) setBookings(bookingsRes.data);
      if (doctorsRes.data) setDoctors(doctorsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
      onShowToast('BBd podczas Badowania danych', 'error');
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

  const handleCancel = async () => {
    if (!selectedBooking) return;

    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'anulowana', updated_at: new Date().toISOString() })
        .eq('id', selectedBooking.id);

      if (error) throw error;
      onShowToast('Rezerwacja anulowana pomy[lnie', 'success');
      setShowCancelModal(false);
      setSelectedBooking(null);
      loadData();
    } catch (error) {
      console.error('Error canceling booking:', error);
      onShowToast('BBd podczas anulowania rezerwacji', 'error');
    }
  };

  const handleReschedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;

    try {
      const { error } = await supabase
        .from('bookings')
        .update({
          booking_date: rescheduleData.date,
          booking_time: rescheduleData.time,
          status: 'przelo|ona',
          updated_at: new Date().toISOString(),
        })
        .eq('id', selectedBooking.id);

      if (error) throw error;
      onShowToast('Rezerwacja przeBo|ona pomy[lnie', 'success');
      setShowRescheduleModal(false);
      setSelectedBooking(null);
      setRescheduleData({ date: '', time: '' });
      loadData();
    } catch (error) {
      console.error('Error rescheduling booking:', error);
      onShowToast('BBd podczas przeBo|enia rezerwacji', 'error');
    }
  };

  const openCancelModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
  };

  const openRescheduleModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setRescheduleData({
      date: booking.booking_date,
      time: booking.booking_time,
    });
    setShowRescheduleModal(true);
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
        <h1 className="text-2xl font-bold text-gray-900">Rezerwacje</h1>
        <p className="text-gray-600 mt-1">Zarzdzaj rezerwacjami pacjent�w</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {bookings.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Brak rezerwacji</h3>
            <p className="text-gray-600">Rezerwacje pojawi si tutaj automatycznie</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pacjent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Telefon
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lekarz
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data i godzina
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Akcje
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{booking.patient_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {maskPhone(booking.patient_phone)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{booking.doctors?.name}</div>
                      <div className="text-sm text-gray-500">{booking.doctors?.specialty}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {new Date(booking.booking_date).toLocaleDateString('pl-PL')} {booking.booking_time.slice(0, 5)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={booking.status} type="booking" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openRescheduleModal(booking)}
                          disabled={booking.status === 'anulowana'}
                          className="text-blue-600 hover:text-blue-800 font-medium text-sm disabled:text-gray-400 disabled:cursor-not-allowed"
                        >
                          PrzeB�|
                        </button>
                        <button
                          onClick={() => openCancelModal(booking)}
                          disabled={booking.status === 'anulowana'}
                          className="text-red-600 hover:text-red-800 font-medium text-sm disabled:text-gray-400 disabled:cursor-not-allowed"
                        >
                          Anuluj
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showCancelModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Anuluj rezerwacj</h2>
            <p className="text-gray-600 mb-6">
              Czy na pewno chcesz anulowa rezerwacj dla pacjenta <strong>{selectedBooking.patient_name}</strong>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedBooking(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Nie, wr�
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Tak, anuluj
              </button>
            </div>
          </div>
        </div>
      )}

      {showRescheduleModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">PrzeB�| rezerwacj</h2>
            <form onSubmit={handleReschedule} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pacjent
                </label>
                <input
                  type="text"
                  value={selectedBooking.patient_name}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nowa data
                </label>
                <input
                  type="date"
                  required
                  value={rescheduleData.date}
                  onChange={(e) => setRescheduleData({ ...rescheduleData, date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nowa godzina
                </label>
                <input
                  type="time"
                  required
                  value={rescheduleData.time}
                  onChange={(e) => setRescheduleData({ ...rescheduleData, time: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowRescheduleModal(false);
                    setSelectedBooking(null);
                    setRescheduleData({ date: '', time: '' });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  PrzeB�|
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
