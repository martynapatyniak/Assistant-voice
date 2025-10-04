import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import PrivacyModal from './components/PrivacyModal';
import Dashboard from './pages/Dashboard';
import Doctors from './pages/Doctors';
import Slots from './pages/Slots';
import Bookings from './pages/Bookings';
import CallLogs from './pages/CallLogs';
import Settings from './pages/Settings';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'lekarze':
        return <Doctors onShowToast={showToast} />;
      case 'sloty':
        return <Slots onShowToast={showToast} />;
      case 'rezerwacje':
        return <Bookings onShowToast={showToast} />;
      case 'logi':
        return <CallLogs onShowToast={showToast} />;
      case 'ustawienia':
        return <Settings onShowToast={showToast} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />

      <div className="flex-1 ml-64 flex flex-col">
        <main className="flex-1 p-8">
          {renderPage()}
        </main>

        <Footer onShowPrivacyNotice={() => setShowPrivacyModal(true)} />
      </div>

      <PrivacyModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;
