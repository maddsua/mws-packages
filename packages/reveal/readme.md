# This package impements html element reveal animations

Code examples:
```html
<div data-rvl="t25 d250 cd500">
	<div data-rvl="tt2 i2">Shows third</div>
	<div data-rvl="tr2 i0">Shows first</div>
	<div data-rvl="tb2 i1">Shows second</div>
</div>
<div data-rvl="t25 tr2">Reveals from 2em right from top on 25% visible</div>
```

Short-tags are:

### Regular elements:

- animation delay: `d[number]`
- animation length: `l[number]`
- translate: `t[direction][number]`
- reveal order: `i[number]`

### Containers or self-triggering elements

(extends the previous ones)

- trigger threshold: `t[number]`
- default children elements animation delay: `cd[number]`
- default children elements animation length: `cl[number]`
- default children elements transition: `ct[direction][number]`
