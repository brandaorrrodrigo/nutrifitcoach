export const getColorScheme = (sexo: string) => {
  if (sexo === 'masculino') {
    return {
      primary: 'from-blue-500 via-green-500 to-cyan-600',
      card: 'from-blue-400 via-green-400 to-cyan-500',
      bg: 'from-blue-50 via-green-50 to-cyan-50',
      button: 'from-blue-500 to-green-600',
      badge: 'from-cyan-500 via-green-500 to-blue-600',
      text: 'from-blue-600 via-green-600 to-cyan-600'
    };
  } else {
    return {
      primary: 'from-pink-500 via-purple-500 to-pink-600',
      card: 'from-pink-400 via-purple-400 to-pink-500',
      bg: 'from-pink-50 via-purple-50 to-pink-100',
      button: 'from-pink-500 to-purple-600',
      badge: 'from-pink-500 via-green-500 to-purple-600',
      text: 'from-pink-600 via-green-600 to-purple-600'
    };
  }
};
