export const translations = {
  pt: {
    home: {
      title: 'Cardápios Personalizados com IA',
      subtitle: 'Nutrição científica + IA avançada = Resultados reais',
      cta: 'Começar Grátis'
    },
    dashboard: {
      title: 'Seu Plano Nutricional',
      calories: 'Calorias',
      protein: 'Proteína',
      carbs: 'Carboidratos',
      fats: 'Gorduras',
      newPlan: 'Gerar Novo Plano'
    },
    common: {
      login: 'Entrar',
      register: 'Cadastrar',
      logout: 'Sair',
      profile: 'Perfil',
      progress: 'Progresso',
      level: 'Nível',
      points: 'Pontos'
    }
  },
  en: {
    home: {
      title: 'Personalized Meal Plans with AI',
      subtitle: 'Scientific nutrition + Advanced AI = Real results',
      cta: 'Start Free'
    },
    dashboard: {
      title: 'Your Nutrition Plan',
      calories: 'Calories',
      protein: 'Protein',
      carbs: 'Carbohydrates',
      fats: 'Fats',
      newPlan: 'Generate New Plan'
    },
    common: {
      login: 'Login',
      register: 'Sign Up',
      logout: 'Logout',
      profile: 'Profile',
      progress: 'Progress',
      level: 'Level',
      points: 'Points'
    }
  },
  es: {
    home: {
      title: 'Planes Personalizados con IA',
      subtitle: 'Nutrición científica + IA avanzada = Resultados reales',
      cta: 'Comenzar Gratis'
    },
    dashboard: {
      title: 'Tu Plan Nutricional',
      calories: 'Calorías',
      protein: 'Proteína',
      carbs: 'Carbohidratos',
      fats: 'Grasas',
      newPlan: 'Generar Nuevo Plan'
    },
    common: {
      login: 'Entrar',
      register: 'Registrarse',
      logout: 'Salir',
      profile: 'Perfil',
      progress: 'Progreso',
      level: 'Nivel',
      points: 'Puntos'
    }
  }
};

export const getTranslation = (lang: string = 'pt') => {
  return translations[lang as keyof typeof translations] || translations.pt;
};
