export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            SL Budget
          </h1>
          <p className="text-xl text-gray-600">
            AI-Powered Personal Finance Manager for Sri Lanka
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Track Expenses</h2>
            <p className="text-gray-600">
              Monitor your spending with intelligent categorization
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Bank Integration</h2>
            <p className="text-gray-600">
              Upload statements from 15 Sri Lankan banks
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">AI Insights</h2>
            <p className="text-gray-600">
              Get smart recommendations powered by Gemini & Claude
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            🚀 Backend Migrated to Prisma
          </h3>
          <p className="text-gray-600 mb-4">
            PostgreSQL database with Prisma ORM
          </p>
          <div className="inline-flex gap-4">
            <span className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-medium">
              ✓ Transactions API
            </span>
            <span className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-medium">
              ✓ Bills Management
            </span>
            <span className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-medium">
              ✓ CSV Upload
            </span>
          </div>
        </div>
      </div>
    </main>
  )
}
