# Three.js

Three.js 0.187.0, MIT License. See THREE-LICENSE.txt.
Includes RoundedBoxGeometry from three/addons/geometries.
The library is bundled locally for offline file:// launch.

Rebuild with esbuild from this module entry (requires three 0.187.0):

```js
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
window.TAMNA_THREE = { ...THREE, RoundedBoxGeometry };
```

Bundle format: iife; target: es2020; minify: true; legalComments: eof.
