# Graph Report - hack  (2026-09-24)

## Corpus Check
- 165 files · ~243,740 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 7 file(s) not represented in the graph (top: (none) 4, .css 2, .example 1)

## Summary
- 3299 nodes · 11263 edges · 179 communities (118 shown, 61 thin omitted)
- Extraction: 87% EXTRACTED · 13% INFERRED · 0% AMBIGUOUS · INFERRED: 1474 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `71768aa2`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- surfaces.py
- client.py
- test_phones.py
- Brand
- api.py
- index-BlAr4RYj.js
- backend_helpline_watch_static_assets_index_dcbpomyh_ar
- Evidence.tsx
- helpline-watch
- backend_helpline_watch_static_assets_index_hfdowhvx_ar
- sweep.py
- package.json
- react-force-graph-3d-B9ty5iLO.js
- il
- n
- constructor
- t
- F
- dl
- make_synthetic_fixtures.py
- constructor
- get
- update
- clone
- UI-SPEC.md
- compilerOptions
- at
- compilerOptions
- getUniforms
- Product
- gf
- e
- Helpline Watch
- test_surfaces_and_classify.py
- buildCode
- DESIGN.md
- yf
- push
- .oxlintrc.json
- applyMatrix4
- ADR 0002 — Deterministic signals; no LLM in the verdict path
- ADR 0003 — Read tools free, the takedown pack is gated by a person
- ADR 0004 — One Python process serves the built React UI
- React + TypeScript + Vite
- tsconfig.json
- AGENTS.md
- CLAUDE.md
- demo-script.md
- setup
- normalize
- getDataFromNode
- cp
- addToStack
- add
- delete
- useSweep.ts
- generateNodeType
- dot
- Jr
- generate
- init
- finish
- createRenderPipeline
- fromBufferAttribute
- build
- getNodeType
- App.tsx
- updateShadow
- clear
- setMaterial
- copy
- ip
- _renderScene
- reset
- fromArray
- Pages.tsx
- getForCompute
- updateForRender
- raycast
- wa
- call
- equals
- dependencies
- start
- draw
- beginRender
- _onChangeCallback
- bind
- types.ts
- A
- cn
- getBuiltin
- setupOutput
- devDependencies
- compute
- dz
- yo
- setupShadow
- updateBefore
- getNodeProperties
- createTexture
- getAttribute
- getBindings
- getNormal
- _completeCompile
- ds
- setupLighting
- kl
- traverse
- wo
- _createAttribute
- enableDirective
- gd
- lu
- updateValue
- mz
- _addPointer
- buildFunctionCode
- _copyCompressedBufferToTexture
- createRenderObject
- wu
- getTimestamp
- op
- pan
- setUsage
- ac
- al
- au
- before
- byteLength
- _copyCubeMapToTexture
- createNode
- df
- Ek
- fromMaterial
- hc
- getColorBufferType
- getDynamicCacheKey
- getStructTypeFromNode
- _getShadowNodes
- _rollCamera
- _getWebGPUViewData
- initTextureAsync
- setupDiffuseColor
- jc
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
- Jo
- kz
- _removePointer
- Tu
- pf
- setAccess
- setAtomic
- setMRTBlending
- vL
- backend_helpline_watch_static_assets_index_hfdowhvx_cr
- backend_helpline_watch_static_assets_index_hfdowhvx_et
- backend_helpline_watch_static_assets_index_hfdowhvx_in
- backend_helpline_watch_static_assets_index_hfdowhvx_kn
- backend_helpline_watch_static_assets_index_hfdowhvx_ln
- backend_helpline_watch_static_assets_index_hfdowhvx_or
- backend_helpline_watch_static_assets_index_hfdowhvx_q
- backend_helpline_watch_static_assets_index_hfdowhvx_qn
- backend_helpline_watch_static_assets_index_hfdowhvx_yn
- backend_helpline_watch_static_assets_index_hfdowhvx_zn
- bf
- getTimestampFrames

## God Nodes (most connected - your core abstractions)
1. `get()` - 211 edges
2. `push()` - 149 edges
3. `constructor()` - 129 edges
4. `n()` - 121 edges
5. `t()` - 119 edges
6. `generate()` - 95 edges
7. `o()` - 90 edges
8. `setup()` - 90 edges
9. `t()` - 90 edges
10. `update()` - 89 edges

## Surprising Connections (you probably didn't know these)
- `Meaningful SerpApi usage` --references--> `ll()`  [INFERRED]
  README.md → backend/helpline_watch/static/assets/index-BlAr4RYj.js
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

## Communities (179 total, 61 thin omitted)

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

### Community 5 - "index-BlAr4RYj.js"
Cohesion: 0.01
Nodes (132): after(), applyAxisAngle(), applyEuler(), applyQuaternion(), ar(), before(), Bx(), By() (+124 more)

### Community 7 - "Evidence.tsx"
Cohesion: 0.21
Nodes (12): Evidence(), HUE, Kit(), Mark(), escapeRe(), withMarks(), SIGNAL_LABEL, SURFACE_LABEL (+4 more)

### Community 13 - "sweep.py"
Cohesion: 0.14
Nodes (23): City, CityCoverage, SweepEvent, ads_params(), autocomplete_call(), build_plan(), choose_queries(), maps_params() (+15 more)

### Community 14 - "package.json"
Cohesion: 0.07
Nodes (28): name, private, scripts, build, dev, lint, preview, type (+20 more)

### Community 15 - "react-force-graph-3d-B9ty5iLO.js"
Cohesion: 0.01
Nodes (57): backend_helpline_watch_static_assets_index_blar4ryj_bn, backend_helpline_watch_static_assets_index_blar4ryj_bt, backend_helpline_watch_static_assets_index_blar4ryj_hn, backend_helpline_watch_static_assets_index_blar4ryj_jn, backend_helpline_watch_static_assets_index_blar4ryj_kn, backend_helpline_watch_static_assets_index_blar4ryj_mr, backend_helpline_watch_static_assets_index_blar4ryj_q, backend_helpline_watch_static_assets_index_blar4ryj_qn (+49 more)

### Community 16 - "il"
Cohesion: 0.04
Nodes (90): ab(), fh(), lt(), r(), cl(), er(), p(), v() (+82 more)

### Community 17 - "n"
Cohesion: 0.07
Nodes (107): ah(), ap(), as(), Au(), bc(), cc(), Ch(), Ci() (+99 more)

### Community 18 - "constructor"
Cohesion: 0.06
Nodes (87): A(), addEventListener(), addGroup(), af(), Bp(), ce(), i(), co() (+79 more)

### Community 19 - "t"
Cohesion: 0.05
Nodes (94): Gd(), a(), a(), ad(), o(), ba(), c(), l() (+86 more)

### Community 20 - "F"
Cohesion: 0.05
Nodes (85): F(), Me(), activeTexture(), Ax(), bindTexture(), it(), jt(), Mt() (+77 more)

### Community 21 - "dl"
Cohesion: 0.05
Nodes (91): aa(), ac(), Ai(), ba(), bl(), Bo(), c(), ca() (+83 more)

### Community 22 - "make_synthetic_fixtures.py"
Cohesion: 0.06
Nodes (56): asyncio, Services, brands(), eval(), Path, `helpline-watch` command line: serve the UI, run or record sweeps, print the…, Replay all seed brands and print the proof table (the numbers the README…, Start the API and UI on one port. (+48 more)

### Community 23 - "constructor"
Cohesion: 0.05
Nodes (75): ln(), yn(), _allocateTargets(), connect(), constructor(), ae(), ct(), dt() (+67 more)

### Community 24 - "get"
Cohesion: 0.05
Nodes (71): aa(), i(), n(), r(), t(), clearUpdateRanges(), compileComputeAsync(), n() (+63 more)

### Community 25 - "update"
Cohesion: 0.05
Nodes (52): Ak(), ao(), a(), c(), f(), g(), i(), l() (+44 more)

### Community 26 - "clone"
Cohesion: 0.06
Nodes (48): _allocateTarget(), _applyGGXFilter(), _applyPMREM(), bias(), _blur(), _blurPass(), br(), _cleanup() (+40 more)

### Community 27 - "UI-SPEC.md"
Cohesion: 0.15
Nodes (12): 0. Idea brief, 10. Don'ts, 11. Acceptance, 1. Demo script (≤ 3:00), 2. Screen inventory, 3. Flow map, 4. Screens, 5. Components (+4 more)

### Community 28 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowArbitraryExtensions, allowImportingTsExtensions, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+11 more)

### Community 29 - "at"
Cohesion: 0.09
Nodes (46): at(), Bd(), bs(), Cd(), cf(), df(), dt(), ff() (+38 more)

### Community 30 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, noEmit, noFallthroughCasesInSwitch (+8 more)

### Community 31 - "getUniforms"
Cohesion: 0.07
Nodes (43): addInclude(), addUniform(), _convertAddressMode(), _convertFilterMode(), _convertMipmapFilterMode(), createBindingsLayout(), _createLayoutEntries(), destroySampler() (+35 more)

### Community 32 - "Product"
Cohesion: 0.18
Nodes (10): Accessibility, Capabilities, Constraints, Open decisions, Platform, Positioning, Product, Product Purpose (+2 more)

### Community 33 - "gf"
Cohesion: 0.09
Nodes (40): abort(), al(), bm(), bu(), Cu(), Dp(), el(), eu() (+32 more)

### Community 34 - "e"
Cohesion: 0.07
Nodes (39): b(), be(), clear(), connect(), create(), e(), disconnect(), dispatchEvent() (+31 more)

### Community 35 - "Helpline Watch"
Cohesion: 0.14
Nodes (13): AI disclosure, Demo video, Go live, Helpline Watch, How it works, License, Limitations, Meaningful SerpApi usage (+5 more)

### Community 36 - "test_surfaces_and_classify.py"
Cohesion: 0.14
Nodes (35): apply_reverse(), classify(), _helpline_context(), merge_analyst_state(), official_norms(), Signals → verdict. Deterministic; every point on the score has a named reason.…, Fold reverse-lookup evidence into a finding and re-score it., Re-classification must not erase what the analyst and the reverse lookups… (+27 more)

### Community 37 - "buildCode"
Cohesion: 0.09
Nodes (40): addUniformUpdateRange(), buildCode(), generateArray(), generateArrayDeclaration(), getAttributes(), _getBufferForType(), getBuiltins(), getCodes() (+32 more)

### Community 38 - "DESIGN.md"
Cohesion: 0.22
Nodes (8): Colors, Components, Do's and Don'ts, Elevation & Depth, Layout, Overview, Shapes, Typography

### Community 39 - "yf"
Cohesion: 0.07
Nodes (39): Ae(), an(), bf(), br(), cp(), dn(), en(), er() (+31 more)

### Community 40 - "push"
Cohesion: 0.07
Nodes (37): d(), f(), addBundle(), t(), createBindGroup(), createBindGroupIndex(), _createBindings(), _createExternalTextureViews() (+29 more)

### Community 41 - ".oxlintrc.json"
Cohesion: 0.33
Nodes (5): plugins, rules, react/only-export-components, react/rules-of-hooks, $schema

### Community 42 - "applyMatrix4"
Cohesion: 0.09
Nodes (32): addScalar(), applyMatrix4(), attach(), conjugate(), _getHandJoint(), getMaxScaleOnAxis(), getNormalMatrix(), getViewBounds() (+24 more)

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

### Community 51 - "setup"
Cohesion: 0.08
Nodes (31): Fy(), Iy(), Ly(), Ry(), context(), getCache(), getCacheFromNode(), getColor() (+23 more)

### Community 52 - "normalize"
Cohesion: 0.11
Nodes (29): clamp(), clampLength(), clampPoint(), computeFrenetFrames(), S(), coplanarPoint(), crossVectors(), divideScalar() (+21 more)

### Community 53 - "getDataFromNode"
Cohesion: 0.10
Nodes (29): addFlowCodeHierarchy(), addLineFlowCode(), addLineFlowCodeBlock(), addNode(), generatePBO(), generateTextureLoad(), getAttributeName(), getBufferAttributeFromNode() (+21 more)

### Community 54 - "cp"
Cohesion: 0.11
Nodes (29): BN(), cp(), FN(), _getMouseOnCircle(), _getMouseOnScreen(), _getSecondPointerPosition(), getSerializeChildren(), _handleMouseDownDolly() (+21 more)

### Community 55 - "addToStack"
Cohesion: 0.09
Nodes (25): oh(), addToStack(), addToStackBefore(), Bx(), Case(), Default(), element(), Else() (+17 more)

### Community 56 - "add"
Cohesion: 0.17
Nodes (23): add(), addVectors(), computeBoundingBox(), computeBoundingSphere(), expandByObject(), expandByPoint(), expandByScalar(), getBoundingBox() (+15 more)

### Community 57 - "delete"
Cohesion: 0.10
Nodes (23): am(), Bh(), delete(), getDataURL(), getHex(), getHexString(), ht(), jm() (+15 more)

### Community 58 - "useSweep.ts"
Cohesion: 0.20
Nodes (15): Workspace(), openSweepStream(), Advertiser, CallState, LogLine, PlannedCall, Sweep, Action (+7 more)

### Community 59 - "generateNodeType"
Cohesion: 0.14
Nodes (23): addSubBuild(), changeComponentType(), format(), generateConst(), generateNodeType(), generateStruct(), getAttributeData(), getBitcastMethod() (+15 more)

### Community 60 - "dot"
Cohesion: 0.14
Nodes (22): addScaledSH(), addScaledVector(), closestPointToPoint(), distanceSqToPoint(), distanceToPlane(), distanceToPoint(), distanceToSphere(), dot() (+14 more)

### Community 61 - "Jr"
Cohesion: 0.15
Nodes (22): Jr(), Kr(), si(), Wr(), ai(), ci(), ei(), ii() (+14 more)

### Community 62 - "generate"
Cohesion: 0.11
Nodes (22): addFlowCode(), addFlowTab(), generate(), getFloatPackingMethod(), getFloatUnpackingMethod(), getIncludes(), getInputs(), _getInternalParams() (+14 more)

### Community 63 - "init"
Cohesion: 0.13
Nodes (20): clearAsync(), foveateBoundTexture(), getAnimationLoop(), getBinding(), getFoveation(), getFramebufferScaleFactor(), getReferenceSpaceType(), hasFeature() (+12 more)

### Community 64 - "finish"
Cohesion: 0.18
Nodes (20): copyFramebufferToTexture(), endQuery(), finish(), _finishArrayCameraBundleEncoders(), finishBundle(), finishCompute(), finishRender(), flipY() (+12 more)

### Community 65 - "createRenderPipeline"
Cohesion: 0.15
Nodes (20): createBundleEncoder(), createRenderPipeline(), _getColorWriteMask(), getCurrentColorFormat(), getCurrentColorFormats(), getCurrentColorSpace(), getCurrentDepthStencilFormat(), _getDepthCompare() (+12 more)

### Community 66 - "fromBufferAttribute"
Cohesion: 0.16
Nodes (19): ag(), applyMatrix3(), applyNormalMatrix(), computeLineDistances(), computeTangents(), g(), computeVertexNormals(), fromBufferAttribute() (+11 more)

### Community 67 - "build"
Cohesion: 0.16
Nodes (19): addChain(), addSequentialNode(), build(), buildAsync(), buildUpdateNodes(), flowBuildStage(), flowChildNode(), flowNode() (+11 more)

### Community 68 - "getNodeType"
Cohesion: 0.13
Nodes (19): depth(), getArrayCount(), getClosestSubBuild(), getElementType(), getMemberType(), getNodeType(), getOutputNode(), getPropertyName() (+11 more)

### Community 69 - "App.tsx"
Cohesion: 0.16
Nodes (15): App(), FORCED, params, Tab, Filter, FindingsPanel(), LogList(), Network3D() (+7 more)

### Community 70 - "updateShadow"
Cohesion: 0.14
Nodes (18): AE(), DE(), eE(), getMRT(), getRenderObjectFunction(), getShadowMaterial(), getShadowRenderObjectFunction(), jE() (+10 more)

### Community 71 - "clear"
Cohesion: 0.18
Nodes (18): clear(), clearColorAsync(), clearDepth(), clearDepthAsync(), clearStencilAsync(), getActiveCubeFace(), getActiveMipmapLevel(), getClearAlpha() (+10 more)

### Community 72 - "setMaterial"
Cohesion: 0.17
Nodes (18): disable(), enable(), v(), setBlending(), setColorMask(), setCullFace(), setDepthFunc(), setDepthMask() (+10 more)

### Community 73 - "copy"
Cohesion: 0.17
Nodes (17): clone(), copy(), getHSL(), getRGB(), getStyle(), ib(), lerpHSL(), offsetHSL() (+9 more)

### Community 74 - "ip"
Cohesion: 0.14
Nodes (17): Tp(), bP(), FP(), _getContainerDimensions(), _getZoomScale(), gP(), _handleMouseMoveDolly(), _handleMouseMovePan() (+9 more)

### Community 75 - "_renderScene"
Cohesion: 0.20
Nodes (17): begin(), _bundleNeedsUpdate(), compileAsync(), getDrawingBufferSize(), _getFrameBufferTarget(), getGroupContext(), getOutputRenderTarget(), _projectObject() (+9 more)

### Community 76 - "reset"
Cohesion: 0.20
Nodes (17): beginCompute(), bindFramebuffer(), clearColor(), clearStencil(), copyTextureToBuffer(), copyTextureToTexture(), disposeShadowMaterial(), _getTypedArrayType() (+9 more)

### Community 77 - "fromArray"
Cohesion: 0.16
Nodes (16): decompose(), determinantAffine(), extractBasis(), extractRotation(), fromArray(), fromJSON(), getArea(), getWorldPosition() (+8 more)

### Community 78 - "Pages.tsx"
Cohesion: 0.18
Nodes (12): Props, Landing(), SIGNALS, Page(), pageLabel(), Pages(), Props, redCount() (+4 more)

### Community 79 - "getForCompute"
Cohesion: 0.18
Nodes (15): _createNodeBuilderState(), createProgram(), getAttributesArray(), _getComputeCacheKey(), _getComputePipeline(), getForCompute(), getForComputeAsync(), getForRender() (+7 more)

### Community 80 - "updateForRender"
Cohesion: 0.17
Nodes (15): _getMaps(), getNodeFrame(), getNodeFrameForCompute(), getNodeFrameForRender(), getUpdateAfterType(), getUpdateType(), updateAfter(), updateAfterForCompute() (+7 more)

### Community 81 - "raycast"
Cohesion: 0.21
Nodes (14): _computeIntersections(), containsPoint(), distanceSqToSegment(), distanceTo(), distanceToSquared(), getBarycoord(), getInterpolatedAttribute(), intersectTriangle() (+6 more)

### Community 82 - "wa"
Cohesion: 0.18
Nodes (12): Or(), ca(), ea(), ga(), ia(), ma(), oa(), Qi() (+4 more)

### Community 83 - "call"
Cohesion: 0.18
Nodes (14): bu(), call(), fi(), gf(), hf(), Kp(), lp(), qF() (+6 more)

### Community 84 - "equals"
Cohesion: 0.24
Nodes (14): customCacheKey(), equals(), firstInitialization(), getAttributesData(), getBuiltinLights(), getGeometryData(), getLights(), getLightsData() (+6 more)

### Community 85 - "dependencies"
Cohesion: 0.14
Nodes (14): dependencies, cobe, d3-force, motion, @phosphor-icons/react, @radix-ui/themes, react, react-dom (+6 more)

### Community 86 - "start"
Cohesion: 0.22
Nodes (13): qm(), th(), ambientOcclusion(), computeMultiscattering(), yt(), direct(), indirect(), indirectDiffuse() (+5 more)

### Community 87 - "draw"
Cohesion: 0.19
Nodes (13): allocateQueriesForContext(), beginQuery(), draw(), getDrawParameters(), getIndex(), getIndirect(), getIndirectOffset(), HT() (+5 more)

### Community 88 - "beginRender"
Cohesion: 0.19
Nodes (13): beginRender(), _createArrayCameraBundleEncoders(), _createArrayCameraLayerDescriptors(), drawBuffers(), _getDefaultRenderPassDescriptor(), _getRenderPassDescriptor(), _hasExternalTexture(), initRenderTarget() (+5 more)

### Community 89 - "_onChangeCallback"
Cohesion: 0.17
Nodes (12): angleTo(), _onChangeCallback(), order(), rotateTowards(), setComponent(), setW(), setX(), setY() (+4 more)

### Community 90 - "bind"
Cohesion: 0.21
Nodes (12): bind(), Dh(), Du(), findNode(), Fp(), getValue(), _getValue_unbound(), jf() (+4 more)

### Community 91 - "types.ts"
Cohesion: 0.14
Nodes (24): AppBar(), Props, Props, focus(), Globe(), GlobeMarker, parseLL(), Hero() (+16 more)

### Community 92 - "A"
Cohesion: 0.17
Nodes (12): addClass(), addLight(), addMaterial(), addToneMapping(), addType(), getCode(), getDrawIndex(), getInternalFormat() (+4 more)

### Community 93 - "cn"
Cohesion: 0.18
Nodes (10): cn(), wn(), ap(), _customWheelEvent(), deserialize(), fa(), pa(), t() (+2 more)

### Community 94 - "getBuiltin"
Cohesion: 0.22
Nodes (11): enableSubGroups(), getBuiltin(), getFragCoord(), getFragDepth(), getFrontFacing(), getInstanceIndex(), getInvocationLocalIndex(), getInvocationSubgroupIndex() (+3 more)

### Community 95 - "setupOutput"
Cohesion: 0.24
Nodes (10): gm(), Yx(), addStack(), removeStack(), setupFog(), setupOutput(), setupPosition(), setupPremultipliedAlpha() (+2 more)

### Community 96 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, oxlint, playwright, @types/node, @types/react, @types/react-dom, @types/three, typescript (+2 more)

### Community 97 - "compute"
Cohesion: 0.22
Nodes (10): bindBufferBase(), _bindUniforms(), compute(), computeAsync(), _createVao(), _getTransformFeedback(), _getVaoKey(), u() (+2 more)

### Community 98 - "dz"
Cohesion: 0.25
Nodes (9): az(), dz(), fz(), hz(), iz(), lz(), rz(), sz() (+1 more)

### Community 99 - "yo"
Cohesion: 0.25
Nodes (9): bo(), fo(), go(), ho(), mo(), So(), vo(), xo() (+1 more)

### Community 100 - "setupShadow"
Cohesion: 0.25
Nodes (9): createCubeRenderTarget(), createRenderTarget(), getShadowFilterFn(), getSharedContext(), onObjectUpdate(), setupRenderTarget(), setupShadow(), setupShadowCoord() (+1 more)

### Community 101 - "updateBefore"
Cohesion: 0.28
Nodes (9): getCanvasTarget(), getColorBuffer(), getTextureForReference(), getUpdateBeforeType(), updateBefore(), updateBeforeNode(), updateFromTexture(), updateReference() (+1 more)

### Community 102 - "getNodeProperties"
Cohesion: 0.29
Nodes (8): addContext(), analyze(), getLightCoord(), getLightVector(), getNodeProperties(), getSpotAttenuation(), setContext(), setupDirect()

### Community 103 - "createTexture"
Cohesion: 0.39
Nodes (8): createDefaultTexture(), createTexture(), _getDefaultCubeTextureGPU(), _getDefaultTextureGPU(), _getDimension(), getGLTextureType(), _getTextureMemorySize(), rM()

### Community 104 - "getAttribute"
Cohesion: 0.25
Nodes (8): el(), getAttribute(), hi(), KF(), nl(), tl(), vf(), yf()

### Community 105 - "getBindings"
Cohesion: 0.29
Nodes (8): _getBindGroup(), getBindingGroup(), getBindings(), getMonitor(), getNodeBuilderState(), hardwareClippingPlanes(), sort(), sortBindingGroups()

### Community 106 - "getNormal"
Cohesion: 0.29
Nodes (7): cross(), getNormal(), getPlane(), isFrontFacing(), lengthSq(), setFromCoplanarPoints(), setFromNormalAndCoplanarPoint()

### Community 107 - "_completeCompile"
Cohesion: 0.33
Nodes (7): _completeCompile(), _completeComputeCompile(), getError(), _getShaderErrors(), _handleSource(), _logProgramError(), _setupBindings()

### Community 108 - "ds"
Cohesion: 0.29
Nodes (7): cs(), ds(), fs(), os(), ss(), ts(), xs()

### Community 109 - "setupLighting"
Cohesion: 0.29
Nodes (7): getScope(), setupEnvironment(), setupLighting(), setupLightingModel(), setupLightMap(), setupMaterialLightings(), setupOutgoingLight()

### Community 110 - "kl"
Cohesion: 0.29
Nodes (7): jl(), kl(), Ll(), Ql(), Ul(), Wl(), zl()

### Community 111 - "traverse"
Cohesion: 0.33
Nodes (6): addFlow(), getChildren(), getFlowContextData(), prebuild(), sm(), traverse()

### Community 112 - "wo"
Cohesion: 0.33
Nodes (6): Co(), po(), qo(), _updatePointer(), _updateState(), wo()

### Community 113 - "_createAttribute"
Cohesion: 0.33
Nodes (6): _createAttribute(), _createBuffer(), createIndexAttribute(), createIndirectStorageAttribute(), createStorageAttribute(), _getAttributeMemorySize()

### Community 114 - "enableDirective"
Cohesion: 0.33
Nodes (6): enableClipDistances(), enableDirective(), enableDualSourceBlending(), enableHardwareClipping(), enableShaderF16(), enableSubgroupsF16()

### Community 115 - "gd"
Cohesion: 0.40
Nodes (5): af(), ff(), gd(), Wd(), zd()

### Community 116 - "lu"
Cohesion: 0.40
Nodes (5): cu(), iu(), lu(), Mu(), Pu()

### Community 117 - "updateValue"
Cohesion: 0.50
Nodes (5): getValueFromReference(), label(), setName(), setNodeType(), updateValue()

### Community 118 - "mz"
Cohesion: 0.40
Nodes (5): jz(), mz(), oz(), pz(), wz()

### Community 119 - "_addPointer"
Cohesion: 0.50
Nodes (4): _addPointer(), eP(), _isTrackingPointer(), kN()

### Community 120 - "buildFunctionCode"
Cohesion: 0.50
Nodes (4): buildFunctionCode(), buildFunctionNode(), flowShaderNode(), flowStagesNode()

### Community 121 - "_copyCompressedBufferToTexture"
Cohesion: 0.67
Nodes (3): _copyCompressedBufferToTexture(), _getBlockData(), tM()

### Community 122 - "createRenderObject"
Cohesion: 0.67
Nodes (3): createRenderObject(), getChainArray(), getChainMap()

### Community 123 - "wu"
Cohesion: 0.67
Nodes (3): Du(), ku(), wu()

### Community 124 - "getTimestamp"
Cohesion: 0.67
Nodes (3): _getQueryPool(), getTimestamp(), hasTimestampQuery()

### Community 125 - "op"
Cohesion: 0.67
Nodes (3): _handleKeyDown(), needsPreviousData(), op()

### Community 126 - "pan"
Cohesion: 0.67
Nodes (3): pan(), _panLeft(), _panUp()

### Community 127 - "setUsage"
Cohesion: 0.67
Nodes (3): setInstanced(), setUsage(), V_()

## Knowledge Gaps
- **152 isolated node(s):** `helpline-watch`, `$schema`, `plugins`, `react/rules-of-hooks`, `react/only-export-components` (+147 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 660 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **61 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `get()` connect `get` to `react-force-graph-3d-B9ty5iLO.js`, `il`, `n`, `t`, `F`, `constructor`, `update`, `clone`, `at`, `getUniforms`, `gf`, `push`, `setup`, `getDataFromNode`, `init`, `finish`, `createRenderPipeline`, `setMaterial`, `reset`, `getForCompute`, `updateForRender`, `wa`, `draw`, `beginRender`, `A`, `cn`, `compute`, `updateBefore`, `createTexture`, `getBindings`, `_completeCompile`, `_createAttribute`, `buildFunctionCode`, `createRenderObject`, `wu`, `op`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Why does `ao()` connect `update` to `gf`, `react-force-graph-3d-B9ty5iLO.js`, `il`, `n`, `constructor`, `t`, `F`, `start`?**
  _High betweenness centrality (0.013) - this node is a cross-community bridge._
- **Why does `n()` connect `n` to `gf`, `e`, `fromBufferAttribute`, `index-BlAr4RYj.js`, `yf`, `copy`, `getNormal`, `applyMatrix4`, `react-force-graph-3d-B9ty5iLO.js`, `raycast`, `constructor`, `F`, `dl`, `add`, `delete`, `bind`, `at`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **Are the 7 inferred relationships involving `get()` (e.g. with `o()` and `i()`) actually correct?**
  _`get()` has 7 INFERRED edges - model-reasoned connections that need verification._
- **Are the 23 inferred relationships involving `constructor()` (e.g. with `lt()` and `mt()`) actually correct?**
  _`constructor()` has 23 INFERRED edges - model-reasoned connections that need verification._
- **Are the 84 inferred relationships involving `n()` (e.g. with `Ae()` and `as()`) actually correct?**
  _`n()` has 84 INFERRED edges - model-reasoned connections that need verification._
- **Are the 82 inferred relationships involving `t()` (e.g. with `A()` and `am()`) actually correct?**
  _`t()` has 82 INFERRED edges - model-reasoned connections that need verification._