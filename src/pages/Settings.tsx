import { useEffect, useState } from 'react';
import { Save, RefreshCw } from 'lucide-react';
import { supabase, Setting } from '../lib/supabase';

interface SettingsProps {
  onShowToast: (message: string, type: 'success' | 'error') => void;
}

export default function Settings({ onShowToast }: SettingsProps) {
  const [settings, setSettings] = useState<Record<string, string>>({
    twilio_account_sid: '',
    twilio_auth_token: '',
    n8n_webhook_url: '',
    hmac_secret: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*');

      if (error) throw error;

      if (data) {
        const settingsMap: Record<string, string> = {};
        data.forEach((setting: Setting) => {
          settingsMap[setting.key] = setting.value;
        });
        setSettings(settingsMap);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      onShowToast('BBd podczas Badowania ustawieD', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = Object.entries(settings).map(([key, value]) => ({
        key,
        value,
        updated_at: new Date().toISOString(),
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('settings')
          .update({ value: update.value, updated_at: update.updated_at })
          .eq('key', update.key);

        if (error) throw error;
      }

      onShowToast('Ustawienia zapisane pomy[lnie', 'success');
    } catch (error) {
      console.error('Error saving settings:', error);
      onShowToast('BBd podczas zapisywania ustawieD', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (confirm('Czy na pewno chcesz przywr�ci domy[lne ustawienia?')) {
      setSettings({
        twilio_account_sid: '',
        twilio_auth_token: '',
        n8n_webhook_url: '',
        hmac_secret: '',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Ustawienia</h1>
        <p className="text-gray-600 mt-1">Konfiguracja integracji i zabezpieczeD</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Integracje</h2>
          <p className="text-sm text-gray-600 mt-1">
            Skonfiguruj poBczenia z usBugami zewntrznymi
          </p>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-4">Twilio</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account SID
                </label>
                <input
                  type="text"
                  value={settings.twilio_account_sid}
                  onChange={(e) =>
                    setSettings({ ...settings, twilio_account_sid: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Auth Token
                </label>
                <input
                  type="password"
                  value={settings.twilio_auth_token}
                  onChange={(e) =>
                    setSettings({ ...settings, twilio_auth_token: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your Twilio Auth Token"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">n8n</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Webhook URL
              </label>
              <input
                type="url"
                value={settings.n8n_webhook_url}
                onChange={(e) =>
                  setSettings({ ...settings, n8n_webhook_url: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://your-n8n-instance.com/webhook/..."
              />
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">Zabezpieczenia</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                HMAC Secret
              </label>
              <input
                type="password"
                value={settings.hmac_secret}
                onChange={(e) =>
                  setSettings({ ...settings, hmac_secret: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your HMAC Secret"
              />
              <p className="text-xs text-gray-500 mt-1">
                U|ywany do walidacji webhook�w od zewntrznych usBug
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex gap-3">
          <button
            onClick={handleReset}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className="w-5 h-5" />
            Przywr� domy[lne
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ml-auto"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Zapisywanie...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Zapisz zmiany
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-base font-semibold text-blue-900 mb-2">Informacja o bezpieczeDstwie</h3>
        <p className="text-sm text-blue-800">
          Wszystkie poufne dane s przechowywane w bezpiecznej bazie danych i nigdy nie s
          udostpniane stronom trzecim. Upewnij si, |e nie udostpniasz swoich kluczy API
          nikomu innemu.
        </p>
      </div>
    </div>
  );
}
