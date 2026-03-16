-- Tulkas — static entity scores
-- seed.sql  (run after schema.sql)
-- 75 entities scored across 6 dimensions (1–10 each)
-- Search: SELECT * FROM entities WHERE name ILIKE '%term%'

BEGIN;

INSERT INTO entities (name, entity_type, description,
  score_env, score_labor, score_integrity, score_political, score_community, score_conduct, score_avg,
  reason_env, reason_labor, reason_integrity, reason_political, reason_community, reason_conduct)
VALUES

-- ══════════════════════════════════════════════════════════════════
-- 1. Jeff Bezos / Amazon
-- ══════════════════════════════════════════════════════════════════
($$Jeff Bezos / Amazon$$, $$combined$$,
 $$Founder/long-time CEO of Amazon assessed alongside the company; post-CEO conduct included. Epstein three-gate: one full gate, two partial (group events 2009–2011); minor conduct penalty applied.$$,
 3, 2, 5, 4, 4, 4, 3.7,
 $$Amazon's logistics fleet is one of the largest carbon emitters in retail; despite the Climate Pledge (2019) and EV van orders, Scope 3 emissions rose substantially through his tenure. AWS data centers are energy-intensive. Personal superyacht (estimated 7,000+ tonnes CO₂/year); Climate Pledge is real but mostly forward-looking.$$,
 $$Amazon warehouse injury rates consistently ran above industry average per OSHA data. Documented union-busting at Staten Island, Alabama, and elsewhere — including surveillance, captive-audience meetings, and terminations of organizers. Delivery drivers misclassified as contractors to deny benefits; warehouse pace-monitoring tied to firing quotas.$$,
 $$No personal criminal convictions. Amazon has faced FTC antitrust suit (2023), data privacy settlements, and seller data misuse allegations; Bezos personally sold $8.5B in Amazon stock shortly before pandemic surge (legal but flagged). Overall: ethically grey, not criminal.$$,
 $$Amazon sold Rekognition facial recognition to law enforcement despite internal and external protest; only paused in 2020 under pressure. AWS hosts ICE and CBP contracts. Amazon lobbied heavily against the PRO Act; Washington Post ownership gives indirect political influence.$$,
 $$Bezos Earth Fund ($10B) is the largest single environmental commitment by an individual — but represents ~6% of his 2021 net worth and has been slow to disburse. Day One Fund ($2B for homelessness/education) is real but modest relative to wealth; not a Giving Pledge signatory.$$,
 $$No criminal record. Post-conviction Epstein contacts documented (2009, 2011) at group events — no evidence of active cultivation; no further contact after 2011. Three-gate: one full gate, two partial — minor penalty. Additionally docked for documented workplace culture of fear and retaliation at executive level.$$),

-- ══════════════════════════════════════════════════════════════════
-- 2. Elon Musk
-- ══════════════════════════════════════════════════════════════════
($$Elon Musk$$, $$combined$$,
 $$Individual and CEO/owner of Tesla, SpaceX, and X (Twitter); 2022 acquisition of Twitter weighted heavily. Epstein three-gate: all three gates met (actively initiated 2012–2015 arc); no personal participation; conduct floor 2.$$,
 5, 3, 4, 3, 3, 2, 3.3,
 $$Tesla's EV mission is genuinely transformative for automotive emissions — one of the most impactful climate actions by any corporation this century. SpaceX rockets emit significant CO₂ and black carbon at altitude (disproportionate warming effect). Nevada Gigafactory drew significant water in an arid region; lithium mining supply chain raises environmental concerns.$$,
 $$Tesla's Fremont factory had injury rates significantly above industry average (Reveal News). Tesla fought union organizing repeatedly, including NLRB-documented illegal firings. Twitter/X mass layoffs (75%+ of workforce) conducted chaotically without proper WARN Act notice; SpaceX retaliated against employees who raised sexual harassment complaints.$$,
 $$SEC settlement (2018) over "funding secured" tweet — $20M fine, forced to step down temporarily as chairman. DOGE promotion to followers without adequate disclosure (FTC inquiry). Multiple regulatory run-ins but no criminal conviction.$$,
 $$X reinstated numerous banned accounts including white nationalist figures; content moderation gutted. Musk personally promoted conspiracy theories with massive reach. Documented receipt of billions in government contracts while simultaneously attacking regulatory oversight. DOGE government role (2025) targets civil service protections; China compliance involves significant censorship.$$,
 $$Musk Foundation gives modestly relative to wealth; resigned from the Giving Pledge. Starlink provision to Ukraine was meaningful but he also threatened to cut it off. Tesla's EV work is a genuine social good; Twitter/X's decimation of the public information commons is a negative social impact of enormous scale.$$,
 $$SpaceX sexual harassment allegations and flight attendant settlement (Business Insider). Amplified extremist and antisemitic-adjacent content on X with enormous reach. Three-gate on Epstein: all three met — Musk actively initiated and sought out contact post-conviction across a 2.5-year arc (2012–2015). No evidence of personal participation in Epstein's crimes; floor = 2. Score: 2.$$),

-- ══════════════════════════════════════════════════════════════════
-- 3. Meta / Zuckerberg
-- ══════════════════════════════════════════════════════════════════
($$Meta / Mark Zuckerberg$$, $$combined$$,
 $$Platform and CEO assessed 2004–2026. Epstein two gates met (2015 dinner, sought further contact); continuity not established beyond one event; moderate conduct penalty of −2 from base 5.$$,
 5, 6, 4, 2, 5, 3, 4.2,
 $$Meta has committed to net-zero emissions and sources significant renewable energy for data centers. Data center energy consumption is enormous in absolute terms. No direct animal welfare concerns; roughly average for a mega-cap tech firm.$$,
 $$Better than most tech firms on pay equity disclosures; compensation among highest in the industry. Large-scale layoffs (2022–23) handled with reasonable severance relative to peers. No major union-busting documented; supply chain is primarily software/servers with lower forced-labor risk.$$,
 $$Five billion dollar FTC settlement (2019) over Cambridge Analytica/privacy violations — largest in FTC history at the time. Ongoing antitrust case (FTC v. Meta). Privacy violations at scale were deliberate and systemic; Zuckerberg personally was warned about data practices and approved them.$$,
 $$Facebook's algorithmic amplification of hate speech was linked by UN inquiry to the Myanmar genocide, and documented in Ethiopia. Platform weaponized for Jan 6 organization. Instagram's documented harm to teen mental health was revealed via suppressed internal research. Scale of harm to civil society and democratic discourse is arguably unparalleled in the tech sector. Score: 2.$$,
 $$Chan Zuckerberg Initiative pledged 99% of Facebook shares — roughly $50–70B — to charitable causes; however, CZI is an LLC, not a foundation, with no legal disbursement obligation. CZI's science/education/justice focus is meaningful; COVID-era misinformation on platform significantly undermined public health response.$$,
 $$No criminal record. Two Epstein gates met — 2015 dinner (7 years post-conviction), Zuckerberg subsequently requested Epstein's contact details; continuity not established. Moderate penalty −2 from base 5. Additionally docked for suppressing platform harm research and misleading Congress.$$),

-- ══════════════════════════════════════════════════════════════════
-- 4. Apple Inc.
-- ══════════════════════════════════════════════════════════════════
($$Apple Inc.$$, $$corporation$$,
 $$Corporation; Tim Cook era weighted most heavily. No documented criminal associations at leadership level.$$,
 7, 5, 6, 4, 6, 7, 5.8,
 $$Apple has achieved carbon neutrality in its own operations and is pushing suppliers toward the same. Right to Repair was actively fought for years but improving. Cobalt and rare earth supply chain mining remains a serious environmental concern. Overall: a genuine leader in corporate environmental action, with supply chain asterisks.$$,
 $$Apple's Supplier Responsibility reports document improvements but also persistent violations in Chinese factories (Foxconn). Cobalt sourcing from DRC has involved child labor (documented by Amnesty). Domestically, Apple is a good employer; NLRB retail union organizing cases are an ongoing concern.$$,
 $$No major financial fraud. EU fined Apple €1.84B for App Store anti-competitive practices (2024). €13B Irish tax arrangement ruled illegal state aid (eventually repaid). App Store antitrust suits ongoing. Regulatory friction but not systemic corruption.$$,
 $$Apple removed apps at Chinese government request (VPNs, news apps, Quran apps); AirDrop anonymity limited in China after protest use. These are significant civil liberties compromises for market access. Domestically, Apple fought FBI on iPhone encryption — a positive for civil liberties. Mixed overall.$$,
 $$Apple gave $200M+ to HBCUs and racial equity initiatives (2020); ConnectED education investment. App Store enables millions of small businesses globally. Tim Cook is personally low-key philanthropic. Not a leading corporate philanthropist relative to profit, but contributions are real.$$,
 $$No criminal convictions at leadership level; no significant associations with convicted serious criminals. Internal culture allegations have been less severe than peers. Generally clean conduct record.$$),

-- ══════════════════════════════════════════════════════════════════
-- 5. ExxonMobil
-- ══════════════════════════════════════════════════════════════════
($$ExxonMobil$$, $$corporation$$,
 $$Corporation assessed across full modern history; climate disinformation strategy weighted heavily. No criminal associations.$$,
 1, 4, 2, 2, 3, 3, 2.5,
 $$ExxonMobil is one of the single largest contributors to global greenhouse gas emissions in history. Internal documents showed the company knew about climate change risks and systematically funded denial and obfuscation. The company's own scientists predicted warming with remarkable accuracy — and leadership chose to suppress it. Score: 1.$$,
 $$Locked out Baton Rouge refinery workers in a prolonged union dispute. Documented workplace safety incidents. Pays above-average wages in extractive sector. No major child or forced labor in direct operations; mid-tier for sector.$$,
 $$NY AG investigation into climate fraud (deceiving investors about climate risk). Multiple international bribery settlements; FCPA violations. The climate disinformation campaign — knowingly funding false science for decades — is one of the largest integrity failures in corporate history. Score: 2.$$,
 $$Spent hundreds of millions lobbying against climate legislation, clean energy standards, and fuel efficiency rules. Funded organizations that opposed Indigenous land rights. Operations in authoritarian states with documented complicity in human rights abuses (Aceh, Indonesia — killings by security forces protecting Exxon assets).$$,
 $$ExxonMobil Foundation gives ~$150M/year, primarily STEM education. However, the climate disinformation campaign's social cost — in delayed global action — is incalculable and must weigh heavily against philanthropy. Score: 3.$$,
 $$No criminal conviction of top executives. Institutional conduct of funding climate denial science crosses a severe ethical line even absent conviction. Valdez spill (1989) caused lasting ecosystem damage with documented legal avoidance. No trafficking or organized crime associations.$$),

-- ══════════════════════════════════════════════════════════════════
-- 6. Koch Industries / Charles Koch
-- ══════════════════════════════════════════════════════════════════
($$Koch Industries / Charles Koch$$, $$combined$$,
 $$Corporation and founding family assessed together; David Koch died 2019, Charles Koch active. No criminal associations.$$,
 2, 3, 3, 1, 4, 4, 2.8,
 $$Koch Industries is a major refining, chemicals, and fossil fuel conglomerate and has been among the top corporate funders of climate change denial (documented by Drexel University/Brulle). Georgia-Pacific operations linked to deforestation and water pollution violations (multiple EPA actions). Environmental record is severely negative.$$,
 $$Numerous OSHA violations and worker deaths at Koch facilities (Pine Bend refinery, Georgia-Pacific). Koch has fought union organizing. Wages at facilities are competitive within sector but safety record is poor.$$,
 $$Koch Industries paid one of the largest environmental penalties in history (2000): $35M for 97 oil spills. Settled with DOJ over illegal benzene emissions. Multiple EPA violations. No criminal convictions of principals.$$,
 $$The Koch network (Americans for Prosperity, ALEC, Heritage Foundation, Cato Institute) represents the largest coordinated private effort to reshape American political and regulatory structures in the modern era — specifically targeting environmental regulation, voting rights, union rights, and social safety nets. Estimated $400M+ in dark money in the 2012 election cycle alone. Score: 1.$$,
 $$Charles Koch has donated hundreds of millions to universities (often with disclosed strings on faculty hiring or curriculum). Criminal justice reform work (Koch-funded) is genuinely bipartisan and positive. The positives exist but are dwarfed by the scale of political harm documented above.$$,
 $$No personal criminal record for Charles Koch. David Koch named in a settled sexual harassment case. No established organized crime associations. Institutional conduct around climate disinformation and political influence is severe without being personally criminal.$$),

-- ══════════════════════════════════════════════════════════════════
-- 7. Bill Gates
-- ══════════════════════════════════════════════════════════════════
($$Bill Gates$$, $$combined$$,
 $$Individual and foundation co-chair; Microsoft tenure weighted but discounted for recency. Epstein three-gate: all three gates met (2011–2014 arc, acknowledged knowledge); no personal participation; conduct floor 2. WSJ (2021): board investigated Gates for pursuing multiple Microsoft employees with NDAs — not a single incident but a documented pattern.$$,
 6, 5, 3, 5, 8, 2, 4.8,
 $$Breakthrough Energy and TerraPower investments represent serious capital deployed against climate change; enormous personal carbon footprint via private jets acknowledged by Gates himself. Foundation agricultural work raises GMO concerns in some regions. Net: large-scale climate investment partially offset by personal footprint.$$,
 $$WSJ (2021) reported the board had investigated Gates for pursuing romantic relationships with multiple Microsoft employees — with NDAs signed by some — before his 2020 resignation; this is not one incident but a documented pattern of exploiting a power differential over subordinates. Microsoft's compensation was competitive; offset by documented hostile environment for targeted employees. Score: 5.$$,
 $$No criminal convictions. Microsoft antitrust case (1998–2001): Gates gave evasive and misleading deposition testimony, played at trial; monopolistic practices were severe and systematic. WSJ (2021) reported the board investigated Gates for pursuing multiple employees with NDAs — initially described as one relationship, the full scope was larger. Boris Nikolic (Gates Foundation executive) was named surprise executor of Epstein's will without Nikolic's prior knowledge — reflecting the depth of the Gates-Epstein business relationship. Pattern of serious integrity failures across multiple documented vectors. Score: 3.$$,
 $$Lobbies on global health, education, and agricultural policy — generally in directions that improve human welfare. Foundation's influence on WHO funding and global health priorities raises legitimate governance questions about private actors setting public health priorities without democratic accountability. Score: 5.$$,
 $$Gates Foundation has disbursed over $60B; polio near-eradicated, malaria prevention at scale, massive HIV treatment access expansion, agricultural investment. Co-creator of the Giving Pledge. Impact on human health is extraordinary. Docked 1 point: Gates is the largest private farmland owner in the United States (~890,000 acres) — land acquired while global food and land security are in crisis, concentrating control over agricultural resources in a single private actor without democratic accountability. Score: 8.$$,
 $$Three-gate on Epstein: all three gates fully met — meetings spanning 2011–2014, acknowledged knowledge of conviction, multiple sought-out contacts including dinners at Epstein's Manhattan mansion. WSJ (2021) documented additional integrity failures: multiple employee relationships with NDAs. No evidence of personal participation in Epstein's crimes; floor = 2. Score: 2.$$),

-- ══════════════════════════════════════════════════════════════════
-- 8. Warren Buffett / Berkshire Hathaway
-- ══════════════════════════════════════════════════════════════════
($$Warren Buffett / Berkshire Hathaway$$, $$combined$$,
 $$Individual and conglomerate. No documented associations with convicted serious criminals.$$,
 4, 5, 6, 6, 9, 7, 6.2,
 $$BHE has made significant wind and solar investments. Burlington Northern transports coal; Pilot Flying J is a fossil fuel retailer; resisted mandatory climate disclosure. Moving toward clean energy but profits from fossil fuel infrastructure.$$,
 $$Subsidiary autonomy means labor practices vary across the conglomerate. BNSF had significant worker disputes in 2022 rail contract negotiations. No systemic child or forced labor documented. Middle of road overall.$$,
 $$Unusually clean integrity record for this scale; no criminal charges or SEC violations. Berkshire subsidiaries had some regulatory issues pre-acquisition. Consistently and publicly critical of Wall Street's ethical culture.$$,
 $$Publicly supported higher taxes on the wealthy and democratic norms; spoken against Citizens United effects. Does not run a major political operation; proportionally small political footprint for his wealth. Positive signals overall. Score: 6.$$,
 $$Pledged to give away over 99% of his wealth — primarily to the Gates Foundation (over $50B donated to date); co-creator of the Giving Pledge; largest individual donor in history by total dollars. Docked for Berkshire's fossil fuel, tobacco, and defense holdings generating harms philanthropy only partially offsets.$$,
 $$No criminal record; no established associations with convicted serious criminals. Among the strongest personal integrity reputations of any major billionaire. Minor dock for Pilot Flying J CEO fraud conviction (2017) as Berkshire subsidiary — Buffett not implicated but raises oversight questions.$$),

-- ══════════════════════════════════════════════════════════════════
-- 9. Walmart
-- ══════════════════════════════════════════════════════════════════
($$Walmart$$, $$corporation$$,
 $$Corporation. $282M FCPA settlement (2019) for bribery in Mexico, Brazil, India, and China. Rana Plaza collapse (1,134 killed, 2013) involved a Walmart supplier.$$,
 4, 3, 3, 4, 5, 4, 3.8,
 $$Project Gigaton is the largest private supply chain climate initiative by scope. Walmart is also among the largest contributors to single-use plastic globally; deforestation in soy, beef, and palm oil supply chain is documented. Mixed execution between pledge and reality.$$,
 $$Suppressed union organizing for decades with documented captive-audience meetings and store closures (Jonquière, Quebec after unionization). Wages improved since 2015 but Rana Plaza collapse — where 1,134 workers died — involved a Walmart supplier. Dukes v. Walmart was the largest employment discrimination case in US history.$$,
 $$$282M FCPA settlement (2019) for bribery across four countries; internal investigators who flagged Mexico bribery were reportedly silenced. Systemic and documented institutional corruption. Score: 3.$$,
 $$Lobbies on retail and trade policy; some donations to gerrymandering-aligned PACs. Supported some criminal justice reform. Moderate civil liberties concern — primarily around labor rights suppression. Score: 4.$$,
 $$Foundation gives ~$1.5B/year on food security and workforce development; low prices measurably improved purchasing power for lower-income Americans. Documented negative effect on local economies via small business displacement. Net: genuine community benefit complicated by systemic labor and sourcing issues.$$,
 $$No leadership criminal convictions. FCPA case involves company-level bribery at scale; internal suppression of bribery warnings is a serious institutional conduct failure. Rana Plaza supply chain deaths represent a conduct failure traceable to sourcing pressure and inadequate oversight.$$),

-- ══════════════════════════════════════════════════════════════════
-- 10. Goldman Sachs
-- ══════════════════════════════════════════════════════════════════
($$Goldman Sachs$$, $$corporation$$,
 $$Financial institution. 1MDB criminal plea (2020); $2.9B penalty. Abacus CDO settlement ($550M). Deep Gulf sovereign wealth fund relationships documented.$$,
 4, 5, 2, 4, 5, 3, 3.8,
 $$Significant sustainable finance commitments ($750B by 2030); continues to finance fossil fuel projects. Core business funds a mix of clean and dirty energy; roughly neutral for a financial institution.$$,
 $$Pays extremely well but works junior employees brutally hard (2021 junior banker revolt documented in internal survey). Supply chain labor risk minimal for a financial institution. No union-busting concerns.$$,
 $$1MDB scandal: Goldman pleaded guilty to FCPA violations, paid $2.9B (2020), facilitating looting of a sovereign wealth fund. 2008 crisis: sold CDOs it simultaneously shorted (Senate Permanent Subcommittee). Abacus deal SEC settlement $550M. Pattern of regulatory evasion and client-adverse conduct at systemic scale. Score: 2.$$,
 $$Goldman alumni permeate government ("Government Sachs" — Paulson, Mnuchin, Cohn, Rubin); revolving door is a documented concern for regulatory capture. Not specifically anti-civil liberties but deeply embedded in financial regulatory capture.$$,
 $$10,000 Women and 10,000 Small Businesses programs are genuine and impactful. 2008 role in accelerating a crisis that cost Americans $12 trillion in household wealth is a social negative of historic scale. Foundation philanthropy real but does not offset institutional harms.$$,
 $$1MDB criminal plea and the institutional culture that enabled it are the most serious markers; three senior bankers convicted; 2008 conduct documented. No personal organized crime associations for current senior leadership. Score: 3.$$),

-- ══════════════════════════════════════════════════════════════════
-- 11. BlackRock / Larry Fink
-- ══════════════════════════════════════════════════════════════════
($$BlackRock / Larry Fink$$, $$combined$$,
 $$Institution and CEO (~$10T AUM). Significant AUM from Gulf autocratic sovereign wealth; Fink meets regularly with MBS and Gulf leaders. No criminal associations.$$,
 5, 6, 6, 4, 5, 6, 5.3,
 $$Significant ESG and climate commitment in Fink's annual letters (2020+). Remains one of the largest investors in fossil fuel companies globally; voted against many shareholder climate resolutions. Stated commitments have been modest relative to stated leadership positions.$$,
 $$Good employer by financial sector standards; compensation strong; no major labor violations documented. Financial institution with minimal supply chain labor exposure.$$,
 $$No major fraud or criminal settlements; some regulatory fines. Generally clean for a firm of this scale. Fee structure transparency has been questioned but not risen to legal concern.$$,
 $$Scale of ownership (~$10T AUM) creates profound questions about corporate democracy and voting power concentration. Fink embraced then retreated from ESG positions under political pressure from Republican AGs — the retreat from stated climate commitments under political pressure is a meaningful negative signal for institutional integrity.$$,
 $$iShares products democratized investing for retail investors globally. Fink's annual letters shifted some corporate behavior on ESG disclosure. No major philanthropy at Gates/Buffett scale relative to personal wealth.$$,
 $$No criminal record; no significant associations with convicted criminals. Saudi Aramco, UAE, and Gulf sovereign wealth funds are among large AUM relationships. Clean personal record.$$),

-- ══════════════════════════════════════════════════════════════════
-- 12. Purdue Pharma / Sackler Family
-- ══════════════════════════════════════════════════════════════════
($$Purdue Pharma / Sackler Family$$, $$combined$$,
 $$Company and controlling family assessed together; family exercised direct strategic control over OxyContin marketing. Opioid crisis killed 500,000+ Americans. No external criminal associations.$$,
 5, 4, 1, 2, 2, 1, 2.5,
 $$Standard pharmaceutical environmental footprint; no extraordinary positive or negative.$$,
 $$Sales reps were trained to minimize addiction risk when presenting OxyContin — making workers instruments of institutional harm. Aggressive quota-driven sales culture; reps were rewarded for pushing high doses.$$,
 $$Purdue pleaded guilty to federal criminal charges (2007 and 2020) for misleading public and healthcare providers about OxyContin addiction risk. Family members directed this campaign; extracted $10B+ before bankruptcy. Richard Sackler documented directing misleading marketing. One of the most severe corporate integrity failures in American history. Score: 1.$$,
 $$Lobbied against opioid regulation for decades; donated politically to maintain favorable regulatory environment; lobbying to prevent oversight that would have saved hundreds of thousands of lives.$$,
 $$Sackler family gave heavily to museums and universities; philanthropy was largely from opioid profits, used to launder reputation, and has been repudiated by many institutions. Net social impact: catastrophically negative.$$,
 $$Criminal guilty pleas by the corporation; court documents show family members directed the fraud; individual family members shielded from civil suit by bankruptcy (partially overturned SCOTUS 2024). Direct institutional direction of a criminal enterprise causing mass casualties. Score: 1.$$),

-- ══════════════════════════════════════════════════════════════════
-- 13. Donald Trump
-- ══════════════════════════════════════════════════════════════════
($$Donald Trump$$, $$combined$$,
 $$Individual, businessman, and 45th/47th US President across full career arc. Personal criminal convictions (34 felony counts, 2024); civil fraud judgment ($454M); civil sexual abuse finding. Three-gate fully met (Manafort, Cohen, Flynn, Stone). Conduct score 1.$$,
 2, 3, 1, 2, 3, 1, 2.0,
 $$Withdrew from Paris Climate Agreement (both terms). Rolled back 100+ environmental regulations; weakened CAFE standards; opened ANWR to drilling; weakened Clean Water Act. Second term declared national energy emergency. No significant positive environmental actions documented.$$,
 $$Trump Organization documented use of undocumented workers at golf courses. Multiple labor disputes with contractors unpaid (Atlantic City). Weakened OSHA enforcement; opposed minimum wage increases. Steel tariffs intended to protect industrial workers with mixed documented effect.$$,
 $$Trump Organization convicted of criminal tax fraud on 17 counts (2022). Found liable for fraud by NY AG ($454M judgment, 2024) for inflating asset values. 34 felony convictions (hush money/falsifying business records, 2024); four separate criminal indictments. Score: 1.$$,
 $$Jan. 6, 2021: House Select Committee found Trump engaged in a multi-part plan to overturn the legitimate election — pressured VP Pence, state officials, DOJ. Muslim ban; family separation at border. Broad use of emergency powers and mass deportations (2025). Score: 2.$$,
 $$Trump Foundation dissolved by NY AG after documented self-dealing. Operation Warp Speed (COVID vaccine acceleration) is a genuine and significant positive. First Step Act (criminal justice reform) is a genuine bipartisan positive. Charitable record outside these two achievements is poor.$$,
 $$Personal criminal convictions (34 felony counts); corporate criminal fraud conviction; civil fraud judgment; civil sexual abuse finding (Carroll, 2023). Three-gate: all three fully met across Manafort, Cohen, Flynn, Stone — decades-long deep associations. Personal criminal convictions supersede the floor mechanism. Score: 1.$$),

-- ══════════════════════════════════════════════════════════════════
-- 14. Rupert Murdoch / Fox / News Corp
-- ══════════════════════════════════════════════════════════════════
($$Rupert Murdoch / Fox / News Corp$$, $$combined$$,
 $$Individual and media empire; Fox News weighted as primary cultural product. UK phone hacking settlement; Dominion Voting $787.5M settlement (2023). No personal criminal conviction.$$,
 4, 4, 2, 1, 3, 3, 2.8,
 $$News Corp has sustainability commitments. Fox's decades of climate skepticism programming have measurably delayed US public action on climate change — indirect but large in scale.$$,
 $$Multiple documented sexual harassment settlements at Fox News (Roger Ailes, Bill O'Reilly, others) totaling $90M+; HR culture hostile to complainants; Murdoch presided over this culture for decades.$$,
 $$UK phone hacking (News of the World): hacked voicemail of murdered teenager Milly Dowler; hundreds of millions in settlements; Murdoch found "not fit" to run a broadcaster by UK parliamentary committee. Dominion settlement ($787.5M, 2023): internal discovery showed hosts and executives knew election fraud claims were false and broadcast them regardless.$$,
 $$Fox's documented, knowing broadcast of election fraud disinformation directly harmed American democratic institutions. Murdoch tabloids in UK and Australia documented shaping elections through disinformation. Fox programming central to mainstreaming content normalizing political violence. Score: 1.$$,
 $$WSJ provides legitimate journalism of genuine value. Fox News's role in COVID vaccine skepticism is associated with lower vaccination rates in Fox-heavy areas (peer-reviewed studies) and likely contributed to preventable deaths. Net community impact: negative.$$,
 $$No personal criminal conviction; executives below Murdoch convicted in phone hacking. Dominion internal discovery is most damning: leadership knew claims were false. Institutional conduct on disinformation is a severe, documented, knowing failure.$$),

-- ══════════════════════════════════════════════════════════════════
-- 15. Patagonia
-- ══════════════════════════════════════════════════════════════════
($$Patagonia$$, $$corporation$$,
 $$Corporation; founder Yvon Chouinard and the 2022 transfer of company ownership to a climate trust weighted heavily. No criminal associations.$$,
 9, 8, 8, 8, 9, 8, 8.3,
 $$Benchmark environmental corporate citizen; 1% for the Planet co-founder. Worn Wear repair program extends product life. Organic cotton since 1996. In 2022, Chouinard transferred ownership to a trust with all profits (~$100M/year) going to fighting climate change. Acknowledged microplastic pollution from fleece products. Score: 9.$$,
 $$Fair Trade certified factories. On-site childcare since 1984; above-average pay and benefits for retail sector. Supplier audits with real follow-through; supports employees' civic activism including providing bail for arrested environmental protesters.$$,
 $$No significant regulatory violations or financial misconduct. B Corp certified with high scores. Transparent about environmental claims, including acknowledging product shortcomings.$$,
 $$Sued Trump administration over Bears Ears National Monument reduction (2017). Campaigns for environmental legislation; donates to environmental ballot measures; employees encouraged in civic activism. No anti-democratic activity documented. Score: 8.$$,
 $$The 2022 transfer of company ownership to fight climate change — rather than IPO or family inheritance — is one of the most extraordinary acts of corporate philanthropy in American history. Environmental grant program has funded thousands of grassroots groups. Score: 9.$$,
 $$No significant conduct concerns. Chouinard and leadership have clean records. No associations with convicted criminals. Conduct record is among the strongest in the dataset.$$),

-- ══════════════════════════════════════════════════════════════════
-- 16. Johnson & Johnson
-- ══════════════════════════════════════════════════════════════════
($$Johnson & Johnson$$, $$corporation$$,
 $$Corporation. Pattern of knowing concealment across talc/asbestos, opioids, and Risperdal over multiple decades — three separate institutional integrity failures.$$,
 5, 5, 2, 4, 5, 3, 4.0,
 $$Committed to carbon neutrality; animal testing reduced but not eliminated; no severe environmental violations. Moderate pharmaceutical footprint overall.$$,
 $$Generally a good employer; some supply chain labor concerns. Pay equity disclosures above average for sector. No systemic labor violations documented.$$,
 $$Talc/asbestos: found by courts to have known talc contained asbestos and concealed it for decades ($9B settlement, 2023). Opioid: $5B national settlement (2021). $2.2B DOJ criminal fine for off-label Risperdal marketing to dementia patients and children. Pattern of knowing concealment across multiple product lines is an integrity failure of historic scope. Score: 2.$$,
 $$Standard pharmaceutical lobbying; no extraordinary civil liberties concerns. Some positive public health policy advocacy.$$,
 $$Long history of disaster relief and global health contributions (HIV drugs at cost in Africa, COVID vaccine at not-for-profit pricing). Offset by the scale of harm from opioid and talc crises. Net: genuine positives partially undone by institutional product harm.$$,
 $$Pattern of knowing concealment of product harms across decades and multiple product lines is a severe institutional conduct failure. No individual criminal convictions of C-suite executives despite documented executive-level awareness.$$),

-- ══════════════════════════════════════════════════════════════════
-- 17. Philip Morris / Altria
-- ══════════════════════════════════════════════════════════════════
($$Philip Morris / Altria$$, $$corporation$$,
 $$Tobacco corporation. Decades of documented, knowing concealment of addiction and cancer risk. Tobacco kills approximately 8 million people per year globally.$$,
 3, 3, 2, 2, 2, 2, 2.3,
 $$Tobacco farming associated with deforestation, pesticide use, and child labor in growing regions. IQOS heated tobacco marketed as reduced harm but not reduced environmental impact. Score: 3.$$,
 $$Child labor in tobacco farming supply chain documented by Human Rights Watch across multiple countries. Programs to address it exist but violations persist; Harkin-Engel Protocol deadlines missed repeatedly.$$,
 $$Internal documents revealed decades of knowing concealment of addiction and cancer risk; billions in settlements globally. In EU, PMI accused of orchestrating cigarette smuggling to evade taxes. Score: 2.$$,
 $$PMI aggressively sued governments (Australia, Uruguay) under investor-state arbitration for plain packaging laws — using trade treaties to override democratic public health legislation. Score: 2.$$,
 $$Foundation for a Smoke-Free World (PMI-funded) widely criticized as a lobbying vehicle disguised as philanthropy. Tobacco kills approximately 8 million people per year globally, with PMI as one of the largest contributors to that figure. Score: 2.$$,
 $$Decades of proven, knowing concealment of lethal product harm is among the most severe institutional conduct records in modern corporate history. No criminal leadership convictions despite documented executive awareness.$$),

-- ══════════════════════════════════════════════════════════════════
-- 18. OpenAI / Sam Altman
-- ══════════════════════════════════════════════════════════════════
($$OpenAI / Sam Altman$$, $$combined$$,
 $$Organization and CEO; 2015–2026 arc. No documented criminal associations. November 2023 board crisis raised governance questions.$$,
 4, 5, 5, 4, 6, 5, 4.8,
 $$AI training and inference are extraordinarily energy-intensive; GPT-4 training emitted hundreds of tonnes CO₂; data center water usage significant (via Microsoft/OpenAI infrastructure). The footprint is largely unaddressed in public commitments.$$,
 $$Kenyan contractors used for content moderation paid approximately $2/hour (TIME investigation, 2023); OpenAI distanced itself from Sama but the outsourcing is documented. Domestic employees are very well compensated. Stark internal contrast.$$,
 $$No criminal fraud or regulatory violations. November 2023 board crisis raised governance questions about nonprofit controlling capped-profit entity; the Microsoft investment relationship creates ongoing tension with nonprofit mission. Altman reinstated after five-day removal.$$,
 $$Models used for political disinformation despite policies against it; content moderation of politically sensitive topics inconsistent. No direct anti-civil liberties lobbying. Broader AI impact on civil discourse and employment is prospective but large-scale.$$,
 $$ChatGPT democratized access to sophisticated information globally — a meaningful positive for education especially in underserved populations. Safety research funded. Offset by contractor treatment and displacement risks.$$,
 $$Altman subject to board investigation leading to brief termination; specifics never fully disclosed publicly. No criminal record; no established associations with convicted criminals. Score: 5.$$),

-- ══════════════════════════════════════════════════════════════════
-- 19. George Soros / Open Society Foundations
-- ══════════════════════════════════════════════════════════════════
($$George Soros / Open Society Foundations$$, $$combined$$,
 $$Individual and philanthropic institution. 2002 French insider trading conviction (upheld on appeal) is primary integrity mark. $32B+ donated to democratic institution-building globally.$$,
 5, 5, 5, 7, 8, 6, 6.0,
 $$Open Society has funded environmental justice work but is not primarily an environmental organization. Personal footprint typical of ultra-high-net-worth individual.$$,
 $$Hedge fund operator; Soros Fund Management not a major labor concern; pays well; no documented violations.$$,
 $$France convicted Soros of insider trading (2002) — upheld by French courts — relating to a 1988 Société Générale trade; fine paid. Old and disputed but documented. No other financial crime convictions.$$,
 $$Open Society Foundations has spent over $32B funding civil society, independent media, rule of law programs, and democratic institutions globally — particularly in post-Communist Eastern Europe. Framework is consistently pro-civil liberties and pro-democratic institution-building. Score: 7.$$,
 $$$32B+ donated; one of the largest philanthropic commitments in history. Roma rights work, independent media support, and rule of law programs in transitional democracies are documented and significant. Giving Pledge member.$$,
 $$Insider trading conviction (old and disputed) is primary concern. No associations with convicted serious criminals. Otherwise clean personal conduct record.$$),

-- ══════════════════════════════════════════════════════════════════
-- 20. Chevron
-- ══════════════════════════════════════════════════════════════════
($$Chevron$$, $$corporation$$,
 $$Corporation. Ecuador Amazon contamination (1,700 sq mi — described as world's worst oil-related environmental disaster); $9.5B judgment fought for decades. Kazakhstan bribery. No personal criminal associations.$$,
 1, 4, 3, 2, 3, 3, 2.7,
 $$Ecuador (Texaco/Chevron) contaminated 1,700 square miles of Amazon rainforest. Richmond, CA refinery explosion (2012). Continuing flaring and methane emissions globally. Chevron fought the $9.5B Ecuadorian judgment for decades regardless of the documented environmental harm. Score: 1.$$,
 $$Competitive wages in sector; some labor disputes; supply chain concerns in extraction regions. Generally mid-tier for sector.$$,
 $$Kazakhstan bribery: linked to Giffen corruption scandal; FCPA-adjacent settlements. Ecuador litigation involved documented payments to opposing counsel's expert in US proceedings. Multiple regulatory issues without criminal conviction of top executives.$$,
 $$Heavy lobbying against climate regulation. Maintained Myanmar operations post-coup longer than peers. Operations in authoritarian states with human rights concerns. Niger Delta human rights issues documented.$$,
 $$Gives ~$300M/year to community programs. Offset heavily by environmental and human rights record across multiple decades and geographies.$$,
 $$Ecuador situation — regardless of how US courts treated the judgment — involves genuine documented environmental harm to indigenous communities that Chevron has spent decades and billions avoiding accountability for. Institutional conduct on environmental and legal accountability is a defining failure.$$),

-- ══════════════════════════════════════════════════════════════════
-- 21. Walton Family
-- ══════════════════════════════════════════════════════════════════
($$Walton Family$$, $$combined$$,
 $$Walmart heirs assessed as individual philanthropists, distinct from the corporation. No criminal associations.$$,
 5, 3, 5, 4, 6, 6, 4.8,
 $$Walton Family Foundation has invested significantly in ocean conservation and Colorado River restoration — genuine and impactful environmental grants. Personal wealth derived from Walmart's supply chain with its own environmental negatives.$$,
 $$Walton wealth derived from a company with a documented history of labor suppression; family has not used its ownership position to meaningfully improve Walmart's labor practices.$$,
 $$No personal financial crimes documented. No criminal associations.$$,
 $$Significant funding of school choice/charter school advocacy — contested but not anti-democratic in kind. Some funding of conservative PACs.$$,
 $$Walton Family Foundation has given over $2B to education (charter schools, scholarships), environmental conservation, and community development in Bentonville, AR. Real and documented positive impact in conservation. Below Giving Pledge scale relative to wealth.$$,
 $$No criminal record; no established associations with convicted criminals. Clean personal conduct record.$$),

-- ══════════════════════════════════════════════════════════════════
-- 22. Amnesty International
-- ══════════════════════════════════════════════════════════════════
($$Amnesty International$$, $$organization$$,
 $$Organization. 2019 independent review found toxic internal culture; two staff suicides; leadership changes followed. Core human rights documentation mission remains foundational.$$,
 6, 6, 7, 8, 8, 6, 6.8,
 $$Expanded mandate to include climate justice and environmental defenders. Not primarily environmental but consistently supportive. No significant negative footprint.$$,
 $$Independent 2019 review found toxic internal work culture at secretariat — bullying, harassment, two staff suicides; leadership changes followed. External labor rights advocacy is strong and the contrast with internal culture prompted genuine reform.$$,
 $$No financial fraud; transparent reporting. Some concerns about funding source independence historically; generally clean.$$,
 $$Core mission — documenting and advocating for political and civil rights globally — executed with documented impact across Myanmar, Belarus, Saudi Arabia, Uyghur detention, and others. 2022 Ukraine report was controversial; methodological issues acknowledged. Foundational institution for global human rights documentation. Score: 8.$$,
 $$Campaigns have contributed to releases of prisoners of conscience, abolition of torture practices, and policy changes on the death penalty. Global membership and fundraising are transparent.$$,
 $$Internal culture review and staff deaths are serious; leadership responded with genuine reforms. No criminal associations. Score: 6.$$),

-- ══════════════════════════════════════════════════════════════════
-- 23. The Red Cross (ICRC + American Red Cross)
-- ══════════════════════════════════════════════════════════════════
($$The Red Cross$$, $$organization$$,
 $$Institution; both ICRC and American Red Cross arms considered. Post-Haiti and Sandy fund deployment failures documented by ProPublica.$$,
 6, 5, 4, 7, 8, 6, 6.0,
 $$Neutral operational footprint; humanitarian logistics have some carbon cost. No environmental violations. Increasingly integrating climate disaster preparedness into programming.$$,
 $$ICRC is a strong employer with strong protections; American Red Cross has faced workplace misconduct complaints and internal culture issues (ProPublica investigations). Mixed between the two arms.$$,
 $$After Hurricane Sandy and Haiti earthquake, investigative reports documented poor fund deployment and inflated impact claims (six homes built with $500M raised for Haiti — ProPublica). Not criminal fraud but serious operational integrity failures. ICRC has a cleaner record.$$,
 $$ICRC role in maintaining humanitarian law in conflict zones is foundational. American Red Cross disaster relief operates without political discrimination. Neutral mandate is a genuine institutional strength. Score: 7.$$,
 $$Despite operational failures, Red Cross institutions provide massive humanitarian relief — US blood supply (~40%), disaster response, refugee assistance, prisoner visits. Overall humanitarian impact across history is extraordinary. Score: 8.$$,
 $$No criminal record at leadership level. Haiti/Sandy fund deployment failures are serious but not criminal. Internal culture issues addressed but ongoing. Score: 6.$$),

-- ══════════════════════════════════════════════════════════════════
-- 24. MSF / Doctors Without Borders
-- ══════════════════════════════════════════════════════════════════
($$MSF / Doctors Without Borders$$, $$organization$$,
 $$Organization; Nobel Peace Prize 1999. Refuses government funding that would compromise independence. Operates in the world's most dangerous conflict and disease zones.$$,
 6, 6, 8, 7, 9, 7, 7.2,
 $$Humanitarian logistics have environmental costs; no significant negative footprint. Increasingly conscious of footprint in field operations.$$,
 $$Faced documented challenges with sexual exploitation and abuse in field operations; independent review (2021) found systemic issues. Leadership has responded with genuine reforms. Healthcare worker safety advocacy is strong.$$,
 $$Highly transparent financial reporting; refuses government funding that would compromise operational independence. No financial fraud documented. Among the most financially transparent large NGOs.$$,
 $$Advocacy on access to medicines — arguing against pharmaceutical patents blocking generic HIV drugs — has been significant and positive for global health equity. Documented speaking out in conflict zones when other organizations remain silent.$$,
 $$Provides medical care in the world's most dangerous conflict and disease zones — Ebola response, Syrian conflict, Yemen, Gaza, CAR, DRC — where no other organization goes. Nobel Peace Prize 1999. Impact on human life is profound and documented. Score: 9.$$,
 $$Sexual exploitation findings are serious and organization responded with genuine reform efforts. No criminal associations at leadership level. Among the most ethical international organizations in this dataset.$$),

-- ══════════════════════════════════════════════════════════════════
-- 25. Nestlé
-- ══════════════════════════════════════════════════════════════════
($$Nestlé$$, $$corporation$$,
 $$Corporation. Infant formula marketing violations, child labor in cocoa supply chain, and plastic pollution are defining institutional issues.$$,
 2, 2, 3, 4, 3, 3, 2.8,
 $$Ranked #1 or #2 in brand audit ocean plastic studies (Break Free From Plastic) across multiple years. Water extraction in drought-stressed communities. Palm oil sourcing linked to deforestation. Factory farming in dairy/meat supply chains. Score: 2.$$,
 $$Child labor in cocoa supply chain (Ivory Coast): Nestlé acknowledged in 2021 US Supreme Court case it could not guarantee supply chain free of child labor. Harkin-Engel Protocol deadlines on child labor in cocoa have been missed repeatedly since 2001.$$,
 $$Baby formula marketing in developing countries: WHO International Code violations documented across decades — marketing formula as superior to breast milk where safe water for mixing was unavailable, contributing to infant deaths. Multiple regulatory fines globally. Score: 3.$$,
 $$Lobbies against food labeling legislation and water regulation. Operations in authoritarian states. No specific civil liberties agenda but regulatory obstruction on public health grounds is a concern.$$,
 $$Nestlé Foundation funds nutrition research; some community investment. Massively offset by documented harms in infant formula, child labor, water extraction, and plastic pollution. Score: 3.$$,
 $$Institutional conduct on infant formula is among the most documented corporate health harm cases in history — spanning six decades. No criminal leadership convictions despite documented executive-level awareness.$$),

-- ══════════════════════════════════════════════════════════════════
-- 26. The Carlyle Group
-- ══════════════════════════════════════════════════════════════════
($$The Carlyle Group$$, $$corporation$$,
 $$Private equity firm. Gulf sovereign wealth among documented LP investors. Former senior officials (George H.W. Bush, James Baker, John Major) on advisory boards. NY pension pay-to-play settlement ($20M, 2009).$$,
 3, 3, 3, 4, 4, 5, 3.7,
 $$Significant investments in fossil fuel, defense, and industrial sectors. Limited ESG disclosure historically. No direct environmental operations.$$,
 $$Private equity model associated with job cuts, wage suppression, and benefit reductions at portfolio companies (documented by Economic Policy Institute). Portfolio company bankruptcies have affected workers.$$,
 $$New York pension pay-to-play scandal (2009): Carlyle paid $20M to settle SEC charges related to payments to placement agent connected to NY pension fund. No criminal conviction of principals.$$,
 $$Roster of former government officials creates revolving door between government and private equity — documented concern for regulatory capture. Not anti-civil liberties per se but concentrated private-public power crossover is a structural concern.$$,
 $$Some portfolio company community benefits. No significant firm-level philanthropy relative to AUM. Contributes to high-value manufacturing and defense employment in some communities.$$,
 $$No criminal convictions of current leadership. Pay-to-play settlement is primary integrity mark. Gulf LP relationships and revolving door concerns are structural but not individually criminal.$$),

-- ══════════════════════════════════════════════════════════════════
-- 27. Hillary Clinton
-- ══════════════════════════════════════════════════════════════════
($$Hillary Clinton$$, $$individual$$,
 $$Full arc as First Lady, Senator, Secretary of State, and presidential candidate. CHIP (8M children), CHAI (HIV treatment for millions). Iraq War vote; Libya intervention produced failed state. No criminal charges.$$,
 5, 6, 4, 3, 6, 6, 5.0,
 $$Strong environmental Senate voting record; led climate diplomacy at Copenhagen and Cancún. Actively promoted hydraulic fracturing globally as Secretary of State (State Dept Bureau of Energy Resources program) — a significant and underreported negative. Shifted against fracking as 2016 candidate.$$,
 $$Strong pro-labor Senate voting record (EFCA, minimum wage, FMLA). Did not challenge union-busting during Walmart board tenure (1986–1992). Supported NAFTA through most of career before 2016 reversal; documented negative effect on manufacturing employment. Net: positive Senate record but NAFTA legacy.$$,
 $$Email server: FBI found conduct "extremely careless" with classified material — no charges filed but a real institutional integrity failure. Clinton Foundation donor relationships during State Dept tenure created documented conflicts of interest (AP investigation). No criminal charges from Whitewater. Score: 4.$$,
 $$Advanced women's rights and LGBTQ+ rights globally as Secretary of State — concrete multilateral achievements. 2002 Iraq War vote: voted yes without reading full classified NIE. Libya (2011): primary internal advocate for NATO intervention that produced a failed state, slave markets, and migration crisis. Opposed same-sex marriage until 2013. Score: 3.$$,
 $$CHIP as First Lady (8 million children covered — genuine, large, lasting positive). CHAI expanded HIV treatment to millions globally. Decades of public service. Offset by downstream humanitarian disasters of Iraq and Libya.$$,
 $$No criminal record; no established associations with convicted criminals. Email server conduct is poor judgment, not criminal. No documented sexual misconduct.$$),

-- ══════════════════════════════════════════════════════════════════
-- 28. Lockheed Martin
-- ══════════════════════════════════════════════════════════════════
($$Lockheed Martin$$, $$corporation$$,
 $$Corporation. 1970s bribery scandal directly led to passage of the Foreign Corrupt Practices Act (1977). F-35 program: hundreds of billions over original cost estimates.$$,
 4, 5, 3, 3, 5, 4, 4.0,
 $$Industrial manufacturing with significant toxic waste history (Superfund sites). Some environmental remediation underway. Defense products have large carbon and material footprints over lifecycle.$$,
 $$Strong unionization (IAM, IFPTE); decent wages and benefits; good OSHA record relative to manufacturing peers. One of the better large defense employers on labor metrics.$$,
 $$1970s bribery scandal — paying bribes to Japan, Netherlands, Italy — was so significant it directly led to passage of the FCPA (1977). F-35 cost overruns (hundreds of billions beyond original estimates) involve documented contractor misrepresentation of timelines and costs.$$,
 $$Lobbying power over Pentagon procurement is a documented concern for military-industrial complex dynamics. Weapons sold to Saudi Arabia used in Yemen with documented civilian casualties (Human Rights Watch).$$,
 $$Provides high-skilled, high-paying jobs in manufacturing communities; STEM education investment; defense products have genuine national security value. Offset by enabling conflicts via weapons sales.$$,
 $$Historical bribery scandal remains historically significant. No recent criminal convictions. No personal criminal associations in current leadership.$$),

-- ══════════════════════════════════════════════════════════════════
-- 29. Barack Obama
-- ══════════════════════════════════════════════════════════════════
($$Barack Obama$$, $$individual$$,
 $$44th US President and post-presidency. No documented associations with convicted serious criminals. ACA; Paris Agreement; drone program and NSA surveillance are defining negatives.$$,
 7, 6, 5, 4, 6, 7, 5.8,
 $$Clean Power Plan; Paris Agreement leadership; doubled fuel economy standards; protected 550M+ acres of public land; rejected Keystone XL. US became world's largest oil producer under Obama — a significant asterisk. Overall: one of the stronger environmental presidential records in history.$$,
 $$ACA improved healthcare access for workers without employer insurance; supported NLRB reforms; raised federal contractor minimum wage; auto bailout preserved hundreds of thousands of manufacturing jobs. 2008–09 recovery structured to protect bank creditors over homeowners; virtually no senior Wall Street figures prosecuted despite documented fraud.$$,
 $$No personal criminal charges; relatively clean of financial corruption. Prosecuted more whistleblowers under the Espionage Act than all prior presidents combined — Drake, Kiriakou, Manning, Snowden and others — a sustained, presidentially directed campaign against accountability that is a meaningful integrity failure. Score: 5.$$,
 $$ACA, repeal of Don't Ask Don't Tell, DACA, support for same-sex marriage (2012), stopped defending DOMA — genuine and lasting civil rights achievements. NSA PRISM bulk surveillance likely unconstitutional (Klayman v. Obama); drone program killed hundreds of documented civilians; extrajudicial killing of US citizen Anwar al-Awlaki and his 16-year-old son. Libya intervention produced failed state. Score: 4.$$,
 $$ACA extended healthcare to 20M+ Americans; Recovery Act invested substantially in clean energy and employment. Obama Foundation active. Libya and Yemen outcomes — failed state, famine, slave markets — are humanitarian disasters his decisions materially contributed to and weigh against this dimension.$$,
 $$No criminal record; no established associations with convicted criminals. Personal conduct record clean. Docked one point for systematic Espionage Act prosecution pattern — a sustained personal executive decision with documented chilling effects on press freedom.$$),

-- ══════════════════════════════════════════════════════════════════
-- 30. Dario Amodei / Anthropic
-- ══════════════════════════════════════════════════════════════════
($$Dario Amodei / Anthropic$$, $$combined$$,
 $$CEO and co-founder of Anthropic (2021–present). Left OpenAI over principled safety disagreements. Constitutional AI and safety research are genuine contributions. Anthropic settled with authors over unauthorised use of copyrighted books in Claude training data (2025). Publicly refused to subordinate AI safety standards to Pentagon pressure on autonomous weapons development.$$,
 5, 7, 5, 8, 6, 7, 6.3,
 $$Anthropic's infrastructure is energy-intensive but Amodei has been one of the most consistent public voices on AI energy concerns. No specific negative footprint beyond industry norm.$$,
 $$Anthropic is a good employer with strong reported culture; no labor violations documented; contractor treatment substantially better than OpenAI (no documented $2/hour content moderation outsourcing). Score: 7.$$,
 $$Anthropic settled with a class of authors who alleged Claude was trained on their copyrighted books without authorisation or compensation. Settlement terms undisclosed; no admission of liability, but the underlying conduct — ingesting protected works at scale without licensing — represents a meaningful integrity failure for a company that markets itself on safety and ethics. Score: 5.$$,
 $$Consistently advocates for AI safety regulation, mandatory evaluations, and government oversight of frontier models — pro-democratic and pro-accountability positions in an industry dominated by anti-regulatory voices. Publicly refused to allow Claude to be deployed for autonomous weapons targeting under Pentagon pressure, accepting commercial loss over safety compromise. Score: 8.$$,
 $$Claude models have been widely used for education and research. Constitutional AI research is a genuine contribution to the field. Anthropic's public communications are unusually substantive and honest about AI risks.$$,
 $$No criminal record. No associations with convicted criminals. No documented personal conduct failures. Score: 7.$$),

-- ══════════════════════════════════════════════════════════════════
-- 31. Google / Alphabet / Sundar Pichai
-- ══════════════════════════════════════════════════════════════════
($$Google / Alphabet / Sundar Pichai$$, $$combined$$,
 $$Corporation and CEO; full arc 2004–2026. DOJ antitrust verdict (2024) found illegal maintenance of search monopoly. EU fines totalling €8B+. Carbon-neutral since 2007.$$,
 6, 5, 3, 4, 6, 5, 4.8,
 $$Carbon-neutral since 2007; matched energy use with renewables since 2017. Data center energy consumption is enormous in absolute terms. Google's search advertising model incentivizes attention-driven content of dubious social benefit.$$,
 $$Settled $118M gender pay discrimination class action (2022). Fired 28 employees after protests against Project Nimbus (Israel cloud contract). No major supply chain forced labor. Good employer domestically.$$,
 $$DOJ antitrust verdict (2024): Google found to have illegally maintained its search monopoly via exclusive distribution agreements. EU fines of €8B+ across Shopping, Android, AdSense. Pattern of monopolistic conduct across multiple product lines. Score: 3.$$,
 $$YouTube amplification of radicalization pipelines documented by researchers; removed content inconsistently; China operations complied with censorship for years before exit; Dragonfly project designed China-compliant search. Political advertising policies weak.$$,
 $$Google Search and Maps have genuine social utility at planetary scale. Google.org and philanthropy real but modest relative to profit. Street View, Translate, and accessibility tools provide meaningful public value.$$,
 $$$390M Street View privacy settlement (EU). Project Maven drone AI protest resolved, then Project Nimbus repeated the dynamic. No criminal record for leadership; institutional conduct on antitrust reflects a pattern of monopolistic strategy.$$),

-- ══════════════════════════════════════════════════════════════════
-- 32. Microsoft / Satya Nadella
-- ══════════════════════════════════════════════════════════════════
($$Microsoft / Satya Nadella$$, $$combined$$,
 $$Corporation and CEO (2014–present); post-Ballmer era weighted. Carbon negative pledge by 2030; $1B Climate Innovation Fund. No criminal associations.$$,
 7, 6, 5, 5, 7, 6, 6.0,
 $$Carbon negative pledge by 2030; $1B Climate Innovation Fund; water positive and zero waste commitments. Data center growth is enormous and the pledges are genuinely ambitious. Supply chain transparency improving under Nadella.$$,
 $$Strong pay and benefits; good diversity metrics relative to tech peers. GitHub acquisition preserved open source culture. Some WARN Act questions in 2023 layoffs. Generally strong on labor.$$,
 $$Antitrust violations under Ballmer-era (predated Nadella). $29B IRS transfer pricing dispute settled (2023). Activision acquisition cleared after lengthy regulatory review. No criminal fraud documented under Nadella.$$,
 $$GitHub Copilot copyright litigation ongoing. LinkedIn operates in China with documented content restrictions. Committed to preserving electoral integrity via AI deepfake watermarking; generally positive on civil liberties under Nadella.$$,
 $$Accessibility commitment is genuine (disability employment, accessible products). $100M Affordable Housing Fund (Seattle). AI for Health and AI for Good programs are real. Democratized cloud computing for small businesses globally.$$,
 $$No criminal record; no significant associations with convicted criminals. Nadella has been unusually thoughtful and measured as a CEO of this scale. Score: 6.$$),

-- ══════════════════════════════════════════════════════════════════
-- 33. NVIDIA / Jensen Huang
-- ══════════════════════════════════════════════════════════════════
($$NVIDIA / Jensen Huang$$, $$combined$$,
 $$Corporation and founder-CEO. SEC $5.5M settlement (2022) for not disclosing that crypto mining drove gaming GPU revenue surge. No criminal associations.$$,
 4, 6, 6, 5, 6, 7, 5.7,
 $$AI training on NVIDIA chips is one of the largest new energy consumption categories globally — NVIDIA enablement of this is an indirect but significant environmental concern. No direct environmental operations beyond chip manufacturing (outsourced to TSMC).$$,
 $$Strong employer; high pay and benefits; no significant labor violations documented. Supply chain (via TSMC) raises standard semiconductor labor concerns but not at elevated severity for NVIDIA directly.$$,
 $$SEC $5.5M settlement (2022) for not properly disclosing that crypto mining contributed to gaming GPU revenue — inadequate disclosure rather than fraud. No criminal violations; relatively clean record.$$,
 $$Export controls on NVIDIA chips to China (A100, H100) and Russia: NVIDIA has complied with US government restrictions. No direct anti-civil-liberties activity; AI chip sales implicitly enable a broad range of applications including surveillance.$$,
 $$NVIDIA's GPU architecture has enabled modern AI, scientific computing, climate modeling, and drug discovery at scale — the enabling infrastructure for substantial human benefit. Foundation AI philanthropy is modest; contribution is primarily through technology itself.$$,
 $$No criminal record; no associations with convicted criminals. SEC disclosure settlement is minor by the standards of this dataset. Huang has a clean personal conduct record. Score: 7.$$),

-- ══════════════════════════════════════════════════════════════════
-- 34. JPMorgan Chase / Jamie Dimon
-- ══════════════════════════════════════════════════════════════════
($$JPMorgan Chase / Jamie Dimon$$, $$combined$$,
 $$Institution and CEO. $13B DOJ settlement (2013) for mortgage-backed securities fraud. Largest fossil fuel financier globally since Paris Agreement despite stated commitments.$$,
 4, 5, 3, 4, 5, 5, 4.3,
 $$Largest fossil fuel financier in the world since the Paris Agreement (Banking on Climate Chaos report, multiple years). Has made Paris-aligned pledges but financing data contradicts them. Score: 4.$$,
 $$Strong employer by financial sector standards; generally good wages and benefits. No major labor violations documented. Dimon publicly opposes work-from-home, generating employee friction, but not a labor violation.$$,
 $$$13B DOJ settlement (2013) — largest in history at the time — for mortgage-backed securities fraud pre-dating Dimon's full control but resolved under him. London Whale: $920M settlement (2013) for trading losses and concealment. Pattern of large regulatory settlements. Score: 3.$$,
 $$JPMorgan's scale gives it significant political influence via lobbying. Deep relationships with Saudi Aramco, UAE, and Gulf SWFs. No specific anti-civil-liberties agenda but enormous financial regulatory capture concern.$$,
 $$Large-scale small business lending; community development financial institution work; infrastructure investment. Offset by fossil fuel financing and role in financial system that amplifies inequality.$$,
 $$No personal criminal record for Dimon. Goldman/JPMorgan London Whale concealment was an institutional conduct failure. No associations with convicted criminals beyond normal business context. Score: 5.$$),

-- ══════════════════════════════════════════════════════════════════
-- 35. Shopify / Tobias Lütke
-- ══════════════════════════════════════════════════════════════════
($$Shopify / Tobias Lütke$$, $$combined$$,
 $$Canadian corporation and co-founder/CEO; headquartered Ottawa, Ontario. Sustained over 1.7M businesses globally. No criminal associations.$$,
 6, 7, 7, 6, 8, 7, 6.8,
 $$Shopify Planet partner (carbon removal investments); Offset app for merchants. E-commerce logistics have carbon costs that Shopify is working to offset but cannot eliminate. Above average for tech sector.$$,
 $$Strong employer; highly rated on Glassdoor; fully remote since 2020; good benefits and pay. No supply chain labor concerns (software company). Laid off ~20% in 2022 with good severance and transparency. Score: 7.$$,
 $$No criminal violations or major regulatory issues. Transparent financial reporting. No antitrust actions. Score: 7.$$,
 $$Shopify's platform philosophy — enabling independent merchants against Amazon dominance — is a genuine civil economic liberty stance. Ottawa-based; Canadian economic sovereignty benefit. Lütke has spoken against government overreach with nuance.$$,
 $$Enables over 1.7M businesses globally; documented economic multiplier for small and independent merchants, especially during COVID. Canadian tech flagship company. Shopify Fund supports merchant ecosystem. Score: 8.$$,
 $$No criminal record; no associations with convicted criminals. Lütke is unusually transparent and thoughtful as a CEO. Score: 7.$$),

-- ══════════════════════════════════════════════════════════════════
-- 36. Peter Thiel / Palantir / Founders Fund
-- ══════════════════════════════════════════════════════════════════
($$Peter Thiel / Palantir / Founders Fund$$, $$combined$$,
 $$Individual investor and co-founder across PayPal, Palantir, and Founders Fund. Palantir surveillance infrastructure deployed by ICE/CBP in US immigration enforcement and by authoritarian governments.$$,
 4, 4, 4, 2, 4, 4, 3.7,
 $$No significant positive environmental actions. No extraordinary negative footprint beyond standard tech. Score: 4.$$,
 $$PayPal and Palantir are generally decent employers. No systemic labor violations documented. Thiel personally opposed to collective action in political sphere but not documented to engage in union-busting at portfolio companies.$$,
 $$No criminal convictions. Gawker case: covertly funded litigation to destroy a media company — legal but an extraordinary use of private wealth to silence journalism. Secretive style is a documented pattern.$$,
 $$Palantir's ICE/CBP surveillance infrastructure has been central to immigration enforcement operations with documented family separation outcomes. Thiel's political philosophy is explicitly anti-democratic ("I no longer believe that freedom and democracy are compatible"). Renounced US citizenship for New Zealand. Score: 2.$$,
 $$PayPal (co-founded) is a genuine fintech public utility. Palantir's US military and intelligence work has genuine national security value. Founders Fund has backed companies of significant value. Offset by ICE surveillance work and political philosophy.$$,
 $$Gawker litigation funding is the most significant documented personal conduct concern. Palantir's surveillance deployments are an institutional concern. No criminal record; no Epstein associations. Score: 4.$$),

-- ══════════════════════════════════════════════════════════════════
-- 37. Sam Bankman-Fried / FTX
-- ══════════════════════════════════════════════════════════════════
($$Sam Bankman-Fried / FTX$$, $$combined$$,
 $$Individual and founder of FTX and Alameda Research. Convicted on all 7 federal fraud and conspiracy counts (2023); sentenced to 25 years. Conduct score 1. Effective altruism philanthropy was funded by stolen customer funds.$$,
 3, 3, 1, 2, 2, 1, 2.0,
 $$FTX's carbon offset program was marketing. Alameda's crypto trading has no significant environmental benefit or cost. Score: 3.$$,
 $$FTX employees were treated as instruments of an enterprise built on fraud; many junior employees lost jobs, savings, and reputations through no fault of their own. No labor violations in the traditional sense but workers harmed by the enterprise.$$,
 $$Convicted on all 7 counts: wire fraud, securities fraud, commodities fraud, and money laundering (2023). Commingled customer funds with Alameda hedge fund to the tune of $8B+; borrowed customer funds for political donations, venture investments, and personal expenses. Score: 1.$$,
 $$Largest campaign donor in 2022 cycle (via both parties); donations made with customer funds. Political donations were documented influence-buying to prevent crypto regulation. Score: 2.$$,
 $$Effective altruism philanthropy was funded by stolen customer funds, retroactively delegitimizing the claimed social mission. Tens of thousands of retail investors lost savings. Score: 2.$$,
 $$Convicted on all 7 counts; 25-year sentence. No remorse demonstrated; attempted to blame co-conspirators in court. Conduct is among the most severe in this dataset short of organized violence. Score: 1.$$),

-- ══════════════════════════════════════════════════════════════════
-- 38. Elizabeth Holmes / Theranos
-- ══════════════════════════════════════════════════════════════════
($$Elizabeth Holmes / Theranos$$, $$combined$$,
 $$Individual and founder/CEO of Theranos. Convicted on 4 federal fraud counts (2022); sentenced to 11 years. Patients received false medical results. Conduct score 1.$$,
 5, 3, 1, 4, 1, 1, 2.5,
 $$No significant environmental footprint positive or negative. Standard healthcare company footprint. Score: 5.$$,
 $$Theranos employees were used as instruments of a fraud; many were forbidden from discussing the technology under threat of lawsuit. Hostile legal suppression of internal whistleblowers was documented.$$,
 $$Convicted on 4 counts of wire fraud and conspiracy (2022); sentenced to 11.25 years. Claimed blood testing technology worked when it did not; patients received false medical results that affected real healthcare decisions. This is among the most direct, patient-harming frauds in biotech history. Score: 1.$$,
 $$No specific political harm. Theranos was used in Walgreens clinics and in military contexts; some USSOCOM blood testing involvement discussed. Score: 4 (limited impact; no direct civil rights violations).$$,
 $$The premise of Theranos — accessible blood testing — would have been genuinely socially valuable if real. The fraud destroyed the credibility of an important space. Patients harmed by false results. Score: 1.$$,
 $$Convicted on 4 counts; 11-year sentence. No remorse demonstrated. Cover-up included aggressive suppression of whistleblowers and legal intimidation of journalists. Score: 1.$$),

-- ══════════════════════════════════════════════════════════════════
-- 39. Salesforce / Marc Benioff
-- ══════════════════════════════════════════════════════════════════
($$Salesforce / Marc Benioff$$, $$combined$$,
 $$Corporation and founder-CEO. Originator of Pledge 1% (1-1-1 model) adopted by 17,000+ companies globally. No criminal associations.$$,
 7, 7, 6, 7, 7, 7, 6.8,
 $$Net zero operations achieved; 100% renewable energy. Sustainability Cloud product helps other companies measure emissions. Strong CDP rating. Above average for enterprise software sector.$$,
 $$One of the stronger enterprise employers — strong benefits, equal pay audits, mental health support. No significant labor violations documented. Supply chain is primarily software.$$,
 $$No criminal violations or major regulatory issues. MuleSoft and Slack acquisitions scrutinized; cleared. Relatively clean for this scale.$$,
 $$Benioff vocally opposed Indiana RFRA (2015) and similar anti-LGBTQ+ legislation — a documented, costly stance. Advocates for higher corporate taxes and climate action; generally pro-democratic positions in tech CEO sphere.$$,
 $$Originator of Pledge 1% (1% equity, 1% product, 1% time), adopted by 17,000+ companies and representing billions in total social value. Salesforce.org provides nonprofit CRM at no cost. Benioff personally donated $200M to UCSF children's hospital.$$,
 $$No criminal record; no associations with convicted criminals. Benioff has a reputation for genuine ethical stands at personal and institutional cost. Score: 7.$$),

-- ══════════════════════════════════════════════════════════════════
-- 40. Marc Andreessen / Andreessen Horowitz (a16z)
-- ══════════════════════════════════════════════════════════════════
($$Marc Andreessen / Andreessen Horowitz (a16z)$$, $$vc_firm$$,
 $$Individual and firm co-founder; ~$35B AUM. Andreessen co-created Mosaic (1993) and co-founded Netscape (1995 IPO). Saudi PIF confirmed LP (April 2023); $40B Saudi AI fund talks ongoing (March 2024); Abu Dhabi ADIA/Mubadala among documented LP sources.$$,
 3, 4, 4, 2, 7, 3, 3.8,
 $$No significant environmental portfolio focus. No extraordinary positive or negative footprint. Score: 3.$$,
 $$a16z portfolio companies have had variable labor records (Airbnb, GitHub, Lyft). Firm itself is a small employer. No documented labor violations at firm level.$$,
 $$No criminal violations. Andreessen's public behavior — documented online harassment amplification, deletion of tweets — raises integrity concerns short of legal violation.$$,
 $$Saudi Arabia's PIF (Sanabil Investments) is a confirmed LP; a16z entered advanced talks in March 2024 to lead-manage a proposed $40B Saudi AI fund; Ben Horowitz has cultivated personal relationship with PIF leadership. Andreessen's "Techno-Optimist Manifesto" (2023) explicitly dismissed civil society and social concerns as enemies of progress; funded Trump 2024 heavily; Abu Dhabi sovereign wealth (ADIA/Mubadala) also documented among LP sources. Score: 2.$$,
 $$Marc Andreessen co-created Mosaic (1993) — the first widely adopted graphical web browser — and co-founded Netscape, whose 1995 IPO catalyzed the commercial internet; this is a foundational contribution to modern information access. a16z's portfolio includes GitHub, Airbnb, Lyft, Coinbase, Slack, Figma, Oculus, Robinhood, and dozens of transformative companies. Economic and social value of portfolio is genuinely large. Score: 7.$$,
 $$No criminal record; no Epstein associations. Docked for documented online harassment amplification and institutional alignment with autocratic sovereign wealth investors. Score: 3.$$),

-- ══════════════════════════════════════════════════════════════════
-- 41. Uber / Travis Kalanick
-- ══════════════════════════════════════════════════════════════════
($$Uber / Travis Kalanick$$, $$combined$$,
 $$Corporation and founding CEO (2010–2017). Greyball program (regulator deception); Waymo trade secret theft. Pervasive sexual harassment culture documented. Post-Kalanick improvements noted.$$,
 4, 2, 3, 3, 5, 2, 3.2,
 $$Ride-sharing reduces car ownership in some contexts. Uber's fleet includes minimal EV penetration despite stated commitments. Score: 4.$$,
 $$Drivers classified as contractors denying benefits (active litigation globally). Kalanick presided over a culture with documented systemic sexual harassment (Susan Fowler memo, Holder investigation). Wages below living wage in high-cost cities for most drivers. Score: 2.$$,
 $$Greyball program: software built to deceive regulators and law enforcement — documented, deliberate. Waymo trade secret theft: $245M settlement. Kalanick resigned under board pressure after cascading conduct failures. Score: 3.$$,
 $$Greyball program specifically designed to obstruct government oversight. Operates in some authoritarian markets with compliance. Score: 3.$$,
 $$Ride-sharing has genuine social utility — mobility access, DUI reduction in some studies. Offset by labor classification exploitation affecting millions of drivers globally. Score: 5.$$,
 $$Systemic sexual harassment culture under Kalanick is documented by the Holder investigation. Greyball was a deliberate institutional deception of public authorities. Post-Dara (post-2017): material improvements. Score: 2.$$),

-- ══════════════════════════════════════════════════════════════════
-- 42. Boeing
-- ══════════════════════════════════════════════════════════════════
($$Boeing$$, $$corporation$$,
 $$Corporation. 737 MAX crashes (346 deaths, 2018–2019); felony fraud deferred prosecution agreement (2021) and agreed guilty plea (2024). Door plug blowout (2024). Conduct score 1.$$,
 4, 4, 1, 3, 4, 1, 2.8,
 $$Aviation manufacturer; direct environmental footprint via manufacturing. Some investment in sustainable aviation fuel. Standard large manufacturer environmental profile.$$,
 $$Strong unionization (IAM); good wages historically. Machinists strikes in 2008 and 2024. Management-labor trust severely damaged by MAX crisis and workplace safety failures. Score: 4.$$,
 $$737 MAX: MCAS design known to be defective; FAA certification process manipulated (Senate investigation); 346 deaths. Agreed guilty plea to conspiracy to defraud the FAA (2024); $2.5B deferred prosecution; door plug blowout (2024) revealed continuing culture of suppression of safety concerns. Score: 1.$$,
 $$Pentagon contractor; some lobbying concerns. No specific civil liberties issues. Score: 3.$$,
 $$Civil aviation has enormous positive social value; Boeing's aircraft are foundational to global mobility. Offset by the 346 deaths and ongoing safety culture failures.$$,
 $$Agreed to plead guilty to conspiracy to defraud the FAA (2024). Whistleblowers died under suspicious circumstances (John Barnett). Culture of suppressing safety concerns is documented across decades. Score: 1.$$),

-- ══════════════════════════════════════════════════════════════════
-- 43. Wells Fargo
-- ══════════════════════════════════════════════════════════════════
($$Wells Fargo$$, $$corporation$$,
 $$Corporation. 3.5M unauthorized customer accounts created without consent; $3B DOJ settlement (2020). Multiple parallel fraud lines over a decade. Integrity score 1.$$,
 4, 3, 1, 4, 3, 2, 2.8,
 $$Carbon commitment made; significant fossil fuel financing. Standard large bank environmental profile.$$,
 $$Employees were pressured via quotas to open unauthorized accounts — making workers instruments of institutional fraud against customers. Whistleblowers documenting the practice were terminated. Score: 3.$$,
 $$3.5M unauthorized customer accounts; fake email addresses; unauthorized credit card applications; forced auto insurance; fraudulent mortgage fees. $3B DOJ settlement (2020) and Federal Reserve asset cap (still in effect as of 2026). Multiple parallel product fraud lines operated for over a decade. Score: 1.$$,
 $$Standard banking political activity. Some redlining settlement concerns. Score: 4.$$,
 $$Retail banking provides genuine community financial services. Offset by systematic fraud against the very customers it ostensibly served. Score: 3.$$,
 $$Federal Reserve imposed unprecedented asset cap due to ongoing governance failures. Multiple CEOs have failed to resolve regulatory consent orders. Whistleblower retaliation documented. Pattern of institutional conduct failure that persisted across leadership changes. Score: 2.$$),

-- ══════════════════════════════════════════════════════════════════
-- 44. McKinsey & Company
-- ══════════════════════════════════════════════════════════════════
($$McKinsey & Company$$, $$corporation$$,
 $$Management consulting firm. $641M opioid advisory settlement (2021); South Africa state capture ($41M disgorgement); authoritarian government advisory relationships documented.$$,
 5, 5, 2, 3, 4, 3, 3.7,
 $$Global operations with standard professional services footprint. Some sustainability practice advisory work generating revenue but limited internal commitment. Score: 5.$$,
 $$Strong compensation for consultants; up-or-out culture is brutal but well-disclosed. No supply chain labor issues for a professional services firm. Score: 5.$$,
 $$$641M settlement (2021) for consulting work that advised Purdue Pharma on accelerating OxyContin sales by targeting highest-prescribing doctors and designing financial incentives for pharmacies. South Africa: $41M disgorgement for corruption-linked state enterprise work (Eskom, Transnet) during Zuma era. Pattern of client-serving at any ethical cost. Score: 2.$$,
 $$Documented advisory relationships with Saudi government during and after the Khashoggi murder. Extensive China state advisory work (NY Times investigation). No specific civil liberties violations by McKinsey itself but consistent advisory support for authoritarian governance.$$,
 $$Management consulting generates genuine economic value through operational improvement. Offset by documented opioid and state capture advisory work whose social costs are enormous.$$,
 $$No criminal conviction of leadership despite documented opioid advisory work directly contributing to the crisis. South Africa disgorgement. Authoritarian client relationships reflect a firm-level conduct norm of accepting any engagement absent criminal prohibition. Score: 3.$$),

-- ══════════════════════════════════════════════════════════════════
-- 45. Jack Dorsey / Block
-- ══════════════════════════════════════════════════════════════════
($$Jack Dorsey / Block$$, $$combined$$,
 $$Individual and co-founder of Twitter and Block (formerly Square). Cash App $80M BSA/AML settlement (2021). Banned Trump from Twitter after January 6. Bitcoin maximalist; significant advocacy work on financial inclusion.$$,
 5, 6, 5, 6, 6, 7, 5.8,
 $$Block has invested in bitcoin mining renewable energy and published transparent energy use data. Personal carbon footprint typical for a billionaire. Square/Cash App infrastructure has lower footprint than most fintech.$$,
 $$Block is a generally decent employer. No major documented labor violations. Cash App compliance failures led to BSA settlement but no worker exploitation concern. Score: 6.$$,
 $$Cash App $80M BSA/AML settlement (2021) for anti-money laundering compliance failures. No personal criminal violations. Twitter conduct under Dorsey raised some content moderation integrity concerns. Score: 5.$$,
 $$Banned Trump from Twitter after January 6 — a consequential civil rights/platform governance decision. Block's Cash App provides financial access to underbanked populations. Bitcoin advocacy is politically mixed. Score: 6.$$,
 $$Square/Cash App has meaningfully expanded financial access for small businesses and underbanked individuals. Twitter under Dorsey had genuine free expression commitments. Bitcoin advocacy raises complex social questions. Score: 6.$$,
 $$No criminal record; no associations with convicted criminals. Personal conduct record is generally clean. Score: 7.$$),

-- ══════════════════════════════════════════════════════════════════
-- 46. BlackBerry / Lazaridis & Balsillie
-- ══════════════════════════════════════════════════════════════════
($$BlackBerry / Lazaridis & Balsillie$$, $$combined$$,
 $$Canadian corporation and co-CEOs; Waterloo, Ontario. Lazaridis donated $170M+ to Perimeter Institute for Theoretical Physics. Balsillie $5M options backdating settlement (2007); founded CIGI.$$,
 5, 5, 4, 6, 7, 5, 5.3,
 $$Hardware manufacturer with a standard electronics supply chain; no extraordinary environmental positive or negative. Waterloo headquarters contributes to Canadian tech cluster without major environmental footprint.$$,
 $$Generally good employer; Waterloo region tech employment was significant. No major labor violations documented. Score: 5.$$,
 $$Balsillie settled with Ontario Securities Commission for $5M over stock options backdating (2007). No criminal charges. Lazaridis clean record. Score: 4.$$,
 $$BlackBerry devices were used by dissidents in authoritarian countries for encrypted communication — a genuine civil liberties positive. Balsillie's Centre for International Governance Innovation (CIGI) is a respected global governance think tank.$$,
 $$Lazaridis donated $170M+ to Perimeter Institute for Theoretical Physics — among the most significant single-donor science investments in Canadian history. BlackBerry helped build the Waterloo tech corridor into a globally competitive cluster. CIGI provides genuine public benefit through research.$$,
 $$Balsillie options backdating settlement is primary conduct concern. No criminal record; no associations with convicted criminals. Score: 5.$$),

-- ══════════════════════════════════════════════════════════════════
-- 47. Brookfield Asset Management / Bruce Flatt
-- ══════════════════════════════════════════════════════════════════
($$Brookfield Asset Management / Bruce Flatt$$, $$combined$$,
 $$Canadian institution and CEO; headquartered Toronto. ~21GW renewable power globally via Brookfield Renewable. No documented criminal associations.$$,
 5, 5, 5, 5, 5, 6, 5.2,
 $$Brookfield Renewable is among the world's largest renewable power companies (~21GW capacity). Also has significant fossil fuel and real asset holdings through other funds. The renewable leadership is genuine and at scale but the broader portfolio is mixed.$$,
 $$Large institutional employer across global portfolio companies. Labor practices vary by sector and geography. No systemic documented violations. Score: 5.$$,
 $$No criminal charges or major regulatory violations. Standard institutional real asset management. Score: 5.$$,
 $$Primarily infrastructure focus; no specific civil liberties concerns. Operations in some authoritarian markets but no documented complicity in human rights abuses. Score: 5.$$,
 $$Brookfield Renewable's scale of clean energy deployment is a genuine global positive. Toronto-headquartered; significant Canadian financial institution. Real asset management creates tangible infrastructure value.$$,
 $$No criminal record; no associations with convicted criminals. Clean institutional conduct record. Score: 6.$$),

-- ══════════════════════════════════════════════════════════════════
-- 48. Barrick Gold / Peter Munk
-- ══════════════════════════════════════════════════════════════════
($$Barrick Gold / Peter Munk$$, $$combined$$,
 $$Canadian corporation and founder (d. 2018); headquartered Toronto. Porgera mine (PNG) sexual violence by security guards acknowledged and compensated. Veladero mine cyanide spills.$$,
 2, 2, 3, 3, 4, 3, 2.8,
 $$Open-pit gold mining is among the most environmentally destructive industrial processes. Veladero mine (Argentina) cyanide spill into local water sources (2015, 2016). Porgera mine (PNG) deforestation and water contamination. Score: 2.$$,
 $$Porgera mine (PNG): security guards employed by Barrick sexually assaulted local women — acknowledged by the company, compensation program established but reported as inadequate by Human Rights Watch. Mine workers in some operations face dangerous conditions. Score: 2.$$,
 $$No criminal convictions of company leadership. Multiple regulatory fines for environmental violations. Tanzania government seized Acacia Mining assets (Barrick subsidiary) over tax dispute; resolved via negotiation. Score: 3.$$,
 $$Operations in multiple countries with poor human rights records. Porgera sexual violence is the most severe single documented human rights failure. Lobbied against Canadian legislation on supply chain human rights due diligence.$$,
 $$Munk donated to University of Toronto and other institutions. Gold mining provides employment in some of the world's poorest regions. Offset by documented environmental destruction and human rights failures.$$,
 $$Porgera sexual violence and institutional acknowledgment of it is the most significant conduct finding. Cyanide spills and legal battles over remediation reflect a pattern of institutional conduct prioritizing profit over accountability. Score: 3.$$),

-- ══════════════════════════════════════════════════════════════════
-- 49. Lululemon / Chip Wilson
-- ══════════════════════════════════════════════════════════════════
($$Lululemon / Chip Wilson$$, $$combined$$,
 $$Canadian company and founder; founded Vancouver, BC. Chip Wilson resigned as chairman after public statements blaming women's bodies for product failures (2013). Funded anti-mask advocacy during COVID.$$,
 5, 4, 5, 3, 5, 3, 4.2,
 $$Lululemon's supply chain uses some sustainable materials but is primarily synthetic/polyester with associated microplastic concerns. Has set science-based climate targets. Score: 5.$$,
 $$Supply chain labor concerns in Asian factories (Xinjiang cotton supply chain controversy); improved auditing since 2020. Domestic workforce generally well-treated. Score: 4.$$,
 $$No criminal violations. Wilson made public comments blaming women's bodies for product failures (2013) — a reputational and ethical failure. No financial fraud documented. Score: 5.$$,
 $$Wilson funded anti-mask advocacy during COVID pandemic. Made public statements perceived as fat-shaming women regarding product failures. Anti-LGBTQ+ adjacent donations documented. Score: 3.$$,
 $$Lululemon created the athleisure category and has genuine social value as a product. Some community yoga and wellness programming. Score: 5.$$,
 $$Wilson's 2013 statements (blaming women's bodies for product failures) caused documented harm. Anti-mask funding during COVID is a public health concern. 2024 proxy fight against own board. Score: 3.$$),

-- ══════════════════════════════════════════════════════════════════
-- 50. Stripe / Patrick & John Collison
-- ══════════════════════════════════════════════════════════════════
($$Stripe / Patrick & John Collison$$, $$combined$$,
 $$Corporation and co-founders; Irish-born, headquartered San Francisco. Stripe Climate (carbon removal investment). Fast Grants during COVID. No criminal associations.$$,
 6, 7, 7, 6, 7, 7, 6.7,
 $$Stripe Climate routes a percentage of revenue to carbon removal, making Stripe the largest corporate buyer of carbon removal to date. Data centers powered by renewable energy. Above average for fintech sector.$$,
 $$Strong employer; highly competitive compensation; good culture. No documented labor violations. Supply chain is primarily software. Score: 7.$$,
 $$No criminal violations or major regulatory issues. Transparent financial reporting for a private company. No antitrust concerns at current scale.$$,
 $$Fast Grants during COVID: Collison brothers personally stood up emergency science funding in 48 hours — a genuine and impactful civil society contribution. No documented civil liberties concerns.$$,
 $$Stripe powers the internet economy for millions of small businesses globally; dramatically reduced the friction of building and selling online. Fast Grants funded dozens of COVID studies before official channels reacted. Score: 7.$$,
 $$No criminal record; no associations with convicted criminals. Patrick and John Collison are unusually thoughtful public communicators on technology and public welfare. Score: 7.$$),

-- ══════════════════════════════════════════════════════════════════
-- 51. Y Combinator
-- ══════════════════════════════════════════════════════════════════
($$Y Combinator$$, $$vc_firm$$,
 $$VC accelerator; Paul Graham co-founder, Garry Tan current president. No autocratic sovereign wealth LP confirmed. Garry Tan's "die slow, motherf**kers" tweet directed at San Francisco supervisors (2023).$$,
 5, 5, 5, 4, 8, 5, 5.3,
 $$Software-focused accelerator with minimal direct environmental footprint. Portfolio includes some climate tech. No extraordinary positive or negative. Score: 5.$$,
 $$YC itself is a small employer; portfolio company labor practices vary widely. No documented labor violations at firm level. Score: 5.$$,
 $$No criminal violations or major regulatory issues. Standard venture fund structure. Score: 5.$$,
 $$Garry Tan's "die slow, motherf**kers" tweet directed at San Francisco supervisors (2023) raised concerns about leadership conduct, although partially walked back. No documented autocratic LP entanglement. Score: 4.$$,
 $$YC alumni include Airbnb, Stripe, Dropbox, Reddit, DoorDash, Coinbase — representing extraordinary economic value creation and social utility. Alumni network has contributed to the Waterloo-SF tech corridor. Score: 8.$$,
 $$Tan tweet is a conduct mark. No criminal record; no associations with convicted criminals. Saudi PIF's Sanabil disclosed ~40 US VC LP stakes in April 2023; YC was not on that list. Score: 5.$$),

-- ══════════════════════════════════════════════════════════════════
-- 52. Citigroup
-- ══════════════════════════════════════════════════════════════════
($$Citigroup$$, $$corporation$$,
 $$Institution. $45B TARP bailout (2008); $7B DOJ mortgage fraud settlement (2014); $400M OCC risk management consent order (2020). Pattern of regulatory failures over two decades.$$,
 4, 5, 2, 4, 4, 3, 3.7,
 $$Has made Paris-aligned commitments; significant fossil fuel financing continues. Standard large bank environmental profile.$$,
 $$Generally decent employer. No major labor violations documented. Score: 5.$$,
 $$$7B DOJ settlement (2014) for mortgage-backed securities fraud (one of the largest). $400M OCC consent order (2020) for risk management failures. 2008: required $45B TARP bailout. Pattern of institutional governance failures. Score: 2.$$,
 $$Standard banking political activity. No extraordinary civil liberties concerns. Some redlining-related concerns historically. Score: 4.$$,
 $$Retail banking provides genuine community financial services globally. Offset by role in 2008 crisis and ongoing governance failures. Score: 4.$$,
 $$Pattern of large regulatory settlements and governance failures without individual criminal accountability. No personal criminal associations for current leadership. Score: 3.$$),

-- ══════════════════════════════════════════════════════════════════
-- 53. Raytheon / RTX
-- ══════════════════════════════════════════════════════════════════
($$Raytheon / RTX$$, $$corporation$$,
 $$Defense corporation. $950M FCPA settlement (2022) — largest in FCPA history — for bribery in Qatar and UAE. Cluster munitions deployed against civilians in Yemen via Saudi Arabia sales.$$,
 3, 5, 2, 2, 4, 2, 3.0,
 $$Industrial manufacturing with significant toxic waste history. Defense products have large lifecycle material footprints. Some investment in sustainable manufacturing but no extraordinary positive.$$,
 $$Generally decent wages; unionized workforce (IAM). Better than average safety record for defense manufacturing. Score: 5.$$,
 $$$950M FCPA settlement (2022) — largest in FCPA history — for bribery in Qatar, UAE, and elsewhere. Subsidiary also pleaded guilty to export violations. Score: 2.$$,
 $$Cluster munitions sold to Saudi Arabia and deployed in Yemen, where Human Rights Watch and Amnesty documented use against civilian targets. Cluster munitions are banned by 111 countries under the Convention on Cluster Munitions (US not a signatory). Score: 2.$$,
 $$Defense products provide genuine national security value. Offset by FCPA violations and cluster munition deployments causing civilian casualties. Score: 4.$$,
 $$$950M FCPA settlement is a severe institutional integrity failure. Cluster munitions deployment against civilians in Yemen is a humanitarian conduct concern of high severity. Score: 2.$$),

-- ══════════════════════════════════════════════════════════════════
-- 54. NRA / Wayne LaPierre
-- ══════════════════════════════════════════════════════════════════
($$NRA / Wayne LaPierre$$, $$combined$$,
 $$Organization and executive VP/CEO (1991–2024). LaPierre found personally liable for $4.35M fund diversion by NY court (2024); resigned. Conduct score 1.$$,
 4, 3, 1, 3, 2, 1, 2.3,
 $$No significant environmental actions. No extraordinary positive or negative footprint. Score: 4.$$,
 $$Staff were used to facilitate LaPierre's fund diversion (luxury travel, personal expenses billed to NRA). No broader labor violations documented beyond the institutional dysfunction. Score: 3.$$,
 $$NY AG investigation: LaPierre found personally liable for $4.35M in fund diversion (personal travel, clothing, vendor arrangements). NRA underwent near-bankruptcy in 2021. Corporate governance was described by the court as deeply dysfunctional. Score: 1.$$,
 $$NRA's documented lobbying against background check legislation, red flag laws, and other gun safety measures following mass shootings is a defining civil harm. Opposition to virtually any gun safety regulation has been central to NRA's modern mission. Score: 3.$$,
 $$NRA does provide genuine firearms safety training programs. Offset entirely by documented role in blocking gun safety legislation — a direct community safety harm at massive scale. Score: 2.$$,
 $$LaPierre found personally liable by court for fund diversion; resigned in disgrace. Institutional conduct of blocking gun safety legislation following mass casualty events is a severe community harm. Score: 1.$$),

-- ══════════════════════════════════════════════════════════════════
-- 55. Reid Hoffman / LinkedIn / Greylock
-- ══════════════════════════════════════════════════════════════════
($$Reid Hoffman / LinkedIn / Greylock$$, $$combined$$,
 $$Individual, co-founder of LinkedIn, and partner at Greylock. Epstein three-gate: all three gates fully met (2011–2015 arc, acknowledged knowledge, facilitated introductions between Epstein and tech figures); no personal participation; conduct floor 2.$$,
 5, 6, 5, 6, 7, 2, 5.2,
 $$No significant positive environmental actions. Standard tech professional investor footprint. Score: 5.$$,
 $$LinkedIn is a generally good employer; Greylock is a small employer. No documented labor violations. Score: 6.$$,
 $$No criminal violations or major regulatory issues. LinkedIn acquired by Microsoft (2016). No financial fraud documented. Score: 5.$$,
 $$Hoffman is a significant pro-democratic voice — has funded efforts to combat election disinformation and support democratic institutions. Controversy over funding Allison Gill podcast with partially undisclosed funding source (2022) is a noted integrity concern. Score: 6.$$,
 $$LinkedIn genuinely transformed professional networking globally. Hoffman's venture portfolio (Airbnb, Facebook early) has significant social impact. Giving Pledge member. Masters of Scale podcast. Score: 7.$$,
 $$Three-gate test on Epstein: all three gates fully met — multiple acknowledged post-conviction meetings spanning 2011–2015 (4+ year arc), Hoffman confirmed he knew of Epstein's background, reportedly facilitated introductions between Epstein and tech figures during this period. No evidence of personal participation in Epstein's crimes; floor = 2. Score: 2.$$),

-- ══════════════════════════════════════════════════════════════════
-- 56. Pfizer
-- ══════════════════════════════════════════════════════════════════
($$Pfizer$$, $$corporation$$,
 $$Corporation. $2.3B DOJ settlement (2009) for off-label marketing — largest healthcare fraud settlement at the time. COVID mRNA vaccine credited with 14–20M lives saved in first year (Lancet, 2022).$$,
 5, 5, 3, 3, 7, 4, 4.5,
 $$Carbon neutrality commitment; manufacturing has standard pharmaceutical environmental footprint. No extraordinary positive or negative.$$,
 $$Generally decent employer in pharma sector. No significant labor violations documented. Score: 5.$$,
 $$$2.3B DOJ settlement (2009) for off-label marketing of Bextra and other drugs — largest healthcare fraud settlement in history at the time. Nigeria clinical trial controversy (meningitis drug without adequate consent — Trovan). Not a single incident but a pattern. Score: 3.$$,
 $$Lobbied against WHO proposal to waive COVID vaccine intellectual property for developing countries — prioritizing profits over global access during a pandemic, preventing hundreds of millions of doses from reaching low-income countries sooner. Score: 3.$$,
 $$COVID mRNA vaccine (BNT162b2): Lancet estimated 14–20M lives saved in first year alone. This is one of the largest single-product positive public health impacts in human history. Offset by access lobbying and historical fraud settlements. Score: 7.$$,
 $$Off-label marketing settlement is a documented institutional conduct failure. Nigeria trial controversy reflects ongoing ethical challenges in pharmaceutical clinical research. No criminal leadership convictions. Score: 4.$$),

-- ══════════════════════════════════════════════════════════════════
-- 57. Sequoia Capital
-- ══════════════════════════════════════════════════════════════════
($$Sequoia Capital$$, $$vc_firm$$,
 $$VC firm; key partners include Roelof Botha, Alfred Lin, and Shaun Maguire. Sequoia China (HongShan, operating under shared brand until 2023) invested in PLA military AI (EverSec, 4Paradigm) and Uyghur surveillance (DJI, DeepGlint). House Select Committee investigation opened October 2023.$$,
 5, 5, 4, 2, 8, 3, 4.5,
 $$Software-focused investor with minimal direct environmental footprint. Some climate tech in portfolio. Score: 5.$$,
 $$Firm-level employer with no documented violations. Portfolio company labor practices vary. Score: 5.$$,
 $$FTX: Sequoia published a hagiographic partner piece one month before FTX collapsed — a documented due diligence failure. The piece was deleted without correction. Score: 4.$$,
 $$Sequoia China (HongShan) made documented investments in EverSec and 4Paradigm (PLA military AI, the latter raising $700M for PLA battlefield programs); DJI and DeepGlint, whose facial recognition technology was used to surveil Uyghurs in Xinjiang. These investments accumulated over 18 years under the shared Sequoia brand. Partner Shaun Maguire made repeated documented racist and bigoted social media posts; Sequoia Capital has issued no public acknowledgment or response — treating documented partner bigotry as a non-issue. Score: 2.$$,
 $$Sequoia's portfolio includes Apple (early), Google (early), Airbnb, WhatsApp, LinkedIn, YouTube, Oracle, Cisco, and dozens of transformative companies. Economic value created is among the largest of any venture firm in history. Score: 8.$$,
 $$FTX hagiographic piece published one month before collapse. Partner Shaun Maguire's documented bigoted statements met with institutional silence — a firm-level conduct norm tolerating racism from named partners. No criminal associations. Score: 3.$$),

-- ══════════════════════════════════════════════════════════════════
-- 58. Airbnb / Brian Chesky
-- ══════════════════════════════════════════════════════════════════
($$Airbnb / Brian Chesky$$, $$combined$$,
 $$Corporation and CEO. COVID layoffs handled with exemplary transparency and severance. Documented housing affordability impacts in high-density markets. No criminal associations.$$,
 5, 5, 5, 4, 5, 6, 5.0,
 $$Travel platform; flights booked via Airbnb contribute to aviation emissions. Airbnb itself has minimal direct environmental footprint. Some home-sharing is more energy-efficient than hotels. Score: 5.$$,
 $$COVID layoffs (2020): Chesky's handling was widely cited as a model — advance notice, generous severance, resume database, publicly shared departure list. No labor violations documented. Score: 5.$$,
 $$No criminal violations or major regulatory issues. Some tax compliance disputes in various jurisdictions. Generally clean. Score: 5.$$,
 $$Documented impacts on housing affordability in cities like New York, Barcelona, and Amsterdam — peer-reviewed studies link Airbnb density to rent increases. Regulatory conflicts in multiple cities; bans in some. Score: 4.$$,
 $$Airbnb democratized travel and home-hosting globally — meaningful positive for hosts and travelers. Offset by documented housing market impacts in high-density cities. Score: 5.$$,
 $$No criminal record; no associations with convicted criminals. COVID layoff handling is a genuine positive conduct data point. Score: 6.$$),

-- ══════════════════════════════════════════════════════════════════
-- 59. DeepMind / Demis Hassabis
-- ══════════════════════════════════════════════════════════════════
($$DeepMind / Demis Hassabis$$, $$combined$$,
 $$Organization and co-founder/CEO; London-based, part of Alphabet. AlphaFold predicted structures of 200M+ proteins. Nobel Prize in Chemistry (2024) for Hassabis and Jumper. NHS data controversy (2017) addressed.$$,
 5, 7, 6, 6, 9, 7, 6.7,
 $$DeepMind has published research on using AI to reduce data center energy use (cooling optimisation at Google DCs, ~40% reduction in cooling energy). Training compute is large but partially offset by efficiency research. Score: 5.$$,
 $$Strong employer; good working conditions reported; London-based with good employee protections. No labor violations documented. Score: 7.$$,
 $$NHS patient data controversy (2017): DeepMind's Streams app used 1.6M NHS patient records without adequate consent; ICO investigation found violation of data protection law. Subsequently restructured. No financial fraud. Score: 6.$$,
 $$Within Alphabet, DeepMind has maintained some ethical independence — researchers published concerns about AI risks publicly. Hassabis has been a consistent voice for international AI governance and safety. Score: 6.$$,
 $$AlphaFold's prediction of 200M+ protein structures is one of the most significant scientific contributions in decades — accelerating drug discovery, understanding of disease mechanisms, and basic biology globally at no cost. Nobel Prize in Chemistry (2024). Score: 9.$$,
 $$No criminal record; no associations with convicted criminals. NHS data controversy was addressed. Personal conduct record is clean. Score: 7.$$),

-- ══════════════════════════════════════════════════════════════════
-- 60. Fred Rogers
-- ══════════════════════════════════════════════════════════════════
($$Fred Rogers$$, $$individual$$,
 $$Public television host, author, ordained Presbyterian minister (1928–2003). No misconduct ever documented across a six-decade public life. Defended PBS funding before the US Senate (1969).$$,
 7, 8, 10, 9, 10, 10, 9.0,
 $$Advocated for environmental stewardship and care for living things throughout his programming. Personal lifestyle was modest and low-impact. No negative environmental footprint.$$,
 $$Championed the dignity of workers, including manual and caregiving labor, throughout his career. No labor violations documented. Score: 8.$$,
 $$No financial misconduct, ethical violations, or personal scandals ever documented across a 60-year public career. Every posthumous investigation has confirmed the integrity of his public persona. Score: 10.$$,
 $$Testified before the US Senate Commerce Committee in 1969 to defend PBS funding — a successful, moving, and effective defense of public media as a civil good. Consistently promoted the values of democracy, acceptance, and inclusion in his programming. Score: 9.$$,
 $$Mister Rogers' Neighborhood reached generations of American children during formative development; documented impact on emotional literacy and prosocial behavior. He swam with a Black child at a time of segregated public pools in an act of deliberate, visible inclusion. Score: 10.$$,
 $$No associations with convicted criminals. No documented personal misconduct of any kind. Conduct record is the cleanest in this dataset. Score: 10.$$),

-- ══════════════════════════════════════════════════════════════════
-- 61. Jimmy Carter
-- ══════════════════════════════════════════════════════════════════
($$Jimmy Carter$$, $$individual$$,
 $$39th US President and post-presidency humanitarian (1924–2024). Guinea worm disease near-eradicated via Carter Center. ANILCA (1980) was the largest land conservation act in US history. First US president to use a blind trust.$$,
 8, 6, 9, 6, 9, 9, 7.8,
 $$Alaska National Interest Lands Conservation Act (1980): protected over 100 million acres — the largest land conservation act in US history. Installed solar panels on the White House (removed by Reagan). Personal life in Plains, Georgia was genuinely modest; gardened his own vegetables into his 90s.$$,
 $$Strong pro-labor record as president; Camp David Accords advanced in part by his willingness to work intensively with all parties. No personal labor violations. Score: 6.$$,
 $$First US president to use a blind trust. No personal financial scandals. Pardoned Vietnam draft resisters (1977). Post-presidency: built houses for Habitat for Humanity until age 95. Score: 9.$$,
 $$Panama Canal Treaties returned sovereignty to Panama — a principled decision unpopular domestically. Camp David Accords (1978) is one of the greatest diplomatic achievements of the 20th century. Opposed Iraq War publicly. Critics note inconsistency on some Cold War interventions. Score: 6.$$,
 $$Guinea worm disease near-eradicated: global cases reduced from 3.5M (1986) to single digits by 2024 via Carter Center — one of the most remarkable individual-led public health achievements in history. Habitat for Humanity; election monitoring globally. Score: 9.$$,
 $$No criminal record; no associations with convicted criminals. Post-presidential conduct is among the most admirable in American political history — actively building houses and monitoring elections into his 90s. Score: 9.$$),

-- ══════════════════════════════════════════════════════════════════
-- 62. Bill Clinton
-- ══════════════════════════════════════════════════════════════════
($$Bill Clinton$$, $$individual$$,
 $$42nd US President. Personal perjury (impeached by House 1998, acquitted by Senate); $850K sexual harassment settlement; Broaddrick allegation. Epstein flight logs (26+ trips, primarily pre-conviction); one gate met. CHIP and CHAI are genuine substantial positives.$$,
 5, 5, 3, 4, 6, 2, 4.2,
 $$Did not withdraw from Kyoto Protocol but failed to submit for ratification; signed executive orders on environmental protection. Mixed legacy on energy and land use. Score: 5.$$,
 $$NAFTA passed under Clinton with documented negative effects on manufacturing employment. CHIP expanded healthcare for 8M children. Generally supported union rights legislatively. Score: 5.$$,
 $$Impeached for perjury (lying under oath about the Lewinsky relationship) — House voted to impeach; Senate acquitted. $850K settlement with Paula Jones. Juanita Broaddrick allegation is serious and well-documented though never adjudicated. Score: 3.$$,
 $$Family separation at border under the 1997 immigration bill signed by Clinton. DOMA (1996): signed and later disavowed. Telecommunications Act (1996) contributed to media consolidation. Don't Ask Don't Tell: a compromise that delayed equality. Score: 4.$$,
 $$CHIP (Children's Health Insurance Program): 8M children covered — a genuine, large, lasting positive. CHAI (Clinton Health Access Initiative) expanded HIV treatment to millions in Africa and Asia. Budget surpluses. Offset by DOMA, Telecom Act, and some welfare reform harms.$$,
 $$Epstein: flight logs show 26+ trips on Epstein's plane — primarily pre-conviction (2002 conviction was in Florida, pre-dating most documented Clinton trips); Gate 1 met for later contacts; Gate 2 partial. One gate met; note applied, no formal penalty. Impeachment for perjury; Broaddrick allegation; $850K settlement. Score reflects personal misconduct independently. Score: 2.$$),

-- ══════════════════════════════════════════════════════════════════
-- 63. Mark Carney
-- ══════════════════════════════════════════════════════════════════
($$Mark Carney$$, $$individual$$,
 $$Governor Bank of Canada (2008–2013), Bank of England (2013–2020), Prime Minister of Canada (2025–present). Founded TCFD; Glasgow Financial Alliance for Net Zero ($130T in committed assets). No criminal associations.$$,
 8, 6, 7, 7, 7, 8, 7.2,
 $$Founded the Task Force on Climate-related Financial Disclosures (TCFD) — now the global standard for corporate climate risk disclosure. Founded the Glasgow Financial Alliance for Net Zero ($130T in committed assets). Among the most impactful individual voices on climate finance globally. Score: 8.$$,
 $$Central banker and now PM — no direct labor violations. Policies generally supportive of labor market stability and worker income. Score: 6.$$,
 $$No criminal violations or financial misconduct. Navigated 2008 financial crisis for Canada with minimal bank failures — a genuine institutional achievement. Transparent as a central banker and public figure. Score: 7.$$,
 $$Strong multilateralist; committed to democratic norms and institutions. Prime Minister of Canada (2025–present) following Trudeau's resignation. No documented civil liberties concerns.$$,
 $$TCFD and Glasgow Financial Alliance for Net Zero represent systemic change in corporate climate governance at global scale. Guided Canada through 2008 crisis and UK through Brexit uncertainty. Score: 7.$$,
 $$No criminal record; no associations with convicted criminals. Widely regarded as a person of high personal integrity in public life. Score: 8.$$),

-- ══════════════════════════════════════════════════════════════════
-- 64. Volodymyr Zelensky
-- ══════════════════════════════════════════════════════════════════
($$Volodymyr Zelensky$$, $$individual$$,
 $$President of Ukraine (2019–present). Remained in Kyiv during Russian invasion (2022); rallied democratic world against aggression. Pandora Papers offshore holdings disclosed pre-presidency.$$,
 5, 5, 6, 8, 7, 7, 6.3,
 $$Ukraine has substantial renewable energy potential; wartime energy infrastructure destruction has complicated any transition. No significant personal environmental record. Score: 5.$$,
 $$Labor conditions in wartime Ukraine are difficult; no documented Zelensky-specific labor violations. Pre-war governance included some labor market reforms. Score: 5.$$,
 $$Pandora Papers (2021) revealed offshore holdings pre-presidency — disclosed and addressed. Pre-presidency, some documented proximity to oligarchic networks but significantly cleaner than predecessors. Score: 6.$$,
 $$Remained in Kyiv on February 24, 2022 when offered evacuation — "I need ammunition, not a ride" — a defining act of democratic leadership under existential threat. Rallied NATO/EU support for Ukrainian sovereignty at a scale that shifted European security architecture. Some civil liberties concerns within Ukraine regarding opposition parties; wartime context must be weighed. Score: 8.$$,
 $$Defense of Ukrainian sovereignty and democratic institutions against Russian aggression has direct implications for global democratic norms. Score: 7.$$,
 $$Pandora Papers offshore holdings were disclosed and do not represent ongoing hidden conduct. Remained in Kyiv under direct threat — a documented act of personal courage with large positive institutional consequences. Score: 7.$$),

-- ══════════════════════════════════════════════════════════════════
-- 65. Emmanuel Macron
-- ══════════════════════════════════════════════════════════════════
($$Emmanuel Macron$$, $$individual$$,
 $$President of France (2017–present). Pension reform (2023) passed via Article 49.3 bypassing parliamentary vote despite mass opposition. Strong NATO and Ukraine supporter.$$,
 6, 4, 5, 6, 5, 6, 5.3,
 $$France has strong nuclear energy base (low carbon). Macron has been a consistent voice for climate action at G7/G20. Gilets jaunes protests were partly triggered by fuel tax — a climate policy with regressive distributional effects. Score: 6.$$,
 $$Pension reform (2023) extending retirement age passed over overwhelming public and parliamentary opposition using Article 49.3 (executive bypass). Gilets jaunes movement was partly a labor rights protest with real grievances about economic inequality. Score: 4.$$,
 $$No personal criminal convictions. Investigated for campaign finance irregularities (early career); no charges. Generally clean personal integrity record. Score: 5.$$,
 $$Strong NATO supporter; decisive Ukraine/Russia positioning. Pension reform via 49.3 is a legitimate but deeply controversial use of executive power that bypassed democratic expression at significant scale. Some concerns about police use of force against protesters. Score: 6.$$,
 $$Macron's climate leadership at EU and G20 level has been consequential. French social services are extensive. Africa policy has been contested (decolonization grievances). Score: 5.$$,
 $$No criminal record; no associations with convicted criminals. Personal conduct record is clean. Score: 6.$$),

-- ══════════════════════════════════════════════════════════════════
-- 66. Narendra Modi
-- ══════════════════════════════════════════════════════════════════
($$Narendra Modi$$, $$individual$$,
 $$Prime Minister of India (2014–present). Citizenship Amendment Act (2019) excludes Muslim refugees. Press freedom rank 159/180 (RSF 2023). Electoral bond scheme struck down by Supreme Court (2024).$$,
 4, 3, 3, 2, 4, 3, 3.2,
 $$India has significantly expanded renewable energy capacity under Modi (solar installations are among the world's largest). India's overall fossil fuel consumption is also growing rapidly. Net: some genuine renewable progress alongside growing fossil fuel dependence. Score: 4.$$,
 $$Labor reforms (2020) that weakened collective bargaining rights in some states. Farm bills triggered the longest protests in Indian history (2021); eventually withdrawn. Score: 3.$$,
 $$Electoral bond scheme (anonymous corporate donations to parties) struck down by Supreme Court as unconstitutional (2024) — scheme disproportionately benefited ruling BJP; design enabled corruption. No personal criminal conviction.$$,
 $$Citizenship Amendment Act (2019) excludes Muslim refugees from path to citizenship — a documented religious discrimination in civil law. Press freedom fell to 159/180 (RSF 2023) with documented journalist arrests and media ownership pressure. 2002 Gujarat riots: Modi was CM; Supreme Court found insufficient evidence against him personally but controversy persists. Score: 2.$$,
 $$Swachh Bharat (clean India) sanitation initiative reached hundreds of millions. Vaccine production during COVID (Serum Institute partnership). Some digital infrastructure development. Offset by social rights concerns. Score: 4.$$,
 $$No personal criminal conviction. Electoral bond scheme struck down by Supreme Court for enabling corporate influence. Some documented proximity to business interests that benefited from policy decisions during his tenure. Score: 3.$$),

-- ══════════════════════════════════════════════════════════════════
-- 67. Joe Biden
-- ══════════════════════════════════════════════════════════════════
($$Joe Biden$$, $$individual$$,
 $$46th US President (2021–2025). Inflation Reduction Act — largest US climate investment in history. First sitting president to join a union picket line. Hur Report found classified document mishandling.$$,
 7, 7, 5, 5, 6, 6, 6.0,
 $$Inflation Reduction Act (2022): $369B for climate and clean energy — the largest climate legislation in US history. Rejoined Paris Agreement on day one. Approved Willow Project oil drilling in Alaska (significant asterisk). Score: 7.$$,
 $$First sitting president to join a union picket line (UAW strike, 2023). Strengthened NLRB; raised federal contractor wages; CHIPS Act supports domestic semiconductor manufacturing jobs. Generally the most pro-labor president in decades. Score: 7.$$,
 $$Hur Report (2024): found Biden retained and shared classified documents — characterized him as "elderly man with poor memory" but recommended no charges. Delaware tax arrangements investigated; no charges. No criminal conviction. Score: 5.$$,
 $$Restored NATO alliances; Ukraine military support; strong defense of democratic norms globally. Afghanistan withdrawal (2021): chaotic execution with 13 US service members killed in Kabul airport attack. Some civil liberties concerns on immigration detention. Score: 5.$$,
 $$IRA climate investment, CHIPS Act, Bipartisan Infrastructure Law — significant legislative achievements. American Rescue Plan addressed COVID economic impact at scale. Offset by Afghanistan withdrawal chaos and some foreign policy continuities from prior administrations. Score: 6.$$,
 $$No criminal record; no established associations with convicted criminals. Hur Report finding of classified document mishandling is a conduct concern short of criminal. Generally clean personal conduct record despite decades in public life. Score: 6.$$),

-- ══════════════════════════════════════════════════════════════════
-- 68. SoftBank / Masayoshi Son
-- ══════════════════════════════════════════════════════════════════
($$SoftBank / Masayoshi Son$$, $$combined$$,
 $$Corporation and founder-CEO. Vision Fund I: ~45% Saudi PIF and Abu Dhabi Mubadala capital — the deepest Gulf autocracy entanglement in Silicon Valley history. WeWork $47B valuation collapse after Son overrode partner warnings.$$,
 3, 4, 3, 2, 4, 3, 3.2,
 $$Some clean energy investments in Vision Fund II. No significant direct positive environmental commitment. Score: 3.$$,
 $$Portfolio company labor practices vary widely; WeWork's collapse (after Son overrode partner warnings on valuation) cost thousands of employees jobs and savings. Score: 4.$$,
 $$WeWork: Son assigned a $47B valuation to a company with documented corporate governance failures; overrode internal partner objections; resulting collapse destroyed employee savings and investor capital at scale. No criminal charges. Score: 3.$$,
 $$Vision Fund I is approximately 45% Saudi Public Investment Fund capital — the deepest institutional entanglement between Silicon Valley and a Gulf autocracy documented to date. Son personally cultivated the relationship with MBS. Vision Fund money has flowed through dozens of US tech companies with this capital origin. Score: 2.$$,
 $$SoftBank's early investment in Alibaba was foundational to e-commerce in Asia and remains the largest single venture return in history. Vision Fund portfolio has mixed social impact. Score: 4.$$,
 $$WeWork collapse cost employees, investors, and Neumann (enabled by Son's judgment failures) on documented scale. Saudi PIF as Vision Fund I's primary backer is the defining structural concern. No personal criminal associations. Score: 3.$$),

-- ══════════════════════════════════════════════════════════════════
-- 69. George W. Bush
-- ══════════════════════════════════════════════════════════════════
($$George W. Bush$$, $$individual$$,
 $$43rd US President (2001–2009). Iraq War (2003): 200,000+ civilian deaths documented; torture authorized by administration (Senate Intelligence Committee report); warrantless surveillance. PEPFAR saved 25M+ lives.$$,
 2, 4, 4, 1, 4, 4, 3.2,
 $$Withdrew from Kyoto Protocol; weakened or reversed environmental regulations. Offshore drilling expansion. No significant positive environmental legacy. Score: 2.$$,
 $$Some pro-labor spending in education (No Child Left Behind, flawed but significant). No major labor violations personally. Score: 4.$$,
 $$No personal criminal convictions. Enhanced interrogation techniques authorized by administration were found to constitute torture (Senate Intelligence Committee, 2014) and were based on deliberately misleading legal memos. Warrantless NSA surveillance found unconstitutional. Iraq WMD intelligence: deliberately overstated certainty per multiple investigations. Score: 4 (no personal financial crimes; integrity failures are policy-level).$$,
 $$Iraq War (2003): based on overstated intelligence (post-hoc finding by multiple investigations); 200,000+ Iraqi civilian deaths documented; destabilized the Middle East with reverberations continuing to the present. Enhanced interrogation (torture) program authorized and implemented; illegal under UNCAT (US signatory). Warrantless surveillance. Score: 1.$$,
 $$PEPFAR (2003): credited by IHME with saving 25M+ lives — one of the most impactful single foreign policy acts for global health in history. PEPFAR alone significantly elevates this score. Offset by Iraq and Afghanistan consequences.$$,
 $$No criminal record; no associations with convicted criminals in the traditional sense. Iraq War decisions, while arguably criminal under international humanitarian law, were never adjudicated as such. Personal conduct record is otherwise clean. Score: 4.$$),

-- ══════════════════════════════════════════════════════════════════
-- 70. Angela Merkel
-- ══════════════════════════════════════════════════════════════════
($$Angela Merkel$$, $$individual$$,
 $$Chancellor of Germany (2005–2021). Nord Stream 2 advocacy deepened Russian gas dependency — defining foreign policy failure. 2015 refugee welcome was principled and politically costly.$$,
 5, 6, 6, 5, 7, 7, 6.0,
 $$Germany began Energiewende (energy transition to renewables) under Merkel but she also extended nuclear phase-out timelines and championed Nord Stream 2 — increasing Russian gas dependency significantly. Mixed record on energy transition. Score: 5.$$,
 $$Germany has strong labor protections institutionalized before Merkel; maintained under her tenure; Hartz IV reforms were labor market liberalization with contested effects. Generally good on labor. Score: 6.$$,
 $$No personal criminal convictions. No financial scandals. Widely regarded as a person of high personal integrity in office. Some criticism of opacity in decision-making style. Score: 6.$$,
 $$2015 "Wir schaffen das" (We can do it) on refugee welcome: principled, costly, and ultimately contributed to political instability via AfD rise — a genuinely difficult trade-off executed with moral clarity. Strong EU and multilateral commitment. Nord Stream 2 advocacy, in retrospect, enabled Russian aggression by deepening European gas dependence. Score: 5 on balance.$$,
 $$Steered Germany and Europe through multiple crises (2008 financial crisis, Eurozone debt crisis, migration crisis, COVID). Germany's strong social infrastructure maintained. Reunification-era institutional choices have had lasting positive effects. Score: 7.$$,
 $$No criminal record; no associations with convicted criminals. Personal conduct record is exemplary. Post-Chancellorship: declined lucrative positions to preserve independence. Score: 7.$$),

-- ══════════════════════════════════════════════════════════════════
-- 71. Justin Trudeau
-- ══════════════════════════════════════════════════════════════════
($$Justin Trudeau$$, $$individual$$,
 $$Prime Minister of Canada (2015–2025). Two Ethics Commissioner violations (SNC-Lavalin 2019, Aga Khan 2017). Carbon price legislated. Trans Mountain pipeline approved (2019). Resigned March 2025.$$,
 6, 6, 4, 6, 6, 5, 5.5,
 $$Legislated a national carbon price — Canada's most significant climate policy in history. Approved Trans Mountain pipeline expansion (2019) — a significant offsetting negative. Net: genuine climate leadership alongside real fossil fuel commitment. Score: 6.$$,
 $$CERB and pandemic wage subsidies preserved millions of jobs during COVID. Pro-labor rhetorical record. No systemic labor violations. Score: 6.$$,
 $$Two Ethics Commissioner violations: SNC-Lavalin (2019, improper political interference in a criminal prosecution) and Aga Khan vacation (2017, undisclosed private gift from registered lobbyist). Both formal findings of rules violations. Score: 4.$$,
 $$Legalized cannabis nationally (2018). Strong LGBTQ+ rights record; appointed gender-parity cabinet. Acknowledged residential school system as cultural genocide and established National Day for Truth and Reconciliation. National inquiry into MMIWG. Score: 6.$$,
 $$National Pharmacare Act passed (2024). Childcare program ($10/day in most provinces). Truth and Reconciliation efforts. Offset by SNC-Lavalin affair and two ethics violations. Score: 6.$$,
 $$Two formal ethics violations are documented. Blackface photos surfaced (2019) — multiple incidents; acknowledged and apologized. No criminal record; no associations with convicted criminals. Score: 5.$$),

-- ══════════════════════════════════════════════════════════════════
-- 72. Tony Blair
-- ══════════════════════════════════════════════════════════════════
($$Tony Blair$$, $$individual$$,
 $$Prime Minister of the UK (1997–2007). Chilcot Inquiry (2016) found Blair deliberately overstated intelligence certainty to justify Iraq War. Good Friday Agreement stewardship is defining positive achievement.$$,
 5, 5, 4, 2, 5, 3, 4.0,
 $$Climate Change Act (2008, after leaving office but Blair-era groundwork) and some environmental investment. No extraordinary environmental legacy positive or negative as PM. Score: 5.$$,
 $$New Labour's minimum wage, Working Time Directive implementation, and union rights improvements were genuine advances. Some New Labour reforms weakened social protections. Score: 5.$$,
 $$Chilcot Inquiry (2016): found Blair deliberately overstated the certainty of intelligence about WMDs — "the judgments about the severity of the threat posed by Iraq's WMD were presented with a certainty that was not justified." He was not charged. Post-PM: lucrative advisory work for authoritarian governments (Kazakhstan, UAE). Score: 4.$$,
 $$Iraq War (2003): Chilcot found deliberate overstatement of intelligence certainty; 200,000+ Iraqi civilian deaths. Human Rights Act (1998): landmark domestic civil liberties achievement. Anti-terrorism legislation post-7/7 raised civil liberties concerns. Score: 2.$$,
 $$Good Friday Agreement (1998): Blair's role was central — one of the most successful peace processes in modern history, ended decades of conflict and saved thousands of lives. NHS investment and devolution are genuine positive legacies. Offset by Iraq War. Score: 5.$$,
 $$Post-PM advisory work for Kazakhstan and UAE regimes; lucrative work for authoritarian governments is a conduct concern. No criminal record; Chilcot criticism was severe but not criminal. No associations with convicted criminals. Score: 3.$$),

-- ══════════════════════════════════════════════════════════════════
-- 73. Jacinda Ardern
-- ══════════════════════════════════════════════════════════════════
($$Jacinda Ardern$$, $$individual$$,
 $$Prime Minister of New Zealand (2017–2023). Christchurch gun reform passed in 26 days. Zero Carbon Act (2019). Named first world leader to give birth while in office. Resigned January 2023 with integrity intact.$$,
 7, 7, 7, 8, 8, 9, 7.7,
 $$Zero Carbon Act (2019): committed NZ to net-zero long-lived greenhouse gases by 2050, first country to embed this in law. Climate commission established. Offshore oil and gas exploration banned. Score: 7.$$,
 $$Strong worker protections; raised minimum wage multiple times; parental leave extended; transparent about own experience taking maternity leave as PM. Score: 7.$$,
 $$No personal criminal violations or financial misconduct. Resigned voluntarily stating she had "no more in the tank" — a rare act of honest self-assessment in public life. No corruption. Score: 7.$$,
 $$After Christchurch mosque attack (50 dead), gun reform passed in 26 days: assault weapons and military-style semi-automatics banned with broad public support. Refused to name the Christchurch attacker (denying platform). COVID pandemic management was one of the most effective globally. Score: 8.$$,
 $$Christchurch response was a model for democratic leadership during a terror attack. Wellbeing Budget (2019): first national budget explicitly prioritizing wellbeing metrics over GDP. COVID management preserved lives. Score: 8.$$,
 $$No criminal record; no associations with convicted criminals. Resignation was an act of personal integrity. No documented scandals or misconduct. Score: 9.$$),

-- ══════════════════════════════════════════════════════════════════
-- 74. Ray Dalio / Bridgewater Associates
-- ══════════════════════════════════════════════════════════════════
($$Ray Dalio / Bridgewater Associates$$, $$combined$$,
 $$Individual and firm founder. Praised CCP governance model; dismissed Uyghur detention as a "cultural difference and misunderstanding." Significant Chinese state-linked fund relationships. Giving Pledge member.$$,
 5, 4, 5, 3, 5, 4, 4.3,
 $$No significant positive environmental actions. Standard institutional investment manager footprint. Bridgewater has some ESG integration but is not an environmental leader. Score: 5.$$,
 $$Bridgewater's "radical transparency" culture has been documented by former employees as psychologically abusive — recorded confrontations, public humiliations, and a pervasive surveillance culture. Some employees describe genuine intellectual development; others describe trauma. Score: 4.$$,
 $$No criminal convictions or major regulatory violations. Bridgewater's internal governance and "radical transparency" policies have been criticized as enabling abuse without meeting legal definitions. Score: 5.$$,
 $$Dalio publicly dismissed Uyghur detention as a "cultural difference and misunderstanding" in multiple books and interviews — a documented normalization of CCP persecution. Has repeatedly praised the CCP governance model. Significant investment relationships with Chinese state-linked funds. Score: 3.$$,
 $$Bridgewater has generated substantial returns for pension funds globally, benefiting retirement savers. Principles (2017) is widely read. Giving Pledge member. Dalio Foundation gives to education. Score: 5.$$,
 $$No criminal record. Praise of CCP governance model and dismissal of Uyghur detention are documented and serious. Internal culture documented as abusive by former employees. Score: 4.$$),

-- ══════════════════════════════════════════════════════════════════
-- 75. Al Gore
-- ══════════════════════════════════════════════════════════════════
($$Al Gore$$, $$individual$$,
 $$45th US Vice President; climate advocate; Nobel Peace Prize laureate (2007). Conceded 2000 election to preserve democratic institutions. Climate Reality Project trained 30,000+ advocates globally.$$,
 9, 6, 5, 7, 8, 7, 7.0,
 $$An Inconvenient Truth (2006) shifted global public opinion on climate change; Nobel Peace Prize (2007) co-awarded with IPCC. Climate Reality Project has trained 30,000+ advocates in 100+ countries. Personal carbon footprint (large home, private travel) attracted documented criticism — partially offset by renewable energy purchasing and carbon offsets. Score: 9 given the transformative impact on global climate awareness.$$,
 $$Generally supportive of labor in Senate and VP career. No documented labor violations. Score: 6.$$,
 $$No criminal convictions. 2000 election: demonstrated extraordinary institutional integrity by conceding a genuinely contested election to preserve democratic institutions — foregoing the presidency to avoid a constitutional crisis. Post-VP: significant income from Generation Investment Management. Score: 5 (good personal record; some criticism of carbon credit venture approach).$$,
 $$Led US delegation at Kyoto Protocol negotiations (1997). 2000 election concession is a documented act of democratic sacrifice. Voted against Gulf War authorization (1990) — politically costly decision. Generally pro-civil liberties across career. Score: 7.$$,
 $$Climate Reality Project is one of the most significant civil society climate education efforts globally. An Inconvenient Truth changed the conversation. Gave Pledge member. Generation Investment Management funds clean energy. Score: 8.$$,
 $$No criminal record; no associations with convicted criminals. 2000 election concession in particular stands as a rare act of democratic institutional sacrifice at enormous personal cost. Score: 7.$$)

-- End of values list
ON CONFLICT DO NOTHING;

COMMIT;
