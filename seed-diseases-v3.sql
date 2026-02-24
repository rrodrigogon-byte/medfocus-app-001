-- Guia de Doenças — Materiais com referências validadas
-- Colunas: id, title, description, libraryMaterialType, subject, specialty, year, authorName, authorTitle, authorInstitution, source, doi, externalUrl, publishedYear, impactFactor, tags, relevanceScore

-- CARDIOLOGIA
INSERT INTO library_materials (title, description, libraryMaterialType, subject, specialty, year, authorName, authorTitle, authorInstitution, source, doi, externalUrl, publishedYear, impactFactor, tags, relevanceScore) VALUES
('Hipertensão Arterial Sistêmica — Diagnóstico e Tratamento',
'Diretriz Brasileira de HAS 2020. Classificação: Normal (<120/80), Elevada (120-129/<80), Estágio 1 (130-139/80-89), Estágio 2 (≥140/≥90). Tratamento: MEV + IECA/BRA, BCC ou tiazídico. Meta: <130/80 para alto risco. Ref: Arq Bras Cardiol. 2021;116(3):516-658. DOI: 10.36660/abc.20201238. Mancia G et al. 2023 ESH Guidelines. J Hypertens. 2023;41(12):1874-2071.',
'guideline', 'Cardiologia', 'Cardiologia', 2021, 'Sociedade Brasileira de Cardiologia', 'Diretriz', 'SBC', 'Arquivos Brasileiros de Cardiologia', '10.36660/abc.20201238', 'https://www.scielo.br/j/abc/a/TLrgMhbkR7DSgJNvvJgFGBx/', 2021, '3.278', 'hipertensão,HAS,pressão arterial,IECA,BRA,anlodipino', 98),

('Insuficiência Cardíaca — Classificação e Manejo Baseado em Evidências',
'Diretriz Brasileira de IC 2021. ICFEr (FEVE<40%): IECA/ARNI + BB + espironolactona + iSGLT2. NYHA I-IV. Ref: Arq Bras Cardiol. 2021;116(6):1174-1212. DOI: 10.36660/abc.20210062. McDonagh TA et al. 2021 ESC Guidelines for HF. Eur Heart J. 2021;42(36):3599-3726.',
'guideline', 'Cardiologia', 'Cardiologia', 2021, 'Sociedade Brasileira de Cardiologia', 'Diretriz', 'SBC', 'Arquivos Brasileiros de Cardiologia', '10.36660/abc.20210062', 'https://www.scielo.br/j/abc/', 2021, '3.278', 'insuficiência cardíaca,IC,FEVE,ARNI,sacubitril,iSGLT2,betabloqueador', 97),

('Infarto Agudo do Miocárdio com Supra de ST (IAMCSST)',
'Guideline ACCF/AHA para IAMCSST. Diagnóstico: dor torácica + supra ST ≥1mm em 2 derivações contíguas. Reperfusão: ICP primária <90min ou fibrinolítico <30min. AAS + P2Y12 + heparina. Pós-IAM: IECA + BB + estatina alta potência. Ref: O''Gara PT et al. Circulation. 2013;127(4):e362-e425. Ibanez B et al. 2017 ESC STEMI. Eur Heart J. 2018;39(2):119-177.',
'guideline', 'Cardiologia', 'Cardiologia', 2018, 'American Heart Association', 'Guideline', 'AHA/ACC/ESC', 'Circulation / European Heart Journal', '10.1161/CIR.0b013e3182742cf6', 'https://www.ahajournals.org/doi/10.1161/CIR.0b013e3182742cf6', 2018, '39.918', 'IAM,IAMCSST,infarto,supra ST,angioplastia,fibrinolítico,troponina', 99),

('Fibrilação Atrial — Diagnóstico, Classificação e Anticoagulação',
'ESC Guidelines 2020. ECG: ausência de ondas P + RR irregulares. CHA₂DS₂-VASc ≥2 (homens) ou ≥3 (mulheres) → DOAC. Apixabana, rivaroxabana, dabigatrana ou edoxabana. Controle FC: BB ou BCC. Controle ritmo: amiodarona, ablação. Ref: Hindricks G et al. Eur Heart J. 2021;42(5):373-498. PMID: 32860505.',
'guideline', 'Cardiologia', 'Cardiologia', 2021, 'European Society of Cardiology', 'Guideline', 'ESC', 'European Heart Journal', '10.1093/eurheartj/ehaa612', 'https://academic.oup.com/eurheartj/article/42/5/373/5899003', 2021, '39.3', 'fibrilação atrial,FA,anticoagulação,DOAC,apixabana,rivaroxabana,CHA2DS2-VASc', 97),

('Síndrome Coronariana Aguda sem Supra de ST (SCASSST)',
'Angina instável e IAMSSST. Diagnóstico: dor torácica + troponina elevada (IAMSSST). Estratificação: GRACE score. Dupla antiagregação + anticoagulação + estratégia invasiva precoce se alto risco. Ref: Nicolau JC et al. Arq Bras Cardiol. 2021;117(1):181-264. Collet JP et al. 2020 ESC NSTE-ACS. Eur Heart J. 2021;42(14):1289-1367.',
'guideline', 'Cardiologia', 'Cardiologia', 2021, 'SBC / ESC', 'Diretriz', 'SBC/ESC', 'Arq Bras Cardiol / Eur Heart J', '10.36660/abc.20210180', 'https://www.scielo.br/j/abc/', 2021, '3.278', 'SCA,SCASSST,angina instável,troponina,GRACE,clopidogrel,ticagrelor', 96),

-- ENDOCRINOLOGIA
('Diabetes Mellitus Tipo 2 — Diagnóstico e Algoritmo Terapêutico',
'Diretrizes SBD 2023-2024 e ADA 2024. Diagnóstico: GJ ≥126, HbA1c ≥6.5%, TOTG ≥200. Meta HbA1c <7%. 1ª linha: metformina. Se DCV: + GLP-1RA ou iSGLT2. Se DRC: + iSGLT2 + finerenona. Se obesidade: + GLP-1RA ou tirzepatida. Ref: Diretrizes SBD 2023-2024. ADA Standards of Care 2024. Diabetes Care. 2024;47(Suppl 1):S1-S321.',
'guideline', 'Endocrinologia', 'Endocrinologia', 2024, 'SBD / ADA', 'Diretriz', 'SBD/ADA', 'Diabetes Care', '10.2337/dc24-SINT', 'https://diabetesjournals.org/care/issue/47/Supplement_1', 2024, '19.112', 'diabetes,DM2,metformina,iSGLT2,GLP-1,HbA1c,semaglutida,insulina', 99),

('Cetoacidose Diabética — Protocolo de Emergência',
'CAD: glicemia >250 + pH <7.3 + bicarbonato <18 + cetonemia. Tratamento: SF 0.9% 1-1.5L/h → insulina regular 0.1U/kg/h EV → reposição K+ (se <5.3). Se K <3.3: repor antes da insulina. Monitorar glicemia 1/1h, gasometria 2-4h. Ref: Kitabchi AE et al. Diabetes Care. 2009;32(7):1335-1343. Umpierrez GE et al. Diabetologia. 2020;63(12):2453-2461.',
'guideline', 'Endocrinologia', 'Emergência', 2020, 'ADA', 'Guideline', 'ADA', 'Diabetes Care / Diabetologia', '10.2337/dc09-9032', 'https://diabetesjournals.org/care/article/32/7/1335/27156', 2020, '19.112', 'CAD,cetoacidose,emergência,insulina,acidose metabólica,potássio', 98),

('Hipotireoidismo — Diagnóstico e Reposição Hormonal',
'ATA Guidelines 2014. Diagnóstico: TSH elevado + T4L baixo (primário). Subclínico: TSH elevado + T4L normal. Tratamento: levotiroxina 1.6 mcg/kg/dia em jejum, 30-60min antes do café. Monitorar TSH em 6-8 semanas. Ref: Jonklaas J et al. Thyroid. 2014;24(12):1670-1751. PMID: 25266247.',
'guideline', 'Endocrinologia', 'Endocrinologia', 2014, 'American Thyroid Association', 'Guideline', 'ATA', 'Thyroid', '10.1089/thy.2014.0028', 'https://www.liebertpub.com/doi/10.1089/thy.2014.0028', 2014, '6.568', 'hipotireoidismo,TSH,T4,levotiroxina,tireoide,subclínico', 95),

-- PNEUMOLOGIA
('Pneumonia Adquirida na Comunidade — Diagnóstico e Antibioticoterapia',
'SBPT e ATS/IDSA. CURB-65: 0-1 ambulatorial, 2 internação, 3-5 UTI. Ambulatorial sem comorbidade: amoxicilina ou azitromicina. Com comorbidade: amoxicilina-clavulanato + azitromicina ou levofloxacino. Internado: ceftriaxona + azitromicina. UTI: ceftriaxona + azitromicina. Duração 5-7 dias. Ref: Corrêa RA et al. J Bras Pneumol. 2018;44(5):405-424. Metlay JP et al. Am J Respir Crit Care Med. 2019;200(7):e45-e67.',
'guideline', 'Pneumologia', 'Pneumologia', 2019, 'SBPT / ATS / IDSA', 'Diretriz', 'SBPT/ATS/IDSA', 'J Bras Pneumol / Am J Respir Crit Care Med', '10.1164/rccm.201908-1581ST', 'https://www.atsjournals.org/doi/10.1164/rccm.201908-1581ST', 2019, '30.528', 'pneumonia,PAC,CURB-65,antibiótico,amoxicilina,ceftriaxona,levofloxacino', 98),

('DPOC — Diagnóstico, Classificação GOLD e Tratamento',
'GOLD 2024. Espirometria: VEF1/CVF <0.70 pós-BD. GOLD 1-4. Grupos ABE. Grupo A: BD curta SOS. Grupo B: LABA+LAMA. Grupo E: LABA+LAMA (±ICS se eos≥300). Exacerbação: prednisona 40mg 5d + ATB se escarro purulento. Ref: GOLD Report 2024. Agustí A et al. Am J Respir Crit Care Med. 2023;207(8):992-1012.',
'guideline', 'Pneumologia', 'Pneumologia', 2024, 'GOLD', 'Report', 'GOLD', 'Am J Respir Crit Care Med', '10.1164/rccm.202301-0106PP', 'https://goldcopd.org/2024-gold-report/', 2024, '30.528', 'DPOC,espirometria,LABA,LAMA,broncodilatador,GOLD,exacerbação', 97),

('Asma — Diagnóstico e Steps GINA 2024',
'GINA 2024. Diagnóstico: sintomas variáveis + BD positivo (≥12% e 200mL). Steps: 1-2: CI-formoterol SOS; 3: CI baixa dose + LABA; 4: CI média + LABA; 5: CI alta + LABA + biológico. Ref: GINA Report 2024. ginasthma.org.',
'guideline', 'Pneumologia', 'Pneumologia', 2024, 'GINA', 'Report', 'GINA', 'GINA Report', '', 'https://ginasthma.org/gina-reports/', 2024, '', 'asma,GINA,corticoide inalatório,LABA,broncoespasmo,formoterol', 96),

-- NEUROLOGIA
('AVC Isquêmico — Diagnóstico, Trombólise e Trombectomia',
'AHA/ASA 2019. Diagnóstico: déficit focal súbito + TC sem hemorragia. NIHSS para gravidade. Trombólise: alteplase 0.9mg/kg <4.5h. Trombectomia: oclusão grande vaso + NIHSS≥6 + ASPECTS≥6, até 24h (DAWN/DEFUSE-3). Ref: Powers WJ et al. Stroke. 2019;50(12):e344-e418. Nogueira RG et al. DAWN. N Engl J Med. 2018;378(1):11-21.',
'guideline', 'Neurologia', 'Neurologia', 2019, 'AHA / ASA', 'Guideline', 'AHA/ASA', 'Stroke / N Engl J Med', '10.1161/STR.0000000000000211', 'https://www.ahajournals.org/doi/10.1161/STR.0000000000000211', 2019, '10.17', 'AVC,AVC isquêmico,trombólise,alteplase,NIHSS,trombectomia,DAWN', 99),

('Epilepsia — Diagnóstico ILAE e Antiepilépticos',
'ILAE 2017. Diagnóstico: ≥2 crises não provocadas >24h, ou 1 crise + risco >60%. Focal: carbamazepina, lamotrigina, levetiracetam. Generalizada: valproato, lamotrigina, levetiracetam. Ref: Scheffer IE et al. Epilepsia. 2017;58(4):512-521. PMID: 28276062.',
'guideline', 'Neurologia', 'Neurologia', 2017, 'ILAE', 'Classification', 'ILAE', 'Epilepsia', '10.1111/epi.13709', 'https://onlinelibrary.wiley.com/doi/10.1111/epi.13709', 2017, '6.04', 'epilepsia,crise convulsiva,antiepiléptico,carbamazepina,valproato,levetiracetam', 95),

-- INFECTOLOGIA
('Sepse e Choque Séptico — Surviving Sepsis Campaign 2021',
'Sepsis-3: infecção + SOFA ≥2. Choque séptico: vasopressor para PAM≥65 + lactato>2. Bundle 1h: lactato, hemoculturas, ATB <1h, cristaloide 30mL/kg. Vasopressor: noradrenalina 1ª escolha. Hidrocortisona 200mg/dia se refratário. Ref: Singer M et al. JAMA. 2016;315(8):801-810. Evans L et al. Intensive Care Med. 2021;47(11):1181-1247.',
'guideline', 'Infectologia', 'Emergência', 2021, 'SCCM / ESICM', 'Guideline', 'SSC', 'Intensive Care Med / JAMA', '10.1007/s00134-021-06506-y', 'https://link.springer.com/article/10.1007/s00134-021-06506-y', 2021, '41.787', 'sepse,choque séptico,SOFA,qSOFA,noradrenalina,antibiótico,lactato', 99),

('HIV/AIDS — Diagnóstico e Terapia Antirretroviral (TARV)',
'PCDT HIV/AIDS 2024. Iniciar TARV para todos, independente de CD4. Esquema preferencial: TDF + 3TC + DTG. Monitorar CV e CD4 a cada 6 meses. Profilaxias: CD4<200 → SMX-TMP; CD4<50 → azitromicina. Ref: PCDT HIV/AIDS 2024. Ministério da Saúde do Brasil.',
'guideline', 'Infectologia', 'Infectologia', 2024, 'Ministério da Saúde', 'PCDT', 'MS Brasil', 'Ministério da Saúde', '', 'https://www.gov.br/aids/pt-br', 2024, '', 'HIV,AIDS,TARV,antirretroviral,dolutegravir,CD4,tenofovir', 97),

-- GASTROENTEROLOGIA
('Cirrose Hepática — Diagnóstico e Manejo das Complicações',
'EASL 2018. Elastografia >12.5 kPa. Child-Pugh A/B/C. MELD. Ascite: espironolactona + furosemida. PBE: cefotaxima + albumina. HDA varicosa: terlipressina + ligadura. Encefalopatia: lactulose + rifaximina. Ref: EASL CPG. J Hepatol. 2018;69(2):406-460. PMID: 29653741.',
'guideline', 'Gastroenterologia', 'Gastroenterologia', 2018, 'EASL', 'Guideline', 'EASL', 'Journal of Hepatology', '10.1016/j.jhep.2018.03.024', 'https://www.journal-of-hepatology.eu/', 2018, '30.083', 'cirrose,Child-Pugh,MELD,ascite,PBE,varizes,encefalopatia hepática', 98),

('Doença do Refluxo Gastroesofágico (DRGE)',
'ACG 2022. Diagnóstico: pirose + regurgitação + resposta ao IBP. EDA se sinais de alarme. Tratamento: IBP dose padrão 4-8 semanas. Barrett: vigilância endoscópica. Ref: Katz PO et al. Am J Gastroenterol. 2022;117(1):27-56. PMID: 34807007.',
'guideline', 'Gastroenterologia', 'Gastroenterologia', 2022, 'ACG', 'Guideline', 'ACG', 'Am J Gastroenterol', '10.14309/ajg.0000000000001538', 'https://journals.lww.com/ajg/', 2022, '12.045', 'DRGE,refluxo,IBP,omeprazol,esôfago de Barrett,pirose', 95),

-- NEFROLOGIA
('Doença Renal Crônica — Estadiamento KDIGO e Nefroproteção',
'KDIGO 2024. TFG G1-G5, Albuminúria A1-A3. Nefroproteção: IECA/BRA + iSGLT2 (TFG≥20) + finerenona (DM2) + PA <130/80 + estatina (G3-G5). Diálise se TFG<10-15 + sintomas. Ref: KDIGO 2024. Kidney Int. 2024;105(4S). Heerspink HJL et al. DAPA-CKD. N Engl J Med. 2020;383(15):1436-1446.',
'guideline', 'Nefrologia', 'Nefrologia', 2024, 'KDIGO', 'Guideline', 'KDIGO', 'Kidney International', '10.1016/j.kint.2024.01.006', 'https://kdigo.org/guidelines/', 2024, '20.871', 'DRC,doença renal crônica,TFG,albuminúria,IECA,iSGLT2,diálise,finerenona', 98),

('Injúria Renal Aguda — Critérios KDIGO e Manejo',
'KDIGO AKI. Critérios: aumento Cr ≥0.3 em 48h, ou ≥1.5x basal em 7d, ou diurese <0.5mL/kg/h por 6h. Estágios 1-3. Causas: pré-renal, renal (NTA), pós-renal. Ref: KDIGO AKI Guideline. Kidney Int Suppl. 2012;2(1):1-138.',
'guideline', 'Nefrologia', 'Nefrologia', 2012, 'KDIGO', 'Guideline', 'KDIGO', 'Kidney Int Suppl', '', 'https://kdigo.org/guidelines/acute-kidney-injury/', 2012, '20.871', 'IRA,injúria renal aguda,creatinina,diálise,NTA,KDIGO', 96),

-- REUMATOLOGIA
('Artrite Reumatoide — Diagnóstico ACR/EULAR e Tratamento',
'ACR/EULAR 2010 (≥6 pontos). 1ª linha: metotrexato 15-25mg/semana + ácido fólico. Refratário: anti-TNF, anti-IL6, JAKi. Meta: DAS28 <2.6 (remissão). Ref: Aletaha D et al. Ann Rheum Dis. 2010;69(9):1580-1588. Fraenkel L et al. Arthritis Rheumatol. 2021;73(7):1108-1123.',
'guideline', 'Reumatologia', 'Reumatologia', 2021, 'ACR / EULAR', 'Guideline', 'ACR/EULAR', 'Arthritis & Rheumatology', '10.1002/art.41752', 'https://onlinelibrary.wiley.com/doi/10.1002/art.41752', 2021, '13.3', 'artrite reumatoide,metotrexato,anti-TNF,biológico,DAS28,anti-CCP', 97),

('Lúpus Eritematoso Sistêmico — Diagnóstico e Tratamento',
'EULAR/ACR 2019 (≥10 pontos + ANA+). Hidroxicloroquina para todos + corticoide dose mínima + imunossupressor conforme manifestação. Nefrite: micofenolato ou ciclofosfamida. Ref: Fanouriakis A et al. Ann Rheum Dis. 2019;78(6):736-745. PMID: 30926722.',
'guideline', 'Reumatologia', 'Reumatologia', 2019, 'EULAR', 'Guideline', 'EULAR', 'Ann Rheum Dis', '10.1136/annrheumdis-2019-215089', 'https://ard.bmj.com/content/78/6/736', 2019, '27.973', 'lúpus,LES,ANA,hidroxicloroquina,nefrite lúpica,micofenolato', 96),

-- HEMATOLOGIA
('Anemia Ferropriva — Diagnóstico e Reposição de Ferro',
'BSH 2021. Diagnóstico: Hb baixa + ferritina <30 + sat transferrina <20%. Oral: sulfato ferroso 200mg 2-3x/dia. EV: carboximaltose férrica 15mg/kg se intolerância oral. Ref: Snook J et al. Br J Haematol. 2021;195(2):208-227. PMID: 34490624.',
'guideline', 'Hematologia', 'Hematologia', 2021, 'BSH', 'Guideline', 'BSH', 'Br J Haematol', '10.1111/bjh.17848', 'https://onlinelibrary.wiley.com/doi/10.1111/bjh.17848', 2021, '6.998', 'anemia,ferropriva,ferritina,ferro,sulfato ferroso,carboximaltose', 95),

-- PEDIATRIA
('Bronquiolite Viral Aguda — Manejo em Lactentes',
'AAP 2014/2023. VSR principal agente. Diagnóstico clínico: sibilância + taquipneia em <2 anos. Tratamento: suporte (O2 se SpO2<90%, hidratação, aspiração nasal). NÃO usar: BD, corticoide, ATB. Prevenção: palivizumabe, nirsevimabe. Ref: Ralston SL et al. Pediatrics. 2014;134(5):e1474-e1502.',
'guideline', 'Pediatria', 'Pediatria', 2023, 'AAP', 'Guideline', 'AAP', 'Pediatrics', '10.1542/peds.2014-2742', 'https://publications.aap.org/pediatrics/article/134/5/e1474/33150', 2023, '8.64', 'bronquiolite,VSR,lactente,sibilância,pediatria,palivizumabe', 97),

('Infecção do Trato Urinário na Infância',
'NICE CG54. Diagnóstico: EAS + urocultura >100.000 UFC/mL. <3 meses: ampicilina + gentamicina EV. >3 meses: cefalexina ou SMX-TMP VO 7-10d. USG renal para todos. UCM se ITU febril recorrente. Ref: NICE CG54. 2022 update.',
'guideline', 'Pediatria', 'Pediatria', 2022, 'NICE', 'Guideline', 'NICE', 'NICE Guidelines', '', 'https://www.nice.org.uk/guidance/cg54', 2022, '', 'ITU,infecção urinária,pediatria,urocultura,refluxo vesicoureteral', 94),

-- GINECOLOGIA/OBSTETRÍCIA
('Pré-Eclâmpsia — Diagnóstico, Classificação e Manejo',
'ACOG 2020. PA ≥140/90 após 20 sem + proteinúria ≥300mg/24h. Grave: PA ≥160/110, plaquetas <100k, Cr >1.1. Prevenção: AAS 100-150mg/dia 12-16 sem. Sulfato de magnésio: Zuspan 4g + 1-2g/h. Anti-HAS: nifedipino, hidralazina. Parto: ≥37 sem ou imediato se grave. Ref: ACOG PB 222. Obstet Gynecol. 2020;135(6):e237-e260. Rolnik DL et al. ASPRE. N Engl J Med. 2017;377(7):613-622.',
'guideline', 'Ginecologia', 'Obstetrícia', 2020, 'ACOG', 'Practice Bulletin', 'ACOG', 'Obstet Gynecol / N Engl J Med', '10.1097/AOG.0000000000003891', 'https://journals.lww.com/greenjournal/', 2020, '7.661', 'pré-eclâmpsia,eclâmpsia,sulfato de magnésio,HELLP,gestação,AAS', 98),

-- PSIQUIATRIA
('Depressão Maior — Diagnóstico DSM-5 e Farmacoterapia',
'APA 2023. DSM-5: ≥5 sintomas ≥2 semanas. PHQ-9 para triagem. 1ª linha ISRS: sertralina, escitalopram, fluoxetina. 2ª linha IRSN: venlafaxina, duloxetina. Refratária: lítio, aripiprazol, ECT. Duração: 6-12 meses após remissão. Ref: APA 2023. Cipriani A et al. Lancet. 2018;391(10128):1357-1366.',
'guideline', 'Psiquiatria', 'Psiquiatria', 2023, 'APA', 'Practice Guideline', 'APA', 'Am J Psychiatry / Lancet', '10.1016/S0140-6736(17)32802-7', 'https://psychiatryonline.org/guidelines', 2023, '18.112', 'depressão,ISRS,sertralina,escitalopram,PHQ-9,antidepressivo,DSM-5', 97),

-- EMERGÊNCIA
('Parada Cardiorrespiratória — ACLS 2020',
'AHA 2020. C-A-B. RCP: 100-120/min, 5-6cm. FV/TV: desfibrilação + epinefrina 1mg 3-5min + amiodarona 300mg. Assistolia/AESP: epinefrina imediata + 5H/5T. Pós-PCR: temperatura 32-36°C 24h. Ref: Panchal AR et al. Circulation. 2020;142(16_suppl_2):S366-S468.',
'guideline', 'Emergência', 'Emergência', 2020, 'AHA', 'Guideline', 'AHA', 'Circulation', '10.1161/CIR.0000000000000916', 'https://www.ahajournals.org/doi/10.1161/CIR.0000000000000916', 2020, '39.918', 'PCR,ACLS,RCP,desfibrilação,epinefrina,amiodarona,FV,assistolia', 99),

('Anafilaxia — Diagnóstico e Tratamento de Emergência',
'WAO 2020. Início agudo com pele/mucosa + respiratório ou cardiovascular. EPINEFRINA IM 0.3-0.5mg anterolateral da coxa, repetir 5-15min. Decúbito dorsal com MMII elevados. Ref: Cardona V et al. World Allergy Organ J. 2020;13(10):100472.',
'guideline', 'Emergência', 'Emergência', 2020, 'WAO', 'Guideline', 'WAO', 'World Allergy Organ J', '10.1016/j.waojou.2020.100472', 'https://waojournal.biomedcentral.com/', 2020, '5.016', 'anafilaxia,epinefrina,adrenalina,choque anafilático,alergia', 96),

-- ONCOLOGIA
('Câncer de Mama — Rastreamento e Diagnóstico',
'INCA 2022. Rastreamento: mamografia bienal 50-69 anos. Diagnóstico: BI-RADS + core biopsy. Subtipos: Luminal A/B, HER2+, triplo-negativo. Tratamento: cirurgia + RT ± QT/HT conforme subtipo. Ref: INCA Diretrizes 2022. Harbeck N et al. Lancet. 2019;389(10074):1134-1150.',
'guideline', 'Oncologia', 'Oncologia', 2022, 'INCA', 'Diretriz', 'INCA', 'INCA / Lancet', '', 'https://www.inca.gov.br/', 2022, '', 'câncer de mama,mamografia,BI-RADS,mastectomia,quimioterapia,HER2', 96),

-- DERMATOLOGIA
('Dermatite Atópica — Diagnóstico e Tratamento',
'EADV 2022. Critérios de Hanifin & Rajka. Prurido + eczema crônico + atopia. Tratamento: emolientes + corticoide tópico. Refratário: tacrolimus, dupilumabe. Ref: Wollenberg A et al. J Eur Acad Dermatol Venereol. 2022;36(9):1409-1431.',
'guideline', 'Dermatologia', 'Dermatologia', 2022, 'EADV', 'Guideline', 'EADV', 'J Eur Acad Dermatol Venereol', '10.1111/jdv.18345', 'https://onlinelibrary.wiley.com/doi/10.1111/jdv.18345', 2022, '9.228', 'dermatite atópica,eczema,corticoide tópico,dupilumabe,emoliente', 94),

-- ORTOPEDIA
('Fraturas do Fêmur Proximal — Classificação e Tratamento',
'AAOS 2021. Intracapsulares: Garden I-IV. Garden I-II: fixação interna. Garden III-IV idosos: artroplastia. Extracapsulares: haste cefalomedular. Cirurgia <48h reduz mortalidade. Ref: AAOS CPG Hip Fractures. 2021.',
'guideline', 'Ortopedia', 'Ortopedia', 2021, 'AAOS', 'Guideline', 'AAOS', 'AAOS Clinical Practice Guidelines', '', 'https://www.aaos.org/quality/quality-programs/clinical-practice-guidelines/', 2021, '', 'fratura fêmur,colo femoral,artroplastia,Garden,transtrocantérica', 94),

-- UROLOGIA
('Hiperplasia Prostática Benigna — Diagnóstico e Tratamento',
'EAU 2024. IPSS: leve 0-7, moderado 8-19, grave 20-35. Leve: vigilância. Moderado: alfa-bloqueador (tansulosina) ou 5α-redutase (finasterida). Grave: RTU ou HoLEP. Ref: EAU Guidelines BPH. 2024.',
'guideline', 'Urologia', 'Urologia', 2024, 'EAU', 'Guideline', 'EAU', 'EAU Guidelines', '', 'https://uroweb.org/guidelines/', 2024, '', 'HPB,próstata,IPSS,tansulosina,finasterida,RTU', 94);
