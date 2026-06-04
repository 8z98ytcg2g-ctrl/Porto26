import CardPage from '../components/CardPage'

const FIXTURES = [
  'THU 11 JUN  20:00 🇲🇽 Mexico vs 🇿🇦 South Africa',
  'FRI 12 JUN  03:00 🇰🇷 South Korea vs 🇨🇿 Czechia',
  'FRI 12 JUN  20:00 🇨🇦 Canada vs 🇧🇦 Bosnia & Herzegovina',
  'SAT 13 JUN  02:00 🇺🇸 USA vs 🇵🇾 Paraguay',
  'SAT 13 JUN  20:00 🇶🇦 Qatar vs 🇨🇭 Switzerland',
  'SAT 13 JUN  23:00 🇧🇷 Brazil vs 🇲🇦 Morocco',
  'SUN 14 JUN  02:00 🇭🇹 Haiti vs 🏴󠁧󠁢󠁳󠁣󠁴󠁿 Scotland',
  'SUN 14 JUN  05:00 🇦🇺 Australia vs 🇹🇷 Türkiye',
  'SUN 14 JUN  18:00 🇩🇪 Germany vs 🇨🇼 Curaçao',
  'SUN 14 JUN  21:00 🇳🇱 Netherlands vs 🇯🇵 Japan',
  'MON 15 JUN  00:00 🇨🇮 Ivory Coast vs 🇪🇨 Ecuador',
  'MON 15 JUN  03:00 🇸🇪 Sweden vs 🇹🇳 Tunisia',
  'MON 15 JUN  17:00 🇪🇸 Spain vs 🇨🇻 Cape Verde',
  'MON 15 JUN  20:00 🇧🇪 Belgium vs 🇪🇬 Egypt',
  'MON 15 JUN  23:00 🇸🇦 Saudi Arabia vs 🇺🇾 Uruguay',
]

export default function Watch() {
  return (
    <CardPage
      title="WATCH"
      color="#D42B2B"
      dataUrl="/content/watch/venues.json"
      sectionLabel="WATCH"
      ticker={FIXTURES.join('   ·   ')}
    />
  )
}
