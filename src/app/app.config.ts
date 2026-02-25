import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { LucideAngularModule, LayoutDashboard, ShoppingCart, Package, BarChart3, ChefHat, TrendingUp, TrendingDown, DollarSign, Activity, AlertCircle, CheckCircle2, Plus, Trash2, Save, BrainCircuit, PieChart, FileText, ArrowLeft, Pencil, X, AlertTriangle, Users, User, UserPlus, Mail, Lock, Check, CheckCircle, ArrowRight } from 'lucide-angular';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),
    importProvidersFrom(LucideAngularModule.pick({
      LayoutDashboard, ShoppingCart, Package, BarChart3, ChefHat,
      TrendingUp, TrendingDown, DollarSign, Activity,
      AlertCircle, CheckCircle2, Plus, Trash2, Save,
      BrainCircuit, PieChart, FileText,
      ArrowLeft, Pencil, X, AlertTriangle, Users, User, UserPlus, Mail, Lock, Check, CheckCircle, ArrowRight
    }))
  ]
};
