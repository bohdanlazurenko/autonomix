import { useState, useEffect } from 'react';
import Head from 'next/head';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [loading, setLoading] = useState(false);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [taskStatus, setTaskStatus] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Create tenant first
      await fetch(`${BACKEND_URL}/api/tenants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: tenantId,
          name: tenantId,
        }),
      });

      // Create task
      const response = await fetch(`${BACKEND_URL}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenant: tenantId,
          prompt,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create task');
      }

      const data = await response.json();
      setTaskId(data.taskId);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Poll for task status
  useEffect(() => {
    if (!taskId) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/tasks/${taskId}`);
        const data = await response.json();
        setTaskStatus(data);

        if (data.status === 'completed' || data.status === 'failed') {
          clearInterval(interval);
        }
      } catch (err) {
        console.error('Failed to fetch task status:', err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [taskId]);

  return (
    <>
      <Head>
        <title>AutonomiX - IT Company as a Service</title>
        <meta name="description" content="Generate and deploy your application instantly" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-gray-900 mb-4">
                AutonomiX
              </h1>
              <p className="text-xl text-gray-600">
                IT Company as a Service - Generate and deploy your app in minutes
              </p>
            </div>

            {/* Form */}
            {!taskId && (
              <div className="bg-white rounded-lg shadow-xl p-8">
                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Company/Project ID
                    </label>
                    <input
                      type="text"
                      value={tenantId}
                      onChange={(e) => setTenantId(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      placeholder="my-company"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      pattern="[a-z0-9-]+"
                    />
                    <p className="text-gray-500 text-sm mt-1">
                      Only lowercase letters, numbers, and hyphens
                    </p>
                  </div>

                  <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      What do you want to build?
                    </label>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Describe your application: 'A landing page for a coffee shop with menu and contact form'"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                      required
                    />
                  </div>

                  {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                  >
                    {loading ? 'Creating...' : 'Generate & Deploy'}
                  </button>
                </form>
              </div>
            )}

            {/* Progress */}
            {taskId && taskStatus && (
              <div className="bg-white rounded-lg shadow-xl p-8">
                <h2 className="text-2xl font-bold mb-6">Building Your Application</h2>

                <div className="space-y-4">
                  {taskStatus.steps?.map((step: any, index: number) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step.status === 'completed' ? 'bg-green-500' :
                        step.status === 'in_progress' ? 'bg-blue-500 animate-pulse' :
                        'bg-gray-300'
                      }`}>
                        {step.status === 'completed' && (
                          <span className="text-white">✓</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold">{step.name}</div>
                        <div className="text-sm text-gray-500 capitalize">{step.status}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {taskStatus.status === 'completed' && taskStatus.result && (
                  <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
                    <h3 className="text-xl font-bold text-green-800 mb-4">
                      🎉 Deployment Successful!
                    </h3>
                    <div className="space-y-2">
                      <div>
                        <span className="font-semibold">Repository: </span>
                        <a
                          href={taskStatus.result.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {taskStatus.result.repoUrl}
                        </a>
                      </div>
                      <div>
                        <span className="font-semibold">Live App: </span>
                        <a
                          href={taskStatus.result.deployUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {taskStatus.result.deployUrl}
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {taskStatus.status === 'failed' && (
                  <div className="mt-8 p-6 bg-red-50 border border-red-200 rounded-lg">
                    <h3 className="text-xl font-bold text-red-800 mb-2">
                      ❌ Deployment Failed
                    </h3>
                    <p className="text-red-700">{taskStatus.error}</p>
                  </div>
                )}

                <button
                  onClick={() => {
                    setTaskId(null);
                    setTaskStatus(null);
                    setPrompt('');
                    setTenantId('');
                  }}
                  className="mt-6 w-full bg-gray-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-700 transition"
                >
                  Create Another App
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
