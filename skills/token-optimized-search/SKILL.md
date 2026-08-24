---
name: token-optimized-search
description: 3-Tier ultra token-efficient search & live visual verification for all agents. Saves 90%+ tokens while giving live visual CUA desktop rendering.
---

# 3-Tier Token-Optimized Web Research Workflow

When executing web searches and researching information, ALWAYS follow this 3-tier workflow to maximize performance, save up to 95% token budget, and provide real-time visual streaming in the CUA Desktop:

## Tier 1: Fast API Search (Dense Snippets - ~200 Tokens)
Instead of opening a search engine in a browser and dumping megabytes of DOM into the context window, use the OmniRoute Search API or MCP tool:
- **Endpoint**: `http://100.120.12.123:20301/v1/search`
- **Headers**: `Authorization: Bearer sk-14ef487ca3b809b2-1078fe-892750bf`
- **Providers Available**: `tavily`, `exa`, `brave`, `linkup`
- Returns clean, dense summary snippets and source URLs with minimal token footprint.

## Tier 2: Live CUA Visual Stream (For User Visibility)
When you find the relevant URL:
- Open the URL in the CUA Desktop (Firefox):
  ```bash
  mcp__desktop__desktop_url https://example.com/target-article
  ```
- This instantly renders the webpage on the CUA Desktop, allowing the user to watch your navigation live in the Computer Panel.

## Tier 3: Markdown Extraction via Jina Reader / Firecrawl (Text Extraction)
To read the in-depth content of the page without loading heavy HTML/DOM:
- Fetch clean Markdown via Jina Reader:
  ```bash
  curl -s https://r.jina.ai/https://example.com/target-article
  ```
- Extract the needed answer, synthesize your findings, and respond directly to the user.
