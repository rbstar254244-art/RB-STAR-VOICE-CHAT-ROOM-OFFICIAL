import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Radio, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  Copy, 
  Download, 
  Upload, 
  Layers, 
  Code2, 
  Check,
  Server,
  Database,
  CloudUpload,
  CloudDownload
} from 'lucide-react';

export const AppConnectView: React.FC = () => {
  const { 
    appConfig, 
    testAppPing, 
    exportDatabaseJSON, 
    importDatabaseJSON, 
    resetAllData,
    backendStatus,
    isSyncingDb,
    lastDbSyncAt,
    syncNowToInfinityFree,
    pullFromInfinityFree
  } = useApp();

  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [pingTesting, setPingTesting] = useState(false);
  const [pingResult, setPingResult] = useState<number | null>(appConfig.lastPingMs);
  const [activeTabCode, setActiveTabCode] = useState<'kotlin' | 'swift' | 'nodejs'>('kotlin');
  const [statusNotice, setStatusNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(appConfig.apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(appConfig.webhookUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handlePingTest = async () => {
    setPingTesting(true);
    try {
      const ms = await testAppPing();
      setPingResult(ms);
    } finally {
      setPingTesting(false);
    }
  };

  const handlePushToMySql = async () => {
    setStatusNotice(null);
    const ok = await syncNowToInfinityFree();
    if (ok) {
      setStatusNotice({ type: 'success', text: 'All portal records & settings successfully pushed to InfinityFree MySQL.' });
    } else {
      setStatusNotice({ type: 'error', text: 'MySQL sync is only active when deployed on InfinityFree PHP hosting with configured DB credentials.' });
    }
  };

  const handlePullFromMySql = async () => {
    setStatusNotice(null);
    const ok = await pullFromInfinityFree();
    if (ok) {
      setStatusNotice({ type: 'success', text: 'Latest database snapshot pulled from InfinityFree MySQL.' });
    } else {
      setStatusNotice({ type: 'error', text: 'Could not pull from InfinityFree MySQL. Verify api/config.php credentials and admin login.' });
    }
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importDatabaseJSON(content);
      if (success) {
        setStatusNotice({ type: 'success', text: 'Success! Database JSON successfully restored.' });
      } else {
        setStatusNotice({ type: 'error', text: 'Invalid JSON file format!' });
      }
    };
    reader.readAsText(file);
  };

  const codeSnippets = {
    kotlin: `// Android (Kotlin) Voice Room Integration (InfinityFree PHP Webhook)
// Header: X-RBSTAR-API-KEY: ${appConfig.apiKey}
val syncPayload = JSONObject().apply {
    put("appId", currentUser.appId)
    put("action", "VERIFY_ID")
    put("apiKey", "${appConfig.apiKey}")
}

Fuel.post("${appConfig.webhookUrl}")
    .header("X-RBSTAR-API-KEY", "${appConfig.apiKey}")
    .jsonBody(syncPayload.toString())
    .responseString { _, _, result ->
        Log.d("VoiceRoom", "Sync status: \${result.get()}")
    }`,

    swift: `// iOS (Swift) Voice Room App Integration
let payload: [String: Any] = [
    "appId": currentUser.id,
    "action": "VERIFY_ID",
    "apiKey": "${appConfig.apiKey}"
]

var request = URLRequest(url: URL(string: "${appConfig.webhookUrl}")!)
request.httpMethod = "POST"
request.setValue("${appConfig.apiKey}", forHTTPHeaderField: "X-RBSTAR-API-KEY")
request.httpBody = try? JSONSerialization.data(withJSONObject: payload)
URLSession.shared.dataTask(with: request).resume()`,

    nodejs: `// Node.js / Express WebRTC Voice Gateway Server
const axios = require('axios');

async function syncWithPortal(action, data) {
  await axios.post('${appConfig.webhookUrl}', {
    apiKey: '${appConfig.apiKey}',
    action: action,
    timestamp: Date.now(),
    ...data
  }, {
    headers: { 'X-RBSTAR-API-KEY': '${appConfig.apiKey}' }
  });
}`
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Banner */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 border border-cyan-800/50 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-black uppercase flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>VOICE APP SERVER BRIDGE & INFINITYFREE API</span>
            </span>
            <span className="text-xs text-emerald-400 font-mono">
              ● Gateway Ready ({pingResult || 28}ms)
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-white mt-2">
            InfinityFree MySQL Sync & Webhook Gateway
          </h1>
          <p className="text-xs md:text-sm text-slate-300 max-w-2xl mt-1 leading-relaxed">
            Sync portal state with your InfinityFree PHP 8 + MySQL database and link your mobile audio chat room application via API webhooks.
          </p>
        </div>

        <button
          onClick={handlePingTest}
          disabled={pingTesting}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-cyan-950 shrink-0 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${pingTesting ? 'animate-spin' : ''}`} />
          <span>{pingTesting ? 'Testing Latency...' : 'Test Connection'}</span>
        </button>
      </div>

      {/* Inline Feedback Notice */}
      {statusNotice && (
        <div className={`p-4 rounded-2xl border text-xs flex items-center justify-between gap-3 ${
          statusNotice.type === 'success'
            ? 'bg-emerald-950/70 border-emerald-700 text-emerald-200'
            : 'bg-rose-950/70 border-rose-700 text-rose-200'
        }`}>
          <div className="flex items-center gap-2">
            {statusNotice.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{statusNotice.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setStatusNotice(null)}
            className="text-[11px] underline opacity-80 hover:opacity-100 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* InfinityFree PHP + MySQL Live Sync Status Card */}
      <div className="bg-slate-900/90 border border-emerald-500/40 rounded-3xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                InfinityFree PHP 8 + MySQL Database
              </h3>
              <p className="text-xs text-slate-400">
                Automatic REST sync via <code className="text-emerald-300">./api/sync.php</code> when hosted on InfinityFree
              </p>
            </div>
          </div>

          <span className={`px-3 py-1 rounded-full text-xs font-mono border self-start sm:self-center ${
            backendStatus.isPhpHost && backendStatus.dbReady
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : backendStatus.isPhpHost && !backendStatus.configured
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-slate-800 text-slate-300 border-slate-700'
          }`}>
            {backendStatus.isPhpHost && backendStatus.dbReady
              ? 'CONNECTED TO MYSQL'
              : backendStatus.isPhpHost && !backendStatus.configured
              ? 'DB CONFIG REQUIRED (api/config.php)'
              : 'LOCAL PREVIEW MODE'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-500 block text-[10px] uppercase">Hosting Environment</span>
            <span className="text-white font-bold mt-0.5 block">
              {backendStatus.isPhpHost ? 'InfinityFree Apache + PHP 8' : 'Static / Preview Browser Mode'}
            </span>
          </div>
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-500 block text-[10px] uppercase">Database Schema</span>
            <span className={`font-bold mt-0.5 block ${backendStatus.dbReady ? 'text-emerald-400' : 'text-amber-300'}`}>
              {backendStatus.dbReady ? '16 MySQL Tables Active' : 'infinityfree_schema.sql Ready'}
            </span>
          </div>
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
            <span className="text-slate-500 block text-[10px] uppercase">Last MySQL Sync</span>
            <span className="text-cyan-300 font-mono font-bold mt-0.5 block">
              {lastDbSyncAt ? new Date(lastDbSyncAt).toLocaleTimeString() : 'Not synced yet'}
            </span>
          </div>
        </div>

        {backendStatus.error && (
          <div className="p-3 rounded-xl bg-amber-950/50 border border-amber-800/60 text-amber-200 text-xs">
            Backend notice: {backendStatus.error}
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handlePushToMySql}
            disabled={isSyncingDb}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <CloudUpload className="w-4 h-4" />
            <span>{isSyncingDb ? 'Syncing...' : 'Push All Data to MySQL'}</span>
          </button>

          <button
            type="button"
            onClick={handlePullFromMySql}
            disabled={isSyncingDb}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <CloudDownload className="w-4 h-4" />
            <span>Pull Latest from MySQL</span>
          </button>
        </div>
      </div>

      {/* Connection Credentials Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-5">
        <h3 className="font-bold text-white text-base flex items-center gap-2">
          <Server className="w-5 h-5 text-cyan-400" />
          <span>API Keys & Webhook Endpoints</span>
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              App Webhook Sync Endpoint (InfinityFree PHP Webhook):
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={appConfig.webhookUrl}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none"
              />
              <button
                onClick={handleCopyUrl}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                {copiedUrl ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedUrl ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">
              Secret API Authorization Key:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={appConfig.apiKey}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-amber-300 font-mono focus:outline-none"
              />
              <button
                onClick={handleCopyKey}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              >
                {copiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedKey ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 text-xs">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-500 block text-[10px]">App Package ID:</span>
              <span className="text-white font-mono font-bold">{appConfig.appPackageId}</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Server Latency:</span>
              <span className="text-emerald-400 font-mono font-bold">{pingResult} ms</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Total Synced Requests:</span>
              <span className="text-purple-300 font-mono font-bold">{appConfig.totalApiRequests.toLocaleString()}</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Sync Interval:</span>
              <span className="text-slate-300 font-mono font-bold">Every {appConfig.syncIntervalSeconds}s</span>
            </div>
          </div>
        </div>
      </div>

      {/* Code Snippets for Developers */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Code2 className="w-5 h-5 text-indigo-400" />
              <span>App Developer Integration Guide</span>
            </h3>
            <p className="text-xs text-slate-400">
              Connect your mobile app directly to <code className="text-cyan-300">/api/webhook.php</code> on InfinityFree
            </p>
          </div>

          <div className="flex gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            {(['kotlin', 'swift', 'nodejs'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTabCode(tab)}
                className={`px-3 py-1 rounded-lg font-mono font-bold capitalize transition cursor-pointer ${
                  activeTabCode === tab ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab === 'kotlin' ? 'Android (Kotlin)' : tab === 'swift' ? 'iOS (Swift)' : 'Node.js'}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <pre className="p-4 bg-slate-950 border border-slate-800 rounded-2xl overflow-x-auto text-xs font-mono text-cyan-300/90 leading-relaxed">
            {codeSnippets[activeTabCode]}
          </pre>
        </div>
      </div>

      {/* Free Database Backup & Restore */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">
              JSON Backup & Local Snapshot
            </h3>
            <p className="text-xs text-slate-400">
              Download or restore a full JSON snapshot anytime alongside your InfinityFree MySQL database.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-2 items-center">
          <button
            onClick={exportDatabaseJSON}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center gap-2 border border-slate-700 cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export Database JSON</span>
          </button>

          <label className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center gap-2 border border-slate-700 cursor-pointer">
            <Upload className="w-4 h-4 text-amber-400" />
            <span>Import Database JSON</span>
            <input type="file" accept=".json" onChange={handleFileImport} className="hidden" />
          </label>

          {!confirmReset ? (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="px-4 py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-950/70 text-rose-300 text-xs font-semibold transition border border-rose-800/50 cursor-pointer ml-auto"
            >
              Reset Database
            </button>
          ) : (
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs text-rose-300">Confirm reset?</span>
              <button
                type="button"
                onClick={() => {
                  resetAllData();
                  setConfirmReset(false);
                  setStatusNotice({ type: 'success', text: 'Database reset to default initial state.' });
                }}
                className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer"
              >
                Yes, Reset
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="px-3 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
