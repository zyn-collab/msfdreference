'use client'

import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, AreaChart, Area, ComposedChart,
  RadialBarChart, RadialBar,
} from 'recharts'

// ── Color palette ─────────────────────────────────────
const TEAL = '#2d9e9e'
const BLUE = '#4a7fb5'
const GREEN = '#5a9e6f'
const CORAL = '#e07a5f'
const TERRACOTTA = '#c17858'
const SLATE = '#7e8c9a'
const SAND = '#d4a574'
const PLUM = '#8b6e8e'
const SKY = '#6ba3c7'
const SAGE = '#8fae8b'

const PALETTE = [TEAL, BLUE, CORAL, GREEN, TERRACOTTA, PLUM, SKY, SAND, SAGE, SLATE]

const font = { fontFamily: 'var(--font-body, "Plus Jakarta Sans", sans-serif)', fontSize: 11 }
const tooltipStyle = { ...font, fontSize: 12 }

// ── Section wrapper ─────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-14">
      <h2 className="text-lg font-semibold text-slate-800 mb-6 border-b border-slate-100 pb-2" style={{ fontFamily: 'var(--font-heading)' }}>
        {title}
      </h2>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {children}
      </div>
    </div>
  )
}

function Chart({ title, source, children, wide }: { title: string; source: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className={`bg-slate-50/70 rounded-xl p-5 border border-slate-100 ${wide ? 'xl:col-span-2' : ''}`}>
      <h3 className="text-sm font-semibold text-slate-700 mb-1" style={font}>{title}</h3>
      <p className="text-[10px] text-slate-400 mb-4 leading-relaxed">{source}</p>
      <div className="w-full" style={{ height: 320 }}>
        {children}
      </div>
    </div>
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

const ageStructure = [
  { age: '0–4', y2014: 31834, y2022: 30621 },
  { age: '5–9', y2014: 28903, y2022: 33115 },
  { age: '10–14', y2014: 28482, y2022: 28584 },
  { age: '15–19', y2014: 29877, y2022: 26697 },
  { age: '20–24', y2014: 33753, y2022: 28450 },
  { age: '25–29', y2014: 33268, y2022: 31547 },
  { age: '30–34', y2014: 27937, y2022: 33253 },
  { age: '35–39', y2014: 21622, y2022: 29764 },
  { age: '40–44', y2014: 18004, y2022: 24283 },
  { age: '45–49', y2014: 16128, y2022: 19203 },
  { age: '50–54', y2014: 14413, y2022: 16538 },
  { age: '55–59', y2014: 10832, y2022: 14087 },
  { age: '60–64', y2014: 8290, y2022: 11289 },
  { age: '65–69', y2014: 6074, y2022: 8783 },
  { age: '70–74', y2014: 4958, y2022: 5792 },
  { age: '75–79', y2014: 2764, y2022: 4330 },
  { age: '80+', y2014: 4096, y2022: 5068 },
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
  { name: 'Maldives actual', value: 160 },
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
  { indicator: 'Labour force\nparticipation', female: 44, male: 80 },
  { indicator: 'Government\nemployment', female: 43, male: 38 },
]

const womenPolitical = [
  { name: 'Parliament (2024)', women: 3.2, men: 96.8 },
  { name: 'Cabinet (2024)', women: 18.2, men: 81.8 },
  { name: 'Local councils (2021)', women: 39.7, men: 60.3 },
]

const criminalJusticeFunnel = [
  { stage: 'Cases reported\nto police', value: 100 },
  { stage: 'Submitted for\nprosecution', value: 3 },
  { stage: 'Reaching court', value: 2 },
  { stage: 'Convicted', value: 0.5 },
]

// Health
const imr = [
  { year: '1990', rate: 49.8 }, { year: '2000', rate: 26.4 }, { year: '2006', rate: 16.0 },
  { year: '2010', rate: 11.2 }, { year: '2012', rate: 9.0 }, { year: '2015', rate: 7.4 },
  { year: '2020', rate: 6.2 }, { year: '2021', rate: 5.87 }, { year: '2022', rate: 5.57 },
  { year: '2023', rate: 5.27 },
]

const mmr = [
  { year: '2006', rate: 69 }, { year: '2012', rate: 13 }, { year: '2019', rate: 39 },
  { year: '2020', rate: 48 }, { year: '2021', rate: 60 }, { year: '2022', rate: 34 },
]

const ncdBurden = [
  { name: 'NCDs (incl. injuries)', value: 78 },
  { name: 'Communicable/\nmaternal/child', value: 22 },
]

const childNutrition = [
  { indicator: 'Underweight\n(<5 years)', value: 17.3 },
  { indicator: 'Overweight\n(<5 years)', value: 5.9 },
  { indicator: 'Exclusive\nbreastfeeding\n(6 months)', value: 48 },
  { indicator: 'Anaemia\n(children)', value: 26 },
  { indicator: 'Iron\ndeficiency\n(children)', value: 57 },
  { indicator: 'Vitamin A\ndeficiency\n(moderate)', value: 50.1 },
]

const elderlyHealthIndicators = [
  { indicator: 'Hypertension', value: 46 },
  { indicator: 'Diabetes', value: 28 },
  { indicator: 'Some disability', value: 45 },
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
  { characteristic: 'Below-primary\neducation', rate: 12.6 },
  { characteristic: 'Overcrowded\nhousehold', rate: 10.4 },
  { characteristic: 'With disability', rate: 9.6 },
  { characteristic: 'Female-headed', rate: 6.0 },
  { characteristic: 'Self-employed', rate: 5.5 },
  { characteristic: 'Male-headed', rate: 5.0 },
  { characteristic: 'Wage-earning', rate: 2.4 },
  { characteristic: 'Tertiary\neducation', rate: 0.4 },
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
  { name: 'NDR Registered\n(Dec 2024)', value: 13656 },
  { name: 'Unregistered\n(Census gap)', value: 10745 },
]

const disabilityAllowanceTiers = [
  { tier: 'MVR 3,000\n(base)', pct: 42 },
  { tier: 'MVR 4,000', pct: 15 },
  { tier: 'MVR 5,000', pct: 25 },
  { tier: 'MVR 6,000+', pct: 15 },
]

const disabilityLFPR = [
  { group: 'Women with\ndisabilities', rate: 28 },
  { group: 'Men with\ndisabilities', rate: 41 },
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
  { pathway: 'Court-sentenced\n(2022)', value: 458 },
  { pathway: 'Detox seekers\n(2022)', value: 433 },
  { pathway: 'Detox started\n(2022)', value: 371 },
  { pathway: 'Voluntary\napplications', value: 126 },
  { pathway: 'Voluntary\nstarted', value: 108 },
]

const drugSituation2021 = [
  { indicator: 'Began before\nage 18', value: 57.8 },
  { indicator: 'Peer influence\nas reason', value: 72.2 },
  { indicator: 'Family also\nusing', value: 41.4 },
  { indicator: 'Injecting\ndrug use', value: 21.6 },
  { indicator: 'Completed\ntreatment', value: 41.4 },
  { indicator: 'Relapsed', value: 42.7 },
  { indicator: 'No community\nsupport', value: 40 },
]

// Mental health
const youthMentalHealth = [
  { indicator: 'Considered\nsuicide', value: 19.9, year: '2009' },
  { indicator: 'Planned\nsuicide', value: 16.8, year: '2014' },
  { indicator: 'Attempted\nsuicide', value: 12.0, year: '2014' },
  { indicator: 'Attempt\nneeding\nmedical tx', value: 5.1, year: '2014' },
  { indicator: 'Felt lonely\nmost/all time', value: 10.1, year: '2014' },
]

const parentalConcernByRegion = [
  { region: 'Central', pct: 73 },
  { region: 'North', pct: 69 },
  { region: "Greater\nMalé", pct: 62 },
  { region: 'South', pct: 61 },
]

// Social protection
const spPrograms = [
  { program: 'Senior Citizen\nAllowance', beneficiaries: 20000 },
  { program: 'Disability\nAllowance', beneficiaries: 11371 },
  { program: 'Single Parent\nAllowance\n(children)', beneficiaries: 5563 },
  { program: 'Single Parent\nAllowance\n(parents)', beneficiaries: 3245 },
  { program: 'Foster Parent\nAllowance\n(children)', beneficiaries: 149 },
]

const spExpenditure2009 = [
  { name: 'Elderly Assistance', value: 311 },
  { name: 'Pensions', value: 95 },
  { name: 'Health Insurance', value: 78 },
  { name: 'Health Assistance', value: 37 },
  { name: 'Other Social Ins.', value: 173 },
  { name: 'Child Protection', value: 12 },
  { name: 'Other', value: 29 },
  { name: 'Labour Market', value: 7 },
]

// COVID
const covidEconomicImpact = [
  { indicator: 'GDP\ncontraction', value: 33.6 },
  { indicator: 'Revenue\nfall', value: 49 },
  { indicator: 'Tourism\ndecline', value: 67.4 },
  { indicator: 'Households\nincome loss', value: 44 },
]

const covidGenderImpact = [
  { indicator: 'Female mfg\nworkers\nstopped', value: 22 },
  { indicator: 'Male mfg\nworkers\nstopped', value: 8 },
  { indicator: 'Relief loans\nto women', value: 15 },
  { indicator: 'Relief loans\nto men', value: 74 },
]

// Crime
const crimeCategories = [
  { category: 'Drug-Related', y2023: 4479, y2024: 3279 },
  { category: 'Assaults', y2021: 1611, y2024: 1436 },
  { category: 'DV', y2021: 696, y2024: 537 },
  { category: 'Sexual\nOffences', y2022: 575, y2024: 467 },
]

const emergingCrimes = [
  { category: 'Bullying', y2023: 4, y2024: 12 },
  { category: 'Blackmail', y2023: 5, y2024: 15 },
  { category: 'Threats', y2023: 18, y2024: 25 },
  { category: 'Suicide\nattempts', y2023: 7, y2024: 9 },
  { category: 'Sexual\nharassment', y2023: 4, y2024: 5 },
]

const prisonProfile = [
  { characteristic: 'Drug\noffenders', value: 65 },
  { characteristic: 'Poor/working\nclass', value: 64.7 },
  { characteristic: 'Divorced', value: 47.1 },
]

// Higher education
const higherEd = [
  { year: '2019', enrolments: 27421, graduates: 11254, dropouts: 2691 },
  { year: '2020', enrolments: 26825, graduates: 7245, dropouts: 1991 },
  { year: '2021', enrolments: 26733, graduates: 12837, dropouts: 4066 },
  { year: '2022', enrolments: 29016, graduates: 6093, dropouts: 2897 },
]

// Aasandha
const aasandhaTimeline = [
  { year: '2012', expenditure: 500 },
  { year: '2024', expenditure: 1900 },
]

// ── Formatters ─────────────────────────────────────────
const fmtNum = (v: number) => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`
const fmtPct = (v: number) => `${v}%`

export default function ChartsLibrary() {
  return (
    <div className="pb-20 max-w-[900px]">

      {/* ══════ DEMOGRAPHICS ══════ */}
      <Section title="Population and Demographics">
        <Chart title="Maldivian Population Growth, 1911–2022" source="Source: MBS Population and Housing Census 1911–2022" wide>
          <ResponsiveContainer>
            <AreaChart data={populationTimeSeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={font} />
              <YAxis tickFormatter={fmtNum} tick={font} />
              <Tooltip formatter={(v: number) => v.toLocaleString()} contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="pop" name="Population" stroke={TEAL} fill={TEAL} fillOpacity={0.15} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </Chart>

        <Chart title="Population by Locality, Census 2022" source="Source: Census 2022 Results Summary, MBS">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={populationByLocality} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110} label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`} labelLine={{ stroke: '#94a3b8' }} style={font}>
                {populationByLocality.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
              </Pie>
              <Tooltip formatter={(v: number) => v.toLocaleString()} contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </Chart>

        <Chart title="Population Age Structure by Dependency Group, 2022" source="Source: Census 2022, MBS">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={dependencyBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110} label={({ name, percent }) => `${name} (${(percent * 100).toFixed(1)}%)`} labelLine={{ stroke: '#94a3b8' }} style={font}>
                <Cell fill={SKY} />
                <Cell fill={TEAL} />
                <Cell fill={CORAL} />
              </Pie>
              <Tooltip formatter={(v: number) => v.toLocaleString()} contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </Chart>

        <Chart title="Age Structure Comparison: Census 2014 vs 2022" source="Source: Population and Housing Census 2014 and 2022, MBS" wide>
          <ResponsiveContainer>
            <BarChart data={ageStructure} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tickFormatter={fmtNum} tick={font} />
              <YAxis type="category" dataKey="age" tick={font} width={45} />
              <Tooltip formatter={(v: number) => v.toLocaleString()} contentStyle={tooltipStyle} />
              <Legend wrapperStyle={font} />
              <Bar dataKey="y2014" name="Census 2014" fill={BLUE} opacity={0.6} />
              <Bar dataKey="y2022" name="Census 2022" fill={TEAL} />
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
              <Line type="monotone" dataKey="male" name="Male" stroke={BLUE} strokeWidth={1.5} strokeDasharray="5 5" dot={{ r: 2 }} />
              <Line type="monotone" dataKey="female" name="Female" stroke={CORAL} strokeWidth={1.5} strokeDasharray="5 5" dot={{ r: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </Chart>

        <Chart title="Marriages and Divorces, 2010–2016" source="Source: Statistical Yearbook of Maldives 2023" wide>
          <ResponsiveContainer>
            <ComposedChart data={marriageDivorce}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={font} />
              <YAxis tick={font} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={font} />
              <Bar dataKey="marriages" name="Marriages" fill={TEAL} opacity={0.7} />
              <Bar dataKey="divorces" name="Divorces" fill={CORAL} opacity={0.7} />
            </ComposedChart>
          </ResponsiveContainer>
        </Chart>
      </Section>

      {/* ══════ CHILD PROTECTION ══════ */}
      <Section title="Child Protection and Child Rights">
        <Chart title="Domestic Violence Cases Reported to FPA, 2013–2024" source="Source: Family Protection Authority annual records; MPS Bureau of Crime Statistics">
          <ResponsiveContainer>
            <BarChart data={dvCases}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={font} />
              <YAxis tick={font} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="cases" name="DV cases reported" fill={CORAL} />
            </BarChart>
          </ResponsiveContainer>
        </Chart>

        <Chart title="Children's Living Arrangements, Census 2022" source="Source: Census 2022 Children's Equity Report, MBS">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={childLivingArrangement} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110} label={({ name, value }) => `${name}: ${value}%`} labelLine={{ stroke: '#94a3b8' }} style={font}>
                <Cell fill={TEAL} />
                <Cell fill={BLUE} />
                <Cell fill={CORAL} />
              </Pie>
              <Tooltip formatter={(v: number) => `${v}%`} contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </Chart>

        <Chart title="Children in Alternative Care by Type, March 2023" source="Source: MoSFD administrative data; CRC State Party Report 2021">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={alternativeCare} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110} label={({ name, value }) => `${name}: ${value}`} labelLine={{ stroke: '#94a3b8' }} style={font}>
                <Cell fill={TERRACOTTA} />
                <Cell fill={TEAL} />
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </Chart>

        <Chart title="Child Protection Caseload vs International Standard" source="Source: Rogers, Ali & Naeem (2025); MoSFD staffing data">
          <ResponsiveContainer>
            <BarChart data={caseloadComparison} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={font} />
              <YAxis type="category" dataKey="name" tick={font} width={120} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="value" name="Cases per worker" fill={CORAL}>
                {caseloadComparison.map((entry, i) => <Cell key={i} fill={i === 0 ? CORAL : TEAL} />)}
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
              <Bar dataKey="arrests" name="Juvenile drug arrests" fill={TERRACOTTA} />
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
              <Bar dataKey="cases" name="Cases investigated" fill={BLUE} />
            </BarChart>
          </ResponsiveContainer>
        </Chart>
      </Section>

      {/* ══════ GENDER / GBV ══════ */}
      <Section title="Gender, GBV, and Women's Empowerment">
        <Chart title="GBV Criminal Justice Funnel" source="Sources: Vulnerability Mapping files; AIM Project; UNDP Maldives" wide>
          <ResponsiveContainer>
            <BarChart data={criminalJusticeFunnel}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="stage" tick={font} interval={0} height={60} />
              <YAxis tickFormatter={fmtPct} tick={font} />
              <Tooltip formatter={(v: number) => `${v}%`} contentStyle={tooltipStyle} />
              <Bar dataKey="value" name="% of cases" fill={CORAL}>
                {criminalJusticeFunnel.map((_, i) => <Cell key={i} fill={[CORAL, TERRACOTTA, SAND, SLATE][i]} />)}
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
              <Tooltip formatter={(v: number) => `${v}%`} contentStyle={tooltipStyle} />
              <Bar dataKey="prevalence" name="FGM/C prevalence" fill={PLUM} />
            </BarChart>
          </ResponsiveContainer>
        </Chart>

        <Chart title="Labour Force Participation by Gender, Census 2022" source="Source: Census 2022">
          <ResponsiveContainer>
            <BarChart data={womenEconParticipation}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="indicator" tick={font} interval={0} height={55} />
              <YAxis tickFormatter={fmtPct} domain={[0, 100]} tick={font} />
              <Tooltip formatter={(v: number) => `${v}%`} contentStyle={tooltipStyle} />
              <Legend wrapperStyle={font} />
              <Bar dataKey="female" name="Female" fill={CORAL} />
              <Bar dataKey="male" name="Male" fill={BLUE} />
            </BarChart>
          </ResponsiveContainer>
        </Chart>

        <Chart title="Women's Political Representation" source="Sources: People's Majlis records; Elections Commission; CEDAW/C/MDV/CO/6" wide>
          <ResponsiveContainer>
            <BarChart data={womenPolitical} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tickFormatter={fmtPct} domain={[0, 100]} tick={font} />
              <YAxis type="category" dataKey="name" tick={font} width={130} />
              <Tooltip formatter={(v: number) => `${v}%`} contentStyle={tooltipStyle} />
              <Legend wrapperStyle={font} />
              <Bar dataKey="women" name="Women" fill={CORAL} stackId="a" />
              <Bar dataKey="men" name="Men" fill={SLATE} stackId="a" opacity={0.4} />
            </BarChart>
          </ResponsiveContainer>
        </Chart>
      </Section>

      {/* ══════ DISABILITY ══════ */}
      <Section title="Disability">
        <Chart title="National Disability Register Growth" source="Source: NSPA; CRPD State Party Report review, August 2025">
          <ResponsiveContainer>
            <BarChart data={ndrGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={font} />
              <YAxis tickFormatter={fmtNum} tick={font} />
              <Tooltip formatter={(v: number) => v.toLocaleString()} contentStyle={tooltipStyle} />
              <Bar dataKey="registered" name="Registered persons" fill={TEAL} />
            </BarChart>
          </ResponsiveContainer>
        </Chart>

        <Chart title="NDR Coverage Gap: Registered vs Census (Dec 2024)" source="Source: Census 2022 (WG-SS); NSPA NDR data">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={ndrVsCensus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110} label={({ name, value }) => `${name.replace('\n', ' ')}: ${value.toLocaleString()}`} labelLine={{ stroke: '#94a3b8' }} style={font}>
                <Cell fill={TEAL} />
                <Cell fill={SLATE} />
              </Pie>
              <Tooltip formatter={(v: number) => v.toLocaleString()} contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </Chart>

        <Chart title="Disability Allowance by Tier (2023)" source="Source: NSPA administrative data; Hameed et al. (2022)">
          <ResponsiveContainer>
            <BarChart data={disabilityAllowanceTiers}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="tier" tick={font} interval={0} height={55} />
              <YAxis tickFormatter={fmtPct} tick={font} />
              <Tooltip formatter={(v: number) => `${v}%`} contentStyle={tooltipStyle} />
              <Bar dataKey="pct" name="% of recipients" fill={GREEN} />
            </BarChart>
          </ResponsiveContainer>
        </Chart>

        <Chart title="Labour Force Participation: Disability Status by Gender" source="Source: Census 2022">
          <ResponsiveContainer>
            <BarChart data={disabilityLFPR}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="group" tick={font} interval={0} height={55} />
              <YAxis tickFormatter={fmtPct} domain={[0, 100]} tick={font} />
              <Tooltip formatter={(v: number) => `${v}%`} contentStyle={tooltipStyle} />
              <Bar dataKey="rate" name="LFPR">
                {disabilityLFPR.map((_, i) => <Cell key={i} fill={[CORAL, BLUE, CORAL, BLUE][i]} opacity={i < 2 ? 1 : 0.4} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Chart>
      </Section>

      {/* ══════ ELDERLY ══════ */}
      <Section title="Elderly Care and Population Ageing">
        <Chart title="Population Aged 60+: Projected Trajectory" source="Sources: Census 2022; UN DESA Population Projections">
          <ResponsiveContainer>
            <AreaChart data={ageingProjections}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={font} />
              <YAxis tickFormatter={fmtPct} domain={[0, 40]} tick={font} />
              <Tooltip formatter={(v: number) => `${v}%`} contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="pct" name="% aged 60+" stroke={TERRACOTTA} fill={TERRACOTTA} fillOpacity={0.15} strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </Chart>

        <Chart title="Elderly Health Indicators (prevalence %)" source="Source: MoH data; National Elderly Policy 2018">
          <ResponsiveContainer>
            <BarChart data={elderlyHealthIndicators} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tickFormatter={fmtPct} domain={[0, 50]} tick={font} />
              <YAxis type="category" dataKey="indicator" tick={font} width={100} />
              <Tooltip formatter={(v: number) => `${v}%`} contentStyle={tooltipStyle} />
              <Bar dataKey="value" name="Prevalence" fill={TERRACOTTA} />
            </BarChart>
          </ResponsiveContainer>
        </Chart>

        <Chart title="Senior Citizen Allowance: Beneficiaries Over Time" source="Source: NSPA; MPRS annual reports; national budget documents" wide>
          <ResponsiveContainer>
            <ComposedChart data={seniorAllowance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={font} />
              <YAxis yAxisId="left" tickFormatter={fmtNum} tick={font} />
              <YAxis yAxisId="right" orientation="right" tick={font} tickFormatter={(v: number) => `MVR ${v.toLocaleString()}`} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={font} />
              <Bar yAxisId="left" dataKey="beneficiaries" name="Beneficiaries" fill={TEAL} opacity={0.7} />
              <Line yAxisId="right" type="monotone" dataKey="amount" name="Monthly amount (MVR)" stroke={CORAL} strokeWidth={2} dot={{ r: 4 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </Chart>
      </Section>

      {/* ══════ SUBSTANCE ABUSE ══════ */}
      <Section title="Substance Abuse and Drug Policy">
        <Chart title="Drug of First Initiation, RAS 2003" source="Source: UNODC Rapid Assessment Survey 2003">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={drugInitiation2003} dataKey="pct" nameKey="substance" cx="50%" cy="50%" outerRadius={110} label={({ substance, pct }) => `${substance}: ${pct}%`} labelLine={{ stroke: '#94a3b8' }} style={font}>
                {drugInitiation2003.map((_, i) => <Cell key={i} fill={PALETTE[i]} />)}
              </Pie>
              <Tooltip formatter={(v: number) => `${v}%`} contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </Chart>

        <Chart title="Drug Treatment Pathways, 2022" source="Source: NDA annual reports; UNODC Maldives">
          <ResponsiveContainer>
            <BarChart data={drugTreatmentPathway}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="pathway" tick={font} interval={0} height={60} />
              <YAxis tick={font} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="value" name="Persons" fill={BLUE} />
            </BarChart>
          </ResponsiveContainer>
        </Chart>

        <Chart title="Drug Use Situational Analysis 2021: Key Indicators" source="Source: National Situational Analysis of Drug Users 2021" wide>
          <ResponsiveContainer>
            <BarChart data={drugSituation2021}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="indicator" tick={font} interval={0} height={60} />
              <YAxis tickFormatter={fmtPct} tick={font} />
              <Tooltip formatter={(v: number) => `${v}%`} contentStyle={tooltipStyle} />
              <Bar dataKey="value" name="% of respondents">
                {drugSituation2021.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Chart>
      </Section>

      {/* ══════ MENTAL HEALTH ══════ */}
      <Section title="Mental Health">
        <Chart title="Youth Mental Health Indicators, GSHS 2009/2014" source="Sources: WHO GSHS Maldives 2009, 2014">
          <ResponsiveContainer>
            <BarChart data={youthMentalHealth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="indicator" tick={font} interval={0} height={60} />
              <YAxis tickFormatter={fmtPct} tick={font} />
              <Tooltip formatter={(v: number) => `${v}%`} contentStyle={tooltipStyle} />
              <Bar dataKey="value" name="Prevalence (%)">
                {youthMentalHealth.map((_, i) => <Cell key={i} fill={[CORAL, TERRACOTTA, PLUM, SLATE, BLUE][i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Chart>

        <Chart title="Parental Concern About Children's Mental Health by Region, KAP 2023" source="Source: Knowledge, Attitudes and Practices (KAP) Survey 2023">
          <ResponsiveContainer>
            <BarChart data={parentalConcernByRegion}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="region" tick={font} interval={0} height={50} />
              <YAxis tickFormatter={fmtPct} domain={[0, 100]} tick={font} />
              <Tooltip formatter={(v: number) => `${v}%`} contentStyle={tooltipStyle} />
              <Bar dataKey="pct" name="% worried" fill={SKY} />
            </BarChart>
          </ResponsiveContainer>
        </Chart>
      </Section>

      {/* ══════ HEALTH ══════ */}
      <Section title="Health Systems and Outcomes">
        <Chart title="Infant Mortality Rate, 1990–2023 (per 1,000 live births)" source="Sources: World Bank WDI; WHO; Statistical Yearbook of Maldives">
          <ResponsiveContainer>
            <AreaChart data={imr}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={font} />
              <YAxis tick={font} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="rate" name="IMR" stroke={TEAL} fill={TEAL} fillOpacity={0.12} strokeWidth={2.5} />
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

        <Chart title="NCD Burden as Share of DALYs" source="Source: WHO/GBD">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={ncdBurden} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110} label={({ name, value }) => `${name.replace('\n', ' ')}: ${value}%`} labelLine={{ stroke: '#94a3b8' }} style={font}>
                <Cell fill={TERRACOTTA} />
                <Cell fill={SAGE} />
              </Pie>
              <Tooltip formatter={(v: number) => `${v}%`} contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </Chart>

        <Chart title="Child and Maternal Nutrition Indicators" source="Sources: DHS 2009; National Micronutrient Survey 2007">
          <ResponsiveContainer>
            <BarChart data={childNutrition}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="indicator" tick={font} interval={0} height={65} />
              <YAxis tickFormatter={fmtPct} tick={font} />
              <Tooltip formatter={(v: number) => `${v}%`} contentStyle={tooltipStyle} />
              <Bar dataKey="value" name="Prevalence (%)">
                {childNutrition.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Chart>
      </Section>

      {/* ══════ POVERTY ══════ */}
      <Section title="Poverty, Housing, and Economic Vulnerability">
        <Chart title="Poverty Headcount Rate by Region, HIES 2019" source="Source: HIES 2019; World Bank Poverty and Inequality in Maldives 2022">
          <ResponsiveContainer>
            <BarChart data={povertyByRegion}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="region" tick={font} />
              <YAxis tickFormatter={fmtPct} tick={font} />
              <Tooltip formatter={(v: number) => `${v}%`} contentStyle={tooltipStyle} />
              <Bar dataKey="rate" name="Poverty rate">
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
              <Tooltip formatter={(v: number) => `${v}%`} contentStyle={tooltipStyle} />
              <Bar dataKey="rate" name="Poverty rate" fill={TERRACOTTA} />
            </BarChart>
          </ResponsiveContainer>
        </Chart>

        <Chart title="Poverty Rate by Household Head Characteristics" source="Source: World Bank Poverty and Inequality in Maldives 2022" wide>
          <ResponsiveContainer>
            <BarChart data={povertyByHHCharacteristic} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tickFormatter={fmtPct} tick={font} />
              <YAxis type="category" dataKey="characteristic" tick={font} width={100} />
              <Tooltip formatter={(v: number) => `${v}%`} contentStyle={tooltipStyle} />
              <Bar dataKey="rate" name="Poverty rate">
                {povertyByHHCharacteristic.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Chart>
      </Section>

      {/* ══════ EMPLOYMENT ══════ */}
      <Section title="Employment and Labour Market">
        <Chart title="Unemployment and Youth Unemployment, 2019–2023" source="Sources: ILO modelled estimates; World Bank WDI; Census 2022" wide>
          <ResponsiveContainer>
            <LineChart data={labourForce}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={font} />
              <YAxis tickFormatter={fmtPct} tick={font} />
              <Tooltip formatter={(v: number) => `${v}%`} contentStyle={tooltipStyle} />
              <Legend wrapperStyle={font} />
              <Line type="monotone" dataKey="unemployment" name="Overall unemployment" stroke={TEAL} strokeWidth={2.5} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="youth" name="Youth unemployment (15–24)" stroke={CORAL} strokeWidth={2.5} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Chart>

        <Chart title="Higher Education: Enrolments, Graduates, Dropouts, 2019–2022" source="Source: Ministry of Higher Education" wide>
          <ResponsiveContainer>
            <ComposedChart data={higherEd}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" tick={font} />
              <YAxis tickFormatter={fmtNum} tick={font} />
              <Tooltip formatter={(v: number) => v.toLocaleString()} contentStyle={tooltipStyle} />
              <Legend wrapperStyle={font} />
              <Bar dataKey="enrolments" name="Enrolments" fill={TEAL} opacity={0.6} />
              <Bar dataKey="graduates" name="Graduates" fill={GREEN} opacity={0.6} />
              <Bar dataKey="dropouts" name="Dropouts" fill={CORAL} opacity={0.6} />
            </ComposedChart>
          </ResponsiveContainer>
        </Chart>
      </Section>

      {/* ══════ SOCIAL PROTECTION ══════ */}
      <Section title="Social Protection">
        <Chart title="Social Protection Programs: Beneficiaries" source="Source: NSPA; MoSFD (2023–2024)">
          <ResponsiveContainer>
            <BarChart data={spPrograms} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tickFormatter={fmtNum} tick={font} />
              <YAxis type="category" dataKey="program" tick={font} width={110} />
              <Tooltip formatter={(v: number) => v.toLocaleString()} contentStyle={tooltipStyle} />
              <Bar dataKey="beneficiaries" name="Beneficiaries">
                {spPrograms.map((_, i) => <Cell key={i} fill={PALETTE[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Chart>

        <Chart title="Social Protection Expenditure by Component, 2009" source="Source: ADB Social Protection Index 2012 (MVR millions)">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={spExpenditure2009} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110} label={({ name, value }) => `${name}: ${value}M`} labelLine={{ stroke: '#94a3b8' }} style={{ ...font, fontSize: 10 }}>
                {spExpenditure2009.map((_, i) => <Cell key={i} fill={PALETTE[i % PALETTE.length]} />)}
              </Pie>
              <Tooltip formatter={(v: number) => `MVR ${v}M`} contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </Chart>
      </Section>

      {/* ══════ CRIME ══════ */}
      <Section title="Crime and Justice">
        <Chart title="Major Crime Categories: Year-on-Year Comparison" source="Source: MPS Bureau of Crime Statistics; MV+ 2024" wide>
          <ResponsiveContainer>
            <BarChart data={crimeCategories}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="category" tick={font} interval={0} height={50} />
              <YAxis tickFormatter={fmtNum} tick={font} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={font} />
              <Bar dataKey="y2021" name="2021" fill={SLATE} opacity={0.5} />
              <Bar dataKey="y2022" name="2022" fill={BLUE} opacity={0.5} />
              <Bar dataKey="y2023" name="2023" fill={TEAL} opacity={0.7} />
              <Bar dataKey="y2024" name="2024" fill={CORAL} />
            </BarChart>
          </ResponsiveContainer>
        </Chart>

        <Chart title="Emerging Crime Trends: 2023 vs 2024 (Jan–Sep)" source="Source: MPS Bureau of Crime Statistics">
          <ResponsiveContainer>
            <BarChart data={emergingCrimes}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="category" tick={font} interval={0} height={55} />
              <YAxis tick={font} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={font} />
              <Bar dataKey="y2023" name="2023" fill={BLUE} />
              <Bar dataKey="y2024" name="2024 (Jan–Sep)" fill={CORAL} />
            </BarChart>
          </ResponsiveContainer>
        </Chart>

        <Chart title="Prison Population Profile" source="Source: MCS Prison Review; Vulnerability Mapping">
          <ResponsiveContainer>
            <BarChart data={prisonProfile} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tickFormatter={fmtPct} domain={[0, 80]} tick={font} />
              <YAxis type="category" dataKey="characteristic" tick={font} width={90} />
              <Tooltip formatter={(v: number) => `${v}%`} contentStyle={tooltipStyle} />
              <Bar dataKey="value" name="% of prisoners">
                {prisonProfile.map((_, i) => <Cell key={i} fill={[TERRACOTTA, SLATE, PLUM][i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Chart>
      </Section>

      {/* ══════ COVID ══════ */}
      <Section title="COVID-19 Socioeconomic Impact">
        <Chart title="COVID-19 Economic Impact Indicators, 2020" source="Sources: Ministry of Finance; World Bank; MMA">
          <ResponsiveContainer>
            <BarChart data={covidEconomicImpact}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="indicator" tick={font} interval={0} height={55} />
              <YAxis tickFormatter={fmtPct} tick={font} />
              <Tooltip formatter={(v: number) => `${v}%`} contentStyle={tooltipStyle} />
              <Bar dataKey="value" name="% decline/impact">
                {covidEconomicImpact.map((_, i) => <Cell key={i} fill={[CORAL, TERRACOTTA, PLUM, SLATE][i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Chart>

        <Chart title="COVID-19 Gender Impact" source="Sources: World Bank Livelihood Impact Assessment; UNDP rapid assessment">
          <ResponsiveContainer>
            <BarChart data={covidGenderImpact}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="indicator" tick={font} interval={0} height={60} />
              <YAxis tickFormatter={fmtPct} tick={font} />
              <Tooltip formatter={(v: number) => `${v}%`} contentStyle={tooltipStyle} />
              <Bar dataKey="value" name="%">
                {covidGenderImpact.map((_, i) => <Cell key={i} fill={[CORAL, BLUE, CORAL, BLUE][i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Chart>
      </Section>

    </div>
  )
}
