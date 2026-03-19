Deno.serve(async () => {
  return new Response(JSON.stringify({
    message: 'Daily games are now seeded manually. This function is disabled.',
    status: 'disabled'
  }), { headers: { 'Content-Type': 'application/json' } })
})
