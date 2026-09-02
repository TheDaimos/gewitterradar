# Gewitterradar V4.01 – Asset optimization verification

Date: 2026-09-02

## Scope

V4.01 changes only release metadata, asset cache keys and the four external PNG files. The V4.00 application behavior, helper IDs, layout rules and data-processing paths remain unchanged.

## Dimension basis

| Asset | Maximum CSS display | V4.01 source | Source/CSS reserve | HiDPI coverage |
| --- | ---: | ---: | ---: | --- |
| Trend medallion | 138 × 138 px | 512 × 512 px | 3.71× | More than 3× |
| Trend arrow | 69 × 69 px | 256 × 256 px | 3.71× | More than 3× |
| Compass frame V1 | 430 × 430 px | 1152 × 1152 px | 2.68× | More than 2× |
| Compass frame V2 | 430 × 430 px | 1152 × 1152 px | 2.68× | More than 2× |

## Payload result

| Asset | V4.00 bytes | V4.01 bytes | Saved bytes | Reduction |
| --- | ---: | ---: | ---: | ---: |
| Trend medallion | 2,592,711 | 448,794 | 2,143,917 | 82.69% |
| Trend arrow | 1,266,532 | 60,981 | 1,205,551 | 95.19% |
| Compass frame V1 | 1,294,563 | 1,065,811 | 228,752 | 17.67% |
| Compass frame V2 | 812,447 | 745,965 | 66,482 | 8.18% |
| **Total** | **5,966,253** | **2,321,551** | **3,644,702** | **61.09%** |

## Technical verification

- Every optimized asset is a square, non-interlaced, 8-bit RGBA PNG.
- Full alpha transparency is retained; all four corner pixels remain fully transparent.
- Image content and canvas alignment were preserved without cropping.
- Visual comparisons were performed at the maximum 3× trend render size and maximum 2× compass render size.
- Normalized RMSE at those render sizes was 0.00502 for the medallion, 0.00291 for the arrow, 0.00210 for compass V1 and 0.00189 for compass V2.
- No visible contour, texture, color or alpha-edge regression was found in the side-by-side comparisons.
- V4.01 changes the four internal asset query strings from `?v=1` to `?v=401` to prevent stale client caches.

## Regression boundary

The protected Recent-DOM update path, iPad/WebKit safeguards, compass logic, cluster behavior, radius coupling and Home Assistant helper interface were not modified for V4.01.
