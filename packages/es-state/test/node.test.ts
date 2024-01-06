import { StateRef } from "../lib/state";

const numberRef = new StateRef(0);

numberRef.watch((value) => console.log('numberRef updated with new value:', value));

numberRef.value = Math.round(Math.random() * 10);
