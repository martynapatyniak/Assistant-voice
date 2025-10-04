import { Shield } from 'lucide-react';

interface FooterProps {
  onShowPrivacyNotice: () => void;
}

export default function Footer({ onShowPrivacyNotice }: FooterProps) {
  return (
    <footer className="border-t border-gray-200 bg-white mt-12">
      <div className="px-8 py-6">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            © 2025 ProMed Voice Assistant. Wszystkie prawa zastrzeżone.
          </p>
          <button
            onClick={onShowPrivacyNotice}
            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            <Shield className="w-4 h-4" />
            Polityka Prywatności
          </button>
        </div>
      </div>
    </footer>
  );
}
