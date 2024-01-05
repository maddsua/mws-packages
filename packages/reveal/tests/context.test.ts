import { AttributeParser } from '../lib/attributeParser.ts';

const attribute = 't1 tr1 d1 l1 i1 ct1 ctr1 cd1 cl1';

const result = new AttributeParser(attribute).parse();

console.log(result);
