import { X, Shield, Eye, Clock, UserCheck } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Polityka Prywatności</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>Ostatnia aktualizacja:</strong> 3 października 2025
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              1. Wprowadzenie
            </h3>
            <p className="text-gray-700 leading-relaxed">
              ProMed Voice Assistant jest zobowiązany do ochrony prywatności użytkowników i pacjentów.
              Niniejsza polityka wyjaśnia, jakie dane zbieramy, jak je wykorzystujemy i jakie prawa
              przysługują pacjentom zgodnie z RODO.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-600" />
              2. Zbierane dane
            </h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              W ramach świadczenia usług zbieramy następujące kategorie danych osobowych:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span><strong>Dane identyfikacyjne:</strong> imię, nazwisko, numer telefonu</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span><strong>Dane o połączeniach:</strong> transkrypcje rozmów, czas trwania, wykryte intencje</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span><strong>Dane o rezerwacjach:</strong> wybrane terminy wizyt, lekarze, status rezerwacji</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              3. Okres przechowywania danych
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Dane osobowe przechowywane są przez okres <strong>90 dni</strong> od daty rejestracji
              w systemie lub ostatniej aktywności. Po upływie tego okresu dane są automatycznie
              usuwane z naszych systemów.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-blue-600" />
              4. Prawa pacjentów
            </h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              Zgodnie z RODO, pacjenci posiadają następujące prawa:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span><strong>Prawo dostępu:</strong> możliwość uzyskania informacji o przetwarzanych danych</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span><strong>Prawo do usunięcia:</strong> możliwość żądania usunięcia danych</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span><strong>Prawo do sprostowania:</strong> możliwość poprawy nieprawidłowych danych</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Rozumiem
          </button>
        </div>
      </div>
    </div>
  );
}
