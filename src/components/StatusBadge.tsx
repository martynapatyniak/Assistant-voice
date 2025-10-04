interface StatusBadgeProps {
  status: string;
  type?: 'booking' | 'call';
}

export default function StatusBadge({ status, type = 'booking' }: StatusBadgeProps) {
  const getStyles = () => {
    if (type === 'booking') {
      switch (status.toLowerCase()) {
        case 'potwierdzona':
          return 'bg-green-100 text-green-700 border-green-200';
        case 'przelożona':
          return 'bg-blue-100 text-blue-700 border-blue-200';
        case 'anulowana':
          return 'bg-red-100 text-red-700 border-red-200';
        default:
          return 'bg-gray-100 text-gray-700 border-gray-200';
      }
    } else {
      switch (status.toLowerCase()) {
        case 'sukces':
          return 'bg-green-100 text-green-700 border-green-200';
        case 'przekazanie':
          return 'bg-amber-100 text-amber-700 border-amber-200';
        case 'brak_dopasowania':
          return 'bg-red-100 text-red-700 border-red-200';
        default:
          return 'bg-gray-100 text-gray-700 border-gray-200';
      }
    }
  };

  const getLabel = () => {
    if (type === 'booking') {
      switch (status.toLowerCase()) {
        case 'potwierdzona':
          return 'Potwierdzona';
        case 'przelożona':
          return 'Przełożona';
        case 'anulowana':
          return 'Anulowana';
        default:
          return status;
      }
    } else {
      switch (status.toLowerCase()) {
        case 'sukces':
          return 'Sukces';
        case 'przekazanie':
          return 'Przekazanie';
        case 'brak_dopasowania':
          return 'Brak dopasowania';
        default:
          return status;
      }
    }
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStyles()}`}
    >
      {getLabel()}
    </span>
  );
}
