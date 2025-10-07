'use client';

import { useState } from 'react';

type ProxyType = 'https' | 'socks5';

interface ProxyConfig {
  type: ProxyType;
  ultravioletUrl: string;
  scramjetUrl: string;
  socks5Host: string;
  socks5Port: string;
}

export default function Dashboard() {
  const [proxyConfig, setProxyConfig] = useState<ProxyConfig>({
    type: 'https',
    ultravioletUrl: '',
    scramjetUrl: '',
    socks5Host: '',
    socks5Port: '1080'
  });

  const handleTypeToggle = () => {
    setProxyConfig(prev => ({
      ...prev,
      type: prev.type === 'https' ? 'socks5' : 'https'
    }));
  };

  const handleInputChange = (field: keyof ProxyConfig, value: string) => {
    setProxyConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveConfig = () => {
    console.log('Saving proxy configuration:', proxyConfig);
    alert('Configuration saved! (Check console for details)');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Welcome Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            🚀 Dual GeForce Proxy
          </h1>
          <p className="text-xl text-blue-200">
            Advanced Proxy Configuration Dashboard
          </p>
        </div>

        {/* Main Dashboard Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 shadow-2xl border border-white/20">
          {/* Proxy Type Toggle */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-4">Proxy Type</h2>
            <div className="flex items-center space-x-4">
              <span className="text-white font-medium">HTTPS</span>
              <button
                onClick={handleTypeToggle}
                className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  proxyConfig.type === 'socks5' ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    proxyConfig.type === 'socks5' ? 'translate-x-9' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="text-white font-medium">SOCKS5</span>
            </div>
            <p className="text-sm text-blue-200 mt-2">
              Currently using: <span className="font-semibold text-white">{proxyConfig.type.toUpperCase()}</span>
            </p>
          </div>

          {/* Configuration Fields */}
          <div className="space-y-6">
            {proxyConfig.type === 'https' ? (
              <>
                <div>
                  <label className="block text-white font-medium mb-2">
                    Ultraviolet URL
                  </label>
                  <input
                    type="url"
                    value={proxyConfig.ultravioletUrl}
                    onChange={(e) => handleInputChange('ultravioletUrl', e.target.value)}
                    placeholder="https://your-ultraviolet-proxy.com"
                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">
                    Scramjet URL
                  </label>
                  <input
                    type="url"
                    value={proxyConfig.scramjetUrl}
                    onChange={(e) => handleInputChange('scramjetUrl', e.target.value)}
                    placeholder="https://your-scramjet-proxy.com"
                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-white font-medium mb-2">
                    SOCKS5 Host
                  </label>
                  <input
                    type="text"
                    value={proxyConfig.socks5Host}
                    onChange={(e) => handleInputChange('socks5Host', e.target.value)}
                    placeholder="127.0.0.1 or proxy.example.com"
                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-white font-medium mb-2">
                    SOCKS5 Port
                  </label>
                  <input
                    type="number"
                    value={proxyConfig.socks5Port}
                    onChange={(e) => handleInputChange('socks5Port', e.target.value)}
                    placeholder="1080"
                    min="1"
                    max="65535"
                    className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex space-x-4">
            <button
              onClick={handleSaveConfig}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-transparent"
            >
              💾 Save Configuration
            </button>
            <button
              onClick={() => setProxyConfig({
                type: 'https',
                ultravioletUrl: '',
                scramjetUrl: '',
                socks5Host: '',
                socks5Port: '1080'
              })}
              className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-transparent"
            >
              🔄 Reset
            </button>
          </div>

          {/* Status Display */}
          <div className="mt-6 p-4 bg-black/20 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-2">Current Configuration</h3>
            <pre className="text-sm text-blue-200 overflow-x-auto">
              {JSON.stringify(proxyConfig, null, 2)}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-blue-300">
            Ready to deploy to <span className="font-semibold">Vercel</span> 🚀
          </p>
        </div>
      </div>
    </div>
  );
}
