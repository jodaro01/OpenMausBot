/**
 * OpenMausBot Cascading Worker Router
 * Priority 1: Colab Worker 1 (Tailscale: colab-worker-1)
 * Priority 2: Colab Worker 2 (Tailscale: colab-worker-2)
 * Priority 3: Hyperbeam Cloud API (Fallback)
 */

import http from 'node:http';

const COLAB_NODES = [
  { name: 'colab-worker-1', host: 'colab-worker-1', port: 9090 },
  { name: 'colab-worker-2', host: 'colab-worker-2', port: 9090 },
];

const HYPERBEAM_API_KEY = process.env.HYPERBEAM_API_KEY || '';

async function checkNode(node) {
  return new Promise((resolve) => {
    const req = http.get(`http://${node.host}:${node.port}/health`, { timeout: 2500 }, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ ok: true, node, details: parsed });
        } catch {
          resolve({ ok: false, node });
        }
      });
    });
    req.on('error', () => resolve({ ok: false, node }));
    req.on('timeout', () => { req.destroy(); resolve({ ok: false, node }); });
  });
}

export async function getActiveWorker(workerIndex = 1) {
  // 1. Check Primary Colab Nodes
  for (const node of COLAB_NODES) {
    const result = await checkNode(node);
    if (result.ok) {
      const cdpPort = 9221 + workerIndex;
      console.log(`[Router] Routing to ${node.name} (Worker ${workerIndex} on CDP Port ${cdpPort})`);
      return {
        provider: 'colab',
        node: node.name,
        cdpUrl: `http://${node.host}:${cdpPort}`,
        vncUrl: `http://${node.host}:${6080 + workerIndex}`
      };
    }
  }

  // 2. Fallback to Hyperbeam API if Colabs are offline
  console.warn('[Router] All Colab nodes offline. Triggering Hyperbeam Fallback...');
  if (HYPERBEAM_API_KEY) {
    try {
      const res = await fetch('https://api.hyperbeam.com/v0/vm', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${HYPERBEAM_API_KEY}` }
      });
      const data = await res.json();
      return {
        provider: 'hyperbeam',
        sessionId: data.session_id,
        embedUrl: data.embed_url,
        adminToken: data.admin_token
      };
    } catch (e) {
      console.error('[Router] Hyperbeam API error:', e.message);
    }
  }

  return { provider: 'none', error: 'No active Colab workers detected and no Hyperbeam API key set' };
}

// CLI direct test execution
if (process.argv[1]?.endsWith('failover-router.mjs')) {
  getActiveWorker().then((res) => console.log('Router Status:', JSON.stringify(res, null, 2)));
}
