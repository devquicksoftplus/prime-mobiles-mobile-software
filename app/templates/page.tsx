'use client'

import { useState, useEffect } from 'react'
import { PageLayout } from '@/components/page-layout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Palette, Sparkles, Info, Lock, Crown } from 'lucide-react'
import { 
  getAllTemplates, 
  DEFAULT_TEMPLATE, 
  TemplateId, 
  TemplateInfo,
} from '@/features/invoice-templates'
import { toast } from 'sonner'
import { useSubscription } from '@/hooks/use-subscription'
import Link from 'next/link'

const STORAGE_KEY = 'selected-invoice-template'

export default function TemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>(DEFAULT_TEMPLATE)
  const [templates] = useState<TemplateInfo[]>(getAllTemplates())
  const { getMaxTemplates, isSubscribed, currentPlan } = useSubscription()

  const maxTemplates = getMaxTemplates()

  // Load saved template from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && templates.find(t => t.id === saved)) {
      setSelectedTemplate(saved as TemplateId)
    }
  }, [templates])

  const handleSelectTemplate = (id: TemplateId, index: number) => {
    // Check if template is locked
    if (index >= maxTemplates) {
      toast.error('Template locked', {
        description: `Upgrade your plan to unlock more templates. You have access to ${maxTemplates} templates.`
      })
      return
    }
    
    setSelectedTemplate(id)
    localStorage.setItem(STORAGE_KEY, id)
    toast.success('Template selected!', {
      description: `Your invoices will now use the "${templates.find(t => t.id === id)?.name}" template.`
    })
  }

  const getStyleBadgeColor = (style: TemplateInfo['style']) => {
    switch (style) {
      case 'modern': return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'classic': return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'minimal': return 'bg-slate-50 text-slate-700 border-slate-200'
      case 'bold': return 'bg-purple-50 text-purple-700 border-purple-200'
      case 'creative': return 'bg-pink-50 text-pink-700 border-pink-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const selectedTemplateData = templates.find(t => t.id === selectedTemplate)

  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto p-8 space-y-8">
          {/* Header Section */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20">
                    <Palette className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                      Invoice Templates
                    </h1>
                    <p className="text-sm text-slate-500 mt-0.5">
                      Professional designs for your business invoices
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-sm px-4 py-2 bg-white shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 mr-1.5 text-primary" />
                  {maxTemplates} of {templates.length} Templates
                </Badge>
                {currentPlan && (
                  <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                    <Crown className="w-3 h-3 mr-1" />
                    {currentPlan.name}
                  </Badge>
                )}
              </div>
            </div>

            {/* Current Selection Card */}
            {selectedTemplateData && (
              <Card className="overflow-hidden border-2 shadow-md">
                <div 
                  className="h-2"
                  style={{ 
                    background: `linear-gradient(90deg, ${selectedTemplateData.primaryColor}, ${selectedTemplateData.secondaryColor})`
                  }}
                />
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div 
                      className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg shrink-0"
                      style={{ backgroundColor: selectedTemplateData.primaryColor }}
                    >
                      <Check className="w-7 h-7 text-white" strokeWidth={3} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">
                        Active Template
                      </p>
                      <h3 className="text-xl font-bold text-slate-900 truncate">
                        {selectedTemplateData.name}
                      </h3>
                      <p className="text-sm text-slate-600 mt-1">
                        {selectedTemplateData.description}
                      </p>
                    </div>
                    <Badge className={`${getStyleBadgeColor(selectedTemplateData.style)} border shrink-0`}>
                      {selectedTemplateData.style}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Templates Grid */}
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-1">
                Available Templates
              </h2>
              <p className="text-sm text-slate-500">
                Click on any template to preview and select
                {maxTemplates < templates.length && (
                  <span className="text-amber-600 ml-1">
                    ({templates.length - maxTemplates} templates locked on your plan)
                  </span>
                )}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {templates.map((template, index) => {
                const isSelected = selectedTemplate === template.id
                const isLocked = index >= maxTemplates
                
                return (
                  <Card 
                    key={template.id}
                    className={`group overflow-hidden transition-all duration-300 cursor-pointer ${
                      isLocked 
                        ? 'opacity-60 hover:opacity-80' 
                        : isSelected 
                          ? 'ring-2 ring-primary ring-offset-2 shadow-lg' 
                          : 'hover:shadow-xl hover:-translate-y-1'
                    }`}
                    onClick={() => handleSelectTemplate(template.id as TemplateId, index)}
                  >
                    {/* Template Preview */}
                    <div 
                      className="h-48 relative overflow-hidden"
                      style={{
                        background: `linear-gradient(135deg, ${template.primaryColor} 0%, ${template.secondaryColor} 100%)`
                      }}
                    >
                      {/* Animated Background Pattern */}
                      <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0" style={{
                          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                          backgroundSize: '24px 24px'
                        }} />
                      </div>

                      {/* Mini Invoice Preview */}
                      <div className={`absolute inset-4 bg-white/98 backdrop-blur-sm rounded-xl shadow-2xl p-4 transform group-hover:scale-[1.02] transition-all duration-300 ${isLocked ? 'filter blur-[1px]' : ''}`}>
                        <div className="flex justify-between items-start mb-3">
                          <div className="w-10 h-10 rounded-lg shadow-md" style={{ backgroundColor: template.primaryColor }} />
                          <div className="text-right">
                            <div className="text-[10px] font-bold tracking-wide" style={{ color: template.primaryColor }}>
                              INVOICE
                            </div>
                            <div className="text-[7px] text-slate-400 mt-0.5">#INV-0001</div>
                          </div>
                        </div>
                        <div className="space-y-1.5 mb-3">
                          <div className="h-2 w-20 bg-slate-200 rounded-full" />
                          <div className="h-1.5 w-16 bg-slate-100 rounded-full" />
                          <div className="h-1.5 w-14 bg-slate-100 rounded-full" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <div className="h-1.5 w-16 bg-slate-100 rounded-full" />
                            <div className="h-1.5 w-10 bg-slate-200 rounded-full" />
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="h-1.5 w-12 bg-slate-100 rounded-full" />
                            <div className="h-1.5 w-8 bg-slate-200 rounded-full" />
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="h-1.5 w-14 bg-slate-100 rounded-full" />
                            <div className="h-1.5 w-9 bg-slate-200 rounded-full" />
                          </div>
                        </div>
                      </div>
                      
                      {/* Selected Indicator */}
                      {isSelected && (
                        <div className="absolute top-3 right-3 bg-white rounded-full p-1.5 shadow-lg ring-2 ring-primary/20">
                          <Check className="w-5 h-5 text-primary" strokeWidth={3} />
                        </div>
                      )}
                      
                      {/* Locked Indicator */}
                      {isLocked && (
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <div className="bg-white rounded-xl p-3 shadow-xl">
                            <Lock className="w-6 h-6 text-amber-600" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Template Info */}
                    <CardContent className="p-5 space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold text-slate-900 leading-tight">
                            {template.name}
                          </h3>
                          {isLocked ? (
                            <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-[10px]">
                              <Lock className="w-2.5 h-2.5 mr-1" />
                              Locked
                            </Badge>
                          ) : (
                            <Badge variant="outline" className={`text-[10px] shrink-0 ${getStyleBadgeColor(template.style)}`}>
                              {template.style}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                          {template.description}
                        </p>
                      </div>
                      
                      {isLocked ? (
                        <Link href="/subscription" className="block">
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="w-full h-9 text-sm font-medium border-amber-300 text-amber-700 hover:bg-amber-50"
                          >
                            <Crown className="w-3.5 h-3.5 mr-1.5" />
                            Upgrade to Unlock
                          </Button>
                        </Link>
                      ) : (
                        <Button 
                          size="sm" 
                          variant={isSelected ? "default" : "outline"}
                          className={`w-full h-9 text-sm font-medium transition-all ${
                            isSelected ? 'shadow-md' : ''
                          }`}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSelectTemplate(template.id as TemplateId, index)
                          }}
                        >
                          {isSelected ? (
                            <>
                              <Check className="w-4 h-4 mr-1.5" />
                              Active Template
                            </>
                          ) : (
                            'Select Template'
                          )}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Info Footer */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200/50">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                  <Info className="w-5 h-5 text-blue-600" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-slate-900 text-sm">
                    About Invoice Templates
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Your selected template will be automatically applied when generating invoices from job cards.
                    The template preference is saved locally on your device and will persist across sessions.
                    {maxTemplates < templates.length && (
                      <span className="block mt-2 text-amber-700">
                        <strong>Upgrade your plan</strong> to unlock all {templates.length} premium templates.
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  )
}

