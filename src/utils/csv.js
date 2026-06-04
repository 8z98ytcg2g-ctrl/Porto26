import Papa from 'papaparse'

export async function fetchCSV(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`)
  const text = await res.text()
  const { data, errors } = Papa.parse(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: h => h.trim(),
  })
  if (errors.length) console.warn('CSV parse warnings:', errors)
  return data
}
