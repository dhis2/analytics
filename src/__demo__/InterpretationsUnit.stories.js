import { CustomDataProvider } from '@dhis2/app-runtime'
import PropTypes from 'prop-types'
import React from 'react'
import { InterpretationsProvider } from '../components/Interpretations/InterpretationsProvider/InterpretationsProvider.js'
import { InterpretationsUnit } from '../components/Interpretations/InterpretationsUnit/index.js'

export default {
    title: 'IntepretationsUnit',
}

const currentUser = {
    id: 'user001',
    name: 'Tom Wakiki',
    authorities: [],
}

const makeInterpretation = (overrides) => ({
    id: 'interp-1',
    text: 'Interpretation text',
    created: '2026-03-15T10:30:00.000',
    likes: 0,
    createdBy: {
        id: 'user001',
        displayName: 'Tom Wakiki',
    },
    comments: [],
    likedBy: [],
    access: { write: true, manage: true },
    ...overrides,
})

const stubReplies = (count, prefix) =>
    Array.from({ length: count }, (_, i) => ({ id: `${prefix}-r${i}` }))

const InterpretationsStory = ({
    interpretations,
    interpretationsResolver,
    children,
    containerWidth,
}) => (
    <div style={{ width: containerWidth, border: '1px solid lightgrey' }}>
        <CustomDataProvider
            data={{
                interpretations: interpretationsResolver ?? { interpretations },
            }}
        >
            <InterpretationsProvider currentUser={currentUser}>
                {children}
            </InterpretationsProvider>
        </CustomDataProvider>
    </div>
)

InterpretationsStory.defaultProps = {
    interpretations: [],
    containerWidth: 360,
}

InterpretationsStory.propTypes = {
    children: PropTypes.node,
    containerWidth: PropTypes.number,
    interpretations: PropTypes.array,
    interpretationsResolver: PropTypes.func,
}

const DefaultUnit = (props) => (
    <InterpretationsUnit
        id="abcd"
        onInterpretationClick={Function.prototype}
        onReplyIconClick={Function.prototype}
        type="eventVisualization"
        visualizationHasTimeDimension={true}
        {...props}
    />
)

export const Default = () => (
    <InterpretationsStory>
        <DefaultUnit />
    </InterpretationsStory>
)

export const WithNoTimeDimensionsWarning = () => (
    <InterpretationsStory>
        <DefaultUnit visualizationHasTimeDimension={false} />
    </InterpretationsStory>
)

WithNoTimeDimensionsWarning.story = {
    name: 'With no time dimensions warning',
}

export const Loading = () => (
    <InterpretationsStory interpretationsResolver={() => new Promise(() => {})}>
        <DefaultUnit />
    </InterpretationsStory>
)

Loading.story = {
    name: 'Loading',
}

export const Error = () => (
    <InterpretationsStory
        interpretationsResolver={() =>
            Promise.reject(
                new Error(
                    'Network request failed while loading interpretations'
                )
            )
        }
    >
        <DefaultUnit />
    </InterpretationsStory>
)

Error.story = {
    name: 'Error',
}

const dashboardRedirectUrl =
    'https://play.dhis2.org/demo/dhis-web-dashboard/abcd123ef'

export const DashboardUsage = () => (
    <InterpretationsStory
        interpretations={[
            makeInterpretation({
                id: 'interp-1',
                text: 'The ANC coverage rate has improved steadily across all districts this quarter, with the Eastern region showing the most significant gains. This aligns with the increased outreach activities reported in the monthly summaries.',
                created: '2026-04-10T14:22:00.000',
                likes: 3,
                createdBy: {
                    id: 'user002',
                    displayName: 'Amina Diallo',
                },
                comments: [{ id: 'c1' }, { id: 'c2' }],
                likedBy: [
                    { id: 'user001' },
                    { id: 'user003' },
                    { id: 'user004' },
                ],
                access: { write: false, manage: false },
            }),
        ]}
    >
        <DefaultUnit dashboardRedirectUrl={dashboardRedirectUrl} />
    </InterpretationsStory>
)

DashboardUsage.story = {
    name: 'Dashboard usage',
}

export const WithOneInterpretation = () => (
    <InterpretationsStory
        interpretations={[
            makeInterpretation({
                id: 'interp-1',
                text: 'The ANC coverage rate has improved steadily across all districts this quarter, with the Eastern region showing the most significant gains. This aligns with the increased outreach activities reported in the monthly summaries.',
                created: '2026-04-10T14:22:00.000',
                likes: 3,
                createdBy: {
                    id: 'user002',
                    displayName: 'Amina Diallo',
                },
                comments: [{ id: 'c1' }, { id: 'c2' }],
                likedBy: [
                    { id: 'user001' },
                    { id: 'user003' },
                    { id: 'user004' },
                ],
                access: { write: false, manage: false },
            }),
        ]}
    >
        <DefaultUnit />
    </InterpretationsStory>
)

WithOneInterpretation.story = {
    name: 'With one interpretation',
}

export const WithInterpretationForCurrentUser = () => (
    <InterpretationsStory
        interpretations={[
            makeInterpretation({
                id: 'interp-short',
                text: 'Dropout rates look normal.',
                created: '2026-04-14T09:05:00.000',
                likes: 0,
                createdBy: {
                    id: 'user001',
                    displayName: 'Tom Wakiki',
                },
                access: { write: true, manage: true },
            }),
            makeInterpretation({
                id: 'interp-long',
                text: 'After reviewing the disaggregated malaria case data for Q1 2026, there is a concerning upward trend in confirmed cases among children under 5 in the Northern and Upper West regions. The increase appears to correlate with the delayed distribution of insecticide-treated nets reported in the logistics pipeline dashboard. District-level data shows that facilities in rural areas are disproportionately affected, with some health posts reporting a 40% increase compared to the same period last year. I recommend cross-referencing this with the supply chain data to determine whether the net distribution delays are the primary driver, or if there are additional factors such as changes in rainfall patterns or diagnostic capacity. The regional health directorate should be flagged for follow-up, and this should be discussed in the next quarterly review meeting.',
                created: '2026-04-08T16:45:00.000',
                likes: 7,
                createdBy: {
                    id: 'user004',
                    displayName: 'Dr. Fatou Mensah',
                },
                comments: [
                    { id: 'c3' },
                    { id: 'c4' },
                    { id: 'c5' },
                    { id: 'c6' },
                ],
                likedBy: [
                    { id: 'user001' },
                    { id: 'user002' },
                    { id: 'user003' },
                    { id: 'user005' },
                    { id: 'user006' },
                    { id: 'user007' },
                    { id: 'user008' },
                ],
                access: { write: true, manage: false },
            }),
        ]}
    >
        <DefaultUnit />
    </InterpretationsStory>
)

WithInterpretationForCurrentUser.story = {
    name: 'With an interpretation for current user',
}

const verboseUserA =
    'Prof. Æþelred María-José van Müller‑Wilson ⟨DHIS2⟩ · π≈3.14 — 部署/営業 (ret.)'

const verboseUserB =
    'المراجعة الرسمية — O\'Brien & "Søren" Ølsgaard 日本語 [coord.]'

const verboseInterpretationTextA = `## Outbreak-adjacent note (stress test)

*Facility* ratios vs **national** targets — see _ANC_ coverage.

- Bullet one: https://example.com/very/long/path/segments?foo=bar&baz=qux#section-日本語
- Bullet two: mixed digits ₂₃⁴⁵/₁₀₀% and symbols §¶†‡
- RTL snippet: مرحبا ← center → 你好

Directional / bidi: אַל־פִּי הַדִּין — then latin again.

:+1: :-) Emoji row :-( :-1

\`SELECT *\` is *not* executed here; pipes | || ||| appear inline.

Z̈o̷m̷b̷i̷e̷ ̷c̷o̷m̷b̷i̷n̷i̷n̷g̷ ̷m̷a̷r̷k̷s̷ ̷(̷N̷F̷D̷)̷`

const verboseInterpretationTextB = `# HMIS / logistics cross-check

1. Numbered list with *emphasis*
2. Second item with _italic_ and URL https://dhis2.org/foo_(parens)_in_path

> Block-style paragraph: "quotes" 'apostrophes' «guillemets» — en-dash – and em-dash —

Math-ish: ∀x ∈ ℝ, ∑ᵢ nᵢ ≥ 0 · ± × ÷ ≈ ≠ ≤ ≥ ∞

Whitespace:

    four spaces line (code-ish)

Tab\tand newline breaks below.

---

Final line: 🏥📊 mixed with text.`

export const StressTest = () => (
    <InterpretationsStory
        containerWidth={360}
        interpretations={[
            makeInterpretation({
                id: 'interp-verbose-a',
                text: verboseInterpretationTextA,
                created: '2026-04-16T11:59:00.000',
                likes: 3847,
                createdBy: {
                    id: 'user-verbose-a',
                    displayName: verboseUserA,
                },
                comments: stubReplies(127, 'va'),
                likedBy: [{ id: 'user001' }],
                access: { write: true, manage: true },
            }),
            makeInterpretation({
                id: 'interp-verbose-b',
                text: verboseInterpretationTextB,
                created: '2026-04-15T08:30:00.000',
                likes: 1926,
                createdBy: {
                    id: 'user-verbose-b',
                    displayName: verboseUserB,
                },
                comments: stubReplies(143, 'vb'),
                likedBy: [],
                access: { write: false, manage: false },
            }),
        ]}
    >
        <DefaultUnit />
    </InterpretationsStory>
)

StressTest.story = {
    name: 'Stress test',
}

export const WithManyInterpretations = () => (
    <InterpretationsStory
        interpretations={[
            makeInterpretation({
                id: 'interp-m01',
                text: 'OPD attendance has been consistently above target in all urban facilities this month. The increase in walk-in patients could be linked to the recent community health awareness campaign.',
                created: '2026-04-15T11:20:00.000',
                likes: 5,
                createdBy: { id: 'user002', displayName: 'Amina Diallo' },
                comments: [{ id: 'c10' }, { id: 'c11' }],
                likedBy: [
                    { id: 'user001' },
                    { id: 'user003' },
                    { id: 'user004' },
                    { id: 'user005' },
                    { id: 'user006' },
                ],
            }),
            makeInterpretation({
                id: 'interp-m02',
                text: 'Immunization coverage for Penta 3 dropped below 80% in three districts last month. This needs urgent attention before the next reporting cycle.',
                created: '2026-04-15T09:10:00.000',
                likes: 2,
                createdBy: { id: 'user003', displayName: 'James Okonkwo' },
                comments: [{ id: 'c12' }],
                likedBy: [{ id: 'user002' }, { id: 'user004' }],
                access: { write: true, manage: false },
            }),
            makeInterpretation({
                id: 'interp-m03',
                text: 'The facility-level comparison shows that Korle Bu and Ridge Hospital have significantly different referral patterns despite serving similar catchment populations.',
                created: '2026-04-14T16:30:00.000',
                likes: 0,
                createdBy: { id: 'user001', displayName: 'Tom Wakiki' },
                access: { write: true, manage: true },
            }),
            makeInterpretation({
                id: 'interp-m04',
                text: 'Stock-out data for essential medicines looks incomplete for the Southern region. Several facilities have not reported for two consecutive months.',
                created: '2026-04-14T08:45:00.000',
                likes: 0,
                createdBy: { id: 'user005', displayName: 'Kwame Asante' },
                comments: [{ id: 'c13' }, { id: 'c14' }, { id: 'c15' }],
                access: { write: false, manage: false },
            }),
            makeInterpretation({
                id: 'interp-m05',
                text: 'Maternal mortality ratio has decreased by 15% compared to the same quarter last year. The introduction of the emergency obstetric care training programme appears to be having a positive effect.',
                created: '2026-04-12T14:00:00.000',
                likes: 12,
                createdBy: { id: 'user006', displayName: 'Grace Nkrumah' },
                comments: [{ id: 'c16' }, { id: 'c17' }],
                likedBy: [
                    { id: 'user001' },
                    { id: 'user002' },
                    { id: 'user003' },
                    { id: 'user004' },
                    { id: 'user005' },
                    { id: 'user007' },
                    { id: 'user008' },
                    { id: 'user009' },
                    { id: 'user010' },
                    { id: 'user011' },
                    { id: 'user012' },
                    { id: 'user013' },
                ],
            }),
            makeInterpretation({
                id: 'interp-m06',
                text: 'TB case notification rate is trending upward in mining communities. This may reflect improved case finding rather than a true increase in incidence.',
                created: '2026-04-12T10:15:00.000',
                likes: 3,
                createdBy: { id: 'user002', displayName: 'Amina Diallo' },
                comments: [{ id: 'c18' }],
                likedBy: [
                    { id: 'user003' },
                    { id: 'user005' },
                    { id: 'user006' },
                ],
                access: { write: true, manage: false },
            }),
            makeInterpretation({
                id: 'interp-m07',
                text: 'The HIV testing yield at antenatal clinics remains stable at around 2.3%, consistent with national estimates. No significant geographic variation observed this quarter.',
                created: '2026-04-11T13:50:00.000',
                likes: 1,
                createdBy: { id: 'user007', displayName: 'Samuel Owusu' },
                likedBy: [{ id: 'user002' }],
            }),
            makeInterpretation({
                id: 'interp-m08',
                text: 'Water quality indicators at community health posts in the Volta region are below acceptable thresholds. Three facilities flagged for follow-up inspections.',
                created: '2026-04-10T15:30:00.000',
                likes: 4,
                createdBy: { id: 'user005', displayName: 'Kwame Asante' },
                comments: [
                    { id: 'c19' },
                    { id: 'c20' },
                    { id: 'c21' },
                    { id: 'c22' },
                ],
                likedBy: [
                    { id: 'user001' },
                    { id: 'user003' },
                    { id: 'user006' },
                    { id: 'user007' },
                ],
                access: { write: false, manage: false },
            }),
            makeInterpretation({
                id: 'interp-m09',
                text: 'Nutrition screening coverage for children 6-59 months has improved from 62% to 78% since the deployment of community health volunteers in the pilot districts.',
                created: '2026-04-09T11:00:00.000',
                likes: 6,
                createdBy: { id: 'user006', displayName: 'Grace Nkrumah' },
                comments: [{ id: 'c23' }],
                likedBy: [
                    { id: 'user001' },
                    { id: 'user002' },
                    { id: 'user004' },
                    { id: 'user005' },
                    { id: 'user007' },
                    { id: 'user008' },
                ],
            }),
            makeInterpretation({
                id: 'interp-m10',
                text: 'The data quality score for the HMIS monthly reports has dropped across several districts. Late reporting and missing values are the primary issues identified.',
                created: '2026-04-08T09:20:00.000',
                likes: 2,
                createdBy: { id: 'user003', displayName: 'James Okonkwo' },
                comments: [{ id: 'c24' }, { id: 'c25' }],
                likedBy: [{ id: 'user005' }, { id: 'user006' }],
                access: { write: true, manage: false },
            }),
            makeInterpretation({
                id: 'interp-m11',
                text: 'Outreach vaccination sessions in hard-to-reach areas contributed to a 10% increase in fully immunized children under 1 year in the Northern region.',
                created: '2026-04-07T14:40:00.000',
                likes: 8,
                createdBy: { id: 'user004', displayName: 'Dr. Fatou Mensah' },
                comments: [{ id: 'c26' }, { id: 'c27' }, { id: 'c28' }],
                likedBy: [
                    { id: 'user001' },
                    { id: 'user002' },
                    { id: 'user003' },
                    { id: 'user005' },
                    { id: 'user006' },
                    { id: 'user007' },
                    { id: 'user008' },
                    { id: 'user009' },
                ],
            }),
            makeInterpretation({
                id: 'interp-m12',
                text: 'Disease surveillance data shows an unusual cluster of acute watery diarrhoea cases in the Ashanti region. The pattern warrants investigation by the rapid response team.',
                created: '2026-04-05T08:00:00.000',
                likes: 10,
                createdBy: { id: 'user007', displayName: 'Samuel Owusu' },
                comments: [
                    { id: 'c29' },
                    { id: 'c30' },
                    { id: 'c31' },
                    { id: 'c32' },
                    { id: 'c33' },
                ],
                likedBy: [
                    { id: 'user001' },
                    { id: 'user002' },
                    { id: 'user003' },
                    { id: 'user004' },
                    { id: 'user005' },
                    { id: 'user006' },
                    { id: 'user008' },
                    { id: 'user009' },
                    { id: 'user010' },
                    { id: 'user011' },
                ],
                access: { write: true, manage: false },
            }),
        ]}
    >
        <DefaultUnit />
    </InterpretationsStory>
)

WithManyInterpretations.story = {
    name: 'With 12 interpretations',
}
