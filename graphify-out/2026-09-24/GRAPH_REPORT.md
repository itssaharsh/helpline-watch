# Graph Report - hack  (2026-09-24)

## Corpus Check
- 164 files · ~153,399 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 4, .css 2, .example 1)

## Summary
- 3284 nodes · 11236 edges · 151 communities (115 shown, 36 thin omitted)
- Extraction: 87% EXTRACTED · 13% INFERRED · 0% AMBIGUOUS · INFERRED: 1477 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `663fee2c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- surfaces.py
- client.py
- test_phones.py
- Brand
- api.py
- index-DCBPOMyH.js
- react-force-graph-3d-blTPDaaA.js
- Pages.tsx
- helpline-watch
- o
- sweep.py
- package.json
- l
- dl
- t
- constructor
- get
- a
- t
- make_synthetic_fixtures.py
- Hc
- a
- L
- e
- UI-SPEC.md
- compilerOptions
- getUniforms
- compilerOptions
- update
- Product
- reset
- _fromTexture
- Helpline Watch
- test_surfaces_and_classify.py
- clone
- DESIGN.md
- A
- n
- .oxlintrc.json
- push
- ADR 0002 — Deterministic signals; no LLM in the verdict path
- ADR 0003 — Read tools free, the takedown pack is gated by a person
- ADR 0004 — One Python process serves the built React UI
- React + TypeScript + Vite
- tsconfig.json
- AGENTS.md
- CLAUDE.md
- demo-script.md
- buildCode
- render
- copy
- il
- ap
- fn
- createRenderPipeline
- types.ts
- F
- e
- generate
- bindTexture
- normalize
- build
- Ag
- _onChangeCallback
- applyMatrix4
- generateNodeType
- App.tsx
- subVectors
- start
- at
- setFromPoints
- setup
- Te
- getDataFromNode
- translate
- draw
- setMaterial
- updateBefore
- dot
- wa
- createTexture
- getProperties
- dependencies
- equals
- generateConst
- getNodeProperties
- getHash
- getForRender
- City
- getForCompute
- getBindings
- updateForRender
- FP
- devDependencies
- addToStack
- dz
- setupVariants
- getParameter
- setupLighting
- kl
- wo
- _createAttribute
- getAttributes
- element
- enableDirective
- getDrawingBufferSize
- indirect
- go
- getPropertyName
- mz
- activeTexture
- _addPointer
- onUpdate
- addType
- _copyCompressedBufferToTexture
- createRenderObject
- wu
- getSpotAttenuation
- getTimestamp
- V_
- ac
- addClass
- af
- al
- au
- byteLength
- createNode
- jd
- df
- ff
- gc
- getColorBufferType
- getDynamicCacheKey
- _getShadowNodes
- initTextureAsync
- iu
- jc
- Jo
- Kp
- kz
- _removePointer
- Tu
- pf
- setAccess
- setAtomic
- vL
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
  README.md → backend/helpline_watch/static/assets/index-DCBPOMyH.js
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

## Communities (151 total, 36 thin omitted)

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

### Community 5 - "index-DCBPOMyH.js"
Cohesion: 0.01
Nodes (114): after(), applyAxisAngle(), applyEuler(), applyQuaternion(), before(), Bx(), c(), Cg() (+106 more)

### Community 6 - "react-force-graph-3d-blTPDaaA.js"
Cohesion: 0.01
Nodes (69): backend_helpline_watch_static_assets_index_dcbpomyh_ar, backend_helpline_watch_static_assets_index_dcbpomyh_cr, backend_helpline_watch_static_assets_index_dcbpomyh_et, backend_helpline_watch_static_assets_index_dcbpomyh_in, backend_helpline_watch_static_assets_index_dcbpomyh_kn, backend_helpline_watch_static_assets_index_dcbpomyh_ln, backend_helpline_watch_static_assets_index_dcbpomyh_or, backend_helpline_watch_static_assets_index_dcbpomyh_q (+61 more)

### Community 7 - "Pages.tsx"
Cohesion: 0.12
Nodes (24): Evidence(), HUE, Props, Filter, FindingsPanel(), Mark(), Page(), pageLabel() (+16 more)

### Community 12 - "o"
Cohesion: 0.05
Nodes (95): addGroup(), Ae(), af(), ao(), b(), bf(), Bp(), s() (+87 more)

### Community 13 - "sweep.py"
Cohesion: 0.14
Nodes (23): City, CityCoverage, SweepEvent, ads_params(), autocomplete_call(), build_plan(), choose_queries(), maps_params() (+15 more)

### Community 14 - "package.json"
Cohesion: 0.07
Nodes (28): name, private, scripts, build, dev, lint, preview, type (+20 more)

### Community 15 - "l"
Cohesion: 0.06
Nodes (81): hx(), Pg(), i(), bi(), it(), jt(), o(), er() (+73 more)

### Community 16 - "dl"
Cohesion: 0.05
Nodes (87): A(), Aa(), Ai(), al(), ba(), be(), Bi(), bl() (+79 more)

### Community 17 - "t"
Cohesion: 0.07
Nodes (85): ac(), bc(), Bh(), bs(), cc(), Ci(), cl(), containsPoint() (+77 more)

### Community 18 - "constructor"
Cohesion: 0.04
Nodes (80): hn(), Ak(), connect(), constructor(), ae(), ct(), dt(), Et() (+72 more)

### Community 19 - "get"
Cohesion: 0.06
Nodes (65): aa(), i(), n(), r(), t(), n(), createComputePipeline(), _createNodeBuilder() (+57 more)

### Community 20 - "a"
Cohesion: 0.07
Nodes (57): abort(), bind(), bm(), bu(), Cu(), Du(), v(), Ep() (+49 more)

### Community 21 - "t"
Cohesion: 0.07
Nodes (52): Jr(), Ur(), addInclude(), ai(), bu(), buildFunctionCode(), buildFunctionNode(), call() (+44 more)

### Community 22 - "make_synthetic_fixtures.py"
Cohesion: 0.06
Nodes (56): asyncio, Services, brands(), eval(), Path, `helpline-watch` command line: serve the UI, run or record sweeps, print the…, Replay all seed brands and print the proof table (the numbers the README…, Start the API and UI on one port. (+48 more)

### Community 23 - "Hc"
Cohesion: 0.08
Nodes (48): addEventListener(), am(), ca(), o(), cm(), connect(), ct(), disconnect() (+40 more)

### Community 24 - "a"
Cohesion: 0.08
Nodes (43): ad(), o(), br(), _clientWaitAsync(), i(), i(), h(), ez() (+35 more)

### Community 25 - "L"
Cohesion: 0.07
Nodes (47): as(), Bd(), cf(), dd(), df(), Do(), ff(), Hd() (+39 more)

### Community 26 - "e"
Cohesion: 0.07
Nodes (39): Dh(), Ar(), c(), l(), u(), _c(), t(), u() (+31 more)

### Community 27 - "UI-SPEC.md"
Cohesion: 0.15
Nodes (12): 0. Idea brief, 10. Don'ts, 11. Acceptance, 1. Demo script (≤ 3:00), 2. Screen inventory, 3. Flow map, 4. Screens, 5. Components (+4 more)

### Community 28 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+11 more)

### Community 29 - "getUniforms"
Cohesion: 0.07
Nodes (43): addUniform(), _convertAddressMode(), _convertFilterMode(), _convertMipmapFilterMode(), _createLayoutEntries(), destroySampler(), generateFilteredTexture(), generateSnippet() (+35 more)

### Community 30 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+8 more)

### Community 31 - "update"
Cohesion: 0.06
Nodes (39): Tp(), _checkDistances(), _clampDistance(), clearUpdateRanges(), re(), dollyIn(), dollyOut(), Ek() (+31 more)

### Community 32 - "Product"
Cohesion: 0.18
Nodes (10): Accessibility, Capabilities, Constraints, Open decisions, Platform, Positioning, Product, Product Purpose (+2 more)

### Community 33 - "reset"
Cohesion: 0.10
Nodes (39): allocateQueriesForContext(), beginCompute(), beginQuery(), beginRender(), clear(), clearAsync(), clearColor(), clearColorAsync() (+31 more)

### Community 34 - "_fromTexture"
Cohesion: 0.08
Nodes (38): Mr(), Nr(), Pr(), Sr(), Tr(), _allocateTarget(), _allocateTargets(), _applyGGXFilter() (+30 more)

### Community 35 - "Helpline Watch"
Cohesion: 0.14
Nodes (13): AI disclosure, Demo video, Go live, Helpline Watch, How it works, License, Limitations, Meaningful SerpApi usage (+5 more)

### Community 36 - "test_surfaces_and_classify.py"
Cohesion: 0.14
Nodes (35): apply_reverse(), classify(), _helpline_context(), merge_analyst_state(), official_norms(), Signals → verdict. Deterministic; every point on the score has a named reason.…, Fold reverse-lookup evidence into a finding and re-score it., Re-classification must not erase what the analyst and the reverse lookups… (+27 more)

### Community 37 - "clone"
Cohesion: 0.07
Nodes (36): Dp(), fx(), xm(), Ax(), bias(), _blur(), Bx(), clone() (+28 more)

### Community 38 - "DESIGN.md"
Cohesion: 0.22
Nodes (8): Colors, Components, Do's and Don'ts, Elevation & Depth, Layout, Overview, Shapes, Typography

### Community 39 - "A"
Cohesion: 0.08
Nodes (30): Jh(), Mn(), Mt(), Ne(), Nt(), Pe(), ut(), getContext() (+22 more)

### Community 40 - "n"
Cohesion: 0.08
Nodes (32): ao(), a(), c(), f(), g(), l(), n(), o() (+24 more)

### Community 41 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 42 - "push"
Cohesion: 0.07
Nodes (34): a(), a(), d(), f(), addBundle(), ba(), c(), l() (+26 more)

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

### Community 51 - "buildCode"
Cohesion: 0.11
Nodes (34): addUniformUpdateRange(), buildCode(), generateArrayDeclaration(), _getBufferForType(), getBuiltins(), getCodes(), getDirectives(), getFlowData() (+26 more)

### Community 52 - "render"
Cohesion: 0.08
Nodes (34): AE(), Ot(), DE(), eE(), fromEquirectangularTexture(), getActiveCubeFace(), getActiveMipmapLevel(), getClearAlpha() (+26 more)

### Community 53 - "copy"
Cohesion: 0.12
Nodes (32): add(), addScaledSH(), addScaledVector(), attach(), bt(), clampLength(), closestPointToPoint(), computeTangents() (+24 more)

### Community 54 - "il"
Cohesion: 0.08
Nodes (28): Ng(), cl(), el(), il(), ae(), b(), C(), D() (+20 more)

### Community 55 - "ap"
Cohesion: 0.10
Nodes (31): ap(), BN(), cp(), _customWheelEvent(), deserialize(), FN(), _getMouseOnCircle(), _getMouseOnScreen() (+23 more)

### Community 56 - "fn"
Cohesion: 0.09
Nodes (30): an(), ap(), h(), cn(), cp(), dn(), every(), fn() (+22 more)

### Community 57 - "createRenderPipeline"
Cohesion: 0.09
Nodes (30): _completeCompile(), _completeComputeCompile(), createBundleEncoder(), createRenderPipeline(), _getColorWriteMask(), getCurrentColorFormat(), getCurrentColorFormats(), getCurrentColorSpace() (+22 more)

### Community 58 - "types.ts"
Cohesion: 0.11
Nodes (26): Workspace(), LogList(), api, json(), openSweepStream(), StreamHandlers, Advertiser, CallState (+18 more)

### Community 59 - "F"
Cohesion: 0.12
Nodes (29): F(), wn(), drawBuffers(), _getBlendFactor(), _getBlending(), _getBlendOperation(), getDefaultUV(), r() (+21 more)

### Community 60 - "e"
Cohesion: 0.09
Nodes (27): clear(), create(), filter(), getHex(), getHexString(), gr(), jx(), t() (+19 more)

### Community 61 - "generate"
Cohesion: 0.10
Nodes (27): addFlowCode(), addFlowTab(), enableSubGroups(), generate(), getBuiltin(), getCode(), getDrawIndex(), getFragCoord() (+19 more)

### Community 62 - "bindTexture"
Cohesion: 0.13
Nodes (26): bindTexture(), copyBufferToTexture(), copyFramebufferToTexture(), copyTextureToBuffer(), copyTextureToTexture(), _createArrayCameraBundleEncoders(), finish(), _finishArrayCameraBundleEncoders() (+18 more)

### Community 63 - "normalize"
Cohesion: 0.14
Nodes (25): applyMatrix3(), applyNormalMatrix(), computeVertexNormals(), fromBufferAttribute(), getW(), getX(), getY(), getZ() (+17 more)

### Community 64 - "build"
Cohesion: 0.12
Nodes (25): addChain(), addFlow(), addSequentialNode(), build(), buildAsync(), buildUpdateNodes(), flowBuildStage(), flowChildNode() (+17 more)

### Community 65 - "Ag"
Cohesion: 0.11
Nodes (24): Ag(), bn(), clone(), computeFrenetFrames(), computeLineDistances(), crossVectors(), dx(), kg() (+16 more)

### Community 66 - "_onChangeCallback"
Cohesion: 0.12
Nodes (24): decompose(), determinantAffine(), extractBasis(), extractRotation(), fromArray(), fromJSON(), _getHandJoint(), getWorldPosition() (+16 more)

### Community 67 - "applyMatrix4"
Cohesion: 0.11
Nodes (23): applyMatrix4(), conjugate(), getMaxScaleOnAxis(), getNormalMatrix(), getWorldQuaternion(), getWorldScale(), intersectsFrustum(), intersectsObject() (+15 more)

### Community 68 - "generateNodeType"
Cohesion: 0.12
Nodes (22): addSubBuild(), changeComponentType(), generateNodeType(), getAttributeData(), getInputType(), getIntegerType(), getMemberType(), getNodeType() (+14 more)

### Community 69 - "App.tsx"
Cohesion: 0.15
Nodes (16): App(), FORCED, params, Tab, AppBar(), Props, Hero(), Kit() (+8 more)

### Community 70 - "subVectors"
Cohesion: 0.12
Nodes (21): cross(), getArea(), getLength(), getLengths(), getNormal(), getPlane(), getPoint(), getPointAt() (+13 more)

### Community 71 - "start"
Cohesion: 0.14
Nodes (21): fh(), begin(), _bundleNeedsUpdate(), compileAsync(), xt(), yt(), getGroupContext(), getLightNodes() (+13 more)

### Community 72 - "at"
Cohesion: 0.15
Nodes (20): ab(), at(), Cb(), computeBoundingSphere(), _computeIntersections(), distanceSqToSegment(), distanceTo(), distanceToSquared() (+12 more)

### Community 73 - "setFromPoints"
Cohesion: 0.15
Nodes (20): addVectors(), center(), computeBoundingBox(), expandByPoint(), expandByScalar(), getBoundingBox(), getBoundingSphere(), getCenter() (+12 more)

### Community 74 - "setup"
Cohesion: 0.12
Nodes (20): getCache(), getColor(), getFloat(), _getPMREMNodeCache(), getTexture(), getToneMappingFunction(), getTransformedUV(), isFlatShading() (+12 more)

### Community 75 - "Te"
Cohesion: 0.19
Nodes (19): rn(), tn(), bindFramebuffer(), st(), convert(), _getFrameBufferTarget(), getOutputRenderTarget(), initRenderTarget() (+11 more)

### Community 76 - "getDataFromNode"
Cohesion: 0.14
Nodes (18): addFlowCodeHierarchy(), addLineFlowCode(), addLineFlowCodeBlock(), generatePBO(), getArrayCount(), getBufferAttributeFromNode(), getCacheFromNode(), getCodeFromNode() (+10 more)

### Community 77 - "translate"
Cohesion: 0.15
Nodes (17): addScalar(), makeRotation(), makeScale(), makeTranslation(), Mg(), multiply(), multiplyMatrices(), multiplyQuaternions() (+9 more)

### Community 78 - "draw"
Cohesion: 0.15
Nodes (17): bindBufferBase(), _bindUniforms(), compute(), computeAsync(), _createVao(), draw(), getIndirect(), getIndirectOffset() (+9 more)

### Community 79 - "setMaterial"
Cohesion: 0.19
Nodes (17): disable(), enable(), setBlending(), setColorMask(), setCullFace(), setDepthFunc(), setDepthMask(), setDepthTest() (+9 more)

### Community 80 - "updateBefore"
Cohesion: 0.15
Nodes (17): _getMaps(), getMonitor(), getNodeBuilderState(), getNodeFrameForRender(), getTextureForReference(), getUpdateAfterType(), getUpdateBeforeType(), getUpdateType() (+9 more)

### Community 81 - "dot"
Cohesion: 0.20
Nodes (16): angleTo(), clamp(), clampPoint(), distanceSqToPoint(), distanceToPlane(), distanceToPoint(), distanceToSphere(), dot() (+8 more)

### Community 82 - "wa"
Cohesion: 0.13
Nodes (13): ca(), ea(), fa(), ga(), ia(), ma(), oa(), pa() (+5 more)

### Community 83 - "createTexture"
Cohesion: 0.20
Nodes (15): _copyCubeMapToTexture(), _copyImageToTexture(), createDefaultTexture(), createTexture(), _getDefaultCubeTextureGPU(), _getDefaultTextureGPU(), _getDimension(), getGLTextureType() (+7 more)

### Community 84 - "getProperties"
Cohesion: 0.18
Nodes (14): gm(), tm(), addStack(), context(), _getInternalParams(), getProperties(), getVarName(), removeStack() (+6 more)

### Community 85 - "dependencies"
Cohesion: 0.14
Nodes (14): dependencies, cobe, d3-force, motion, @phosphor-icons/react, @radix-ui/themes, react, react-dom (+6 more)

### Community 86 - "equals"
Cohesion: 0.26
Nodes (13): equals(), firstInitialization(), getAttributesData(), getGeometryData(), getLights(), getLightsData(), getMaterialData(), getRenderObjectData() (+5 more)

### Community 87 - "generateConst"
Cohesion: 0.21
Nodes (13): format(), generateArray(), generateConst(), generateStruct(), getBitcastMethod(), getComponentType(), getFloatPackingMethod(), getFloatUnpackingMethod() (+5 more)

### Community 88 - "getNodeProperties"
Cohesion: 0.23
Nodes (12): addContext(), analyze(), getClosestSubBuild(), getElementType(), getLightCoord(), getNodeProperties(), getOutputNode(), getSubBuildOutput() (+4 more)

### Community 89 - "getHash"
Cohesion: 0.21
Nodes (12): addNode(), getAttributeName(), getData(), getHash(), getNodeFromHash(), getShared(), getSharedNode(), getUniformHash() (+4 more)

### Community 90 - "getForRender"
Cohesion: 0.18
Nodes (12): createBindGroup(), createBindGroupIndex(), _createBindings(), createBindingsLayout(), createProgram(), getForRender(), getForRenderAsync(), getForRenderCacheKey() (+4 more)

### Community 91 - "City"
Cohesion: 0.33
Nodes (10): Props, focus(), Globe(), GlobeMarker, parseLL(), Props, City, Diff (+2 more)

### Community 92 - "getForCompute"
Cohesion: 0.31
Nodes (11): compileComputeAsync(), _getComputeCacheKey(), _getComputePipeline(), getForCompute(), getForComputeAsync(), getNodeFrame(), getNodeFrameForCompute(), _needsComputeUpdate() (+3 more)

### Community 93 - "getBindings"
Cohesion: 0.20
Nodes (11): deleteForCompute(), deleteForRender(), _destroyBindings(), _getBindGroup(), getBindingGroup(), getBindings(), u(), release() (+3 more)

### Community 94 - "updateForRender"
Cohesion: 0.24
Nodes (10): Pn(), getDrawParameters(), getIndex(), HT(), updateAttributes(), updateBinding(), _updateBindings(), updateForRender() (+2 more)

### Community 95 - "FP"
Cohesion: 0.27
Nodes (10): bP(), FP(), _getContainerDimensions(), gP(), _P(), _updateMovementVector(), _updateRotationVector(), xP() (+2 more)

### Community 96 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, oxlint, playwright, @types/node, @types/react, @types/react-dom, @types/three, typescript (+2 more)

### Community 97 - "addToStack"
Cohesion: 0.25
Nodes (9): addToStack(), addToStackBefore(), Case(), ElseIf(), If(), lm(), setupClipping(), ym() (+1 more)

### Community 98 - "dz"
Cohesion: 0.25
Nodes (9): az(), dz(), fz(), hz(), iz(), lz(), rz(), sz() (+1 more)

### Community 99 - "setupVariants"
Cohesion: 0.33
Nodes (7): ah(), oh(), sh(), Default(), Else(), setupSpecular(), setupVariants()

### Community 100 - "getParameter"
Cohesion: 0.43
Nodes (6): getParameter(), rr(), a(), o(), s(), Re()

### Community 101 - "setupLighting"
Cohesion: 0.29
Nodes (7): getScope(), setupEnvironment(), setupLighting(), setupLightingModel(), setupLightMap(), setupMaterialLightings(), setupOutgoingLight()

### Community 102 - "kl"
Cohesion: 0.29
Nodes (7): jl(), kl(), Ll(), Ql(), Ul(), Wl(), zl()

### Community 103 - "wo"
Cohesion: 0.33
Nodes (6): Co(), po(), qo(), _updatePointer(), _updateState(), wo()

### Community 104 - "_createAttribute"
Cohesion: 0.33
Nodes (6): _createAttribute(), _createBuffer(), createIndexAttribute(), createIndirectStorageAttribute(), createStorageAttribute(), _getAttributeMemorySize()

### Community 105 - "getAttributes"
Cohesion: 0.33
Nodes (6): _createNodeBuilderState(), getAttributes(), getAttributesArray(), getVertexBuffers(), m(), p()

### Community 106 - "element"
Cohesion: 0.33
Nodes (6): element(), getClipDistance(), setupAlphaToCoverage(), setupDefault(), setupHardwareClipping(), zx()

### Community 107 - "enableDirective"
Cohesion: 0.33
Nodes (6): enableClipDistances(), enableDirective(), enableDualSourceBlending(), enableHardwareClipping(), enableShaderF16(), enableSubgroupsF16()

### Community 108 - "getDrawingBufferSize"
Cohesion: 0.40
Nodes (6): getCanvasTarget(), getColorBuffer(), _getDefaultRenderPassDescriptor(), getDepthBuffer(), getDrawingBufferSize(), getPreferredCanvasFormat()

### Community 109 - "indirect"
Cohesion: 0.50
Nodes (5): ambientOcclusion(), computeMultiscattering(), indirect(), indirectDiffuse(), indirectSpecular()

### Community 110 - "go"
Cohesion: 0.40
Nodes (5): bo(), go(), ho(), vo(), xo()

### Community 111 - "getPropertyName"
Cohesion: 0.40
Nodes (5): getPropertyName(), getTransforms(), isCustomStruct(), isReservedKeyword(), registerDeclaration()

### Community 112 - "mz"
Cohesion: 0.40
Nodes (5): jz(), mz(), oz(), pz(), wz()

### Community 113 - "activeTexture"
Cohesion: 0.67
Nodes (4): activeTexture(), De(), Oe(), ke()

### Community 114 - "_addPointer"
Cohesion: 0.50
Nodes (4): _addPointer(), eP(), _isTrackingPointer(), kN()

### Community 115 - "onUpdate"
Cohesion: 0.50
Nodes (4): onFrameUpdate(), onObjectUpdate(), onUpdate(), updateBuffer()

### Community 116 - "addType"
Cohesion: 0.67
Nodes (3): addMaterial(), addToneMapping(), addType()

### Community 117 - "_copyCompressedBufferToTexture"
Cohesion: 0.67
Nodes (3): _copyCompressedBufferToTexture(), _getBlockData(), tM()

### Community 118 - "createRenderObject"
Cohesion: 0.67
Nodes (3): createRenderObject(), getChainArray(), getChainMap()

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
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 640 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **36 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `constructor()` connect `constructor` to `index-DCBPOMyH.js`, `react-force-graph-3d-blTPDaaA.js`, `getDynamicCacheKey`, `o`, `l`, `dl`, `t`, `get`, `t`, `Hc`, `a`, `L`, `e`, `update`, `reset`, `clone`, `A`, `n`, `push`, `render`, `il`, `ap`, `fn`, `F`, `e`, `start`, `Te`, `updateBefore`, `getNodeProperties`, `addToStack`, `_createAttribute`, `activeTexture`, `addType`, `addClass`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **Why does `n()` connect `t` to `Ag`, `_onChangeCallback`, `index-DCBPOMyH.js`, `subVectors`, `react-force-graph-3d-blTPDaaA.js`, `at`, `o`, `translate`, `dl`, `a`, `copy`, `Hc`, `fn`, `L`, `F`, `e`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **Why does `oo()` connect `l` to `Ag`, `getParameter`, `react-force-graph-3d-blTPDaaA.js`, `A`, `at`, `o`, `draw`, `e`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **Are the 7 inferred relationships involving `get()` (e.g. with `o()` and `i()`) actually correct?**
  _`get()` has 7 INFERRED edges - model-reasoned connections that need verification._
- **Are the 23 inferred relationships involving `constructor()` (e.g. with `hn()` and `lt()`) actually correct?**
  _`constructor()` has 23 INFERRED edges - model-reasoned connections that need verification._
- **Are the 84 inferred relationships involving `t()` (e.g. with `ac()` and `Ai()`) actually correct?**
  _`t()` has 84 INFERRED edges - model-reasoned connections that need verification._
- **Are the 82 inferred relationships involving `n()` (e.g. with `ac()` and `Ai()`) actually correct?**
  _`n()` has 82 INFERRED edges - model-reasoned connections that need verification._