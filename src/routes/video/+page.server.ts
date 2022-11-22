export function load({ url }: {url: URL}) {
    return {
        src: url.searchParams.get("src")
    }
}