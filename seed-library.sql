-- MedFocus Library Materials Seed Data
-- Materiais acadêmicos reais de medicina, enfermagem e odontologia

INSERT INTO library_materials (title, description, libraryMaterialType, subject, specialty, year, authorName, authorTitle, authorInstitution, authorCountry, source, doi, externalUrl, publishedYear, impactFactor, relevanceScore, language, tags) VALUES

-- ANATOMIA
('Gray''s Anatomy: The Anatomical Basis of Clinical Practice', 'A referência mundial em anatomia humana, com mais de 150 anos de tradição. Abrange anatomia sistêmica e regional com correlações clínicas detalhadas, imagens de alta resolução e atlas integrado.', 'livro', 'Anatomia', 'Anatomia Geral', 1, 'Susan Standring, PhD, DSc', 'Prof. Dr.', 'King''s College London', 'Reino Unido', 'Elsevier', NULL, 'https://www.elsevier.com/books/grays-anatomy/standring/978-0-7020-7707-4', 2020, NULL, 99, 'pt-BR', 'anatomia,atlas,referência,clínica'),

('Netter Atlas de Anatomia Humana', 'Atlas de anatomia com ilustrações artísticas de Frank H. Netter, considerado o padrão-ouro para estudantes de medicina. Inclui mais de 500 pranchas anatômicas com correlações clínicas.', 'atlas', 'Anatomia', 'Anatomia Geral', 1, 'Frank H. Netter, MD', 'Prof. Dr.', 'New York University', 'EUA', 'Elsevier', NULL, 'https://www.elsevier.com/books/netter-atlas-of-human-anatomy/netter/978-0-323-68042-4', 2022, NULL, 98, 'pt-BR', 'anatomia,atlas,netter,ilustrações'),

('Moore Anatomia Orientada para a Clínica', 'Livro-texto de anatomia com forte ênfase na aplicação clínica. Inclui quadros de correlação clínica, imagens de diagnóstico por imagem e casos clínicos integrados.', 'livro', 'Anatomia', 'Anatomia Clínica', 1, 'Keith L. Moore, PhD, FIAC', 'Prof. Dr.', 'University of Manitoba', 'Canadá', 'Guanabara Koogan', NULL, NULL, 2022, NULL, 97, 'pt-BR', 'anatomia,clínica,moore,diagnóstico'),

-- FISIOLOGIA
('Guyton & Hall Tratado de Fisiologia Médica', 'O tratado de fisiologia mais utilizado em faculdades de medicina no mundo. Abrange todos os sistemas fisiológicos com explicações claras e diagramas detalhados.', 'livro', 'Fisiologia', 'Fisiologia Geral', 2, 'John E. Hall, PhD', 'Prof. Dr.', 'University of Mississippi Medical Center', 'EUA', 'Elsevier', NULL, 'https://www.elsevier.com/books/guyton-and-hall-textbook-of-medical-physiology/hall/978-0-323-59712-8', 2020, NULL, 99, 'pt-BR', 'fisiologia,guyton,hall,sistemas'),

('Berne & Levy Fisiologia', 'Texto avançado de fisiologia com abordagem molecular e celular. Ideal para estudantes que buscam aprofundamento em mecanismos fisiológicos e fisiopatologia.', 'livro', 'Fisiologia', 'Fisiologia Celular', 2, 'Bruce M. Koeppen, MD, PhD', 'Prof. Dr.', 'University of Connecticut', 'EUA', 'Elsevier', NULL, NULL, 2018, NULL, 93, 'pt-BR', 'fisiologia,berne,levy,celular,molecular'),

-- FARMACOLOGIA
('Goodman & Gilman: As Bases Farmacológicas da Terapêutica', 'A bíblia da farmacologia médica. Referência completa sobre mecanismos de ação, farmacocinética, farmacodinâmica e uso clínico de todos os grupos farmacológicos.', 'livro', 'Farmacologia', 'Farmacologia Geral', 3, 'Laurence L. Brunton, PhD', 'Prof. Dr.', 'University of California San Diego', 'EUA', 'McGraw-Hill', NULL, NULL, 2023, NULL, 99, 'pt-BR', 'farmacologia,goodman,gilman,terapêutica'),

('Rang & Dale Farmacologia', 'Texto didático de farmacologia com abordagem integrada. Excelente para compreender a relação entre farmacologia básica e aplicação clínica.', 'livro', 'Farmacologia', 'Farmacologia Clínica', 3, 'James M. Ritter, PhD', 'Prof. Dr.', 'King''s College London', 'Reino Unido', 'Elsevier', NULL, NULL, 2020, NULL, 95, 'pt-BR', 'farmacologia,rang,dale,clínica'),

-- CLÍNICA MÉDICA
('Harrison''s Principles of Internal Medicine', 'A referência definitiva em medicina interna. Cobre todas as especialidades clínicas com abordagem baseada em evidências, diagnóstico diferencial e tratamento atualizado.', 'livro', 'Clínica Médica', 'Medicina Interna', 4, 'J. Larry Jameson, MD, PhD', 'Prof. Dr.', 'University of Pennsylvania', 'EUA', 'McGraw-Hill', NULL, 'https://accessmedicine.mhmedical.com/book.aspx?bookID=2129', 2022, NULL, 99, 'pt-BR', 'clínica,harrison,medicina interna,diagnóstico'),

('Cecil Medicina', 'Tratado abrangente de medicina interna com foco em fisiopatologia e terapêutica baseada em evidências. Referência para residência médica e prática clínica.', 'livro', 'Clínica Médica', 'Medicina Interna', 4, 'Lee Goldman, MD', 'Prof. Dr.', 'Columbia University', 'EUA', 'Elsevier', NULL, NULL, 2020, NULL, 97, 'pt-BR', 'clínica,cecil,medicina interna,evidências'),

-- CARDIOLOGIA
('Braunwald''s Heart Disease', 'O tratado de cardiologia mais completo do mundo. Cobre desde fisiologia cardiovascular até intervenções percutâneas e cirurgia cardíaca.', 'livro', 'Cardiologia', 'Cardiologia', 5, 'Douglas P. Zipes, MD', 'Prof. Dr.', 'Indiana University', 'EUA', 'Elsevier', NULL, NULL, 2022, NULL, 98, 'pt-BR', 'cardiologia,braunwald,coração,intervenção'),

('Diretriz Brasileira de Insuficiência Cardíaca Crônica e Aguda', 'Diretriz oficial da Sociedade Brasileira de Cardiologia para manejo da insuficiência cardíaca. Inclui algoritmos de tratamento e classificação funcional.', 'diretriz', 'Cardiologia', 'Insuficiência Cardíaca', 5, 'Sociedade Brasileira de Cardiologia', 'Institucional', 'SBC', 'Brasil', 'Arquivos Brasileiros de Cardiologia', '10.36660/abc.20210436', 'https://www.scielo.br/j/abc/', 2023, '1.679', 96, 'pt-BR', 'cardiologia,insuficiência cardíaca,SBC,diretriz'),

-- ONCOLOGIA / CÂNCER DE MAMA
('Tratado de Oncologia - AC Camargo Cancer Center', 'Referência brasileira em oncologia com abordagem multidisciplinar. Cobre diagnóstico, estadiamento, tratamento cirúrgico, quimioterapia e radioterapia de todos os tipos de câncer.', 'livro', 'Oncologia', 'Oncologia Geral', 5, 'Hezio Jadir Fernandes Jr., MD, PhD', 'Prof. Dr.', 'AC Camargo Cancer Center', 'Brasil', 'Atheneu', NULL, NULL, 2021, NULL, 94, 'pt-BR', 'oncologia,câncer,tratamento,AC Camargo'),

('Câncer de Mama: Diagnóstico e Tratamento - Diretriz INCA', 'Diretriz oficial do Instituto Nacional de Câncer para diagnóstico precoce, estadiamento e tratamento do câncer de mama. Inclui protocolos de rastreamento e algoritmos terapêuticos.', 'diretriz', 'Oncologia', 'Mastologia', 5, 'Instituto Nacional de Câncer (INCA)', 'Institucional', 'INCA/Ministério da Saúde', 'Brasil', 'INCA', NULL, 'https://www.inca.gov.br/tipos-de-cancer/cancer-de-mama', 2024, NULL, 97, 'pt-BR', 'câncer de mama,mastologia,INCA,rastreamento,diagnóstico'),

('NCCN Guidelines: Breast Cancer', 'Diretrizes internacionais da National Comprehensive Cancer Network para manejo do câncer de mama. Padrão-ouro mundial para decisões terapêuticas em oncologia mamária.', 'guideline', 'Oncologia', 'Mastologia', 5, 'National Comprehensive Cancer Network', 'Institucional', 'NCCN', 'EUA', 'NCCN', NULL, 'https://www.nccn.org/guidelines/guidelines-detail?category=1&id=1419', 2024, NULL, 99, 'pt-BR', 'câncer de mama,NCCN,guidelines,tratamento,quimioterapia'),

-- CIRURGIA
('Sabiston Tratado de Cirurgia', 'O tratado de cirurgia geral mais utilizado no mundo. Abrange princípios cirúrgicos, técnicas operatórias e manejo perioperatório de todas as especialidades cirúrgicas.', 'livro', 'Cirurgia', 'Cirurgia Geral', 4, 'Courtney M. Townsend Jr., MD', 'Prof. Dr.', 'University of Texas Medical Branch', 'EUA', 'Elsevier', NULL, NULL, 2022, NULL, 98, 'pt-BR', 'cirurgia,sabiston,técnica operatória,perioperatório'),

-- PEDIATRIA
('Nelson Tratado de Pediatria', 'A referência mundial em pediatria. Cobre todas as doenças pediátricas com abordagem baseada em evidências, desde neonatologia até adolescência.', 'livro', 'Pediatria', 'Pediatria Geral', 5, 'Robert M. Kliegman, MD', 'Prof. Dr.', 'Medical College of Wisconsin', 'EUA', 'Elsevier', NULL, NULL, 2020, NULL, 99, 'pt-BR', 'pediatria,nelson,neonatologia,adolescência'),

-- GINECOLOGIA E OBSTETRÍCIA
('Williams Obstetrícia', 'O tratado de obstetrícia mais utilizado mundialmente. Cobre gestação normal e patológica, parto, puerpério e emergências obstétricas.', 'livro', 'Ginecologia e Obstetrícia', 'Obstetrícia', 5, 'F. Gary Cunningham, MD', 'Prof. Dr.', 'University of Texas Southwestern', 'EUA', 'McGraw-Hill', NULL, NULL, 2022, NULL, 98, 'pt-BR', 'obstetrícia,williams,gestação,parto'),

-- PATOLOGIA
('Robbins & Cotran Patologia: Bases Patológicas das Doenças', 'A referência em patologia médica. Abrange patologia geral e sistêmica com correlações clínicas, imagens histopatológicas e mecanismos moleculares de doença.', 'livro', 'Patologia', 'Patologia Geral', 3, 'Vinay Kumar, MBBS, MD, FRCPath', 'Prof. Dr.', 'University of Chicago', 'EUA', 'Elsevier', NULL, NULL, 2021, NULL, 99, 'pt-BR', 'patologia,robbins,cotran,histopatologia,doença'),

-- MICROBIOLOGIA
('Murray Microbiologia Médica', 'Texto completo de microbiologia médica com abordagem clínica. Cobre bacteriologia, virologia, micologia e parasitologia com ênfase em diagnóstico e tratamento.', 'livro', 'Microbiologia', 'Microbiologia Médica', 2, 'Patrick R. Murray, PhD', 'Prof. Dr.', 'National Institutes of Health', 'EUA', 'Elsevier', NULL, NULL, 2021, NULL, 95, 'pt-BR', 'microbiologia,murray,bactérias,vírus,fungos'),

-- EMERGÊNCIA
('Medicina de Emergência: Abordagem Prática - USP', 'Referência brasileira em medicina de emergência produzida pela equipe do HC-FMUSP. Abordagem prática com protocolos e algoritmos para pronto-socorro.', 'livro', 'Emergência', 'Medicina de Emergência', 5, 'Irineu Tadeu Velasco, MD, PhD', 'Prof. Dr.', 'Faculdade de Medicina da USP (FMUSP)', 'Brasil', 'Manole', NULL, NULL, 2023, NULL, 96, 'pt-BR', 'emergência,pronto-socorro,USP,FMUSP,protocolos'),

-- NEUROLOGIA
('Adams e Victor Princípios de Neurologia', 'Tratado clássico de neurologia com abordagem clínica e fisiopatológica. Cobre todas as doenças neurológicas com diagnóstico diferencial e tratamento.', 'livro', 'Neurologia', 'Neurologia Geral', 5, 'Allan H. Ropper, MD', 'Prof. Dr.', 'Harvard Medical School', 'EUA', 'McGraw-Hill', NULL, NULL, 2019, NULL, 96, 'pt-BR', 'neurologia,adams,victor,diagnóstico,tratamento'),

-- DERMATOLOGIA
('Dermatologia de Sampaio e Rivitti', 'A principal referência brasileira em dermatologia. Cobre todas as dermatoses com imagens clínicas de alta qualidade e abordagem terapêutica atualizada.', 'livro', 'Dermatologia', 'Dermatologia Geral', 5, 'Sebastião A. P. Sampaio, MD, PhD', 'Prof. Dr.', 'Faculdade de Medicina da USP', 'Brasil', 'Artes Médicas', NULL, NULL, 2018, NULL, 95, 'pt-BR', 'dermatologia,sampaio,rivitti,pele,dermatoses'),

-- PSIQUIATRIA
('Kaplan & Sadock Compêndio de Psiquiatria', 'Referência mundial em psiquiatria. Abrange todos os transtornos mentais com critérios diagnósticos DSM-5, epidemiologia, fisiopatologia e tratamento.', 'livro', 'Psiquiatria', 'Psiquiatria Geral', 5, 'Benjamin J. Sadock, MD', 'Prof. Dr.', 'New York University', 'EUA', 'Artmed', NULL, NULL, 2023, NULL, 97, 'pt-BR', 'psiquiatria,kaplan,sadock,DSM-5,transtornos mentais'),

-- ORTOPEDIA
('Ortopedia e Traumatologia: Princípios e Prática - Herbert', 'Referência brasileira em ortopedia e traumatologia. Cobre fraturas, luxações, doenças degenerativas e técnicas cirúrgicas ortopédicas.', 'livro', 'Ortopedia', 'Ortopedia e Traumatologia', 5, 'Sizínio Herbert, MD, PhD', 'Prof. Dr.', 'Universidade Federal do Rio Grande do Sul', 'Brasil', 'Artmed', NULL, NULL, 2022, NULL, 94, 'pt-BR', 'ortopedia,traumatologia,herbert,fraturas'),

-- ARTIGOS PUBMED - CÂNCER DE MAMA
('Breast Cancer Screening: Updated Recommendations', 'Revisão sistemática das recomendações atualizadas para rastreamento do câncer de mama, incluindo mamografia, ultrassonografia e ressonância magnética.', 'revisao_sistematica', 'Oncologia', 'Mastologia', 5, 'US Preventive Services Task Force', 'Institucional', 'USPSTF', 'EUA', 'JAMA', '10.1001/jama.2024.5534', 'https://pubmed.ncbi.nlm.nih.gov/', 2024, '157.335', 98, 'en', 'câncer de mama,rastreamento,mamografia,USPSTF'),

-- ENFERMAGEM
('Brunner & Suddarth Tratado de Enfermagem Médico-Cirúrgica', 'A referência mundial em enfermagem médico-cirúrgica. Abrange cuidados de enfermagem em todas as especialidades com planos de cuidado baseados em evidências.', 'livro', 'Enfermagem', 'Enfermagem Médico-Cirúrgica', 3, 'Janice L. Hinkle, PhD, RN', 'Prof. Dr.', 'Villanova University', 'EUA', 'Guanabara Koogan', NULL, NULL, 2020, NULL, 97, 'pt-BR', 'enfermagem,brunner,suddarth,cuidados,médico-cirúrgica'),

('Diagnósticos de Enfermagem da NANDA-I', 'Classificação oficial de diagnósticos de enfermagem da NANDA International. Essencial para o processo de enfermagem e sistematização da assistência.', 'livro', 'Enfermagem', 'Diagnósticos de Enfermagem', 2, 'NANDA International', 'Institucional', 'NANDA-I', 'EUA', 'Artmed', NULL, NULL, 2024, NULL, 96, 'pt-BR', 'enfermagem,NANDA,diagnósticos,SAE,processo de enfermagem'),

-- ODONTOLOGIA
('Anatomia Dental e Oclusão - Woelfel', 'Texto fundamental de anatomia dental com descrições detalhadas de cada dente, oclusão e articulação temporomandibular.', 'livro', 'Odontologia', 'Anatomia Dental', 1, 'Julian B. Woelfel, DDS', 'Prof. Dr.', 'Ohio State University', 'EUA', 'Guanabara Koogan', NULL, NULL, 2020, NULL, 93, 'pt-BR', 'odontologia,anatomia dental,oclusão,ATM'),

('Periodontia Clínica - Carranza', 'A referência mundial em periodontia. Cobre diagnóstico, prevenção e tratamento das doenças periodontais com abordagem baseada em evidências.', 'livro', 'Odontologia', 'Periodontia', 3, 'Michael G. Newman, DDS', 'Prof. Dr.', 'UCLA School of Dentistry', 'EUA', 'Elsevier', NULL, NULL, 2019, NULL, 95, 'pt-BR', 'odontologia,periodontia,carranza,doença periodontal'),

-- SAÚDE PÚBLICA
('Epidemiologia Clínica - Fletcher', 'Texto fundamental de epidemiologia clínica com foco em medicina baseada em evidências. Ensina a interpretar estudos clínicos e aplicar na prática.', 'livro', 'Saúde Pública', 'Epidemiologia', 3, 'Robert H. Fletcher, MD, MSc', 'Prof. Dr.', 'Harvard Medical School', 'EUA', 'Artmed', NULL, NULL, 2021, NULL, 94, 'pt-BR', 'epidemiologia,evidências,estudos clínicos,fletcher'),

-- BIOQUÍMICA
('Lehninger Princípios de Bioquímica', 'O texto de bioquímica mais utilizado em cursos de saúde. Abrange metabolismo, biologia molecular e regulação gênica com clareza didática excepcional.', 'livro', 'Bioquímica', 'Bioquímica Geral', 1, 'David L. Nelson, PhD', 'Prof. Dr.', 'University of Wisconsin-Madison', 'EUA', 'Artmed', NULL, NULL, 2019, NULL, 96, 'pt-BR', 'bioquímica,lehninger,metabolismo,biologia molecular'),

-- IMUNOLOGIA
('Abbas Imunologia Celular e Molecular', 'Referência em imunologia com abordagem molecular. Cobre imunidade inata e adaptativa, autoimunidade, transplantes e imunodeficiências.', 'livro', 'Imunologia', 'Imunologia Médica', 2, 'Abul K. Abbas, MBBS', 'Prof. Dr.', 'University of California San Francisco', 'EUA', 'Elsevier', NULL, NULL, 2022, NULL, 96, 'pt-BR', 'imunologia,abbas,celular,molecular,autoimunidade'),

-- RADIOLOGIA
('Fundamentos de Radiologia - Brant & Helms', 'Texto introdutório de radiologia diagnóstica com abordagem sistemática. Cobre radiografia, tomografia, ressonância magnética e ultrassonografia.', 'livro', 'Radiologia', 'Radiologia Diagnóstica', 4, 'William E. Brant, MD', 'Prof. Dr.', 'University of Virginia', 'EUA', 'Guanabara Koogan', NULL, NULL, 2020, NULL, 93, 'pt-BR', 'radiologia,diagnóstico por imagem,TC,RM,ultrassom');
