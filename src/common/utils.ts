export async function fetchText(url: string): Promise<string> {
	return await (await fetch(url)).text()
}

export function waitMilliseconds(ms: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms))
}
