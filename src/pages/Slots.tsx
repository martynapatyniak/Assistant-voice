import { useEffect, useState } from 'react';
import { Plus, Calendar as CalendarIcon } from 'lucide-react';
import { supabase, Slot, Doctor } from '../lib/supabase';

interface SlotsProps {
  onShowToast: (message: string, type: 'success' | 'error') => void;
}

export default function Slots({ onShowToast }: SlotsProps) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filterDoctor, setFilterDoctor] = useState<string>('');
  const [formData, setFormData] = useState({
    doctor_id: '',
    slot_date: '',
    slot_time: '',
    is_available: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [slotsRes, doctorsRes] = await Promise.all([
        supabase
          .from('slots')
          .select('*, doctors(*)')
          .order('slot_date', { ascending: true })
          .order('slot_time', { ascending: true }),
        supabase
          .from('doctors')
          .select('*')
          .order('name'),
      ]);

      if (slotsRes.error) throw slotsRes.error;
      if (doctorsRes.error) throw doctorsRes.error;

      if (slotsRes.data) setSlots(slotsRes.data);
      if (doctorsRes.data) setDoctors(doctorsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
      onShowToast('Błąd podczas ładowania danych', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { error } = await supabase
        .from('slots')
        .insert([formData]);

      if (error) throw error;
      onShowToast('Slot dodany pomyślnie', 'success');
      setShowModal(false);
      setFormData({ doctor_id: '', slot_date: '', slot_time: '', is_available: true });
      loadData();
    } catch (error) {
      console.error('Error creating slot:', error);
      onShowToast('Błąd podczas dodawania slotu', 'error');
    }
  };

  const toggleAvailability = async (slot: Slot) => {
    try {
      const { error } = await supabase
        .from('slots')
        .update({ is_available: !slot.is_available, updated_at: new Date().toISOString() })
        .eq('id', slot.id);

      if (error) throw error;
      onShowToast('Status dostępności zmieniony', 'success');
      loadData();
    } catch (error) {
      console.error('Error updating slot:', error);
      onShowToast('Błąd podczas aktualizacji slotu', 'error');
    }
  };

  const filteredSlots = filterDoctor
    ? slots.filter((slot) => slot.doctor_id === filterDoctor)
    : slots;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sloty</h1>
          <p className="text-gray-600 mt-1">Zarządzaj dostępnymi terminami</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Dodaj slot
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <select
            value={filterDoctor}
            onChange={(e) => setFilterDoctor(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Wszyscy lekarze</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name}
              </option>
            ))}
          </select>
        </div>

        {filteredSlots.length === 0 ? (
          <div className="p-12 text-center">
            <CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Brak slotów</h3>
            <p className="text-gray-600 mb-6">Dodaj nowe sloty czasowe dla lekarzy</p>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Dodaj slot
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lekarz
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Godzina
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
                {filteredSlots.map((slot) => (
                  <tr key={slot.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{slot.doctors?.name}</div>
                      <div className="text-sm text-gray-500">{slot.doctors?.specialty}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {new Date(slot.slot_date).toLocaleDateString('pl-PL')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {slot.slot_time.slice(0, 5)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${
                          slot.is_available
                            ? 'bg-green-100 text-green-700 border-green-200'
                            : 'bg-gray-100 text-gray-700 border-gray-200'
                        }`}
                      >
                        {slot.is_available ? 'Dostępny' : 'Zajęty'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => toggleAvailability(slot)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      >
                        {slot.is_available ? 'Oznacz jako zajęty' : 'Oznacz jako dostępny'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Dodaj slot</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lekarz</label>
                <select
                  required
                  value={formData.doctor_id}
                  onChange={(e) => setFormData({ ...formData, doctor_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Wybierz lekarza</option>
                  {doctors.map((doctor) => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                <input
                  type="date"
                  required
                  value={formData.slot_date}
                  onChange={(e) => setFormData({ ...formData, slot_date: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Godzina</label>
                <input
                  type="time"
                  required
                  value={formData.slot_time}
                  onChange={(e) => setFormData({ ...formData, slot_time: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setFormData({ doctor_id: '', slot_date: '', slot_time: '', is_available: true });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Dodaj
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
