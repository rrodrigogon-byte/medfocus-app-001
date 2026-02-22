# 🔐 MedFocus PhD - Arquitetura de Segurança e Compliance

> **Documento de Especificação V4.0 - Segurança, Privacidade e Compliance**
> 
> Objetivo: Garantir que dados médicos nunca vazem e que o sistema seja LGPD/HIPAA-compliant
> 
> Data: Fevereiro 2026  
> Confidencial - Security Team Only

---

## 📋 Índice

1. [Princípios de Segurança](#princípios-de-segurança)
2. [Arquitetura de Segurança](#arquitetura-de-segurança)
3. [Compliance LGPD](#compliance-lgpd)
4. [Compliance HIPAA](#compliance-hipaa-opcional)
5. [Data Privacy by Design](#data-privacy-by-design)
6. [Incident Response Plan](#incident-response-plan)
7. [Auditorias e Certificações](#auditorias-e-certificações)
8. [Políticas de Acesso](#políticas-de-acesso)

---

## 🛡️ Princípios de Segurança

### Zero Trust Architecture

**Princípio:** "Never trust, always verify"

```
Nenhum usuário ou serviço é confiável por padrão
→ Autenticação contínua
→ Autorização granular
→ Mínimo privilégio
→ Micro-segmentação
```

### Defense in Depth (Defesa em Camadas)

```
Layer 7: Application Security (WAF, Input Validation)
Layer 6: Authentication & Authorization (Firebase Auth, IAM)
Layer 5: Encryption (TLS 1.3, AES-256)
Layer 4: Network Security (VPC, Firewall Rules)
Layer 3: Infrastructure Security (GKE, Cloud Run hardening)
Layer 2: Data Security (Encryption at rest, Tokenization)
Layer 1: Physical Security (Google Data Centers)
```

### Privacy by Design

**Princípios:**
1. Proativo, não reativo
2. Privacidade como padrão (opt-in, não opt-out)
3. Privacidade incorporada no design
4. Funcionalidade completa (sem trade-offs)
5. Segurança end-to-end
6. Visibilidade e transparência
7. Respeito pela privacidade do usuário

---

## 🏗️ Arquitetura de Segurança

### Diagrama de Arquitetura Segura

```
┌─────────────────────────────────────────────────┐
│              EXTERNAL USERS                     │
│  (Estudantes, Médicos, Laboratórios)           │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│           CLOUDFLARE (CDN + WAF)                │
│  • DDoS Protection                              │
│  • Bot Detection                                │
│  • Rate Limiting                                │
│  • TLS 1.3 Encryption                           │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│        GOOGLE CLOUD LOAD BALANCER               │
│  • SSL/TLS Termination                          │
│  • Health Checks                                │
│  • Auto-scaling                                 │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│            API GATEWAY (Apigee)                 │
│  • OAuth 2.0 / JWT Validation                   │
│  • API Key Management                           │
│  • Quota & Rate Limiting                        │
│  • Request Logging                              │
└────────────────┬────────────────────────────────┘
                 │
    ┌────────────┼────────────┐
    ▼            ▼            ▼
┌─────────┐ ┌─────────┐ ┌─────────┐
│ Auth    │ │ Content │ │ Intel   │
│ Service │ │ Service │ │ Service │
└─────────┘ └─────────┘ └─────────┘
    │            │            │
    │            │            │
    ▼            ▼            ▼
┌─────────────────────────────────────────────────┐
│           VPC (Private Network)                 │
│  • Firestore (Encrypted at rest)                │
│  • Cloud SQL (Encrypted at rest)                │
│  • BigQuery (Column-level encryption)           │
│  • Cloud Storage (Customer-managed keys)        │
└─────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────┐
│         MONITORING & LOGGING                    │
│  • Cloud Monitoring                             │
│  • Cloud Logging                                │
│  • Security Command Center                      │
│  • Audit Logs (immutable)                       │
└─────────────────────────────────────────────────┘
```

---

### Autenticação (Multi-factor)

#### **Firebase Authentication**

```typescript
// Camadas de autenticação

// 1. Email/Password (básico)
const signUp = async (email: string, password: string) => {
  // Validações
  if (password.length < 12) {
    throw new Error('Senha deve ter pelo menos 12 caracteres');
  }
  
  if (!hasUpperCase(password) || !hasNumber(password) || !hasSpecialChar(password)) {
    throw new Error('Senha fraca');
  }
  
  // Criar usuário
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
  // Enviar verificação de email
  await sendEmailVerification(userCredential.user);
  
  return userCredential;
};

// 2. OAuth 2.0 (Google, Apple)
const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  provider.addScope('https://www.googleapis.com/auth/userinfo.email');
  provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
  
  return signInWithPopup(auth, provider);
};

// 3. 2FA (TOTP - Time-based One-Time Password)
const enable2FA = async (user: User) => {
  const secret = speakeasy.generateSecret({ length: 32 });
  
  // Armazenar secret (encrypted)
  await updateUserProfile(user.uid, {
    twofa_secret: encrypt(secret.base32),
    twofa_enabled: false  // Pending verification
  });
  
  // Gerar QR code para Google Authenticator
  const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);
  
  return { qrCodeUrl, backupCodes: generateBackupCodes() };
};

const verify2FA = async (user: User, token: string) => {
  const secret = decrypt(user.twofa_secret);
  
  const verified = speakeasy.totp.verify({
    secret: secret,
    encoding: 'base32',
    token: token,
    window: 2  // Allow 1 minute drift
  });
  
  if (verified) {
    await updateUserProfile(user.uid, { twofa_enabled: true });
  }
  
  return verified;
};
```

---

### Autorização (RBAC + ABAC)

#### **Role-Based Access Control (RBAC)**

```typescript
enum UserRole {
  STUDENT = 'student',
  RESIDENT = 'resident',
  SPECIALIST = 'specialist',
  PHD = 'phd',
  CURATOR = 'curator',
  ADMIN = 'admin',
  PARTNER = 'partner'  // Laboratórios
}

interface Permission {
  resource: string;      // 'disease', 'medication', 'calculator'
  action: string;        // 'read', 'write', 'delete', 'approve'
  conditions?: object;   // Condições adicionais (ABAC)
}

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  student: [
    { resource: 'disease', action: 'read', conditions: { layer: ['essentials'] } },
    { resource: 'calculator', action: 'read' },
    { resource: 'medication', action: 'read' },
    { resource: 'discussion', action: 'create' },
    { resource: 'edit_suggestion', action: 'create', conditions: { type: ['typo', 'mnemonic'] } }
  ],
  
  resident: [
    { resource: 'disease', action: 'read', conditions: { layer: ['essentials', 'specialist'] } },
    { resource: 'calculator', action: 'read' },
    { resource: 'medication', action: 'read' },
    { resource: 'discussion', action: 'create' },
    { resource: 'edit_suggestion', action: 'create', conditions: { type: ['typo', 'mnemonic', 'field_note'] } },
    { resource: 'quiz', action: 'create' }
  ],
  
  phd: [
    { resource: 'disease', action: 'read' },  // Todas as camadas
    { resource: 'calculator', action: 'read' },
    { resource: 'medication', action: 'read' },
    { resource: 'discussion', action: 'create' },
    { resource: 'edit_suggestion', action: 'create' },
    { resource: 'paper', action: 'submit' },
    { resource: 'citation', action: 'export' }
  ],
  
  curator: [
    { resource: '*', action: 'read' },
    { resource: 'disease', action: 'write' },
    { resource: 'medication', action: 'write' },
    { resource: 'edit_suggestion', action: 'approve' },
    { resource: 'discussion', action: 'moderate' }
  ],
  
  admin: [
    { resource: '*', action: '*' }
  ],
  
  partner: [
    { resource: 'medication', action: 'write', conditions: { own_products: true } },
    { resource: 'study', action: 'submit' },
    { resource: 'analytics', action: 'read', conditions: { own_data: true } }
  ]
};

// Middleware de autorização
const authorize = (requiredPermission: Permission) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;  // Do JWT
    
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const hasPermission = await checkPermission(user, requiredPermission);
    
    if (!hasPermission) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    next();
  };
};

// Exemplo de uso
app.post('/api/diseases/:id/edit', 
  authenticate,  // Verifica JWT
  authorize({ resource: 'disease', action: 'write' }),
  async (req, res) => {
    // Handler
  }
);
```

---

### Criptografia

#### **Encryption at Rest**

```yaml
# Firestore
- Automatic encryption at rest (AES-256)
- Google-managed keys (default)
- Customer-managed keys (CMEK) para dados sensíveis

# Cloud SQL
- Automatic encryption at rest (AES-256)
- Customer-managed keys (CMEK)
- Backup encryption

# Cloud Storage
- Server-side encryption (default)
- Customer-supplied keys (CSEK) para documentos de parceiros

# BigQuery
- Automatic encryption at rest
- Column-level encryption para PII
```

#### **Encryption in Transit**

```yaml
# TLS 1.3
- Todos os endpoints HTTPS obrigatório
- Certificate pinning em apps mobile
- Perfect Forward Secrecy (PFS)

# API Gateway
- Mutual TLS (mTLS) para parceiros B2B
- JWT encryption (JWE) para tokens sensíveis
```

#### **Application-level Encryption**

```typescript
// Criptografia de dados sensíveis antes de armazenar

import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');  // 32 bytes

function encrypt(plaintext: string): { ciphertext: string; iv: string; tag: string } {
  const iv = randomBytes(16);
  const cipher = createCipheriv(ALGORITHM, KEY, iv);
  
  let ciphertext = cipher.update(plaintext, 'utf8', 'hex');
  ciphertext += cipher.final('hex');
  
  const tag = cipher.getAuthTag();
  
  return {
    ciphertext,
    iv: iv.toString('hex'),
    tag: tag.toString('hex')
  };
}

function decrypt(ciphertext: string, iv: string, tag: string): string {
  const decipher = createDecipheriv(
    ALGORITHM, 
    KEY, 
    Buffer.from(iv, 'hex')
  );
  
  decipher.setAuthTag(Buffer.from(tag, 'hex'));
  
  let plaintext = decipher.update(ciphertext, 'hex', 'utf8');
  plaintext += decipher.final('utf8');
  
  return plaintext;
}

// Exemplo: Criptografar CRM do médico
const doctor = {
  name: 'Dr. João Silva',
  crm: '123456',
  state: 'SP'
};

const encryptedCRM = encrypt(doctor.crm);

await firestore.collection('users').doc(doctorId).set({
  name: doctor.name,  // Plain
  crm: encryptedCRM,  // Encrypted
  state: doctor.state
});
```

---

### Tokenização de Dados Sensíveis

```typescript
// Tokenizar dados médicos sensíveis

interface TokenizedData {
  token: string;        // UUID público
  original: string;     // Dado original (encrypted)
  type: string;         // 'crm', 'cpf', 'email'
  created_at: Timestamp;
  expires_at?: Timestamp;
}

async function tokenize(data: string, type: string): Promise<string> {
  const token = uuidv4();
  const encrypted = encrypt(data);
  
  await firestore.collection('tokens').doc(token).set({
    token,
    original: encrypted,
    type,
    created_at: Timestamp.now(),
    expires_at: null  // Nunca expira (a menos que deletado)
  });
  
  return token;
}

async function detokenize(token: string): Promise<string> {
  const doc = await firestore.collection('tokens').doc(token).get();
  
  if (!doc.exists) {
    throw new Error('Token inválido ou expirado');
  }
  
  const data = doc.data() as TokenizedData;
  
  if (data.expires_at && data.expires_at < Timestamp.now()) {
    throw new Error('Token expirado');
  }
  
  return decrypt(data.original.ciphertext, data.original.iv, data.original.tag);
}

// Uso: Armazenar CRM tokenizado
const crmToken = await tokenize(doctor.crm, 'crm');

await firestore.collection('users').doc(doctorId).set({
  name: doctor.name,
  crm_token: crmToken,  // Token público
  state: doctor.state
});

// Para verificar CRM (sem expor o número real)
const storedToken = user.crm_token;
const actualCRM = await detokenize(storedToken);
```

---

## 📜 Compliance LGPD

### Princípios da LGPD

1. **Finalidade:** Dados coletados apenas para propósitos legítimos
2. **Adequação:** Compatível com contexto de tratamento
3. **Necessidade:** Mínimo necessário
4. **Livre acesso:** Usuário pode consultar seus dados
5. **Qualidade:** Dados precisos e atualizados
6. **Transparência:** Informações claras sobre tratamento
7. **Segurança:** Proteção contra acessos não autorizados
8. **Prevenção:** Medidas para prevenir danos
9. **Não discriminação:** Sem tratamento discriminatório
10. **Responsabilização:** Demonstração de conformidade

---

### Mapeamento de Dados Pessoais

#### **Dados Pessoais Coletados**

```typescript
// Classificação LGPD

interface PersonalData {
  // DADOS PESSOAIS (Art. 5º, I)
  personal: {
    name: string;
    email: string;
    phone?: string;
    university: string;
    graduation_year: number;
  };
  
  // DADOS SENSÍVEIS (Art. 5º, II)
  sensitive: {
    crm?: string;              // Dado profissional sensível
    specialty?: string;
    health_data?: never;       // NÃO coletamos dados de saúde
    biometric_data?: never;    // NÃO coletamos biometria
  };
  
  // DADOS DE NAVEGAÇÃO
  behavioral: {
    pages_viewed: string[];
    search_queries: string[];
    materials_accessed: string[];
    quiz_attempts: object[];
  };
  
  // DADOS DE GEOLOCALIZAÇÃO (aproximada)
  location: {
    country: string;
    state: string;
    city?: string;
    // NÃO coletamos GPS preciso
  };
}
```

**IMPORTANTE:**
- ❌ **NÃO coletamos dados de pacientes**
- ❌ **NÃO coletamos prontuários reais**
- ✅ Apenas dados do próprio usuário (estudante/médico)
- ✅ Casos clínicos são fictícios e anônimos

---

### Bases Legais (Art. 7º LGPD)

```typescript
interface ConsentManagement {
  user_id: string;
  consents: Array<{
    purpose: string;           // "Analytics", "Marketing", "Research"
    legal_basis: string;       // "consent", "legitimate_interest", "contract"
    granted: boolean;
    granted_at?: Timestamp;
    revoked_at?: Timestamp;
    version: string;           // Versão do termo
  }>;
}

// Exemplo de consent granular
const consentPurposes = [
  {
    id: 'analytics',
    title: 'Analytics e Melhoria de Produto',
    description: 'Usamos seus dados de navegação para melhorar a experiência',
    legal_basis: 'legitimate_interest',
    required: true,  // Necessário para funcionamento básico
    can_revoke: false
  },
  {
    id: 'marketing',
    title: 'Comunicação de Marketing',
    description: 'Enviar novidades e promoções por email',
    legal_basis: 'consent',
    required: false,
    can_revoke: true
  },
  {
    id: 'research',
    title: 'Pesquisa Acadêmica (Anonimizada)',
    description: 'Dados agregados para estudos sobre educação médica',
    legal_basis: 'consent',
    required: false,
    can_revoke: true
  },
  {
    id: 'partner_data',
    title: 'Compartilhamento com Parceiros (Agregado)',
    description: 'Estatísticas anônimas para laboratórios parceiros',
    legal_basis: 'consent',
    required: false,
    can_revoke: true
  }
];
```

---

### Direitos do Titular (Art. 18)

```typescript
// Implementação dos direitos LGPD

// 1. Confirmação de Existência
app.get('/api/lgpd/data-exists', authenticate, async (req, res) => {
  const userId = req.user.uid;
  const exists = await checkUserDataExists(userId);
  res.json({ exists });
});

// 2. Acesso aos Dados
app.get('/api/lgpd/my-data', authenticate, async (req, res) => {
  const userId = req.user.uid;
  const data = await exportUserData(userId);
  
  res.json({
    personal_info: data.personal,
    progress: data.progress,
    contributions: data.contributions,
    consents: data.consents
  });
});

// 3. Correção de Dados
app.patch('/api/lgpd/correct-data', authenticate, async (req, res) => {
  const userId = req.user.uid;
  const { field, value } = req.body;
  
  await updateUserData(userId, { [field]: value });
  res.json({ success: true });
});

// 4. Anonimização
app.post('/api/lgpd/anonymize', authenticate, async (req, res) => {
  const userId = req.user.uid;
  
  // Anonimizar dados, mas manter contribuições (sem identificação)
  await anonymizeUser(userId);
  
  res.json({ success: true, message: 'Dados anonimizados' });
});

// 5. Eliminação (Direito ao Esquecimento)
app.delete('/api/lgpd/delete-account', authenticate, async (req, res) => {
  const userId = req.user.uid;
  
  // Soft delete (arquivar por 30 dias)
  await softDeleteUser(userId);
  
  // Agendar hard delete após 30 dias
  await scheduleHardDelete(userId, 30);
  
  res.json({ 
    success: true, 
    message: 'Conta deletada. Dados serão permanentemente removidos em 30 dias.' 
  });
});

// 6. Portabilidade
app.get('/api/lgpd/export-data', authenticate, async (req, res) => {
  const userId = req.user.uid;
  const format = req.query.format || 'json';  // json, csv, pdf
  
  const data = await exportUserData(userId);
  
  if (format === 'json') {
    res.json(data);
  } else if (format === 'csv') {
    const csv = convertToCSV(data);
    res.header('Content-Type', 'text/csv');
    res.attachment('my-medfocus-data.csv');
    res.send(csv);
  } else if (format === 'pdf') {
    const pdf = await generatePDF(data);
    res.header('Content-Type', 'application/pdf');
    res.attachment('my-medfocus-data.pdf');
    res.send(pdf);
  }
});

// 7. Revogação de Consentimento
app.post('/api/lgpd/revoke-consent', authenticate, async (req, res) => {
  const userId = req.user.uid;
  const { purpose } = req.body;  // 'marketing', 'research', etc.
  
  await revokeConsent(userId, purpose);
  
  res.json({ 
    success: true, 
    message: `Consentimento para ${purpose} revogado` 
  });
});

// 8. Oposição ao Tratamento
app.post('/api/lgpd/object-processing', authenticate, async (req, res) => {
  const userId = req.user.uid;
  const { processing_type } = req.body;
  
  await objectToProcessing(userId, processing_type);
  
  res.json({ success: true });
});
```

---

### Data Protection Officer (DPO)

```yaml
DPO (Encarregado):
  Nome: [A contratar]
  Email: dpo@medfocus.com.br
  Telefone: +55 11 XXXX-XXXX
  Endereço: [Endereço físico da empresa]
  
Responsabilidades:
  - Aceitar reclamações e comunicações de titulares
  - Prestar esclarecimentos sobre tratamento de dados
  - Receber comunicações da ANPD
  - Orientar equipe sobre práticas de proteção de dados
  - Realizar auditorias internas
  - Responder a incidentes de segurança
```

---

### Privacy Policy (Política de Privacidade)

**Disponível em:** https://medfocus.com.br/privacy

**Seções obrigatórias:**
1. Dados coletados
2. Finalidade do tratamento
3. Base legal
4. Compartilhamento com terceiros
5. Armazenamento e retenção
6. Direitos do titular
7. Segurança dos dados
8. Cookies e tecnologias similares
9. Transferência internacional
10. Alterações na política
11. Contato do DPO

---

### Cookie Consent Banner

```typescript
// Implementação de cookie consent

interface CookiePreferences {
  necessary: boolean;     // Sempre true (não pode desabilitar)
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
}

const CookieConsentBanner = () => {
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    personalization: false
  });
  
  const savePre preferences = async () => {
    await api.post('/api/lgpd/cookie-preferences', preferences);
    
    // Aplicar preferências
    if (preferences.analytics) {
      initGoogleAnalytics();
    }
    if (preferences.marketing) {
      initMetaPixel();
    }
    if (preferences.personalization) {
      enableRecommendations();
    }
  };
  
  return (
    <div className="cookie-banner">
      <h3>🍪 Usamos cookies</h3>
      <p>
        Respeitamos sua privacidade. Escolha quais cookies aceitar:
      </p>
      
      <label>
        <input type="checkbox" checked disabled />
        Necessários (obrigatórios para funcionamento)
      </label>
      
      <label>
        <input 
          type="checkbox" 
          checked={preferences.analytics}
          onChange={(e) => setPreferences({...preferences, analytics: e.target.checked})}
        />
        Analytics (Google Analytics)
      </label>
      
      <label>
        <input 
          type="checkbox" 
          checked={preferences.marketing}
          onChange={(e) => setPreferences({...preferences, marketing: e.target.checked})}
        />
        Marketing (Facebook Pixel, LinkedIn Insight)
      </label>
      
      <label>
        <input 
          type="checkbox" 
          checked={preferences.personalization}
          onChange={(e) => setPreferences({...preferences, personalization: e.target.checked})}
        />
        Personalização (Recomendações baseadas em IA)
      </label>
      
      <button onClick={savePreferences}>Salvar Preferências</button>
      <button onClick={() => setPreferences({...preferences, analytics: true, marketing: true, personalization: true})}>
        Aceitar Todos
      </button>
    </div>
  );
};
```

---

## 🏥 Compliance HIPAA (Opcional - Se expandir para EUA)

### HIPAA Safeguards

#### **Administrative Safeguards**
- Security management process
- Assigned security responsibility
- Workforce security
- Information access management
- Security awareness and training
- Security incident procedures
- Contingency plan
- Evaluation

#### **Physical Safeguards**
- Facility access controls
- Workstation use
- Workstation security
- Device and media controls

#### **Technical Safeguards**
- Access control (unique user IDs, emergency access)
- Audit controls (logging de acessos)
- Integrity (hash de dados)
- Person authentication (MFA)
- Transmission security (encryption)

---

## 🔒 Data Privacy by Design

### Minimização de Dados

```typescript
// Coletar apenas o necessário

// ❌ ERRADO: Coletar tudo
const badUserProfile = {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  address: string;
  birth_date: Date;
  mother_name: string;
  // ... 20 campos desnecessários
};

// ✅ CORRETO: Mínimo necessário
const goodUserProfile = {
  name: string;
  email: string;
  university: string;
  graduation_year: number;
  // Apenas isso é suficiente para estudantes
};
```

---

### Anonimização e Pseudonimização

```typescript
// Dados para analytics: sempre agregados e anônimos

interface AnalyticsEvent {
  event_type: string;
  // user_id: string;  // ❌ NUNCA enviar ID real
  user_id_hash: string;  // ✅ Hash do ID
  timestamp: Timestamp;
  properties: object;
}

function hashUserId(userId: string): string {
  return crypto.createHash('sha256').update(userId + SALT).digest('hex');
}

// Exemplo de relatório para laboratório (agregado)
interface PartnerReport {
  medication_name: string;
  views: number;                    // Total
  unique_users: number;             // Contagem (sem IDs)
  avg_time_on_page: number;
  by_specialty: Record<string, number>;  // Agregado
  by_year_of_study: Record<number, number>;
  
  // ❌ NÃO incluir:
  // user_ids: string[];
  // user_names: string[];
  // individual_timestamps: Timestamp[];
}
```

---

### Data Retention Policy

```typescript
// Política de retenção de dados

const RETENTION_POLICY = {
  user_profile: 'until_account_deletion',
  progress_data: 'until_account_deletion',
  contributions: 'anonymized_after_deletion',  // Mantém conteúdo, remove autor
  analytics_events: '365_days',
  audit_logs: '2555_days',  // 7 anos (requisito legal Brasil)
  partner_data: '1095_days',  // 3 anos
  deleted_accounts: '30_days_soft_delete'
};

// Cron job para limpeza automática
export async function cleanupExpiredData() {
  // 1. Deletar analytics antigos
  await bigquery
    .dataset('medfocus')
    .table('events')
    .delete({ where: `event_date < DATE_SUB(CURRENT_DATE(), INTERVAL 365 DAY)` });
  
  // 2. Hard delete de contas soft-deleted há 30+ dias
  const softDeletedUsers = await firestore
    .collection('users')
    .where('deleted_at', '<', Timestamp.fromDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)))
    .get();
  
  for (const doc of softDeletedUsers.docs) {
    await hardDeleteUser(doc.id);
  }
  
  // 3. Anonimizar contribuições de usuários deletados
  await anonymizeOrphanedContributions();
}

// Executar diariamente às 02:00
schedule.scheduleJob('0 2 * * *', cleanupExpiredData);
```

---

## 🚨 Incident Response Plan

### Níveis de Severidade

```typescript
enum IncidentSeverity {
  P0 = 'critical',      // Data breach, sistema down
  P1 = 'high',          // Vulnerability crítica, perda de dados parcial
  P2 = 'medium',        // Tentativa de ataque bloqueada, bug de segurança
  P3 = 'low'            // Falso positivo, issue menor
}
```

---

### Playbook de Resposta a Incidentes

#### **P0: Data Breach (Vazamento de Dados)**

```yaml
1. DETECÇÃO (0-15 min)
   - Alerta automático via Security Command Center
   - Equipe de segurança notificada (PagerDuty)
   - War room aberto (Slack #incident-response)

2. CONTENÇÃO (15-60 min)
   - Isolar sistema afetado
   - Revogar credenciais comprometidas
   - Bloquear IPs maliciosos
   - Preservar logs para investigação

3. AVALIAÇÃO (1-4 horas)
   - Quantos usuários afetados?
   - Quais dados foram expostos?
   - Como ocorreu o breach?
   - Atacante ainda tem acesso?

4. ERRADICAÇÃO (4-12 horas)
   - Fechar vulnerabilidade
   - Mudar todas as chaves/secrets
   - Atualizar firewall rules
   - Deploy de patches

5. RECUPERAÇÃO (12-24 horas)
   - Restaurar serviços
   - Validar integridade dos dados
   - Monitoramento intensivo

6. COMUNICAÇÃO (24-72 horas)
   - Notificar ANPD (72h legalmente)
   - Notificar usuários afetados (email)
   - Comunicado público (site + imprensa se grave)
   - Update para parceiros B2B

7. POST-MORTEM (7 dias)
   - Documento de lições aprendidas
   - Ações preventivas
   - Treinamento da equipe
```

---

### Comunicação de Breach (Template)

```
Assunto: Importante: Incidente de Segurança no MedFocus

Prezado(a) [Nome],

Identificamos um incidente de segurança no dia [DATA] que pode ter 
afetado seus dados pessoais.

O QUE ACONTECEU:
[Descrição técnica simplificada]

DADOS AFETADOS:
• Nome e email
• [Outros dados se aplicável]
• NÃO foram afetados: senhas (criptografadas), CRM, dados de saúde

O QUE ESTAMOS FAZENDO:
• Vulnerabilidade corrigida
• Reforço de segurança implementado
• Investigação em andamento com autoridades

O QUE VOCÊ DEVE FAZER:
• Alterar sua senha (obrigatório)
• Ativar autenticação de dois fatores
• Monitorar sua conta por atividades suspeitas

SUPORTE:
Email: security@medfocus.com.br
Telefone: 0800-XXX-XXXX (24/7)

Pedimos desculpas pelo ocorrido. Sua privacidade é nossa prioridade.

Atenciosamente,
Equipe MedFocus
```

---

## 🎖️ Auditorias e Certificações

### Auditorias Planejadas

```yaml
Auditoria Interna:
  Frequência: Trimestral
  Responsável: CISO
  Escopo: Todos os sistemas
  Entregável: Relatório de vulnerabilidades

Auditoria Externa:
  Frequência: Anual
  Auditor: Empresa certificada (ex: PWC, Deloitte)
  Escopo: Compliance LGPD + Segurança
  Entregável: Certificado de conformidade

Penetration Testing:
  Frequência: Semestral
  Empresa: Especializada em pentesting
  Metodologia: OWASP Top 10, NIST
  Entregável: Relatório de vulnerabilidades + remediação
```

---

### Certificações Alvo

**Ano 1:**
- ✅ ISO/IEC 27001 (Information Security Management)
- ✅ SOC 2 Type I (Security, Availability, Confidentiality)

**Ano 2:**
- ✅ SOC 2 Type II (audit de 6-12 meses)
- ✅ Certificação LGPD (se houver oficial da ANPD)

**Ano 3 (Se expandir para EUA):**
- ⚠️ HIPAA Compliance (se tratar PHI)
- ⚠️ HITRUST CSF Certification

---

## 👥 Políticas de Acesso

### Principle of Least Privilege

```yaml
Desenvolvedores:
  Produção: Read-only (logs, monitoring)
  Staging: Read-write
  Development: Full access
  
Suporte ao Cliente:
  User data: Read-only (masked PII)
  Logs: Read-only
  Actions: Apenas via scripts auditados
  
Security Team:
  Full access (com auditoria)
  
Parceiros (Labs):
  Apenas seus próprios dados (via API)
  Analytics agregados
```

---

### Access Review (Trimestral)

```typescript
// Script automatizado de auditoria de acessos

async function reviewAccessRights() {
  const users = await getAllIAMUsers();
  
  for (const user of users) {
    const lastLogin = await getLastLogin(user.id);
    const daysSinceLogin = (Date.now() - lastLogin) / (1000 * 60 * 60 * 24);
    
    // Revogar acesso se inativo por 90+ dias
    if (daysSinceLogin > 90) {
      await revokeAccess(user.id);
      await notifyManager(user.manager, `Acesso de ${user.name} revogado por inatividade`);
    }
    
    // Revisar acessos admin
    if (user.role === 'admin') {
      await requestManagerReview(user.manager, user.id);
    }
  }
}

// Executar trimestralmente
schedule.scheduleJob('0 0 1 */3 *', reviewAccessRights);
```

---

## 📊 Métricas de Segurança (Security KPIs)

```yaml
Vulnerabilidades:
  Critical: 0 (SLA: 24h para patch)
  High: < 5 (SLA: 7 dias)
  Medium: < 20 (SLA: 30 dias)
  Low: < 50 (SLA: 90 dias)

Incidentes:
  P0: 0/ano (meta)
  P1: < 2/ano
  P2: < 10/ano

Compliance:
  LGPD: 100% conforme
  Auditorias: Passing score > 95%

Uptime:
  Disponibilidade: 99.9% (SLA)
  MTTR (Mean Time to Recovery): < 1h

Treinamento:
  100% da equipe treinada em LGPD
  100% da equipe com Security Awareness
```

---

## 📞 Contatos de Segurança

```yaml
CISO (Chief Information Security Officer):
  Nome: [A contratar]
  Email: ciso@medfocus.com.br
  Emergência: +55 11 9XXXX-XXXX

DPO (Data Protection Officer):
  Nome: [A contratar]
  Email: dpo@medfocus.com.br
  Telefone: +55 11 XXXX-XXXX

Security Team:
  Email: security@medfocus.com.br
  PagerDuty: [On-call 24/7]

Bug Bounty:
  Platform: HackerOne
  Email: bugbounty@medfocus.com.br
  Reward: R$ 100 - R$ 10.000 (baseado em severidade)
```

---

**Documento preparado por:** Security Team MedFocus  
**Data:** Fevereiro 2026  
**Versão:** 4.0  
**Próxima Revisão:** Maio 2026  
**Classificação:** Confidencial - Internal Only

---

*Este documento é parte de uma série. Ver também:*
- [MEDFOCUS_PHD_TECHNICAL_SPEC.md](./MEDFOCUS_PHD_TECHNICAL_SPEC.md)
- [MEDFOCUS_PHD_PARTNERSHIPS.md](./MEDFOCUS_PHD_PARTNERSHIPS.md)
- [MEDFOCUS_ANALYSIS_GUIDE.md](./MEDFOCUS_ANALYSIS_GUIDE.md)
