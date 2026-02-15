/**
 * Material Upload Component
 * Upload, validation, and metadata management for academic materials
 */

import React, { useState, useRef } from 'react';
import { AcademicMaterial, MaterialType, Semester } from '../../types';
import { MaterialsAPI } from '../../services/materialsApi';

interface MaterialUploadProps {
  onSuccess: (material: AcademicMaterial) => void;
  onCancel: () => void;
}

const UNIVERSITIES = [
  { id: 'usp', name: 'USP', state: 'SP' },
  { id: 'unicamp', name: 'UNICAMP', state: 'SP' },
  { id: 'ufrj', name: 'UFRJ', state: 'RJ' },
  { id: 'unifesp', name: 'UNIFESP', state: 'SP' },
  { id: 'ufmg', name: 'UFMG', state: 'MG' },
  { id: 'ufrgs', name: 'UFRGS', state: 'RS' },
  { id: 'ufba', name: 'UFBA', state: 'BA' },
  { id: 'ufpr', name: 'UFPR', state: 'PR' },
];

const SUBJECTS = [
  'Anatomia', 'Fisiologia', 'Bioquímica', 'Histologia', 'Embriologia',
  'Farmacologia', 'Patologia', 'Microbiologia', 'Imunologia', 'Parasitologia',
  'Genética', 'Saúde Pública', 'Epidemiologia', 'Bioética',
  'Semiologia', 'Clínica Médica', 'Cirurgia', 'Pediatria', 'Ginecologia',
  'Psiquiatria', 'Neurologia', 'Cardiologia', 'Pneumologia', 'Dermatologia'
];

const MATERIAL_TYPES: { value: MaterialType; label: string; accept: string }[] = [
  { value: 'apostila', label: 'Apostila', accept: '.pdf,.doc,.docx' },
  { value: 'artigo', label: 'Artigo Científico', accept: '.pdf' },
  { value: 'livro', label: 'Livro/Capítulo', accept: '.pdf,.epub' },
  { value: 'video', label: 'Videoaula', accept: '.mp4,.webm,.avi,.mov' },
  { value: 'slides', label: 'Slides', accept: '.pdf,.ppt,.pptx' },
  { value: 'exercicio', label: 'Lista de Exercícios', accept: '.pdf,.doc,.docx' },
  { value: 'prova', label: 'Prova Anterior', accept: '.pdf,.doc,.docx' },
  { value: 'resumo', label: 'Resumo', accept: '.pdf,.doc,.docx,.txt,.md' },
  { value: 'pesquisa', label: 'Trabalho de Pesquisa', accept: '.pdf,.doc,.docx' },
];

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

const MaterialUpload: React.FC<MaterialUploadProps> = ({ onSuccess, onCancel }) => {
  const [step, setStep] = useState<'file' | 'metadata' | 'preview'>('file');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [metadata, setMetadata] = useState({
    title: '',
    description: '',
    type: 'apostila' as MaterialType,
    universityId: '',
    universityName: '',
    course: 'Medicina',
    year: 1,
    semester: 1 as Semester,
    academicYear: new Date().getFullYear().toString(),
    subjectId: '',
    subjectName: '',
    module: '',
    professor: '',
    authors: [] as string[],
    tags: [] as string[],
    language: 'pt-BR',
  });

  const [tagInput, setTagInput] = useState('');
  const [authorInput, setAuthorInput] = useState('');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setError(`Arquivo muito grande. Tamanho máximo: ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
      return;
    }

    // Validate file type
    const selectedType = MATERIAL_TYPES.find(t => t.value === metadata.type);
    const acceptedExtensions = selectedType?.accept.split(',').map(ext => ext.trim());
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (acceptedExtensions && !acceptedExtensions.includes(fileExtension)) {
      setError(`Tipo de arquivo não suportado para ${selectedType?.label}`);
      return;
    }

    setSelectedFile(file);
    setError('');
    
    // Auto-fill title from filename
    if (!metadata.title) {
      const titleFromFile = file.name.replace(/\.[^/.]+$/, "");
      setMetadata(prev => ({ ...prev, title: titleFromFile }));
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      const input = fileInputRef.current;
      if (input) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;
        handleFileSelect({ target: input } as any);
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const addTag = () => {
    if (tagInput.trim() && !metadata.tags.includes(tagInput.trim())) {
      setMetadata(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setMetadata(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const addAuthor = () => {
    if (authorInput.trim() && !metadata.authors.includes(authorInput.trim())) {
      setMetadata(prev => ({
        ...prev,
        authors: [...prev.authors, authorInput.trim()]
      }));
      setAuthorInput('');
    }
  };

  const removeAuthor = (author: string) => {
    setMetadata(prev => ({
      ...prev,
      authors: prev.authors.filter(a => a !== author)
    }));
  };

  const handleUniversityChange = (universityId: string) => {
    const university = UNIVERSITIES.find(u => u.id === universityId);
    setMetadata(prev => ({
      ...prev,
      universityId,
      universityName: university?.name || ''
    }));
  };

  const handleSubjectChange = (subjectName: string) => {
    setMetadata(prev => ({
      ...prev,
      subjectId: subjectName.toLowerCase().replace(/\s+/g, '-'),
      subjectName
    }));
  };

  const validateMetadata = (): boolean => {
    if (!metadata.title.trim()) {
      setError('Título é obrigatório');
      return false;
    }
    if (!metadata.description.trim()) {
      setError('Descrição é obrigatória');
      return false;
    }
    if (!metadata.universityId) {
      setError('Selecione uma universidade');
      return false;
    }
    if (!metadata.subjectName) {
      setError('Selecione uma disciplina');
      return false;
    }
    return true;
  };

  const handleUpload = async () => {
    if (!selectedFile || !validateMetadata()) return;

    setIsUploading(true);
    setError('');

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Upload file and metadata
      const uploadedMaterial = await MaterialsAPI.uploadMaterial(selectedFile, {
        ...metadata,
        downloads: 0,
        views: 0,
        verified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      setTimeout(() => {
        onSuccess(uploadedMaterial);
      }, 500);
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer upload');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const renderFileStep = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">
          Tipo de Material
        </label>
        <select
          value={metadata.type}
          onChange={(e) => setMetadata(prev => ({ ...prev, type: e.target.value as MaterialType }))}
          className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
        >
          {MATERIAL_TYPES.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          accept={MATERIAL_TYPES.find(t => t.value === metadata.type)?.accept}
          className="hidden"
        />
        
        {selectedFile ? (
          <div>
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <p className="font-semibold text-foreground mb-1">{selectedFile.name}</p>
            <p className="text-sm text-muted-foreground">
              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFile(null);
              }}
              className="mt-4 text-sm text-destructive hover:underline"
            >
              Remover arquivo
            </button>
          </div>
        ) : (
          <div>
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
              </svg>
            </div>
            <p className="font-semibold text-foreground mb-1">Arraste o arquivo ou clique para selecionar</p>
            <p className="text-sm text-muted-foreground">
              Formatos aceitos: {MATERIAL_TYPES.find(t => t.value === metadata.type)?.accept}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Tamanho máximo: {MAX_FILE_SIZE / (1024 * 1024)}MB
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <div className="flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="px-6 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={() => selectedFile && setStep('metadata')}
          disabled={!selectedFile}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Continuar →
        </button>
      </div>
    </div>
  );

  const renderMetadataStep = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-foreground mb-2">
            Título *
          </label>
          <input
            type="text"
            value={metadata.title}
            onChange={(e) => setMetadata(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Ex: Anatomia Cardiovascular - Apostila Completa"
            className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-foreground mb-2">
            Descrição *
          </label>
          <textarea
            value={metadata.description}
            onChange={(e) => setMetadata(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Descreva o conteúdo do material..."
            rows={4}
            className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Universidade *
          </label>
          <select
            value={metadata.universityId}
            onChange={(e) => handleUniversityChange(e.target.value)}
            className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
          >
            <option value="">Selecione...</option>
            {UNIVERSITIES.map(uni => (
              <option key={uni.id} value={uni.id}>{uni.name} - {uni.state}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Disciplina *
          </label>
          <select
            value={metadata.subjectName}
            onChange={(e) => handleSubjectChange(e.target.value)}
            className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
          >
            <option value="">Selecione...</option>
            {SUBJECTS.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Ano
          </label>
          <select
            value={metadata.year}
            onChange={(e) => setMetadata(prev => ({ ...prev, year: Number(e.target.value) }))}
            className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
          >
            {[1, 2, 3, 4, 5, 6].map(y => (
              <option key={y} value={y}>{y}º Ano</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Semestre
          </label>
          <select
            value={metadata.semester}
            onChange={(e) => setMetadata(prev => ({ ...prev, semester: Number(e.target.value) as Semester }))}
            className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
          >
            <option value={1}>1º Semestre</option>
            <option value={2}>2º Semestre</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Módulo/Tópico
          </label>
          <input
            type="text"
            value={metadata.module}
            onChange={(e) => setMetadata(prev => ({ ...prev, module: e.target.value }))}
            placeholder="Ex: Sistema Cardiovascular"
            className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Professor
          </label>
          <input
            type="text"
            value={metadata.professor}
            onChange={(e) => setMetadata(prev => ({ ...prev, professor: e.target.value }))}
            placeholder="Nome do professor"
            className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-foreground mb-2">
            Autores
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={authorInput}
              onChange={(e) => setAuthorInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAuthor())}
              placeholder="Nome do autor"
              className="flex-1 px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
            <button
              onClick={addAuthor}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
            >
              Adicionar
            </button>
          </div>
          {metadata.authors.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {metadata.authors.map(author => (
                <span
                  key={author}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-2"
                >
                  {author}
                  <button
                    onClick={() => removeAuthor(author)}
                    className="hover:text-destructive"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-foreground mb-2">
            Tags
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              placeholder="Adicionar tag"
              className="flex-1 px-4 py-2 bg-muted border border-border rounded-lg text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
            />
            <button
              onClick={addTag}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
            >
              Adicionar
            </button>
          </div>
          {metadata.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {metadata.tags.map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-muted text-foreground rounded-full text-sm flex items-center gap-2"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="hover:text-destructive"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={() => setStep('file')}
          className="px-6 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
        >
          ← Voltar
        </button>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="px-6 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => validateMetadata() && setStep('preview')}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all"
          >
            Revisar →
          </button>
        </div>
      </div>
    </div>
  );

  const renderPreviewStep = () => (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-1">Arquivo</h3>
          <p className="text-foreground">{selectedFile?.name}</p>
          <p className="text-sm text-muted-foreground">
            {selectedFile && (selectedFile.size / (1024 * 1024)).toFixed(2)} MB
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-1">Título</h3>
          <p className="text-foreground">{metadata.title}</p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-1">Descrição</h3>
          <p className="text-foreground">{metadata.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-1">Universidade</h3>
            <p className="text-foreground">{metadata.universityName}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-1">Disciplina</h3>
            <p className="text-foreground">{metadata.subjectName}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-1">Ano/Semestre</h3>
            <p className="text-foreground">{metadata.year}º Ano - {metadata.semester}º Sem</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-1">Tipo</h3>
            <p className="text-foreground capitalize">{metadata.type}</p>
          </div>
        </div>

        {metadata.module && (
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-1">Módulo</h3>
            <p className="text-foreground">{metadata.module}</p>
          </div>
        )}

        {metadata.professor && (
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-1">Professor</h3>
            <p className="text-foreground">{metadata.professor}</p>
          </div>
        )}

        {metadata.authors.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-1">Autores</h3>
            <p className="text-foreground">{metadata.authors.join(', ')}</p>
          </div>
        )}

        {metadata.tags.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-1">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {metadata.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-muted text-foreground rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {isUploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-foreground font-medium">Fazendo upload...</span>
            <span className="text-primary font-semibold">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={() => setStep('metadata')}
          disabled={isUploading}
          className="px-6 py-2 border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
        >
          ← Editar
        </button>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isUploading}
            className="px-6 py-2 border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"/>
                </svg>
                Fazer Upload
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-background border border-border rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-background border-b border-border px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">Upload de Material</h2>
            <p className="text-sm text-muted-foreground">
              Etapa {step === 'file' ? '1' : step === 'metadata' ? '2' : '3'} de 3
            </p>
          </div>
          <button
            onClick={onCancel}
            disabled={isUploading}
            className="p-2 hover:bg-muted rounded-lg transition-colors disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="p-6">
          {step === 'file' && renderFileStep()}
          {step === 'metadata' && renderMetadataStep()}
          {step === 'preview' && renderPreviewStep()}
        </div>
      </div>
    </div>
  );
};

export default MaterialUpload;
