/**
 * MedFocus — Componentes de UX Reutilizáveis
 * Sprint 54: Loading states, Error boundaries, Empty states
 * Padrões consistentes para toda a plataforma
 */
import React, { Component, type ReactNode } from 'react';

// ── Loading State ──────────────────────────────────────────────

interface LoadingStateProps {
  message?: string;
  variant?: 'spinner' | 'skeleton' | 'pulse' | 'medical';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingState({ message = 'Carregando...', variant = 'spinner', size = 'md', className = '' }: LoadingStateProps) {
  const sizeClasses = { sm: 'h-8 w-8', md: 'h-12 w-12', lg: 'h-16 w-16' };
  const textSizes = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' };

  if (variant === 'skeleton') {
    return (
      <div className={`space-y-4 animate-pulse ${className}`}>
        <div className="h-8 bg-muted rounded-lg w-3/4" />
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-5/6" />
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="h-24 bg-muted rounded-xl" />
          <div className="h-24 bg-muted rounded-xl" />
          <div className="h-24 bg-muted rounded-xl" />
        </div>
        <div className="h-4 bg-muted rounded w-2/3 mt-4" />
        <div className="h-4 bg-muted rounded w-4/5" />
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
        <div className="relative">
          <div className={`${sizeClasses[size]} rounded-full bg-primary/20 animate-ping absolute`} />
          <div className={`${sizeClasses[size]} rounded-full bg-primary/40 animate-pulse relative`} />
        </div>
        <p className={`${textSizes[size]} text-muted-foreground mt-4`}>{message}</p>
      </div>
    );
  }

  if (variant === 'medical') {
    return (
      <div className={`flex flex-col items-center justify-center py-16 ${className}`}>
        <div className="relative">
          <svg className={`${sizeClasses[size]} animate-spin text-primary`} viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg">🏥</span>
          </div>
        </div>
        <p className={`${textSizes[size]} text-muted-foreground mt-4 font-medium`}>{message}</p>
        <div className="flex gap-1 mt-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    );
  }

  // Default spinner
  return (
    <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-muted border-t-primary`} />
      <p className={`${textSizes[size]} text-muted-foreground mt-4`}>{message}</p>
    </div>
  );
}

// ── Empty State ────────────────────────────────────────────────

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  variant?: 'default' | 'search' | 'error' | 'success';
  className?: string;
}

export function EmptyState({ icon, title, description, action, variant = 'default', className = '' }: EmptyStateProps) {
  const defaultIcons = { default: '📭', search: '🔍', error: '⚠️', success: '✅' };
  const displayIcon = icon || defaultIcons[variant];

  return (
    <div className={`flex flex-col items-center justify-center py-16 text-center ${className}`}>
      <div className="text-5xl mb-4">{displayIcon}</div>
      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
      {description && <p className="text-sm text-muted-foreground max-w-md">{description}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-4 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

// ── Error State ────────────────────────────────────────────────

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  variant?: 'inline' | 'full' | 'toast';
  className?: string;
}

export function ErrorState({ title = 'Algo deu errado', message = 'Ocorreu um erro inesperado. Tente novamente.', onRetry, variant = 'full', className = '' }: ErrorStateProps) {
  if (variant === 'inline') {
    return (
      <div className={`flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl ${className}`}>
        <span className="text-red-400 text-xl">⚠️</span>
        <div className="flex-1">
          <p className="text-sm font-medium text-red-400">{title}</p>
          <p className="text-xs text-red-400/70">{message}</p>
        </div>
        {onRetry && (
          <button onClick={onRetry} className="px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-xs font-medium hover:bg-red-500/30 transition-colors">
            Tentar novamente
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center py-16 text-center ${className}`}>
      <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
        <span className="text-3xl">⚠️</span>
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-md mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          🔄 Tentar novamente
        </button>
      )}
      <p className="text-xs text-muted-foreground mt-4">
        Se o problema persistir, entre em contato com o suporte.
      </p>
    </div>
  );
}

// ── Module Error Boundary ──────────────────────────────────────

interface ModuleErrorBoundaryProps {
  children: ReactNode;
  moduleName?: string;
  onReset?: () => void;
}

interface ModuleErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ModuleErrorBoundary extends Component<ModuleErrorBoundaryProps, ModuleErrorBoundaryState> {
  constructor(props: ModuleErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ModuleErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`[MedFocus] Erro no módulo ${this.props.moduleName || 'desconhecido'}:`, error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center max-w-lg mx-auto">
          <div className="w-20 h-20 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6">
            <span className="text-4xl">🔧</span>
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">
            Erro no módulo {this.props.moduleName ? `"${this.props.moduleName}"` : ''}
          </h3>
          <p className="text-sm text-muted-foreground mb-2">
            Ocorreu um erro inesperado ao carregar este módulo. Nossa equipe foi notificada.
          </p>
          {this.state.error && (
            <details className="w-full mb-4">
              <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                Detalhes técnicos
              </summary>
              <pre className="mt-2 p-3 bg-muted rounded-lg text-xs text-left overflow-auto max-h-32">
                {this.state.error.message}
              </pre>
            </details>
          )}
          <div className="flex gap-3">
            <button
              onClick={this.handleReset}
              className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              🔄 Recarregar módulo
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-muted text-foreground rounded-lg font-medium hover:bg-accent transition-colors"
            >
              Recarregar página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// ── Progress Indicator ─────────────────────────────────────────

interface ProgressIndicatorProps {
  value: number; // 0-100
  label?: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
}

export function ProgressIndicator({ value, label, color = 'bg-primary', size = 'md', showPercentage = true }: ProgressIndicatorProps) {
  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-4' };
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-1">
          {label && <span className="text-xs text-muted-foreground">{label}</span>}
          {showPercentage && <span className="text-xs font-medium text-foreground">{Math.round(clampedValue)}%</span>}
        </div>
      )}
      <div className={`w-full ${heights[size]} bg-muted rounded-full overflow-hidden`}>
        <div
          className={`${heights[size]} ${color} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
}

// ── Status Badge ───────────────────────────────────────────────

interface StatusBadgeProps {
  status: 'online' | 'offline' | 'loading' | 'error' | 'warning' | 'success';
  label?: string;
  pulse?: boolean;
}

export function StatusBadge({ status, label, pulse = true }: StatusBadgeProps) {
  const config = {
    online: { color: 'bg-green-500', text: 'text-green-400', bg: 'bg-green-400/10', defaultLabel: 'Online' },
    offline: { color: 'bg-gray-500', text: 'text-gray-400', bg: 'bg-gray-400/10', defaultLabel: 'Offline' },
    loading: { color: 'bg-blue-500', text: 'text-blue-400', bg: 'bg-blue-400/10', defaultLabel: 'Carregando' },
    error: { color: 'bg-red-500', text: 'text-red-400', bg: 'bg-red-400/10', defaultLabel: 'Erro' },
    warning: { color: 'bg-yellow-500', text: 'text-yellow-400', bg: 'bg-yellow-400/10', defaultLabel: 'Atenção' },
    success: { color: 'bg-green-500', text: 'text-green-400', bg: 'bg-green-400/10', defaultLabel: 'Sucesso' },
  };

  const c = config[status];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${c.text} ${c.bg}`}>
      <span className="relative flex h-2 w-2">
        {pulse && (status === 'online' || status === 'loading') && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${c.color} opacity-75`} />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${c.color}`} />
      </span>
      {label || c.defaultLabel}
    </span>
  );
}

// ── Confirmation Dialog ────────────────────────────────────────

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ isOpen, title, message, confirmLabel = 'Confirmar', cancelLabel = 'Cancelar', variant = 'info', onConfirm, onCancel }: ConfirmDialogProps) {
  if (!isOpen) return null;

  const variantConfig = {
    danger: { icon: '⚠️', btnClass: 'bg-red-600 hover:bg-red-500' },
    warning: { icon: '⚡', btnClass: 'bg-yellow-600 hover:bg-yellow-500' },
    info: { icon: 'ℹ️', btnClass: 'bg-primary hover:bg-primary/90' },
  };

  const vc = variantConfig[variant];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onCancel}>
      <div className="bg-card border border-border rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">{vc.icon}</span>
          <h3 className="text-lg font-bold text-foreground">{title}</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-4 py-2 bg-muted text-foreground rounded-lg text-sm font-medium hover:bg-accent transition-colors">
            {cancelLabel}
          </button>
          <button onClick={onConfirm} className={`px-4 py-2 text-white rounded-lg text-sm font-medium transition-colors ${vc.btnClass}`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
