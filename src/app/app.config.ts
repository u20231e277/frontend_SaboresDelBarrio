import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { LucideAngularModule, LayoutDashboard, ShoppingCart, Package, BarChart3, ChefHat, TrendingUp, TrendingDown, DollarSign, Activity, AlertCircle, CheckCircle2, Plus, Trash2, Save, BrainCircuit, PieChart, FileText, ArrowLeft, Pencil, X, AlertTriangle, Users, User, UserPlus, Mail, Lock, Check, CheckCircle, ArrowRight, LogOut, ShieldAlert } from 'lucide-angular';
import { authInterceptor } from './core/interceptors/auth.interceptor';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    importProvidersFrom(LucideAngularModule.pick({
      LayoutDashboard, ShoppingCart, Package, BarChart3, ChefHat,
      TrendingUp, TrendingDown, DollarSign, Activity,
      AlertCircle, CheckCircle2, Plus, Trash2, Save,
      BrainCircuit, PieChart, FileText,
      ArrowLeft, Pencil, X, AlertTriangle, Users, User, UserPlus, Mail, Lock, Check, CheckCircle, ArrowRight, LogOut, ShieldAlert
    }))
  ]
};
