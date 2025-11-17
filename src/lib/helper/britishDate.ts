export const formatDate = (dateStr) => {
    const [y, m, d] = (dateStr || '').split('-');
    return d && m && y ? `${d}/${m}/${y}` : '';
  };