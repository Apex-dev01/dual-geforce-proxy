import { ScramjetServiceWorker } from "../shared/index";
import { BareClient } from "@mercuryworkshop/bare-mux";
import type { BareTransport } from "@mercuryworkshop/bare-mux";

const client = new BareClient();

const sw = new ScramjetServiceWorker();

declare const self: ServiceWorkerGlobalScope;

self.addEventListener("install", (event) => {
	event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
	event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", async (event: FetchEvent) => {
	const request = event.request;
	if (sw.route(request)) {
		return event.respondWith(
			(async () => {
				try {
					const response = await sw.handleRequest(client, request);
					return response;
				} catch (e) {
					console.error(e);
					return new Response(
						"Internal Server Error: " + (e as Error).message,
						{ status: 500, statusText: (e as Error).message }
					);
				}
			})()
		);
	}

	event.respondWith(fetch(event.request));
});

self.addEventListener("message", (event: ExtendableMessageEvent) => {
	if (event.data.type === "scramjet$type") {
		event.ports[0].postMessage("serviceworker");
	}

	if (event.data.type === "scramjet$setTransport") {
		client.setTransport(
			event.data.path as string,
			event.data.options as ConstructorParameters<BareTransport>[1]
		);
	}

	if (event.data.type === "scramjet$getTransport") {
		event.ports[0].postMessage({
			meta: client.manifest,
		});
	}
});
