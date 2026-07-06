# Graph Report - citypulse  (2026-07-06)

## Corpus Check
- 86 files · ~150,731 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1054 nodes · 2002 edges · 69 communities (65 shown, 4 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 56 edges (avg confidence: 0.6)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a7000251`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Backend API & Server|Backend API & Server]]
- [[_COMMUNITY_Frontend React Components|Frontend React Components]]
- [[_COMMUNITY_Frontend App Assets|Frontend App Assets]]
- [[_COMMUNITY_Backend Config|Backend Config]]
- [[_COMMUNITY_Frontend Config|Frontend Config]]
- [[_COMMUNITY_Root Workspace Config|Root Workspace Config]]
- [[_COMMUNITY_Frontend Build Config|Frontend Build Config]]
- [[_COMMUNITY_Backend Utility Scripts|Backend Utility Scripts]]
- [[_COMMUNITY_CityPulse → 100100 Winning Roadmap|CityPulse → 100/100 Winning Roadmap]]
- [[_COMMUNITY_gemini.js|gemini.js]]
- [[_COMMUNITY_CityPulse 🏙️|CityPulse 🏙️]]
- [[_COMMUNITY_init_bq.js|init_bq.js]]
- [[_COMMUNITY_Web Interface Guidelines|Web Interface Guidelines]]
- [[_COMMUNITY_Web Interface Guidelines|Web Interface Guidelines]]
- [[_COMMUNITY_AGENTS|AGENTS.md]]
- [[_COMMUNITY_CLAUDE|CLAUDE.md]]
- [[_COMMUNITY_graphify|graphify.md]]
- [[_COMMUNITY_graphify|graphify.md]]
- [[_COMMUNITY_actions.js|actions.js]]
- [[_COMMUNITY_generate_incidents.js|generate_incidents.js]]
- [[_COMMUNITY_forecast.js|forecast.js]]
- [[_COMMUNITY_generate_environment.js|generate_environment.js]]
- [[_COMMUNITY_App|App]]
- [[_COMMUNITY_server_CZdgb9a8.mjs|server_CZdgb9a8.mjs]]
- [[_COMMUNITY__@astrojs-ssr-adapter_xtIFlGZV.mjs|_@astrojs-ssr-adapter_xtIFlGZV.mjs]]
- [[_COMMUNITY_index_BAPvq1xm.mjs|index_BAPvq1xm.mjs]]
- [[_COMMUNITY_astro-designed-error-pages_NJ0JctVG.mjs|astro-designed-error-pages_NJ0JctVG.mjs]]
- [[_COMMUNITY_index.astro.mjs|index.astro.mjs]]
- [[_COMMUNITY_AstroCookies|AstroCookies]]
- [[_COMMUNITY_query.js|query.js]]
- [[_COMMUNITY_generic_CDjtPFrw.mjs|generic_CDjtPFrw.mjs]]
- [[_COMMUNITY_firestore.js|firestore.js]]
- [[_COMMUNITY_.render|.render]]
- [[_COMMUNITY_renderComponent|renderComponent]]
- [[_COMMUNITY_markHTMLString|markHTMLString]]
- [[_COMMUNITY_getProps|getProps]]
- [[_COMMUNITY_renderChild|renderChild]]
- [[_COMMUNITY_renderComponentToString|renderComponentToString]]
- [[_COMMUNITY_.getIslandContent|.getIslandContent]]
- [[_COMMUNITY_createI18nMiddleware|createI18nMiddleware]]
- [[_COMMUNITY_renderFrameworkComponent|renderFrameworkComponent]]
- [[_COMMUNITY_joinPaths|joinPaths]]
- [[_COMMUNITY_createAssetLink|createAssetLink]]
- [[_COMMUNITY_createOriginCheckMiddleware|createOriginCheckMiddleware]]
- [[_COMMUNITY_.createRequest|.createRequest]]
- [[_COMMUNITY_db.js|db.js]]
- [[_COMMUNITY_getImage$1|getImage$1]]
- [[_COMMUNITY_getView|getView]]
- [[_COMMUNITY_get|get]]
- [[_COMMUNITY_verifyOptions|verifyOptions]]
- [[_COMMUNITY_sharp_Dr5fsOm3.mjs|sharp_Dr5fsOm3.mjs]]
- [[_COMMUNITY_GET|GET]]
- [[_COMMUNITY_inferRemoteSize|inferRemoteSize]]
- [[_COMMUNITY_readUInt|readUInt]]
- [[_COMMUNITY_matchPattern|matchPattern]]
- [[_COMMUNITY_isRoute404or500|isRoute404or500]]
- [[_COMMUNITY_toUTF8String|toUTF8String]]
- [[_COMMUNITY_init_firestore.js|init_firestore.js]]
- [[_COMMUNITY_BitReader|BitReader]]
- [[_COMMUNITY_redirectIsExternal|redirectIsExternal]]
- [[_COMMUNITY_extractCodestream|extractCodestream]]
- [[_COMMUNITY_extractOrientation|extractOrientation]]
- [[_COMMUNITY_vercel.json|vercel.json]]
- [[_COMMUNITY_toStyleString|toStyleString]]
- [[_COMMUNITY_parseAttributes|parseAttributes]]
- [[_COMMUNITY_noop-entrypoint.mjs|noop-entrypoint.mjs]]

## God Nodes (most connected - your core abstractions)
1. `App` - 21 edges
2. `renderFrameworkComponent()` - 21 edges
3. `getImage$1()` - 20 edges
4. `markHTMLString()` - 19 edges
5. `AstroSession` - 18 edges
6. `RenderContext` - 15 edges
7. `renderChild()` - 15 edges
8. `renderComponent()` - 14 edges
9. `stringifyChunk()` - 13 edges
10. `🏙️ CityPulse` - 13 edges

## Surprising Connections (you probably didn't know these)
- `getActionContext()` --indirect_call--> `deserializeActionResult()`  [INFERRED]
  frontend/.vercel/output/_functions/chunks/_@astrojs-ssr-adapter_xtIFlGZV.mjs → frontend/.vercel/output/_functions/chunks/astro-designed-error-pages_NJ0JctVG.mjs
- `getActionContext()` --indirect_call--> `serializeActionResult()`  [INFERRED]
  frontend/.vercel/output/_functions/chunks/_@astrojs-ssr-adapter_xtIFlGZV.mjs → frontend/.vercel/output/_functions/chunks/astro-designed-error-pages_NJ0JctVG.mjs
- `serializeActionResult()` --calls--> `stringify()`  [INFERRED]
  frontend/.vercel/output/_functions/chunks/astro-designed-error-pages_NJ0JctVG.mjs → frontend/.vercel/output/_functions/chunks/_@astrojs-ssr-adapter_xtIFlGZV.mjs
- `searchSimilar()` --calls--> `cosineSimilarity()`  [INFERRED]
  backend/lib/vectorStore.js → backend/lib/gemini.js
- `callMiddleware()` --calls--> `onRequest()`  [INFERRED]
  frontend/.vercel/output/_functions/chunks/_@astrojs-ssr-adapter_xtIFlGZV.mjs → frontend/.vercel/output/_functions/_noop-middleware.mjs

## Import Cycles
- 2-file cycle: `frontend/.vercel/output/_functions/chunks/generic_CDjtPFrw.mjs -> frontend/.vercel/output/_functions/chunks/sharp_Dr5fsOm3.mjs -> frontend/.vercel/output/_functions/chunks/generic_CDjtPFrw.mjs`

## Communities (69 total, 4 thin omitted)

### Community 0 - "Backend API & Server"
Cohesion: 0.19
Nodes (7): generateRecommendation(), router, router, router, apiLimiter, app, app

### Community 1 - "Frontend React Components"
Cohesion: 0.10
Nodes (22): ../components/AppBody.jsx, ../components/HeaderActions.jsx, ../styles/global.css, ActionCenter(), AlertsPanel(), AppBody(), CitizenReport(), Dashboard() (+14 more)

### Community 2 - "Frontend App Assets"
Cohesion: 0.06
Nodes (39): react-dom, NOOP_MIDDLEWARE_FN(), decodeKey(), serverEntrypointModule, _args, _exports, _manifest, _page0() (+31 more)

### Community 3 - "Backend Config"
Cohesion: 0.09
Nodes (21): dependencies, cors, dotenv, express, express-rate-limit, @google-cloud/bigquery, @google-cloud/firestore, @google-cloud/vertexai (+13 more)

### Community 4 - "Frontend Config"
Cohesion: 0.07
Nodes (27): ../assets/astro.svg, ../assets/background.svg, dependencies, astro, @astrojs/react, @astrojs/vercel, lucide-react, maplibre-gl (+19 more)

### Community 5 - "Root Workspace Config"
Cohesion: 0.20
Nodes (9): devDependencies, concurrently, name, scripts, dev, dev:backend, dev:frontend, install:all (+1 more)

### Community 6 - "Frontend Build Config"
Cohesion: 0.29
Nodes (6): compilerOptions, jsx, jsxImportSource, exclude, extends, include

### Community 7 - "Backend Utility Scripts"
Cohesion: 0.40
Nodes (4): data, dir, routes, today

### Community 9 - "CityPulse → 100/100 Winning Roadmap"
Cohesion: 0.09
Nodes (22): CityPulse — Implementation Brief for Claude Opus 4.8 / Claude Code, Final self-check before submission (score yourself honestly against this), Phase 0 — Repo orientation (do this first, every session), Phase 1 — Fix the "AI is not real AI" problem (Technical Sophistication, 25 pts), Phase 2 — Fix the "single domain" problem (Alignment, 20 pts + Loop, 20 pts), Phase 3 — Close the loop: add real automation (Decision-Intelligence Loop, 20 pts), Phase 4 — Multimodality & GCP breadth (15 pts), Phase 5 — Role-based views & accessibility (Impact/Demo-ability, 10 pts) (+14 more)

### Community 10 - "gemini.js"
Cohesion: 0.16
Nodes (11): embedCache, embeddingMode(), generateOneLiner(), generateQueryResponse(), getAuthClient(), localEmbed(), useVertex, vertexEmbedBatch() (+3 more)

### Community 11 - "CityPulse 🏙️"
Cohesion: 0.08
Nodes (24): 1. Clone the repository, 2. Install dependencies, 3. Authenticate with Google Cloud (required for Vertex AI / BigQuery), 4. Configure environment variables, 5. Run the application, 6. Open the app, 🏗 Architecture, 🏙️ CityPulse (+16 more)

### Community 12 - "init_bq.js"
Cohesion: 0.27
Nodes (8): accessor(), confidenceFromZ(), detectAnomalies(), detectRateSpikes(), mean(), severityFromZ(), std(), RouteCache

### Community 13 - "Web Interface Guidelines"
Cohesion: 0.40
Nodes (4): Guidelines Source, How It Works, Usage, Web Interface Guidelines

### Community 14 - "Web Interface Guidelines"
Cohesion: 0.40
Nodes (4): Guidelines Source, How It Works, Usage, Web Interface Guidelines

### Community 15 - "AGENTS.md"
Cohesion: 0.50
Nodes (3): Development, Documentation, graphify

### Community 16 - "CLAUDE.md"
Cohesion: 0.50
Nodes (3): Development, Documentation, graphify

### Community 19 - "actions.js"
Cohesion: 0.40
Nodes (5): __dirname, __filename, getMemos(), MEMO_FILE, saveMemo()

### Community 20 - "generate_incidents.js"
Cohesion: 0.22
Nodes (7): DATA_DIR, __dirname, incidents, SEVERITIES, today, TYPES, wards

### Community 21 - "forecast.js"
Cohesion: 0.25
Nodes (16): buildRegressionData(), dot(), fitAdditive(), fitLinear(), fitOLS(), forecastSeries(), forecastSeriesML(), GRID (+8 more)

### Community 22 - "generate_environment.js"
Cohesion: 0.25
Nodes (6): DATA_DIR, __dirname, PROFILE, rows, today, wards

### Community 23 - "App"
Cohesion: 0.07
Nodes (20): ensure404Route(), decryptString(), SessionStorageInitError, SessionStorageSaveError, App, AstroSession, badRequest(), createDefaultRoutes() (+12 more)

### Community 24 - "server_CZdgb9a8.mjs"
Cohesion: 0.05
Nodes (50): ALGORITHM_VALUES, ALGORITHMS, ALLOWED_DIRECTIVES, astroComponentInstanceSym, AstroGlobNoMatch, AstroGlobUsedOutside, baseCreateComponent(), clientAddressSymbol (+42 more)

### Community 25 - "_@astrojs-ssr-adapter_xtIFlGZV.mjs"
Cohesion: 0.05
Nodes (41): AstroResponseHeadersReassigned, ClientAddressNotAvailable, CspNotEnabled, FailedToFindPageMapSSR, GetStaticPathsExpectedParams, GetStaticPathsRequired, LocalsReassigned, MiddlewareNotAResponse (+33 more)

### Community 26 - "index_BAPvq1xm.mjs"
Cohesion: 0.05
Nodes (35): BMP, brandMap, CONSTANTS, CUR, DDS, decoder, extractorRegExps, getImageSize$1() (+27 more)

### Community 27 - "astro-designed-error-pages_NJ0JctVG.mjs"
Cohesion: 0.08
Nodes (20): ACTION_QUERY_PARAMS$1, ActionError, ActionInputError, actionResultErrorStack, codeToStatusMap, default404Instance, default404Page(), DEFAULT_404_ROUTE (+12 more)

### Community 28 - "index.astro.mjs"
Cohesion: 0.11
Nodes (24): react, AstroCookie, ActionCenter(), AlertsPanel(), $$Astro, CitizenReport(), Dashboard(), ExplainabilityPanel() (+16 more)

### Community 29 - "AstroCookies"
Cohesion: 0.09
Nodes (6): AstroCookies, AstroIntegrationLogger, getCookiesFromResponse(), getSetCookiesFromResponse(), identity(), Logger

### Community 30 - "query.js"
Cohesion: 0.15
Nodes (22): getTrafficData(), cosineSimilarity(), embedTexts(), generateEmbeddings(), CACHE_FILE, __dirname, fallbackStore, __filename (+14 more)

### Community 31 - "generic_CDjtPFrw.mjs"
Cohesion: 0.08
Nodes (25): ExpectedNotESMImage, ExperimentalFontsNotEnabled, FontFamilyNotFound, ImageMissingAlt, IncompatibleDescriptorOptions, InvalidImageService, UnsupportedImageConversion, $$Astro (+17 more)

### Community 32 - "firestore.js"
Cohesion: 0.12
Nodes (20): addIncident(), addMemo(), __dirname, fallbackAddIncident(), fallbackAddMemo(), fallbackGetIncidents(), fallbackGetMemos(), fallbackMemos (+12 more)

### Community 33 - ".render"
Cohesion: 0.13
Nodes (12): getActionQueryString(), ForbiddenRewrite, attachCookiesToResponse(), callMiddleware(), copyRequest(), createCallAction(), createGetActionResult(), getParams() (+4 more)

### Community 34 - "renderComponent"
Cohesion: 0.09
Nodes (22): chunkToByteArray(), chunkToByteArrayOrString(), chunkToString(), determineIfNeedsHydrationScript(), determinesIfNeedsDirectiveScript(), isAstroComponentFactory(), isFragmentComponent(), isHTMLComponent() (+14 more)

### Community 35 - "markHTMLString"
Cohesion: 0.14
Nodes (22): addAttribute(), defineScriptVars(), getHTMLElementName(), handleBooleanAttribute(), internalSpreadAttributes(), isCustomElement(), isVNode(), markHTMLString() (+14 more)

### Community 36 - "getProps"
Cohesion: 0.11
Nodes (20): GetStaticPathsInvalidRouteParam, InvalidGetStaticPathsEntry, InvalidGetStaticPathsReturn, NoMatchingStaticPathFound, PageNumberParamNotFound, PrerenderDynamicEndpointPathCollide, addRouteBase(), callGetStaticPaths() (+12 more)

### Community 37 - "renderChild"
Cohesion: 0.17
Nodes (13): BufferedRenderer, createBufferedRenderer(), isAstroComponentInstance(), isHTMLString(), isPromise(), isRenderInstance(), noop(), renderArray() (+5 more)

### Community 38 - "renderComponentToString"
Cohesion: 0.21
Nodes (12): AstroComponentInstance, bufferHeadContent(), callComponentAsTemplateResultOrResponse(), isHeadAndContent(), isRenderTemplateResult(), nonAstroPageNeedsHeadInjection(), OnlyResponseCanBeReturned, renderComponentToString() (+4 more)

### Community 39 - ".getIslandContent"
Cohesion: 0.16
Nodes (10): createRenderInstruction(), createSearchParams(), createThinHead(), encryptString(), generateCspDigest(), isWithinURLLimit(), maybeRenderHead(), renderHead() (+2 more)

### Community 40 - "createI18nMiddleware"
Cohesion: 0.17
Nodes (16): computeCurrentLocale(), computePreferredLocale(), computePreferredLocaleList(), createI18nMiddleware(), getAllCodes(), getPathByLocale(), isRequestServerIsland(), localeHasntDomain() (+8 more)

### Community 41 - "renderFrameworkComponent"
Cohesion: 0.13
Nodes (16): bitwise(), componentIsHTMLElement(), convertToSerializedForm(), extractDirectives(), formatList(), generateHydrateScript(), guessRenderers(), NoClientOnlyHint (+8 more)

### Community 42 - "joinPaths"
Cohesion: 0.21
Nodes (13): findRouteToRewrite(), getActionContext(), getCallerInfo(), redirectToDefaultLocale(), shouldAppendForwardSlash(), appendForwardSlash(), collapseDuplicateTrailingSlashes(), hasFileExtension() (+5 more)

### Community 43 - "createAssetLink"
Cohesion: 0.19
Nodes (9): AppPipeline, createAssetLink(), createModuleScriptElement(), createModuleScriptElementWithSrc(), createStylesheetElement(), createStylesheetElementSet(), getAssetsPrefix(), fileExtension() (+1 more)

### Community 44 - "createOriginCheckMiddleware"
Cohesion: 0.23
Nodes (7): ActionNotFoundError, createOriginCheckMiddleware(), defineMiddleware(), hasFormLikeHeader(), Pipeline, SAFE_METHODS, sequence()

### Community 45 - ".createRequest"
Cohesion: 0.21
Nodes (11): asyncIterableToBodyProps(), getAbortControllerCleanup(), getHostnamePort(), getRequestSocket(), makeRequestBody(), makeRequestHeaders(), matchesAllowedDomains(), parseHost() (+3 more)

### Community 46 - "db.js"
Cohesion: 0.20
Nodes (8): bigquery, DATA_FILE, __dirname, __filename, DATA_FILE, __dirname, __filename, initBQ()

### Community 47 - "getImage$1"
Cohesion: 0.20
Nodes (10): ExpectedImageOptions, createPlaceholderURL(), getImage(), getImage$1(), getSizesAttribute(), getWidths(), isImageMetadata(), isLocalService() (+2 more)

### Community 48 - "getView"
Cohesion: 0.20
Nodes (10): calculateExtended(), calculateLossy(), extractSize(), getView(), readInt16LE(), readInt32LE(), readUInt16BE(), readUInt16LE() (+2 more)

### Community 49 - "get"
Cohesion: 0.22
Nodes (9): containsServerDirective(), createAstroComponentInstance(), get(), getDirectiveScriptText(), getPrescripts(), getPropagationHint(), isAPropagatingComponent(), renderAstroComponent() (+1 more)

### Community 50 - "verifyOptions"
Cohesion: 0.22
Nodes (9): ExpectedImage, LocalImageUsedWrongly, MissingImageDimension, UnsupportedImageFormat, getTargetDimensions(), isESMImportedImage(), isRemoteImage(), VALID_SUPPORTED_FORMATS (+1 more)

### Community 51 - "sharp_Dr5fsOm3.mjs"
Cohesion: 0.25
Nodes (6): MissingSharp, baseService, parseQuality(), fitMap, qualityTable, sharpService

### Community 52 - "GET"
Cohesion: 0.25
Nodes (8): etag(), fnv1a52(), GET(), getConfiguredImageService(), loadRemoteImage(), isRemoteAllowed(), isRemotePath(), matchHostname()

### Community 53 - "inferRemoteSize"
Cohesion: 0.33
Nodes (7): FailedToFetchRemoteImageDimensions, NoImageMetadata, RemoteImageNotAllowed, detector(), imageMetadata(), inferRemoteSize(), lookup()

### Community 54 - "readUInt"
Cohesion: 0.43
Nodes (7): extractTags(), nextTag(), readIFD(), readTagValue(), readUInt(), readUInt64(), validateBigTIFFHeader()

### Community 55 - "matchPattern"
Cohesion: 0.33
Nodes (4): matchPathname(), matchPattern(), matchPort(), matchProtocol()

### Community 56 - "isRoute404or500"
Cohesion: 0.40
Nodes (5): isRoute404(), isRoute404or500(), isRoute500(), isRouteServerIsland(), requestIs404Or500()

### Community 57 - "toUTF8String"
Cohesion: 0.40
Nodes (6): detectType(), determineFormat(), readBox(), readImageHeader(), readUInt32BE(), toUTF8String()

### Community 58 - "init_firestore.js"
Cohesion: 0.40
Nodes (3): __dirname, __filename, INCIDENTS_FILE

### Community 59 - "BitReader"
Cohesion: 0.50
Nodes (3): BitReader, calculateImageDimension(), calculateImageWidth()

### Community 60 - "redirectIsExternal"
Cohesion: 0.67
Nodes (4): isRouteExternalRedirect(), redirectIsExternal(), redirectRouteGenerate(), renderRedirect()

### Community 61 - "extractCodestream"
Cohesion: 0.67
Nodes (4): concatenateCodestreams(), extractCodestream(), extractPartialStreams(), findBox()

### Community 62 - "extractOrientation"
Cohesion: 0.50
Nodes (4): extractOrientation(), isEXIF(), toHexString(), validateExifBlock()

### Community 64 - "toStyleString"
Cohesion: 0.67
Nodes (3): kebab(), toStyleString(), addCSSVarsToStyle()

### Community 65 - "parseAttributes"
Cohesion: 1.00
Nodes (3): parseAttributes(), parseLength(), parseViewbox()

## Knowledge Gaps
- **274 isolated node(s):** `__filename`, `__dirname`, `DATA_FILE`, `__filename`, `__dirname` (+269 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `embedTexts()` connect `query.js` to `gemini.js`, `init_bq.js`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **Why does `WardDetailPanel()` connect `Frontend React Components` to `index.astro.mjs`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **Why does `AstroCookie` connect `index.astro.mjs` to `_@astrojs-ssr-adapter_xtIFlGZV.mjs`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **What connects `__filename`, `__dirname`, `DATA_FILE` to the rest of the system?**
  _274 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Frontend React Components` be split into smaller, more focused modules?**
  _Cohesion score 0.0990990990990991 - nodes in this community are weakly interconnected._
- **Should `Frontend App Assets` be split into smaller, more focused modules?**
  _Cohesion score 0.06207482993197279 - nodes in this community are weakly interconnected._
- **Should `Backend Config` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._