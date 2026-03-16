'use client'

import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, AreaChart, Area, ComposedChart,
} from 'recharts'

// ── Color palette ─────────────────────────────────────
const TEAL = '#2fb4a8'
const BLUE = '#2e7daf'
const GREEN = '#2a7d46'
const CORAL = '#d95545'
const TERRACOTTA = '#bf5a3a'
const SLATE = '#6b7d8d'
const SAND = '#c89b6a'
const PLUM = '#8e5e91'
const SKY = '#5198c4'
const SAGE = '#6b9e5e'

const PALETTE = [TEAL, BLUE, CORAL, GREEN, TERRACOTTA, PLUM, SKY, SAND, SAGE, SLATE]

const font = { fontFamily: 'var(--font-body, "Plus Jakarta Sans", sans-serif)', fontSize: 11 }
const tooltipStyle = { ...font, fontSize: 12 }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ttFmtLocale = (v: any) => typeof v === 'number' ? v.toLocaleString() : v
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ttFmtPct = (v: any) => `${v}%`
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ttFmtMVR = (v: any) => `MVR ${v}M`

const fmtNum = (v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`
const fmtPct = (v: number) => `${v}%`

// ── Section names for TOC ─────────────────────────────────
const SECTIONS = [
  { id: 'demographics', label: 'Population and Demographics' },
  { id: 'child-protection', label: 'Child Protection' },
  { id: 'gender-gbv', label: 'Gender, GBV, Women' },
  { id: 'disability', label: 'Disability' },
  { id: 'elderly', label: 'Elderly and Ageing' },
  { id: 'substance-abuse', label: 'Substance Abuse' },
  { id: 'mental-health', label: 'Mental Health' },
  { id: 'health', label: 'Health Systems' },
  { id: 'poverty', label: 'Poverty and Housing' },
  { id: 'employment', label: 'Employment' },
  { id: 'social-protection', label: 'Social Protection' },
  { id: 'crime', label: 'Crime and Justice' },
  { id: 'covid', label: 'COVID-19 Impact' },
]

function ChartsTOC() {
  return (
    <div className="w-56 shrink-0 hidden xl:block">
      <div className="sticky top-24 pl-6 border-l border-slate-100">
        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">On this page</div>
        <ul className="space-y-1.5">
          {SECTIONS.map(s => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="text-[12px] text-slate-500 hover:text-sky-700 transition-colors leading-snug block">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// ── Section wrapper ─────────────────────────────────────
function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <div className="mb-14" id={id}>
      <h2 className="text-lg font-semibold text-slate-800 mb-6 border-b border-slate-100 pb-2 scroll-mt-20" style={{ fontFamily: 'var(--font-heading)' }}>
        {title}
      </h2>
      <div className="grid grid-cols-1 gap-8">
        {children}
      </div>
    </div>
  )
}

function Chart({ title, source, children, tall }: { title: string; source: string; children: React.ReactNode; tall?: boolean }) {
  return (
    <div className="bg-slate-50/70 rounded-xl p-5 border border-slate-100">
      <h3 className="text-sm font-semibold text-slate-700 mb-1" style={font}>{title}</h3>
      <p className="text-[10px] text-slate-400 mb-4 leading-relaxed">{source}</p>
      <div className="w-full" style={{ height: tall ? 420 : 320 }}>
        {children}
      </div>
    </div>
  )
}

// Custom pie label that renders cleanly outside
function renderPieLabel({ cx, cy, midAngle, outerRadius, name, value, percent }: any) {
  const RADIAN = Math.PI / 180
  const radius = outerRadius + 25
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  const pctStr = percent !== undefined ? ` (${(percent * 100).toFixed(0)}%)` : ''
  const label = value !== undefined && percent === undefined ? `${name}: ${value}` : `${name}${pctStr}`
  return (
    <text x={x} y={y} fill="#475569" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" style={{ ...font, fontSize: 10 }}>
      {label}
    </text>
  )
}

// ── DATA ─────────────────────────────────────────────

// Population
const populationTimeSeries = [
  { year: '1911', pop: 72237 }, { year: '1921', pop: 70413 }, { year: '1931', pop: 78825 },
  { year: '1946', pop: 82088 }, { year: '1953', pop: 85253 }, { year: '1967', pop: 103220 },
  { year: '1977', pop: 142832 }, { year: '1985', pop: 180088 }, { year: '1990', pop: 213215 },
  { year: '1995', pop: 244814 }, { year: '2000', pop: 270101 }, { year: '2006', pop: 298968 },
  { year: '2014', pop: 344023 }, { year: '2022', pop: 382639 },
]

const populationByLocality = [
  { name: "Malé City", value: 89908 },
  { name: 'Hulhumalé', value: 54879 },
  { name: "Vilimalé", value: 9576 },
  { name: 'Admin. Islands', value: 176000 },
  { name: 'Resorts', value: 38000 },
  { name: 'Industrial', value: 14000 },
]

// Population pyramid: negative values for 2014 (left side), positive for 2022 (right side)
const agePyramid = [
  { age: '0–4', left: -31834, right: 30621 },
  { age: '5–9', left: -28903, right: 33115 },
  { age: '10–14', left: -28482, right: 28584 },
  { age: '15–19', left: -29877, right: 26697 },
  { age: '20–24', left: -33753, right: 28450 },
  { age: '25–29', left: -33268, right: 31547 },
  { age: '30–34', left: -27937, right: 33253 },
  { age: '35–39', left: -21622, right: 29764 },
  { age: '40–44', left: -18004, right: 24283 },
  { age: '45–49', left: -16128, right: 19203 },
  { age: '50–54', left: -14413, right: 16538 },
  { age: '55–59', left: -10832, right: 14087 },
  { age: '60–64', left: -8290, right: 11289 },
  { age: '65–69', left: -6074, right: 8783 },
  { age: '70–74', left: -4958, right: 5792 },
  { age: '75–79', left: -2764, right: 4330 },
  { age: '80+', left: -4096, right: 5068 },
]

const tfr = [
  { year: '1990', rate: 6.40 }, { year: '1995', rate: 5.40 }, { year: '2000', rate: 3.52 },
  { year: '2005', rate: 2.62 }, { year: '2010', rate: 2.22 }, { year: '2015', rate: 2.10 },
  { year: '2017', rate: 1.78 }, { year: '2020', rate: 1.68 }, { year: '2022', rate: 1.58 },
]

const lifeExpectancy = [
  { year: '1977', total: 47 }, { year: '1990', total: 62.5, male: 63.0, female: 62.0 },
  { year: '2000', total: 72.2, male: 71.3, female: 73.2 },
  { year: '2010', total: 76.6, male: 75.4, female: 78.0 },
  { year: '2015', total: 78.0, male: 76.6, female: 79.6 },
  { year: '2020', total: 78.9, male: 77.4, female: 80.6 },
  { year: '2022', total: 81.1 },
]

const marriageDivorce = [
  { year: '2010', marriages: 6123, divorces: 2793 },
  { year: '2011', marriages: 6015, divorces: 3016 },
  { year: '2012', marriages: 5699, divorces: 3011 },
  { year: '2013', marriages: 5620, divorces: 3332 },
  { year: '2014', marriages: 5587, divorces: 3414 },
  { year: '2015', marriages: 5763, divorces: 3358 },
  { year: '2016', marriages: 5488, divorces: 3417 },
]

const divorceRatio = [
  { year: '2010', ratio: 45.6 }, { year: '2011', ratio: 50.1 }, { year: '2012', ratio: 52.8 },
  { year: '2013', ratio: 59.3 }, { year: '2014', ratio: 61.1 }, { year: '2015', ratio: 58.3 },
  { year: '2016', ratio: 62.3 },
]

const dependencyBreakdown = [
  { name: 'Children (0–17)', value: 128208 },
  { name: 'Working Age (15–64)', value: 247564 },
  { name: 'Elderly (65+)', value: 23973 },
]

// Child protection
const dvCases = [
  { year: '2013', cases: 19 }, { year: '2014', cases: 149 }, { year: '2015', cases: 438 },
  { year: '2016', cases: 642 }, { year: '2017', cases: 539 }, { year: '2021', cases: 696 },
  { year: '2024', cases: 537 },
]

const childLivingArrangement = [
  { name: 'Both parents', value: 74 },
  { name: 'One parent', value: 22 },
  { name: 'Alternative care', value: 9 },
]

const alternativeCare = [
  { name: 'Institutional care', value: 170 },
  { name: 'Foster care', value: 16 },
]

const caseloadComparison = [
  { name: 'Maldives (actual)', value: 160 },
  { name: 'International standard', value: 27.5 },
]

const juvenileDrugArrests = [
  { year: '2001', arrests: 16 },
  { year: '2006', arrests: 79 },
  { year: '2007', arrests: 164 },
]

const juvenileCasesInvestigated = [
  { year: '2023', cases: 120 },
  { year: '2024', cases: 213 },
]

// GBV
const fgmcByAge = [
  { age: '15–19', prevalence: 1 },
  { age: '20–24', prevalence: 3 },
  { age: '25–29', prevalence: 6 },
  { age: '30–34', prevalence: 10 },
  { age: '35–39', prevalence: 18 },
  { age: '40–44', prevalence: 28 },
  { age: '45–49', prevalence: 38 },
]

const womenEconParticipation = [
  { indicator: 'Labour force participation', female: 44, male: 80 },
  { indicator: 'Government employment', female: 43, male: 38 },
]

const womenPolitical = [
  { name: 'Parliament (2024)', women: 3.2, men: 96.8 },
  { name: 'Cabinet (2024)', women: 18.2, men: 81.8 },
  { name: 'Local councils (2021)', women: 39.7, men: 60.3 },
]

// GBV funnel - stepped waterfall
const gbvFunnel = [
  { stage: '100 cases reported to police', value: 100, fill: CORAL },
  { stage: '14 investigated as VAW', value: 14, fill: TERRACOTTA },
  { stage: '3 submitted for prosecution', value: 3, fill: SAND },
  { stage: '~0.5 convicted', value: 0.5, fill: SLATE },
]

// Health
const imr = [
  { year: '1990', rate: 49.8 }, { year: '2000', rate: 26.4 }, { year: '2006', rate: 16.0 },
  { year: '2010', rate: 11.2 }, { year: '2012', rate: 9.0 }, { year: '2015', rate: 7.4 },
  { year: '2020', rate: 6.2 }, { year: '2021', rate: 5.87 }, { year: '2022', rate: 5.57 },
  { year: '2023', rate: 5.27 },
]

const mmr = [
  { year: '2006', rate: 69 }, { year: '2012', rate: 49 }, { year: '2019', rate: 39 },
  { year: '2020', rate: 48 }, { year: '2021', rate: 60 }, { year: '2022', rate: 34 },
]

const ncdBurden = [
  { name: 'NCDs incl. injuries', value: 78 },
  { name: 'Communicable / maternal / child', value: 22 },
]

const childNutrition = [
  { indicator: 'Underweight (<5y)', value: 17.3 },
  { indicator: 'Overweight (<5y)', value: 5.9 },
  { indicator: 'Exclusive breastfeeding (6m)', value: 48 },
  { indicator: 'Anaemia (children)', value: 26 },
  { indicator: 'Iron deficiency (children)', value: 57 },
  { indicator: 'Vit. A deficiency (moderate)', value: 50.1 },
]

const elderlyHealthIndicators = [
  { indicator: 'Hypertension', value: 46 },
  { indicator: 'Diabetes', value: 28 },
  { indicator: 'Some form of disability', value: 45 },
]

// Poverty
const povertyByRegion = [
  { region: 'National', rate: 5.4 },
  { region: "Malé", rate: 0.9 },
  { region: 'Atolls', rate: 9.5 },
]

const povertyByAtoll = [
  { atoll: 'Gaafu Daalu', rate: 15.6 },
  { atoll: 'Thaa', rate: 14.4 },
  { atoll: 'Alif Alif', rate: 14.2 },
  { atoll: 'Addu', rate: 5.7 },
  { atoll: 'Alif Daalu', rate: 3.1 },
  { atoll: 'Waavu', rate: 2.8 },
  { atoll: 'Daalu', rate: 2.7 },
  { atoll: "Malé", rate: 0.9 },
]

const povertyByHHCharacteristic = [
  { characteristic: 'Below-primary education', rate: 12.6 },
  { characteristic: 'Overcrowded household', rate: 10.4 },
  { characteristic: 'With disability', rate: 9.6 },
  { characteristic: 'Female-headed', rate: 6.0 },
  { characteristic: 'Self-employed', rate: 5.5 },
  { characteristic: 'Male-headed', rate: 5.0 },
  { characteristic: 'Wage-earning', rate: 2.4 },
  { characteristic: 'Tertiary education', rate: 0.4 },
]

// Employment
const labourForce = [
  { year: '2019', unemployment: 5.44, youth: 16.09 },
  { year: '2020', unemployment: 5.43, youth: 16.11 },
  { year: '2021', unemployment: 5.02, youth: 15.43 },
  { year: '2022', unemployment: 4.42, youth: 14.96 },
  { year: '2023', unemployment: 4.24, youth: 15.04 },
]

// Disability
const ndrGrowth = [
  { date: 'Pre-2023', registered: 10701 },
  { date: 'Dec 2024', registered: 13656 },
  { date: 'Jul 2025', registered: 14566 },
]

const ndrVsCensus = [
  { name: 'NDR Registered (Dec 2024)', value: 13656 },
  { name: 'Unregistered (Census gap)', value: 10745 },
]

const disabilityAllowanceTiers = [
  { tier: 'MVR 3,000 (base)', pct: 42 },
  { tier: 'MVR 4,000', pct: 15 },
  { tier: 'MVR 5,000', pct: 25 },
  { tier: 'MVR 6,000+', pct: 15 },
]

const disabilityLFPR = [
  { group: 'Women with disabilities', rate: 28 },
  { group: 'Men with disabilities', rate: 41 },
  { group: 'All women', rate: 44 },
  { group: 'All men', rate: 80 },
]

// Elderly
const seniorAllowance = [
  { year: '2009', beneficiaries: 13421, amount: 2300 },
  { year: '2010', beneficiaries: 14717, amount: 2300 },
  { year: '2014', beneficiaries: 16000, amount: 5000 },
  { year: '2020', beneficiaries: 18000, amount: 5000 },
  { year: '2024', beneficiaries: 20000, amount: 5000 },
]

const ageingProjections = [
  { year: '2023', pct: 8.3 },
  { year: '2045', pct: 12.7 },
  { year: '2055', pct: 34.1 },
]

// Substance abuse
const drugInitiation2003 = [
  { substance: 'Brown sugar', pct: 43 },
  { substance: 'Cannabinoids', pct: 34 },
  { substance: 'Alcohol', pct: 12 },
  { substance: 'Other', pct: 11 },
]

const drugTreatmentPathway = [
  { pathway: 'Court-sentenced', value: 458 },
  { pathway: 'Detox seekers', value: 433 },
  { pathway: 'Detox started', value: 371 },
  { pathway: 'Voluntary applications', value: 126 },
  { pathway: 'Voluntary started', value: 108 },
]

const drugSituation2021 = [
  { indicator: 'Began before age 18', value: 57.8 },
  { indicator: 'Peer influence', value: 72.2 },
  { indicator: 'Family also using', value: 41.4 },
  { indicator: 'Injecting drug use', value: 21.6 },
  { indicator: 'Completed treatment', value: 41.4 },
  { indicator: 'Relapsed', value: 42.7 },
  { indicator: 'No community support', value: 40 },
]

// Mental health
const youthMentalHealth = [
  { indicator: 'Considered suicide', value: 19.9 },
  { indicator: 'Planned suicide', value: 16.8 },
  { indicator: 'Attempted suicide', value: 12.0 },
  { indicator: 'Attempt needing medical tx', value: 5.1 },
  { indicator: 'Felt lonely most/all time', value: 10.1 },
]

const parentalConcernByRegion = [
  { region: 'Central', pct: 73 },
  { region: 'North', pct: 69 },
  { region: 'Greater Malé', pct: 62 },
  { region: 'South', pct: 61 },
]

// Social protection
const spPrograms = [
  { program: 'Senior Citizen Allowance', beneficiaries: 20000 },
  { program: 'Disability Allowance', beneficiaries: 11371 },
  { program: 'Single Parent (children)', beneficiaries: 5563 },
  { program: 'Single Parent (parents)', beneficiaries: 3245 },
  { program: 'Foster Parent (children)', beneficiaries: 149 },
]

const spExpenditure2009 = [
  { name: 'Elderly Assistance', value: 311 },
  { name: 'Pensions', value: 95 },
  { name: 'Health Insurance', value: 78 },
  { name: 'Health Assistance', value: 37 },
  { name: 'Other Social Insurance', value: 173 },
  { name: 'Child Protection', value: 12 },
  { name: 'Other', value: 29 },
  { name: 'Labour Market', value: 7 },
]

// COVID
const covidEconomicImpact = [
  { indicator: 'GDP contraction', value: 33.6 },
  { indicator: 'Revenue fall', value: 49 },
  { indicator: 'Tourism decline', value: 67.4 },
  { indicator: 'Households with income loss', value: 44 },
]

const covidGenderImpact = [
  { indicator: 'Female mfg workers stopped', value: 22 },
  { indicator: 'Male mfg workers stopped', value: 8 },
  { indicator: 'Relief loans to women', value: 15 },
  { indicator: 'Relief loans to men', value: 74 },
]

// Crime
const crimeCategories = [
  { category: 'Drug-Related', y2023: 4479, y2024: 3279 },
  { category: 'Assaults', y2021: 1611, y2024: 1436 },
  { category: 'Domestic Violence', y2021: 696, y2024: 537 },
  { category: 'Sexual Offences', y2022: 575, y2024: 467 },
]

const emergingCrimes = [
  { category: 'Bullying', y2023: 4, y2024: 12 },
  { category: 'Blackmail', y2023: 5, y2024: 15 },
  { category: 'Threats', y2023: 18, y2024: 25 },
  { category: 'Suicide attempts', y2023: 7, y2024: 9 },
  { category: 'Sexual harassment', y2023: 4, y2024: 5 },
]

const prisonProfile = [
  { characteristic: 'Drug offenders', value: 65 },
  { characteristic: 'Poor/working class', value: 64.7 },
  { characteristic: 'Divorced', value: 47.1 },
]

// Higher education
const higherEd = [
  { year: '2019', enrolments: 27421, graduates: 11254, dropouts: 2691 },
  { year: '2020', enrolments: 26825, graduates: 7245, dropouts: 1991 },
  { year: '2021', enrolments: 26733, graduates: 12837, dropouts: 4066 },
  { year: '2022', enrolments: 29016, graduates: 6093, dropouts: 2897 },
]

export default function ChartsLibrary() {
  return (
    <div className="flex gap-6 pb-20">
      <div className="flex-1 min-w-0 max-w-[900px]">

      {/* ══════ DEMOGRAPHICS ══════ */}
      <Section id="demographics" title="Population and Demographics">
        <Chart title="Maldivian Population Growth, 1911–2022" source="Source: MBS Population and Housing Census 1911–2022">
          <ResponsiveContainer>
            <AreaChart data={populationTimeSeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={font} />
              <YAxis tickFormatter={fmtNum} tick={font} />
              <Tooltip formatter={ttFmtLocale} contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="pop" name="Population" stroke={TEAL} fill={TEAL} fillOpacity={0.12} strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </Chart>

        <Chart title="Population by Locality, Census 2022" source="Source: Census 2022 Results Summary, MBS">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={populationByLocality} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={95} label={renderPieLabel} labelLine={{ stroke: '#94a3b8' }} style={font}>
                {populationByLocality.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
              </Pie>
              <Tooltip formatter={ttFmtLocale} contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </Chart>

        <Chart title="Population by Dependency Group, 2022" source="Source: Census 2022, MBS">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={dependencyBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={95} label={renderPieLabel} labelLine={{ stroke: '#94a3b8' }} style={font}>
                <Cell fill={SKY} />
                <Cell fill={TEAL} />
                <Cell fill={CORAL} />
              </Pie>
              <Tooltip formatter={ttFmtLocale} contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </Chart>

        <Chart title="Population Pyramid: Census 2014 vs 2022" source="Source: Population and Housing Census 2014 and 2022, MBS" wide tall>
          <ResponsiveContainer>
            <BarChart data={agePyramid} layout="vertical" stackOffset="sign" barCategoryGap="12%">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tickFormatter={(v: number) => fmtNum(Math.abs(v))} tick={font} />
              <YAxis type="category" dataKey="age" tick={font} width={42} />
              <Tooltip formatter={(v: any) => Math.abs(v).toLocaleString()} contentStyle={tooltipStyle} />
              <Legend wrapperStyle={font} />
              <Bar dataKey="left" name="Census 2014" fill={BLUE} stackId="stack" />
              <Bar dataKey="right" name="Census 2022" fill={TEAL} stackId="stack" />
            </BarChart>
          </ResponsiveContainer>
        </Chart>

        <Chart title="Total Fertility Rate, 1990–2022" source="Sources: DHS 2009; DHS 2016-17; World Bank WDI; UNFPA Maldives">
          <ResponsiveContainer>
            <LineChart data={tfr}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={font} />
              <YAxis domain={[0, 7]} tick={font} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="rate" name="Births per woman" stroke={CORAL} strokeWidth={2.5} dot={{ r: 4, fill: CORAL }} />
            </LineChart>
          </ResponsiveContainer>
        </Chart>

        <Chart title="Life Expectancy at Birth, 1977–2022" source="Sources: World Bank WDI; UN DESA; WHO Global Health Observatory">
          <ResponsiveContainer>
            <LineChart data={lifeExpectancy}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={font} />
              <YAxis domain={[40, 85]} tick={font} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={font} />
              <Line type="monotone" dataKey="total" name="Total" stroke={TEAL} strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="male" name="Male" stroke={BLUE} strokeWidth={1.5} strokeDasharray="5 5" dot={{ r: 2 }} connectNulls />
              <Line type="monotone" dataKey="female" name="Female" stroke={CORAL} strokeWidth={1.5} strokeDasharray="5 5" dot={{ r: 2 }} connectNulls />
            </LineChart>
          </ResponsiveContainer>
        </Chart>

        <Chart title="Marriages and Divorces, 2010–2016" source="Source: Statistical Yearbook of Maldives 2023">
          <ResponsiveContainer>
            <ComposedChart data={marriageDivorce}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={font} />
              <YAxis tick={font} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={font} />
              <Bar dataKey="marriages" name="Marriages" fill={TEAL} opacity={0.75} />
              <Bar dataKey="divorces" name="Divorces" fill={CORAL} opacity={0.75} />
            </ComposedChart>
          </ResponsiveContainer>
        </Chart>

        <Chart title="Divorce-to-Marriage Ratio, 2010–2016" source="Source: Statistical Yearbook of Maldives 2023">
          <ResponsiveContainer>
            <LineChart data={divorceRatio}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={font} />
              <YAxis tickFormatter={fmtPct} domain={[40, 65]} tick={font} />
              <Tooltip formatter={ttFmtPct} contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="ratio" name="Divorces per 100 marriages" stroke={TERRACOTTA} strokeWidth={2.5} dot={{ r: 4, fill: TERRACOTTA }} />
            </LineChart>
          </ResponsiveContainer>
        </Chart>
      </Section>

      {/* ══════ CHILD PROTECTION ══════ */}
      <Section id="child-protection" title="Child Protection and Child Rights">
        <Chart title="Domestic Violence Cases Reported to FPA, 2013–2024" source="Source: Family Protection Authority annual records; MPS Bureau of Crime Statistics">
          <ResponsiveContainer>
            <BarChart data={dvCases}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={font} />
              <YAxis tick={font} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="cases" name="DV cases reported" fill={CORAL} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Chart>

        <Chart title="Children's Living Arrangements, Census 2022" source="Source: Census 2022 Children's Equity Report, MBS">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={childLivingArrangement} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={95} label={({ name, value }: any) => `${name}: ${value}%`} labelLine={{ stroke: '#94a3b8' }} style={font}>
                <Cell fill={TEAL} />
                <Cell fill={BLUE} />
                <Cell fill={CORAL} />
              </Pie>
              <Tooltip formatter={ttFmtPct} contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </Chart>

        <Chart title="Children in Alternative Care by Type, March 2023" source="Source: MoSFD administrative data; CRC State Party Report 2021">
          <ResponsiveContainer>
            <BarChart data={alternativeCare} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={font} />
              <YAxis type="category" dataKey="name" tick={font} width={120} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="value" name="Children" radius={[0, 3, 3, 0]}>
                <Cell fill={TERRACOTTA} />
                <Cell fill={TEAL} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Chart>

        <Chart title="Child Protection Cases per Social Worker" source="Source: Rogers, Ali & Naeem (2025); MoSFD staffing data. 61 social workers serve 128,208 children (0–17).">
          <ResponsiveContainer>
            <BarChart data={caseloadComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={font} />
              <YAxis tick={font} label={{ value: 'Cases per worker', angle: -90, position: 'insideLeft', style: { ...font, fill: '#94a3b8' } }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="value" name="Cases per worker" radius={[3, 3, 0, 0]} barSize={80}>
                <Cell fill={CORAL} />
                <Cell fill={TEAL} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Chart>

        <Chart title="Juvenile Drug Arrests, 2001–2007" source="Source: DJJ records; MPS Bureau of Crime Statistics; UNODC Maldives">
          <ResponsiveContainer>
            <BarChart data={juvenileDrugArrests}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={font} />
              <YAxis tick={font} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="arrests" name="Juvenile drug arrests" fill={TERRACOTTA} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Chart>

        <Chart title="Juvenile Cases Investigated by MPS, 2023–2024" source="Source: MPS Bureau of Crime Statistics">
          <ResponsiveContainer>
            <BarChart data={juvenileCasesInvestigated}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={font} />
              <YAxis tick={font} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="cases" name="Cases investigated" fill={BLUE} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Chart>
      </Section>

      {/* ══════ GENDER / GBV ══════ */}
      <Section id="gender-gbv" title="Gender, GBV, and Women's Empowerment">
        <Chart title="GBV Justice Pathway: Cases Lost at Each Stage" source="Sources: Vulnerability Mapping files; AIM Project; UNDP Maldives. For every 100 GBV cases reported to police.">
          <ResponsiveContainer>
            <BarChart data={gbvFunnel} layout="vertical" barSize={36}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={font} domain={[0, 100]} />
              <YAxis type="category" dataKey="stage" tick={font} width={200} />
              <Tooltip formatter={ttFmtLocale} contentStyle={tooltipStyle} />
              <Bar dataKey="value" name="Cases remaining" radius={[0, 4, 4, 0]}>
                {gbvFunnel.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Chart>

        <Chart title="FGM/C Prevalence by Age Group" source="Source: Maldives DHS 2016-17">
          <ResponsiveContainer>
            <BarChart data={fgmcByAge}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="age" tick={font} />
              <YAxis tickFormatter={fmtPct} tick={font} />
              <Tooltip formatter={ttFmtPct} contentStyle={tooltipStyle} />
              <Bar dataKey="prevalence" name="FGM/C prevalence" fill={PLUM} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Chart>

        <Chart title="Labour Force Participation by Gender, Census 2022" source="Source: Census 2022">
          <ResponsiveContainer>
            <BarChart data={womenEconParticipation}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="indicator" tick={font} />
              <YAxis tickFormatter={fmtPct} domain={[0, 100]} tick={font} />
              <Tooltip formatter={ttFmtPct} contentStyle={tooltipStyle} />
              <Legend wrapperStyle={font} />
              <Bar dataKey="female" name="Female" fill={CORAL} radius={[3, 3, 0, 0]} />
              <Bar dataKey="male" name="Male" fill={BLUE} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Chart>

        <Chart title="Women's Political Representation" source="Sources: People's Majlis records; Elections Commission; CEDAW/C/MDV/CO/6">
          <ResponsiveContainer>
            <BarChart data={womenPolitical} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tickFormatter={fmtPct} domain={[0, 100]} tick={font} />
              <YAxis type="category" dataKey="name" tick={font} width={140} />
              <Tooltip formatter={ttFmtPct} contentStyle={tooltipStyle} />
              <Legend wrapperStyle={font} />
              <Bar dataKey="women" name="Women" fill={CORAL} stackId="a" />
              <Bar dataKey="men" name="Men" fill={SLATE} stackId="a" opacity={0.3} />
            </BarChart>
          </ResponsiveContainer>
        </Chart>
      </Section>

      {/* ══════ DISABILITY ══════ */}
      <Section id="disability" title="Disability">
        <Chart title="National Disability Register Growth" source="Source: NSPA; CRPD State Party Report review, August 2025">
          <ResponsiveContainer>
            <BarChart data={ndrGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={font} />
              <YAxis tickFormatter={fmtNum} tick={font} />
              <Tooltip formatter={ttFmtLocale} contentStyle={tooltipStyle} />
              <Bar dataKey="registered" name="Registered persons" fill={TEAL} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Chart>

        <Chart title="NDR Coverage: Registered vs Census (Dec 2024)" source="Source: Census 2022 (WG-SS); NSPA NDR data">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={ndrVsCensus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={95} label={renderPieLabel} labelLine={{ stroke: '#94a3b8' }} style={font}>
                <Cell fill={TEAL} />
                <Cell fill={SLATE} />
              </Pie>
              <Tooltip formatter={ttFmtLocale} contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </Chart>

        <Chart title="Disability Allowance by Tier (2023)" source="Source: NSPA administrative data; Hameed et al. (2022)">
          <ResponsiveContainer>
            <BarChart data={disabilityAllowanceTiers}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="tier" tick={font} />
              <YAxis tickFormatter={fmtPct} tick={font} />
              <Tooltip formatter={ttFmtPct} contentStyle={tooltipStyle} />
              <Bar dataKey="pct" name="% of recipients" fill={GREEN} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Chart>

        <Chart title="Labour Force Participation by Disability Status and Gender" source="Source: Census 2022">
          <ResponsiveContainer>
            <BarChart data={disabilityLFPR} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tickFormatter={fmtPct} domain={[0, 100]} tick={font} />
              <YAxis type="category" dataKey="group" tick={font} width={160} />
              <Tooltip formatter={ttFmtPct} contentStyle={tooltipStyle} />
              <Bar dataKey="rate" name="LFPR" radius={[0, 3, 3, 0]}>
                {disabilityLFPR.map((_, i) => <Cell key={i} fill={[CORAL, BLUE, CORAL, BLUE][i]} opacity={i < 2 ? 1 : 0.45} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Chart>
      </Section>

      {/* ══════ ELDERLY ══════ */}
      <Section id="elderly" title="Elderly Care and Population Ageing">
        <Chart title="Population Aged 60+: Projected Trajectory" source="Sources: Census 2022; UN DESA Population Projections">
          <ResponsiveContainer>
            <AreaChart data={ageingProjections}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={font} />
              <YAxis tickFormatter={fmtPct} domain={[0, 40]} tick={font} />
              <Tooltip formatter={ttFmtPct} contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="pct" name="% aged 60+" stroke={TERRACOTTA} fill={TERRACOTTA} fillOpacity={0.12} strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </Chart>

        <Chart title="Elderly Health Indicators (prevalence %)" source="Source: MoH data; National Elderly Policy 2018">
          <ResponsiveContainer>
            <BarChart data={elderlyHealthIndicators} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tickFormatter={fmtPct} domain={[0, 50]} tick={font} />
              <YAxis type="category" dataKey="indicator" tick={font} width={130} />
              <Tooltip formatter={ttFmtPct} contentStyle={tooltipStyle} />
              <Bar dataKey="value" name="Prevalence" fill={TERRACOTTA} radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Chart>

        <Chart title="Senior Citizen Allowance: Beneficiaries and Monthly Amount" source="Source: NSPA; MPRS annual reports; national budget documents">
          <ResponsiveContainer>
            <ComposedChart data={seniorAllowance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={font} />
              <YAxis yAxisId="left" tickFormatter={fmtNum} tick={font} />
              <YAxis yAxisId="right" orientation="right" tick={font} tickFormatter={(v: number) => `MVR ${v.toLocaleString()}`} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={font} />
              <Bar yAxisId="left" dataKey="beneficiaries" name="Beneficiaries" fill={TEAL} opacity={0.75} radius={[3, 3, 0, 0]} />
              <Line yAxisId="right" type="stepAfter" dataKey="amount" name="Monthly amount (MVR)" stroke={CORAL} strokeWidth={2.5} dot={{ r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </Chart>
      </Section>

      {/* ══════ SUBSTANCE ABUSE ══════ */}
      <Section id="substance-abuse" title="Substance Abuse and Drug Policy">
        <Chart title="Drug of First Initiation, RAS 2003" source="Source: UNODC Rapid Assessment Survey 2003">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={drugInitiation2003} dataKey="pct" nameKey="substance" cx="50%" cy="50%" outerRadius={95} label={({ substance, pct }: any) => `${substance}: ${pct}%`} labelLine={{ stroke: '#94a3b8' }} style={font}>
                {drugInitiation2003.map((_, i) => <Cell key={i} fill={PALETTE[i]} />)}
              </Pie>
              <Tooltip formatter={ttFmtPct} contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </Chart>

        <Chart title="Drug Treatment Pathways, 2022" source="Source: NDA annual reports; UNODC Maldives">
          <ResponsiveContainer>
            <BarChart data={drugTreatmentPathway} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={font} />
              <YAxis type="category" dataKey="pathway" tick={font} width={150} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="value" name="Persons" fill={BLUE} radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Chart>

        <Chart title="Drug Use Situational Analysis 2021: Key Indicators" source="Source: National Situational Analysis of Drug Users 2021">
          <ResponsiveContainer>
            <BarChart data={drugSituation2021} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tickFormatter={fmtPct} tick={font} />
              <YAxis type="category" dataKey="indicator" tick={font} width={150} />
              <Tooltip formatter={ttFmtPct} contentStyle={tooltipStyle} />
              <Bar dataKey="value" name="% of respondents" radius={[0, 3, 3, 0]}>
                {drugSituation2021.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Chart>
      </Section>

      {/* ══════ MENTAL HEALTH ══════ */}
      <Section id="mental-health" title="Mental Health">
        <Chart title="Youth Mental Health Indicators, GSHS 2009/2014" source="Sources: WHO GSHS Maldives 2009, 2014">
          <ResponsiveContainer>
            <BarChart data={youthMentalHealth} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tickFormatter={fmtPct} tick={font} />
              <YAxis type="category" dataKey="indicator" tick={font} width={170} />
              <Tooltip formatter={ttFmtPct} contentStyle={tooltipStyle} />
              <Bar dataKey="value" name="Prevalence (%)" radius={[0, 3, 3, 0]}>
                {youthMentalHealth.map((_, i) => <Cell key={i} fill={[CORAL, TERRACOTTA, PLUM, SLATE, BLUE][i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Chart>

        <Chart title="Parental Concern About Children's Mental Health by Region, KAP 2023" source="Source: Knowledge, Attitudes and Practices (KAP) Survey 2023">
          <ResponsiveContainer>
            <BarChart data={parentalConcernByRegion}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="region" tick={font} />
              <YAxis tickFormatter={fmtPct} domain={[0, 100]} tick={font} />
              <Tooltip formatter={ttFmtPct} contentStyle={tooltipStyle} />
              <Bar dataKey="pct" name="% parents worried" fill={SKY} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Chart>
      </Section>

      {/* ══════ HEALTH ══════ */}
      <Section id="health" title="Health Systems and Outcomes">
        <Chart title="Infant Mortality Rate, 1990–2023 (per 1,000 live births)" source="Sources: World Bank WDI; WHO; Statistical Yearbook of Maldives">
          <ResponsiveContainer>
            <AreaChart data={imr}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={font} />
              <YAxis tick={font} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="rate" name="IMR" stroke={TEAL} fill={TEAL} fillOpacity={0.1} strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </Chart>

        <Chart title="Maternal Mortality Ratio, 2006–2022 (per 100,000 live births)" source="Sources: World Bank WDI; WHO; Macrotrends">
          <ResponsiveContainer>
            <LineChart data={mmr}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={font} />
              <YAxis tick={font} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="rate" name="MMR" stroke={CORAL} strokeWidth={2.5} dot={{ r: 4, fill: CORAL }} />
            </LineChart>
          </ResponsiveContainer>
        </Chart>

        <Chart title="Disease Burden: NCDs vs Communicable (% of DALYs)" source="Source: WHO/Global Burden of Disease">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={ncdBurden} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={95} label={({ name, value }: any) => `${name}: ${value}%`} labelLine={{ stroke: '#94a3b8' }} style={font}>
                <Cell fill={TERRACOTTA} />
                <Cell fill={SAGE} />
              </Pie>
              <Tooltip formatter={ttFmtPct} contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </Chart>

        <Chart title="Child and Maternal Nutrition Indicators" source="Sources: DHS 2009; National Micronutrient Survey 2007">
          <ResponsiveContainer>
            <BarChart data={childNutrition} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tickFormatter={fmtPct} tick={font} />
              <YAxis type="category" dataKey="indicator" tick={font} width={170} />
              <Tooltip formatter={ttFmtPct} contentStyle={tooltipStyle} />
              <Bar dataKey="value" name="Prevalence (%)" radius={[0, 3, 3, 0]}>
                {childNutrition.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Chart>
      </Section>

      {/* ══════ POVERTY ══════ */}
      <Section id="poverty" title="Poverty, Housing, and Economic Vulnerability">
        <Chart title="Poverty Headcount Rate by Region, HIES 2019" source="Source: HIES 2019; World Bank Poverty and Inequality in Maldives 2022">
          <ResponsiveContainer>
            <BarChart data={povertyByRegion}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="region" tick={font} />
              <YAxis tickFormatter={fmtPct} tick={font} />
              <Tooltip formatter={ttFmtPct} contentStyle={tooltipStyle} />
              <Bar dataKey="rate" name="Poverty rate" radius={[3, 3, 0, 0]}>
                {povertyByRegion.map((_, i) => <Cell key={i} fill={[CORAL, TEAL, TERRACOTTA][i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Chart>

        <Chart title="Poverty Rate by Atoll, HIES 2019" source="Source: World Bank Poverty and Inequality in Maldives 2022">
          <ResponsiveContainer>
            <BarChart data={povertyByAtoll} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tickFormatter={fmtPct} tick={font} />
              <YAxis type="category" dataKey="atoll" tick={font} width={80} />
              <Tooltip formatter={ttFmtPct} contentStyle={tooltipStyle} />
              <Bar dataKey="rate" name="Poverty rate" fill={TERRACOTTA} radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Chart>

        <Chart title="Poverty Rate by Household Head Characteristics" source="Source: World Bank Poverty and Inequality in Maldives 2022">
          <ResponsiveContainer>
            <BarChart data={povertyByHHCharacteristic} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tickFormatter={fmtPct} tick={font} />
              <YAxis type="category" dataKey="characteristic" tick={font} width={160} />
              <Tooltip formatter={ttFmtPct} contentStyle={tooltipStyle} />
              <Bar dataKey="rate" name="Poverty rate" radius={[0, 3, 3, 0]}>
                {povertyByHHCharacteristic.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Chart>
      </Section>

      {/* ══════ EMPLOYMENT ══════ */}
      <Section id="employment" title="Employment and Labour Market">
        <Chart title="Unemployment and Youth Unemployment, 2019–2023" source="Sources: ILO modelled estimates; World Bank WDI; Census 2022">
          <ResponsiveContainer>
            <LineChart data={labourForce}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={font} />
              <YAxis tickFormatter={fmtPct} tick={font} />
              <Tooltip formatter={ttFmtPct} contentStyle={tooltipStyle} />
              <Legend wrapperStyle={font} />
              <Line type="monotone" dataKey="unemployment" name="Overall unemployment" stroke={TEAL} strokeWidth={2.5} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="youth" name="Youth unemployment (15–24)" stroke={CORAL} strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Chart>

        <Chart title="Higher Education: Enrolments, Graduates, Dropouts, 2019–2022" source="Source: Ministry of Higher Education">
          <ResponsiveContainer>
            <ComposedChart data={higherEd}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={font} />
              <YAxis tickFormatter={fmtNum} tick={font} />
              <Tooltip formatter={ttFmtLocale} contentStyle={tooltipStyle} />
              <Legend wrapperStyle={font} />
              <Bar dataKey="enrolments" name="Enrolments" fill={TEAL} opacity={0.7} radius={[3, 3, 0, 0]} />
              <Bar dataKey="graduates" name="Graduates" fill={GREEN} opacity={0.7} radius={[3, 3, 0, 0]} />
              <Bar dataKey="dropouts" name="Dropouts" fill={CORAL} opacity={0.7} radius={[3, 3, 0, 0]} />
            </ComposedChart>
          </ResponsiveContainer>
        </Chart>
      </Section>

      {/* ══════ SOCIAL PROTECTION ══════ */}
      <Section id="social-protection" title="Social Protection">
        <Chart title="Social Protection Programs: Beneficiaries" source="Source: NSPA; MoSFD (2023–2024)">
          <ResponsiveContainer>
            <BarChart data={spPrograms} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tickFormatter={fmtNum} tick={font} />
              <YAxis type="category" dataKey="program" tick={font} width={160} />
              <Tooltip formatter={ttFmtLocale} contentStyle={tooltipStyle} />
              <Bar dataKey="beneficiaries" name="Beneficiaries" radius={[0, 3, 3, 0]}>
                {spPrograms.map((_, i) => <Cell key={i} fill={PALETTE[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Chart>

        <Chart title="Social Protection Expenditure by Component, 2009 (MVR millions)" source="Source: ADB Social Protection Index 2012">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={spExpenditure2009} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85} label={renderPieLabel} labelLine={{ stroke: '#94a3b8' }} style={{ ...font, fontSize: 10 }}>
                {spExpenditure2009.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
              </Pie>
              <Tooltip formatter={ttFmtMVR} contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </Chart>
      </Section>

      {/* ══════ CRIME ══════ */}
      <Section id="crime" title="Crime and Justice">
        <Chart title="Major Crime Categories: Year-on-Year Comparison" source="Source: MPS Bureau of Crime Statistics; MV+ 2024">
          <ResponsiveContainer>
            <BarChart data={crimeCategories}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="category" tick={font} />
              <YAxis tickFormatter={fmtNum} tick={font} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={font} />
              <Bar dataKey="y2021" name="2021" fill={SLATE} opacity={0.4} radius={[3, 3, 0, 0]} />
              <Bar dataKey="y2022" name="2022" fill={BLUE} opacity={0.5} radius={[3, 3, 0, 0]} />
              <Bar dataKey="y2023" name="2023" fill={TEAL} opacity={0.7} radius={[3, 3, 0, 0]} />
              <Bar dataKey="y2024" name="2024" fill={CORAL} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Chart>

        <Chart title="Emerging Crime Trends: 2023 vs 2024 (Jan–Sep)" source="Source: MPS Bureau of Crime Statistics">
          <ResponsiveContainer>
            <BarChart data={emergingCrimes} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={font} />
              <YAxis type="category" dataKey="category" tick={font} width={130} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={font} />
              <Bar dataKey="y2023" name="2023" fill={BLUE} radius={[0, 3, 3, 0]} />
              <Bar dataKey="y2024" name="2024 (Jan–Sep)" fill={CORAL} radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Chart>

        <Chart title="Prison Population Profile" source="Source: MCS Prison Review; Vulnerability Mapping">
          <ResponsiveContainer>
            <BarChart data={prisonProfile} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tickFormatter={fmtPct} domain={[0, 80]} tick={font} />
              <YAxis type="category" dataKey="characteristic" tick={font} width={130} />
              <Tooltip formatter={ttFmtPct} contentStyle={tooltipStyle} />
              <Bar dataKey="value" name="% of prisoners" radius={[0, 3, 3, 0]}>
                {prisonProfile.map((_, i) => <Cell key={i} fill={[TERRACOTTA, SLATE, PLUM][i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Chart>
      </Section>

      {/* ══════ COVID ══════ */}
      <Section id="covid" title="COVID-19 Socioeconomic Impact">
        <Chart title="COVID-19 Economic Impact Indicators, 2020" source="Sources: Ministry of Finance; World Bank; MMA">
          <ResponsiveContainer>
            <BarChart data={covidEconomicImpact} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tickFormatter={fmtPct} tick={font} />
              <YAxis type="category" dataKey="indicator" tick={font} width={170} />
              <Tooltip formatter={ttFmtPct} contentStyle={tooltipStyle} />
              <Bar dataKey="value" name="% decline/impact" radius={[0, 3, 3, 0]}>
                {covidEconomicImpact.map((_, i) => <Cell key={i} fill={[CORAL, TERRACOTTA, PLUM, SLATE][i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Chart>

        <Chart title="COVID-19 Gender Impact" source="Sources: World Bank Livelihood Impact Assessment; UNDP rapid assessment">
          <ResponsiveContainer>
            <BarChart data={covidGenderImpact} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tickFormatter={fmtPct} tick={font} />
              <YAxis type="category" dataKey="indicator" tick={font} width={190} />
              <Tooltip formatter={ttFmtPct} contentStyle={tooltipStyle} />
              <Bar dataKey="value" name="%" radius={[0, 3, 3, 0]}>
                {covidGenderImpact.map((_, i) => <Cell key={i} fill={[CORAL, BLUE, CORAL, BLUE][i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Chart>
      </Section>

      </div>
      <ChartsTOC />
    </div>
  )
}
