export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-green-50 to-purple-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <svg className="w-32 h-32 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
          </svg>
        </div>
        
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-600 via-green-600 to-purple-600 bg-clip-text text-transparent">
          Você está Offline
        </h1>
        
        <p className="text-xl text-gray-700 mb-8">
          Parece que você perdeu a conexão com a internet. 
          Mas não se preocupe, você ainda pode acessar conteúdos salvos!
        </p>
        
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Você pode:</h2>
          <ul className="space-y-3 text-left">
            <li className="flex items-start gap-3">
              <span className="text-2xl">📋</span>
              <span className="text-gray-700">Ver seu último cardápio salvo</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">📊</span>
              <span className="text-gray-700">Consultar seu progresso</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-2xl">📸</span>
              <span className="text-gray-700">Ver suas fotos de evolução</span>
            </li>
          </ul>
        </div>
        
        <button 
          onClick={() => window.location.reload()}
          className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-xl"
        >
          🔄 Tentar Novamente
        </button>
        
        <p className="mt-6 text-sm text-gray-600">
          Quando voltar online, tudo será sincronizado automaticamente
        </p>
      </div>
    </div>
  );
}
