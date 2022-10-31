
# Identicons
A javascript library for generating identicon images based on an input seed.


**DISCLAIMER:** Developed for browser context because it depends on `canvas` to render images.

[![](https://img.shields.io/github/issues-raw/mjbrisebois/identicons-js?style=flat-square)](https://github.com/mjbrisebois/identicons-js/issues)
[![](https://img.shields.io/github/issues-closed-raw/mjbrisebois/identicons-js?style=flat-square)](https://github.com/mjbrisebois/identicons-js/issues?q=is%3Aissue+is%3Aclosed)
[![](https://img.shields.io/github/issues-pr-raw/mjbrisebois/identicons-js?style=flat-square)](https://github.com/mjbrisebois/identicons-js/pulls)


## Example Identicons


### Discs

#### Default (color range 10%)

|                                          |                                          |                                          |                                          |                                          |                                          |                                          |                                          |                                          |                                          |                                          |
|------------------------------------------|------------------------------------------|------------------------------------------|------------------------------------------|------------------------------------------|------------------------------------------|------------------------------------------|------------------------------------------|------------------------------------------|------------------------------------------|------------------------------------------|
| ![](docs/images/random-01.png)           | ![](docs/images/random-02.png)           | ![](docs/images/random-03.png)           | ![](docs/images/random-04.png)           | ![](docs/images/random-05.png)           | ![](docs/images/random-06.png)           | ![](docs/images/random-07.png)           | ![](docs/images/random-08.png)           | ![](docs/images/random-09.png)           | ![](docs/images/random-10.png)           | ![](docs/images/random-11.png)           |


#### Controlled color base (same seed)

| `0.0`                                    | `0.1`                                    | `0.2`                                    | `0.3`                                    | `0.4`                                    | `0.5`                                    | `0.6`                                    | `0.7`                                    | `0.8`                                    | `0.9`                                    | `1.0`                                    |
|------------------------------------------|------------------------------------------|------------------------------------------|------------------------------------------|------------------------------------------|------------------------------------------|------------------------------------------|------------------------------------------|------------------------------------------|------------------------------------------|------------------------------------------|
| ![](docs/images/disc-base-01.png)        | ![](docs/images/disc-base-02.png)        | ![](docs/images/disc-base-03.png)        | ![](docs/images/disc-base-04.png)        | ![](docs/images/disc-base-05.png)        | ![](docs/images/disc-base-06.png)        | ![](docs/images/disc-base-07.png)        | ![](docs/images/disc-base-08.png)        | ![](docs/images/disc-base-09.png)        | ![](docs/images/disc-base-10.png)        | ![](docs/images/disc-base-11.png)        |


#### Controlled color base (random seed)

| `0.0`                                    | `0.1`                                    | `0.2`                                    | `0.3`                                    | `0.4`                                    | `0.5`                                    | `0.6`                                    | `0.7`                                    | `0.8`                                    | `0.9`                                    | `1.0`                                    |
|------------------------------------------|------------------------------------------|------------------------------------------|------------------------------------------|------------------------------------------|------------------------------------------|------------------------------------------|------------------------------------------|------------------------------------------|------------------------------------------|------------------------------------------|
| ![](docs/images/random-disc-base-01.png) | ![](docs/images/random-disc-base-02.png) | ![](docs/images/random-disc-base-03.png) | ![](docs/images/random-disc-base-04.png) | ![](docs/images/random-disc-base-05.png) | ![](docs/images/random-disc-base-06.png) | ![](docs/images/random-disc-base-07.png) | ![](docs/images/random-disc-base-08.png) | ![](docs/images/random-disc-base-09.png) | ![](docs/images/random-disc-base-10.png) | ![](docs/images/random-disc-base-11.png) |


#### Controlled color base (increased color range to 30%)

| `0.0`                                        | `0.1`                                        | `0.2`                                        | `0.3`                                        | `0.4`                                        | `0.5`                                        | `0.6`                                        | `0.7`                                        | `0.8`                                        | `0.9`                                        | `1.0`                                        |
|----------------------------------------------|----------------------------------------------|----------------------------------------------|----------------------------------------------|----------------------------------------------|----------------------------------------------|----------------------------------------------|----------------------------------------------|----------------------------------------------|----------------------------------------------|----------------------------------------------|
| ![](docs/images/random-disc-range-30-01.png) | ![](docs/images/random-disc-range-30-02.png) | ![](docs/images/random-disc-range-30-03.png) | ![](docs/images/random-disc-range-30-04.png) | ![](docs/images/random-disc-range-30-05.png) | ![](docs/images/random-disc-range-30-06.png) | ![](docs/images/random-disc-range-30-07.png) | ![](docs/images/random-disc-range-30-08.png) | ![](docs/images/random-disc-range-30-09.png) | ![](docs/images/random-disc-range-30-10.png) | ![](docs/images/random-disc-range-30-11.png) |


#### Controlled color base (100% any color range)

| `0.0`                                         | `0.1`                                         | `0.2`                                         | `0.3`                                         | `0.4`                                         | `0.5`                                         | `0.6`                                         | `0.7`                                         | `0.8`                                         | `0.9`                                         | `1.0`                                         |
|-----------------------------------------------|-----------------------------------------------|-----------------------------------------------|-----------------------------------------------|-----------------------------------------------|-----------------------------------------------|-----------------------------------------------|-----------------------------------------------|-----------------------------------------------|-----------------------------------------------|-----------------------------------------------|
| ![](docs/images/random-disc-range-100-01.png) | ![](docs/images/random-disc-range-100-02.png) | ![](docs/images/random-disc-range-100-03.png) | ![](docs/images/random-disc-range-100-04.png) | ![](docs/images/random-disc-range-100-05.png) | ![](docs/images/random-disc-range-100-06.png) | ![](docs/images/random-disc-range-100-07.png) | ![](docs/images/random-disc-range-100-08.png) | ![](docs/images/random-disc-range-100-09.png) | ![](docs/images/random-disc-range-100-10.png) | ![](docs/images/random-disc-range-100-11.png) |


#### Size controls
Using the seed `hello world`, the

- colors
- number of discs
- realtive disc sizes
- relative disc positions

will be consitent for any size image.

| Square                           | Rectangle                           |
|----------------------------------|-------------------------------------|
| ![](docs/images/size-square.png) | ![](docs/images/size-rectangle.png) |

| Banner                           |
|----------------------------------|
| ![](docs/images/size-banner.png) |


## Usage


```html
<script type="text/javascript" src="dist/identicons.bundled.js"></script>
```

```js
let result = Identicons.renderDiscs({
    "seed": "hello world",
});

result.dataURL
// data:image/png;base64,iVBORw0KGgoAAAAN...AABJRU5ErkJggg==
```

