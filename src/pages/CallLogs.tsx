import { useEffect, useState } from 'react';
import { Phone, X } from 'lucide-react';
import { supabase, CallLog } from '../lib/supabase';
import StatusBadge from '../components/StatusBadge';

interface CallLogsProps {
  onShowToast: (message: string, type: 'success' | 'error') => void;
}

export default function CallLogs({ onShowToast }: CallLogsProps) {
  const [calls, setCalls] = useState<CallLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCall, setSelectedCall] = useState<CallLog | null>(null);
  const [showDrawer, setShowDrawer] = useState(false);

  useEffect(() => {
    loadCalls();
  }, []);

  const loadCalls = async () => {
    try {
      const { data, error } = await supabase
        .from('call_logs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setCalls(data);
    } catch (error) {
      console.error('Error loading calls:', error);
      onShowToast('BBd podczas Badowania log�w poBczeD', 'error');
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

  const getIntentLabel = (intent: string) => {
    const labels: Record<string, string> = {
      book: 'Rezerwacja',
      cancel: 'Anulowanie',
      reschedule: 'PrzeBo|enie',
      info: 'Informacja',
      other: 'Inne',
    };
    return labels[intent] || intent;
  };

  const openDrawer = (call: CallLog) => {
    setSelectedCall(call);
    setShowDrawer(true);
  };

  const closeDrawer = () => {
    setShowDrawer(false);
    setTimeout(() => setSelectedCall(null), 300);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
        <h1 className="text-2xl font-bold text-gray-900">Logi PoBczeD</h1>
        <p className="text-gray-600 mt-1">Historia poBczeD z asystentem gBosowym</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {calls.length === 0 ? (
          <div className="p-12 text-center">
            <Phone className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Brak log�w poBczeD</h3>
            <p className="text-gray-600">Logi poBczeD pojawi si tutaj automatycznie</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Numer telefonu
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transkrypcja
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Intencja
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Wynik
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Czas trwania
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {calls.map((call) => (
                  <tr
                    key={call.id}
                    onClick={() => openDrawer(call)}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {maskPhone(call.phone_number)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 max-w-xs truncate">
                        {call.transcript || 'Brak transkrypcji'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                        {getIntentLabel(call.intent)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={call.outcome} type="call" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {formatDuration(call.call_duration)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {new Date(call.created_at).toLocaleString('pl-PL')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showDrawer && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={closeDrawer}
        >
          <div
            className={`fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-xl transform transition-transform duration-300 ${
              showDrawer ? 'translate-x-0' : 'translate-x-full'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Szczeg�By poBczenia</h2>
                <button
                  onClick={closeDrawer}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {selectedCall && (
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Numer telefonu
                      </label>
                      <p className="text-gray-900 font-medium">{maskPhone(selectedCall.phone_number)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Czas trwania
                      </label>
                      <p className="text-gray-900 font-medium">{formatDuration(selectedCall.call_duration)}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Intencja
                      </label>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                        {getIntentLabel(selectedCall.intent)}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Wynik
                      </label>
                      <StatusBadge status={selectedCall.outcome} type="call" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-500 mb-1">
                        Data i godzina
                      </label>
                      <p className="text-gray-900 font-medium">
                        {new Date(selectedCall.created_at).toLocaleString('pl-PL', {
                          dateStyle: 'long',
                          timeStyle: 'short',
                        })}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                      PeBna transkrypcja
                    </label>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <p className="text-gray-900 whitespace-pre-wrap">
                        {selectedCall.transcript || 'Brak transkrypcji'}
                      </p>
                    </div>
                  </div>

                  {selectedCall.metadata && Object.keys(selectedCall.metadata).length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-2">
                        Dodatkowe dane
                      </label>
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <pre className="text-sm text-gray-900 whitespace-pre-wrap">
                          {JSON.stringify(selectedCall.metadata, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
