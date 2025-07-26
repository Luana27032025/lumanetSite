"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"
import { isDemoMode } from "@/lib/supabase"

export function DemoBanner() {
  if (!isDemoMode) return null

  return (
    <Alert className="rounded-none border-x-0 border-t-0 bg-yellow-50 border-yellow-200">
      <Info className="h-4 w-4 text-yellow-600" />
      <AlertDescription className="text-yellow-800">
        <strong>Modo Demo:</strong> Os dados são salvos localmente e serão perdidos ao limpar o navegador. Para
        persistência real, configure as variáveis de ambiente do Supabase.
      </AlertDescription>
    </Alert>
  )
}
