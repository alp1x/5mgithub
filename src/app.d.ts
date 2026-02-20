// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { Session, ClientSession } from '$lib/types';

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session?: Session;
		}
		interface PageData {
			session: ClientSession | null;
		}
		// interface PageState {}
		// interface Platform {}
	}
}

export { };
