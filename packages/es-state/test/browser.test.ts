import { PersistentStateRef } from "../lib/persistentState";

const counter = document.querySelector('[data-hook="counter"]') as HTMLElement;

const ref = new PersistentStateRef<number>(0, 'num_record', 'cookie');

counter.textContent = ref.value.toString();
console.log(ref.value);

ref.watch((value) => {
	console.log(value);
	counter.textContent = value.toString()
});

document.querySelectorAll<HTMLButtonElement>('[data-action]').forEach(item => item.addEventListener('click', () => {
	const step = item.getAttribute('data-action')?.includes('+') ? 1 : -1;
	ref.value += step;
}));
