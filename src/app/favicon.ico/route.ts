export const dynamic = "force-static"

export function GET() {
  return new Response(null, {
    headers: { Location: "/logo16x16.svg" },
    status: 307,
  })
}
