# Graph Report - hack  (2026-09-24)

## Corpus Check
- 164 files · ~153,429 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 4, .css 2, .example 1)

## Summary
- 3295 nodes · 11237 edges · 160 communities (114 shown, 46 thin omitted)
- Extraction: 87% EXTRACTED · 13% INFERRED · 0% AMBIGUOUS · INFERRED: 1477 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `acf59b78`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- surfaces.py
- client.py
- test_phones.py
- Brand
- api.py
- index-hFdOWHvX.js
- backend_helpline_watch_static_assets_index_dcbpomyh_ar
- Pages.tsx
- helpline-watch
- react-force-graph-3d-CiW46k8W.js
- sweep.py
- package.json
- t
- constructor
- n
- o
- get
- constructor
- push
- make_synthetic_fixtures.py
- g
- Ld
- l
- getUniforms
- UI-SPEC.md
- compilerOptions
- update
- compilerOptions
- t
- Product
- buildCode
- reset
- Helpline Watch
- test_surfaces_and_classify.py
- createRenderPipeline
- DESIGN.md
- _fromTexture
- clear
- .oxlintrc.json
- e
- ADR 0002 — Deterministic signals; no LLM in the verdict path
- ADR 0003 — Read tools free, the takedown pack is gated by a person
- ADR 0004 — One Python process serves the built React UI
- React + TypeScript + Vite
- tsconfig.json
- AGENTS.md
- CLAUDE.md
- demo-script.md
- gf
- cc
- applyMatrix4
- A
- clone
- $r
- ap
- types.ts
- copy
- init
- generate
- subVectors
- generateNodeType
- _renderScene
- build
- dot
- Xa
- getDataFromNode
- App.tsx
- Ag
- draw
- setup
- yf
- lookAt
- add
- F
- bindTexture
- setMaterial
- wa
- cs
- fx
- getNodeProperties
- createTexture
- getPoint
- dependencies
- getNodeBuilderState
- updateBefore
- bind
- getForCompute
- setHSL
- City
- generatePBO
- updateMatrix
- updateWorldMatrix
- setupOutput
- devDependencies
- FP
- addToStack
- dz
- bindFramebuffer
- setupVariants
- interpolate_
- getParameter
- setupLighting
- kl
- applyQuaternion
- cross
- wo
- _createAttribute
- element
- go
- getIndex
- mz
- _addPointer
- generateArray
- onUpdate
- addType
- _copyCompressedBufferToTexture
- wu
- getSpotAttenuation
- getTimestamp
- V_
- ac
- af
- au
- byteLength
- createNode
- jd
- df
- ff
- fromMaterial
- gc
- getColorBufferType
- getDynamicCacheKey
- getStructTypeFromNode
- _getShaderErrors
- _getShadowNodes
- iu
- jc
- Jo
- Kp
- kz
- _removePointer
- Tu
- setAccess
- setAtomic
- vL
- backend_helpline_watch_static_assets_index_dcbpomyh_cr
- backend_helpline_watch_static_assets_index_dcbpomyh_et
- backend_helpline_watch_static_assets_index_dcbpomyh_in
- backend_helpline_watch_static_assets_index_dcbpomyh_kn
- backend_helpline_watch_static_assets_index_dcbpomyh_ln
- backend_helpline_watch_static_assets_index_dcbpomyh_or
- backend_helpline_watch_static_assets_index_dcbpomyh_q
- backend_helpline_watch_static_assets_index_dcbpomyh_qn
- backend_helpline_watch_static_assets_index_dcbpomyh_yn
- backend_helpline_watch_static_assets_index_dcbpomyh_zn
- bf
- getTimestampFrames

## God Nodes (most connected - your core abstractions)
1. `get()` - 211 edges
2. `push()` - 149 edges
3. `constructor()` - 128 edges
4. `t()` - 119 edges
5. `n()` - 115 edges
6. `generate()` - 96 edges
7. `t()` - 90 edges
8. `o()` - 89 edges
9. `update()` - 87 edges
10. `setup()` - 87 edges

## Surprising Connections (you probably didn't know these)
- `Meaningful SerpApi usage` --references--> `ll()`  [INFERRED]
  README.md → backend/helpline_watch/static/assets/index-hFdOWHvX.js
- `Decision` --references--> `CallBudget`  [INFERRED]
  docs/adr/0001-thin-serpapi-client-with-record-replay.md → backend/helpline_watch/serp/client.py
- `main()` --uses--> `Services`  [INFERRED]
  scripts/validate.py → backend/helpline_watch/api.py
- `run_sweep()` --uses--> `Services`  [INFERRED]
  scripts/validate.py → backend/helpline_watch/api.py
- `summarise()` --uses--> `Sweep`  [INFERRED]
  backend/helpline_watch/sweep.py → backend/helpline_watch/models.py

## Import Cycles
- None detected.

## Communities (160 total, 46 thin omitted)

### Community 0 - "surfaces.py"
Cohesion: 0.11
Nodes (40): _as_list(), _dicts(), _int(), _item(), _joined(), _listing(), _matches_brand(), _num() (+32 more)

### Community 1 - "client.py"
Cohesion: 0.09
Nodes (27): AsyncClient, BudgetExceeded, CallBudget, fixture_key(), FixtureMissing, Any, Path, Thin SerpApi client with three modes. live → HTTPS call to serpapi.com,… (+19 more)

### Community 2 - "test_phones.py"
Cohesion: 0.09
Nodes (44): _classify(), digit_distance(), display(), extract(), _grouped_like_landline(), _guess_kind(), is_transposition(), normalise() (+36 more)

### Community 3 - "Brand"
Cohesion: 0.10
Nodes (28): Brand, Finding, Domain model. Everything the pipeline passes around is one of these., Sweep, Path, SQLite persistence: sweeps, the cross-brand observation index, and analyst-…, Numbers ↔ brands graph across the latest sweep of every brand., Other brands each number has been seen for, split by that brand's verdict. A… (+20 more)

### Community 4 - "api.py"
Cohesion: 0.07
Nodes (30): BrandIn, _count_fixtures(), create_app(), cities(), get_sweep(), health(), pack(), stream() (+22 more)

### Community 5 - "index-hFdOWHvX.js"
Cohesion: 0.01
Nodes (107): ab(), after(), al(), before(), Cg(), clearViewOffset(), convertLinearToSRGB(), convertSRGBToLinear() (+99 more)

### Community 7 - "Pages.tsx"
Cohesion: 0.12
Nodes (24): Evidence(), HUE, Props, Filter, FindingsPanel(), Mark(), Page(), pageLabel() (+16 more)

### Community 12 - "react-force-graph-3d-CiW46k8W.js"
Cohesion: 0.01
Nodes (71): backend_helpline_watch_static_assets_index_hfdowhvx_ar, backend_helpline_watch_static_assets_index_hfdowhvx_cr, backend_helpline_watch_static_assets_index_hfdowhvx_et, backend_helpline_watch_static_assets_index_hfdowhvx_in, backend_helpline_watch_static_assets_index_hfdowhvx_kn, backend_helpline_watch_static_assets_index_hfdowhvx_ln, backend_helpline_watch_static_assets_index_hfdowhvx_or, backend_helpline_watch_static_assets_index_hfdowhvx_q (+63 more)

### Community 13 - "sweep.py"
Cohesion: 0.14
Nodes (23): City, CityCoverage, SweepEvent, ads_params(), autocomplete_call(), build_plan(), choose_queries(), maps_params() (+15 more)

### Community 14 - "package.json"
Cohesion: 0.07
Nodes (28): name, private, scripts, build, dev, lint, preview, type (+20 more)

### Community 15 - "t"
Cohesion: 0.06
Nodes (107): Aa(), ac(), Ai(), ba(), bc(), Br(), c(), cl() (+99 more)

### Community 16 - "constructor"
Cohesion: 0.06
Nodes (75): A(), addGroup(), ao(), b(), h(), bn(), Bp(), b() (+67 more)

### Community 17 - "n"
Cohesion: 0.06
Nodes (78): a(), a(), ad(), o(), i(), Ar(), c(), l() (+70 more)

### Community 18 - "o"
Cohesion: 0.07
Nodes (77): addEventListener(), am(), an(), ap(), bo(), ca(), s(), cm() (+69 more)

### Community 19 - "get"
Cohesion: 0.05
Nodes (73): aa(), i(), n(), r(), t(), bi(), n(), createComputePipeline() (+65 more)

### Community 20 - "constructor"
Cohesion: 0.05
Nodes (68): addClass(), addLight(), ao(), a(), c(), f(), g(), l() (+60 more)

### Community 21 - "push"
Cohesion: 0.05
Nodes (61): Dh(), d(), f(), addBundle(), ba(), c(), l(), o() (+53 more)

### Community 22 - "make_synthetic_fixtures.py"
Cohesion: 0.06
Nodes (56): asyncio, Services, brands(), eval(), Path, `helpline-watch` command line: serve the UI, run or record sweeps, print the…, Replay all seed brands and print the proof table (the numbers the README…, Start the API and UI on one port. (+48 more)

### Community 23 - "g"
Cohesion: 0.05
Nodes (57): hn(), hx(), Pg(), r(), createCylinderLayer(), createQuadLayer(), er(), g() (+49 more)

### Community 24 - "Ld"
Cohesion: 0.07
Nodes (51): af(), as(), Bd(), Bi(), cf(), dd(), df(), Do() (+43 more)

### Community 25 - "l"
Cohesion: 0.06
Nodes (40): Ng(), al(), cl(), el(), getAttribute(), hi(), il(), ae() (+32 more)

### Community 26 - "getUniforms"
Cohesion: 0.06
Nodes (47): addUniform(), _convertAddressMode(), _convertFilterMode(), _convertMipmapFilterMode(), _createLayoutEntries(), destroySampler(), generateFilteredTexture(), generateSnippet() (+39 more)

### Community 27 - "UI-SPEC.md"
Cohesion: 0.15
Nodes (12): 0. Idea brief, 10. Don'ts, 11. Acceptance, 1. Demo script (≤ 3:00), 2. Screen inventory, 3. Flow map, 4. Screens, 5. Components (+4 more)

### Community 28 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+11 more)

### Community 29 - "update"
Cohesion: 0.05
Nodes (46): Tp(), Ak(), _checkDistances(), _clampDistance(), clearUpdateRanges(), re(), dollyIn(), dollyOut() (+38 more)

### Community 30 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+8 more)

### Community 31 - "t"
Cohesion: 0.08
Nodes (45): Jr(), Ur(), addInclude(), ai(), bu(), buildFunctionCode(), buildFunctionNode(), call() (+37 more)

### Community 32 - "Product"
Cohesion: 0.18
Nodes (10): Accessibility, Capabilities, Constraints, Open decisions, Platform, Positioning, Product, Product Purpose (+2 more)

### Community 33 - "buildCode"
Cohesion: 0.09
Nodes (41): addUniformUpdateRange(), buildCode(), enableClipDistances(), enableDirective(), enableDualSourceBlending(), enableHardwareClipping(), enableShaderF16(), enableSubgroupsF16() (+33 more)

### Community 34 - "reset"
Cohesion: 0.08
Nodes (41): allocateQueriesForContext(), beginCompute(), beginQuery(), beginRender(), clearColor(), clearDepth(), clearStencil(), _completeCompile() (+33 more)

### Community 35 - "Helpline Watch"
Cohesion: 0.14
Nodes (13): AI disclosure, Demo video, Go live, Helpline Watch, How it works, License, Limitations, Meaningful SerpApi usage (+5 more)

### Community 36 - "test_surfaces_and_classify.py"
Cohesion: 0.14
Nodes (35): apply_reverse(), classify(), _helpline_context(), merge_analyst_state(), official_norms(), Signals → verdict. Deterministic; every point on the score has a named reason.…, Fold reverse-lookup evidence into a finding and re-score it., Re-classification must not erase what the analyst and the reverse lookups… (+27 more)

### Community 37 - "createRenderPipeline"
Cohesion: 0.07
Nodes (41): createBundleEncoder(), _createNodeBuilderState(), createProgram(), createRenderPipeline(), getAttributesArray(), _getBindGroup(), getBindingGroup(), getBindings() (+33 more)

### Community 38 - "DESIGN.md"
Cohesion: 0.22
Nodes (8): Colors, Components, Do's and Don'ts, Elevation & Depth, Layout, Overview, Shapes, Typography

### Community 39 - "_fromTexture"
Cohesion: 0.08
Nodes (39): Mr(), Nr(), Pr(), Sr(), Tr(), _allocateTarget(), _allocateTargets(), _applyGGXFilter() (+31 more)

### Community 40 - "clear"
Cohesion: 0.08
Nodes (38): AE(), clear(), clearColorAsync(), clearDepthAsync(), clearStencilAsync(), Ot(), DE(), eE() (+30 more)

### Community 41 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 42 - "e"
Cohesion: 0.08
Nodes (37): Ae(), be(), bl(), ce(), i(), create(), Eo(), filter() (+29 more)

### Community 43 - "ADR 0002 — Deterministic signals; no LLM in the verdict path"
Cohesion: 0.40
Nodes (4): ADR 0002 — Deterministic signals; no LLM in the verdict path, Consequences, Context, Decision

### Community 44 - "ADR 0003 — Read tools free, the takedown pack is gated by a person"
Cohesion: 0.40
Nodes (4): ADR 0003 — Read tools free, the takedown pack is gated by a person, Consequences, Context, Decision

### Community 45 - "ADR 0004 — One Python process serves the built React UI"
Cohesion: 0.40
Nodes (4): ADR 0004 — One Python process serves the built React UI, Consequences, Context, Decision

### Community 46 - "React + TypeScript + Vite"
Cohesion: 0.50
Nodes (3): Expanding the Oxlint configuration, React Compiler, React + TypeScript + Vite

### Community 51 - "gf"
Cohesion: 0.11
Nodes (36): abort(), bm(), bu(), Cu(), eu(), Fd(), Fu(), gf() (+28 more)

### Community 52 - "cc"
Cohesion: 0.10
Nodes (35): Bh(), bs(), cc(), Ch(), Ci(), dc(), fc(), ft() (+27 more)

### Community 53 - "applyMatrix4"
Cohesion: 0.11
Nodes (34): applyMatrix3(), applyMatrix4(), applyNormalMatrix(), Cb(), computeFrenetFrames(), _computeIntersections(), computeLineDistances(), computeVertexNormals() (+26 more)

### Community 54 - "A"
Cohesion: 0.09
Nodes (28): Jh(), Mn(), Mt(), Ne(), Nt(), Pe(), getContext(), getInternalFormat() (+20 more)

### Community 55 - "clone"
Cohesion: 0.09
Nodes (33): bias(), clone(), compare(), createCubeRenderTarget(), createRenderTarget(), depth(), directRectArea(), equals() (+25 more)

### Community 56 - "$r"
Cohesion: 0.09
Nodes (22): getNode(), w(), $r(), b(), C(), D(), E(), g() (+14 more)

### Community 57 - "ap"
Cohesion: 0.10
Nodes (31): ap(), BN(), cp(), _customWheelEvent(), deserialize(), FN(), _getMouseOnCircle(), _getMouseOnScreen() (+23 more)

### Community 58 - "types.ts"
Cohesion: 0.11
Nodes (26): Workspace(), LogList(), api, json(), openSweepStream(), StreamHandlers, Advertiser, CallState (+18 more)

### Community 59 - "copy"
Cohesion: 0.09
Nodes (30): addScaledSH(), addScaledVector(), at(), clampLength(), clone(), coplanarPoint(), copy(), divideScalar() (+22 more)

### Community 60 - "init"
Cohesion: 0.08
Nodes (30): fh(), ambientOcclusion(), clearAsync(), computeMultiscattering(), yt(), getAnimationLoop(), getFoveation(), getFramebufferScaleFactor() (+22 more)

### Community 61 - "generate"
Cohesion: 0.09
Nodes (30): addFlowCode(), addFlowTab(), enableSubGroups(), generate(), getBuiltin(), getCode(), getDrawIndex(), getFragCoord() (+22 more)

### Community 62 - "subVectors"
Cohesion: 0.12
Nodes (29): addVectors(), center(), closestPointToPoint(), computeBoundingBox(), computeBoundingSphere(), distanceToSquared(), expandByObject(), expandByPoint() (+21 more)

### Community 63 - "generateNodeType"
Cohesion: 0.12
Nodes (26): addSubBuild(), changeComponentType(), format(), generateConst(), generateNodeType(), generateStruct(), getAttributeData(), getBitcastMethod() (+18 more)

### Community 64 - "_renderScene"
Cohesion: 0.13
Nodes (24): rn(), tn(), begin(), _bundleNeedsUpdate(), compileAsync(), st(), xt(), _getFrameBufferTarget() (+16 more)

### Community 65 - "build"
Cohesion: 0.14
Nodes (23): addChain(), addFlow(), addSequentialNode(), build(), buildAsync(), buildUpdateNodes(), flowBuildStage(), flowChildNode() (+15 more)

### Community 66 - "dot"
Cohesion: 0.13
Nodes (22): angleTo(), clamp(), clampPoint(), distanceSqToPoint(), distanceToPlane(), distanceToPoint(), distanceToSphere(), dot() (+14 more)

### Community 67 - "Xa"
Cohesion: 0.25
Nodes (22): activeTexture(), convert(), Xa(), Ae(), Ce(), De(), Ee(), i() (+14 more)

### Community 68 - "getDataFromNode"
Cohesion: 0.13
Nodes (22): addFlowCodeHierarchy(), addLineFlowCode(), addLineFlowCodeBlock(), addNode(), getAttributeName(), getBufferAttributeFromNode(), getCodeFromNode(), getData() (+14 more)

### Community 69 - "App.tsx"
Cohesion: 0.15
Nodes (16): App(), FORCED, params, Tab, AppBar(), Props, Hero(), Kit() (+8 more)

### Community 70 - "Ag"
Cohesion: 0.15
Nodes (21): Ag(), _onChangeCallback(), order(), qv(), reorder(), set(), setColorName(), setComponent() (+13 more)

### Community 71 - "draw"
Cohesion: 0.12
Nodes (21): bindBufferBase(), _bindUniforms(), compute(), computeAsync(), _createVao(), draw(), flipY(), getIndirect() (+13 more)

### Community 72 - "setup"
Cohesion: 0.11
Nodes (21): getCache(), getCacheFromNode(), getColor(), getFloat(), _getPMREMNodeCache(), getTexture(), getToneMappingFunction(), getTransformedUV() (+13 more)

### Community 73 - "yf"
Cohesion: 0.15
Nodes (20): bf(), er(), every(), fn(), t(), gr(), hr(), jn() (+12 more)

### Community 74 - "lookAt"
Cohesion: 0.16
Nodes (19): decompose(), determinantAffine(), extractBasis(), extractRotation(), fromArray(), fromJSON(), getWorldPosition(), identity() (+11 more)

### Community 75 - "add"
Cohesion: 0.15
Nodes (18): add(), attach(), bt(), o(), clear(), connect(), disconnect(), dispatchEvent() (+10 more)

### Community 76 - "F"
Cohesion: 0.12
Nodes (18): F(), wn(), ut(), _getBlendFactor(), _getBlending(), _getBlendOperation(), getDefaultUV(), r() (+10 more)

### Community 77 - "bindTexture"
Cohesion: 0.20
Nodes (18): bindTexture(), copyBufferToTexture(), copyFramebufferToTexture(), copyTextureToBuffer(), copyTextureToTexture(), finish(), _finishArrayCameraBundleEncoders(), finishBundle() (+10 more)

### Community 78 - "setMaterial"
Cohesion: 0.18
Nodes (18): disable(), enable(), setBlending(), setColorMask(), setCullFace(), setDepthFunc(), setDepthMask(), setDepthTest() (+10 more)

### Community 79 - "wa"
Cohesion: 0.13
Nodes (13): ca(), ea(), fa(), ga(), ia(), ma(), oa(), pa() (+5 more)

### Community 80 - "cs"
Cohesion: 0.17
Nodes (15): cs(), fs(), gn(), gs(), ls(), ms(), no(), os() (+7 more)

### Community 81 - "fx"
Cohesion: 0.14
Nodes (15): Dp(), fx(), xm(), Ax(), Bx(), getUniformBufferLimit(), Gw(), isFlipY() (+7 more)

### Community 82 - "getNodeProperties"
Cohesion: 0.17
Nodes (15): addContext(), analyze(), getClosestSubBuild(), getElementType(), getLightCoord(), getMemberType(), getNodeProperties(), getOutputNode() (+7 more)

### Community 83 - "createTexture"
Cohesion: 0.20
Nodes (15): _copyCubeMapToTexture(), _copyImageToTexture(), createDefaultTexture(), createTexture(), _getDefaultCubeTextureGPU(), _getDefaultTextureGPU(), _getDimension(), getGLTextureType() (+7 more)

### Community 84 - "getPoint"
Cohesion: 0.18
Nodes (14): getLength(), getLengths(), getPoint(), getPointAt(), getPoints(), getSpacedPoints(), getTangent(), getTangentAt() (+6 more)

### Community 85 - "dependencies"
Cohesion: 0.14
Nodes (14): dependencies, cobe, d3-force, motion, @phosphor-icons/react, @radix-ui/themes, react, react-dom (+6 more)

### Community 86 - "getNodeBuilderState"
Cohesion: 0.18
Nodes (14): Pn(), getMonitor(), getNodeBuilderState(), getNodeFrame(), getNodeFrameForRender(), getUpdateType(), hardwareClippingPlanes(), updateAfter() (+6 more)

### Community 87 - "updateBefore"
Cohesion: 0.19
Nodes (13): getCanvasTarget(), _getDefaultRenderPassDescriptor(), _getMaps(), getTextureForReference(), getUpdateAfterType(), getUpdateBeforeType(), updateAfterNode(), updateBefore() (+5 more)

### Community 88 - "bind"
Cohesion: 0.20
Nodes (12): bind(), Du(), findNode(), getValue(), _getValue_unbound(), If(), jf(), Ou() (+4 more)

### Community 89 - "getForCompute"
Cohesion: 0.23
Nodes (12): compileComputeAsync(), deleteForCompute(), deleteForRender(), _destroyBindings(), _getComputeCacheKey(), _getComputePipeline(), getForCompute(), getForComputeAsync() (+4 more)

### Community 90 - "setHSL"
Cohesion: 0.20
Nodes (11): fv(), getHSL(), Gg(), Hg(), kg(), lerpHSL(), offsetHSL(), qg() (+3 more)

### Community 91 - "City"
Cohesion: 0.33
Nodes (10): Props, focus(), Globe(), GlobeMarker, parseLL(), Props, City, Diff (+2 more)

### Community 92 - "generatePBO"
Cohesion: 0.20
Nodes (11): generatePBO(), generateTextureLoad(), getArrayCount(), getPropertyName(), getTransforms(), getVarFromNode(), increaseUsage(), isContextAssign() (+3 more)

### Community 93 - "updateMatrix"
Cohesion: 0.27
Nodes (10): addScalar(), multiply(), multiplyMatrices(), multiplyQuaternions(), premultiply(), setComponents(), setFromArrayCamera(), setFromProjectionMatrix() (+2 more)

### Community 94 - "updateWorldMatrix"
Cohesion: 0.22
Nodes (10): conjugate(), getNormalMatrix(), getWorldQuaternion(), getWorldScale(), invert(), localToWorld(), setFromMatrix4(), transpose() (+2 more)

### Community 95 - "setupOutput"
Cohesion: 0.24
Nodes (10): gm(), tm(), addStack(), removeStack(), setupFog(), setupOutput(), setupPosition(), setupPremultipliedAlpha() (+2 more)

### Community 96 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, oxlint, playwright, @types/node, @types/react, @types/react-dom, @types/three, typescript (+2 more)

### Community 97 - "FP"
Cohesion: 0.27
Nodes (10): bP(), FP(), _getContainerDimensions(), gP(), _P(), _updateMovementVector(), _updateRotationVector(), xP() (+2 more)

### Community 98 - "addToStack"
Cohesion: 0.25
Nodes (9): addToStack(), addToStackBefore(), Case(), ElseIf(), If(), lm(), setupClipping(), ym() (+1 more)

### Community 99 - "dz"
Cohesion: 0.25
Nodes (9): az(), dz(), fz(), hz(), iz(), lz(), rz(), sz() (+1 more)

### Community 100 - "bindFramebuffer"
Cohesion: 0.28
Nodes (9): bindFramebuffer(), drawBuffers(), initRenderTarget(), _resolveRenderTarget(), _setFramebuffer(), _useMultisampledExtension(), _e(), ge() (+1 more)

### Community 101 - "setupVariants"
Cohesion: 0.29
Nodes (8): ah(), oh(), sh(), context(), Default(), Else(), setupSpecular(), setupVariants()

### Community 102 - "interpolate_"
Cohesion: 0.32
Nodes (8): Bx(), copySampleValue_(), evaluate(), getSettings_(), interpolate_(), intervalChanged_(), Rx(), slerpFlat()

### Community 103 - "getParameter"
Cohesion: 0.43
Nodes (6): getParameter(), rr(), a(), o(), s(), Re()

### Community 104 - "setupLighting"
Cohesion: 0.29
Nodes (7): getScope(), setupEnvironment(), setupLighting(), setupLightingModel(), setupLightMap(), setupMaterialLightings(), setupOutgoingLight()

### Community 105 - "kl"
Cohesion: 0.29
Nodes (7): jl(), kl(), Ll(), Ql(), Ul(), Wl(), zl()

### Community 106 - "applyQuaternion"
Cohesion: 0.33
Nodes (6): applyAxisAngle(), applyEuler(), applyQuaternion(), compose(), makeRotationFromQuaternion(), setFromAxisAngle()

### Community 107 - "cross"
Cohesion: 0.33
Nodes (6): cross(), crossVectors(), getArea(), getPlane(), setFromCoplanarPoints(), setFromNormalAndCoplanarPoint()

### Community 108 - "wo"
Cohesion: 0.33
Nodes (6): Co(), po(), qo(), _updatePointer(), _updateState(), wo()

### Community 109 - "_createAttribute"
Cohesion: 0.33
Nodes (6): _createAttribute(), _createBuffer(), createIndexAttribute(), createIndirectStorageAttribute(), createStorageAttribute(), _getAttributeMemorySize()

### Community 110 - "element"
Cohesion: 0.33
Nodes (6): element(), getClipDistance(), setupAlphaToCoverage(), setupDefault(), setupHardwareClipping(), zx()

### Community 111 - "go"
Cohesion: 0.40
Nodes (5): bo(), go(), ho(), vo(), xo()

### Community 112 - "getIndex"
Cohesion: 0.60
Nodes (5): getDrawParameters(), getIndex(), HT(), UT(), VT()

### Community 113 - "mz"
Cohesion: 0.40
Nodes (5): jz(), mz(), oz(), pz(), wz()

### Community 114 - "_addPointer"
Cohesion: 0.50
Nodes (4): _addPointer(), eP(), _isTrackingPointer(), kN()

### Community 115 - "generateArray"
Cohesion: 0.50
Nodes (4): generateArray(), generateArrayDeclaration(), getVar(), getVars()

### Community 116 - "onUpdate"
Cohesion: 0.50
Nodes (4): onFrameUpdate(), onObjectUpdate(), onUpdate(), updateBuffer()

### Community 117 - "addType"
Cohesion: 0.67
Nodes (3): addMaterial(), addToneMapping(), addType()

### Community 118 - "_copyCompressedBufferToTexture"
Cohesion: 0.67
Nodes (3): _copyCompressedBufferToTexture(), _getBlockData(), tM()

### Community 119 - "wu"
Cohesion: 0.67
Nodes (3): Du(), ku(), wu()

### Community 120 - "getSpotAttenuation"
Cohesion: 0.67
Nodes (3): getLightVector(), getSpotAttenuation(), setupDirect()

### Community 121 - "getTimestamp"
Cohesion: 0.67
Nodes (3): _getQueryPool(), getTimestamp(), hasTimestampQuery()

### Community 122 - "V_"
Cohesion: 0.67
Nodes (3): setInstanced(), setUsage(), V_()

## Knowledge Gaps
- **151 isolated node(s):** `helpline-watch`, `$schema`, `plugins`, `react/rules-of-hooks`, `react/only-export-components` (+146 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 651 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **46 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `constructor()` connect `constructor` to `getDynamicCacheKey`, `react-force-graph-3d-CiW46k8W.js`, `t`, `constructor`, `n`, `o`, `get`, `push`, `g`, `Ld`, `l`, `update`, `t`, `reset`, `clear`, `e`, `cc`, `A`, `clone`, `$r`, `ap`, `init`, `_renderScene`, `Xa`, `add`, `F`, `cs`, `getNodeProperties`, `getNodeBuilderState`, `addToStack`, `bindFramebuffer`, `_createAttribute`, `addType`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Why does `n()` connect `t` to `index-hFdOWHvX.js`, `Ag`, `yf`, `e`, `lookAt`, `F`, `react-force-graph-3d-CiW46k8W.js`, `constructor`, `cs`, `o`, `gf`, `cc`, `bind`, `Ld`, `copy`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **Why does `oo()` connect `g` to `index-hFdOWHvX.js`, `Ag`, `getParameter`, `draw`, `react-force-graph-3d-CiW46k8W.js`, `constructor`, `n`, `constructor`, `push`, `A`, `l`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **Are the 7 inferred relationships involving `get()` (e.g. with `o()` and `i()`) actually correct?**
  _`get()` has 7 INFERRED edges - model-reasoned connections that need verification._
- **Are the 23 inferred relationships involving `constructor()` (e.g. with `hn()` and `lt()`) actually correct?**
  _`constructor()` has 23 INFERRED edges - model-reasoned connections that need verification._
- **Are the 84 inferred relationships involving `t()` (e.g. with `ac()` and `Ai()`) actually correct?**
  _`t()` has 84 INFERRED edges - model-reasoned connections that need verification._
- **Are the 82 inferred relationships involving `n()` (e.g. with `ac()` and `Ai()`) actually correct?**
  _`n()` has 82 INFERRED edges - model-reasoned connections that need verification._