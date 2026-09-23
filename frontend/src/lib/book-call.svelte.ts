/* Shared open/close state for the site-wide "Request a call" modal. */
export const bookCall = $state({ open: false });

export function openBookCall() {
	bookCall.open = true;
}

export function closeBookCall() {
	bookCall.open = false;
}
